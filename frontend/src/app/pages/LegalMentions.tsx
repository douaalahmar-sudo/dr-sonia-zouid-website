import { FadeIn } from "../components/shared";

export default function LegalMentions() {
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
