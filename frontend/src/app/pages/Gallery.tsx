import { Images } from "lucide-react";
import { FadeIn } from "../components/shared";

// TODO: replace these stock photos with real photos of the cabinet before launch
const GALLERY_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1682663947087-94157b8e4a0c?w=800&h=600&fit=crop&auto=format",
    caption: "Équipement de consultation",
    alt: "Fauteuil d'examen et équipement de consultation ophtalmologique dans une salle lumineuse du cabinet",
    span: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1770217757395-f14e9c2f601b?w=600&h=700&fit=crop&auto=format",
    caption: "Salle d'examen ophtalmologique",
    alt: "Salle d'examen ophtalmologique équipée d'instruments de diagnostic modernes",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1677773382668-8a84321836e9?w=600&h=500&fit=crop&auto=format",
    caption: "Appareillage de précision",
    alt: "Gros plan sur un appareil de mesure ophtalmologique de précision",
    span: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?w=700&h=500&fit=crop&auto=format",
    caption: "Consultation avec le patient",
    alt: "Ophtalmologue examinant les yeux d'un patient lors d'une consultation au cabinet",
    span: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=700&h=500&fit=crop&auto=format",
    caption: "Dr Sonia Zouid, ophtalmologue",
    alt: "Portrait du Dr Sonia Zouid, ophtalmologue, souriante dans son cabinet",
    span: "col-span-2",
  },
];

export default function Gallery() {
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
            {GALLERY_ITEMS.map(({ src, caption, alt, span }, i) => (
              <FadeIn key={caption} delay={i * 0.1} className={span}>
                <div className="group relative rounded-2xl overflow-hidden bg-secondary h-full cursor-pointer">
                  <img
                    src={src}
                    alt={alt}
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
