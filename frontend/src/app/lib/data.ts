import {
  Glasses,
  ScanEye,
  Aperture,
  ShieldCheck,
  Baby,
  Stethoscope,
} from "lucide-react";

// Exactly 6 services, shown as a 3×2 (desktop) / 2×3 (tablet) / 1-col (mobile) grid.
// Shared between the Home page, the Services page and the Footer.
export const SERVICES = [
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
