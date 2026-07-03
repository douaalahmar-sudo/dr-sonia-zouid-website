import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Facebook,
  Instagram,
  FileText,
} from "lucide-react";
import Logo from "../shared/Logo";
import { SERVICES } from "./lib/data";

// ─── Public routes ────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; to: string }[] = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Services", to: "/services" },
  { label: "Rendez-vous", to: "/rendez-vous" },
  { label: "Contact", to: "/contact" },
];

// ─── Scroll to top on every route change ─────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-md shadow-sm shadow-primary/8"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group transition-opacity hover:opacity-80"
            aria-label="Dr Sonia Zouid — Accueil"
          >
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === to
                    ? "text-accent bg-accent/12"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/rendez-vous"
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Prendre rendez-vous</span>
              <span className="md:hidden">Rendez-vous</span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-300"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu — animated open/close */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-border pb-4 pt-2">
                {NAV_ITEMS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      pathname === to
                        ? "text-accent bg-accent/12"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  to="/rendez-vous"
                  onClick={() => setMenuOpen(false)}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  Prendre rendez-vous
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-3 gap-10">
        {/* About + quick links */}
        <div>
          <div className="mb-4">
            <Logo variant="light" />
          </div>
          <p className="text-sm leading-relaxed text-white/60 mb-5">
            Votre santé oculaire entre de bonnes mains à Téboulba.
          </p>
          <div className="flex gap-3 mb-6">
            {[Facebook, Instagram].map((Icon, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/70 flex items-center justify-center cursor-pointer transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "Accueil", to: "/" },
              { label: "À propos", to: "/a-propos" },
              { label: "Rendez-vous", to: "/rendez-vous" },
              { label: "Contact", to: "/contact" },
              { label: "Galerie", to: "/galerie" },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services list */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Nos services</h4>
          <ul className="space-y-2.5">
            {SERVICES.map(({ title }) => (
              <li key={title}>
                <Link
                  to="/services"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300 text-left"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info + hours */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-white/60 mb-6">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
              <span>
                Av. Habib Bourguiba,
                <br />
                Téboulba, Monastir
              </span>
            </div>
            <a
              href="tel:73479960"
              className="flex items-center gap-2.5 hover:text-white transition-colors duration-300"
            >
              <Phone className="w-4 h-4 text-white/40" />
              <span>73 479 960</span>
            </a>
          </div>
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex justify-between gap-4">
              <span>Lun – Ven</span>
              <span className="text-white/80">8h30 – 17h</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Samedi</span>
              <span className="text-white/80">9h – 13h</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Dimanche</span>
              <span className="italic">Fermé</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <span>
            © 2025 Dr Sonia Zouid — Cabinet d'Ophtalmologie. Tous droits
            réservés.
          </span>
          <div className="flex items-center gap-4">
            <Link
              to="/mentions-legales"
              className="flex items-center gap-1.5 hover:text-white/70 transition-colors duration-300"
            >
              <FileText className="w-3 h-3" />
              Mentions légales
            </Link>
            <span>
              Site réalisé par{" "}
              {/* TODO: replace with the real portfolio URL once it's live */}
              <a
                href="https://douaa-lahmar.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-300"
              >
                Douaa Lahmar
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp Button ──────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      className="group fixed bottom-6 right-6 z-50"
    >
      {/* Tooltip, revealed on hover */}
      <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap bg-foreground text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
        Contactez-nous sur WhatsApp
      </span>

      <a
        href="https://wa.me/21673479960"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Contacter via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </motion.div>
  );
}

// ─── App — thin layout shell around the routed public pages ──────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header scrolled={scrolled} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
