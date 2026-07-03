import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import {
  Eye,
  Phone,
  MapPin,
  ChevronRight,
  Star,
  Calendar,
  ArrowRight,
  CheckCircle,
  Cpu,
  HeartHandshake,
  Home as HomeIcon,
} from "lucide-react";
import { FadeIn, GoogleGIcon } from "../components/shared";
import { SERVICES } from "../lib/data";

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
    icon: HomeIcon,
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

export default function Home() {
  const navigate = useNavigate();

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
              <Link
                to="/rendez-vous"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-primary/5 text-primary font-semibold px-7 py-3.5 rounded-lg border-2 border-primary transition-all duration-300"
              >
                Découvrir nos services
                <ArrowRight className="w-4 h-4" />
              </Link>
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
              {/* TODO: replace with a real photo of Dr Zouid / the cabinet */}
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
              {/* TODO: replace with a real photo of Dr Zouid / the cabinet */}
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
                  onClick={() => navigate("/services")}
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
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 bg-secondary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              Voir tous nos services
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            <Link
              to="/a-propos"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
            >
              En savoir plus sur le cabinet
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            <Link
              to="/rendez-vous"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-secondary transition-colors shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </Link>
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
