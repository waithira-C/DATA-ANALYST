/**
 * A compact spreadsheet formula evaluator covering the functions taught on Floors 2–3.
 * Cells hold literal values only (no nested formulas), which keeps evaluation simple.
 */
export type Scalar = number | string | boolean | null
export class FormulaError extends Error {
  code: string
  constructor(code: string, msg?: string) {
    super(msg ?? code)
    this.code = code
  }
}
type Value = Scalar | Scalar[][]
export type Sheet = Record<string, Scalar>

type Tok =
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'bool'; v: boolean }
  | { t: 'ref'; v: string }
  | { t: 'range'; a: string; b: string }
  | { t: 'fn'; v: string }
  | { t: 'op'; v: string }
  | { t: '('; } | { t: ')' } | { t: ',' }

const REF = /^\$?([A-Z]{1,2})\$?(\d+)/
function tokenize(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  const s = src
  const U = src.toUpperCase()
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) { i++; continue }
    if (c === '"') {
      let j = i + 1
      let str = ''
      while (j < s.length) {
        if (s[j] === '"' && s[j + 1] === '"') { str += '"'; j += 2; continue }
        if (s[j] === '"') break
        str += s[j++]
      }
      if (j >= s.length) throw new FormulaError('#ERROR', 'Missing closing quote "')
      out.push({ t: 'str', v: str })
      i = j + 1
      continue
    }
    const num = /^\d+(\.\d+)?%?/.exec(s.slice(i))
    if (num && !/^[A-Z]/i.test(s[i])) {
      const raw = num[0]
      out.push({ t: 'num', v: raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw) })
      i += raw.length
      continue
    }
    const up = U.slice(i)
    const r1 = REF.exec(up)
    if (r1 && !/^[A-Z0-9_.(]/.test(up.slice(r1[0].length))) {
      const a = (r1[1] + r1[2])
      let j = i + r1[0].length
      if (s[j] === ':') {
        const r2 = REF.exec(U.slice(j + 1))
        if (!r2) throw new FormulaError('#REF!', 'Bad range')
        out.push({ t: 'range', a, b: r2[1] + r2[2] })
        j += 1 + r2[0].length
      } else out.push({ t: 'ref', v: a })
      i = j
      continue
    }
    const id = /^[A-Z][A-Z0-9.]*/.exec(up)
    if (id) {
      const name = id[0]
      const after = s.slice(i + name.length).trimStart()
      if (after.startsWith('(')) out.push({ t: 'fn', v: name })
      else if (name === 'TRUE' || name === 'FALSE') out.push({ t: 'bool', v: name === 'TRUE' })
      else throw new FormulaError('#NAME?', `Unknown name "${name}"`)
      i += name.length
      continue
    }
    const two = s.slice(i, i + 2)
    if (two === '<=' || two === '>=' || two === '<>') { out.push({ t: 'op', v: two }); i += 2; continue }
    if ('+-*/^&=<>'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue }
    if (c === '(' || c === ')' || c === ',') { out.push({ t: c } as Tok); i++; continue }
    if (c === ';') { out.push({ t: ',' }); i++; continue }
    throw new FormulaError('#ERROR', `Unexpected character "${c}"`)
  }
  return out
}

const colNum = (col: string) => col.split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0)
const colName = (n: number) => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26) } return s }
export const splitRef = (ref: string) => { const m = /^([A-Z]+)(\d+)$/.exec(ref)!; return { c: colNum(m[1]), r: Number(m[2]) } }
export const makeRef = (c: number, r: number) => `${colName(c)}${r}`

function rangeValues(sheet: Sheet, a: string, b: string): Scalar[][] {
  const A = splitRef(a), B = splitRef(b)
  const rows: Scalar[][] = []
  for (let r = Math.min(A.r, B.r); r <= Math.max(A.r, B.r); r++) {
    const row: Scalar[] = []
    for (let c = Math.min(A.c, B.c); c <= Math.max(A.c, B.c); c++) row.push(sheet[makeRef(c, r)] ?? null)
    rows.push(row)
  }
  return rows
}

