import { CheckCircle2, MapPinned, Receipt } from "lucide-react";

const ATOUTS = [
  {
    icon: MapPinned,
    title: "Au cœur de l'Hérault",
    desc: "À 40 min de Montpellier, 15 min de Béziers, 25 min des plages méditerranéennes. Le calme du village, l'accès à tout.",
  },
  {
    icon: CheckCircle2,
    title: "Terrains viabilisés, livrables",
    desc: "Eau, électricité, télécom, tout-à-l'égout. Vous choisissez librement votre constructeur et démarrez immédiatement.",
  },
  {
    icon: Receipt,
    title: "Fiscalité optimisée",
    desc: "Frais de notaire réduits à ~3 %, exonération de la part communale de la taxe d'aménagement. PTZ éligible (zone B2).",
  },
];

export const Atouts = () => {
  return (
    <section id="atouts" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Pourquoi ici
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            L'essentiel, sans superflu.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATOUTS.map((a) => (
            <div
              key={a.title}
              className="group p-8 rounded-2xl bg-secondary/40 border border-border hover:border-accent/40 hover:bg-background hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <a.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {a.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
