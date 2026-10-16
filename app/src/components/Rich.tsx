import { Fragment, type ReactNode } from 'react'

/** Renders the lesson markup subset: **bold**, `code`, blank-line paragraphs and "- " bullet lines. */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    out.push(tok.startsWith('**') ? <strong key={k++} className="text-white">{tok.slice(2, -2)}</strong> : <code key={k++}>{tok.slice(1, -1)}</code>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export default function Rich({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/)
  return (
    <div className="prose-lesson">
      {blocks.map((b, i) => {
        const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
        const isList = lines.length > 0 && lines.every((l) => l.startsWith('- '))
        if (isList)
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}
            </ul>
          )
        // Mixed paragraph + bullets
        const para: string[] = []
        const items: string[] = []
        for (const l of lines) (l.startsWith('- ') ? items : para).push(l)
        return (
          <Fragment key={i}>
            {para.length > 0 && <p>{inline(para.join(' '))}</p>}
            {items.length > 0 && <ul>{items.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>}
          </Fragment>
        )
      })}
    </div>
  )
}
