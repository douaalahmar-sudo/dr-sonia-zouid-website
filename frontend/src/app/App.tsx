import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  Mail,
  ChevronRight,
  Star,
  Shield,
  Heart,
  Glasses,
  ScanEye,
  Aperture,
  ShieldCheck,
  Baby,
  CheckCircle,
  Calendar,
  MessageCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Users,
  Stethoscope,
  Cpu,
  HeartHandshake,
  Home,
  Images,
  FileText,
} from "lucide-react";
import { submitAppointment, submitContact } from "./lib/api";
import Logo from "../shared/Logo";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "accueil"
  | "apropos"
  | "services"
  | "galerie"
  | "rendezvous"
  | "contact"
  | "mentions";

// ─── Google "G" mark (for the "leave a review" link) ──────────────────────────
function GoogleGIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.66Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3a7.15 7.15 0 0 1-4.07 1.17c-3.13 0-5.78-2.11-6.73-4.96H1.24v3.09A11.98 11.98 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.31A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.31V6.6H1.24A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.24 5.4l4.03-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.24 6.6l4.03 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

// ─── Animation helper ─────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "none";
}) {
  const initial =
    from === "left"
      ? { opacity: 0, x: -32 }
      : from === "right"
      ? { opacity: 0, x: 32 }
      : from === "none"
      ? { opacity: 0 }
      : { opacity: 0, y: 28 };
  const animate =
    from === "left" || from === "right"
      ? { opacity: 1, x: 0 }
      : from === "none"
      ? { opacity: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Accueil", page: "accueil" },
  { label: "À propos", page: "apropos" },
  { label: "Services", page: "services" },
  { label: "Rendez-vous", page: "rendezvous" },
  { label: "Contact", page: "contact" },
];

// Exactly 6 services, shown as a 3×2 (desktop) / 2×3 (tablet) / 1-col (mobile) grid.
const SERVICES = [
  {
    icon: Stethoscope,
    title: "Consultation générale",
    desc: "Examen complet de la santé oculaire pour détecter et traiter toute anomalie visuelle dès les premiers signes.",
    teal: false,
  },
  {
    icon: ScanEye,
    title: "Examen de la vue",
    desc: "Bilan visuel précis pour déterminer votre correction optique et adapter votre prescription à chaque œil.",
    teal: true,
  },
  {
    icon: ShieldCheck,
    title: "Dépistage glaucome",
    desc: "Mesure de la pression intraoculaire et analyse du nerf optique pour un dépistage précoce et efficace.",
    teal: false,
  },
  {
    icon: Aperture,
    title: "Dépistage cataracte",
    desc: "Évaluation du cristallin et suivi de l'évolution pour une prise en charge adaptée et rapide.",
    teal: true,
  },
  {
    icon: Glasses,
    title: "Prescription lunettes / lentilles",
    desc: "Correction optique personnalisée — lunettes de vue, lentilles de contact souples ou rigides, et ordonnances.",
    teal: false,
  },
  {
    icon: Baby,
    title: "Suivi pédiatrique",
    desc: "Bilan visuel de l'enfant dès le plus jeune âge pour dépister strabisme, amblyopie et troubles réfractifs.",
    teal: true,
  },
];

// 4 value props for "Pourquoi nous choisir" — horizontal row, icon above text.
const VALUE_PROPS = [
  {
    icon: Cpu,
    title: "Équipements modernes",
    desc: "Un cabinet équipé des dernières technologies pour des diagnostics précis et fiables.",
  },
  {
    icon: HeartHandshake,
    title: "Prise en charge personnalisée",
    desc: "Chaque patient est écouté et bénéficie d'un suivi adapté à sa situation.",
  },
  {
    icon: Home,
    title: "Cadre chaleureux",
    desc: "Un environnement moderne, apaisant et pensé pour votre confort à chaque visite.",
  },
  {
    icon: MapPin,
    title: "Accès facile à Téboulba",
    desc: "Un cabinet bien situé, avec des créneaux en semaine et le samedi matin.",
  },
];

// Only a couple of real Google reviews exist so far — these 3 cards are
// clearly labelled as illustrative examples in the UI, not real quotes.
const TESTIMONIALS = [
  {
    name: "Patient(e) du cabinet",
    text: "Accueil chaleureux et écoute attentive. Le déroulement de la consultation a été clairement expliqué du début à la fin.",
    stars: 5,
  },
  {
    name: "Patient(e) du cabinet",
    text: "Cabinet moderne et rendez-vous facile à obtenir. Le personnel prend le temps de répondre à toutes les questions.",
    stars: 5,
  },
  {
    name: "Patient(e) du cabinet",
    text: "Suivi rassurant pour toute la famille, y compris les enfants. Une prise en charge sérieuse et bienveillante.",
    stars: 5,
  },
];

const GALLERY_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1682663947087-94157b8e4a0c?w=800&h=600&fit=crop&auto=format",
    caption: "Équipement de consultation",
    span: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1770217757395-f14e9c2f601b?w=600&h=700&fit=crop&auto=format",
    caption: "Salle d'examen ophtalmologique",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1677773382668-8a84321836e9?w=600&h=500&fit=crop&auto=format",
    caption: "Appareillage de précision",
    span: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?w=700&h=500&fit=crop&auto=format",
    caption: "Consultation avec le patient",
    span: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=700&h=500&fit=crop&auto=format",
    caption: "Dr Sonia Zouid, ophtalmologue",
    span: "col-span-2",
  },
];

