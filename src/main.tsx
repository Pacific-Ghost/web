import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./index.css"
import App from "./App.tsx";
import { BioPage } from "./components/BioPage.tsx";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, position: "fixed" as const, inset: 0 },
}

const pageTransition = { duration: 0.6, ease: "easeInOut" } as const

function AnimatedRoutes() {
  const location = useLocation()

  // Use a simplified key: "bio" vs "ep" so EP-to-EP navigation doesn't fade
  const routeKey = location.pathname === "/bio" ? "bio" : "ep"

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
          <Route path="/" element={<Navigate to="/ep/lovesickage" replace />} />
          <Route path="/ep/:id" element={<App />} />
          <Route path="/bio" element={<BioPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
