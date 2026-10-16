import type { Floor } from '../types';

export const floor1: Floor = {
  id: 1,
  title: "Orientation",
  tagline: "Learn what the job really is, how analysts think, and get your toolkit ready.",
  color: "#38bdf8",
  icon: "🧭",
  outcomes: [
    "Describe what a data analyst does on a typical day and who they work with",
    "Walk through the six phases of an analysis: ask, prepare, process, analyze, share, act",
    "Tell structured from unstructured data and quantitative from qualitative data",
    "Explain which tool (spreadsheets, SQL, BI, Python) fits which job",
    "Set up free accounts for every tool you'll use on this ladder",
  ],
  steps: [
    {
      id: "f1-s1",
      title: "What a Data Analyst Actually Does",
      minutes: 10,
      xp: 50,
      skills: ["orientation", "career"],
      lesson: [
        {
          heading: "The one-sentence job description",
          body: `A data analyst **turns raw data into answers that help people make better decisions**.

That's it. Not magic, not rocket science. Somebody in the business has a question ("Why did sales drop in March?"), and you find, clean, and study the data that answers it, then explain the answer clearly.

You are part detective, part translator: you dig through numbers, then translate what you found into plain language a manager can act on.`,
        },
        {
          heading: "A realistic day",
          body: `Here's what a Tuesday might look like for an analyst at an online shop:

- **9:00** Check the daily sales dashboard. Yesterday's orders look 20% low. Note it.
- **9:30** Stand-up meeting with the marketing team. They ask: "Did last week's email campaign bring in new customers?"
- **10:00** Write a SQL query to pull orders from customers who clicked the email.
- **11:30** Discover half the rows have a blank \`campaign_id\`. Spend an hour figuring out why (a tracking bug) and cleaning around it.
- **14:00** Summarise results in a spreadsheet and build two simple charts.
- **16:00** Send a short write-up: "The campaign brought ~340 new customers; cost per new customer was $4.10, cheaper than paid ads."

Notice how much time goes to **cleaning and communicating**, not just calculating. That's normal.`,
          tip: "Many analysts say 50-70% of their time is spent getting data ready. If you enjoy tidying messy things, you'll do well.",
        },
        {
          heading: "Who you work with",
          body: `Analysts sit in the middle of a business. You'll regularly talk to:

- **Stakeholders**: the people asking questions (marketing, sales, finance, operations, product managers).
- **Data engineers**: they build the pipelines and databases you pull data from.
- **Other analysts and data scientists**: they review your work and share code.

A **stakeholder** is simply anyone who has an interest in the result of your work. Learning to understand what they *really* need is one of the most valuable skills you'll build.`,
        },
        {
          heading: "Analyst vs. scientist vs. engineer",
          body: `These titles get mixed up a lot. A rough guide:

- **Data analyst**: answers business questions about what happened and why. Tools: spreadsheets, SQL, BI dashboards, some Python.
- **Data scientist**: builds predictive models (what will happen?). More maths, statistics, and machine learning.
- **Data engineer**: builds and maintains the plumbing that moves and stores data.

Analyst is the most common entry point, and many people later move into science or engineering from there.`,
        },
      ],
      quiz: [
        {
          q: "Which statement best describes the core of a data analyst's job?",
          options: [
            "Building machine learning models that predict the future",
            "Turning raw data into answers that help people make decisions",
            "Designing the databases a company stores its data in",
            "Fixing computers and networks for the office",
          ],
          answer: 1,
          explain: "Analysts focus on answering business questions with data. Predictive models are more data science; database plumbing is data engineering; IT support is a different job entirely.",
        },
        {
          q: "In the example day, what took a surprising amount of time?",
          options: [
            "Choosing chart colours",
            "Waiting for the computer to calculate",
            "Investigating and cleaning blank values in the data",
            "Writing code in a brand-new language",
          ],
          answer: 2,
          explain: "Cleaning and understanding messy data is a huge part of real analyst work, often more than the analysis itself.",
        },
        {
          q: "A marketing manager asks you whether a campaign worked. In analyst terms, the manager is a...",
          options: ["Data engineer", "Stakeholder", "Database", "Data scientist"],
          answer: 1,
          explain: "A stakeholder is anyone with an interest in your work's outcome, usually the person asking the question.",
        },
        {
          q: "Which role is mainly responsible for building pipelines that move data into databases?",
          options: ["Data analyst", "Data engineer", "Marketing manager", "Data visualiser"],
          answer: 1,
          explain: "Data engineers build and maintain the infrastructure; analysts use that data to answer questions.",
        },
      ],
    },
    {
      id: "f1-s2",
      title: "The Analysis Process: Ask to Act",
      minutes: 14,
      xp: 75,
      skills: ["orientation", "business"],
      lesson: [
        {
          heading: "Six phases, one loop",
          body: `Almost every analysis, big or small, follows the same six phases:

- **Ask**: define the question and what a useful answer looks like.
- **Prepare**: find and collect the data you need.
- **Process**: clean it so it can be trusted.
- **Analyze**: look for patterns, calculate, compare.
- **Share**: communicate findings with charts and plain language.
- **Act**: the business makes a decision based on what you found.

It's a loop: acting on results usually raises new questions, and you start again.`,
        },
        {
          heading: "Ask: the most underrated phase",
          body: `A vague question produces a vague answer. Your first job is to turn a fuzzy request into a **specific, measurable question**.

Fuzzy: "Are customers happy?"

Specific: "Did the average satisfaction score for customers who contacted support drop between Q1 and Q2 this year, and if so, in which product line?"

Good clarifying questions to ask a stakeholder:

- What decision will this answer help you make?
- What time period and which customers/products matter?
- How will we know if the answer is "good" or "bad"?
- When do you need it, and in what form?`,
          tip: "Always ask \"What will you do differently depending on the answer?\" If nothing changes, the analysis may not be worth doing.",
        },
        {
          heading: "Prepare and Process",
          body: `**Prepare** means figuring out where the data lives and getting access: a sales database, a CSV export from a tool, a survey spreadsheet.

**Process** means cleaning it: removing duplicates, fixing typos ("NY", "New York", "new york"), handling blanks, making sure dates are actually dates.

Skipping this step is how analysts end up confidently presenting wrong numbers.`,
        },
        {
          heading: "Analyze, Share, Act: a worked example",
          body: `A coffee chain asks: "Should we keep the new oat-milk latte?"

- **Analyze**: you compare weekly sales of the oat latte against other new drinks, and check whether it brought in new customers or just replaced existing orders.
- **Share**: one slide: "The oat latte sells 1,200 cups/week (top 3 of new drinks). 35% of buyers are new customers. Recommendation: keep it."
- **Act**: management keeps the drink and adds it to the autumn menu.

Notice the share step ends with a **recommendation**, not just numbers.`,
          example: `ASK      -> Should we keep the oat-milk latte?
PREPARE  -> Pull 12 weeks of point-of-sale data
PROCESS  -> Remove test transactions, fix drink names
ANALYZE  -> Weekly sales, % new customers, comparison
SHARE    -> 1 slide + recommendation
ACT      -> Keep it, review again in 3 months`,
          exampleLang: "text",
        },
      ],
      game: { kind: "stakeholder-says", stage: 0 },
      quiz: [
        {
          q: "What is the correct order of the analysis phases?",
          options: [
            "Prepare, Ask, Analyze, Process, Share, Act",
            "Ask, Prepare, Process, Analyze, Share, Act",
            "Ask, Analyze, Prepare, Process, Act, Share",
            "Process, Prepare, Ask, Analyze, Share, Act",
          ],
          answer: 1,
          explain: "You define the question, get the data, clean it, analyze it, communicate it, then the business acts.",
        },
        {
          q: "Removing duplicate rows and standardising \"NY\" vs \"New York\" belongs to which phase?",
          options: ["Ask", "Share", "Process", "Act"],
          answer: 2,
          explain: "Process is the cleaning phase: making the data accurate and consistent before analysis.",
        },
        {
          q: "Which of these is the best-defined analysis question?",
          options: [
            "How is the business doing?",
            "Are our customers happy?",
            "Did online orders in Germany fall more than 10% from August to September?",
            "What does the data say?",
          ],
          answer: 2,
          explain: "It names a metric, a place, a time period, and a threshold. The others are too vague to answer clearly.",
        },
        {
          q: "A stakeholder asks for \"a report on sales\". What's the most useful first response?",
          options: [
            "Immediately export every sales record you can find",
            "Ask what decision the report will support and which time period matters",
            "Build a dashboard with 30 charts so everything is covered",
            "Tell them the data is too messy",
          ],
          answer: 1,
          explain: "Clarifying the decision and scope in the Ask phase saves hours of wasted work later.",
        },
      ],
    },
    {
      id: "f1-s3",
      title: "Types of Data and the Tools Landscape",
      minutes: 12,
      xp: 60,
      skills: ["orientation"],
      lesson: [
        {
          heading: "Quantitative vs. qualitative",
          body: `**Quantitative** data is numbers you can measure or count: price, age, number of orders, minutes on site.

**Qualitative** data describes qualities or categories: product colour, customer comment, country, satisfaction level ("happy", "neutral").

Quantitative data splits further:

- **Discrete**: whole counts. You can't buy 2.5 tickets.
- **Continuous**: can take any value in a range: height, temperature, revenue.`,
        },
        {
          heading: "Structured vs. unstructured",
          body: `**Structured** data fits neatly into rows and columns, like a spreadsheet or database table. Each column has one kind of value.

**Unstructured** data doesn't: emails, PDFs, images, call recordings, social media posts.

Most entry-level analyst work uses structured data. You'll sometimes turn unstructured data into structured data, for example tagging 500 support emails as "billing", "delivery", or "bug".`,
          example: `order_id | customer | country | amount | order_date
1001     | Aisha    | UK      | 42.50  | 2025-03-01
1002     | Marco    | IT      | 18.00  | 2025-03-01
1003     | Aisha    | UK      | 99.99  | 2025-03-04`,
          exampleLang: "text",
          tip: "Each row is one record (one order). Each column is one field (one attribute of that order).",
        },
        {
          heading: "Your toolbox at a glance",
          body: `Analysts use a handful of tools, each good at different jobs:

- **Spreadsheets** (Excel, Google Sheets): fast, visual, great for small-to-medium data and quick checks.
- **SQL**: the language for asking questions of databases. Handles millions of rows easily. Almost every analyst job lists it.
- **BI tools** (Power BI, Tableau, Looker): build interactive dashboards that update automatically.
- **Python or R**: programming for heavier cleaning, automation, and statistics.

You don't pick one. A typical workflow: pull data with SQL, sanity-check in a spreadsheet, publish a dashboard in Power BI.`,
        },
        {
          heading: "Which tool when?",
          body: `Some quick rules of thumb:

- Under ~100,000 rows and a one-off question? **Spreadsheet**.
- Data already in a company database? **SQL** first.
- People will look at the same numbers every week? **BI dashboard**.
- Repeating the same messy cleaning every month, or need advanced stats? **Python**.

On this ladder you'll learn them roughly in that order, because each builds on the last.`,
        },
      ],
      quiz: [
        {
          q: "A column of customer ratings like \"happy\", \"neutral\", \"unhappy\" is...",
          options: ["Quantitative continuous", "Quantitative discrete", "Qualitative", "Unstructured"],
          answer: 2,
          explain: "These are categories describing a quality, not measured numbers, so the data is qualitative.",
        },
        {
          q: "Which is an example of continuous data?",
          options: ["Number of children", "Delivery time in minutes", "Country of birth", "Number of support tickets"],
          answer: 1,
          explain: "Time can take any value (12.4 minutes, 12.41...). Counts like children or tickets are discrete.",
        },
        {
          q: "A folder of 2,000 customer complaint emails is best described as...",
          options: ["Structured data", "Unstructured data", "A database table", "Discrete data"],
          answer: 1,
          explain: "Free-text emails don't fit naturally into rows and columns, so they're unstructured.",
        },
        {
          q: "Your manager wants the same sales numbers refreshed and viewed every Monday. The best tool is probably...",
          options: ["A new spreadsheet each week", "A BI dashboard", "A printed report", "A Python notebook emailed weekly"],
          answer: 1,
          explain: "Recurring, shared views of the same metrics are exactly what BI dashboards are built for.",
        },
      ],
    },
    {
      id: "f1-s4",
      title: "The Career-Changer Mindset and Study Plan",
      minutes: 10,
      xp: 50,
      skills: ["career"],
      lesson: [
        {
          heading: "Your past experience is an asset",
          body: `Career changers often think they're starting from zero. You're not.

- A **teacher** knows how to explain complex ideas simply: that's the Share phase.
- A **retail manager** understands sales, stock, and staffing: that's domain knowledge.
- A **nurse** is used to careful record-keeping and spotting abnormal readings: that's data quality and outlier detection.

Employers hire analysts who understand the business. Plan to target roles in an industry you already know.`,
        },
        {
          heading: "What \"job-ready\" really means",
          body: `For most entry-level analyst roles, you need to show you can:

- Clean and summarise data in a **spreadsheet** (lookups, pivot tables, charts).
- Write **SQL** queries with filters, grouping, and joins.
- Build a clear **dashboard** in Power BI or Tableau.
- Explain basic **statistics** without hand-waving.
- **Communicate** findings with a recommendation.
- Show 2-4 **portfolio projects** that prove all of the above.

Python is a strong bonus, increasingly expected, but usually not the first filter.`,
        },
        {
          heading: "A sustainable study plan",
          body: `Consistency beats intensity. A realistic plan for someone with a full-time job:

- **5 sessions a week, 45-60 minutes each.** Short and regular builds memory far better than one 6-hour Sunday.
- **Learn, then do.** After every lesson, try the skill on a real dataset immediately.
- **Build in public.** Keep your practice files in a folder you can later turn into portfolio projects.
- **Review weekly.** Spend 15 minutes each Friday redoing quiz questions you got wrong.

At this pace, most people reach job-ready in roughly 6-9 months.`,
          tip: "Put your study sessions in your calendar like meetings. Protected time is the strongest predictor of finishing.",
        },
        {
          heading: "Expect to feel stuck (it's part of it)",
          body: `You will hit formulas that won't work and queries that return nothing. That is not a sign you're bad at this; it's literally what the job feels like.

When stuck:

- Read the error message slowly. It usually tells you the problem.
- Shrink the problem: test on 5 rows instead of 5,000.
- Explain it out loud (to a friend, a rubber duck, or an AI assistant).
- Take a 10-minute walk. Seriously.`,
        },
      ],
      quiz: [
        {
          q: "Which study pattern is most likely to build lasting skills?",
          options: [
            "One 8-hour session every other weekend",
            "Short, regular sessions with hands-on practice after each lesson",
            "Watching videos at 2x speed without practising",
            "Waiting until you have a free month to start",
          ],
          answer: 1,
          explain: "Spaced, regular practice where you apply each skill immediately is far more effective than cramming.",
        },
        {
          q: "A former retail manager wants to become an analyst. Their best strategy is often to...",
          options: [
            "Hide their retail background on their CV",
            "Target analyst roles in retail where their domain knowledge is valuable",
            "Only apply to tech startups",
            "Learn five programming languages first",
          ],
          answer: 1,
          explain: "Domain knowledge is a real advantage. Combining it with new data skills makes you stand out.",
        },
        {
          q: "Which skill is usually the most essential filter for entry-level analyst jobs?",
          options: ["Deep learning", "SQL", "Building mobile apps", "Cloud server administration"],
          answer: 1,
          explain: "SQL appears in the vast majority of analyst job listings. Deep learning and server admin are rarely required.",
        },
      ],
    },
    {
      id: "f1-s5",
      title: "Set Up Your Analyst Toolkit",
      minutes: 15,
      xp: 75,
      skills: ["orientation", "spreadsheets", "sql", "python"],
      lesson: [
        {
          heading: "Google Sheets",
          body: `Google Sheets is free, runs in your browser, and handles nearly everything in the spreadsheet floors.

- Go to **sheets.google.com** and sign in with a Google account.
- Click **Blank** to create a spreadsheet.
- Rename it (top left) to something like "DataLadder Practice".

If you already have Microsoft Excel, that works too. The formulas in this course are almost identical in both.`,
          tip: "Make a folder in Google Drive called \"DataLadder\" and keep every practice file there. Future-you building a portfolio will thank you.",
        },
        {
          heading: "A free SQL playground",
          body: `You don't need to install a database to learn SQL. Browser-based playgrounds let you type a query and see results instantly.

Search for a free online SQL editor that runs SQLite (several are available, such as sqliteonline-style sites or DB Fiddle). Pick one that lets you create a table and run queries without signing up.

Test it with this tiny query:`,
          example: `SELECT 'Hello, analyst!' AS greeting;`,
          exampleLang: "sql",
        },
        {
          heading: "A BI tool: Power BI or Tableau Public",
          body: `You'll build dashboards in a later floor. Two free options:

- **Power BI Desktop**: free download for Windows from Microsoft. Very common in corporate jobs.
- **Tableau Public**: free, works on Windows and Mac. Dashboards you save are published publicly, which is great for a portfolio (just never upload private data).

Install one now so it's ready. Check job listings in your area: whichever appears more often is the one to prioritise.`,
        },
        {
          heading: "Python via Google Colab",
          body: `**Google Colab** gives you Python in the browser with nothing to install.

- Go to **colab.research.google.com** and sign in.
- Click **New notebook**.
- In the first cell, type the code below and press **Shift + Enter**.

If you see the output, you're officially set up to run Python.`,
          example: `print("My toolkit is ready!")
2 + 2`,
          exampleLang: "python",
        },
        {
          heading: "Your setup checklist",
          body: `Before moving up a floor, make sure you have:

- A Google Sheets (or Excel) file you can open.
- A bookmarked SQL playground that runs a query.
- Power BI Desktop or Tableau Public installed.
- A Colab notebook that prints a line.
- A "DataLadder" folder for all your practice work.

Five tools, zero cost. You now have the same core kit many working analysts use.`,
        },
      ],
      quiz: [
        {
          q: "Why is Tableau Public a good portfolio tool but a bad place for company data?",
          options: [
            "It can't make charts",
            "Workbooks saved there are published publicly",
            "It only runs on phones",
            "It deletes files after a day",
          ],
          answer: 1,
          explain: "Tableau Public publishes your work to the web. Great for showing off projects; never use it with private data.",
        },
        {
          q: "In Google Colab, how do you run a cell?",
          options: ["Ctrl + S", "Shift + Enter", "Alt + F4", "Double-click the cell"],
          answer: 1,
          explain: "Shift + Enter runs the current cell and moves to the next one.",
        },
        {
          q: "What's the main benefit of a browser-based SQL playground for beginners?",
          options: [
            "It's faster than any company database",
            "You can practise queries without installing or configuring a database",
            "It teaches Python automatically",
            "It stores your data permanently and privately",
          ],
          answer: 1,
          explain: "Playgrounds remove setup friction so you can focus on learning the language itself.",
        },
        {
          q: "You already own Microsoft Excel. Do you need Google Sheets for this course?",
          options: [
            "Yes, the formulas are completely different",
            "No, the core formulas are nearly identical in both",
            "Yes, Excel can't do formulas",
            "No, because spreadsheets aren't used by analysts",
          ],
          answer: 1,
          explain: "Excel and Sheets share almost all core functions. Use whichever you have.",
        },
      ],
    },
  ],
};
