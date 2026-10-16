import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-7xl font-bold glow-text">404</p>
      <p className="mt-2 text-ink-400">This rung of the ladder doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-6">Back to the tower</Link>
    </div>
  )
}
