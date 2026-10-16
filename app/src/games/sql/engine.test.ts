import { describe, expect, it } from 'vitest'
import initSqlJs from 'sql.js'
import { datasetSql } from './dataset'
import { SQL_STAGES } from './stages'
import { runQuery, sameResult } from './engine'

describe('Query Quest', async () => {
  const SQL = await initSqlJs()
  const db = new SQL.Database()
  db.run(datasetSql())

  it('every stage solution runs and returns rows', () => {
    for (const [i, st] of SQL_STAGES.entries()) {
      for (const ch of st.challenges) {
        const r = runQuery(db, ch.solution)
        expect(r.rows.length, `stage ${i}: ${ch.solution}`).toBeGreaterThan(0)
      }
    }
  })
  it('accepts equivalent queries and rejects wrong ones', () => {
    const exp = runQuery(db, 'SELECT name, price FROM products WHERE price > 4')
    expect(sameResult(runQuery(db, 'SELECT name AS n, price FROM products WHERE 4 < price ORDER BY name'), exp, false).ok).toBe(true)
    expect(sameResult(runQuery(db, 'SELECT name, price FROM products WHERE price >= 4'), exp, false).ok).toBe(false)
    expect(sameResult(runQuery(db, 'SELECT name FROM products WHERE price > 4'), exp, false).reason).toMatch(/column/)
  })
  it('detects wrong ordering', () => {
    const exp = runQuery(db, 'SELECT name, price FROM products ORDER BY price DESC LIMIT 3')
    const mine = runQuery(db, 'SELECT name, price FROM (SELECT * FROM products ORDER BY price DESC LIMIT 3) ORDER BY price')
    expect(sameResult(mine, exp, true).reason).toMatch(/order/i)
  })
  it('blocks writes', () => {
    expect(() => runQuery(db, 'DROP TABLE products')).toThrow()
  })
  it('has customers with no orders for the LEFT JOIN case', () => {
    const r = runQuery(db, 'SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL')
    expect(r.rows.length).toBeGreaterThanOrEqual(2)
  })
})