const flat = (args: Value[]): Scalar[] => args.flatMap((a) => (Array.isArray(a) ? a.flat() : [a]))
const nums = (args: Value[]) => flat(args).filter((v): v is number => typeof v === 'number')
function toNum(v: Value): number {
  if (Array.isArray(v)) return toNum(v[0]?.[0] ?? null)
  if (typeof v === 'number') return v
  if (typeof v === 'boolean') return v ? 1 : 0
  if (v === null || v === '') return 0
  const n = Number(v)
  if (Number.isNaN(n)) throw new FormulaError('#VALUE!', `"${v}" is not a number`)
  return n
}
function toStr(v: Value): string {
  if (Array.isArray(v)) return toStr(v[0]?.[0] ?? null)
  if (v === null) return ''
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  return String(v)
}
const toBool = (v: Value) => (typeof v === 'string' ? v.toUpperCase() === 'TRUE' : !!toNum(v))
const scalar = (v: Value): Scalar => (Array.isArray(v) ? v[0]?.[0] ?? null : v)

function compare(a: Scalar, b: Scalar, op: string): boolean {
  let x: number | string = typeof a === 'number' ? a : toStr(a).toLowerCase()
  let y: number | string = typeof b === 'number' ? b : toStr(b).toLowerCase()
  if (typeof x !== typeof y) { x = String(x); y = String(y) }
  switch (op) {
    case '=': return x === y
    case '<>': return x !== y
    case '<': return x < y
    case '>': return x > y
    case '<=': return x <= y
    case '>=': return x >= y
  }
  return false
}

