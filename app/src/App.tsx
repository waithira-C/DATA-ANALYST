import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Spinner from './components/Spinner'

const Home = lazy(() => import('./pages/Home'))
const FloorPage = lazy(() => import('./pages/FloorPage'))
const StepPlayer = lazy(() => import('./pages/StepPlayer'))
const Library = lazy(() => import('./pages/Library'))
const Jobs = lazy(() => import('./pages/Jobs'))
const Hire = lazy(() => import('./pages/Hire'))
const Achievements = lazy(() => import('./pages/Achievements'))
const CertificatePage = lazy(() => import('./pages/Certificate'))
const Exam = lazy(() => import('./pages/Exam'))
const Verify = lazy(() => import('./pages/Verify'))
const Auth = lazy(() => import('./pages/Auth'))
const Arcade = lazy(() => import('./pages/Arcade'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Warm the chunks a learner hits first so navigation never stalls behind the 3D scene. */
function usePreloadRoutes() {
  useEffect(() => {
    const load = () => {
      import('./pages/StepPlayer')
      import('./pages/FloorPage')
      import('./pages/Jobs')
      import('./pages/Library')
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(load, { timeout: 2000 })
    else setTimeout(load, 1200)
  }, [])
}

export default function App() {
  usePreloadRoutes()
  return (
    <Suspense fallback={<Spinner full />}>
      <Routes>
        <Route path="/verify/:id" element={<Verify />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="floor/:id" element={<FloorPage />} />
          <Route path="step/:id" element={<StepPlayer />} />
          <Route path="arcade" element={<Arcade />} />
          <Route path="library" element={<Library />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="hire" element={<Hire />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="exam" element={<Exam />} />
          <Route path="auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
