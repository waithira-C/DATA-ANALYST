import type { Scalar } from './formula'

export interface FormulaChallenge {
  prompt: string
  /** Where the answer goes, e.g. "E2". Shown highlighted in the grid. */
  target: string
  solution: string
  /** Learner must use at least one of these functions (upper-case). */
  mustUse?: string[]
  hint: string
}

export interface FormulaStage {
  story: string
  /** Rows of the grid starting at A1; first row is headers. */
  grid: Scalar[][]
  challenges: FormulaChallenge[]
}

const sales: Scalar[][] = [
  ['Rep', 'Region', 'Q1', 'Q2', 'Q3'],
  ['Amara', 'West', 1200, 1350, 1500],
  ['Bilal', 'East', 980, 1100, 870],
  ['Chloe', 'West', 1430, 1290, 1610],
  ['Dev', 'North', 760, 820, 905],
  ['Eva', 'East', 1530, 1475, 1600],
]

const contacts: Scalar[][] = [
  ['Raw name', 'Email', 'City code', 'Phone'],
  ['  jane   DOE ', 'JANE.DOE@MAIL.COM', 'LON-UK-01', '+44 7700 900123'],
  ['tomás silva', 'tomas@mail.com', 'LIS-PT-07', '+351 912 345 678'],
  ['ngozi  OKEKE', 'Ngozi@Mail.com', 'LAG-NG-12', '+234 803 555 0101'],
  ['li  wei', 'li.wei@mail.com', 'SIN-SG-03', '+65 8123 4567'],
]

const grades: Scalar[][] = [
  ['Student', 'Score', 'Attendance %', 'Paid?'],
  ['Ali', 82, 0.95, 'Yes'],
  ['Bea', 47, 0.7, 'No'],
  ['Cyd', 65, 0.88, 'Yes'],
  ['Dina', 91, 0.6, 'Yes'],
  ['Emil', 58, 0.92, 'No'],
]

const orders: Scalar[][] = [
  ['Order', 'Region', 'Product', 'Units', 'Revenue', 'Status'],
  [1001, 'West', 'Laptop', 2, 2400, 'Paid'],
  [1002, 'East', 'Monitor', 5, 1250, 'Paid'],
  [1003, 'West', 'Monitor', 3, 750, 'Refunded'],
  [1004, 'North', 'Laptop', 1, 1200, 'Paid'],
  [1005, 'East', 'Laptop', 4, 4800, 'Paid'],
  [1006, 'West', 'Keyboard', 10, 450, 'Paid'],
  [1007, 'North', 'Monitor', 2, 500, 'Pending'],
  [1008, 'East', 'Keyboard', 6, 270, 'Paid'],
]

const lookup: Scalar[][] = [
  ['SKU', 'Product', 'Price', 'Stock', '', 'Find SKU', 'Result'],
  ['A-100', 'Notebook', 3.5, 120, '', 'C-300', ''],
  ['B-200', 'Pen pack', 4.25, 340, '', 'Z-999', ''],
  ['C-300', 'Stapler', 9.99, 45, '', 'Stapler', ''],
  ['D-400', 'Desk lamp', 24.0, 18, '', '', ''],
  ['E-500', 'Mouse pad', 6.75, 77, '', '', ''],
]

