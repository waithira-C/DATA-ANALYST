import { useEffect, useState } from 'react'
import type { GameProps } from './meta'
import { GameFrame, Feedback, StageClear, scoreFrom } from './GameFrame'
import { inline } from '../components/Rich'
import Spinner from '../components/Spinner'

const PYODIDE_VERSION = '0.27.2'
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

interface Pyodide {
  loadPackage: (p: string | string[]) => Promise<void>
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (o: { batched: (s: string) => void }) => void
  setStderr: (o: { batched: (s: string) => void }) => void
}
declare global { interface Window { loadPyodide?: (o: { indexURL: string }) => Promise<Pyodide> } }

let pyPromise: Promise<Pyodide> | null = null
function getPyodide(): Promise<Pyodide> {
  if (!pyPromise) {
    pyPromise = new Promise<void>((res, rej) => {
      if (window.loadPyodide) return res()
      const s = document.createElement('script')
      s.src = `${PYODIDE_URL}pyodide.js`
      s.onload = () => res()
      s.onerror = () => rej(new Error('Could not download Python (Pyodide). Check your connection.'))
      document.head.appendChild(s)
    })
      .then(() => window.loadPyodide!({ indexURL: PYODIDE_URL }))
      .then(async (py) => { await py.loadPackage('pandas'); return py })
    pyPromise.catch(() => { pyPromise = null })
  }
  return pyPromise
}

const SALES_CSV = `order_id,region,product,units,price,status,order_date
1,West,Laptop,2,1200,Paid,2026-01-03
2,East,Monitor,5,250,Paid,2026-01-04
3,West,Monitor,3,250,Refunded,2026-01-04
4,North,Laptop,1,1200,Paid,2026-01-06
5,East,Laptop,4,1200,Paid,2026-01-07
6,West,Keyboard,10,45,Paid,2026-01-08
7,North,Monitor,2,250,Pending,2026-01-09
8,East,Keyboard,6,45,Paid,2026-01-10
9,South,Laptop,3,1200,Paid,2026-01-11
10,South,Keyboard,,45,Paid,2026-01-12`

export const SETUP = `
import pandas as pd, io
df = pd.read_csv(io.StringIO("""${SALES_CSV}"""))
`

interface PyTask { prompt: string; starter: string; test: string; hint: string; solution: string }