// ─── Form validation helpers ───────────────────────────────────────────────────
type RdvForm = {
  nom: string;
  telephone: string;
  email: string;
  motif: string;
  date: string;
  heure: string;
  message: string;
};

function validateRdv(f: RdvForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.nom.trim() || f.nom.trim().length < 3)
    e.nom = "Veuillez entrer votre nom complet.";
  if (!f.telephone.match(/^[0-9]{8}$/))
    e.telephone = "Numéro invalide — 8 chiffres attendus.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Adresse email invalide.";
  if (!f.motif) e.motif = "Veuillez sélectionner un motif.";
  if (!f.date) e.date = "La date est requise.";
  return e;
}

type ContactForm = { nom: string; email: string; telephone: string; message: string };

function validateContact(f: ContactForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.nom.trim()) e.nom = "Le nom est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email invalide.";
  if (f.telephone && !f.telephone.match(/^[0-9]{8}$/))
    e.telephone = "Numéro invalide — 8 chiffres attendus.";
  if (!f.message.trim() || f.message.trim().length < 10)
    e.message = "Message trop court (10 caractères minimum).";
  return e;
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({
  activePage,
  navigate,
  scrolled,
}: {
  activePage: Page;
  navigate: (p: Page) => void;
  scrolled: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <button
            onClick={() => navigate("accueil")}
            className="flex items-center group transition-opacity hover:opacity-80"
            aria-label="Dr Sonia Zouid — Accueil"
          >
            <Logo />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activePage === page
                    ? "text-accent bg-accent/12"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("rendezvous")}
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Prendre rendez-vous</span>
              <span className="md:hidden">Rendez-vous</span>
            </button>
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
                {NAV_ITEMS.map(({ label, page }) => (
                  <button
                    key={page}
                    onClick={() => {
                      navigate(page);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      activePage === page
                        ? "text-accent bg-accent/12"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    navigate("rendezvous");
                    setMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  Prendre rendez-vous
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 lg:pt-32 lg:pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/15 text-accent border border-accent/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Eye className="w-4 h-4" />
                Cabinet d'Ophtalmologie — Téboulba
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] mb-6"
            >
              Votre vision,{" "}
              <span className="text-primary">notre priorité</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
            >
              Dr Sonia Zouid vous accueille dans un cadre moderne et
              bienveillant, pour prendre soin de votre santé oculaire et
              celle de votre famille.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("rendezvous")}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </button>
              <button
                onClick={() => navigate("services")}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-primary/5 text-primary font-semibold px-7 py-3.5 rounded-lg border-2 border-primary transition-all duration-300"
              >
                Découvrir nos services
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex gap-10 mt-12 pt-8 border-t border-border"
            >
              {[
                { value: "15+", label: "Années d'expérience" },
                { value: "5 000+", label: "Patients suivis" },
                { value: "6", label: "Services spécialisés" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile hero image — stacks below the text/CTAs, never behind them */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="lg:hidden mt-10 relative rounded-3xl overflow-hidden shadow-xl bg-secondary aspect-[4/5] max-w-sm mx-auto"
            >
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=750&fit=crop&auto=format"
                alt="Dr Sonia Zouid, ophtalmologue, accueil chaleureux"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Hero image — desktop only, warm & colorful, with a soft gradient
              blending its left edge into the section's light background so
              it never competes with the headline for attention. */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-secondary aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&h=875&fit=crop&auto=format"
                alt="Dr Sonia Zouid, ophtalmologue, accueil chaleureux"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/15 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Rendez-vous disponibles
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Appelez le 73 479 960
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ── Services overview ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Nos prestations
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Des soins complets pour{" "}
              <br className="hidden sm:block" />
              toute la famille
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Du nourrisson à la personne âgée, nous proposons une gamme
              complète de services ophtalmologiques avec des équipements
              modernes.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon: Icon, title, desc, teal }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div
                  className="group relative overflow-hidden p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => navigate("services")}
                >
                  {/* Teal top accent, revealed on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0 group-hover:h-1 bg-accent transition-all duration-300" />

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      teal ? "bg-accent/15" : "bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        teal ? "text-accent" : "text-primary"
                      }`}
                    />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                  <div
                    className={`flex items-center gap-1 mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      teal ? "text-accent" : "text-primary"
                    }`}
                  >
                    En savoir plus <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center mt-8">
            <button
              onClick={() => navigate("services")}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 bg-secondary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              Voir tous nos services
              <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-20 bg-[#EAF5F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Pourquoi nous choisir
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Une médecine attentive, un regard bienveillant
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                  {desc}
                </p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="text-center mt-14">
            <button
              onClick={() => navigate("apropos")}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
            >
              En savoir plus sur le cabinet
              <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Testimonials ──
          Only a couple of real Google reviews exist today, so this section
          stays deliberately modest: a few clearly-labelled example cards
          plus an invitation to leave a real review on Google. */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Témoignages
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ce que disent nos patients
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, text, stars }, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative bg-background rounded-2xl p-6 shadow-sm h-full">
                  <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-white rounded-full px-2.5 py-1">
                    Exemple
                  </span>
                  <div className="flex gap-1 mb-4">
                    {[...Array(stars)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/15 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {name.charAt(0)}
                    </div>
                    <div className="font-semibold text-sm text-foreground">
                      {name}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-4">
              Partagez votre expérience sur Google
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Dr+Sonia+Zouid+Ophtalmologue+Teboulba"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white border border-border rounded-xl px-5 py-3 text-sm font-semibold text-foreground hover:shadow-md transition-all duration-300"
            >
              <GoogleGIcon className="w-4 h-4" />
              Laisser un avis Google
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-24 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>
        <FadeIn className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            Prenez soin de votre vision dès aujourd'hui
          </h2>
          <p className="text-white/80 mb-10 text-lg">
            N'attendez pas — une consultation régulière est le meilleur moyen
            de préserver votre capital visuel sur le long terme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("rendezvous")}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-secondary transition-colors shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </button>
            <a
              href="tel:73479960"
              className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 transition-colors border border-white/30"
            >
              <Phone className="w-5 h-5" />
              73 479 960
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

// ─── À propos Page ────────────────────────────────────────────────────────────
function AProposPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Notre cabinet
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              À propos
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Doctor profile */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-5 gap-12 items-start">
          <FadeIn from="left" className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-secondary aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=600&h=800&fit=crop&auto=format"
                alt="Dr Sonia Zouid, ophtalmologue à Téboulba"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn from="right" className="lg:col-span-3">
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">
              Ophtalmologue à Téboulba
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Dr Sonia Zouid
            </h2>
            <div className="text-primary font-medium mb-7">
              Médecin Ophtalmologiste
            </div>

            <div className="space-y-4 mb-9 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                Diplômée de la Faculté de Médecine de Monastir, le Dr Sonia
                Zouid a consacré plus de 15 ans à la pratique de
                l'ophtalmologie dans la région de Téboulba et du Sahel
                tunisien. Passionnée par son métier, elle accompagne avec
                bienveillance des milliers de patients de tous âges.
              </p>
              <p>
                Spécialisée dans le dépistage précoce des maladies oculaires
                — glaucome, cataracte, dégénérescence maculaire — elle
                pratique également la réfraction, la prescription optique et
                le bilan visuel pédiatrique.
              </p>
              <p>
                Son approche allie rigueur médicale et écoute attentive :
                chaque patient reçoit un bilan personnalisé et un
                accompagnement sur le long terme.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                "Diplôme de Médecine — Faculté de Monastir",
                "Spécialisation en Ophtalmologie",
                "Membre de la Société Tunisienne d'Ophtalmologie",
                "Formation continue en chirurgie réfractive",
                "15+ ans de pratique clinique",
                "Membre du Conseil de l'Ordre des Médecins",
              ].map((q) => (
                <div
                  key={q}
                  className="flex items-start gap-2.5 bg-background rounded-xl p-3 border border-border"
                >
                  <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{q}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("rendezvous")}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Prendre rendez-vous
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Notre approche */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Notre approche
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Ce qui nous guide au quotidien
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Bienveillance",
                desc: "Un accueil chaleureux et une écoute sincère pour chaque patient.",
              },
              {
                icon: Shield,
                title: "Rigueur",
                desc: "Des protocoles stricts et des équipements certifiés pour des diagnostics fiables.",
              },
              {
                icon: Users,
                title: "Accessibilité",
                desc: "Des consultations adaptées à tous, avec des créneaux en semaine et le samedi.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="text-center p-6 bg-white rounded-2xl border border-border shadow-sm h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Services Page ────────────────────────────────────────────────────────────
function ServicesPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Nos prestations
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Nos services
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Une gamme complète de soins ophtalmologiques pour prendre en
              charge toute la famille, avec les dernières technologies
              disponibles.
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc, teal }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="flex gap-5 p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow h-full">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      teal ? "bg-accent/15" : "bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        teal ? "text-accent" : "text-primary"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Info band */}
          <FadeIn delay={0.4}>
            <div className="mt-16 bg-primary rounded-3xl p-8 sm:p-12 grid sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: Clock, label: "Lun – Ven", value: "8h00 – 18h00" },
                { icon: Clock, label: "Samedi", value: "8h00 – 13h00" },
                { icon: Phone, label: "Téléphone", value: "73 479 960" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-white">
                  <Icon className="w-6 h-6 mx-auto mb-2 opacity-70" />
                  <div className="text-white/70 text-sm mb-1">{label}</div>
                  <div className="font-bold text-lg">{value}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.5} className="mt-10 text-center">
            <button
              onClick={() => navigate("rendezvous")}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// ─── Galerie Page ─────────────────────────────────────────────────────────────
function GaleriePage() {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Notre espace
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Galerie
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Découvrez nos installations modernes et notre équipement
              ophtalmologique de pointe, au service de votre santé visuelle.
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
            {GALLERY_ITEMS.map(({ src, caption, span }, i) => (
              <FadeIn key={caption} delay={i * 0.1} className={span}>
                <div className="group relative rounded-2xl overflow-hidden bg-secondary h-full cursor-pointer">
                  <img
                    src={src}
                    alt={caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-sm font-semibold">
                      {caption}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5} className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-background border border-border rounded-2xl px-6 py-4 text-muted-foreground text-sm">
              <Images className="w-5 h-5 text-primary" />
              Photos libres de droits — à remplacer par les photos réelles du
              cabinet lors de la mise en ligne.
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// ─── Rendez-vous Page ─────────────────────────────────────────────────────────
function RendezVousPage() {
  const emptyForm: RdvForm = {
    nom: "",
    telephone: "",
    email: "",
    motif: "",
    date: "",
    heure: "",
    message: "",
  };
  const [form, setForm] = useState<RdvForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const motifs = [
    "Consultation générale",
    "Examen de la vue",
    "Dépistage glaucome",
    "Dépistage cataracte",
    "Prescription lunettes / lentilles",
    "Suivi pédiatrique",
    "Urgences ophtalmologiques",
    "Autre",
  ];

  const touch = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    );
    setTouched(allTouched);
    const errs = validateRdv(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const result = await submitAppointment(form);
    setSubmitting(false);
    if (result.ok) setSubmitted(true);
    else setServerError(result.message);
  };

  const fieldCls = (name: string) =>
    `w-full px-4 py-3 bg-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
      touched[name] && errors[name]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-primary/30 focus:border-primary"
    }`;

  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Prise en charge rapide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Prendre rendez-vous
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Remplissez le formulaire ci-dessous et nous vous confirmerons
              votre rendez-vous dans les plus brefs délais.
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-5 gap-12">
          {/* Info sidebar */}
          <FadeIn from="left" className="lg:col-span-2 space-y-5">
            <div className="bg-background rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4">
                Informations pratiques
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: "Adresse",
                    value: "Av. Habib Bourguiba, Téboulba",
                  },
                  {
                    icon: Phone,
                    label: "Téléphone",
                    value: "73 479 960",
                    href: "tel:73479960",
                  },
                  { icon: Clock, label: "Lun – Ven", value: "8h30 – 17h00" },
                  { icon: Clock, label: "Samedi", value: "9h00 – 13h00" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-foreground">
                          {value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-sm mb-1">
                    Confidentialité garantie
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Vos données personnelles sont protégées et utilisées
                    uniquement à des fins médicales, conformément à la
                    réglementation en vigueur.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
              <div className="font-semibold text-foreground text-sm mb-1">
                Disponible sur WhatsApp
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Pour toute urgence ou question rapide, contactez-nous
                directement via WhatsApp.
              </p>
              <a
                href="https://wa.me/21673479960"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Écrire sur WhatsApp
              </a>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn from="right" className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20 px-8 bg-success/5 border border-success/20 rounded-3xl"
              >
                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Demande envoyée !
                </h3>
                <p className="text-muted-foreground mb-6">
                  Merci, {form.nom}. Nous vous contacterons au{" "}
                  <span className="font-semibold text-foreground">
                    {form.telephone}
                  </span>{" "}
                  pour confirmer votre rendez-vous.
                </p>
                <button
                  onClick={() => {
                    setForm(emptyForm);
                    setErrors({});
                    setTouched({});
                    setSubmitted(false);
                  }}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Nom + Téléphone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom et prénom"
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                      onBlur={() => {
                        touch("nom");
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("nom")}
                    />
                    {touched.nom && errors.nom && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.nom}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      placeholder="12 345 678"
                      value={form.telephone}
                      onChange={(e) =>
                        setForm({ ...form, telephone: e.target.value })
                      }
                      onBlur={() => {
                        touch("telephone");
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("telephone")}
                    />
                    {touched.telephone && errors.telephone && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.telephone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onBlur={() => {
                      touch("email");
                      setErrors(validateRdv({ ...form }));
                    }}
                    className={fieldCls("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Motif */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Motif de consultation *
                  </label>
                  <select
                    value={form.motif}
                    onChange={(e) =>
                      setForm({ ...form, motif: e.target.value })
                    }
                    onBlur={() => {
                      touch("motif");
                      setErrors(validateRdv({ ...form }));
                    }}
                    className={`${fieldCls("motif")} appearance-none cursor-pointer`}
                  >
                    <option value="">Sélectionnez le motif…</option>
                    {motifs.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {touched.motif && errors.motif && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.motif}
                    </p>
                  )}
                </div>

                {/* Date + Heure */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      onBlur={() => {
                        touch("date");
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("date")}
                    />
                    {touched.date && errors.date && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Heure préférée
                    </label>
                    <select
                      value={form.heure}
                      onChange={(e) =>
                        setForm({ ...form, heure: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Indifférent</option>
                      <option value="matin">Matin</option>
                      <option value="apres-midi">Après-midi</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Précisez votre demande ou symptômes si nécessaire…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>

                {serverError && (
                  <p className="text-destructive text-sm text-center bg-destructive/10 rounded-xl py-3 px-4">
                    {serverError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-5 h-5" />
                  {submitting ? "Envoi en cours…" : "Envoyer ma demande de rendez-vous"}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  * Champs obligatoires. Nous confirmerons votre rendez-vous
                  par téléphone.
                </p>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage() {
  const empty: ContactForm = { nom: "", email: "", telephone: "", message: "" };
  const [form, setForm] = useState<ContactForm>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const touch = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const fieldCls = (name: string) =>
    `w-full px-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
      touched[name] && errors[name]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-primary/30 focus:border-primary"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setTouched({ nom: true, email: true, message: true });
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const result = await submitContact(form);
    setSubmitting(false);
    if (result.ok) setSent(true);
    else setServerError(result.message);
  };

  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Nous contacter
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Contact
            </h1>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Info col */}
          <FadeIn from="left" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Informations de contact
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: MapPin,
                  title: "Adresse",
                  lines: [
                    "Av. Habib Bourguiba",
                    "Téboulba, Monastir, Tunisie",
                  ],
                },
                {
                  icon: Phone,
                  title: "Téléphone",
                  lines: ["73 479 960"],
                  href: "tel:73479960",
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: ["cabinet.zouid@gmail.com"],
                },
              ].map(({ icon: Icon, title, lines, href }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">
                      {title}
                    </div>
                    {lines.map((l) =>
                      href ? (
                        <a
                          key={l}
                          href={href}
                          className="block text-muted-foreground text-sm hover:text-primary transition-colors"
                        >
                          {l}
                        </a>
                      ) : (
                        <div
                          key={l}
                          className="text-muted-foreground text-sm"
                        >
                          {l}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Horaires d'ouverture
              </h3>
              <div className="space-y-1.5">
                {[
                  ["Lundi", "8h00 – 18h00"],
                  ["Mardi", "8h00 – 18h00"],
                  ["Mercredi", "8h00 – 18h00"],
                  ["Jeudi", "8h00 – 18h00"],
                  ["Vendredi", "8h00 – 18h00"],
                  ["Samedi", "8h00 – 13h00"],
                  ["Dimanche", "Fermé"],
                ].map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
                  >
                    <span
                      className={
                        day === "Dimanche"
                          ? "text-muted-foreground"
                          : "font-medium text-foreground"
                      }
                    >
                      {day}
                    </span>
                    <span
                      className={
                        day === "Dimanche"
                          ? "text-muted-foreground italic"
                          : "text-primary font-medium"
                      }
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="rounded-2xl overflow-hidden border border-border h-56 bg-secondary">
              <iframe
                title="Localisation Cabinet Dr Sonia Zouid — Téboulba"
                src="https://maps.google.com/maps?q=Teboulba,Monastir,Tunisia&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn from="right">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Envoyez-nous un message
            </h2>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20 bg-success/5 border border-success/20 rounded-3xl"
              >
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">
                  Message envoyé !
                </h3>
                <p className="text-muted-foreground text-sm">
                  Nous vous répondrons dans les meilleurs délais.
                </p>
                <button
                  onClick={() => {
                    setForm(empty);
                    setErrors({});
                    setTouched({});
                    setSent(false);
                  }}
                  className="mt-4 text-primary text-sm font-semibold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    onBlur={() => {
                      touch("nom");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("nom")}
                  />
                  {touched.nom && errors.nom && (
                    <p className="text-destructive text-xs mt-1">{errors.nom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onBlur={() => {
                      touch("email");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="12 345 678"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm({ ...form, telephone: e.target.value })
                    }
                    onBlur={() => {
                      touch("telephone");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("telephone")}
                  />
                  {touched.telephone && errors.telephone && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.telephone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Votre message…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onBlur={() => {
                      touch("message");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={`${fieldCls("message")} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                {serverError && (
                  <p className="text-destructive text-sm text-center bg-destructive/10 rounded-xl py-3 px-4">
                    {serverError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5" />
                  {submitting ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// ─── Mentions légales Page ─────────────────────────────────────────────────────
function MentionsPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Informations légales
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Mentions légales
            </h1>
          </FadeIn>
        </div>
      </div>
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="prose prose-sm text-muted-foreground space-y-8">
              {[
                {
                  title: "Éditeur du site",
                  content:
                    "Dr Sonia Zouid — Cabinet d'Ophtalmologie\nAv. Habib Bourguiba, Téboulba, Monastir, Tunisie\nTél. : 73 479 960",
                },
                {
                  title: "Objet du site",
                  content:
                    "Ce site vitrine a pour objet de présenter les services du cabinet d'ophtalmologie du Dr Sonia Zouid, de faciliter la prise de contact et la demande de rendez-vous.",
                },
                {
                  title: "Données personnelles",
                  content:
                    "Les informations collectées via les formulaires (nom, téléphone, email) sont utilisées exclusivement à des fins de prise de rendez-vous et de contact médical. Elles ne sont ni cédées, ni vendues à des tiers. Conformément à la loi tunisienne sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
                },
                {
                  title: "Propriété intellectuelle",
                  content:
                    "L'ensemble du contenu de ce site (textes, images, mise en page) est la propriété du Dr Sonia Zouid. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.",
                },
                {
                  title: "Photographies",
                  content:
                    "Les photographies utilisées sur ce site sont des images libres de droits (source : Unsplash). Elles seront remplacées par les photographies réelles du cabinet lors de la mise en ligne définitive.",
                },
              ].map(({ title, content }) => (
                <div key={title}>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    {title}
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed">
                    {content}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ navigate }: { navigate: (p: Page) => void }) {
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
            {(
              [
                { label: "Accueil", page: "accueil" as Page },
                { label: "À propos", page: "apropos" as Page },
                { label: "Rendez-vous", page: "rendezvous" as Page },
                { label: "Contact", page: "contact" as Page },
                { label: "Galerie", page: "galerie" as Page },
              ] as { label: string; page: Page }[]
            ).map(({ label, page }) => (
              <li key={page}>
                <button
                  onClick={() => navigate(page)}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  {label}
                </button>
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
                <button
                  onClick={() => navigate("services")}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300 text-left"
                >
                  {title}
                </button>
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
            <button
              onClick={() => navigate("mentions")}
              className="flex items-center gap-1.5 hover:text-white/70 transition-colors duration-300"
            >
              <FileText className="w-3 h-3" />
              Mentions légales
            </button>
            <span>Site réalisé par Douaa Lahmar</span>
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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState<Page>("accueil");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activePage={activePage} navigate={navigate} scrolled={scrolled} />
      <main>
        {activePage === "accueil" && <HomePage navigate={navigate} />}
        {activePage === "apropos" && <AProposPage navigate={navigate} />}
        {activePage === "services" && <ServicesPage navigate={navigate} />}
        {activePage === "galerie" && <GaleriePage />}
        {activePage === "rendezvous" && <RendezVousPage />}
        {activePage === "contact" && <ContactPage />}
        {activePage === "mentions" && <MentionsPage />}
      </main>
      <Footer navigate={navigate} />
      <WhatsAppButton />
    </div>
  );
}
