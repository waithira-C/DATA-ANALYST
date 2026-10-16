import type { ReactNode } from 'react'
import type { GameProps } from './meta'
import ChoiceGame, { type ChoiceRound } from './ChoiceGame'

/** Tiny illustrative chart thumbnails. */
const C = '#38bdf8', C2 = '#a78bfa', G = '#475569'
const Thumb = ({ children, label }: { children: ReactNode; label: string }) => (
  <figure className="inline-flex flex-col items-center">
    <svg viewBox="0 0 120 80" className="h-20 w-32 rounded-lg bg-ink-900/70" role="img" aria-label={label}>{children}</svg>
  </figure>
)
const Bars = () => <Thumb label="bar chart">{[50, 30, 62, 18, 40].map((h, i) => <rect key={i} x={10 + i * 21} y={72 - h} width={14} height={h} fill={C} rx={2} />)}</Thumb>
const Line = () => <Thumb label="line chart"><polyline points="8,60 28,52 48,56 68,38 88,30 112,14" fill="none" stroke={C} strokeWidth={3} /></Thumb>
const Pie3D = () => <Thumb label="3D pie chart with many slices"><ellipse cx={60} cy={44} rx={44} ry={22} fill={C2} />{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={60} y1={44} x2={60 + 44 * Math.cos(i * 0.8)} y2={44 + 22 * Math.sin(i * 0.8)} stroke="#0b1020" strokeWidth={2} />)}<rect x={16} y={44} width={88} height={10} fill="#6d28d9" /></Thumb>
const ScatterT = () => <Thumb label="scatter plot">{[[15, 60], [25, 52], [35, 50], [45, 40], [55, 42], [65, 30], [75, 28], [90, 20], [100, 15]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={C} />)}</Thumb>
const Hist = () => <Thumb label="histogram">{[10, 22, 38, 50, 40, 24, 12, 6].map((h, i) => <rect key={i} x={8 + i * 13.5} y={72 - h} width={13} height={h} fill={C} />)}</Thumb>
const Stacked = () => <Thumb label="stacked bar">{[0, 1, 2, 3].map((i) => <g key={i}><rect x={14 + i * 26} y={20} width={16} height={30} fill={C} /><rect x={14 + i * 26} y={50} width={16} height={22} fill={C2} /></g>)}</Thumb>
const Kpi = () => <Thumb label="KPI card"><text x={60} y={40} textAnchor="middle" fill="white" fontSize={20} fontWeight="bold">$1.2M</text><text x={60} y={58} textAnchor="middle" fill="#22c55e" fontSize={10}>▲ 8% vs last month</text></Thumb>
const Spaghetti = () => <Thumb label="line chart with twelve tangled lines">{Array.from({ length: 12 }, (_, i) => <polyline key={i} points={`8,${20 + ((i * 17) % 50)} 40,${15 + ((i * 29) % 55)} 80,${18 + ((i * 41) % 50)} 112,${12 + ((i * 13) % 58)}`} fill="none" stroke={`hsl(${i * 30} 80% 60%)`} strokeWidth={1.5} />)}</Thumb>
const Truncated = () => <Thumb label="bar chart with y-axis starting at 95"><text x={4} y={12} fill={G} fontSize={8}>98</text><text x={4} y={74} fill={G} fontSize={8}>95</text><rect x={30} y={60} width={24} height={12} fill={C} /><rect x={70} y={10} width={24} height={62} fill={C2} /></Thumb>

const o = (text: string, points: number, feedback: string) => ({ text, points, feedback })

