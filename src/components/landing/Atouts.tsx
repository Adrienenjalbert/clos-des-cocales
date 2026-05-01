import { CheckCircle2, Receipt, Hammer, Scale, Truck, MapPinned } from "lucide-react";

const ATOUTS = [
  {
    icon: CheckCircle2,
    title: "Terrains viabilisés",
    desc: "Eau, électricité, tout-à-l'égout, télécom : tout est prêt. Vous lancez la construction immédiatement.",
  },
  {
    icon: Receipt,
    title: "Frais de notaire à 3 %",
    desc: "Frais réduits par rapport à l'ancien (7-8 %). Une économie immédiate sur votre projet.",
  },
  {
    icon: Scale,
    title: "Exonération de taxe",
    desc: "Exonération de la part communale de la taxe d'aménagement. Plusieurs milliers d'euros économisés.",
  },
  {
    icon: Hammer,
    title: "Constructeur libre",
    desc: "Choisissez votre constructeur, votre architecte, vos matériaux. Aucun fournisseur imposé.",
  },
  {
    icon: Truck,
    title: "Livraison immédiate",
    desc: "Lots disponibles tout de suite. Pas d'attente, pas de VEFA — vous démarrez quand vous voulez.",
  },
  {
    icon: MapPinned,
    title: "À 15 min de Béziers",
    desc: "Accès rapide aux commerces, écoles, gare TGV et autoroute A9. Le calme sans l'isolement.",
  },
];

export const Atouts = () => {
  return (
    <section id="atouts" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Pourquoi nous choisir
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            6 raisons concrètes de poser votre première pierre ici.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATOUTS.map((a) => (
            <div
              key={a.title}
              className="group p-7 rounded-2xl bg-secondary/40 border border-border hover:border-primary/30 hover:bg-background hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <a.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {a.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 md:p-8 rounded-2xl bg-accent-soft border border-accent/20 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <div className="font-display text-lg font-semibold text-foreground">
              Frais annexes : seulement 2 730 €
            </div>
            <div className="text-sm text-muted-foreground">
              (Géomètre, architecte, caution dégradations, provision pour A.S.L.)
            </div>
          </div>
          <a
            href="#contact"
            className="text-accent font-semibold whitespace-nowrap hover:underline"
          >
            Recevoir le détail complet →
          </a>
        </div>
      </div>
    </section>
  );
};
