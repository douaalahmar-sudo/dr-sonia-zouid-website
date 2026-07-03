import { Link } from "react-router";
import { Heart, Shield, Users, CheckCircle, Calendar } from "lucide-react";
import { FadeIn } from "../components/shared";

export default function About() {
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
              {/* TODO: replace with a real portrait of Dr Zouid */}
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

            <Link
              to="/rendez-vous"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Prendre rendez-vous
            </Link>
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
