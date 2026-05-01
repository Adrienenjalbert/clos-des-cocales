import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOTS, formatPrix, type LotStatus } from "@/data/lots";

type SortKey = "numero" | "surface" | "prix";

interface Props {
  onSelectLot: (label: string) => void;
}

export const LotsTable = ({ onSelectLot }: Props) => {
  const [sortBy, setSortBy] = useState<SortKey>("prix");
  const [filter, setFilter] = useState<"tous" | "petit" | "moyen" | "grand">("tous");

  const lots = useMemo(() => {
    let arr = LOTS.filter((l) => l.statut !== "Réservé");
    if (filter === "petit") arr = arr.filter((l) => l.surface < 360);
    if (filter === "moyen") arr = arr.filter((l) => l.surface >= 360 && l.surface < 500);
    if (filter === "grand") arr = arr.filter((l) => l.surface >= 500);
    return [...arr].sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return (av as number) - (bv as number);
    });
  }, [sortBy, filter]);

  const filters = [
    { id: "tous", label: `Tous (${LOTS.filter((l) => l.statut !== "Réservé").length})` },
    { id: "petit", label: "< 360 m²" },
    { id: "moyen", label: "360 – 500 m²" },
    { id: "grand", label: "> 500 m²" },
  ] as const;

  return (
    <section id="lots" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Lots disponibles
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            Trouvez le terrain qui vous ressemble.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Liste mise à jour. Cliquez sur un lot pour démarrer votre demande de réservation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trier :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-background border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="prix">Prix</option>
              <option value="surface">Surface</option>
              <option value="numero">Numéro</option>
            </select>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-4 font-semibold">Lot</th>
                  <th className="px-5 py-4 font-semibold">Surface terrain</th>
                  <th className="px-5 py-4 font-semibold hidden sm:table-cell">SP max</th>
                  <th className="px-5 py-4 font-semibold">Prix</th>
                  <th className="px-5 py-4 font-semibold hidden md:table-cell">Statut</th>
                  <th className="px-5 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lots.map((lot) => (
                  <tr key={lot.numero} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 font-display font-semibold text-foreground">
                      N° {lot.numero}
                    </td>
                    <td className="px-5 py-4 text-foreground">{lot.surface} m²</td>
                    <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                      {lot.sp} m²
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">
                      {formatPrix(lot.prix)}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <StatusBadge statut={lot.statut} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() =>
                          onSelectLot(
                            `Lot ${lot.numero} · ${lot.surface} m² · ${formatPrix(lot.prix)}`
                          )
                        }
                        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                      >
                        Je m'intéresse
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Prix indiqués TTC, hors frais annexes (2 730 €) et frais de notaire réduits (~3 %).
          Disponibilités sous réserve de mise à jour.
        </p>
      </div>
    </section>
  );
};

const StatusBadge = ({ statut }: { statut: LotStatus }) => {
  const styles = {
    Disponible: "bg-primary/10 text-primary",
    Option: "bg-accent/15 text-accent",
    Réservé: "bg-muted text-muted-foreground",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[statut]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statut}
    </span>
  );
};
