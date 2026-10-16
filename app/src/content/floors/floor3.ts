import type { Floor } from '../types';

export const floor3: Floor = {
  id: 3,
  title: "Spreadsheets II",
  tagline: "Conditional maths, lookups, pivot tables, and your first dashboard.",
  color: "#84cc16",
  icon: "🔎",
  outcomes: [
    "Count, sum, and average with conditions using the IF and IFS families",
    "Pull data across tables with VLOOKUP, XLOOKUP, and INDEX/MATCH",
    "Summarise thousands of rows in seconds with pivot tables",
    "Pick the right chart and avoid misleading visuals",
    "Combine KPIs, a pivot, and charts into a simple one-page dashboard",
  ],
  steps: [
    {
      id: "f3-s1",
      title: "COUNTIF and SUMIF",
      minutes: 14,
      xp: 90,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Counting with a condition",
          body: `\`COUNTIF(range, criterion)\` counts the cells in a range that meet one condition.

Imagine an orders table: column B = region, column C = status, column D = amount.

Questions like "How many orders came from the North?" or "How many were refunded?" are one formula each.`,
          example: `=COUNTIF(B2:B500, "North")      -> orders from North
=COUNTIF(C2:C500, "Refunded")   -> refunded orders
=COUNTIF(D2:D500, ">100")       -> orders over 100`,
          exampleLang: "excel",
        },
        {
          heading: "Writing criteria",
          body: `Criteria are written as text in quotes:

- Exact match: \`"North"\` (not case-sensitive)
- Comparison: \`">100"\`, \`"<=50"\`, \`"<>Cancelled"\` (not equal)
- Wildcards: \`"*phone*"\` matches any text containing "phone"; \`?\` matches one character.
- Using a cell: \`">"&F1\` compares against the value in F1.

Pointing to a cell is better than typing values in, because you can change the cell and every formula updates.`,
          example: `F1 = 250
=COUNTIF(D2:D500, ">"&F1)        -> orders above whatever is in F1
=COUNTIF(A2:A500, "*Pro*")      -> product names containing "Pro"`,
          exampleLang: "excel",
        },
        {
          heading: "SUMIF: adding with a condition",
          body: `\`SUMIF(range, criterion, sum_range)\` checks the condition in one column and adds up the matching values from another.

Read it as: "look in **range** for **criterion**, and add the matching values from **sum_range**."`,
          example: `=SUMIF(B2:B500, "North", D2:D500)     -> total sales in North
=SUMIF(C2:C500, "<>Refunded", D2:D500) -> total excluding refunds
=SUMIF(D2:D500, ">1000")               -> sum of large orders only`,
          exampleLang: "excel",
          tip: "When the condition and the values are in the same column (last line), you can leave sum_range out.",
        },
        {
          heading: "Worked example: a region summary",
          body: `List each region in column F, then let one formula fill the table. Lock the data ranges with \`$\` so the formula copies down safely.`,
          example: `     F        G (orders)                         H (sales)
2    North    =COUNTIF($B$2:$B$500, F2)          =SUMIF($B$2:$B$500, F2, $D$2:$D$500)
3    South    =COUNTIF($B$2:$B$500, F3)          =SUMIF($B$2:$B$500, F3, $D$2:$D$500)
4    East     ...                                ...`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 4 },
      quiz: [
        {
          q: "Which formula counts orders with an amount (column D) of at least 50?",
          options: [
            "=COUNTIF(D2:D500, 50)",
            "=COUNTIF(D2:D500, \">=50\")",
            "=SUMIF(D2:D500, \">=50\")",
            "=COUNT(D2:D500>=50)",
          ],
          answer: 1,
          explain: "Comparison criteria go in quotes: \">=50\". SUMIF would add the amounts, not count them.",
        },
        {
          q: "In =SUMIF(B2:B100, \"Online\", E2:E100), what does E2:E100 represent?",
          options: [
            "The range to check for \"Online\"",
            "The values to add up when the condition matches",
            "The output cell",
            "The criteria",
          ],
          answer: 1,
          explain: "The third argument is the sum_range: values added for rows where B matches \"Online\".",
        },
        {
          q: "Which criterion matches any product name containing the word \"case\"?",
          options: ["\"case\"", "\"*case*\"", "\"?case?\"", "\"=case\""],
          answer: 1,
          explain: "The * wildcard matches any number of characters before and after.",
        },
        {
          q: "Target value is in H1. Which counts amounts greater than it?",
          options: [
            "=COUNTIF(D2:D500, \">H1\")",
            "=COUNTIF(D2:D500, \">\"&H1)",
            "=COUNTIF(D2:D500, >H1)",
            "=COUNTIF(H1, D2:D500)",
          ],
          answer: 1,
          explain: "\">H1\" would look for the literal text H1. Join the operator to the cell with &.",
        },
      ],
    },
    {
      id: "f3-s2",
      title: "Multiple Conditions: COUNTIFS, SUMIFS, AVERAGEIFS",
      minutes: 15,
      xp: 100,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Adding more conditions",
          body: `The **-IFS** versions accept multiple conditions, and a row is included only when **all** of them are true (like AND).

- \`COUNTIFS(range1, crit1, range2, crit2, ...)\`
- \`SUMIFS(sum_range, range1, crit1, range2, crit2, ...)\`
- \`AVERAGEIFS(avg_range, range1, crit1, range2, crit2, ...)\`

Watch out: in SUMIFS and AVERAGEIFS the **value range comes first**, unlike SUMIF where it comes last.`,
        },
        {
          heading: "Worked examples",
          body: `Same orders table: B = region, C = status, D = amount, E = order date.`,
          example: `Orders from North that were delivered:
=COUNTIFS(B2:B500, "North", C2:C500, "Delivered")

Sales in North over 100:
=SUMIFS(D2:D500, B2:B500, "North", D2:D500, ">100")

Average delivered order value in South:
=AVERAGEIFS(D2:D500, B2:B500, "South", C2:C500, "Delivered")`,
          exampleLang: "excel",
        },
        {
          heading: "Date ranges",
          body: `A super common request: "What were sales in March?" Use two conditions on the same date column, one for the start and one for the end.`,
          example: `H1 = 2025-03-01   H2 = 2025-03-31
=SUMIFS(D2:D500, E2:E500, ">="&H1, E2:E500, "<="&H2)`,
          exampleLang: "excel",
          tip: "All ranges in a -IFS formula must be the same size. B2:B500 with D2:D499 gives an error.",
        },
        {
          heading: "Building a two-way summary",
          body: `Combine locked and half-locked references to fill a whole grid with one formula: regions down the side, statuses across the top.

The formula below goes in H3 and is dragged right and down. \`$G3\` keeps the column locked (regions), \`H$2\` keeps the row locked (statuses).`,
          example: `       G        H (Delivered)   I (Refunded)
2               Delivered       Refunded
3      North    =COUNTIFS($B$2:$B$500, $G3, $C$2:$C$500, H$2)
4      South    ...`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 5 },
      quiz: [
        {
          q: "In SUMIFS, which argument comes first?",
          options: ["The first criterion", "The range to sum", "The first criteria range", "The output cell"],
          answer: 1,
          explain: "SUMIFS(sum_range, criteria_range1, criterion1, ...). This is the opposite of SUMIF.",
        },
        {
          q: "COUNTIFS(B:B, \"East\", C:C, \"Refunded\") counts rows where...",
          options: [
            "Region is East OR status is Refunded",
            "Region is East AND status is Refunded",
            "Region is not East",
            "Any row with a status",
          ],
          answer: 1,
          explain: "All -IFS criteria must be true at the same time (AND logic).",
        },
        {
          q: "Which formula gives the average amount (D) for orders in the West with status \"Delivered\"?",
          options: [
            "=AVERAGEIF(B2:B500, \"West\", D2:D500)",
            "=AVERAGEIFS(D2:D500, B2:B500, \"West\", C2:C500, \"Delivered\")",
            "=AVERAGEIFS(B2:B500, \"West\", C2:C500, \"Delivered\", D2:D500)",
            "=AVERAGE(D2:D500, \"West\", \"Delivered\")",
          ],
          answer: 1,
          explain: "AVERAGEIFS takes the average range first, then pairs of criteria ranges and criteria.",
        },
        {
          q: "How do you sum sales for Q1 (Jan 1 to Mar 31) with dates in column E?",
          options: [
            "Use one condition: \"Q1\"",
            "Use two conditions on E: \">=\" start date and \"<=\" end date",
            "Use COUNTIFS",
            "Sort by date and add by hand",
          ],
          answer: 1,
          explain: "A date range needs a lower bound and an upper bound, each as a separate condition on the same column.",
        },
      ],
    },
    {
      id: "f3-s3",
      title: "Lookups: VLOOKUP and XLOOKUP",
      minutes: 16,
      xp: 110,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Why lookups exist",
          body: `Data often lives in separate tables. Your **orders** table has a \`product_id\` but not the product name or price; those sit in a **products** table.

A lookup says: "Take this ID, find it in the other table, and bring back a matching value." It's how you join information together in a spreadsheet.`,
          example: `Orders                     Products (sheet "Products")
order_id | product_id       product_id | name        | price
5001     | P-03             P-01       | Mug         | 8.00
5002     | P-01             P-02       | Notebook    | 5.50
                            P-03       | Water bottle| 12.00`,
          exampleLang: "text",
        },
        {
          heading: "VLOOKUP",
          body: `\`VLOOKUP(lookup_value, table, col_index, FALSE)\`

- **lookup_value**: what you're searching for (the product_id).
- **table**: the lookup table. The ID **must be in its first column**.
- **col_index**: which column number of that table to return (1 = first).
- **FALSE**: exact match. Almost always what you want.`,
          example: `In Orders, C2:
=VLOOKUP(B2, Products!$A$2:$C$100, 2, FALSE)   -> "Water bottle"
=VLOOKUP(B2, Products!$A$2:$C$100, 3, FALSE)   -> 12.00`,
          exampleLang: "excel",
          tip: "Forgetting FALSE makes VLOOKUP do an approximate match, which can quietly return the wrong row. Always type it.",
        },
        {
          heading: "VLOOKUP's weaknesses",
          body: `VLOOKUP is everywhere in older workbooks, so you need to read it. But it has limits:

- It can only look **to the right**: the ID must be the leftmost column.
- The column number is **hard-coded**. Insert a column in the products table and \`3\` now points to the wrong field.
- It returns \`#N/A\` when nothing matches.`,
        },
        {
          heading: "XLOOKUP: the modern replacement",
          body: `\`XLOOKUP(lookup_value, lookup_range, return_range, [if_not_found])\`

You point directly at the column to search and the column to return. It can look left or right, defaults to exact match, and has a built-in "not found" value. It's available in Google Sheets and Excel 365/2021+.`,
          example: `=XLOOKUP(B2, Products!$A$2:$A$100, Products!$B$2:$B$100, "Not found")
-> "Water bottle"

Looking LEFT (find the ID from a name):
=XLOOKUP("Mug", Products!$B$2:$B$100, Products!$A$2:$A$100)   -> "P-01"`,
          exampleLang: "excel",
        },
        {
          heading: "Debugging #N/A",
          body: `When a lookup returns \`#N/A\`, the value wasn't found. Common causes:

- Extra spaces: "P-01 " is not "P-01". Fix with \`TRIM\`.
- Number vs. text: 1001 (number) is not "1001" (text).
- The ID genuinely doesn't exist in the lookup table (a real data issue worth reporting).
- The lookup range isn't locked with \`$\` and shifted when copied down.`,
        },
      ],
      game: { kind: "formula-forge", stage: 6 },
      quiz: [
        {
          q: "In =VLOOKUP(A2, D2:G50, 3, FALSE), which column's value is returned?",
          options: ["Column C", "Column D", "Column F", "Column G"],
          answer: 2,
          explain: "Column 3 of the table D:G is F (D=1, E=2, F=3).",
        },
        {
          q: "Your ID column is to the RIGHT of the names you want to return. Which function handles this easily?",
          options: ["VLOOKUP", "XLOOKUP", "SUMIF", "COUNTIF"],
          answer: 1,
          explain: "XLOOKUP uses separate lookup and return ranges, so it can look in either direction. VLOOKUP only returns columns to the right of the key.",
        },
        {
          q: "What does the FALSE argument in VLOOKUP do?",
          options: [
            "Returns FALSE if not found",
            "Forces an exact match",
            "Searches from the bottom",
            "Ignores blank cells",
          ],
          answer: 1,
          explain: "FALSE means exact match. Without it, VLOOKUP may return an approximate (and wrong) result.",
        },
        {
          q: "A lookup returns #N/A even though the ID appears to exist. Which is the most likely cause?",
          options: [
            "The ID has a hidden trailing space or is stored as text vs. number",
            "The spreadsheet is too big",
            "XLOOKUP doesn't support text",
            "The return column is formatted bold",
          ],
          answer: 0,
          explain: "Invisible spaces and number/text mismatches are the classic culprits. TRIM and VALUE help.",
        },
      ],
    },
    {
      id: "f3-s4",
      title: "INDEX/MATCH: the Flexible Classic",
      minutes: 15,
      xp: 120,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Two functions, one superpower",
          body: `Before XLOOKUP existed, analysts combined two functions to get flexible lookups. You'll still see it in many workbooks, and it works in every version of Excel.

- \`MATCH(value, range, 0)\` returns the **position** of a value in a range (0 = exact match).
- \`INDEX(range, n)\` returns the **nth item** in a range.

MATCH finds the row number; INDEX fetches the value at that row.`,
          example: `A2:A5 = "P-01", "P-02", "P-03", "P-04"
=MATCH("P-03", A2:A5, 0)    -> 3

B2:B5 = "Mug", "Notebook", "Water bottle", "Pen"
=INDEX(B2:B5, 3)            -> "Water bottle"`,
          exampleLang: "excel",
        },
        {
          heading: "Combining them",
          body: `Nest MATCH inside INDEX. Read it as: "From the return column, give me the item at the position where my ID appears in the ID column."`,
          example: `=INDEX(Products!$B$2:$B$100, MATCH(B2, Products!$A$2:$A$100, 0))
        ^ return this column             ^ find B2 in this column`,
          exampleLang: "excel",
          tip: "Always use 0 as MATCH's third argument for exact matching, just like FALSE in VLOOKUP.",
        },
        {
          heading: "Why people loved it",
          body: `- It can look **left or right**, because the return column is separate from the search column.
- Inserting columns doesn't break it: no hard-coded column number.
- It can be faster on very large sheets.

In modern tools, XLOOKUP does the same with simpler syntax. Knowing INDEX/MATCH means you can read and maintain any workbook a colleague hands you.`,
        },
        {
          heading: "Two-way lookup",
          body: `INDEX can take a row number **and** a column number. Use two MATCHes to find both: perfect for a grid like monthly sales by store.

Worked example: grid with stores in A3:A10, months in B2:M2, sales in B3:M10. Find sales for the store in P1 and month in P2.`,
          example: `=INDEX($B$3:$M$10,
       MATCH(P1, $A$3:$A$10, 0),
       MATCH(P2, $B$2:$M$2, 0))`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 7 },
      quiz: [
        {
          q: "C2:C6 = \"Red\", \"Blue\", \"Green\", \"Blue\", \"Pink\". What does =MATCH(\"Green\", C2:C6, 0) return?",
          options: ["Green", "3", "4", "C4"],
          answer: 1,
          explain: "MATCH returns the position in the range. Green is the 3rd item.",
        },
        {
          q: "What does INDEX(D2:D20, 5) return?",
          options: ["The value in D5", "The value in D6", "The number 5", "The position of D5"],
          answer: 1,
          explain: "Position 5 counting from D2 is D6 (D2=1, D3=2, D4=3, D5=4, D6=5).",
        },
        {
          q: "In INDEX/MATCH, what does MATCH provide to INDEX?",
          options: [
            "The value to return",
            "The row position where the lookup value was found",
            "The column header",
            "The sum of the range",
          ],
          answer: 1,
          explain: "MATCH finds where the value sits; INDEX uses that position to fetch from the return column.",
        },
        {
          q: "Why does INDEX/MATCH survive inserting a new column better than VLOOKUP?",
          options: [
            "It recalculates more often",
            "It references the return column directly instead of a hard-coded column number",
            "It ignores new columns",
            "It locks the sheet",
          ],
          answer: 1,
          explain: "VLOOKUP's col_index (e.g. 3) doesn't adjust; INDEX's range reference shifts automatically.",
        },
      ],
    },
    {
      id: "f3-s5",
      title: "Pivot Tables",
      minutes: 16,
      xp: 110,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Summaries without formulas",
          body: `A **pivot table** summarises a big table by grouping and aggregating, all through drag-and-drop. What took 20 SUMIFS formulas takes 20 seconds.

It answers questions like:

- Total sales **by region**.
- Number of orders **by month and product**.
- Average order value **by customer type**.

Your source data must be a clean table: one header row, one record per row, no blank columns, no merged cells.`,
        },
        {
          heading: "The four boxes",
          body: `Every pivot table has four areas:

- **Rows**: categories listed down the side (e.g. Region).
- **Columns**: categories across the top (e.g. Year).
- **Values**: the numbers to calculate, with a summary type: SUM, COUNT, AVERAGE, MAX...
- **Filters**: limit what's included (e.g. only Status = Delivered).

Create one: select your data, then **Insert > Pivot table**.`,
          example: `Rows: Region     Columns: Quarter     Values: SUM of Amount

Region | Q1      | Q2      | Grand Total
North  | 12,400  | 15,100  | 27,500
South  |  9,800  | 11,250  | 21,050
Total  | 22,200  | 26,350  | 48,550`,
          exampleLang: "text",
        },
        {
          heading: "Choosing the right summary",
          body: `Dragging a field into Values defaults to SUM for numbers and COUNT (COUNTA) for text. Change it on purpose:

- **SUM** of revenue: total money.
- **COUNT** of order_id: how many orders.
- **AVERAGE** of revenue: typical order size.
- **Show as % of total**: each group's share.

A common mistake is summing a column that shouldn't be summed, like customer ages or IDs.`,
          tip: "Grouping dates: right-click a date in the pivot and group by month, quarter, or year (Excel) or use \"Create pivot date group\" (Sheets).",
        },
        {
          heading: "Worked example: refund analysis",
          body: `Question: "Which product category has the highest refund rate?"

- Rows: Category
- Columns: Status
- Values: COUNT of order_id
- Then add a calculated column outside the pivot: Refunded / Total.

The answer appears in under a minute, and when new data is added you just **refresh** the pivot.`,
        },
      ],
      quiz: [
        {
          q: "You want total revenue per salesperson. Where does Salesperson go?",
          options: ["Values", "Rows", "Filters", "Nowhere, use VLOOKUP instead"],
          answer: 1,
          explain: "The category you're grouping by goes in Rows; revenue goes in Values as SUM.",
        },
        {
          q: "To show how many orders each region had, the Values field should use...",
          options: ["SUM of order_id", "COUNT of order_id", "AVERAGE of order_id", "MAX of order_id"],
          answer: 1,
          explain: "Counting IDs gives the number of orders. Summing IDs produces a meaningless number.",
        },
        {
          q: "Which source data problem will most likely break a pivot table?",
          options: [
            "Having 10,000 rows",
            "Merged cells and multiple header rows",
            "Dates in one column",
            "Numbers with two decimals",
          ],
          answer: 1,
          explain: "Pivots need a clean, flat table: a single header row and no merged cells.",
        },
        {
          q: "New rows were added to your source data. What do you do to update the pivot?",
          options: ["Rebuild it from scratch", "Refresh it (and check the source range includes new rows)", "Delete the old rows", "Nothing, it can never update"],
          answer: 1,
          explain: "Pivots don't always update automatically. Refresh, and make sure the source range covers the new data.",
        },
      ],
    },
    {
      id: "f3-s6",
      title: "Charts and a Mini Dashboard",
      minutes: 20,
      xp: 130,
      skills: ["spreadsheets", "visualization"],
      lesson: [
        {
          heading: "Pick the chart from the question",
          body: `Start with what you want to show, then choose the chart:

- **Compare categories** (sales by region): **bar or column** chart.
- **Change over time** (monthly revenue): **line** chart.
- **Part of a whole** with 2-4 parts: **pie** or, better, a stacked bar.
- **Relationship between two numbers** (ad spend vs. sales): **scatter** plot.
- **Distribution** (spread of order values): **histogram**.

When in doubt, a sorted bar chart is almost always readable.`,
        },
        {
          heading: "Charts that mislead (and how to fix them)",
          body: `Common chart crimes:

- **Truncated y-axis on a bar chart**: starting at 95 makes 96 vs. 98 look like a doubling. Bar charts should start at zero.
- **Too many pie slices**: 12 slices are unreadable. Use a bar chart.
- **3D effects**: they distort sizes. Avoid.
- **Unsorted bars**: sort largest to smallest unless order means something (like months).
- **Missing labels**: every chart needs a clear title, axis labels, and units.
- **Rainbow colours**: use one colour, plus one highlight colour for what matters.`,
          tip: "Write the title as the takeaway: \"North sales grew 22% in Q2\" beats \"Sales by Region\".",
        },
        {
          heading: "Making a chart in a spreadsheet",
          body: `- Select your data including headers (or a pivot table).
- **Insert > Chart**.
- Change the chart type in the editor.
- Edit the title, axis titles, and remove clutter (gridlines, legends you don't need).

Charts built from a pivot table update when you refresh the pivot.`,
        },
        {
          heading: "Your first mini dashboard",
          body: `A **dashboard** is a single screen that answers the key questions at a glance. A simple spreadsheet version:

- **Top row: KPI cards**: big single numbers, like total revenue, number of orders, average order value, refund rate.
- **Middle: a trend**: line chart of revenue by month.
- **Bottom: a breakdown**: bar chart of revenue by region or product.
- **A filter**: a dropdown or slicer (e.g. Year) that drives the formulas or pivots.

Put it on its own tab called "Dashboard", and keep raw data and calculations on other tabs.`,
          example: `KPI formulas on the Dashboard tab (data on "Orders" tab):
Revenue:        =SUM(Orders!D:D)
Orders:         =COUNTA(Orders!A2:A)
Avg order:      =ROUND(Revenue_cell / Orders_cell, 2)
Refund rate:    =COUNTIF(Orders!C:C, "Refunded") / COUNTA(Orders!A2:A)`,
          exampleLang: "excel",
        },
        {
          heading: "Dashboard design checklist",
          body: `Before sharing, ask:

- Can someone understand the main message in **5 seconds**?
- Are the most important numbers **top-left** (where eyes go first)?
- Is every number labelled with units and time period?
- Did I use consistent colours across charts?
- Did I remove anything that doesn't help answer the question?`,
        },
      ],
      game: { kind: "chart-doctor", stage: 0 },
      quiz: [
        {
          q: "Which chart best shows monthly website visits over two years?",
          options: ["Pie chart", "Line chart", "Scatter plot", "Donut chart"],
          answer: 1,
          explain: "Line charts are the standard for showing change over time.",
        },
        {
          q: "A bar chart's y-axis starts at 90 instead of 0. What's the problem?",
          options: [
            "Nothing, it saves space",
            "It exaggerates small differences between bars",
            "Bars can't be drawn above 90",
            "It hides the title",
          ],
          answer: 1,
          explain: "Bar length represents value, so a cut-off axis makes small differences look huge.",
        },
        {
          q: "You need to show market share for 11 competitors. Best choice?",
          options: ["Pie chart with 11 slices", "Sorted bar chart", "3D pie chart", "Line chart"],
          answer: 1,
          explain: "Too many slices make a pie unreadable; a sorted bar chart makes comparison easy.",
        },
        {
          q: "Where should the most important KPI usually go on a dashboard?",
          options: ["Bottom-right", "Top-left", "Hidden on a second tab", "In the footer"],
          answer: 1,
          explain: "Readers scan from the top-left first, so that's where the key number belongs.",
        },
        {
          q: "Which chart title is most useful?",
          options: ["Chart 1", "Sales by Region", "South region sales fell 15% vs. last quarter", "Data"],
          answer: 2,
          explain: "A takeaway title tells the reader what to notice, not just what's plotted.",
        },
      ],
    },
  ],
};
