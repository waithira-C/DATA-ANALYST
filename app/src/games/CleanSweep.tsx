import type { GameProps } from './meta'
import ChoiceGame, { type ChoiceRound } from './ChoiceGame'

function Row({ cols, row, bad }: { cols: string[]; row: string[]; bad: number[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full font-mono text-xs">
        <thead className="bg-ink-800"><tr>{cols.map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-sky-300">{c}</th>)}</tr></thead>
        <tbody>
          <tr>
            {row.map((v, i) => (
              <td key={i} className={`whitespace-pre px-3 py-2 ${bad.includes(i) ? 'bg-rose-500/20 text-rose-200 outline outline-1 -outline-offset-1 outline-rose-400' : ''}`}>
                {v === '' ? <span className="text-ink-400">(blank)</span> : `"${v}"`.replace(/^"|"$/g, '')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const opt = (text: string, points: number, feedback: string) => ({ text, points, feedback })

const STAGES: { story: string; rounds: ChoiceRound[] }[] = [
  {
    story: 'A customer sheet is about to feed the monthly dashboard. Catch the dirt first.',
    rounds: [
      {
        visual: <Row cols={['name', 'city', 'signup']} row={['  Maria   Lopez ', 'Madrid', '2026-01-04']} bad={[0]} />,
        question: 'What is wrong with the highlighted cell, and what is the best fix?',
        options: [
          opt('Extra spaces: apply `=TRIM()`', 10, 'TRIM removes leading/trailing spaces and collapses double spaces. Lookups and duplicates break without it.'),
          opt('Wrong case: apply `=UPPER()`', 0, 'The case is fine; the problem is the spaces.'),
          opt('Nothing, spaces are invisible anyway', 0, 'Invisible spaces make "Maria Lopez" ≠ "  Maria   Lopez ", so lookups and duplicate checks fail.'),
        ],
      },
      {
        visual: <Row cols={['name', 'city', 'signup']} row={['Tom Reed', 'new york', '2026-01-05']} bad={[1]} />,
        question: 'Other rows say "New York". This one says "new york". Fix?',
        options: [
          opt('Standardise with `=PROPER()` so every value matches', 10, 'Consistent categories mean pivot tables won\'t split one city into two rows.'),
          opt('Delete the row', 0, 'Never throw away valid data for a formatting issue.'),
          opt('Leave it: pivot tables ignore case', 3, 'Some tools do and some don\'t (e.g. Power BI is case-insensitive, Python is not). Standardise to be safe.'),
        ],
      },
      {
        visual: <Row cols={['order_id', 'amount', 'date']} row={['A-1043', '$1,250.00', '2026-02-11']} bad={[1]} />,
        question: 'The amount column won\'t SUM. Why?',
        options: [
          opt('It\'s stored as text because of the "$" and ","', 10, 'Strip the symbols (Find & Replace or VALUE/SUBSTITUTE) and convert to a number format.'),
          opt('SUM can\'t handle decimals', 0, 'SUM handles decimals fine.'),
          opt('The date column is in the way', 0, 'Each column is independent; the issue is the data type of amount.'),
        ],
      },
      {
        visual: <Row cols={['order_id', 'amount', 'date']} row={['A-1044', '980', '11/02/2026']} bad={[2]} />,
        question: 'Every other date is ISO format (2026-02-11). Is this 11 Feb or 2 Nov?',
        options: [
          opt('Ambiguous: check the source system\'s locale, then convert all dates to one format', 10, 'Mixed date formats are a classic silent bug. Confirm the source, then standardise.'),
          opt('It\'s obviously 2 November', 0, 'In many countries 11/02 means 11 February. Never guess. Verify it.'),
          opt('Delete all dates and re-type them', 0, 'Too slow and error-prone. Convert systematically.'),
        ],
      },
      {
        visual: <Row cols={['order_id', 'customer', 'amount']} row={['A-1050', 'Jin Park', '']} bad={[2]} />,
        question: 'A blank amount. What should a careful analyst do first?',
        options: [
          opt('Investigate why it\'s missing, then decide: fill from source, flag, or exclude, and document it', 10, 'Missing data has causes. Your choice changes the totals, so record it.'),
          opt('Fill it with 0', 3, 'Zero says "free order", which may be false and drags averages down. Only do this if 0 is truly correct.'),
          opt('Fill it with the column average', 3, 'Sometimes OK for modelling, but in financial reporting it invents revenue. Investigate first.'),
        ],
      },
      {
        visual: <Row cols={['order_id', 'customer', 'amount']} row={['A-1043', 'Maria Lopez', '1250']} bad={[0]} />,
        question: 'Order A-1043 already appeared earlier with the same values. Fix?',
        options: [
          opt('Remove the exact duplicate (Data → Remove duplicates) after confirming it\'s not a real repeat order', 10, 'Duplicates inflate revenue. Confirm with the ID, then dedupe.'),
          opt('Keep both: more data is better', 0, 'Double counting overstates revenue.'),
          opt('Delete both copies to be safe', 0, 'That loses a real order.'),
        ],
      },
    ],
  },
  {
    story: 'You loaded a CSV into pandas. `df.info()` and `df.head()` reveal problems.',
    rounds: [
      {
        visual: <Row cols={['column', 'dtype', 'sample']} row={['price', 'object', '"19.99"']} bad={[1]} />,
        question: '`price` is dtype **object** (text). What fixes it?',
        options: [
          opt('`df["price"] = pd.to_numeric(df["price"], errors="coerce")`', 10, 'to_numeric converts, and errors="coerce" turns junk into NaN so you can inspect it.'),
          opt('`df["price"].sum()` will work anyway', 0, 'Summing strings concatenates them or errors.'),
          opt('`df.dropna()`', 0, 'dropna removes missing rows; it doesn\'t change data types.'),
        ],
      },
      {
        visual: <Row cols={['column', 'dtype', 'non-null']} row={['email', 'object', '4,812 / 5,000']} bad={[2]} />,
        question: '188 emails are missing. You\'re analysing purchase totals, not emails. Best move?',
        options: [
          opt('Keep the rows. Missing email doesn\'t affect purchase totals, so note it in your data log', 10, 'Only drop rows when the missing field matters for this analysis.'),
          opt('`df.dropna()` on the whole frame', 0, 'That throws away 188 real purchases and biases totals.'),
          opt('Fill emails with "unknown@x.com"', 3, 'Harmless here, but fake values can leak into exports. A flag column is cleaner.'),
        ],
      },
      {
        visual: <Row cols={['column', 'dtype', 'sample']} row={['order_date', 'object', '"2026-03-14"']} bad={[1]} />,
        question: 'You need monthly trends. `order_date` is text. Fix?',
        options: [
          opt('`pd.to_datetime(df["order_date"])`, then use `.dt.month` / `.dt.to_period("M")`', 10, 'Real datetimes unlock resampling, sorting and date parts.'),
          opt('Slice the string with `[:7]` forever', 3, 'Works in a pinch, but you lose date maths and sorting safety.'),
          opt('Convert to int', 0, '"2026-03-14" isn\'t an integer.'),
        ],
      },
      {
        visual: <Row cols={['country', 'count']} row={['"UK", "U.K.", "United Kingdom"', '3 variants']} bad={[0]} />,
        question: 'One country, three spellings. Fix?',
        options: [
          opt('Map variants to one value: `df["country"].replace({"U.K.": "UK", "United Kingdom": "UK"})`', 10, 'A mapping dict is explicit, repeatable and reviewable.'),
          opt('Group by country and add them up by hand', 3, 'Manual fixes aren\'t reproducible next month.'),
          opt('Ignore it: it\'s only labels', 0, 'Your UK total would be split three ways.'),
        ],
      },
      {
        visual: <Row cols={['age', 'count']} row={['-4, 0, 212', 'impossible values']} bad={[0]} />,
        question: 'Ages of -4 and 212 appear. What are these?',
        options: [
          opt('Invalid values: filter to a plausible range (e.g. 0–110) and report how many were removed', 10, 'Range checks are a core data-quality test. Always quantify what you exclude.'),
          opt('Outliers that should be kept', 0, 'Outliers are unusual but possible. These values are impossible.'),
          opt('Replace with the mean age', 3, 'Possible later, but first flag and count them; the cause may be a system bug.'),
        ],
      },
    ],
  },
  {
    story: 'Combining tables: orders + customers + a second export. Avoid the classic merge traps.',
    rounds: [
      {
        question: 'After `orders.merge(customers, on="customer_id")`, your row count **grew** from 10,000 to 10,380. Why?',
        options: [
          opt('`customers` has duplicate customer_ids, so some orders matched twice', 10, 'Check `customers["customer_id"].duplicated().sum()` and dedupe before merging. Pass `validate="many_to_one"` to catch it.'),
          opt('Merges always add rows', 0, 'A clean many-to-one merge keeps the row count the same.'),
          opt('pandas made a bug', 0, 'pandas did what you asked. The data had duplicate keys.'),
        ],
      },
      {
        question: 'Orders from new customers vanished after the merge. Which `how=` keeps every order?',
        options: [
          opt('`how="left"` with orders on the left', 10, 'Left join keeps every row from the left table; unmatched customer columns become NaN.'),
          opt('`how="inner"`', 0, 'Inner join drops orders whose customer isn\'t in the customer table.'),
          opt('`how="right"`', 0, 'That keeps all customers, not all orders.'),
        ],
      },
      {
        question: 'January and February exports have identical columns. How do you stack them?',
        options: [
          opt('`pd.concat([jan, feb], ignore_index=True)`', 10, 'concat stacks rows; merge joins columns by key.'),
          opt('`jan.merge(feb)`', 0, 'merge matches rows on keys. You want to stack them.'),
          opt('Copy-paste in Excel', 3, 'Works once, but it isn\'t reproducible.'),
        ],
      },
      {
        question: 'After stacking, some orders appear in both months\' exports. Remove repeats by order ID:',
        options: [
          opt('`df.drop_duplicates(subset="order_id", keep="last")`', 10, 'Deduping on the business key (order_id) with keep="last" keeps the most recent version.'),
          opt('`df.drop_duplicates()`', 3, 'This only removes rows identical in every column. An updated status makes them look different.'),
          opt('`df.dropna()`', 0, 'That handles missing values, not duplicates.'),
        ],
      },
      {
        question: 'Customer IDs are `"00123"` in one table and `123` in the other, so nothing matches. Fix?',
        options: [
          opt('Make the key types consistent before merging, e.g. convert both to zero-padded strings', 10, 'Join keys must share type and format. Always check `dtypes` before merging.'),
          opt('Use how="outer"', 0, 'You\'d just get two unmatched halves.'),
          opt('Merge on customer name instead', 3, 'Names aren\'t unique and change. Fix the key instead.'),
        ],
      },
    ],
  },
]

export default function CleanSweep({ stage, onComplete }: GameProps) {
  const s = STAGES[stage] ?? STAGES[0]
  return <ChoiceGame icon="🧹" title="Clean Sweep" story={s.story} rounds={s.rounds} onComplete={onComplete} accent="violet" />
}
