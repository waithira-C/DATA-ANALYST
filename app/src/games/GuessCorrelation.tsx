import { useMemo, useState } from 'react'
import type { GameProps } from './meta'
import { GameFrame, StageClear } from './GameFrame'

type Pt = [number, number]

function gaussian(r: () => number) {
  const u = 1 - r(), v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function pearson(pts: Pt[]) {
  const n = pts.length
  const mx = pts.reduce((s, p) => s + p[0], 0) / n
  const my = pts.reduce((s, p) => s + p[1], 0) / n
  let sxy = 0, sxx = 0, syy = 0
  for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2 }
  return sxy / Math.sqrt(sxx * syy)
}

interface RoundSpec { kind: 'linear' | 'outlier' | 'curve'; target: number; n: number; caption: string }

const STAGES: { story: string; rounds: RoundSpec[] }[] = [
  {
    story: 'Train your eye. Drag the slider to your best guess for Pearson\'s r.',
    rounds: [
      { kind: 'linear', target: 0.9, n: 60, caption: 'Ad spend vs website visits' },
      { kind: 'linear', target: -0.8, n: 60, caption: 'Price vs units sold' },
      { kind: 'linear', target: 0.05, n: 60, caption: 'Shoe size vs exam score' },
      { kind: 'linear', target: 0.55, n: 60, caption: 'Study hours vs grade' },
      { kind: 'linear', target: -0.35, n: 60, caption: 'Commute time vs job satisfaction' },
    ],
  },
  {
    story: 'Real data is noisy. Moderate correlations are the hardest to judge.',
    rounds: [
      { kind: 'linear', target: 0.3, n: 120, caption: 'Temperature vs ice-cream orders (daily, noisy)' },
      { kind: 'linear', target: -0.6, n: 120, caption: 'Support wait time vs CSAT' },
      { kind: 'linear', target: 0.7, n: 40, caption: 'Sessions vs purchases' },
      { kind: 'linear', target: -0.15, n: 150, caption: 'Account age vs complaints' },
      { kind: 'linear', target: 0.45, n: 80, caption: 'Tenure vs salary' },
    ],
  },
  {
    story: 'Traps! An outlier or a curve can make r lie. Guess the r a computer would report.',
    rounds: [
      { kind: 'outlier', target: 0.0, n: 40, caption: 'Mostly noise… plus one extreme point' },
      { kind: 'curve', target: 0, n: 60, caption: 'Strong U-shaped pattern' },
      { kind: 'linear', target: 0.85, n: 25, caption: 'Small sample, strong trend' },
      { kind: 'outlier', target: 0.8, n: 40, caption: 'Strong trend with one wild point' },
      { kind: 'linear', target: -0.95, n: 60, caption: 'Nearly perfect negative' },
    ],
  },
]

function makePoints(spec: RoundSpec, seed: number): Pt[] {
  let s = seed
  const r = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 }
  const pts: Pt[] = []
  if (spec.kind === 'curve') {
    for (let i = 0; i < spec.n; i++) { const x = r() * 2 - 1; pts.push([x, x * x + gaussian(r) * 0.08]) }
    return pts
  }
  const rho = spec.target
  for (let i = 0; i < spec.n; i++) {
    const x = gaussian(r)
    pts.push([x, rho * x + Math.sqrt(1 - rho * rho) * gaussian(r)])
  }
  if (spec.kind === 'outlier') pts.push(spec.target > 0.5 ? [3.2, -3.2] : [4.5, 4.5])
  return pts
}

function Scatter({ pts }: { pts: Pt[] }) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const W = 320, H = 240, P = 16
  const sx = (x: number) => P + ((x - x0) / (x1 - x0 || 1)) * (W - 2 * P)
  const sy = (y: number) => H - P - ((y - y0) / (y1 - y0 || 1)) * (H - 2 * P)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md rounded-xl bg-ink-900/70" role="img" aria-label="Scatter plot">
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#334155" />
      <line x1={P} y1={P} x2={P} y2={H - P} stroke="#334155" />
      {pts.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3.2} fill="#38bdf8" fillOpacity={0.75} />)}
    </svg>
  )
}

export default function GuessCorrelation({ stage, onComplete }: GameProps) {
  const data = STAGES[stage] ?? STAGES[0]
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const spec = data.rounds[idx]
  const pts = useMemo(() => makePoints(spec, 1000 + stage * 97 + idx * 13), [spec, stage, idx])
  const actual = useMemo(() => pearson(pts), [pts])

  const total = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  if (done) return <StageClear score={total} onContinue={() => onComplete(total)} />

  const diff = Math.abs(guess - actual)
  const roundScore = Math.max(0, Math.round(100 - Math.max(0, diff - 0.1) * 250))

  const submit = () => { setRevealed(true); setScores((s) => [...s, roundScore]) }
  const next = () => {
    if (idx + 1 >= data.rounds.length) return setDone(true)
    setIdx(idx + 1); setGuess(0); setRevealed(false)
  }

  return (
    <GameFrame icon="🎯" title="Guess the Correlation" subtitle={data.story} index={idx} total={data.rounds.length}>
      <div className="grid items-center gap-5 md:grid-cols-[auto_1fr]">
        <div>
          <Scatter pts={pts} />
          <p className="mt-1 text-center text-xs text-ink-400">{spec.caption}</p>
        </div>
        <div>
          <label htmlFor="r" className="text-sm text-ink-200">Your guess for r</label>
          <div className="mt-1 font-display text-5xl font-bold tabular-nums">{guess >= 0 ? '+' : ''}{guess.toFixed(2)}</div>
          <input id="r" type="range" min={-1} max={1} step={0.01} value={guess} disabled={revealed} onChange={(e) => setGuess(Number(e.target.value))} className="mt-3 w-full accent-sky-400" onKeyDown={(e) => e.key === 'Enter' && !revealed && submit()} />
          <div className="flex justify-between text-[11px] text-ink-400"><span>−1 perfect negative</span><span>0 none</span><span>+1 perfect positive</span></div>
          {!revealed ? (
            <button className="btn btn-primary mt-4" onClick={submit}>Lock in guess</button>
          ) : (
            <div className="mt-4 rounded-xl bg-white/5 p-3" role="status">
              <p>Actual r = <span className="font-bold text-white">{actual.toFixed(2)}</span> · off by {diff.toFixed(2)} · <span className="font-bold text-gold">{roundScore} pts</span></p>
              {spec.kind === 'curve' && <p className="mt-1 text-sm text-amber-200">r only measures <b>straight-line</b> relationships. A perfect curve can still score near 0. Always plot your data!</p>}
              {spec.kind === 'outlier' && <p className="mt-1 text-sm text-amber-200">One extreme point can drag r a long way. Check outliers before trusting a correlation.</p>}
              <button className="btn btn-primary mt-3" onClick={next} autoFocus>{idx + 1 >= data.rounds.length ? 'Finish' : 'Next plot'} →</button>
            </div>
          )}
        </div>
      </div>
    </GameFrame>
  )
}
