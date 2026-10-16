import type { Floor } from '../types';

export const floor10: Floor = {
  id: 10,
  title: "Capstone & Career",
  tagline: "Prove your skills with a real project, then land the job.",
  color: "#f59e0b",
  icon: "🏆",
  outcomes: [
    "Scope and publish a portfolio project with a clear GitHub README",
    "Write a career-changer resume with impact-focused bullets",
    "Use LinkedIn, networking and a focused job search to get interviews",
    "Prepare for SQL live coding, case questions and behavioral (STAR) interviews",
    "Know exactly what the final exam covers and how to earn your certificate",
  ],
  steps: [
    {
      id: "f10-s1",
      title: "Choosing & Scoping Your Portfolio Project",
      minutes: 15,
      xp: 150,
      skills: ["portfolio"],
      lesson: [
        {
          heading: "Why a portfolio matters for career changers",
          body: "Without analyst job titles on your resume, a portfolio is your **proof**. One or two thoughtful projects that answer real questions beat ten copy-paste tutorials.\n\nHiring managers look for: a clear business question, clean and documented work, sensible charts, and a conclusion with recommendations.",
        },
        {
          heading: "Where to find good datasets",
          body: "- **Kaggle**: thousands of datasets (check the license and avoid the most overused ones like Titanic)\n- **data.gov** (and other national open-data portals): government data on health, transport, education\n- **Our World in Data**: clean global data on energy, health, economics\n- **City open-data portals**: 311 calls, bike shares, restaurant inspections\n- **Public APIs** and company reports\n\nBonus points for data linked to the industry you're coming from — a former nurse analysing hospital wait times tells a compelling story.",
        },
        {
          heading: "Scope it: question first, small enough to finish",
          body: "A finished, focused project beats an ambitious abandoned one. Write a one-paragraph project brief before touching the data.",
          example: `Project brief
Question:  Which NYC neighborhoods have the slowest 311 response times for
           noise complaints, and has it changed since 2022?
Audience:  City operations manager
Data:      NYC Open Data 311 requests (2022-2025), ~2M rows
Tools:     SQL (cleaning + aggregation), Python (EDA), Tableau (dashboard)
Deliverables: GitHub repo + README, Tableau Public dashboard, 1-page summary
Timebox:   3 weekends`,
          exampleLang: "text",
          tip: "Timebox it. If it's taking far longer than planned, cut scope rather than quality.",
        },
        {
          heading: "Show the full analyst workflow",
          body: "Make sure your project demonstrates the skills employers list in job ads:\n\n- **SQL** for querying and aggregating\n- **Cleaning** with documented decisions\n- **Analysis**: trends, segments, maybe a cohort or a simple test\n- **Visualization**: a dashboard in Power BI or Tableau\n- **Communication**: insights and recommendations in plain English",
        },
      ],
      quiz: [
        {
          q: "Which project idea is best for a portfolio?",
          options: [
            "Titanic survival prediction from a tutorial",
            "A focused analysis of local restaurant inspection data answering a specific question, with recommendations",
            "A list of every chart type using random numbers",
            "Copying a Kaggle notebook",
          ],
          answer: 1,
          explain: "Original, question-driven projects with recommendations show real analyst thinking.",
        },
        {
          q: "What should you write before starting the analysis?",
          options: ["The README conclusion", "A project brief with question, audience, data and scope", "Your resume", "Nothing"],
          answer: 1,
          explain: "A brief keeps the project focused and finishable.",
        },
        {
          q: "Which is a good source of clean global data on health and economics?",
          options: ["Our World in Data", "A random social media post", "Your employer's confidential CRM", "A paid ad network"],
          answer: 0,
          explain: "Our World in Data publishes well-documented open datasets.",
        },
        {
          q: "Your project is taking twice as long as planned. Best move?",
          options: [
            "Abandon it",
            "Cut scope while keeping quality, and finish",
            "Rush and skip documentation",
            "Add more questions",
          ],
          answer: 1,
          explain: "A smaller finished project is worth far more than an unfinished big one.",
        },
      ],
    },
    {
      id: "f10-s2",
      title: "Structuring Your Project & README on GitHub",
      minutes: 15,
      xp: 150,
      skills: ["portfolio", "git"],
      lesson: [
        {
          heading: "GitHub as your shop window",
          body: "**GitHub** hosts code and files, and it's where hiring managers expect to see analyst projects. Create a free account, make one **repository** (repo) per project, and pin your best ones to your profile.\n\nYou don't need to master Git commands on day one: you can upload files through the website. Learning `git add`, `git commit` and `git push` is a nice bonus later.",
        },
        {
          heading: "A clean folder structure",
          body: "Organize files so anyone can follow your work in a minute.",
          example: `nyc-311-response-times/
├── README.md
├── data/
│   ├── raw/          (or a link if files are too large)
│   └── processed/
├── sql/
│   ├── 01_cleaning.sql
│   └── 02_analysis.sql
├── notebooks/
│   └── eda.ipynb
├── images/
│   └── dashboard.png
└── requirements.txt`,
          exampleLang: "text",
          tip: "Number files in the order they run. Never upload passwords, API keys, or personal data.",
        },
        {
          heading: "The README is the most-read file",
          body: "Most visitors only read the README. Make it a short case study:\n\n- **Title and one-line summary**\n- **Business question** and why it matters\n- **Key findings** (3-5 bullets with numbers) near the top\n- **Recommendations**\n- **Dashboard link and screenshot**\n- **Data source** and cleaning notes\n- **Tools and methods**\n- **Limitations and next steps**",
          example: `# NYC 311 Noise Complaint Response Times

Which neighborhoods wait longest for a response, and is it improving?

## Key findings
- Median response time rose 18% from 2022 to 2025 (4.1h -> 4.8h)
- 5 neighborhoods account for 40% of complaints over 24h
- Weekend nights are 2.3x slower than weekday daytime

## Recommendation
Shift 2 weekend-night units to the 5 slowest areas; est. 25% faster responses.

[Interactive dashboard](link) | Tools: SQL, Python, Tableau`,
          exampleLang: "text",
        },
        {
          heading: "Polish checklist",
          body: "- Notebooks have markdown headings explaining each section\n- Code runs top to bottom without errors\n- Charts have titles and labelled axes\n- No leftover 'test123' cells or commented-out junk\n- Spelling checked in README\n- The repo name is descriptive (`nyc-311-response-times`, not `project2`)",
        },
      ],
      quiz: [
        {
          q: "Where should your key findings appear in a README?",
          options: ["At the very bottom", "Near the top", "Only in the notebook", "In the commit messages"],
          answer: 1,
          explain: "Visitors skim — put the headline results up front.",
        },
        {
          q: "Which should NEVER be committed to a public repo?",
          options: ["A README", "SQL files", "API keys or personal data", "Dashboard screenshots"],
          answer: 2,
          explain: "Public repos are visible to everyone. Keep secrets and personal data out.",
        },
        {
          q: "Which repo name is best?",
          options: ["project2", "final_FINAL_v3", "nyc-311-response-times", "stuff"],
          answer: 2,
          explain: "Descriptive names tell visitors what the project is before they click.",
        },
        {
          q: "What's a good README section to show maturity as an analyst?",
          options: ["Limitations and next steps", "A list of your hobbies", "Your salary expectations", "All raw data pasted in"],
          answer: 0,
          explain: "Acknowledging limits shows you understand your data and analysis honestly.",
        },
      ],
    },
    {
      id: "f10-s3",
      title: "Resume for Career Changers",
      minutes: 16,
      xp: 160,
      skills: ["career"],
      lesson: [
        {
          heading: "Your past experience counts",
          body: "Career changers often hide their previous jobs. Don't. Many analyst skills are **transferable**:\n\n- Teachers: explaining complex ideas, tracking student performance data\n- Retail managers: inventory, sales targets, scheduling with spreadsheets\n- Nurses: accuracy, protocols, working with records under pressure\n- Customer service: understanding customer problems, spotting patterns in complaints\n\nThe trick is to **reframe** those experiences around data, decisions and results.",
        },
        {
          heading: "The bullet formula",
          body: "Strong bullets follow: **Action verb + what you did + tool/method + measurable result.**\n\nNumbers make bullets credible. If you don't have exact figures, give honest estimates ('~20 hours per month').",
          example: `Weak:   "Responsible for weekly sales reports."

Strong: "Automated a weekly sales report in Excel with pivot tables and
         XLOOKUP, cutting prep time from 4 hours to 30 minutes."

Weak:   "Helped with inventory."

Strong: "Analyzed 12 months of stock data to identify 40 slow-moving SKUs;
         markdown plan freed $18K in shelf capacity."`,
          exampleLang: "text",
        },
        {
          heading: "Structure for an analyst resume",
          body: "- **Header**: name, city, email, LinkedIn, GitHub/portfolio link\n- **Summary** (2 lines): 'Former retail manager turned data analyst skilled in SQL, Python and Power BI, with a track record of using data to cut costs.'\n- **Skills**: SQL, Excel, Python (pandas), Power BI/Tableau, statistics — only what you can discuss confidently\n- **Projects**: 2-3 portfolio projects with bullets in the same impact formula\n- **Experience**: previous roles, reframed with data-related bullets\n- **Education & certifications**\n\nKeep it to **one page**.",
        },
        {
          heading: "Passing the ATS",
          body: "Many companies use an **Applicant Tracking System** that scans resumes for keywords before a human sees them.\n\n- Mirror the exact terms from the job description ('Power BI', 'stakeholder reporting', 'SQL')\n- Use a simple layout: no tables, text boxes, or graphics for key info\n- Save as PDF unless asked otherwise\n- Tailor the summary and top bullets for each important application",
          tip: "Keep a 'master resume' with every bullet you've written, then copy the most relevant ones into each tailored version.",
        },
      ],
      quiz: [
        {
          q: "Which bullet is strongest?",
          options: [
            "Worked on data stuff",
            "Responsible for reports",
            "Built a Power BI dashboard tracking 15 KPIs, cutting weekly reporting time by 6 hours",
            "Good at Excel",
          ],
          answer: 2,
          explain: "Action verb + what + tool + measurable result.",
        },
        {
          q: "As a former teacher, how should you treat your teaching experience?",
          options: [
            "Remove it entirely",
            "Reframe it around transferable skills like tracking student performance data and presenting findings",
            "List only the school name",
            "Put it in a footnote",
          ],
          answer: 1,
          explain: "Reframed experience shows real-world data and communication skills.",
        },
        {
          q: "What helps a resume pass an ATS?",
          options: [
            "Fancy graphics and multi-column tables",
            "Using keywords from the job description in a simple layout",
            "Making it 4 pages long",
            "Listing every software you've heard of",
          ],
          answer: 1,
          explain: "ATS tools match keywords and can misread complex layouts.",
        },
        {
          q: "How long should an entry-level analyst resume usually be?",
          options: ["One page", "Three pages", "Five pages", "As long as possible"],
          answer: 0,
          explain: "One focused page is standard for early-career roles.",
        },
      ],
    },
    {
      id: "f10-s4",
      title: "LinkedIn, Networking & Job Search Strategy",
      minutes: 16,
      xp: 160,
      skills: ["career"],
      lesson: [
        {
          heading: "Make LinkedIn work for you",
          body: "Recruiters search LinkedIn by keyword every day. Optimize so they find you:\n\n- **Headline**: 'Data Analyst | SQL, Python, Power BI | Former Retail Ops Manager' (not 'Seeking opportunities')\n- **About**: 3 short paragraphs — your story, your skills, what you're looking for\n- **Featured**: link your best project and dashboard\n- **Open to Work**: set it (visible to recruiters only if you prefer)\n- Post occasionally: a short write-up of a project insight with a chart",
        },
        {
          heading: "Networking without feeling awkward",
          body: "Many jobs are filled through referrals. Networking is just **asking for advice**, not asking for a job.\n\n- Connect with analysts at companies you like, with a short personal note\n- Ask for a 15-minute chat about their role\n- Join local meetups, online communities and alumni groups\n- Follow up with a thank-you and keep in touch",
          example: `Hi Priya — I'm moving into data analytics after 6 years in retail
operations, and I enjoyed your post on inventory forecasting. Would you
be open to a 15-minute chat about how your team uses SQL and Power BI?
Happy to work around your schedule. Thanks! — Sam`,
          exampleLang: "text",
        },
        {
          heading: "Entry-level titles to search",
          body: "The job isn't always called 'Data Analyst'. Search widely:\n\n- Data Analyst, Junior Data Analyst, Associate Data Analyst\n- Business Analyst, Reporting Analyst, BI Analyst\n- Operations Analyst, Marketing Analyst, Financial Analyst\n- Product Analyst, Sales/Revenue Operations Analyst\n- Analytics roles inside your **old industry**, where your domain knowledge is a big advantage",
          tip: "An internal move at your current employer is often the fastest path: offer to help a data team on a side project.",
        },
        {
          heading: "Where to apply and how many",
          body: "- Job boards (LinkedIn, Indeed, niche boards) plus **company career pages** directly\n- Referrals have much higher response rates than cold applications — prioritise them\n- Expect a numbers game: many career changers send **50-150 applications** over a few months. Quality and tailoring still matter more than raw volume.\n- Track everything in a spreadsheet: company, role, date, contact, status, follow-up date\n\nAim for a steady weekly rhythm (e.g. 10 tailored applications, 3 networking messages, 1 project improvement) rather than bursts.",
          example: `Company   | Role               | Applied | Referral | Status       | Next step
Acme Co   | Junior Data Analyst| 10/02   | Yes      | Phone screen | Prep SQL 10/09
BetaBank  | Reporting Analyst  | 10/03   | No       | Applied      | Follow up 10/17`,
          exampleLang: "text",
        },
      ],
      quiz: [
        {
          q: "Which LinkedIn headline is best?",
          options: [
            "Unemployed",
            "Seeking new opportunities",
            "Data Analyst | SQL, Python, Power BI | Former Retail Ops Manager",
            "Hi there!",
          ],
          answer: 2,
          explain: "Keyword-rich headlines show up in recruiter searches and tell your story.",
        },
        {
          q: "What's the best goal for a first networking message?",
          options: ["Ask for a job immediately", "Ask for a short chat about their role", "Send your resume with no note", "Ask for their salary"],
          answer: 1,
          explain: "Asking for advice is low-pressure and builds genuine relationships.",
        },
        {
          q: "Which title might also be an entry-level analyst role?",
          options: ["Reporting Analyst", "Chief Data Officer", "Data Engineering Manager", "VP of Analytics"],
          answer: 0,
          explain: "Reporting, BI, operations and business analyst roles are common entry points.",
        },
        {
          q: "Why track applications in a spreadsheet?",
          options: [
            "It's required by employers",
            "To manage follow-ups, spot what's working, and stay organized",
            "To share publicly",
            "There's no reason",
          ],
          answer: 1,
          explain: "A tracker turns a chaotic search into a manageable process — and gives you data on your own funnel.",
        },
      ],
    },
    {
      id: "f10-s5",
      title: "Interview Prep: SQL, Cases & STAR",
      minutes: 20,
      xp: 200,
      skills: ["interview", "sql", "business"],
      game: { kind: "stakeholder-says", stage: 4 },
      lesson: [
        {
          heading: "The typical interview loop",
          body: "Most analyst processes include some of:\n\n- **Recruiter screen**: background, motivation, salary range\n- **Technical screen**: SQL live coding or a timed test, sometimes Excel or Python\n- **Take-home assignment**: analyze a dataset and present findings\n- **Case interview**: a business problem to talk through\n- **Behavioral interview**: past experiences and how you work\n- **Final round** with the hiring manager and team",
        },
        {
          heading: "SQL live coding tips",
          body: "- **Clarify first**: ask about the table grain, NULLs, ties and duplicates\n- **Talk while you type**: explain your plan before writing\n- **Build step by step** with CTEs and check intermediate results\n- **Test edge cases** aloud: empty groups, ties, NULLs\n\nThe most common topics: JOINs, GROUP BY + HAVING, CASE WHEN, subqueries/CTEs, window functions (ROW_NUMBER, RANK, LAG), and date handling — all covered in Floors 5 and 6.",
          example: `-- Classic: second-highest salary per department
WITH ranked AS (
  SELECT department, employee, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT department, employee, salary
FROM ranked
WHERE rnk = 2;
-- Say aloud: "I used DENSE_RANK so ties at the top don't skip rank 2."`,
          exampleLang: "sql",
        },
        {
          heading: "Case questions",
          body: "Use the case-study method from Floor 9: **clarify, structure, analyze, synthesize, recommend**. Typical prompts:\n\n- 'Daily active users dropped 10%. How would you investigate?'\n- 'How would you measure the success of a new feature?'\n- 'Should we offer free shipping? What data would you need?'\n\nStructure your answer, segment the metric, mention data-quality checks, and end with a recommendation.",
        },
        {
          heading: "Behavioral questions with STAR",
          body: "Answer 'Tell me about a time...' questions with **STAR**:\n\n- **Situation**: brief context\n- **Task**: what you were responsible for\n- **Action**: what **you** did (most of the answer)\n- **Result**: the outcome, with numbers, plus what you learned\n\nPrepare 6-8 stories covering: a challenge, a mistake, a conflict, influencing without authority, a tight deadline, and learning something new fast.",
          example: `Q: Tell me about a time you used data to change a decision.

S: As a store manager, our region planned to cut evening staff to save costs.
T: I was asked to provide input on the impact for my store.
A: I pulled 6 months of POS data into Excel and showed that 35% of revenue
   came after 6pm, with the highest basket sizes.
R: The cut was reduced to one weekday; we avoided an estimated $40K revenue
   loss, and the region adopted my template for other stores.`,
          exampleLang: "text",
        },
        {
          heading: "Questions to ask them",
          body: "Always have 2-3 thoughtful questions ready. It signals real interest.\n\n- 'What does a typical week look like for this role?'\n- 'What tools and data stack does the team use?'\n- 'What would success look like in the first 90 days?'\n- 'What's the biggest data challenge the team is facing?'",
          tip: "After each interview, write down the questions you were asked. Your notes become a personal question bank.",
        },
      ],
      quiz: [
        {
          q: "In STAR, which part should take up most of your answer?",
          options: ["Situation", "Task", "Action", "Result"],
          answer: 2,
          explain: "Interviewers want to know what YOU did. Keep context short and focus on actions, then results.",
        },
        {
          q: "In a SQL live coding test, what should you do before writing code?",
          options: [
            "Start typing immediately to save time",
            "Clarify the table grain, duplicates, NULLs and ties",
            "Ask for the answer",
            "Write the whole query silently",
          ],
          answer: 1,
          explain: "Clarifying assumptions prevents wrong answers and shows professional habits.",
        },
        {
          q: "For 'second-highest salary per department' where ties matter, which function fits best?",
          options: ["ROW_NUMBER", "DENSE_RANK", "COUNT", "LAG"],
          answer: 1,
          explain: "DENSE_RANK gives tied salaries the same rank without gaps, so rank 2 is truly the second-highest value.",
        },
        {
          q: "An interviewer asks 'DAU dropped 10% — how would you investigate?' Best start?",
          options: [
            "Immediately blame marketing",
            "Clarify the timeframe and definition, check for data issues, then segment by platform, region and user type",
            "Say you need more data and stop",
            "Recommend a redesign",
          ],
          answer: 1,
          explain: "Clarify, rule out tracking issues, then segment to locate the drop — the case-study method.",
        },
      ],
    },
    {
      id: "f10-s6",
      title: "Final Exam & Certificate Briefing",
      minutes: 10,
      xp: 100,
      skills: ["career", "portfolio"],
      lesson: [
        {
          heading: "You've climbed the whole ladder",
          body: "Take a moment. You started with spreadsheets and now you can query databases, clean data in Python, build dashboards, interpret experiments and present to stakeholders. That's the toolkit of a working analyst.\n\nThe final exam checks that it all fits together.",
        },
        {
          heading: "What the final exam covers",
          body: "The exam mixes questions from every floor, weighted toward the skills employers test most:\n\n- **Spreadsheets & stats**: formulas, pivots, averages, distributions\n- **SQL**: joins, aggregation, CASE WHEN, CTEs, window functions\n- **Visualization & BI**: chart choice, design, dashboards, DAX basics\n- **Python & pandas**: selecting, filtering, cleaning, groupby, merge\n- **Business**: KPIs, A/B tests, funnels, cohorts, communication\n\nExpect scenario-based questions that ask what you'd do, not only definitions.",
        },
        {
          heading: "How to prepare",
          body: "- Review each floor's quiz questions you got wrong\n- Replay the mini-games for any stage that felt shaky\n- Re-read your notes on window functions, A/B test pitfalls and KPI formulas — they're the most commonly missed\n- Get a good night's sleep; read every option before answering",
          tip: "If two answers look right, ask which one a careful analyst would choose in a real workplace. That's usually the intended answer.",
        },
        {
          heading: "Your certificate and what comes next",
          body: "Pass the exam to earn your **DataLadder certificate**. Add it to the Licenses & Certifications section of LinkedIn and your resume.\n\nRemember: certificates open conversations, but **projects and interviews** win offers. Keep building, keep applying on your weekly rhythm, and keep learning — the best analysts never stop climbing.",
        },
      ],
      quiz: [
        {
          q: "What wins job offers most reliably for career changers?",
          options: [
            "Certificates alone",
            "Strong projects plus solid interview performance",
            "A long list of tools on the resume",
            "Applying to one job at a time",
          ],
          answer: 1,
          explain: "Certificates help, but demonstrated skills in projects and interviews are what convert to offers.",
        },
        {
          q: "Which is a smart way to prepare for the final exam?",
          options: [
            "Skip review entirely",
            "Revisit quiz questions you missed and replay shaky mini-game stages",
            "Only re-read Floor 1",
            "Memorize option letters",
          ],
          answer: 1,
          explain: "Targeted review of weak spots gives the biggest improvement.",
        },
        {
          q: "Where should you add your certificate on LinkedIn?",
          options: ["Headline only", "Licenses & Certifications section", "Nowhere", "In a comment on someone else's post"],
          answer: 1,
          explain: "The Licenses & Certifications section is the standard place recruiters look.",
        },
      ],
    },
  ],
};