/** Eight stages: Floor 2 uses 0–3, Floor 3 uses 4–7. */
export const FORMULA_STAGES: FormulaStage[] = [
  {
    story: 'Quarterly sales just landed. Your manager wants totals and averages, fast.',
    grid: sales,
    challenges: [
      { prompt: "Total Amara's sales across Q1–Q3.", target: 'F2', solution: '=SUM(C2:E2)', mustUse: ['SUM'], hint: 'Try =SUM(C2:E2)' },
      { prompt: 'Average Q1 sales across all reps.', target: 'C8', solution: '=AVERAGE(C2:C6)', mustUse: ['AVERAGE'], hint: 'AVERAGE over the Q1 column, rows 2 to 6.' },
      { prompt: "Q2 growth for Chloe: Q2 minus Q1.", target: 'F4', solution: '=D4-C4', hint: 'Simple arithmetic: =D4-C4' },
    ],
  },
  {
    story: 'The CRM export is a mess. Clean up names, emails and codes.',
    grid: contacts,
    challenges: [
      { prompt: 'Clean the name in A2: remove extra spaces and capitalise properly → "Jane Doe".', target: 'E2', solution: '=PROPER(TRIM(A2))', mustUse: ['PROPER'], hint: 'Nest them: =PROPER(TRIM(A2))' },
      { prompt: 'Make the email in B2 all lowercase.', target: 'F2', solution: '=LOWER(B2)', mustUse: ['LOWER'], hint: '=LOWER(B2)' },
      { prompt: 'Extract the 3-letter city code ("LON") from C2.', target: 'G2', solution: '=LEFT(C2,3)', mustUse: ['LEFT', 'MID'], hint: 'LEFT takes characters from the start: =LEFT(C2,3)' },
      { prompt: 'Extract the country code ("UK") from C2. It is the 2 characters starting at position 5.', target: 'H2', solution: '=MID(C2,5,2)', mustUse: ['MID'], hint: '=MID(text, start, length)' },
    ],
  },
  {
    story: 'The training academy needs automatic pass/fail flags.',
    grid: grades,
    challenges: [
      { prompt: 'In E2, show "Pass" if Ali\'s score is 60 or more, otherwise "Fail".', target: 'E2', solution: '=IF(B2>=60,"Pass","Fail")', mustUse: ['IF'], hint: '=IF(condition, value_if_true, value_if_false)' },
      { prompt: 'In F2, return TRUE only if Ali scored 60+ AND attendance is at least 0.8.', target: 'F2', solution: '=AND(B2>=60,C2>=0.8)', mustUse: ['AND'], hint: '=AND(B2>=60, C2>=0.8)' },
      { prompt: 'Certificate check for Dina (row 5): "Eligible" if score ≥ 60 AND paid is "Yes", else "Not yet".', target: 'G5', solution: '=IF(AND(B5>=60,D5="Yes"),"Eligible","Not yet")', mustUse: ['IF'], hint: 'Put AND(...) inside the IF condition.' },
      { prompt: 'Safe division: B2 divided by the empty cell H1, returning 0 instead of an error.', target: 'H2', solution: '=IFERROR(B2/H1,0)', mustUse: ['IFERROR'], hint: '=IFERROR(B2/H1, 0)' },
    ],
  },
  {
    story: 'A quick stats snapshot for the weekly meeting.',
    grid: sales,
    challenges: [
      { prompt: 'Highest Q3 number across all reps.', target: 'E8', solution: '=MAX(E2:E6)', mustUse: ['MAX'], hint: '=MAX(range)' },
      { prompt: 'Lowest Q1 number.', target: 'C9', solution: '=MIN(C2:C6)', mustUse: ['MIN'], hint: '=MIN(range)' },
      { prompt: 'How many reps are listed? Count the names in A2:A6.', target: 'A8', solution: '=COUNTA(A2:A6)', mustUse: ['COUNTA'], hint: 'COUNT only counts numbers. Names are text, so use COUNTA.' },
      { prompt: 'Average Q2 rounded to 1 decimal place.', target: 'D8', solution: '=ROUND(AVERAGE(D2:D6),1)', mustUse: ['ROUND'], hint: '=ROUND(AVERAGE(D2:D6), 1)' },
    ],
  },
  {
    story: 'Regional managers want conditional counts and sums.',
    grid: orders,
    challenges: [
      { prompt: 'How many orders came from the West region?', target: 'H2', solution: '=COUNTIF(B2:B9,"West")', mustUse: ['COUNTIF'], hint: '=COUNTIF(range, "West")' },
      { prompt: 'Total revenue from the East region.', target: 'H3', solution: '=SUMIF(B2:B9,"East",E2:E9)', mustUse: ['SUMIF'], hint: '=SUMIF(criteria_range, "East", sum_range)' },
      { prompt: 'How many orders have more than 3 units?', target: 'H4', solution: '=COUNTIF(D2:D9,">3")', mustUse: ['COUNTIF'], hint: 'Comparison criteria go in quotes: ">3"' },
      { prompt: 'Total revenue from orders that are NOT refunded.', target: 'H5', solution: '=SUMIF(F2:F9,"<>Refunded",E2:E9)', mustUse: ['SUMIF'], hint: '"<>Refunded" means "not equal to Refunded".' },
    ],
  },
  {
    story: 'Now with multiple conditions at once.',
    grid: orders,
    challenges: [
      { prompt: 'Count Paid orders in the East region.', target: 'H2', solution: '=COUNTIFS(B2:B9,"East",F2:F9,"Paid")', mustUse: ['COUNTIFS'], hint: '=COUNTIFS(range1, crit1, range2, crit2)' },
      { prompt: 'Total revenue for Laptops that were Paid.', target: 'H3', solution: '=SUMIFS(E2:E9,C2:C9,"Laptop",F2:F9,"Paid")', mustUse: ['SUMIFS'], hint: 'SUMIFS puts the sum range FIRST.' },
      { prompt: 'Average revenue of West-region orders.', target: 'H4', solution: '=AVERAGEIFS(E2:E9,B2:B9,"West")', mustUse: ['AVERAGEIFS', 'AVERAGEIF'], hint: '=AVERAGEIFS(avg_range, criteria_range, "West")' },
    ],
  },
  {
    story: 'The warehouse needs prices looked up from the product table.',
    grid: lookup,
    challenges: [
      { prompt: 'Using VLOOKUP, find the Product name for the SKU in F2.', target: 'G2', solution: '=VLOOKUP(F2,A2:D6,2,FALSE)', mustUse: ['VLOOKUP'], hint: '=VLOOKUP(key, table, column_number, FALSE)' },
      { prompt: 'Using XLOOKUP, find the Price for the SKU in F2.', target: 'H2', solution: '=XLOOKUP(F2,A2:A6,C2:C6)', mustUse: ['XLOOKUP'], hint: '=XLOOKUP(key, lookup_column, return_column)' },
      { prompt: 'SKU in F3 does not exist. Use XLOOKUP to return "Not found" instead of #N/A.', target: 'G3', solution: '=XLOOKUP(F3,A2:A6,B2:B6,"Not found")', mustUse: ['XLOOKUP', 'IFERROR'], hint: 'XLOOKUP has a 4th argument for "if not found".' },
    ],
  },
  {
    story: 'Lookups that go left: the INDEX/MATCH combo.',
    grid: lookup,
    challenges: [
      { prompt: 'Which row position (1–5) is "Stapler" in the Product column B2:B6? Use MATCH.', target: 'G4', solution: '=MATCH(F4,B2:B6,0)', mustUse: ['MATCH'], hint: '=MATCH(value, range, 0). The 0 means exact match.' },
      { prompt: 'Return the 4th value of the Stock column (D2:D6) using INDEX.', target: 'H4', solution: '=INDEX(D2:D6,4)', mustUse: ['INDEX'], hint: '=INDEX(range, position)' },
      { prompt: 'Look LEFT: find the SKU for the product named in F4, using INDEX + MATCH.', target: 'G5', solution: '=INDEX(A2:A6,MATCH(F4,B2:B6,0))', mustUse: ['INDEX'], hint: '=INDEX(A2:A6, MATCH(F4, B2:B6, 0))' },
    ],
  },
]
