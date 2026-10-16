import type { Database, SqlValue } from 'sql.js'
import { datasetSql } from './dataset'

let dbPromise: Promise<Database> | null = null

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const [{ default: initSqlJs }, { default: wasmUrl }] = await Promise.all([
        import('sql.js'),
        import('sql.js/dist/sql-wasm.wasm?url'),
      ])
      const SQL = await initSqlJs({ locateFile: () => wasmUrl })
      const db = new SQL.Database()
      db.run(datasetSql())
      return db
    })()
  }
  return dbPromise
}

export interface QueryResult { columns: string[]; rows: SqlValue[][] }

const WRITE_RE = /\b(insert|update|delete|drop|alter|create|replace|attach|pragma|vacuum)\b/i

export function runQuery(db: Database, sql: string): QueryResult {
  if (WRITE_RE.test(sql)) throw new Error('Query Quest is read-only: use SELECT (or WITH … SELECT) queries.')
  const res = db.exec(sql)
  if (!res.length) return { columns: [], rows: [] }
  const last = res[res.length - 1]
  return { columns: last.columns, rows: last.values }
}

const norm = (v: SqlValue) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v === null ? null : String(v).trim())
const rowKey = (r: SqlValue[]) => JSON.stringify(r.map(norm))

/** Compares by values only (column names may differ). Unordered comparisons sort rows first. */
export function sameResult(a: QueryResult, b: QueryResult, ordered: boolean): { ok: boolean; reason?: string } {
  const aw = a.rows[0]?.length ?? a.columns.length
  const bw = b.rows[0]?.length ?? b.columns.length
  if (aw !== bw) return { ok: false, reason: `Expected ${bw} column${bw === 1 ? '' : 's'}, you returned ${aw}.` }
  if (a.rows.length !== b.rows.length) return { ok: false, reason: `Expected ${b.rows.length} row${b.rows.length === 1 ? '' : 's'}, you returned ${a.rows.length}.` }
  const ak = a.rows.map(rowKey)
  const bk = b.rows.map(rowKey)
  if (!ordered) {
    ak.sort()
    bk.sort()
  }
  for (let i = 0; i < ak.length; i++) {
    if (ak[i] !== bk[i]) {
      if (ordered && [...ak].sort().join() === [...bk].sort().join()) return { ok: false, reason: 'Right rows, wrong order. Check your ORDER BY.' }
      return { ok: false, reason: 'Same shape, but the values differ. Check your filters and calculations.' }
    }
  }
  return { ok: true }
}