/** Five stages that follow Floor 8. Tests are plain Python asserts run after the learner's code. */
export const STAGES: { story: string; tasks: PyTask[] }[] = [
  {
    story: 'Python warm-up: the building blocks you\'ll use every day.',
    tasks: [
      { prompt: 'Create a list `sales` with the numbers 120, 340 and 95, then set `total` to their sum.', starter: 'sales = \ntotal = ', test: 'assert sales == [120, 340, 95], "sales should be [120, 340, 95]"\nassert total == 555, "total should be 555"', hint: 'Use `sum(sales)`.', solution: 'sales = [120, 340, 95]\ntotal = sum(sales)' },
      { prompt: 'Create a dict `prices` mapping "latte" → 4.2 and "tea" → 2.8. Then set `latte_price` by looking up "latte".', starter: 'prices = {}\nlatte_price = ', test: 'assert prices == {"latte": 4.2, "tea": 2.8}\nassert latte_price == 4.2', hint: 'Look up with `prices["latte"]`.', solution: 'prices = {"latte": 4.2, "tea": 2.8}\nlatte_price = prices["latte"]' },
      { prompt: 'Write a function `vat(amount)` that returns the amount plus 20%, rounded to 2 decimals.', starter: 'def vat(amount):\n    return ', test: 'assert vat(100) == 120.0\nassert vat(9.99) == 11.99', hint: '`round(amount * 1.2, 2)`', solution: 'def vat(amount):\n    return round(amount * 1.2, 2)' },
      { prompt: 'Loop over `[3, 8, 1, 12]` and build a list `big` containing only numbers greater than 5.', starter: 'big = []\nfor n in [3, 8, 1, 12]:\n    ', test: 'assert big == [8, 12]', hint: 'Inside the loop: `if n > 5: big.append(n)`', solution: 'big = []\nfor n in [3, 8, 1, 12]:\n    if n > 5:\n        big.append(n)' },
    ],
  },
  {
    story: 'A `df` of sales orders is loaded. Get to know it.',
    tasks: [
      { prompt: 'Set `n_rows` to the number of rows in `df`.', starter: 'n_rows = ', test: 'assert n_rows == 10', hint: '`len(df)` or `df.shape[0]`.', solution: 'n_rows = len(df)' },
      { prompt: 'Print the first 3 rows with `head`, then set `cols` to the list of column names.', starter: 'print(df.head(3))\ncols = ', test: 'assert cols == list(df.columns)', hint: '`list(df.columns)`', solution: 'print(df.head(3))\ncols = list(df.columns)' },
      { prompt: 'Select just the `region` and `units` columns into `sub`.', starter: 'sub = ', test: 'assert list(sub.columns) == ["region", "units"] and len(sub) == 10', hint: 'Double brackets: `df[["region", "units"]]`', solution: 'sub = df[["region", "units"]]' },
      { prompt: 'Use `.loc` to get the `product` of the row with index 4 into `p`.', starter: 'p = ', test: 'assert p == "Laptop"', hint: '`df.loc[4, "product"]`', solution: 'p = df.loc[4, "product"]' },
    ],
  },
  {
    story: 'Filter the data to answer specific questions.',
    tasks: [
      { prompt: 'Keep only rows where `status` is "Paid". Store the result in `paid`.', starter: 'paid = ', test: 'assert len(paid) == 8 and (paid["status"] == "Paid").all()', hint: 'Boolean mask: `df[df["status"] == "Paid"]`', solution: 'paid = df[df["status"] == "Paid"]' },
      { prompt: 'Rows in the **West** region with **units > 2** → `west_big`.', starter: 'west_big = ', test: 'assert sorted(west_big["order_id"]) == [3, 6]', hint: 'Combine with `&` and wrap each condition in parentheses.', solution: 'west_big = df[(df["region"] == "West") & (df["units"] > 2)]' },
      { prompt: 'Rows whose product is Laptop **or** Monitor using `.isin` → `lm`.', starter: 'lm = ', test: 'assert len(lm) == 7', hint: '`df[df["product"].isin(["Laptop", "Monitor"])]`', solution: 'lm = df[df["product"].isin(["Laptop", "Monitor"])]' },
    ],
  },
  {
    story: 'Clean the data before anyone builds a chart on it.',
    tasks: [
      { prompt: 'Count missing values per column into `missing` (a Series).', starter: 'missing = ', test: 'assert missing["units"] == 1 and missing.sum() == 1', hint: '`df.isna().sum()`', solution: 'missing = df.isna().sum()' },
      { prompt: 'Fill missing `units` with 0 (in `df`), then convert the column to `int`.', starter: 'df["units"] = ', test: 'assert df["units"].isna().sum() == 0 and str(df["units"].dtype).startswith("int")', hint: '`df["units"].fillna(0).astype(int)`', solution: 'df["units"] = df["units"].fillna(0).astype(int)' },
      { prompt: 'Convert `order_date` to real datetimes.', starter: 'df["order_date"] = ', test: 'assert str(df["order_date"].dtype).startswith("datetime64")', hint: '`pd.to_datetime(...)`', solution: 'df["order_date"] = pd.to_datetime(df["order_date"])' },
      { prompt: 'Add a `revenue` column = units × price.', starter: 'df["units"] = df["units"].fillna(0)\ndf["revenue"] = ', test: 'assert df["revenue"].sum() == 15220', hint: 'Columns multiply element-wise: `df["units"] * df["price"]`', solution: 'df["units"] = df["units"].fillna(0)\ndf["revenue"] = df["units"] * df["price"]' },
    ],
  },
  {
    story: 'Summarise like a pivot table, in code.',
    tasks: [
      { prompt: 'Total `units` per `region` → `by_region` (a Series indexed by region).', starter: 'by_region = ', test: 'assert by_region["West"] == 15 and by_region["East"] == 15', hint: '`df.groupby("region")["units"].sum()`', solution: 'by_region = df.groupby("region")["units"].sum()' },
      { prompt: 'Number of orders per `product` → `counts`.', starter: 'counts = ', test: 'assert counts["Laptop"] == 4 and counts["Keyboard"] == 3', hint: '`df["product"].value_counts()` or groupby + size', solution: 'counts = df["product"].value_counts()' },
      { prompt: 'With revenue = units × price (fill missing units with 0), compute revenue by region **sorted descending** → `top`.', starter: 'df["revenue"] = df["units"].fillna(0) * df["price"]\ntop = ', test: 'assert list(top.index)[0] == "East" and top.iloc[0] == 6320', hint: 'groupby → sum → `.sort_values(ascending=False)`', solution: 'df["revenue"] = df["units"].fillna(0) * df["price"]\ntop = df.groupby("region")["revenue"].sum().sort_values(ascending=False)' },
      { prompt: 'Use `.agg` to get both the **sum** and **mean** of `units` per region → `stats`.', starter: 'stats = ', test: 'assert list(stats.columns) == ["sum", "mean"] and stats.loc["North", "sum"] == 3', hint: '`df.groupby("region")["units"].agg(["sum", "mean"])`', solution: 'stats = df.groupby("region")["units"].agg(["sum", "mean"])' },
    ],
  },
]