const STAGES: { story: string; rounds: ChoiceRound[] }[] = [
  {
    story: 'Your first dashboard request. Prescribe the right chart for each question.',
    rounds: [
      { question: 'Monthly revenue over the last 2 years. Is it trending up?', visual: <div className="flex flex-wrap gap-2"><Line /><Bars /><Pie3D /></div>, options: [o('Line chart', 10, 'Lines show change over continuous time best.'), o('Bar chart', 5, 'Works for a few periods, but 24 bars are harder to read as a trend.'), o('Pie chart', 0, 'Pies show parts of a whole at one moment, not trends.')] },
      { question: 'Compare total sales across 5 product categories.', visual: <div className="flex flex-wrap gap-2"><Bars /><Line /><ScatterT /></div>, options: [o('Bar chart, sorted largest to smallest', 10, 'Bars compare categories; sorting makes ranking instant.'), o('Line chart', 0, 'Lines imply an order or continuity that categories don\'t have.'), o('Scatter plot', 0, 'Scatter shows the relationship between two numeric variables.')] },
      { question: 'Is there a relationship between discount % and order size?', visual: <div className="flex flex-wrap gap-2"><ScatterT /><Bars /><Hist /></div>, options: [o('Scatter plot', 10, 'Two numeric variables → scatter. Add a trend line if helpful.'), o('Histogram', 0, 'A histogram shows the distribution of one variable.'), o('Bar chart', 0, 'Bars compare categories, not two continuous measures.')] },
      { question: 'How are customer ages distributed?', visual: <div className="flex flex-wrap gap-2"><Hist /><Pie3D /><Line /></div>, options: [o('Histogram', 10, 'Histograms bin one numeric variable to show its shape.'), o('Pie chart', 0, 'Pies of age groups hide the shape and are hard to compare.'), o('Line chart', 3, 'Not for distributions. Lines suggest time.')] },
    ],
  },
  {
    story: 'Stakeholders keep asking for charts. Choose what actually answers their question.',
    rounds: [
      { question: 'The CEO wants to see this month\'s revenue and whether it\'s up or down, at a glance.', visual: <div className="flex flex-wrap gap-2"><Kpi /><Line /><Pie3D /></div>, options: [o('A KPI card with the number and % change', 10, 'One number + comparison = fastest read for executives.'), o('A detailed line chart', 5, 'Good as supporting detail, slower for "at a glance".'), o('A 3D pie', 0, '3D distorts and pies don\'t show change.')] },
      { question: 'Show how each region contributes to total sales across 4 quarters.', visual: <div className="flex flex-wrap gap-2"><Stacked /><Pie3D /><ScatterT /></div>, options: [o('Stacked bar (or 100% stacked for share)', 10, 'Stacked bars show composition across a few periods.'), o('Four separate pie charts', 3, 'Comparing slices across pies is hard for the eye.'), o('Scatter', 0, 'Wrong tool: there\'s no second numeric variable.')] },
      { question: 'Marketing wants to compare conversion rate for 12 campaigns over 6 months.', visual: <div className="flex flex-wrap gap-2"><Spaghetti /><Bars /></div>, options: [o('Highlight the 2–3 campaigns that matter and grey out the rest (or use small multiples)', 10, 'Avoid spaghetti: focus attention with colour or split into small charts.'), o('One line chart with all 12 coloured lines', 0, 'Spaghetti chart: nobody can follow 12 colours.'), o('A table only', 3, 'Precise, but hides the trends they asked about.')] },
    ],
  },
  {
    story: 'These charts were made by someone in a hurry. Diagnose the design problem.',
    rounds: [
      { question: 'What\'s misleading here? Product A: 95.5%, Product B: 98% satisfaction.', visual: <Truncated />, options: [o('The y-axis starts at 95, making a 2.5-point gap look 5× larger', 10, 'Bar charts must start at zero. Bar length is the encoding.'), o('The colours are different', 3, 'Minor. The truncated axis is the real distortion.'), o('Nothing; zooming in is always good', 0, 'For bars, zooming exaggerates differences.')] },
      { question: 'Market share of 8 brands as a 3D exploded pie. Best fix?', visual: <Pie3D />, options: [o('Sorted horizontal bar chart', 10, 'Bars make 8 values easy to compare and rank. 3D distorts slice sizes.'), o('Keep the pie, remove 3D', 5, 'Better, but 8 slices are still hard to compare.'), o('Add more colours', 0, 'More colour = more clutter.')] },
      { question: 'A chart has a title "Sales Chart", gridlines everywhere, and a legend for one series. First improvement?', options: [o('Write an insight title ("Sales up 12% since the March launch") and remove clutter', 10, 'Titles should state the takeaway; declutter so data stands out.'), o('Add data labels to every point', 3, 'Can help selectively, but labels everywhere add clutter.'), o('Make it 3D for impact', 0, '3D adds distortion, not insight.')] },
      { question: 'You want the audience to notice ONE line among five. Best technique?', options: [o('Colour that line strongly; make the others grey', 10, 'Pre-attentive attributes like colour guide the eye instantly.'), o('Make all five lines bright, distinct colours', 0, 'Everything highlighted = nothing highlighted.'), o('Put it first in the legend', 3, 'Legends are read last, if at all.')] },
    ],
  },
  {
    story: 'Design an e-commerce sales dashboard for a busy Head of Sales.',
    rounds: [
      { question: 'Which KPI belongs in the top-left (most prominent) spot?', options: [o('Total revenue vs target', 10, 'Put the single most important outcome metric where eyes land first.'), o('Number of SKUs in the catalogue', 0, 'Not an outcome metric the Head of Sales steers by.'), o('Average page load time', 3, 'Important to engineering, secondary for sales.')] },
      { question: 'How many KPI cards should the top row have?', options: [o('3–5 key metrics', 10, 'Enough for a full picture, few enough to scan in seconds.'), o('15+ so nothing is missed', 0, 'Overload hides what matters.'), o('Just 1', 3, 'Too thin. Leaders need a few related signals.')] },
      { question: 'Revenue dropped 8%. What should the dashboard let them do next?', options: [o('Drill down / filter by region, channel and product to find the cause', 10, 'Good dashboards go from "what happened" to "why".'), o('Nothing; dashboards are just for looking', 0, 'Interactivity turns a report into an analysis tool.'), o('Email the raw data', 3, 'Sometimes needed, but the dashboard should answer the first "why".')] },
      { question: 'A KPI shows "Conversion: 2.3%". What makes it actionable?', options: [o('Add context: target, previous period and trend direction', 10, 'A number without comparison has no meaning.'), o('Show more decimal places', 0, '2.3147% isn\'t more useful.'), o('Make the font bigger', 3, 'Visibility helps, but context gives meaning.')] },
    ],
  },
]

export default function ChartDoctor({ stage, onComplete }: GameProps) {
  const s = STAGES[stage] ?? STAGES[0]
  return <ChoiceGame icon="🩺" title="Chart Doctor" story={s.story} rounds={s.rounds} onComplete={onComplete} accent="violet" />
}
