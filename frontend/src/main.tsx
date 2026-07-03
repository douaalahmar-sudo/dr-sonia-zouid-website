import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from "./app/App.tsx";
import Home from "./app/pages/Home.tsx";
import About from "./app/pages/About.tsx";
import Services from "./app/pages/Services.tsx";
import Gallery from "./app/pages/Gallery.tsx";
import Booking from "./app/pages/Booking.tsx";
import Contact from "./app/pages/Contact.tsx";
import LegalMentions from "./app/pages/LegalMentions.tsx";
import AdminApp from "./admin/AdminApp.tsx";
import "./styles/index.css";

// The public website uses real routes (App is the shared layout shell);
// the admin panel is mounted under /admin/* and keeps its own sub-router.
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/rendez-vous" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<LegalMentions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
