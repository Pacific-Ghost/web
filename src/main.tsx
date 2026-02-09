import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css"
import App from "./App.tsx";
import { BioPage } from "./components/BioPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ep/lovesickage" state={{ fromRoot: true }} replace />} />
        <Route path="/ep/:id" element={<App />} />
        <Route path="/bio" element={<BioPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
