import type { GameProps } from './meta'
import ChoiceGame, { type ChoiceRound } from './ChoiceGame'

const Bubble = ({ who, role, text }: { who: string; role: string; text: string }) => (
  <div className="flex items-start gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 font-bold text-white">{who[0]}</span>
    <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] p-3 text-sm">
      <p className="text-xs text-ink-400">{who} · {role}</p>
      <p className="mt-0.5 text-ink-200">{text}</p>
    </div>
  </div>
)

const o = (text: string, points: number, feedback: string) => ({ text, points, feedback })

const STAGES: { story: string; rounds: ChoiceRound[] }[] = [
  {
    story: 'Your first week as a data analyst. How do you handle what comes your way?',
    rounds: [
      { visual: <Bubble who="Priya" role="Marketing Manager" text="Can you pull some numbers on our customers?" />, question: 'What do you do first?', options: [o('Ask what decision she\'s making and what question the numbers should answer', 10, 'The ASK phase: clarify the business question before touching data.'), o('Export the whole customer table and send it', 0, 'Raw dumps rarely answer anything and may expose personal data.'), o('Build a dashboard with every metric you can think of', 3, 'Effort without a clear question often misses the point.')] },
      { visual: <Bubble who="Priya" role="Marketing Manager" text="We want to know which channel brings customers who stay longest." />, question: 'Which data do you need to PREPARE?', options: [o('Customer acquisition channel + signup date + churn/cancel date', 10, 'You need the channel and a way to measure tenure.'), o('Website page colours', 0, 'Not related to the question.'), o('Only total revenue per month', 3, 'Useful context, but it can\'t link channels to retention.')] },
      { visual: <Bubble who="Sam" role="Data Engineer" text="Heads up: 4% of signup dates are null due to an old bug." />, question: 'During PROCESS, you…', options: [o('Quantify the impact, decide how to handle the nulls, and document the choice', 10, 'Clean, then document so results are trustworthy and reproducible.'), o('Ignore it; 4% is small', 3, 'Might be fine, but you must check whether the nulls cluster in one channel.'), o('Cancel the project', 0, 'Imperfect data is normal. Handle it.')] },
      { visual: <Bubble who="Priya" role="Marketing Manager" text="So… what did you find?" />, question: 'How do you SHARE?', options: [o('Lead with the answer: "Referral customers stay 2.1× longer", then show the chart and caveats', 10, 'Answer first, evidence second, caveats clearly stated.'), o('Walk through every query you wrote in order', 0, 'Stakeholders want insights, not your process log.'), o('Send a 40-tab spreadsheet', 0, 'Make the insight easy to see.')] },
    ],
  },
  {
    story: 'Vague requests land on your desk. Turn them into sharp, answerable questions.',
    rounds: [
      { visual: <Bubble who="Luis" role="Head of Sales" text="Sales are bad. Find out why." />, question: 'Best clarifying question?', options: [o('"Bad compared to what (target, last year?) and in which region or product?"', 10, 'Pin down the metric, comparison and scope. "Bad" isn\'t measurable.'), o('"Should I use Excel or SQL?"', 0, 'Tool choice is your job; it doesn\'t clarify the problem.'), o('"Okay!" and start digging', 3, 'You might spend days answering the wrong question.')] },
      { visual: <Bubble who="Ana" role="Product Lead" text="We need a KPI for whether the new onboarding works." />, question: 'Which KPI is best?', options: [o('% of new users completing setup within 7 days', 10, 'Specific, measurable, time-bound and tied directly to onboarding.'), o('Total registered users all-time', 0, 'A vanity metric: it only goes up and ignores onboarding.'), o('Number of app screens', 0, 'Not an outcome metric.')] },
      { visual: <Bubble who="Ken" role="CFO" text="Is our customer acquisition getting more expensive?" />, question: 'Which metric directly answers him?', options: [o('CAC (Customer Acquisition Cost) over time = marketing spend ÷ new customers', 10, 'CAC trend is exactly "cost to acquire" over time.'), o('Churn rate', 0, 'Churn is about losing customers, not acquiring them.'), o('Revenue per employee', 0, 'Unrelated to acquisition cost.')] },
      { visual: <Bubble who="Ken" role="CFO" text="And is that cost worth it?" />, question: 'What do you compare CAC against?', options: [o('Customer Lifetime Value (LTV). A healthy LTV:CAC is often ~3:1', 10, 'LTV vs CAC tells you if acquisition pays back.'), o('The number of employees', 0, 'Not a comparable unit.'), o('Last year\'s office rent', 0, 'Irrelevant.')] },
    ],
  },
  {
    story: 'The product team ran an A/B test on a new checkout button. Interpret it like a pro.',
    rounds: [
      { visual: <Bubble who="Ana" role="Product Lead" text="Variant B converted at 5.4% vs 5.0% for A. p-value is 0.31. Ship it?" />, question: 'Your response?', options: [o('Not conclusive: p = 0.31 means a gap this size could easily be chance. Keep testing or accept no clear difference', 10, 'At the usual 0.05 threshold, this isn\'t statistically significant.'), o('Yes! 5.4 > 5.0', 0, 'A raw difference without significance can be noise.'), o('B is 31% better', 0, 'The p-value isn\'t an effect size.')] },
      { visual: <Bubble who="Ana" role="Product Lead" text="After 2 days B is winning with p = 0.04. Can we stop now?" />, question: 'What\'s the risk?', options: [o('Peeking: stopping early when it looks good inflates false positives. Run to the planned sample size', 10, 'Decide the sample size up front and don\'t stop on the first good-looking result.'), o('No risk, 0.04 < 0.05', 3, 'Technically below 0.05, but repeated peeking makes it unreliable.'), o('Stop and also test 5 other changes at once', 0, 'That makes it impossible to tell which change worked.')] },
      { visual: <Bubble who="Raj" role="Engineer" text="Variant B had 70% mobile users, A had 40%." />, question: 'Why does this matter?', options: [o('The groups weren\'t comparable: randomisation may be broken, so the result is confounded', 10, 'A/B tests need random assignment so the groups are alike apart from the change.'), o('It doesn\'t; more mobile users is fine', 0, 'Device mix affects conversion, so it is a confounder.'), o('Mobile users are better customers', 3, 'Maybe, but that\'s exactly why the comparison is now unfair.')] },
      { visual: <Bubble who="Ana" role="Product Lead" text="Final: 4.8% → 5.6%, p = 0.002, ran full 3 weeks, groups balanced." />, question: 'What do you report?', options: [o('Significant lift of 0.8 percentage points (~17% relative). Recommend shipping and monitoring', 10, 'Report absolute and relative lift, confidence, and a clear recommendation.'), o('"p = 0.002" and nothing else', 3, 'Correct, but stakeholders need the effect size and recommendation.'), o('The test proves B will always be better forever', 0, 'Results can drift. Keep monitoring.')] },
    ],
  },
  {
    story: 'Presentation day with leadership. Every slide counts.',
    rounds: [
      { question: 'You have 10 minutes with the VP. How do you open?', options: [o('With the key finding and recommendation in one sentence', 10, 'Bottom line up front (BLUF). Execs may stop listening after the first minute.'), o('With your methodology and data sources', 3, 'Keep that for the appendix or for when they ask.'), o('With a joke and an agenda of 12 sections', 0, 'Wastes the most valuable minutes.')] },
      { visual: <Bubble who="Maria" role="VP Operations" text="That number seems too high. Are you sure?" />, question: 'How do you respond?', options: [o('Stay calm: explain how it was calculated, what you checked, and offer to verify a specific part', 10, 'Transparent, confident and open to being checked builds trust.'), o('Get defensive: "I\'m the analyst, trust me"', 0, 'Credibility comes from transparency, not authority.'), o('Immediately agree it\'s wrong', 0, 'Don\'t abandon a validated result without evidence.')] },
      { question: 'Your analysis has a real limitation (only 3 months of data). What do you do?', options: [o('State it clearly with its impact, and what would reduce it', 10, 'Honest caveats protect decisions and your credibility.'), o('Hide it so the results look stronger', 0, 'If it\'s found later, trust is gone.'), o('Spend half the talk on it', 3, 'Mention it proportionately; don\'t bury the insight.')] },
      { question: 'What should your final slide contain?', options: [o('Clear recommendation, expected impact, and next steps with owners', 10, 'End with action: what to do, why, and who does it.'), o('"Questions?"', 3, 'Fine to invite questions, but make the ask explicit first.'), o('A dense table of every number', 0, 'Appendix material, not the closing message.')] },
    ],
  },
  {
    story: 'The final interview for a Junior Data Analyst role. The panel is watching.',
    rounds: [
      { visual: <Bubble who="Chris" role="Hiring Manager" text="Tell me about a time you used data to solve a problem." />, question: 'Best structure for your answer?', options: [o('STAR: Situation, Task, Action, Result, with a number in the result', 10, 'STAR keeps it concise; a measurable result makes it memorable.'), o('List every tool you know', 0, 'Doesn\'t answer the question.'), o('Say you have no experience yet', 0, 'Use your capstone or past-career examples. Transferable stories count.')] },
      { visual: <Bubble who="Chris" role="Hiring Manager" text="Daily active users dropped 15% yesterday. Walk me through how you'd investigate." />, question: 'Strongest first move?', options: [o('Check if it\'s real (tracking or data pipeline issue?), then segment by platform, region and version to localise it', 10, 'Validate the data first, then segment to isolate the cause. Classic case framework.'), o('Assume a competitor launched something', 0, 'Jumping to conclusions without data.'), o('Tell them to run an A/B test', 3, 'A/B tests evaluate changes; they don\'t diagnose a drop.')] },
      { visual: <Bubble who="Jo" role="Senior Analyst" text="What's the difference between WHERE and HAVING?" />, question: 'Your answer:', options: [o('WHERE filters rows before grouping; HAVING filters groups after aggregation', 10, 'Crisp and correct, and you could add an example.'), o('They are the same', 0, 'They run at different stages of the query.'), o('HAVING is faster', 0, 'Speed isn\'t the difference.')] },
      { visual: <Bubble who="Chris" role="Hiring Manager" text="Why should we hire you over someone with a CS degree?" />, question: 'Best answer for a career changer:', options: [o('Connect your domain experience + proven projects (link portfolio) to their business problems', 10, 'Domain knowledge plus demonstrable skills is a real edge. Show proof.'), o('Apologise for not having a degree', 0, 'Never undersell yourself.'), o('Say you learn fast, with no examples', 3, 'Everyone says that. Prove it with your projects.')] },
      { visual: <Bubble who="Chris" role="Hiring Manager" text="Any questions for us?" />, question: 'Best question to ask?', options: [o('"What does success look like in the first 90 days, and what data stack does the team use?"', 10, 'Shows you\'re thinking about impact and how you\'ll actually work.'), o('"No, I\'m good."', 0, 'Missed chance to show interest.'), o('"How soon can I get promoted?"', 3, 'Fair to wonder, but lead with curiosity about the work.')] },
    ],
  },
]

export default function StakeholderSays({ stage, onComplete }: GameProps) {
  const s = STAGES[stage] ?? STAGES[0]
  return <ChoiceGame icon="🗣️" title="Stakeholder Says" story={s.story} rounds={s.rounds} onComplete={onComplete} accent="amber" />
}