export default function PandasLab({ stage, onComplete }: GameProps) {
  const data = STAGES[stage] ?? STAGES[0]
  const [py, setPy] = useState<Pyodide | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const task = data.tasks[idx]
  const [code, setCode] = useState(task.starter)
  const [out, setOut] = useState('')
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string } | null>(null)
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [pen, setPen] = useState({ hints: 0, reveals: 0, misses: 0 })
  const [done, setDone] = useState(false)

  useEffect(() => { getPyodide().then(setPy).catch((e) => setLoadErr(String(e.message ?? e))) }, [])

  const run = async () => {
    if (!py) return
    setRunning(true)
    setVerdict(null)
    let buf = ''
    py.setStdout({ batched: (s) => { buf += s + '\n' } })
    py.setStderr({ batched: (s) => { buf += s + '\n' } })
    try {
      // Fresh namespace per run so earlier attempts can't leak state.
      const wrapped = `__ns = {}\nexec(${JSON.stringify(SETUP)}, __ns)\nexec(${JSON.stringify(code)}, __ns)\nexec(${JSON.stringify(task.test)}, __ns)`
      await py.runPythonAsync(wrapped)
      setVerdict({ ok: true, msg: '✅ All tests passed!' })
    } catch (e) {
      const msg = String((e as Error).message ?? e)
      const last = msg.trim().split('\n').filter(Boolean).pop() ?? msg
      setVerdict({ ok: false, msg: last.startsWith('AssertionError') ? `❌ Test failed${last.length > 16 ? ': ' + last.slice(16) : ''}` : `⚠️ ${last}` })
      setPen((p) => ({ ...p, misses: p.misses + 1 }))
    } finally {
      setOut(buf)
      setRunning(false)
    }
  }

  const next = () => {
    if (idx + 1 >= data.tasks.length) return setDone(true)
    const t = data.tasks[idx + 1]
    setIdx(idx + 1); setCode(t.starter); setOut(''); setVerdict(null); setShowHint(false)
  }

  if (loadErr) return <Feedback ok={false}>{loadErr}</Feedback>
  if (!py) return <Spinner label="Starting Python in your browser (first load ~10–20s)…" />
  if (done) return <StageClear score={scoreFrom(pen)} onContinue={() => onComplete(scoreFrom(pen))} />

  return (
    <GameFrame icon="🐼" title="Pandas Lab" subtitle={data.story} index={idx} total={data.tasks.length}>
      <p className="rounded-xl bg-violet-500/10 p-3 text-sm text-violet-100"><span className="font-semibold">Task {idx + 1}:</span> {inline(task.prompt)}</p>
      {stage > 0 && <p className="mt-2 text-xs text-ink-400">Already loaded: <code className="text-sky-300">pd</code> and <code className="text-sky-300">df</code> (10 sales orders: order_id, region, product, units, price, status, order_date).</p>}
      <label htmlFor="py" className="sr-only">Python code</label>
      <textarea
        id="py"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run() }
          if (e.key === 'Tab') {
            e.preventDefault()
            const t = e.currentTarget, s = t.selectionStart
            setCode(code.slice(0, s) + '    ' + code.slice(t.selectionEnd))
            requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 4 })
          }
        }}
        rows={6}
        spellCheck={false}
        className="input mt-3 font-mono text-sm leading-relaxed"
        autoFocus
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {verdict?.ok ? (
          <button className="btn btn-primary" onClick={next} autoFocus>Next task →</button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={run} disabled={running}>{running ? 'Running…' : '▶ Run tests'}</button>
            <button className="btn btn-ghost" onClick={() => { if (!showHint) setPen((p) => ({ ...p, hints: p.hints + 1 })); setShowHint(true) }}>💡 Hint</button>
            <button className="btn btn-ghost" onClick={() => { setPen((p) => ({ ...p, reveals: p.reveals + 1 })); setCode(task.solution) }}>Show answer</button>
          </>
        )}
      </div>
      {showHint && !verdict?.ok && <p className="mt-2 text-sm text-amber-200">💡 {inline(task.hint)}</p>}
      {verdict && <Feedback ok={verdict.ok}>{verdict.msg}</Feedback>}
      {out && <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-black/40 p-3 font-mono text-xs text-ink-200">{out}</pre>}
    </GameFrame>
  )
}
