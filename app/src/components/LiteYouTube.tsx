import { useState } from 'react'

/** Thumbnail-first YouTube embed: the heavy player only loads when the learner presses play. */
export default function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false)
  if (play) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <button onClick={() => setPlay(true)} className="group relative h-full w-full" aria-label={`Play video: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-24 place-items-center rounded-2xl bg-red-600/90 text-3xl text-white shadow-2xl transition group-hover:scale-110">▶</span>
      </span>
    </button>
  )
}
