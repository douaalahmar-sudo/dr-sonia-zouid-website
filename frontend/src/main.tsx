import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import AdminApp from "./admin/AdminApp.tsx";
import "./styles/index.css";

// The public website keeps its own internal navigation; the admin panel is
// mounted under /admin/* and uses React Router for its sub-pages.
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
