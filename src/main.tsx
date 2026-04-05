import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import { BioPage } from './components/BioPage.tsx'
import { ServicesProvider } from './services/ServicesProvider'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, position: 'fixed' as const, inset: 0 },
}

const pageTransition = { duration: 0.6, ease: 'easeInOut' } as const

// eslint-disable-next-line react-refresh/only-export-components
function AnimatedRoutes() {
  const location = useLocation()

  const routeKey = location.pathname === '/bio' ? 'bio' : 'home'

  return (
    <AnimatePresence>
      <motion.div
        key={routeKey}
        className="page-wrapper"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<App />} />
          <Route path="/bio" element={<BioPage />} />
          {/* Redirect old EP routes to home */}
          <Route path="/ep/:id" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ServicesProvider>
        <AnimatedRoutes />
      </ServicesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
