import { describe, expect, it } from 'vitest'
import { evaluate, makeRef, type Sheet } from './formula'
import { FORMULA_STAGES } from './stages'

function sheetOf(grid: (string | number | boolean | null)[][]): Sheet {
  const s: Sheet = {}
  grid.forEach((row, r) => row.forEach((v, c) => { if (v !== '' && v !== null) s[makeRef(c + 1, r + 1)] = v }))
  return s
}

describe('formula engine', () => {
  const s = sheetOf([
    ['a', 'b'],
    [1, 'x'],
    [2, 'y'],
    [3, 'x'],
  ])
  it('arithmetic and refs', () => {
    expect(evaluate('=A2+A3*2', s).value).toBe(5)
    expect(evaluate('=(A2+A3)*2', s).value).toBe(6)
    expect(evaluate('=$A$4^2', s).value).toBe(9)
    expect(evaluate('=-A2', s).value).toBe(-1)
  })
  it('aggregates and criteria', () => {
    expect(evaluate('=SUM(A2:A4)', s).value).toBe(6)
    expect(evaluate('=COUNTIF(B2:B4,"x")', s).value).toBe(2)
    expect(evaluate('=SUMIF(B2:B4,"x",A2:A4)', s).value).toBe(4)
    expect(evaluate('=COUNTIF(A2:A4,">1")', s).value).toBe(2)
  })
  it('text and logic', () => {
    expect(evaluate('=PROPER(TRIM("  jane   DOE "))', s).value).toBe('Jane Doe')
    expect(evaluate('=IF(A2>0,"pos","neg")', s).value).toBe('pos')
    expect(evaluate('=IFERROR(1/0,"safe")', s).value).toBe('safe')
    expect(evaluate('=A2&"-"&B2', s).value).toBe('1-x')
  })
  it('errors are reported, not thrown', () => {
    expect(evaluate('=SUM(A2:A4', s).error).toBeTruthy()
    expect(evaluate('=NOPE(1)', s).error).toMatch(/#NAME/)
    expect(evaluate('=1/0', s).error).toMatch(/DIV/)
  })
  it('every Formula Forge solution evaluates cleanly', () => {
    for (const [i, st] of FORMULA_STAGES.entries()) {
      const sh = sheetOf(st.grid)
      for (const ch of st.challenges) {
        const r = evaluate(ch.solution, sh)
        expect(r.error, `stage ${i}: ${ch.solution}`).toBeUndefined()
        expect(r.value, `stage ${i}: ${ch.solution}`).not.toBeNull()
        if (ch.mustUse) expect(ch.mustUse.some((f) => r.used.has(f)), ch.solution).toBe(true)
      }
    }
  })
  it('spot-checks expected values', () => {
    const [s0, s1, , , s4, , s6, s7] = FORMULA_STAGES.map((st) => sheetOf(st.grid))
    expect(evaluate('=SUM(C2:E2)', s0).value).toBe(4050)
    expect(evaluate('=MID(C2,5,2)', s1).value).toBe('UK')
    expect(evaluate('=SUMIF(F2:F9,"<>Refunded",E2:E9)', s4).value).toBe(10870)
    expect(evaluate('=VLOOKUP(F2,A2:D6,2,FALSE)', s6).value).toBe('Stapler')
    expect(evaluate('=INDEX(A2:A6,MATCH(F4,B2:B6,0))', s7).value).toBe('C-300')
  })
})
