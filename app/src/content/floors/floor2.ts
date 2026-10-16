import type { Floor } from '../types';

export const floor2: Floor = {
  id: 2,
  title: "Spreadsheets I",
  tagline: "Master cells, formulas, and cleaning: the bread and butter of every analyst.",
  color: "#22c55e",
  icon: "📗",
  outcomes: [
    "Use relative and absolute ($) references so formulas copy correctly",
    "Summarise data with SUM, AVERAGE, COUNT, COUNTA, MIN, MAX, and ROUND",
    "Reshape text with TRIM, LEFT, RIGHT, MID, UPPER, PROPER, CONCAT, and SPLIT",
    "Write logic with IF, AND, OR, and IFERROR",
    "Sort, filter, highlight, and clean a messy dataset so it can be trusted",
  ],
  steps: [
    {
      id: "f2-s1",
      title: "Cells, Ranges, and References",
      minutes: 14,
      xp: 70,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "The grid",
          body: `A spreadsheet is a grid. **Columns** are letters (A, B, C...), **rows** are numbers (1, 2, 3...).

A **cell** is one box, named by column then row: \`B3\` is column B, row 3.

A **range** is a rectangle of cells written with a colon: \`B2:B10\` means B2 down to B10. \`A1:D5\` is a block four columns wide and five rows tall.

Good habit: put **headers in row 1** and one record per row underneath.`,
        },
        {
          heading: "Your first formulas: SUM and AVERAGE",
          body: `Every formula starts with \`=\`. Without it, the spreadsheet treats what you type as plain text.

Imagine column B holds daily sales for a bakery in B2:B8.`,
          example: `=SUM(B2:B8)        -> total sales for the week
=AVERAGE(B2:B8)    -> average daily sales
=B2+B3             -> add two specific cells
=B2*1.2            -> B2 plus a 20% markup`,
          exampleLang: "excel",
          tip: "AVERAGE ignores empty cells but includes zeros. A blank day and a day with 0 sales are treated differently.",
        },
        {
          heading: "Relative references: formulas that move",
          body: `When you copy a formula down or across, its references **shift automatically**. This is called a **relative reference**.

If C2 contains \`=A2*B2\` (quantity times price) and you drag it down to C3, it becomes \`=A3*B3\`. That's exactly what you want for row-by-row calculations.`,
          example: `     A (qty)  B (price)  C (total)
2    3        4.00       =A2*B2   -> 12.00
3    5        2.50       =A3*B3   -> 12.50
4    2        9.00       =A4*B4   -> 18.00`,
          exampleLang: "excel",
        },
        {
          heading: "Absolute references: lock it with $",
          body: `Sometimes one cell must **stay fixed**, like a tax rate in \`F1\`. If you copy \`=C2*F1\` down, it becomes \`=C3*F2\`, and F2 is empty. Broken!

Add dollar signs to lock it: \`$F$1\`.

- \`$F$1\`: column and row both locked (absolute).
- \`F$1\`: only the row is locked.
- \`$F1\`: only the column is locked.

In most spreadsheets, press **F4** (Windows) while editing a reference to cycle through these options.`,
          example: `=C2*$F$1    copied down becomes  =C3*$F$1
                                  =C4*$F$1`,
          exampleLang: "excel",
        },
        {
          heading: "Worked example: share of total",
          body: `To show each product's share of total sales, divide each row by the grand total. The total must be locked.

Sales are in B2:B6. Put the total in B7 with \`=SUM(B2:B6)\`. In C2 write the formula below, format as a percentage, and drag down.`,
          example: `C2: =B2/$B$7
C3: =B3/$B$7   (after dragging)
C4: =B4/$B$7`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 0 },
      quiz: [
        {
          q: "What does the range A2:A20 refer to?",
          options: [
            "Only cells A2 and A20",
            "All cells in column A from row 2 to row 20",
            "Row 2 through column 20",
            "Cell A2 multiplied by 20",
          ],
          answer: 1,
          explain: "The colon means \"through\": every cell from A2 down to A20.",
        },
        {
          q: "C2 contains =A2+B2. You copy it to C5. What does C5 contain?",
          options: ["=A2+B2", "=A5+B5", "=A5+B2", "=$A$5+$B$5"],
          answer: 1,
          explain: "Relative references shift by the same number of rows you moved: 3 rows down, so A2 becomes A5 and B2 becomes B5.",
        },
        {
          q: "A discount rate sits in cell H1. Which formula can be safely copied down column D?",
          options: ["=C2*H1", "=C2*H$1", "=$C$2*H1", "=C2*$H1"],
          answer: 1,
          explain: "H$1 locks the row, so it always points to row 1 when copied down. ($H$1 would also work.)",
        },
        {
          q: "Cells B2:B4 contain 10, (blank), 20. What does =AVERAGE(B2:B4) return?",
          options: ["10", "15", "30", "Error"],
          answer: 1,
          explain: "AVERAGE skips blank cells, so it averages 10 and 20 to get 15. If the blank were a 0, the answer would be 10.",
        },
      ],
    },
    {
      id: "f2-s2",
      title: "Text Functions: Taming Messy Words",
      minutes: 15,
      xp: 80,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Why text functions matter",
          body: `Real data arrives with stray spaces, random capitals, and multiple facts crammed into one cell ("SKU-2041-RED"). Text functions let you fix it with formulas instead of retyping thousands of cells.

All text functions take a cell as input and return new text. You usually build the cleaned version in a **new column** and keep the original untouched.`,
        },
        {
          heading: "TRIM, UPPER, LOWER, PROPER",
          body: `- \`TRIM\` removes spaces at the start and end, and squashes double spaces inside to one.
- \`UPPER\` makes everything CAPITALS.
- \`LOWER\` makes everything lowercase.
- \`PROPER\` Capitalises The First Letter Of Each Word.

These are perfect for names and city fields typed by humans.`,
          example: `A2 = "   jane   SMITH "
=TRIM(A2)            -> "jane SMITH"
=PROPER(TRIM(A2))    -> "Jane Smith"
=UPPER("uk")         -> "UK"`,
          exampleLang: "excel",
          tip: "You can nest functions: the inner one runs first. PROPER(TRIM(A2)) trims, then capitalises.",
        },
        {
          heading: "LEFT, RIGHT, MID: slicing text",
          body: `These pull out part of a text string by position.

- \`LEFT(text, n)\`: first n characters.
- \`RIGHT(text, n)\`: last n characters.
- \`MID(text, start, n)\`: n characters beginning at position start (counting from 1).

Worked example: product codes like \`SKU-2041-RED\`.`,
          example: `A2 = "SKU-2041-RED"
=LEFT(A2, 3)      -> "SKU"
=MID(A2, 5, 4)    -> "2041"
=RIGHT(A2, 3)     -> "RED"`,
          exampleLang: "excel",
        },
        {
          heading: "Joining text: CONCAT and &",
          body: `To combine text from several cells, use \`CONCAT\` or the \`&\` operator. Remember to add spaces or separators yourself, inside quotes.`,
          example: `A2 = "Jane"   B2 = "Smith"
=CONCAT(A2, " ", B2)    -> "Jane Smith"
=A2 & " " & B2          -> "Jane Smith"
=B2 & ", " & A2         -> "Smith, Jane"`,
          exampleLang: "excel",
          tip: "In Excel, CONCAT works in newer versions; older ones use CONCATENATE. The & operator works everywhere.",
        },
        {
          heading: "SPLIT: one cell into many",
          body: `In Google Sheets, \`SPLIT(text, delimiter)\` breaks text into separate columns at each delimiter. A **delimiter** is the character that separates the pieces, like a comma or hyphen.

In Excel, use **Data > Text to Columns**, or \`TEXTSPLIT\` in recent versions.`,
          example: `A2 = "London,UK,2025"
=SPLIT(A2, ",")   -> "London" | "UK" | 2025   (fills 3 columns)`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 1 },
      quiz: [
        {
          q: "A2 contains \"  data   analyst \". What does =TRIM(A2) return?",
          options: ["\"dataanalyst\"", "\"data analyst\"", "\"  data   analyst \"", "\"DATA ANALYST\""],
          answer: 1,
          explain: "TRIM removes leading/trailing spaces and reduces internal runs of spaces to a single space.",
        },
        {
          q: "A2 is \"INV-88213\". Which formula returns \"88213\"?",
          options: ["=LEFT(A2, 5)", "=RIGHT(A2, 5)", "=MID(A2, 4, 5)", "=RIGHT(A2, 4)"],
          answer: 1,
          explain: "The number is the last 5 characters. MID(A2, 5, 5) would also work, but MID(A2, 4, 5) starts at the hyphen.",
        },
        {
          q: "Which formula turns \"mARIA lopez\" into \"Maria Lopez\"?",
          options: ["=UPPER(A2)", "=LOWER(A2)", "=PROPER(A2)", "=TRIM(A2)"],
          answer: 2,
          explain: "PROPER capitalises the first letter of each word and lowercases the rest.",
        },
        {
          q: "A2 = \"Paris\", B2 = \"France\". Which returns \"Paris - France\"?",
          options: [
            "=A2 & B2",
            "=CONCAT(A2, B2)",
            "=A2 & \" - \" & B2",
            "=A2 + \" - \" + B2",
          ],
          answer: 2,
          explain: "& joins text, and the separator \" - \" must be included explicitly. The + sign is for numbers, not text.",
        },
      ],
    },
    {
      id: "f2-s3",
      title: "Logic: IF, AND, OR, IFERROR",
      minutes: 16,
      xp: 90,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "IF: making decisions",
          body: `\`IF\` checks a condition and returns one value if it's TRUE, another if it's FALSE.

\`=IF(condition, value_if_true, value_if_false)\`

Worked example: flag orders over $100 as "Large".`,
          example: `B2 = 145
=IF(B2>100, "Large", "Standard")   -> "Large"

Comparison operators:  >  <  >=  <=  =  <>  (<> means "not equal")`,
          exampleLang: "excel",
        },
        {
          heading: "AND and OR: combining conditions",
          body: `- \`AND(a, b, ...)\` is TRUE only if **all** conditions are true.
- \`OR(a, b, ...)\` is TRUE if **at least one** is true.

Put them inside IF to handle more complex rules.

Example: a customer gets free shipping if they spent over $50 **and** live in the UK. A ticket is "Urgent" if priority is "High" **or** it's been open over 7 days.`,
          example: `=IF(AND(B2>50, C2="UK"), "Free", "Paid")
=IF(OR(D2="High", E2>7), "Urgent", "Normal")`,
          exampleLang: "excel",
        },
        {
          heading: "Nested IF: more than two outcomes",
          body: `To sort values into three or more buckets, put an IF inside another IF. The checks run in order, so start with the strictest.`,
          example: `Score in B2
=IF(B2>=90, "A", IF(B2>=75, "B", IF(B2>=60, "C", "Fail")))

B2 = 82  -> "B"`,
          exampleLang: "excel",
          tip: "Newer Excel and Sheets have IFS(), which reads more cleanly: =IFS(B2>=90,\"A\", B2>=75,\"B\", B2>=60,\"C\", TRUE,\"Fail\").",
        },
        {
          heading: "IFERROR: graceful failure",
          body: `Formulas sometimes produce errors like \`#DIV/0!\` (dividing by zero) or \`#N/A\` (not found). A sheet full of errors looks broken and can break other formulas.

\`IFERROR(formula, fallback)\` returns the formula's result, or the fallback if it errors.

Worked example: conversion rate = orders / visits, but some days had zero visits.`,
          example: `=B2/C2               -> #DIV/0! when C2 is 0
=IFERROR(B2/C2, 0)   -> 0 instead of an error
=IFERROR(B2/C2, "")  -> blank instead of an error`,
          exampleLang: "excel",
          tip: "Don't wrap everything in IFERROR blindly. It can hide real mistakes. Use it where you understand why the error happens.",
        },
      ],
      game: { kind: "formula-forge", stage: 2 },
      quiz: [
        {
          q: "B2 = 40. What does =IF(B2>=50, \"Pass\", \"Retry\") return?",
          options: ["\"Pass\"", "\"Retry\"", "TRUE", "40"],
          answer: 1,
          explain: "40 is not >= 50, so the condition is FALSE and IF returns the second value.",
        },
        {
          q: "Which formula returns \"VIP\" only if spend (B2) is over 1000 AND visits (C2) are at least 10?",
          options: [
            "=IF(OR(B2>1000, C2>=10), \"VIP\", \"\")",
            "=IF(AND(B2>1000, C2>=10), \"VIP\", \"\")",
            "=AND(IF(B2>1000), IF(C2>=10))",
            "=IF(B2>1000, \"VIP\", C2>=10)",
          ],
          answer: 1,
          explain: "AND requires both conditions. OR would return VIP if just one were true.",
        },
        {
          q: "=OR(A2=\"Red\", A2=\"Blue\") where A2 = \"Green\" returns...",
          options: ["TRUE", "FALSE", "\"Green\"", "#N/A"],
          answer: 1,
          explain: "Neither condition is true, so OR returns FALSE.",
        },
        {
          q: "Why would you use =IFERROR(B2/C2, 0)?",
          options: [
            "To make the division faster",
            "To show 0 instead of an error when C2 is zero or invalid",
            "To round the result to 0 decimal places",
            "To count how many errors exist",
          ],
          answer: 1,
          explain: "IFERROR catches errors like #DIV/0! and returns the fallback value instead.",
        },
      ],
    },
    {
      id: "f2-s4",
      title: "Summary Stats: COUNT, COUNTA, MIN, MAX, ROUND",
      minutes: 12,
      xp: 80,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "COUNT vs. COUNTA",
          body: `These two look similar but count different things:

- \`COUNT(range)\` counts cells containing **numbers** only.
- \`COUNTA(range)\` counts cells that are **not empty** (numbers, text, anything).

Worked example: a sign-up sheet with ages in B2:B6: 34, "unknown", (blank), 27, 41.`,
          example: `=COUNT(B2:B6)    -> 3   (34, 27, 41)
=COUNTA(B2:B6)   -> 4   (includes "unknown")
=COUNTBLANK(B2:B6) -> 1`,
          exampleLang: "excel",
          tip: "If COUNT is lower than you expect, some numbers may be stored as text. That's a cleaning clue!",
        },
        {
          heading: "MIN and MAX",
          body: `\`MIN\` returns the smallest number in a range, \`MAX\` the largest. Together they give the **range** of your data and are a fast sanity check.

If the minimum order value is -500 or the maximum age is 212, something is wrong with the data.`,
          example: `Order values in C2:C500
=MIN(C2:C500)            -> 3.50
=MAX(C2:C500)            -> 1,240.00
=MAX(C2:C500)-MIN(C2:C500) -> 1,236.50  (the spread)`,
          exampleLang: "excel",
        },
        {
          heading: "ROUND: tidy numbers",
          body: `\`ROUND(number, digits)\` rounds to a set number of decimal places.

- \`digits = 2\` rounds to cents.
- \`digits = 0\` rounds to a whole number.
- \`digits = -2\` rounds to the nearest hundred.

Important: **formatting** a cell to show 2 decimals only changes how it looks. \`ROUND\` actually changes the value, which matters when you add things up later.`,
          example: `=ROUND(3.14159, 2)    -> 3.14
=ROUND(2.5, 0)        -> 3
=ROUND(1847, -2)      -> 1800
=ROUND(AVERAGE(B2:B30), 1)  -> average to 1 decimal`,
          exampleLang: "excel",
        },
        {
          heading: "Putting it together: a summary block",
          body: `Analysts often build a small summary block at the top of a sheet so anyone can see the shape of the data at a glance.

Example for a column of delivery times (in hours) in D2:D1000:`,
          example: `Records:      =COUNTA(D2:D1000)
Numeric:      =COUNT(D2:D1000)
Fastest:      =MIN(D2:D1000)
Slowest:      =MAX(D2:D1000)
Average:      =ROUND(AVERAGE(D2:D1000), 1)
Total hours:  =ROUND(SUM(D2:D1000), 0)`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "formula-forge", stage: 3 },
      quiz: [
        {
          q: "A2:A5 contains 10, \"N/A\", 25, (blank). What does =COUNTA(A2:A5) return?",
          options: ["2", "3", "4", "1"],
          answer: 1,
          explain: "COUNTA counts non-empty cells: 10, \"N/A\", and 25. The blank is not counted.",
        },
        {
          q: "Same range. What does =COUNT(A2:A5) return?",
          options: ["2", "3", "4", "0"],
          answer: 0,
          explain: "COUNT only counts numbers: 10 and 25.",
        },
        {
          q: "What does =ROUND(7.846, 1) return?",
          options: ["7.8", "7.85", "7.9", "8"],
          answer: 0,
          explain: "Rounding to 1 decimal looks at the second decimal (4), which is below 5, so it rounds down to 7.8.",
        },
        {
          q: "MAX of a customer age column returns 230. What should you conclude?",
          options: [
            "You have a very old customer",
            "There's likely a data entry error worth investigating",
            "MAX is broken",
            "Ages should be deleted from the dataset",
          ],
          answer: 1,
          explain: "Impossible values are a red flag for data quality. MIN and MAX are quick ways to spot them.",
        },
      ],
    },
    {
      id: "f2-s5",
      title: "Sorting, Filtering, and Conditional Formatting",
      minutes: 12,
      xp: 70,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "Sorting without breaking your data",
          body: `Sorting reorders rows by one or more columns: A to Z, smallest to largest, newest to oldest.

The golden rule: **sort the whole table, not one column**. If you select only column B and sort it, the values in B separate from the rest of their row, and your data is silently scrambled.

Safe approach: click any cell in the table, then use **Data > Sort range** (Sheets) or **Data > Sort** (Excel) and tick "Data has header row".`,
          tip: "Sorting by multiple levels: e.g. sort by Region A-Z, then by Sales largest to smallest within each region.",
        },
        {
          heading: "Filters: show only what you need",
          body: `A filter **hides** rows that don't match your criteria, without deleting anything.

- Turn on filters: **Data > Create a filter** (Sheets) or **Data > Filter** (Excel).
- Click the arrow in a header to pick values or set conditions like "greater than 100".

Worked example: in a 5,000-row orders table, filter Country = "Canada" and Status = "Refunded" to instantly see all Canadian refunds.`,
        },
        {
          heading: "Conditional formatting: let colour spot patterns",
          body: `Conditional formatting changes a cell's look based on its value. It's how you make problems jump off the screen.

Common uses:

- Highlight sales below target in red.
- **Colour scales** (green to red) to show high vs. low values.
- Highlight **duplicate** values.
- Highlight blank cells that shouldn't be blank.

Find it under **Format > Conditional formatting** (Sheets) or **Home > Conditional Formatting** (Excel).`,
        },
        {
          heading: "Custom rules with formulas",
          body: `You can drive formatting with a formula. The formula should return TRUE for cells to highlight, and is written for the **top-left cell** of the range.

Example: highlight the whole row when an order is late (column E = "Late"). Apply to A2:F500 with the custom formula below. The \`$\` locks column E so every cell in the row checks the same column.`,
          example: `Apply to:  A2:F500
Custom formula:  =$E2="Late"`,
          exampleLang: "excel",
        },
      ],
      quiz: [
        {
          q: "You select only column C (prices) and sort it high to low. What's the risk?",
          options: [
            "Nothing, sorting is always safe",
            "Prices get separated from the rest of their rows, scrambling the data",
            "The prices get deleted",
            "The spreadsheet becomes read-only",
          ],
          answer: 1,
          explain: "Sorting one column alone breaks the link between that column and the other fields in each row.",
        },
        {
          q: "What does a filter do to rows that don't match?",
          options: ["Deletes them", "Hides them temporarily", "Moves them to a new sheet", "Colours them red"],
          answer: 1,
          explain: "Filters only hide non-matching rows; clearing the filter brings them back.",
        },
        {
          q: "You want to highlight entire rows where column D is greater than 1000. Which custom formula (applied from row 2) works?",
          options: ["=D2>1000", "=$D2>1000", "=$D$2>1000", "=D$2>1000"],
          answer: 1,
          explain: "$D2 locks the column so every cell in a row checks column D, while the row number still moves down.",
        },
      ],
    },
    {
      id: "f2-s6",
      title: "Cleaning Dirty Data",
      minutes: 18,
      xp: 110,
      skills: ["spreadsheets", "excel"],
      lesson: [
        {
          heading: "What \"dirty\" data looks like",
          body: `Before analysing anything, scan for the usual suspects:

- **Duplicates**: the same order entered twice.
- **Blanks**: missing emails, missing prices.
- **Inconsistent formats**: "USA", "U.S.", "United States"; dates as 03/04/25 and 2025-04-03.
- **Wrong data types**: numbers stored as text, so they won't sum.
- **Extra spaces and odd capitals**: "london " vs "London".
- **Impossible values**: negative quantities, ages of 0 or 300.

Cleaning is the Process phase, and it decides whether your final numbers can be trusted.`,
        },
        {
          heading: "Removing duplicates",
          body: `First decide what makes a row a duplicate. Two orders from the same customer on the same day might both be real. Usually you check a unique ID like \`order_id\`.

- Sheets: **Data > Data cleanup > Remove duplicates**.
- Excel: **Data > Remove Duplicates**.

To flag rather than delete, use a helper column:`,
          example: `=COUNTIF($A$2:$A$1000, A2)>1     -> TRUE if this order_id appears more than once`,
          exampleLang: "excel",
          tip: "Always keep a copy of the raw data on a separate tab before deleting anything. Cleaning should be reversible.",
        },
        {
          heading: "Handling blanks",
          body: `There's no single right answer. Choose based on context and **document your choice**:

- **Leave and exclude**: functions like AVERAGE skip blanks automatically.
- **Fill with a label**: e.g. "Unknown" for a missing region.
- **Fill with a value**: only if you have good reason (e.g. a missing discount truly means 0).
- **Remove the row**: if the key field (like amount) is missing and can't be recovered.

Never fill blanks with made-up numbers just to make a chart look complete.`,
          example: `=IF(B2="", "Unknown", B2)       -> label missing regions
=COUNTBLANK(B2:B1000)            -> how many are missing?`,
          exampleLang: "excel",
        },
        {
          heading: "Fixing inconsistent formats",
          body: `Standardise categories so "UK", "uk", " U.K." all become one value. Combine text functions with find-and-replace (**Ctrl + H**).

Worked example: a country column with mixed spelling.`,
          example: `Step 1  =UPPER(TRIM(A2))               "  u.k. " -> "U.K."
Step 2  =SUBSTITUTE(B2, ".", "")       "U.K."    -> "UK"
Step 3  Ctrl+H: replace "UNITED KINGDOM" with "UK"`,
          exampleLang: "excel",
        },
        {
          heading: "Fixing data types",
          body: `A classic trap: numbers stored as **text**. They often align to the left, show a little green triangle in Excel, and get ignored by SUM.

Fixes:

- \`=VALUE(A2)\` converts text that looks like a number into a real number.
- Remove currency symbols or commas first: \`=VALUE(SUBSTITUTE(A2, "$", ""))\`.
- Use **Format > Number** to set the column type.
- For dates stored as text, \`=DATEVALUE(A2)\` converts them.

Check your work: \`COUNT\` on the column should equal \`COUNTA\` if every value is now numeric.`,
          example: `A2 = "$1,250"  (text)
=VALUE(SUBSTITUTE(SUBSTITUTE(A2, "$", ""), ",", ""))   -> 1250`,
          exampleLang: "excel",
        },
      ],
      game: { kind: "clean-sweep", stage: 0 },
      quiz: [
        {
          q: "SUM on a price column returns 0, but you can clearly see prices. Most likely cause?",
          options: [
            "The prices are stored as text",
            "SUM only works on whole numbers",
            "The column is too long",
            "There are too many decimals",
          ],
          answer: 0,
          explain: "Text that looks like numbers is ignored by SUM. Convert with VALUE or change the format.",
        },
        {
          q: "Before using Remove Duplicates, what should you decide first?",
          options: [
            "Which colour to highlight duplicates",
            "Which column(s) define a true duplicate, like a unique order ID",
            "How many rows to delete",
            "Whether to sort descending",
          ],
          answer: 1,
          explain: "Two rows can look similar but both be valid. Define duplicates by a unique identifier.",
        },
        {
          q: "A region column has blanks. Which is generally the WORST approach?",
          options: [
            "Label them \"Unknown\"",
            "Investigate the source and recover them",
            "Fill them with random regions so totals look complete",
            "Document how many are missing in your report",
          ],
          answer: 2,
          explain: "Inventing values hides the problem and makes your analysis misleading.",
        },
        {
          q: "Which formula turns \" usa \" into \"USA\"?",
          options: ["=PROPER(A2)", "=UPPER(TRIM(A2))", "=TRIM(A2)", "=LOWER(UPPER(A2))"],
          answer: 1,
          explain: "TRIM removes the spaces, then UPPER capitalises every letter.",
        },
        {
          q: "Why keep a copy of the raw data before cleaning?",
          options: [
            "Spreadsheets need two tabs to work",
            "So you can check or undo your cleaning steps later",
            "Raw data loads faster",
            "It's required for conditional formatting",
          ],
          answer: 1,
          explain: "A raw copy makes cleaning reversible and auditable, which is essential if someone questions your numbers.",
        },
      ],
    },
  ],
};
