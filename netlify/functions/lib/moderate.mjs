// Comment filter for lisahaven.co
// "block"  = never saved or shown (swearing, slurs, threats, sexual, spam links)
// "review" = held for Lisa to approve (insults, negativity, rude tone)
// "ok"     = shows right away

const BLOCK_WORDS = [
  'fuck','fck','fuk','shit','bitch','bitches','cunt','dick','dickhead','cock','pussy','asshole','arsehole','bastard',
  'motherfucker','whore','slut','skank','twat','wanker','prick','douche','douchebag','jackass','dumbass','bullshit',
  'porn','porno','nude','nudes','onlyfans','sex','sexy','horny','boobs','tits','penis','vagina','blowjob','handjob',
  'nigger','nigga','faggot','fag','retard','retarded','tranny','kike','spic','chink','wetback','dyke','beaner',
  'kys','rape','rapist','pedo','pedophile','nazi'
];
const BLOCK_PHRASES = [
  'kill yourself','kill urself','go die','hope you die','i will kill','ill kill you','i will find you','end your life',
  'unalive yourself','shoot you','slit','hang yourself'
];
const SPAM_PHRASES = [
  'crypto','bitcoin','forex','casino','betting','viagra','cialis','loan offer','work from home and earn','dm me on',
  'whatsapp me','telegram me','click here','check my profile','follow me','free followers','seo services','backlinks',
  'investment opportunity','earn $','make money fast','promo code'
];
const REVIEW_WORDS = [
  'stupid','idiot','idiotic','dumb','moron','ugly','fat','loser','fake','fraud','scam','scammer','liar','lying','lies',
  'trash','garbage','pathetic','disgusting','gross','cringe','cringey','clown','joke','worthless','useless','hate',
  'hater','delusional','narcissist','narcissistic','arrogant','shameless','sad','embarrassing','annoying','boring',
  'bimbo','plastic','botox','fillers','golddigger','attention','braggy','bragging','fraudulent','overrated','sucks',
  'awful','terrible','horrible','worst','lame','weird','creepy','shut','crap','damn','hell','wtf','stfu','smh','lmao',
  'ex','divorce','husband','custody','alimony'
];
const REVIEW_PHRASES = [
  'nobody cares','who cares','no one cares','gold digger','get a real job','get a life','you should be ashamed',
  'bad mother','bad mom','terrible mother','terrible mom','neglect','your kids','poor kids','spoiled','fake life',
  'fake it','ai wrote this','chatgpt wrote','written by ai','ai generated','not real','who asked','stay in your lane',
  'too much makeup','attention seeking','attention seeker','try hard','tryhard','touch grass','do better','be quiet'
];

const LEET = { '0':'o','1':'i','!':'i','3':'e','4':'a','@':'a','5':'s','$':'s','7':'t','8':'b','+':'t','|':'i' };

export function normalize(s) {
  let t = String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  t = t.replace(/[0-9!@$+|]/g, c => LEET[c] || c);
  t = t.replace(/(.)\1{2,}/g, '$1$1');          // "stuuuupid" -> "stuupid"
  return t;
}
const words = t => t.split(/[^a-z']+/).map(w => w.replace(/'/g, '')).filter(Boolean);
const squash = t => t.replace(/[^a-z]/g, '');   // "f u c k" / "f.u.c.k" -> "fuck"
const dedupe = w => w.replace(/(.)\1+/g, '$1');

function hasWord(list, ws) {
  const set = new Set(ws.concat(ws.map(dedupe)));
  return list.find(w => set.has(w) || set.has(dedupe(w)));
}
function hasPhrase(list, t) {
  const spaced = ' ' + words(t).join(' ') + ' ';
  return list.find(p => spaced.includes(' ' + p + ' ') || spaced.includes(' ' + p));
}

export function moderate(name, text) {
  const raw = String(name || '') + ' \n ' + String(text || '');
  const t = normalize(raw);
  const ws = words(t);
  const sq = squash(t);

  // Links and contact info are spam on a blog comment
  if (/(https?:\/\/|www\.|\.com\b|\.net\b|\.io\b|\.xyz\b|bit\.ly|t\.me\/)/i.test(raw)) return { action: 'block', reason: 'link' };
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(raw)) return { action: 'block', reason: 'email' };
  if (/(\+?\d[\d\s().-]{8,}\d)/.test(raw)) return { action: 'block', reason: 'phone' };

  let hit = hasWord(BLOCK_WORDS, ws) || hasPhrase(BLOCK_PHRASES, t);
  if (!hit) hit = ['fuck','shit','bitch','cunt','nigger','nigga','faggot','motherfucker','asshole','whore','slut','pussy'].find(w => sq.includes(w));
  if (hit) return { action: 'block', reason: 'language' };

  const spam = hasPhrase(SPAM_PHRASES, t);
  if (spam) return { action: 'block', reason: 'spam' };

  // Shouting: mostly capital letters in a long comment
  const letters = String(text || '').replace(/[^A-Za-z]/g, '');
  const caps = letters.replace(/[^A-Z]/g, '').length;
  if (letters.length > 20 && caps / letters.length > 0.7) return { action: 'review', reason: 'shouting' };

  const neg = hasWord(REVIEW_WORDS, ws) || hasPhrase(REVIEW_PHRASES, t);
  if (neg) return { action: 'review', reason: 'negative: ' + neg };

  return { action: 'ok', reason: '' };
}
