import { LOTS, LOTS_DISPONIBLES } from "@/data/lots";

const minSurface = Math.min(...LOTS.map((l) => l.surface));
const maxSurface = Math.max(...LOTS.map((l) => l.surface));
const minPrix = Math.min(...LOTS.filter((l) => l.prix).map((l) => l.prix!));

const STATS = [
  { num: `${LOTS_DISPONIBLES}`, label: "lots disponibles", sub: "sur 29 commercialisés" },
  { num: `${minSurface}–${maxSurface}`, label: "m² de terrain", sub: "selon votre projet" },
  { num: `${(minPrix / 1000).toFixed(0)}k€`, label: "prix d'entrée", sub: "frais notaire réduits" },
  { num: "15 min", label: "de Béziers", sub: "5 min de Servian" },
];

export const NumbersBlock = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div className="container mx-auto relative">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Le Clos en chiffres
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
            Un programme rare, <span className="editorial">déjà livré</span> et viabilisé.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-x-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="border-l border-background/15 pl-5 md:pl-7 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-none text-accent">
                {s.num}
              </div>
              <div className="mt-3 text-base font-semibold uppercase tracking-wider">{s.label}</div>
              <div className="text-sm text-background/60 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
