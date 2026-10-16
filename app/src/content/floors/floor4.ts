import type { Floor } from '../types';

export const floor4: Floor = {
  id: 4,
  title: "Statistics Foundations",
  tagline: "The plain-English statistics every analyst uses to avoid fooling themselves.",
  color: "#eab308",
  icon: "📊",
  outcomes: [
    "Choose between mean, median, and mode and explain why",
    "Describe spread with range, IQR, standard deviation, and percentiles",
    "Spot skewed distributions and outliers, and decide what to do with them",
    "Read a correlation and explain why it doesn't prove causation",
    "Explain sampling bias, hypothesis tests, and p-values in plain English",
  ],
  steps: [
    {
      id: "f4-s1",
      title: "The Middle: Mean, Median, Mode",
      minutes: 12,
      xp: 80,
      skills: ["statistics"],
      lesson: [
        {
          heading: "Three ways to say \"typical\"",
          body: `When someone asks "What's a typical order?", there are three common answers:

- **Mean** (average): add everything up, divide by how many.
- **Median**: sort the values; the middle one. With an even count, average the two middle values.
- **Mode**: the most frequent value.

Each tells a slightly different story, and picking the right one is a judgment call you'll make constantly.`,
          example: `Order values: 12, 15, 15, 18, 40
Mean   = (12+15+15+18+40) / 5 = 100 / 5 = 20
Median = 15  (middle of the sorted list)
Mode   = 15  (appears twice)`,
          exampleLang: "text",
        },
        {
          heading: "When the mean misleads",
          body: `The mean is pulled by extreme values. The median isn't.

Worked example: six people in a small team earn (in thousands) 30, 32, 35, 38, 40, and the founder earns 200.

- Mean = 375 / 6 = **62.5k**
- Median = (35 + 38) / 2 = **36.5k**

"The average salary is 62.5k" is technically true but describes nobody on the team. The median is far more honest here.`,
          tip: "This is why house prices and salaries are usually reported as medians.",
        },
        {
          heading: "When to use which",
          body: `- **Mean**: data is roughly symmetric with no extreme values (test scores, heights, daily temperature).
- **Median**: data is skewed or has outliers (income, house prices, time on site, order values).
- **Mode**: categories or very repetitive values (most common shoe size, most popular product, most frequent complaint type).

Reporting both mean and median is a quick way to signal whether data is skewed: if they're far apart, it is.`,
        },
        {
          heading: "In your tools",
          body: `You'll calculate these constantly. Same idea, different syntax:`,
          example: `Spreadsheet:  =AVERAGE(B2:B500)  =MEDIAN(B2:B500)  =MODE(B2:B500)
SQL:          SELECT AVG(amount) FROM orders;
Python:       df["amount"].mean()   df["amount"].median()   df["amount"].mode()`,
          exampleLang: "text",
        },
      ],
      quiz: [
        {
          q: "Values: 3, 5, 5, 9, 13. What is the mean?",
          options: ["5", "7", "9", "35"],
          answer: 1,
          explain: "Sum is 35, divided by 5 values = 7.",
        },
        {
          q: "Same values: 3, 5, 5, 9, 13. What is the median?",
          options: ["5", "7", "9", "6"],
          answer: 0,
          explain: "Sorted, the middle (3rd) value is 5.",
        },
        {
          q: "You're reporting typical household income in a city. Which measure is usually best?",
          options: ["Mean", "Median", "Mode", "Maximum"],
          answer: 1,
          explain: "Income is skewed by a few very high earners, so the median better represents a typical household.",
        },
        {
          q: "Which measure fits \"the most common reason customers contact support\"?",
          options: ["Mean", "Median", "Mode", "Standard deviation"],
          answer: 2,
          explain: "Contact reasons are categories; the mode tells you the most frequent one.",
        },
      ],
    },
    {
      id: "f4-s2",
      title: "Spread: Range, IQR, Standard Deviation, Percentiles",
      minutes: 16,
      xp: 100,
      skills: ["statistics"],
      lesson: [
        {
          heading: "Why the middle isn't enough",
          body: `Two pizza shops both have an **average delivery time of 30 minutes**.

- Shop A: deliveries take 27-33 minutes.
- Shop B: deliveries take anywhere from 10 to 55 minutes.

Same average, very different customer experience. **Spread** (or variability) tells you how scattered values are around the middle.`,
        },
        {
          heading: "Range and percentiles",
          body: `**Range** = max minus min. Easy, but one extreme value can blow it up.

A **percentile** tells you what percentage of values fall below a point. If your page load time is at the **90th percentile**, 90% of loads were faster.

- 25th percentile = **Q1** (first quartile)
- 50th percentile = **median**
- 75th percentile = **Q3** (third quartile)

Tech teams often track "p95 response time": 95% of requests are faster than this. It's more useful than the average because it captures the slow experiences users complain about.`,
          example: `=PERCENTILE(B2:B500, 0.9)     -> 90th percentile
=QUARTILE(B2:B500, 1)         -> Q1
=MAX(B2:B500)-MIN(B2:B500)    -> range`,
          exampleLang: "excel",
        },
        {
          heading: "IQR: the robust spread",
          body: `The **interquartile range (IQR)** = Q3 minus Q1. It's the spread of the **middle 50%** of your data, so extreme values don't affect it.

Worked example: delivery times have Q1 = 20 min and Q3 = 45 min.

- IQR = 45 - 20 = **25 minutes**.
- Half of all deliveries take between 20 and 45 minutes.

Pair the IQR with the median when data is skewed, just as you'd pair standard deviation with the mean.`,
        },
        {
          heading: "Standard deviation",
          body: `**Standard deviation** (SD) is roughly "the typical distance of a value from the mean". Small SD = values cluster tightly. Large SD = values are spread out.

- Shop A from earlier might have SD of about 2 minutes.
- Shop B might have SD of about 12 minutes.

For roughly bell-shaped data, a handy rule: about **68%** of values fall within 1 SD of the mean, and about **95%** within 2 SDs.`,
          example: `=STDEV.S(B2:B500)      -> sample standard deviation (Excel)
=STDEV(B2:B500)        -> Google Sheets
df["minutes"].std()    -> Python / pandas`,
          exampleLang: "excel",
          tip: "Use the sample version (STDEV.S) when your data is a sample of a bigger population, which is almost always the case.",
        },
      ],
      quiz: [
        {
          q: "Q1 = 12 and Q3 = 30. What is the IQR?",
          options: ["12", "18", "21", "42"],
          answer: 1,
          explain: "IQR = Q3 - Q1 = 30 - 12 = 18.",
        },
        {
          q: "Your load time is at the 80th percentile. What does that mean?",
          options: [
            "80% of loads were slower than yours",
            "80% of loads were faster than yours",
            "Your load took 80 seconds",
            "You're in the top 20% fastest",
          ],
          answer: 1,
          explain: "Percentiles tell you what share of values fall below. 80% of loads took less time, so yours was relatively slow.",
        },
        {
          q: "Two teams have the same average sales, but Team X has a much larger standard deviation. This means...",
          options: [
            "Team X sells more",
            "Team X's results are more inconsistent",
            "Team X has more members",
            "The averages must be wrong",
          ],
          answer: 1,
          explain: "A larger SD means values are more spread out: some very high and some very low weeks.",
        },
        {
          q: "Why is the IQR less affected by one extreme outlier than the range?",
          options: [
            "It ignores the middle of the data",
            "It only uses the middle 50% of the data",
            "It uses the mean",
            "It's always smaller than 10",
          ],
          answer: 1,
          explain: "The range depends on the single min and max; the IQR ignores the top and bottom 25%.",
        },
      ],
    },
    {
      id: "f4-s3",
      title: "Distributions and Outliers",
      minutes: 14,
      xp: 100,
      skills: ["statistics", "visualization"],
      lesson: [
        {
          heading: "What a distribution is",
          body: `A **distribution** describes how often each value occurs. The easiest way to see one is a **histogram**: values grouped into bins along the bottom, with bar height showing how many fall in each bin.

Always look at the shape before summarising. It tells you which average and which spread measure to trust.`,
        },
        {
          heading: "Common shapes",
          body: `- **Normal (bell-shaped)**: symmetric, most values near the middle. Mean is about equal to median. Example: adult heights.
- **Right-skewed**: a long tail to the right; a few large values. Mean is greater than median. Example: income, order values, time spent on a page.
- **Left-skewed**: a long tail to the left. Mean is less than median. Example: scores on an easy exam.
- **Bimodal**: two peaks, often meaning two different groups are mixed together. Example: restaurant visits peaking at lunch and dinner.`,
          tip: "Most business data (money, time, counts) is right-skewed. Expect it.",
        },
        {
          heading: "Spotting outliers with the IQR rule",
          body: `An **outlier** is a value far from the rest. A common rule of thumb:

- Lower fence = Q1 - 1.5 x IQR
- Upper fence = Q3 + 1.5 x IQR
- Anything outside the fences is a potential outlier.

A **box plot** draws exactly this: the box is Q1 to Q3, a line marks the median, and dots show outliers.`,
          example: `Q1 = 20, Q3 = 45, IQR = 25
Lower fence = 20 - 1.5*25 = -17.5
Upper fence = 45 + 1.5*25 = 82.5
A delivery time of 140 minutes -> outlier`,
          exampleLang: "text",
        },
        {
          heading: "What to do with an outlier",
          body: `Don't delete outliers automatically. Investigate first:

- **Data error?** An age of 450 or a price of -99. Fix or remove it, and note it.
- **Real but unusual?** A corporate client placing a 50,000 order. Keep it, but consider reporting the median, or analyse that client separately.
- **The whole point?** Fraud detection and system failures are *about* outliers.

Whatever you decide, **say what you did** in your write-up so others can trust the numbers.`,
        },
      ],
      quiz: [
        {
          q: "In a right-skewed distribution, how do the mean and median usually compare?",
          options: ["Mean is less than median", "Mean is greater than median", "They're always equal", "There's no median"],
          answer: 1,
          explain: "The long right tail of large values pulls the mean upward, above the median.",
        },
        {
          q: "Q1 = 10, Q3 = 30. Using the 1.5 x IQR rule, what's the upper fence?",
          options: ["45", "60", "50", "40"],
          answer: 1,
          explain: "IQR = 20. Upper fence = 30 + 1.5 x 20 = 30 + 30 = 60.",
        },
        {
          q: "A histogram of shop visits shows two clear peaks. What might that suggest?",
          options: [
            "The data is wrong",
            "Two different groups or time periods are mixed together",
            "The mean equals the median",
            "There are no outliers",
          ],
          answer: 1,
          explain: "Bimodal shapes often signal two populations, like lunch and dinner rushes or two customer types.",
        },
        {
          q: "You find a single order worth 100x the typical amount. What's the best first step?",
          options: [
            "Delete it immediately",
            "Investigate whether it's an error or a real, unusual order",
            "Double it to balance the data",
            "Ignore all orders above average",
          ],
          answer: 1,
          explain: "Outliers can be errors or important real events. Investigate, decide, and document.",
        },
      ],
    },
    {
      id: "f4-s4",
      title: "Relationships: Scatter Plots and Correlation",
      minutes: 14,
      xp: 110,
      skills: ["statistics", "visualization"],
      lesson: [
        {
          heading: "Do two things move together?",
          body: `Often you want to know whether two numbers are related: Do customers who visit more often spend more? Does a higher temperature mean more ice-cream sales?

A **scatter plot** puts one variable on each axis and draws one dot per record. Your eyes can spot the pattern instantly:

- Dots trending **up-right**: positive relationship.
- Dots trending **down-right**: negative relationship.
- A shapeless cloud: little or no linear relationship.`,
        },
        {
          heading: "The correlation coefficient (r)",
          body: `**Correlation**, written **r**, is a single number from **-1 to +1** that measures how strongly two variables move together in a straight line.

- **r = +1**: perfect positive line.
- **r = 0**: no linear relationship.
- **r = -1**: perfect negative line.

Rough guide to strength (it varies by field):

- 0 to 0.3: weak
- 0.3 to 0.7: moderate
- 0.7 to 1.0: strong

The same applies to negative values: -0.8 is a strong negative correlation.`,
          example: `=CORREL(B2:B200, C2:C200)          -> spreadsheet
df["visits"].corr(df["spend"])     -> Python / pandas

Ad spend vs. sign-ups:  r = 0.82  (strong positive)
Price vs. units sold:   r = -0.55 (moderate negative)`,
          exampleLang: "excel",
        },
        {
          heading: "Correlation only sees straight lines",
          body: `**r** measures *linear* relationships. Two variables can be strongly related in a curve and still have r near 0.

Example: staff stress vs. productivity is often an upside-down U. Too little or too much stress hurts performance. r might be close to 0 even though the relationship is real.

That's why you should **always plot the data**, not just calculate r.`,
          tip: "A single extreme point can create or destroy a correlation. Another reason to look at the scatter plot.",
        },
        {
          heading: "Worked example: reading r",
          body: `A gym analyst finds:

- Classes attended per month vs. membership renewals: **r = 0.61**
- Member age vs. renewals: **r = 0.04**

Interpretation: members who attend more classes tend to renew (moderate positive). Age shows essentially no linear link to renewal.

Notice the wording: "tend to". Correlation describes a pattern, not a cause. That's the next step.`,
        },
      ],
      game: { kind: "guess-correlation", stage: 0 },
      quiz: [
        {
          q: "Which correlation is the strongest?",
          options: ["r = 0.45", "r = -0.85", "r = 0.70", "r = 0.10"],
          answer: 1,
          explain: "Strength is about distance from 0. -0.85 is the furthest, so it's strongest (and negative).",
        },
        {
          q: "On a scatter plot, dots slope down from left to right. The correlation is likely...",
          options: ["Positive", "Negative", "Exactly zero", "Greater than 1"],
          answer: 1,
          explain: "As one variable goes up, the other goes down: a negative relationship.",
        },
        {
          q: "Two variables have r = 0.02, but the scatter plot shows a clear U-shaped curve. What's true?",
          options: [
            "There's no relationship at all",
            "There's a real relationship that isn't linear, so r misses it",
            "The calculation is broken",
            "The correlation is strongly negative",
          ],
          answer: 1,
          explain: "r only measures straight-line relationships. Curved patterns can have r near 0.",
        },
        {
          q: "What range of values can r take?",
          options: ["0 to 1", "-1 to +1", "0 to 100", "Any number"],
          answer: 1,
          explain: "Correlation always falls between -1 (perfect negative) and +1 (perfect positive).",
        },
      ],
    },
    {
      id: "f4-s5",
      title: "Correlation Is Not Causation",
      minutes: 12,
      xp: 110,
      skills: ["statistics", "business"],
      lesson: [
        {
          heading: "The most important warning in analytics",
          body: `Just because two things move together doesn't mean one **causes** the other.

Classic example: ice-cream sales and drowning incidents are positively correlated. Ice cream doesn't cause drowning. **Hot weather** drives both: more people buy ice cream and more people swim.`,
        },
        {
          heading: "Three traps behind a correlation",
          body: `When you see a correlation, consider:

- **Confounding variable**: a hidden third factor drives both (the hot weather above).
- **Reverse causation**: the arrow points the other way. Do happy employees get promoted, or does getting promoted make employees happy?
- **Coincidence**: with enough variables, some will line up by pure chance. Look up "spurious correlations" for funny examples.`,
        },
        {
          heading: "A workplace example",
          body: `An app team finds users who turn on notifications retain 40% better. A manager says: "Force everyone to turn on notifications!"

But the users who **chose** to enable notifications were probably already more engaged. Engagement is a confounder. Forcing notifications on unengaged users might just annoy them into uninstalling.

The safe phrasing in your report: "Users with notifications enabled retain better. We can't yet say notifications *cause* this. An experiment would tell us."`,
          tip: "Words to use for correlations: \"associated with\", \"linked to\", \"tends to\". Save \"causes\" and \"drives\" for experimental evidence.",
        },
        {
          heading: "How to get at causation",
          body: `The gold standard is a **randomised experiment** (in business, an **A/B test**): randomly split users into two groups, change one thing for one group only, and compare.

Because the groups were randomly assigned, they're alike on average in everything except the change. So a difference in outcomes can be attributed to the change.

You'll study A/B testing properly on a later floor.`,
        },
      ],
      game: { kind: "guess-correlation", stage: 1 },
      quiz: [
        {
          q: "Cities with more fire stations have more fires. What's the most likely explanation?",
          options: [
            "Fire stations cause fires",
            "A confounder: bigger cities have both more stations and more fires",
            "It's always coincidence",
            "Fires cause fewer fire stations",
          ],
          answer: 1,
          explain: "City size drives both. Population is the hidden confounding variable.",
        },
        {
          q: "Which statement correctly describes a correlation?",
          options: [
            "Discounts cause customers to spend more",
            "Customers who used a discount tended to spend more",
            "Discounts prove higher spend",
            "Spending causes discounts",
          ],
          answer: 1,
          explain: "\"Tended to\" describes the pattern without claiming cause.",
        },
        {
          q: "What's the best way to test whether a new checkout button causes more purchases?",
          options: [
            "Compare this month to last month",
            "Ask customers if they like it",
            "Randomly show half of users the new button and compare results",
            "Calculate the correlation between button colour and sales",
          ],
          answer: 2,
          explain: "A randomised A/B test isolates the effect of the change.",
        },
        {
          q: "\"Employees who attend training have higher performance ratings.\" Which is a possible reverse-causation story?",
          options: [
            "Training improves performance",
            "High performers are more likely to be selected for training",
            "Both are caused by the weather",
            "The data is fake",
          ],
          answer: 1,
          explain: "Reverse causation flips the arrow: performance could lead to training, not the other way round.",
        },
      ],
    },
    {
      id: "f4-s6",
      title: "Sampling, Bias, and Hypothesis Testing",
      minutes: 18,
      xp: 140,
      skills: ["statistics", "ab-testing"],
      lesson: [
        {
          heading: "Populations and samples",
          body: `The **population** is everyone you care about (all customers). A **sample** is the subset you actually have data for (the 800 who answered a survey).

We use samples because measuring everyone is usually impossible. A good sample **represents** the population; a biased one doesn't, no matter how big it is.`,
        },
        {
          heading: "Common sampling biases",
          body: `- **Selection bias**: the sample isn't chosen randomly. Surveying only website visitors misses customers who shop in-store.
- **Voluntary response bias**: only people with strong opinions reply. Online reviews skew to the very happy and very angry.
- **Survivorship bias**: you only see the ones that "survived". Studying only current customers ignores those who already left, the very people who might explain churn.
- **Non-response bias**: the people who didn't answer differ from those who did.

A huge biased sample is still biased. 100,000 survey replies from only power users won't tell you about casual users.`,
        },
        {
          heading: "Hypothesis testing in plain English",
          body: `Every result has some random noise. A **hypothesis test** asks: "Is this difference big enough that it's unlikely to be just noise?"

- **Null hypothesis (H0)**: nothing's going on. The new design makes no difference.
- **Alternative hypothesis (H1)**: something is going on. The new design changes conversion.

You collect data and ask how surprising it would be **if H0 were true**.`,
        },
        {
          heading: "The p-value",
          body: `The **p-value** is the probability of seeing a result at least this extreme **if there were really no effect**.

- Small p-value (commonly below **0.05**): the result would be surprising under "no effect", so we **reject H0** and call it **statistically significant**.
- Large p-value: the result is consistent with random noise. We **fail to reject H0**. This doesn't prove there's no effect; we just don't have strong evidence.

Worked example: version B of a sign-up page converts at 5.4% vs. 4.8% for A, with p = 0.02. If the pages truly performed the same, we'd see a gap this large only about 2% of the time. That's evidence B is genuinely better.`,
          tip: "A p-value is NOT the probability your hypothesis is true. And \"significant\" doesn't mean \"big\" or \"important\": a tiny, useless difference can be significant with enough data.",
        },
        {
          heading: "Is that correlation real or chance?",
          body: `Hypothesis testing applies to correlations too. With only 10 data points, r = 0.4 could easily appear by chance. With 1,000 points, even r = 0.1 can be statistically significant.

So when you report a correlation, mention **how much data** it's based on, and remember: significant means "probably not noise", not "strong" and not "causal".`,
        },
      ],
      game: { kind: "guess-correlation", stage: 2 },
      quiz: [
        {
          q: "A company surveys customers by email only about their mobile app. Which bias is most likely?",
          options: ["Survivorship bias", "Selection bias", "Reverse causation", "No bias"],
          answer: 1,
          explain: "Only people who use email (and the app) are reached, so the sample isn't representative of all customers.",
        },
        {
          q: "An A/B test gives p = 0.30. What's the right conclusion?",
          options: [
            "The new version is 30% better",
            "We've proven there's no difference",
            "We don't have strong evidence of a difference; it could be noise",
            "The test should be reported as significant",
          ],
          answer: 2,
          explain: "A large p-value means the result is consistent with random variation. It's not proof of no effect.",
        },
        {
          q: "What does a p-value of 0.03 mean?",
          options: [
            "There's a 3% chance the hypothesis is true",
            "If there were no real effect, a result this extreme would happen about 3% of the time",
            "The effect is 3% in size",
            "97% of customers prefer the new version",
          ],
          answer: 1,
          explain: "The p-value is about how surprising the data would be if H0 (no effect) were true.",
        },
        {
          q: "Studying only successful startups to learn what makes startups succeed is an example of...",
          options: ["Survivorship bias", "Voluntary response bias", "A random sample", "A confounder"],
          answer: 0,
          explain: "Failed startups that did the same things are invisible, so the lessons are distorted.",
        },
        {
          q: "With 50,000 users, a test is significant but conversion rose only from 4.00% to 4.03%. What should you consider?",
          options: [
            "Significant always means important, so ship it",
            "Whether such a tiny effect is worth the cost of the change",
            "The p-value must be wrong",
            "Rerun it with fewer users",
          ],
          answer: 1,
          explain: "Large samples make tiny effects significant. Business impact still needs judging separately.",
        },
      ],
    },
  ],
};
