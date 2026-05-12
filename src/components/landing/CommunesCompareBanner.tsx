import { ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMMUNES } from "@/data/communes";

const PRIX_CLOS_M2 = 185; // €/m² indicatif Le Clos des Cocales (dès 99 900 € pour ~540 m²)

export const CommunesCompareBanner = () => {
  const rows = COMMUNES.slice(0, 5).map((c) => {
    const ecart = Math.round(((c.prixMoyenTerrainM2 - PRIX_CLOS_M2) / c.prixMoyenTerrainM2) * 100);
    return { ...c, ecart };
  });

  const scrollToVisite = () => {
    document.getElementById("visite")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            Comparatif local
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Espondeilhan vs communes voisines
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Le prix moyen au m² du terrain à bâtir dans le bassin biterrois — et ce que vous économisez
            au Clos des Cocales.
          </p>
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <div className="col-span-5">Commune</div>
            <div className="col-span-3 text-right">Prix moyen / m²</div>
            <div className="col-span-2 text-right hidden sm:block">Distance</div>
            <div className="col-span-4 sm:col-span-2 text-right">Économie</div>
          </div>

          {rows.map((c) => (
            <div
              key={c.slug}
              className="grid grid-cols-12 items-center px-5 py-4 border-t border-border/60 hover:bg-secondary/20 transition-colors"
            >
              <div className="col-span-5">
                <div className="font-semibold text-foreground">{c.nom}</div>
                <div className="text-xs text-muted-foreground">{c.codePostal}</div>
              </div>
              <div className="col-span-3 text-right tabular-nums text-foreground">
                {c.prixMoyenTerrainM2} €
              </div>
              <div className="col-span-2 text-right text-sm text-muted-foreground hidden sm:block">
                {c.distanceMin} min
              </div>
              <div className="col-span-4 sm:col-span-2 text-right">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  <TrendingDown className="w-3.5 h-3.5" />
                  −{c.ecart}%
                </span>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-12 items-center px-5 py-4 border-t-2 border-accent/40 bg-accent/5">
            <div className="col-span-5">
              <div className="font-display text-foreground">Le Clos des Cocales</div>
              <div className="text-xs text-accent font-semibold uppercase tracking-wider">
                Espondeilhan · dispo
              </div>
            </div>
            <div className="col-span-3 text-right tabular-nums font-semibold text-foreground">
              {PRIX_CLOS_M2} €
            </div>
            <div className="col-span-2 text-right text-sm text-muted-foreground hidden sm:block">
              —
            </div>
            <div className="col-span-4 sm:col-span-2 text-right">
              <span className="text-xs font-semibold text-primary">Référence</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Envie de voir le terrain en vrai&nbsp;? Réservez un créneau gratuit.
          </p>
          <Button
            onClick={scrollToVisite}
            className="h-12 px-6 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Réserver ma visite
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
          Prix moyens au m² indicatifs (sources Orpi, iad, SeLoger 2025). Économie calculée par
          rapport au prix moyen constaté sur la commune voisine.
        </p>
      </div>
    </section>
  );
};
