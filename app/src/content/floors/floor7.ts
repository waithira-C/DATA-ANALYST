import type { Floor } from '../types';

export const floor7: Floor = {
  id: 7,
  title: "Visualization & BI",
  tagline: "Turn numbers into pictures people understand — and dashboards people actually use.",
  color: "#ec4899",
  icon: "🎨",
  outcomes: [
    "Pick the right chart for comparison, trend, composition, distribution and relationship questions",
    "Remove clutter and use color and position to direct attention",
    "Tell a data story that moves from context to insight to action",
    "Design a focused KPI dashboard for a specific audience",
    "Build basic reports in Power BI (Power Query, relationships, DAX measures) and Tableau",
  ],
  steps: [
    {
      id: "f7-s1",
      title: "Choosing the Right Chart",
      minutes: 14,
      xp: 110,
      skills: ["visualization"],
      game: { kind: "chart-doctor", stage: 1 },
      lesson: [
        {
          heading: "Start with the question, not the chart",
          body: "Before you open any tool, finish this sentence: **'I want to show how ___ compares / changes / breaks down / is distributed / relates.'** The verb tells you the chart.\n\n- **Compare** categories: bar chart\n- **Change over time**: line chart\n- **Part of a whole**: stacked bar, or a pie only for 2-3 slices\n- **Distribution**: histogram or box plot\n- **Relationship** between two numbers: scatter plot",
        },
        {
          heading: "Bar charts: the workhorse",
          body: "Bars are the safest choice for comparing categories because our eyes judge **length from a common baseline** very accurately.\n\n- Use horizontal bars when category names are long\n- Sort bars by value (largest first) unless the categories have a natural order like months or sizes\n- **Always start the axis at zero**. Bars that start at 50 exaggerate differences.",
          tip: "If you're unsure what chart to use, a sorted bar chart is rarely wrong.",
        },
        {
          heading: "Lines for time, scatter for relationships",
          body: "**Line charts** connect points in order, which implies continuity. Use them for time series like weekly sign-ups. Avoid lines for unrelated categories (connecting 'Shoes' to 'Hats' implies a trend that doesn't exist). Line chart axes don't have to start at zero, but label them clearly.\n\n**Scatter plots** show whether two measures move together, such as ad spend vs. sales. Each dot is one item (a store, a campaign). Add a trend line to make the pattern obvious, and remember correlation is not causation.",
        },
        {
          heading: "Pies, tables and when to avoid fancy charts",
          body: "Pies are hard to read beyond a few slices because people are bad at comparing angles. If you have 7 categories, use a bar chart.\n\nSometimes the best visual is **no chart**: if the audience needs exact values to look up, a well-formatted table wins. And if you have one important number, show it big as a **KPI card**.\n\nAvoid 3D charts, dual-axis charts that confuse scales, and radar charts for business audiences.",
          example: `Question                                   -> Chart
"Which region sold the most?"              -> Sorted bar
"How did sign-ups trend this year?"        -> Line
"What share of revenue is from mobile?"    -> Stacked bar / simple pie (2-3 parts)
"How are delivery times spread out?"       -> Histogram or box plot
"Does discount size relate to order size?" -> Scatter`,
          exampleLang: "text",
        },
      ],
      quiz: [
        {
          q: "Your manager asks how monthly revenue changed over the last 18 months. Best chart?",
          options: ["Pie chart", "Line chart", "Scatter plot", "Radar chart"],
          answer: 1,
          explain: "Line charts show change over continuous time clearly.",
        },
        {
          q: "You need to compare sales across 12 product categories with long names. Best choice?",
          options: ["A 12-slice pie", "Horizontal bar chart sorted by value", "Line chart", "3D column chart"],
          answer: 1,
          explain: "Horizontal bars fit long labels and sorting makes ranking instant.",
        },
        {
          q: "Why should bar chart axes start at zero?",
          options: [
            "Software requires it",
            "Bar length encodes value, so a cut-off axis exaggerates differences",
            "It makes the chart colorful",
            "It's only a style preference with no impact",
          ],
          answer: 1,
          explain: "Readers compare bar lengths. If the axis starts at 90, a 95 vs 100 difference looks like double.",
        },
        {
          q: "Which chart best answers 'Do stores with more staff have higher sales?'",
          options: ["Scatter plot", "Pie chart", "Stacked bar", "KPI card"],
          answer: 0,
          explain: "A scatter plot shows the relationship between two numeric variables, with one dot per store.",
        },
      ],
    },
    {
      id: "f7-s2",
      title: "Design Principles: Clutter, Color & Attention",
      minutes: 14,
      xp: 120,
      skills: ["visualization"],
      game: { kind: "chart-doctor", stage: 2 },
      lesson: [
        {
          heading: "Clutter is the enemy",
          body: "Every element on a chart costs the reader some attention. If it doesn't help understanding, remove it. Common clutter:\n\n- Heavy gridlines and borders\n- Data labels on every point **and** an axis\n- Legends when you could label lines directly\n- Decorative icons, shadows and 3D effects\n- Diagonal axis text\n\nA good test: remove an element. If nobody would miss it, leave it out.",
        },
        {
          heading: "Pre-attentive attributes",
          body: "Some visual features are noticed in a fraction of a second, before conscious thought. These are **pre-attentive attributes**:\n\n- **Color** (hue and intensity)\n- **Size**\n- **Position**\n- **Bold / weight**\n- **Enclosure** (a box around something)\n\nUse them deliberately to point at what matters. If one bar is bright orange and the rest are grey, everyone looks at the orange bar first.",
          tip: "Make the default gray and give color to the 1-2 things you want people to notice.",
        },
        {
          heading: "Using color well",
          body: "- **Categorical** palettes (distinct hues) for different groups; keep to around 5-6\n- **Sequential** (light to dark of one hue) for low-to-high values like a heatmap\n- **Diverging** (two hues meeting at a neutral middle) for above/below a target\n\nBe consistent: if 'Online' is blue on one chart, keep it blue everywhere. And design for color-blind readers (about 1 in 12 men): avoid relying on red vs green alone, and add labels or shapes.",
        },
        {
          heading: "Titles that say something",
          body: "A chart title is the most-read text on the page. Replace topic titles with **action titles** that state the takeaway.\n\nThen make the chart prove that sentence: highlight the relevant bar or line.",
          example: `Topic title (weak):   "Monthly Churn Rate, 2025"
Action title (strong): "Churn fell from 6% to 4% after the new onboarding flow launched in May"`,
          exampleLang: "text",
        },
      ],
      quiz: [
        {
          q: "Which is a pre-attentive attribute you can use to highlight one bar?",
          options: ["A footnote", "Contrasting color", "A longer chart title", "Adding more gridlines"],
          answer: 1,
          explain: "Color is processed almost instantly. Highlight one bar and gray out the rest.",
        },
        {
          q: "Which change REDUCES clutter?",
          options: [
            "Adding a 3D effect",
            "Labelling lines directly and removing the legend",
            "Adding data labels and keeping all gridlines",
            "Using 10 different colors",
          ],
          answer: 1,
          explain: "Direct labels save readers from looking back and forth to a legend.",
        },
        {
          q: "You're showing performance above and below a sales target. Which palette type fits?",
          options: ["Categorical", "Sequential", "Diverging", "Rainbow"],
          answer: 2,
          explain: "Diverging palettes have a neutral midpoint (the target) and two contrasting hues for above/below.",
        },
        {
          q: "Which is the strongest chart title?",
          options: [
            "Q3 Data",
            "Revenue by Region",
            "West region drove 60% of Q3 growth",
            "Chart 4",
          ],
          answer: 2,
          explain: "An action title states the insight, so the reader knows what to look for.",
        },
      ],
    },
    {
      id: "f7-s3",
      title: "Storytelling with Data",
      minutes: 14,
      xp: 130,
      skills: ["visualization", "storytelling"],
      lesson: [
        {
          heading: "Analysis isn't finished until someone acts",
          body: "Your stakeholders don't want a tour of every query you ran. They want to know **what happened, why it matters, and what to do**. A data story gives them that in a structure:\n\n- **Context**: what question were we answering and why now?\n- **Insight**: the one or two things the data shows\n- **Action**: what you recommend, and what it's worth",
        },
        {
          heading: "Find your 'big idea' first",
          body: "Before making slides, write your main message in **one sentence** that includes your point of view and what's at stake.\n\nIf you can't write that sentence, you aren't ready to build slides yet. Go back to the analysis.",
          example: `Big idea:
"Customers who use the mobile app reorder 2x as often, so moving
 the app download prompt to checkout could add ~$400K in annual revenue."`,
          exampleLang: "text",
        },
        {
          heading: "Know your audience",
          body: "Ask three questions before you build anything:\n\n- **Who** is it for? An executive wants the headline and decision; a team lead wants detail to act on.\n- **What** do they need to know or do after seeing it?\n- **How** will they consume it? Live presentation, emailed slides, or a self-serve dashboard?\n\nAn email-ready deck needs more explanation on each slide than one you'll present in person.",
        },
        {
          heading: "Workplace example: a 3-slide story",
          body: "The support team asked why ticket volume spiked. Here's how a concise story might flow:",
          example: `Slide 1 (Context):  "Support tickets rose 35% in March, increasing wait times to 2 days."
Slide 2 (Insight):  "70% of the increase came from one issue: password resets after
                     the login change on Mar 3." [bar chart, one bar highlighted]
Slide 3 (Action):   "Adding a self-serve reset link could remove ~900 tickets/month.
                     Ask: approve 1 sprint of engineering time."`,
          exampleLang: "text",
          tip: "Keep the appendix ready for the 'how did you calculate that?' questions, but don't lead with it.",
        },
      ],
      quiz: [
        {
          q: "What is the correct order for a data story?",
          options: [
            "Methodology, data sources, charts, conclusion",
            "Context, insight, action",
            "Action, appendix, context",
            "Charts first, then decide the message",
          ],
          answer: 1,
          explain: "Set the scene, reveal the key finding, then recommend what to do.",
        },
        {
          q: "Your 'big idea' sentence should include…",
          options: [
            "Every metric you calculated",
            "Your point of view and what's at stake",
            "Only the dataset name",
            "A list of SQL queries",
          ],
          answer: 1,
          explain: "A big idea takes a position and explains why it matters, which makes the story actionable.",
        },
        {
          q: "You'll email slides to a VP who won't see you present. What should change?",
          options: [
            "Nothing",
            "Slides need clearer action titles and short explanatory text because you won't be there to narrate",
            "Remove all charts",
            "Add every chart from the analysis",
          ],
          answer: 1,
          explain: "Without a presenter, the slides must explain themselves.",
        },
        {
          q: "A stakeholder asks how you calculated a number. Where should detailed methodology usually live?",
          options: ["Slide 1", "The title", "An appendix", "Nowhere"],
          answer: 2,
          explain: "Keep the main story focused and keep methodology ready in an appendix.",
        },
      ],
    },
    {
      id: "f7-s4",
      title: "Dashboard Design & KPIs",
      minutes: 16,
      xp: 150,
      skills: ["visualization", "business"],
      game: { kind: "chart-doctor", stage: 3 },
      lesson: [
        {
          heading: "A dashboard is a tool, not a poster",
          body: "A dashboard exists so a specific person can **monitor something and act quickly**. Before designing, ask:\n\n- Who uses it, and how often (daily ops vs. monthly exec review)?\n- What decisions will they make with it?\n- Which 3-6 numbers tell them if things are OK?\n\nA dashboard for everyone ends up useful to no one.",
        },
        {
          heading: "Choosing KPIs",
          body: "A **KPI** (key performance indicator) is a metric tied to a goal. Good KPIs are:\n\n- **Relevant** to the user's decisions\n- **Clearly defined** (exactly how is 'active user' calculated?)\n- **Comparable**: shown against a target, last period, or last year\n- **Few**: if everything is key, nothing is\n\nA number without context means little. '$1.2M revenue' is better as '$1.2M, +8% vs last month, 96% of target'.",
          example: `E-commerce daily ops dashboard (for the ops manager)
- Orders today (vs same day last week)
- Revenue today (vs target)
- Conversion rate (vs 7-day average)
- Avg delivery time (vs SLA of 3 days)
- Out-of-stock SKUs (count, list)`,
          exampleLang: "text",
        },
        {
          heading: "Layout: the Z-pattern",
          body: "People scan screens from top-left, across, then down. Use that:\n\n- **Top row**: KPI cards with the headline numbers\n- **Middle**: trend charts explaining those numbers\n- **Bottom**: detail tables and breakdowns for drill-down\n\nGroup related visuals, align everything to a grid, and keep filters in one consistent place (top or left side).",
          tip: "Aim for a dashboard that answers its main question in under 10 seconds without scrolling.",
        },
        {
          heading: "Common dashboard mistakes",
          body: "- Too many charts (more than ~8 visuals usually means it should be split)\n- No targets or comparisons, just raw numbers\n- Inconsistent colors across charts\n- Vanity metrics (page views) instead of decision metrics (conversion)\n- No 'last refreshed' date, so users don't trust the data\n- Undefined metrics that two teams calculate differently",
        },
      ],
      quiz: [
        {
          q: "Which KPI display is most useful?",
          options: [
            "Revenue: $1.2M",
            "Revenue: $1.2M (+8% vs last month, 96% of target)",
            "Revenue chart with 12 colors",
            "Revenue in a pie chart",
          ],
          answer: 1,
          explain: "KPIs need context — a comparison or target — to tell the user if performance is good or bad.",
        },
        {
          q: "Where should headline KPI cards usually go?",
          options: ["Bottom right", "Top of the dashboard", "Hidden in a tooltip", "On a separate page"],
          answer: 1,
          explain: "Users scan from the top-left, so headline numbers belong at the top.",
        },
        {
          q: "A sales manager needs to spot underperforming reps weekly. Which is the best KPI to feature?",
          options: [
            "Total website page views",
            "Each rep's revenue vs quota",
            "Number of dashboard filters",
            "Company founding year",
          ],
          answer: 1,
          explain: "Revenue vs quota directly supports the manager's decision about which reps need help.",
        },
        {
          q: "Users keep asking 'is this data current?' What's the fix?",
          options: [
            "Add a 'last refreshed' timestamp",
            "Add more charts",
            "Remove the filters",
            "Change the colors",
          ],
          answer: 0,
          explain: "A visible refresh time builds trust and saves repeated questions.",
        },
      ],
    },
    {
      id: "f7-s5",
      title: "Power BI Essentials",
      minutes: 20,
      xp: 180,
      skills: ["powerbi", "visualization"],
      lesson: [
        {
          heading: "The Power BI workflow",
          body: "Power BI Desktop (free on Windows) follows the same path for most reports:\n\n- **Get Data**: connect to Excel, CSV, SQL databases and more\n- **Transform** in **Power Query**: clean and shape the data\n- **Model**: set up relationships between tables\n- **Measure**: write DAX calculations\n- **Visualize**: drag fields onto the report canvas\n- **Publish** to the Power BI Service to share",
        },
        {
          heading: "Power Query: repeatable cleaning",
          body: "Power Query records every cleaning step you click — remove columns, change types, split text, filter rows, merge tables — in the **Applied Steps** list. Next month, you hit **Refresh** and every step re-runs on the new data automatically.\n\nThat's a huge upgrade from manually cleaning a spreadsheet every week. Always check that column **data types** are correct (dates as dates, numbers as numbers) before loading.",
          tip: "Rename your Applied Steps (e.g. 'Removed test orders') so a colleague can follow your logic.",
        },
        {
          heading: "The data model and relationships",
          body: "Power BI works best with a **star schema**:\n\n- A **fact table** in the middle holding events and numbers (sales transactions)\n- **Dimension tables** around it describing things (Customers, Products, Calendar)\n\nYou connect them in **Model view** with relationships, usually **one-to-many** (one product, many sales). Once related, a filter on Product category automatically filters Sales.",
          example: `          Dim_Product
               |  1
               |
Dim_Date --1-- Fact_Sales --*-- Dim_Customer
          *    (date, product_id, customer_id, qty, amount)`,
          exampleLang: "text",
        },
        {
          heading: "DAX measures: the basics",
          body: "**DAX** is Power BI's formula language. A **measure** is a calculation that responds to whatever filters and slicers the user picks. Start with simple aggregations, then learn **CALCULATE**, which changes the filter context.\n\n- `SUM`, `AVERAGE`, `COUNTROWS`, `DISTINCTCOUNT` for basics\n- `DIVIDE(a, b)` handles divide-by-zero safely\n- `CALCULATE(expression, filter)` evaluates something under a modified filter",
          example: `Total Sales = SUM(Sales[Amount])

Order Count = COUNTROWS(Sales)

Avg Order Value = DIVIDE([Total Sales], [Order Count])

Online Sales = CALCULATE([Total Sales], Sales[Channel] = "Online")

Online Share = DIVIDE([Online Sales], [Total Sales])`,
          exampleLang: "excel",
          tip: "Prefer measures over calculated columns for totals and ratios. Measures recalculate per filter; calculated columns are fixed per row and bloat the file.",
        },
        {
          heading: "Making it interactive",
          body: "- **Slicers** let users filter by date, region, etc.\n- **Cross-filtering**: clicking a bar filters other visuals on the page\n- **Drill-through** pages show detail for one selected item\n- **Tooltips** reveal extra numbers on hover\n\nPublish to the Power BI Service to share with colleagues and schedule automatic refreshes.",
        },
      ],
      quiz: [
        {
          q: "Where do you clean and reshape data in Power BI so steps re-run on refresh?",
          options: ["DAX editor", "Power Query", "Report canvas", "Tooltips"],
          answer: 1,
          explain: "Power Query records each transformation as an Applied Step and replays them on refresh.",
        },
        {
          q: "In a star schema, which table typically holds the transactions and numeric amounts?",
          options: ["Dimension table", "Fact table", "Calendar table", "Lookup slicer"],
          answer: 1,
          explain: "Fact tables hold events (sales, clicks) with numbers; dimensions describe who/what/when.",
        },
        {
          q: "What does CALCULATE([Total Sales], Sales[Channel] = \"Online\") return?",
          options: [
            "Total sales for all channels",
            "Total sales with the filter changed to only Online",
            "The number of online channels",
            "An error — CALCULATE needs a table",
          ],
          answer: 1,
          explain: "CALCULATE evaluates the measure under a modified filter context — here, only Online.",
        },
        {
          q: "Why use DIVIDE([A], [B]) instead of [A] / [B] in DAX?",
          options: [
            "It's faster to type",
            "It handles division by zero gracefully",
            "It rounds automatically",
            "It only works on text",
          ],
          answer: 1,
          explain: "DIVIDE returns blank (or an alternate value) instead of an error when B is zero.",
        },
      ],
    },
    {
      id: "f7-s6",
      title: "Tableau Essentials",
      minutes: 16,
      xp: 150,
      skills: ["tableau", "visualization"],
      lesson: [
        {
          heading: "Dimensions and measures",
          body: "When you connect data in Tableau, fields are split into two kinds:\n\n- **Dimensions** (blue by default when discrete): categories you slice by — Region, Product, Customer name\n- **Measures** (green when continuous): numbers you aggregate — Sales, Profit, Quantity\n\nDrag a dimension to **Rows** and a measure to **Columns** and Tableau draws a bar chart, aggregating the measure (SUM by default).",
          tip: "Blue = discrete (separate headers), green = continuous (an axis). This explains most 'why does my chart look like that?' moments.",
        },
        {
          heading: "The Marks card",
          body: "The **Marks** card controls how data looks. Drop fields onto:\n\n- **Color** to split or shade by a field\n- **Size** to scale marks by a value\n- **Label** to show numbers on marks\n- **Detail** to add granularity without changing appearance\n- **Tooltip** to show extra info on hover\n\nThe **Show Me** panel suggests chart types based on the fields you selected — handy while you're learning.",
        },
        {
          heading: "Calculated fields",
          body: "Create new fields with **Analysis > Create Calculated Field**. The syntax will look familiar after Excel and SQL.",
          example: `// Profit ratio (aggregate first, then divide)
SUM([Profit]) / SUM([Sales])

// Order size label
IF [Sales] >= 500 THEN "Large"
ELSEIF [Sales] >= 100 THEN "Medium"
ELSE "Small"
END

// Days to ship
DATEDIFF('day', [Order Date], [Ship Date])`,
          exampleLang: "text",
          tip: "For ratios, use SUM([Profit]) / SUM([Sales]), not [Profit]/[Sales]. The second calculates per row, then sums the ratios — a classic wrong answer.",
        },
        {
          heading: "Dashboards and Tableau Public",
          body: "Individual charts are **sheets**. Combine sheets on a **dashboard**, add filters, and use **actions** so clicking one chart filters another. A **story** strings dashboards into a guided sequence.\n\n**Tableau Public** is free and publishes your work to a public online profile. That makes it a great portfolio: hiring managers can click and explore your dashboards. Just never upload confidential company data there.",
        },
      ],
      quiz: [
        {
          q: "In Tableau, 'Region' and 'Product Category' are typically…",
          options: ["Measures", "Dimensions", "Calculated fields", "Parameters"],
          answer: 1,
          explain: "They're categorical fields you slice by, so they're dimensions.",
        },
        {
          q: "Which calculated field gives a correct overall profit ratio?",
          options: [
            "[Profit] / [Sales]",
            "SUM([Profit]) / SUM([Sales])",
            "AVG([Profit] / [Sales])",
            "SUM([Profit] / [Sales])",
          ],
          answer: 1,
          explain: "Aggregate first, then divide. Row-level ratios summed or averaged don't equal the true overall ratio.",
        },
        {
          q: "You want bars colored by Segment. Where do you drop Segment?",
          options: ["Filters shelf", "Color on the Marks card", "Pages shelf", "Columns"],
          answer: 1,
          explain: "Placing a field on Color splits/colors marks by that field.",
        },
        {
          q: "What's a key caution with Tableau Public?",
          options: [
            "It can't make dashboards",
            "Everything you publish is publicly visible, so never use confidential data",
            "It costs a monthly fee",
            "It only supports pie charts",
          ],
          answer: 1,
          explain: "Tableau Public is free precisely because work is public. Use open datasets for portfolio projects.",
        },
      ],
    },
  ],
};
