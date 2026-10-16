import type { Floor } from '../types';

export const floor9: Floor = {
  id: 9,
  title: "Business Acumen",
  tagline: "Speak the language of the business — the skill that turns a query-writer into a trusted analyst.",
  color: "#14b8a6",
  icon: "💼",
  outcomes: [
    "Explain and calculate core KPIs: revenue, conversion, churn, retention, CAC and LTV",
    "Turn a vague request into a sharp, answerable business question",
    "Interpret A/B tests correctly and avoid the common pitfalls",
    "Run cohort and funnel analyses to find where customers drop off",
    "Present findings to stakeholders and tackle case studies with a clear method",
  ],
  steps: [
    {
      id: "f9-s1",
      title: "KPIs & Metrics by Department",
      minutes: 16,
      xp: 130,
      skills: ["business"],
      lesson: [
        {
          heading: "Why metrics knowledge matters",
          body: "Writing SQL is half the job. The other half is knowing **which number matters** and what it means for the business. When a marketing manager says 'CAC is creeping up', you should know exactly what that is and why it's a problem.\n\nMost companies track a similar core set of metrics, grouped by the team that owns them.",
        },
        {
          heading: "Sales & finance metrics",
          body: "- **Revenue**: money earned from sales. Watch **gross** (before refunds/discounts) vs **net**.\n- **Gross margin**: (revenue - cost of goods) / revenue. How much of each dollar is left after making the product.\n- **Average order value (AOV)**: revenue / number of orders.\n- **MRR / ARR**: monthly / annual recurring revenue, the heartbeat of subscription businesses.",
          example: `Revenue        = $500,000
Cost of goods  = $300,000
Orders         = 10,000

Gross margin   = (500,000 - 300,000) / 500,000 = 40%
AOV            = 500,000 / 10,000 = $50`,
          exampleLang: "text",
        },
        {
          heading: "Marketing metrics",
          body: "- **Conversion rate**: people who completed a goal / people who had the chance. Always state the denominator (visitors? sessions? sign-ups?).\n- **CAC (customer acquisition cost)**: total sales & marketing spend / new customers acquired.\n- **ROAS**: revenue from ads / ad spend.\n- **CTR**: clicks / impressions.",
          example: `Marketing spend in March   = $60,000
New customers in March     = 1,200
CAC = 60,000 / 1,200 = $50 per customer

Site visitors = 80,000, purchases = 1,600
Conversion rate = 1,600 / 80,000 = 2.0%`,
          exampleLang: "text",
        },
        {
          heading: "Product & customer success metrics",
          body: "- **Active users (DAU/MAU)**: unique users doing a meaningful action in a day/month. The definition of 'active' must be agreed.\n- **Retention rate**: share of customers from a period still active later.\n- **Churn rate**: share of customers who left in a period. Churn = customers lost / customers at start.\n- **LTV (lifetime value)**: total gross profit expected from a customer. A simple version: average monthly gross profit per customer / monthly churn rate.\n- **NPS**: customer loyalty survey score.",
          example: `Start of month customers = 2,000, cancelled = 100
Monthly churn = 100 / 2,000 = 5%

Avg monthly gross profit per customer = $30
Simple LTV = 30 / 0.05 = $600

LTV : CAC = 600 : 50 = 12 : 1  (healthy is often quoted as 3:1 or better)`,
          exampleLang: "text",
          tip: "LTV:CAC compares what a customer is worth with what it costs to win them. Below ~1:1 means the company loses money on each new customer.",
        },
        {
          heading: "Leading vs lagging indicators",
          body: "- **Lagging** indicators report results after the fact: revenue, churn.\n- **Leading** indicators move first and predict them: trial sign-ups, product usage, support tickets.\n\nGood analysts pair them. If usage per account drops this month, churn will likely rise next month — and the business can act before it happens.",
        },
      ],
      quiz: [
        {
          q: "A company spent $40,000 on marketing and gained 800 new customers. What is CAC?",
          options: ["$20", "$50", "$500", "$32,000"],
          answer: 1,
          explain: "CAC = spend / new customers = 40,000 / 800 = $50.",
        },
        {
          q: "1,000 customers at the start of the month; 30 cancel. What's monthly churn?",
          options: ["30%", "3%", "97%", "0.3%"],
          answer: 1,
          explain: "Churn = 30 / 1,000 = 3%.",
        },
        {
          q: "Which is a LEADING indicator of churn for a software product?",
          options: [
            "Last quarter's revenue",
            "Declining weekly logins per account",
            "Annual profit",
            "Number of employees",
          ],
          answer: 1,
          explain: "Usage drops typically happen before customers cancel, so they predict churn.",
        },
        {
          q: "LTV is $300 and CAC is $400. What does this suggest?",
          options: [
            "The business is very healthy",
            "Each new customer costs more to acquire than they're worth — unsustainable",
            "Churn is zero",
            "Conversion rate is high",
          ],
          answer: 1,
          explain: "An LTV:CAC below 1 means losing money on every customer acquired.",
        },
      ],
    },
    {
      id: "f9-s2",
      title: "Framing the Business Question",
      minutes: 14,
      xp: 140,
      skills: ["business", "storytelling"],
      game: { kind: "stakeholder-says", stage: 1 },
      lesson: [
        {
          heading: "Requests arrive vague",
          body: "Real requests sound like: 'Can you pull the sales data?' or 'Why are numbers down?' If you start querying immediately, you'll likely answer the wrong question.\n\nYour first job is to understand **the decision behind the request**. Data is only valuable if it changes or confirms a decision.",
        },
        {
          heading: "Clarifying questions to ask",
          body: "- **What decision** will this help you make?\n- **What will you do differently** depending on the answer?\n- **Which metric** defines success, and how is it calculated?\n- **What time period and segment** (region, product, customer type)?\n- **Compared to what?** Last month, last year, target, a control group?\n- **When** do you need it, and in what form (number, chart, deck)?",
          tip: "Repeat the request back in your own words before you start: 'So you want to know X so you can decide Y by Friday — right?'",
        },
        {
          heading: "From vague to SMART",
          body: "Rewrite the request as a **specific, measurable** question tied to a decision and a timeframe.",
          example: `Vague:  "Why are sales down?"

Sharp:  "Online revenue fell 12% in Sept vs Aug. Which channels, regions
         and product categories account for the drop, and is it driven
         by fewer orders or smaller orders? Needed by Thursday to decide
         whether to extend the fall promotion."`,
          exampleLang: "text",
        },
        {
          heading: "Break it down with a metric tree",
          body: "Big metrics are made of smaller ones. Decompose the headline number to see where to look. This is also called a **driver tree** and it's a favorite tool in interviews.",
          example: `Revenue
 ├─ Number of orders
 │   ├─ Site visitors
 │   └─ Conversion rate
 └─ Average order value
     ├─ Items per order
     └─ Price per item (after discounts)`,
          exampleLang: "text",
        },
        {
          heading: "Form hypotheses before querying",
          body: "List 3-5 plausible explanations, then check each with data. It keeps you focused and fast.\n\nFor 'revenue dropped': seasonality? tracking bug? a competitor promotion? a price change? a stock-out on a best-seller? **Always check for data problems first** — a broken tracking tag is a surprisingly common 'cause'.",
        },
      ],
      quiz: [
        {
          q: "A manager asks 'Can you pull all the customer data?' What should you do first?",
          options: [
            "Export the whole customer table immediately",
            "Ask what decision they're trying to make and what they'll use it for",
            "Build a dashboard of every column",
            "Say no",
          ],
          answer: 1,
          explain: "Understanding the decision lets you deliver something useful instead of a data dump.",
        },
        {
          q: "Which is the best-framed question?",
          options: [
            "How's marketing doing?",
            "Look into conversions",
            "Did the new checkout page change mobile conversion rate in October vs September, and should we roll it out to desktop?",
            "Get me numbers on the website",
          ],
          answer: 2,
          explain: "It names the metric, segment, timeframe, comparison and the decision.",
        },
        {
          q: "In a revenue driver tree, revenue breaks down into…",
          options: [
            "Churn and NPS",
            "Number of orders × average order value",
            "CAC and LTV",
            "Clicks and impressions only",
          ],
          answer: 1,
          explain: "Revenue = orders × AOV, and each of those breaks down further.",
        },
        {
          q: "Sign-ups dropped 40% overnight. What should you check first?",
          options: [
            "Competitor pricing",
            "Whether tracking or the data pipeline broke",
            "Long-term seasonality",
            "Employee satisfaction",
          ],
          answer: 1,
          explain: "Sudden, huge drops are often data issues. Rule those out before telling a business story.",
        },
      ],
    },
    {
      id: "f9-s3",
      title: "A/B Testing Basics",
      minutes: 18,
      xp: 180,
      skills: ["ab-testing", "statistics"],
      game: { kind: "stakeholder-says", stage: 2 },
      lesson: [
        {
          heading: "What an A/B test is",
          body: "An **A/B test** (controlled experiment) randomly splits users into groups:\n\n- **Control (A)**: sees the current version\n- **Variant (B)**: sees the change (new button, new price, new email subject)\n\nBecause assignment is random, the groups are alike in every way except the change. So if B performs better by more than chance would explain, the change likely **caused** it. This is the gold standard for proving cause and effect.",
        },
        {
          heading: "Before the test: design",
          body: "- **Hypothesis**: 'Changing the CTA to 'Start free trial' will increase sign-up rate.'\n- **Primary metric**: one metric decides the winner (sign-up rate)\n- **Guardrail metrics**: things that must not get worse (refunds, page load time)\n- **Sample size**: calculate it upfront with a power calculator, based on your baseline rate and the smallest lift worth detecting\n- **Duration**: run full weeks (at least 1-2) to cover weekday/weekend differences",
          tip: "The smaller the effect you want to detect, the more users you need. Detecting a 1% lift may need 10x+ the users of detecting a 10% lift.",
        },
        {
          heading: "Reading the results",
          body: "- **Lift**: (variant rate - control rate) / control rate\n- **p-value**: if there were truly no difference, how likely is a result at least this extreme? Below your threshold (commonly 0.05) = **statistically significant**\n- **Confidence interval**: the plausible range of the true lift. If it includes 0, you can't rule out 'no effect'\n\nAlso ask: is the lift **practically** significant? A real but tiny 0.1% lift may not be worth the engineering cost.",
          example: `Control:  10,000 visitors, 500 sign-ups -> 5.0%
Variant:  10,000 visitors, 560 sign-ups -> 5.6%

Lift = (5.6 - 5.0) / 5.0 = +12%
p-value = 0.03  -> significant at the 0.05 level
95% CI for lift: +1% to +23% -> likely positive, size uncertain`,
          exampleLang: "text",
        },
        {
          heading: "Common pitfalls",
          body: "- **Peeking**: checking daily and stopping as soon as it looks significant inflates false positives. Decide duration upfront.\n- **Too many metrics**: test 20 metrics and about 1 will look 'significant' by chance.\n- **Novelty effect**: users click new things because they're new; the lift may fade.\n- **Sample ratio mismatch**: a 50/50 split that ends up 52/48 signals a bug in assignment.\n- **Segment fishing**: 'it worked for left-handed iPad users in Ohio' is probably noise unless planned in advance.\n- **Not significant ≠ no effect**: the test may simply have been too small.",
        },
      ],
      quiz: [
        {
          q: "Why do A/B tests assign users randomly?",
          options: [
            "To save money",
            "So the groups are comparable and differences can be attributed to the change",
            "Because it's faster",
            "To increase the sample size",
          ],
          answer: 1,
          explain: "Randomization balances all other factors, which is what allows causal conclusions.",
        },
        {
          q: "Control converts at 4.0%, variant at 4.4%. What's the relative lift?",
          options: ["0.4%", "10%", "4.4%", "40%"],
          answer: 1,
          explain: "(4.4 - 4.0) / 4.0 = 0.10 = 10% relative lift (0.4 percentage points absolute).",
        },
        {
          q: "A PM checks the test every morning and wants to stop on the first day p < 0.05. What's the problem?",
          options: [
            "Nothing, that's efficient",
            "Peeking inflates the false-positive rate; stick to the planned duration and sample size",
            "p-values only work on Mondays",
            "They should use a p-value of 0.5",
          ],
          answer: 1,
          explain: "Repeatedly checking and stopping early makes it much more likely to declare a fake winner.",
        },
        {
          q: "The 95% confidence interval for lift is -2% to +6%. What can you conclude?",
          options: [
            "The variant definitely won",
            "The variant definitely lost",
            "The result is inconclusive — the true effect could be zero",
            "The test is broken",
          ],
          answer: 2,
          explain: "The interval includes 0, so the data is consistent with no effect.",
        },
        {
          q: "What is a guardrail metric?",
          options: [
            "The metric that picks the winner",
            "A metric that must not get worse, like refund rate or page load time",
            "The sample size",
            "The p-value threshold",
          ],
          answer: 1,
          explain: "Guardrails protect against wins on the main metric that cause harm elsewhere.",
        },
      ],
    },
    {
      id: "f9-s4",
      title: "Cohort & Funnel Analysis",
      minutes: 18,
      xp: 170,
      skills: ["business", "sql"],
      lesson: [
        {
          heading: "Funnels: where do people drop off?",
          body: "A **funnel** follows users through a sequence of steps toward a goal. Calculate the conversion from each step to the next to find the biggest leak — that's where improvements pay off most.",
          example: `Step              Users    Step conversion   Overall
Visited site      50,000        -             100%
Viewed product    20,000       40%             40%
Added to cart      6,000       30%             12%
Started checkout   3,000       50%              6%
Purchased          1,500       50%              3%

Biggest leak: product view -> add to cart (only 30%)`,
          exampleLang: "text",
          tip: "Compare funnels across segments (mobile vs desktop, new vs returning). A step that's fine on desktop but terrible on mobile points straight at a UX problem.",
        },
        {
          heading: "Building a funnel in SQL",
          body: "With an events table, count distinct users who reached each step. Conditional aggregation from Floor 6 does the heavy lifting.",
          example: `SELECT
  COUNT(DISTINCT CASE WHEN event = 'view_product' THEN user_id END) AS viewed,
  COUNT(DISTINCT CASE WHEN event = 'add_to_cart'  THEN user_id END) AS carted,
  COUNT(DISTINCT CASE WHEN event = 'purchase'     THEN user_id END) AS purchased
FROM events
WHERE event_date >= '2025-09-01' AND event_date < '2025-10-01';`,
          exampleLang: "sql",
        },
        {
          heading: "Cohorts: groups that started together",
          body: "A **cohort** is a group of users who share a starting point, usually their sign-up or first-purchase month. **Cohort analysis** tracks each group over time.\n\nWhy not just look at total active users? Because growth from new sign-ups can hide the fact that each new cohort is retaining **worse** than the last.",
        },
        {
          heading: "Reading a retention table",
          body: "Each row is a cohort; each column is months since start; each cell is the % still active. Read **across** a row to see one cohort decay, and **down** a column to compare cohorts at the same age.",
          example: `Cohort    M0     M1    M2    M3
Jan      100%   45%   35%   30%
Feb      100%   48%   37%   32%
Mar      100%   55%   44%    -
Apr      100%   58%    -     -

Reading down M1: retention improved from 45% to 58%.
That lines up with the onboarding redesign shipped in March.`,
          exampleLang: "text",
        },
        {
          heading: "Cohort SQL pattern",
          body: "Find each user's cohort month, then count active users by cohort and months since start.",
          example: `WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('month', MIN(order_date)) AS cohort_month
  FROM orders GROUP BY user_id
),
activity AS (
  SELECT DISTINCT o.user_id, c.cohort_month,
         DATE_TRUNC('month', o.order_date) AS active_month
  FROM orders o JOIN cohorts c ON o.user_id = c.user_id
)
SELECT cohort_month,
       (EXTRACT(YEAR FROM active_month) - EXTRACT(YEAR FROM cohort_month)) * 12
       + EXTRACT(MONTH FROM active_month) - EXTRACT(MONTH FROM cohort_month) AS month_number,
       COUNT(DISTINCT user_id) AS active_users
FROM activity
GROUP BY 1, 2
ORDER BY 1, 2;`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "1,000 users add to cart and 250 purchase. What's that step's conversion?",
          options: ["4%", "25%", "75%", "250%"],
          answer: 1,
          explain: "250 / 1,000 = 25%.",
        },
        {
          q: "What defines a cohort in a typical retention analysis?",
          options: [
            "Users from the same city",
            "Users who share a starting period, like sign-up month",
            "Users with the same order value",
            "All users ever",
          ],
          answer: 1,
          explain: "Cohorts group users by when they started so you can compare them at the same age.",
        },
        {
          q: "Total monthly active users are growing, but each new cohort's month-1 retention is falling. What's happening?",
          options: [
            "Everything is fine",
            "New sign-ups are masking a worsening retention problem",
            "Retention can't be measured this way",
            "The funnel is broken",
          ],
          answer: 1,
          explain: "Acquisition growth can hide declining retention — exactly what cohort analysis reveals.",
        },
        {
          q: "In a funnel, which step should you usually investigate first?",
          options: [
            "The first step, always",
            "The step with the largest drop-off (lowest step conversion) relative to its importance",
            "The last step, always",
            "Whichever step has the most users",
          ],
          answer: 1,
          explain: "The biggest leak typically offers the biggest opportunity.",
        },
      ],
    },
    {
      id: "f9-s5",
      title: "Stakeholder Communication & Presenting Results",
      minutes: 15,
      xp: 160,
      skills: ["storytelling", "business"],
      game: { kind: "stakeholder-says", stage: 3 },
      lesson: [
        {
          heading: "Lead with the answer",
          body: "Busy stakeholders want the conclusion first. Use the **pyramid principle**: start with the answer, then the 2-3 supporting points, then the details for whoever wants them.\n\nCompare: 'I joined four tables and then...' vs 'Churn rose because of the price change — here are three pieces of evidence.' The second earns attention in the first 10 seconds.",
          example: `Subject: Q3 churn - answer + recommendation

Bottom line: Churn rose from 4% to 6% in Q3, mostly among annual-plan
customers who hit the new price at renewal.

Evidence:
- 70% of the extra churn came from renewals after Jul 1 (price change date)
- Monthly-plan churn was flat
- Exit survey "too expensive" mentions doubled

Recommendation: test a 15% loyalty discount at renewal for 2 months.
Detail and method in the attached notebook.`,
          exampleLang: "text",
        },
        {
          heading: "Translate numbers into business language",
          body: "- Say '**$120K per quarter**' instead of 'a 0.8 percentage point conversion lift'\n- Round sensibly: '~35%' not '34.8217%'\n- Give comparisons: 'twice as many', 'up from last year'\n- Define jargon once, or avoid it\n\nYour audience doesn't care about the window function. They care about what it means for customers, money and risk.",
        },
        {
          heading: "Be honest about uncertainty",
          body: "Trust is your most valuable asset. Say what you **know**, what you **think**, and what you **don't know yet**.\n\n- State caveats plainly: 'This excludes app purchases, roughly 10% of revenue.'\n- Separate correlation from causation\n- If you made a mistake in a shared report, flag it quickly and send the correction\n\nNever stretch a finding to give a stakeholder the answer they hoped for.",
          tip: "When someone challenges your number, don't get defensive. Ask how they calculate it — often the definitions differ, and resolving that is valuable.",
        },
        {
          heading: "Tailor to the audience",
          body: "- **Executives**: the headline, the impact in money or risk, the decision needed. One slide if possible.\n- **Managers**: the drivers, what their team can change, how to track it.\n- **Technical peers**: methods, assumptions, code, edge cases.\n\nSame analysis, three different conversations.",
        },
        {
          heading: "Handling pushback and requests",
          body: "- 'Can you just add one more cut?' — ask what decision it supports and agree on priority\n- Conflicting requests from two managers — make the trade-off visible and let them (or their boss) decide\n- A stakeholder wants a specific conclusion — show the data neutrally and offer what the data **does** support\n\nSaying 'not now, here's why, here's when' is a professional skill, not a refusal.",
        },
      ],
      quiz: [
        {
          q: "What should the first sentence of a results email to an executive contain?",
          options: [
            "A description of the data sources",
            "The main finding and recommendation",
            "A list of SQL tables joined",
            "An apology for the delay",
          ],
          answer: 1,
          explain: "Lead with the answer (pyramid principle). Details follow for those who want them.",
        },
        {
          q: "Which phrasing is best for a non-technical audience?",
          options: [
            "Conversion increased 0.73 percentage points, p = 0.021",
            "The new checkout adds about $90K in revenue per month",
            "The window function shows a positive delta",
            "The coefficient is statistically non-zero",
          ],
          answer: 1,
          explain: "Translate results into business impact the audience cares about.",
        },
        {
          q: "A sales director says your revenue number is wrong because her report shows more. Best response?",
          options: [
            "Insist yours is correct",
            "Quietly change your number to match",
            "Ask how her report defines and filters revenue to find where the definitions differ",
            "Ignore the comment",
          ],
          answer: 2,
          explain: "Most disagreements are definition differences (gross vs net, date ranges). Resolving them builds trust.",
        },
        {
          q: "You found a mistake in a report you sent last week. What should you do?",
          options: [
            "Hope nobody notices",
            "Flag it promptly, explain the impact, and share the corrected numbers",
            "Wait until someone asks",
            "Delete the report",
          ],
          answer: 1,
          explain: "Owning errors quickly protects your credibility far more than hiding them.",
        },
      ],
    },
    {
      id: "f9-s6",
      title: "The Case-Study Method",
      minutes: 16,
      xp: 170,
      skills: ["business", "interview"],
      lesson: [
        {
          heading: "A repeatable way to attack any problem",
          body: "Whether it's a real request or an interview case, use the same five-step method:\n\n- **1. Clarify**: restate the problem, ask about goals, definitions, timeframe\n- **2. Structure**: break it into a driver tree or list of hypotheses\n- **3. Analyze**: decide what data you'd pull and what you'd look for\n- **4. Synthesize**: what did you find, and what does it mean?\n- **5. Recommend**: a clear action, its expected impact, risks, and next steps",
        },
        {
          heading: "Worked case: a food delivery app",
          body: "Prompt: 'Weekly orders dropped 8% last month. What would you look at?'",
          example: `1. Clarify: All cities or some? Started suddenly or gradually?
   Any launches, price changes or outages? Is 'order' a completed delivery?

2. Structure: Orders = active customers x orders per customer
   - Active customers: new vs returning, by city, by platform
   - Orders per customer: frequency, cancellations
   - External: seasonality, competitors, weather, holidays
   - Data: tracking changes?

3. Analyze: Split the drop by city and platform. Compare same month last year.
   Funnel: app open -> restaurant view -> checkout -> order.

4. Synthesize (example finding): 80% of the drop is iOS users in 3 cities,
   starting the day of the app update; checkout errors spiked.

5. Recommend: Roll back / hotfix the iOS checkout; estimate recovered orders;
   add an alert on checkout error rate.`,
          exampleLang: "text",
        },
        {
          heading: "Segment, segment, segment",
          body: "Most 'why did X change' cases are solved by slicing the metric by dimensions until the change concentrates somewhere:\n\n- Time (when exactly did it start?)\n- Geography\n- Platform / device\n- Customer type (new vs returning, plan tier)\n- Product / category\n- Acquisition channel\n\nIf a drop is **everywhere equally**, look for a global cause (seasonality, pricing, tracking). If it's **concentrated**, look for a local cause.",
        },
        {
          heading: "Think out loud and quantify",
          body: "In interviews, the interviewer grades your **thinking**, not just the answer. Narrate your structure, state assumptions, and do rough math aloud.\n\nWhen recommending, attach a rough size: 'If we recover even half the iOS drop, that's about 4% of weekly orders.' Numbers make recommendations persuasive.",
          tip: "It's fine to say 'I'd want to check X before concluding' — that shows maturity, not weakness.",
        },
      ],
      quiz: [
        {
          q: "What's the first step of the case-study method?",
          options: ["Recommend", "Clarify the problem", "Write SQL", "Build a dashboard"],
          answer: 1,
          explain: "Clarifying goals and definitions ensures you solve the right problem.",
        },
        {
          q: "An 8% drop in orders is spread evenly across every city, device and segment. What kind of cause should you suspect?",
          options: [
            "A bug in one city's app",
            "A global cause like seasonality, pricing or a tracking change",
            "One bad restaurant",
            "A single customer leaving",
          ],
          answer: 1,
          explain: "Uniform drops suggest company-wide or external factors; concentrated drops suggest local causes.",
        },
        {
          q: "Which recommendation is strongest?",
          options: [
            "We should look into this more",
            "Fix the iOS checkout bug; it should recover roughly 4% of weekly orders, and add an error-rate alert",
            "Orders are down",
            "Maybe marketing could do something",
          ],
          answer: 1,
          explain: "It's specific, sized, and includes a follow-up to prevent recurrence.",
        },
        {
          q: "In a case interview, why should you think out loud?",
          options: [
            "To fill silence",
            "Interviewers assess your structure and reasoning, not just the final answer",
            "It's required by law",
            "To avoid doing math",
          ],
          answer: 1,
          explain: "Visible, structured reasoning is what the interviewer is evaluating.",
        },
      ],
    },
  ],
};
