import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COMMUNES } from "@/data/communes";

export const CommunesGrid = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Vous cherchez près de chez vous ?
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-[1.1] text-balance">
            Un terrain à bâtir <span className="editorial">à 5 à 20 minutes</span> de votre commune.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Comparez les prix et découvrez pourquoi tant de familles de la région choisissent
            Espondeilhan pour leur projet.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {COMMUNES.map((c) => (
            <Link
              key={c.slug}
              to={`/terrain-a-batir/${c.slug}`}
              className="group bg-secondary/50 hover:bg-primary hover:text-primary-foreground border border-border rounded-2xl p-5 transition-all hover:shadow-card"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-xs uppercase tracking-wider opacity-70 font-semibold">
                  {c.distanceMin} min
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-display text-xl md:text-2xl font-medium leading-tight">
                {c.nom}
              </div>
              <div className="text-xs opacity-70 mt-1">
                ≈ {c.prixMoyenTerrainM2} €/m² local
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
