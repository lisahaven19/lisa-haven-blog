---
title: How to Create an AI Agent with Claude to Run Your Business (Step by Step)
category: Business Tips
emoji: 🤖
date: 2026-08-02T10:12:00.000-04:00
readTime: 10 min read
excerpt: The exact step by step system I use to run three companies with an AI
  agent that briefs me every morning before my daughters wake up. No code, no
  tech team, about 20 minutes to build.
image: /images/uploads/ai-agent-claude-cover.png
---
Every morning before my three daughters are awake, an AI agent I built inside Claude has already done my first hour of work for me. It reads what happened overnight across my three companies, checks my calendar, scans my inbox for the messages that actually need me, and hands me a short brief I can read with my coffee in five minutes.

I did not write a single line of code to build it. I did not hire a developer. I did not watch a 4 hour course. If you can write a clear text message, you can build this, and in this post I am going to walk you through exactly how to create an AI agent with Claude, step by step, using the same morning brief agent I use to operate [VIXA](https://www.vixaapp.ai), my dating clarity app for women, [Havenly](https://www.havenly.co), my Gen Z beauty brand built for global retail shelves, and [LUMAPROMPT.AI](https://www.lumaprompt.ai), my human authored prompt platform designed for women.

Grab your coffee. This is a full guide, and by the end of it you will know enough to build your first agent tonight.

## What Is an AI Agent, in Plain English

Let me clear up the buzzword first, because "AI agent" gets thrown around so much online that it has almost stopped meaning anything.

A chatbot answers questions when you ask them. An agent completes work without being asked. That is the entire difference, and it is a big one.

When you use AI the normal way, you are the engine. You open the chat, you think of the question, you type it, you read the answer, you follow up. The AI is smart, but everything still depends on you showing up and driving. An agent flips that. You give it a job once, you connect it to your tools once, you set a schedule once, and from that point on it runs on its own and reports back to you. You go from operating the AI to managing it.

That shift changed how I run my businesses. Instead of me chasing information every morning across email, calendars, project boards, and messages, the information now comes to me, already gathered, already organized, already prioritized. I start the day making decisions instead of hunting for the facts I need to make them.

## What My Morning Brief Agent Actually Does

Every weekday at 6:00 in the morning Eastern time, while I am at the gym, my agent runs on its own and delivers one brief that covers 4 things:

1. My calendar for the day, listed with times, with anything that needs preparation flagged, so a manufacturer call for Havenly never catches me unprepared
2. Overnight emails that need a decision or a reply from me, with the noise filtered out, so newsletters and promotions never touch my attention
3. Anything urgent or stalled across my three companies, from supplier messages for Havenly, to user feedback and reviews for VIXA, to content and writer updates for LUMAPROMPT.AI
4. One suggested top priority for the day, with the reason why, so I start every morning with my first decision already made

Notice what it does not do. It does not answer my emails for me. It does not post for me. It does not make decisions for me. It does one job, gathering and prioritizing, and it does that job extremely well. That focus is deliberate, and it is the first lesson of this entire guide.

## Step 1: Give Your Agent One Clear Job

The biggest mistake I see founders make with AI agents is trying to build one that does everything. An agent that monitors your inbox, writes your content, tracks your competitors, and manages your calendar sounds impressive, and it will do all 4 things badly. Vague scope produces vague output, every single time.

Pick one job. Write it down in one sentence before you touch any software. If you cannot describe the job in one sentence, you are describing two agents, not one.

Here are examples of well scoped agent jobs, any of which would make a great first build: a weekday morning brief like mine, a Friday afternoon summary of the week's sales numbers, a daily list of customer messages and reviews that need answers, a Monday morning roundup of what your top 3 competitors published or launched last week, or a nightly check that flags any invoice or payment that is overdue.

And here is a badly scoped one: "help me manage my business." That is not a job, that is a wish. Agents run on jobs.

![How to create an AI agent with Claude step 1: give your agent one clear job](/images/uploads/step1-one-clear-job.png)

My advice is to start with the morning brief. It touches your real daily operations, you get feedback on it every single day, and it teaches you the skill of writing instructions faster than any other agent because you review its work each morning.

## Step 2: Open Claude and Find Scheduled Tasks

Now the practical part. You will need a paid [Claude](https://claude.ai) plan for this. Scheduled tasks live inside Claude Cowork, the workspace where Claude can take on real work, and they are available on the paid plans, which are Pro, Max, Team, and Enterprise. The feature has been rolling out in stages, so if you do not see it yet, check the [official Claude help article on scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) for the current status.

Here is the path:

1. Open Claude on desktop and go into Cowork
2. Find Scheduled in the left sidebar
3. Click New task

From there you have two options, and I want you to understand both.

The first option is Create with Claude. Claude interviews you with a few multiple choice questions about what you want, proposes a task name, a schedule, and instructions, and you review and click Schedule to confirm. If this is your first agent, use this path. It is the fastest way to learn how these tasks are structured, because Claude essentially shows you what good setup looks like.

The second option is Set up manually. You fill in the task name, the instructions, the approval mode, the frequency, and optionally the model and folder. Once you have built one or two agents, you will probably prefer this path because you will know exactly what you want.

![How to find Scheduled tasks in Claude Cowork to create an AI agent](/images/uploads/step2-find-scheduled-tasks.png)

Here is the detail I love most, and the one that surprises people: these scheduled tasks run in the cloud, not on your machine. Your agent still fires on schedule when your laptop is closed, when you are on a flight, and when you are mid workout at 6:00 in the morning, which is exactly where I am when mine runs. You are not keeping a computer awake to have an assistant. The assistant simply works.

## Step 3: Connect Your Tools

An agent is only as useful as the information it can see, so this step decides whether your brief feels like a chief of staff or a fortune cookie.

In your Claude settings you can connect the tools your business already runs on. These connections are called connectors, and they let Claude securely read the accounts you approve, and only the accounts you approve. For a morning brief, connect these, in this order of importance:

1. Your calendar, because the agent cannot brief you on a day it cannot see
2. Your email, so it can surface the messages that need a decision from you and skip everything else
3. Your team or project tool, such as Slack or monday.com, so it catches what happened overnight and what stalled
4. Your cloud drive, such as Google Drive, if your key documents live there

![Connect your business tools to Claude with connectors when building an AI agent](/images/uploads/step3-connect-your-tools.png)

Two rules I follow on connections, and I want you to steal both. First, connect only what the agent's one job requires. My morning brief agent does not need access to my financial documents, so it does not have it. Second, start with your lower sensitivity sources, live with the agent for a couple of weeks, and expand access as you build trust in how it behaves. You stay in control of every permission, and you can disconnect anything at any time.

## Step 4: Write the Instructions Like You Are Training an Assistant

This is the step where the quality of your agent is truly decided, and it is the step most people rush. I am going to slow down here because this is the part I know best. Writing instructions that get consistently excellent output is the entire craft behind [LUMAPROMPT.AI](https://www.lumaprompt.ai), where my human expert writers author prompts professionally, so consider this section a free masterclass.

Here is the exact structure of my morning brief instructions. Copy it word for word and adjust it to your business:

> You are my morning operations briefer. Every weekday morning, do the following:
>
> 1. Check my calendar for today and list my meetings with times. Flag anything that needs preparation and say what the preparation is.
> 2. Review emails from the last 16 hours. Surface only the ones that need a decision or reply from me. Ignore newsletters, promotions, and anything my team can handle.
> 3. Check my project boards and team messages for anything marked urgent, anything that stalled, and anything a customer is waiting on.
> 4. End with one line: the single most important thing I should do first today, and why.
>
> Format the whole brief so I can read it in under five minutes. Use short sections with clear headers. Be direct. Do not pad it with pleasantries or repeat information I already know.

![Write clear instructions for your Claude AI agent like a job description](/images/uploads/step4-write-the-instructions.png)

Now let me show you why each part is there, because understanding the why is what lets you write your own.

Every strong set of agent instructions does 5 things. It assigns a role, because "you are my morning operations briefer" focuses the agent's judgment better than a bare list of tasks. It specifies what to include, naming each source explicitly rather than saying "check my stuff." It specifies what to exclude, and this is the one everybody skips: the "ignore newsletters and promotions" line is doing as much work as any other sentence, because without exclusions your brief drowns in noise. It defines the format, since "under five minutes, short sections, clear headers" is the difference between a scannable brief and a wall of text. And it demands a decision, because "the single most important thing and why" forces the agent to prioritize instead of just listing, and prioritization is the whole point.

Weak instructions read like "summarize my emails and calendar." Strong instructions read like a job description for a sharp human assistant. Write for the assistant.

## Step 5: Set the Schedule

Choose your frequency: hourly, daily, weekly, weekdays only, or manual. I run mine on weekdays at 6:00 in the morning because that is when I am at the gym and my brain is already planning the day.

![Set the schedule for your Claude AI agent, weekdays at 6:00 in the morning](/images/uploads/step5-set-the-schedule.png)

A tip from experience: schedule the brief for when you will actually read it, not for the earliest possible hour. A brief that lands at 5:00 and gets read at 9:00 is just noise you paid for, and worse, by 9:00 some of it is stale. Match the schedule to your real routine, not your fantasy routine.

And skip weekends unless your business truly runs 7 days. Protect at least one morning where nothing briefs you at all.

## Step 6: Test It, Then Sharpen It for Two Weeks

Run the task manually the first time, before the schedule ever fires, and read the result with a critical eye. Then refine it daily, the way you would coach a new assistant in their first two weeks:

1. If it included things you do not care about, add an exclusion line naming them
2. If it missed something important, name that source or topic explicitly in the instructions
3. If it ran long, give it a hard limit, such as 300 words maximum
4. If the priority suggestion felt generic, tell it what matters to you this quarter so it can weigh things the way you do

![Test and refine your Claude AI agent for two weeks like coaching a new assistant](/images/uploads/step6-test-and-refine.png)

My current morning brief is version 9. Version 1 was decent. Version 9 feels like a chief of staff who has worked with me for a year. The difference was two weeks of 2 minute edits, not any technical skill. This is the part nobody tells you: building the agent takes 20 minutes, and coaching it is what makes it great.

## What to Build Next, Once the Brief Is Running

Run your morning brief for a full month before adding anything, that is my honest advice. But when you are ready, these are the natural next builds, in the order I would do them: a weekly numbers agent that summarizes your sales and key metrics every Friday, a customer voice agent that digests reviews and support messages into themes once a week, and a competitor watch agent that reports what the brands in your space launched, posted, and changed every Monday. One job each. Always one job each.

## What This Actually Changes for You

I am a mother of 3 building three companies at the same time, and I do not have a spare hour every morning to hunt through six apps to find out what matters. My agent gives me that hour back every single day, and it gives me something more valuable than time. I start every day with clarity instead of chaos, and clarity compounds.

That is the same principle I built [VIXA](https://www.vixaapp.ai) on. Clarity is power. Whether it is your inbox or your dating life, the person with organized information makes better decisions than the person guessing.

## Common Questions

**Do I need to know how to code?** No. Everything in this guide happens in plain English inside the Claude interface. If you can write a clear paragraph, you are qualified.

**Which Claude plan do I need?** A paid plan: Pro, Max, Team, or Enterprise. Features roll out in stages, so check the [official Claude help article](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) for the latest.

**Is my business data safe?** You choose exactly which accounts to connect, the agent sees only what you approve, and you can revoke any access whenever you want. Start small and expand as you build trust.

**How long does this take to set up?** About 20 minutes for the first working version, then a few minutes of refinement a day for two weeks. That is the entire investment.

**Can I build more than one agent?** Yes, and eventually you should. But master one first. A single excellent agent beats five mediocre ones every time.

## Your Move

Building your first AI agent takes about 20 minutes tonight. The version of you 30 days from now, who starts every single morning with a clear brief instead of a chaotic inbox, will be very glad you spent them.

If you build one, tell me about it. I share what I am building every week here on [lisahaven.co](https://www.lisahaven.co) and on [LinkedIn](https://www.linkedin.com/in/lisahaven), and I answer at lisa@vixaapp.ai.

Now go build your first employee that never sleeps.
