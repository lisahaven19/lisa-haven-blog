---
title: How to Create an AI Agent with Claude to Run Your Business (Step by Step)
category: Business Tips
emoji: 🤖
date: 2026-08-02T10:12:00.000-04:00
readTime: 10 min read
excerpt: The exact step by step system I use to run three companies with an AI
  agent that briefs me every morning before my daughters wake up. No code, no
  tech team, about 20 minutes to build.
image: /images/uploads/ai-agent-claude-cover-v2.png
---
Every morning, before my 3 daughters are awake, an AI agent I built inside Claude has already done my first hour of work. It reads what happened overnight across my 3 companies, checks my calendar, pulls out the emails that actually need me, and hands me a short brief I can get through in 5 minutes with my coffee. In this post I'm going to show you how to create an AI agent with Claude, the same way I built mine.

I didn't write a single line of code. I didn't hire a developer. I didn't sit through a 4 hour course. If you can write a clear text message, you can build this. I'll walk you through it step by step, using the exact morning brief agent I use to run [VIXA](https://www.vixaapp.ai), my dating clarity app for women, [Havenly](https://www.havenly.co), my Gen Z beauty brand built for global retail shelves, and [LUMAPROMPT.AI](https://www.lumaprompt.ai), my human authored prompt platform designed for women.

So grab your coffee. This is a full guide, and by the time you finish it you'll know enough to build your first agent tonight.

## What Is an AI Agent, in Plain English

Let me clear up the buzzword first. "AI agent" gets thrown around so much online that it has almost stopped meaning anything.

A chatbot answers your questions when you ask them. An agent gets work done without you asking. That's the whole difference, and it's a big one.

When you use AI the usual way, you're the engine. You open the chat, come up with the question, type it, read the answer, follow up. The AI is smart, but everything still depends on you showing up and driving. An agent turns that around. You give it a job once, connect it to your tools once, set a schedule once, and after that it runs by itself and reports back to you. You stop operating the AI and start managing it.

That change rewired how I run my businesses. I used to chase information every morning across email, calendars, project boards and messages. Now the information comes to me already gathered, organized and ranked by what matters. I start my day making decisions instead of hunting for the facts I need to make them.

## What My Morning Brief Agent Actually Does

Every weekday at 6:00 in the morning Eastern time, while I'm at the gym, my agent runs on its own and sends me one brief that covers 4 things:

1. My calendar for the day, with times, and anything that needs preparation flagged, so a manufacturer call for Havenly never catches me off guard
2. Overnight emails that need a decision or a reply from me, with the noise filtered out, so newsletters and promotions never get my attention
3. Anything urgent or stalled across my 3 companies, from supplier messages for Havenly, to user feedback and reviews for VIXA, to content and writer updates for LUMAPROMPT.AI
4. One suggested top priority for the day and the reason for it, so my first decision of the morning is already made

Now look at what it doesn't do. It doesn't answer my emails. It doesn't post for me. It doesn't make decisions for me. It does one job, gathering and prioritizing, and it does that job really well. I kept it that narrow on purpose, and that's the first lesson of this whole guide.

## Step 1: Give Your Agent One Clear Job

The biggest mistake I see founders make with AI agents is trying to build one that does everything. An agent that watches your inbox, writes your content, tracks your competitors and manages your calendar sounds impressive. It will also do all 4 of those things badly. Vague scope gives you vague output, every single time.

Pick one job. Write it down in one sentence before you open any software. If you can't describe it in one sentence, you're describing 2 agents.

Here are some well scoped jobs, and any of them would make a great first build: a weekday morning brief like mine, a Friday afternoon summary of the week's sales numbers, a daily list of customer messages and reviews that need answers, a Monday morning roundup of what your top 3 competitors published or launched last week, or a nightly check that flags any overdue invoice or payment.

And here's a badly scoped one: "help me manage my business." That's a wish. You can't hand a wish to an agent, you hand it a job.

![How to create an AI agent with Claude step 1: give your agent one clear job](/images/uploads/step1-one-clear-job.png)

My advice is to start with the morning brief. It touches your real daily operations, you see its work every single day, and because you're reviewing it each morning, it teaches you how to write good instructions faster than any other agent will.

## Step 2: Open Claude and Find Scheduled Tasks

Now for the hands-on part. You'll need a paid [Claude](https://claude.ai) plan. Scheduled tasks live inside Claude Cowork, the workspace where Claude can take on real work, and they're available on the paid plans: Pro, Max, Team and Enterprise. The feature has been rolling out in stages, so if you don't see it yet, check the [official Claude help article on scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) for where things stand.

Here's the path:

1. Open Claude on desktop and go into Cowork
2. Find Scheduled in the left sidebar
3. Click New task

From there you get 2 options, and I want you to understand both of them.

The first is Create with Claude. Claude asks you a few multiple choice questions about what you want, suggests a task name, a schedule and instructions, and you look it over and click Schedule to confirm. If this is your first agent, go this way. It's the quickest way to learn how these tasks are put together, because Claude is basically showing you what a good setup looks like.

The second is Set up manually. You fill in the task name, the instructions, the approval mode and the frequency, and you can also pick the model and folder if you want. After you've built 1 or 2 agents, you'll probably like this way better, because by then you'll know exactly what you want.

![How to find Scheduled tasks in Claude Cowork to create an AI agent](/images/uploads/step2-find-scheduled-tasks.png)

Here's the detail I love most, and it surprises a lot of people. These scheduled tasks run in the cloud, not on your computer. Your agent still fires on time when your laptop is closed, when you're on a flight, or when you're mid workout at 6:00 in the morning, which is exactly where I am when mine runs. You don't have to keep a computer awake to have an assistant. It just works.

## Step 3: Connect Your Tools

An agent is only as useful as what it can see. This step decides whether your brief feels like it came from a chief of staff or a fortune cookie.

In your Claude settings, you can connect the tools your business already runs on. These are called connectors, and they let Claude securely read the accounts you approve, and only those. For a morning brief, connect these, in this order of importance:

1. Your calendar, because the agent can't brief you on a day it can't see
2. Your email, so it can pull out the messages that need a decision from you and skip the rest
3. Your team or project tool, like Slack or monday.com, so it catches what happened overnight and what got stuck
4. Your cloud drive, like Google Drive, if your key documents live there

![Connect your business tools to Claude with connectors when building an AI agent](/images/uploads/step3-connect-your-tools.png)

I follow 2 rules on connections, and I want you to steal both. First, connect only what the agent's one job needs. My morning brief agent has no reason to see my financial documents, so it can't. Second, start with your less sensitive sources, live with the agent for a couple of weeks, and open up more access once you trust how it behaves. You control every permission, and you can disconnect anything whenever you want.

## Step 4: Write the Instructions Like You Are Training an Assistant

This is where the quality of your agent really gets decided, and it's the step most people rush. I'm going to slow down here, because this is the part I know best. Writing instructions that get excellent output again and again is the entire craft behind [LUMAPROMPT.AI](https://www.lumaprompt.ai), where my expert writers author prompts professionally. So think of this section as a free masterclass.

Here's the exact structure of my morning brief instructions. Copy it word for word, then adjust it for your business:

> You are my morning operations briefer. Every weekday morning, do the following:
>
> 1. Check my calendar for today and list my meetings with times. Flag anything that needs preparation and say what the preparation is.
> 2. Review emails from the last 16 hours. Surface only the ones that need a decision or reply from me. Ignore newsletters, promotions, and anything my team can handle.
> 3. Check my project boards and team messages for anything marked urgent, anything that stalled, and anything a customer is waiting on.
> 4. End with one line: the single most important thing I should do first today, and why.
>
> Format the whole brief so I can read it in under 5 minutes. Use short sections with clear headers. Be direct. Do not pad it with pleasantries or repeat information I already know.

![Write clear instructions for your Claude AI agent like a job description](/images/uploads/step4-write-the-instructions.png)

Now let me explain why each piece is in there, because once you understand the why, you can write your own.

Strong agent instructions do 5 things. They give the agent a role, because "you are my morning operations briefer" sharpens its judgment more than a bare list of tasks does. They spell out what to include, naming each source instead of saying "check my stuff." They spell out what to leave out, and this is the one everybody skips. That "ignore newsletters and promotions" line pulls as much weight as any other sentence in there, because without it your brief drowns in noise. They set the format, since "under 5 minutes, short sections, clear headers" is what separates a brief you can scan from a wall of text. And they ask for a decision. "The single most important thing and why" makes the agent prioritize instead of just listing, and prioritizing is the whole reason you built it.

Weak instructions sound like "summarize my emails and calendar." Strong instructions sound like a job description for a sharp human assistant. Write them for that assistant.

## Step 5: Set the Schedule

Pick your frequency: hourly, daily, weekly, weekdays only, or manual. I run mine on weekdays at 6:00 in the morning, because that's when I'm at the gym and my brain is already planning the day.

![Set the schedule for your Claude AI agent, weekdays at 6:00 in the morning](/images/uploads/step5-set-the-schedule.png)

A tip from experience: schedule the brief for when you'll actually read it, not the earliest hour possible. A brief that lands at 5:00 and gets opened at 9:00 is just noise you paid for, and by 9:00 some of it is already out of date. Be honest about your real routine and set it for that.

And skip weekends unless your business really runs 7 days a week. Keep at least one morning where nothing briefs you at all.

## Step 6: Test It, Then Sharpen It for Two Weeks

Run the task manually the first time, before the schedule ever kicks in, and read the result with a critical eye. Then fine-tune it every day for 2 weeks, the way you'd coach a new assistant in their first 2 weeks on the job:

1. If it included things you don't care about, add a line telling it to leave them out
2. If it missed something important, name that source or topic directly in the instructions
3. If it ran long, give it a hard limit, like 300 words maximum
4. If the priority suggestion felt generic, tell it what matters to you this quarter so it can weigh things the way you would

![Test and refine your Claude AI agent for two weeks like coaching a new assistant](/images/uploads/step6-test-and-refine.png)

My morning brief is on version 9 right now. Version 1 was decent. Version 9 feels like a chief of staff who's been with me for a year. What got it there was 2 weeks of 2 minute edits, not technical skill. Nobody tells you this part: building the agent takes about 20 minutes, and the coaching afterward is what makes it great.

## What to Build Next, Once the Brief Is Running

My honest advice is to run your morning brief for a full month before you add anything. When you're ready, here are the natural next builds, in the order I'd do them: a weekly numbers agent that sums up your sales and key metrics every Friday, a customer voice agent that turns reviews and support messages into themes once a week, and a competitor watch agent that tells you every Monday what the brands in your space launched, posted and changed. One job each. Always one job each.

## What This Actually Changes for You

I'm a mother of 3 building 3 companies at once, and I don't have a spare hour every morning to dig through 6 apps to figure out what matters. My agent hands me that hour back every day. It also gives me something worth more than time. I start each day with clarity instead of chaos, and clarity builds on itself.

That's the same principle I built [VIXA](https://www.vixaapp.ai) on. Clarity is power. Whether it's your inbox or your dating life, the woman with organized information makes better decisions than the one who's guessing.

## Common Questions

**Do I need to know how to code?** No. Everything in this guide happens in plain English inside Claude. If you can write a clear paragraph, you're qualified.

**Which Claude plan do I need?** A paid plan: Pro, Max, Team or Enterprise. Features roll out in stages, so check the [official Claude help article](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) for the latest.

**Is my business data safe?** You choose exactly which accounts to connect, the agent only sees what you approve, and you can take away any access whenever you want. Start small and expand as you build trust.

**How long does this take to set up?** About 20 minutes for the first working version, then a few minutes of fine-tuning a day for 2 weeks. That's the whole investment.

**Can I build more than one agent?** Yes, and eventually you should. Get one really good first, though. One excellent agent beats 5 mediocre ones every time.

## Your Move

Your first AI agent takes about 20 minutes to build tonight. The you of 30 days from now, starting every morning with a clear brief instead of a messy inbox, is going to be very glad you spent them.

If you build one, tell me about it. I share what I'm building every week here on [lisahaven.co](https://www.lisahaven.co) and on [LinkedIn](https://www.linkedin.com/in/lisahaven), and I answer at lisa@vixaapp.ai.

Now go build your first employee who never sleeps.

> "This thing is too heavy for thee; thou art not able to perform it thyself alone."
>
> ~ Exodus 18:18
