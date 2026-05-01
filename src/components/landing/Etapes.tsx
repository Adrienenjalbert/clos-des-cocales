const ETAPES = [
  {
    n: "01",
    title: "Visite & sélection",
    desc: "Nous vous présentons les lots disponibles et le plan de masse. Vous choisissez celui qui vous correspond.",
  },
  {
    n: "02",
    title: "Réservation",
    desc: "Signature du contrat de réservation et versement d'un dépôt de garantie. Votre lot est sécurisé.",
  },
  {
    n: "03",
    title: "Signature notaire",
    desc: "Acte authentique chez le notaire avec frais réduits à 3 %. Vous devenez propriétaire du terrain.",
  },
  {
    n: "04",
    title: "Construction libre",
    desc: "Vous choisissez votre constructeur et lancez les travaux quand vous le souhaitez.",
  },
];

export const Etapes = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-widest text-accent-soft font-semibold">
            Votre projet, étape par étape
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium mt-3 leading-tight">
            Un parcours simple et transparent.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {ETAPES.map((e, i) => (
            <div key={e.n} className="relative">
              <div className="font-display text-5xl font-medium text-accent mb-4">{e.n}</div>
              <h3 className="font-display text-xl font-semibold mb-3">{e.title}</h3>
              <p className="text-primary-foreground/75 leading-relaxed text-sm">{e.desc}</p>
              {i < ETAPES.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-primary-foreground/20 -translate-x-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
