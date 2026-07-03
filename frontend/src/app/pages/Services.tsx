import { Link } from "react-router";
import { Clock, Phone, Calendar } from "lucide-react";
import { FadeIn } from "../components/shared";
import { SERVICES } from "../lib/data";

export default function Services() {
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
            <Link
              to="/rendez-vous"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