/** Spreadsheet criteria like ">50", "<>Paid", "London", "Lon*". */
function matchCriteria(v: Scalar, crit: Scalar): boolean {
  if (typeof crit === 'number') return typeof v === 'number' ? v === crit : toStr(v) === String(crit)
  const c = toStr(crit)
  const m = /^(<=|>=|<>|<|>|=)?(.*)$/.exec(c)!
  const op = m[1] ?? '='
  const rhsRaw = m[2]
  const rhs: Scalar = rhsRaw !== '' && !Number.isNaN(Number(rhsRaw)) ? Number(rhsRaw) : rhsRaw
  if (typeof rhs === 'string' && (rhs.includes('*') || rhs.includes('?')) && (op === '=' || op === '<>')) {
    const re = new RegExp('^' + rhs.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i')
    const hit = re.test(toStr(v))
    return op === '=' ? hit : !hit
  }
  if (typeof rhs === 'number' && typeof v !== 'number') return op === '<>'
  return compare(v, rhs, op)
}

const round = (n: number, d: number) => { const f = Math.pow(10, d); return Math.round((n + Number.EPSILON) * f) / f }

function lookupCol(v: Value): Scalar[] {
  if (!Array.isArray(v)) return [v]
  return v.length === 1 ? v[0] : v.map((r) => r[0])
}

const FNS: Record<string, (args: Value[]) => Value> = {
  SUM: (a) => nums(a).reduce((s, n) => s + n, 0),
  AVERAGE: (a) => { const n = nums(a); if (!n.length) throw new FormulaError('#DIV/0!'); return n.reduce((s, x) => s + x, 0) / n.length },
  COUNT: (a) => nums(a).length,
  COUNTA: (a) => flat(a).filter((v) => v !== null && v !== '').length,
  COUNTBLANK: (a) => flat(a).filter((v) => v === null || v === '').length,
  MIN: (a) => { const n = nums(a); return n.length ? Math.min(...n) : 0 },
  MAX: (a) => { const n = nums(a); return n.length ? Math.max(...n) : 0 },
  MEDIAN: (a) => { const n = nums(a).sort((x, y) => x - y); const m = Math.floor(n.length / 2); return n.length % 2 ? n[m] : (n[m - 1] + n[m]) / 2 },
  ROUND: ([v, d]) => round(toNum(v), d === undefined ? 0 : toNum(d)),
  ROUNDUP: ([v, d]) => { const f = Math.pow(10, d === undefined ? 0 : toNum(d)); return Math.ceil(toNum(v) * f) / f },
  ROUNDDOWN: ([v, d]) => { const f = Math.pow(10, d === undefined ? 0 : toNum(d)); return Math.floor(toNum(v) * f) / f },
  ABS: ([v]) => Math.abs(toNum(v)),
  IF: ([c, t, f]) => (toBool(c) ? t ?? true : f ?? false),
  AND: (a) => flat(a).every((v) => toBool(v)),
  OR: (a) => flat(a).some((v) => toBool(v)),
  NOT: ([v]) => !toBool(v),
  TRIM: ([v]) => toStr(v).trim().replace(/\s+/g, ' '),
  UPPER: ([v]) => toStr(v).toUpperCase(),
  LOWER: ([v]) => toStr(v).toLowerCase(),
  PROPER: ([v]) => toStr(v).toLowerCase().replace(/(^|[^a-z])([a-z])/g, (_m, p, ch) => p + ch.toUpperCase()),
  LEN: ([v]) => toStr(v).length,
  LEFT: ([v, n]) => toStr(v).slice(0, n === undefined ? 1 : toNum(n)),
  RIGHT: ([v, n]) => { const s = toStr(v); const k = n === undefined ? 1 : toNum(n); return k ? s.slice(-k) : '' },
  MID: ([v, start, n]) => toStr(v).substr(toNum(start) - 1, toNum(n)),
  FIND: ([needle, hay]) => { const i = toStr(hay).indexOf(toStr(needle)); if (i < 0) throw new FormulaError('#VALUE!'); return i + 1 },
  SEARCH: ([needle, hay]) => { const i = toStr(hay).toLowerCase().indexOf(toStr(needle).toLowerCase()); if (i < 0) throw new FormulaError('#VALUE!'); return i + 1 },
  SUBSTITUTE: ([v, a, b]) => toStr(v).split(toStr(a)).join(toStr(b)),
  CONCAT: (a) => flat(a).map(toStr).join(''),
  CONCATENATE: (a) => flat(a).map(toStr).join(''),
  TEXTJOIN: ([d, skip, ...rest]) => flat(rest).filter((v) => !(toBool(skip) && (v === null || v === ''))).map(toStr).join(toStr(d)),
  VALUE: ([v]) => toNum(v),
  IFERROR: () => { throw new Error('handled specially') },
  ISBLANK: ([v]) => { const s = scalar(v); return s === null || s === '' },
  ISNUMBER: ([v]) => typeof scalar(v) === 'number',
  COUNTIF: ([range, crit]) => flat([range]).filter((v) => matchCriteria(v, scalar(crit))).length,
  SUMIF: ([range, crit, sumRange]) => {
    const r = flat([range]); const s = sumRange ? flat([sumRange]) : r
    return r.reduce<number>((acc, v, i) => acc + (matchCriteria(v, scalar(crit)) && typeof s[i] === 'number' ? (s[i] as number) : 0), 0)
  },
  AVERAGEIF: ([range, crit, avgRange]) => {
    const r = flat([range]); const s = avgRange ? flat([avgRange]) : r
    const hits = r.map((v, i) => (matchCriteria(v, scalar(crit)) ? s[i] : null)).filter((x): x is number => typeof x === 'number')
    if (!hits.length) throw new FormulaError('#DIV/0!')
    return hits.reduce((a, b) => a + b, 0) / hits.length
  },
  COUNTIFS: (a) => {
    const ranges = a.filter((_, i) => i % 2 === 0).map((r) => flat([r]))
    const crits = a.filter((_, i) => i % 2 === 1).map(scalar)
    return ranges[0].filter((_, i) => ranges.every((r, k) => matchCriteria(r[i], crits[k]))).length
  },
  SUMIFS: ([sumRange, ...rest]) => {
    const s = flat([sumRange])
    const ranges = rest.filter((_, i) => i % 2 === 0).map((r) => flat([r]))
    const crits = rest.filter((_, i) => i % 2 === 1).map(scalar)
    return s.reduce<number>((acc, v, i) => acc + (ranges.every((r, k) => matchCriteria(r[i], crits[k])) && typeof v === 'number' ? v : 0), 0)
  },
  AVERAGEIFS: ([avgRange, ...rest]) => {
    const s = flat([avgRange])
    const ranges = rest.filter((_, i) => i % 2 === 0).map((r) => flat([r]))
    const crits = rest.filter((_, i) => i % 2 === 1).map(scalar)
    const hits = s.filter((v, i) => typeof v === 'number' && ranges.every((r, k) => matchCriteria(r[i], crits[k]))) as number[]
    if (!hits.length) throw new FormulaError('#DIV/0!')
    return hits.reduce((x, y) => x + y, 0) / hits.length
  },
  VLOOKUP: ([key, table, col, approx]) => {
    if (!Array.isArray(table)) throw new FormulaError('#REF!')
    const k = scalar(key)
    const c = toNum(col)
    if (c < 1 || c > (table[0]?.length ?? 0)) throw new FormulaError('#REF!', 'Column index is outside the table')
    const exact = approx === undefined ? false : !toBool(approx)
    if (!exact && approx !== undefined) {
      let hit = -1
      table.forEach((r, i) => { if (compare(r[0], k, '<=')) hit = i })
      if (hit < 0) throw new FormulaError('#N/A')
      return table[hit][c - 1]
    }
    const row = table.find((r) => compare(r[0], k, '='))
    if (!row) throw new FormulaError('#N/A')
    return row[c - 1]
  },
  XLOOKUP: ([key, look, ret, notFound]) => {
    const l = lookupCol(look)
    const i = l.findIndex((v) => compare(v, scalar(key), '='))
    if (i < 0) { if (notFound !== undefined) return notFound; throw new FormulaError('#N/A') }
    return lookupCol(ret)[i]
  },
  MATCH: ([key, look, type]) => {
    const l = lookupCol(look)
    const t = type === undefined ? 1 : toNum(type)
    if (t === 0) {
      const i = l.findIndex((v) => compare(v, scalar(key), '='))
      if (i < 0) throw new FormulaError('#N/A')
      return i + 1
    }
    let hit = -1
    l.forEach((v, i) => { if (compare(v, scalar(key), '<=')) hit = i })
    if (hit < 0) throw new FormulaError('#N/A')
    return hit + 1
  },
  INDEX: ([arr, r, c]) => {
    if (!Array.isArray(arr)) return arr
    const ri = toNum(r)
    const ci = c === undefined ? 1 : toNum(c)
    if (arr.length === 1 && c === undefined) return arr[0][ri - 1] ?? (() => { throw new FormulaError('#REF!') })()
    const row = arr[ri - 1]
    if (!row || row[ci - 1] === undefined) throw new FormulaError('#REF!')
    return row[ci - 1]
  },
}

export const SUPPORTED_FUNCTIONS = Object.keys(FNS).sort()

class Parser {
  i = 0
  toks: Tok[]
  sheet: Sheet
  used = new Set<string>()
  constructor(toks: Tok[], sheet: Sheet) { this.toks = toks; this.sheet = sheet }
  peek() { return this.toks[this.i] }
  eat() { return this.toks[this.i++] }
  isOp(...ops: string[]) { const t = this.peek(); return t?.t === 'op' && ops.includes(t.v) }

  expr(): Value { return this.comparison() }
  comparison(): Value {
    let l = this.concat()
    while (this.isOp('=', '<>', '<', '>', '<=', '>=')) {
      const op = (this.eat() as { v: string }).v
      const r = this.concat()
      l = compare(scalar(l), scalar(r), op)
    }
    return l
  }
  concat(): Value {
    let l = this.additive()
    while (this.isOp('&')) { this.eat(); l = toStr(l) + toStr(this.additive()) }
    return l
  }
  additive(): Value {
    let l = this.term()
    while (this.isOp('+', '-')) { const op = (this.eat() as { v: string }).v; const r = this.term(); l = op === '+' ? toNum(l) + toNum(r) : toNum(l) - toNum(r) }
    return l
  }
  term(): Value {
    let l = this.power()
    while (this.isOp('*', '/')) {
      const op = (this.eat() as { v: string }).v
      const r = this.power()
      if (op === '/' && toNum(r) === 0) throw new FormulaError('#DIV/0!')
      l = op === '*' ? toNum(l) * toNum(r) : toNum(l) / toNum(r)
    }
    return l
  }
  power(): Value {
    const l = this.unary()
    if (this.isOp('^')) { this.eat(); return Math.pow(toNum(l), toNum(this.power())) }
    return l
  }
  unary(): Value {
    if (this.isOp('-')) { this.eat(); return -toNum(this.unary()) }
    if (this.isOp('+')) { this.eat(); return this.unary() }
    return this.primary()
  }
  primary(): Value {
    const t = this.eat()
    if (!t) throw new FormulaError('#ERROR', 'Formula ended unexpectedly')
    switch (t.t) {
      case 'num': case 'str': case 'bool': return t.v
      case 'ref': return this.sheet[t.v] ?? null
      case 'range': return rangeValues(this.sheet, t.a, t.b)
      case '(': { const v = this.expr(); if (this.eat()?.t !== ')') throw new FormulaError('#ERROR', 'Missing )'); return v }
      case 'fn': return this.call(t.v)
    }
    throw new FormulaError('#ERROR', 'Unexpected token')
  }
  call(name: string): Value {
    this.used.add(name)
    if (this.eat()?.t !== '(') throw new FormulaError('#ERROR')
    const fn = FNS[name]
    if (!fn) throw new FormulaError('#NAME?', `${name}() isn't supported here. Try: ${SUPPORTED_FUNCTIONS.slice(0, 8).join(', ')}…`)
    const args: Value[] = []
    if (this.peek()?.t === ')') { this.eat(); return fn(args) }
    if (name === 'IFERROR') {
      const start = this.i
      let val: Value
      try { val = this.expr() } catch (e) {
        if (!(e instanceof FormulaError)) throw e
        // skip to the comma at depth 0
        this.i = start
        let depth = 0
        while (this.i < this.toks.length) {
          const tk = this.toks[this.i]
          if (tk.t === '(' || tk.t === 'fn') { if (tk.t === '(') depth++ }
          else if (tk.t === ')') depth--
          else if (tk.t === ',' && depth === 0) break
          this.i++
        }
        val = undefined as unknown as Value
      }
      if (this.eat()?.t !== ',') throw new FormulaError('#ERROR', 'IFERROR needs two arguments')
      const fallback = this.expr()
      if (this.eat()?.t !== ')') throw new FormulaError('#ERROR', 'Missing )')
      return val === undefined ? fallback : val
    }
    for (;;) {
      args.push(this.expr())
      const sep = this.eat()
      if (sep?.t === ',') continue
      if (sep?.t === ')') break
      throw new FormulaError('#ERROR', `Missing ) after ${name} arguments`)
    }
    return fn(args)
  }
}

export interface EvalResult { value: Scalar; error?: string; used: Set<string> }

export function evaluate(formula: string, sheet: Sheet): EvalResult {
  const src = formula.trim()
  if (!src.startsWith('=')) return { value: src === '' ? null : Number.isNaN(Number(src)) ? src : Number(src), used: new Set() }
  try {
    const p = new Parser(tokenize(src.slice(1)), sheet)
    const v = p.expr()
    if (p.i < p.toks.length) throw new FormulaError('#ERROR', 'Unexpected extra input. Check commas and parentheses.')
    return { value: scalar(v), used: p.used }
  } catch (e) {
    if (e instanceof FormulaError) return { value: null, error: e.code === e.message ? e.code : `${e.code} ${e.message}`, used: new Set() }
    return { value: null, error: String(e), used: new Set() }
  }
}

export function sameValue(a: Scalar, b: Scalar) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-6
  return toStr(a) === toStr(b)
}

export function display(v: Scalar): string {
  if (v === null) return ''
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000)
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  return v
}
