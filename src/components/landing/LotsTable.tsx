import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LOTS, formatPrix, type LotStatus, type Lot } from "@/data/lots";

type SortKey = "numero" | "surface" | "sp" | "prix";
type SortDir = "asc" | "desc";

interface Props {
  onSelectLot: (label: string) => void;
}

// Bornes calculées depuis les données réelles
const PRIX_MIN = Math.min(...LOTS.filter((l) => l.prix !== null).map((l) => l.prix!));
const PRIX_MAX = Math.max(...LOTS.filter((l) => l.prix !== null).map((l) => l.prix!));
const SURFACE_MIN = Math.min(...LOTS.map((l) => l.surface));
const SURFACE_MAX = Math.max(...LOTS.map((l) => l.surface));

const ALL_STATUTS: LotStatus[] = ["Disponible", "Option", "Réservé"];

export const LotsTable = ({ onSelectLot }: Props) => {
  const [search, setSearch] = useState("");
  const [prixRange, setPrixRange] = useState<[number, number]>([PRIX_MIN, PRIX_MAX]);
  const [surfaceRange, setSurfaceRange] = useState<[number, number]>([SURFACE_MIN, SURFACE_MAX]);
  const [statuts, setStatuts] = useState<LotStatus[]>(["Disponible", "Option"]);
  const [sortBy, setSortBy] = useState<SortKey>("prix");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const lots = useMemo(() => {
    const q = search.trim().toLowerCase();
    const arr = LOTS.filter((l) => {
      if (!statuts.includes(l.statut)) return false;
      if (l.surface < surfaceRange[0] || l.surface > surfaceRange[1]) return false;
      // Lots sans prix : on les garde si la borne max couvre tout, sinon on filtre
      if (l.prix !== null) {
        if (l.prix < prixRange[0] || l.prix > prixRange[1]) return false;
      } else {
        if (prixRange[0] > PRIX_MIN || prixRange[1] < PRIX_MAX) return false;
      }
      if (q) {
        const hay = `n${l.numero} lot ${l.numero} ${l.surface}m2 ${l.statut}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return [...arr].sort((a, b) => {
      const av = (a[sortBy] ?? 0) as number;
      const bv = (b[sortBy] ?? 0) as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [search, prixRange, surfaceRange, statuts, sortBy, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const toggleStatut = (s: LotStatus) => {
    setStatuts((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setPrixRange([PRIX_MIN, PRIX_MAX]);
    setSurfaceRange([SURFACE_MIN, SURFACE_MAX]);
    setStatuts(["Disponible", "Option"]);
  };

  const isFiltered =
    search !== "" ||
    prixRange[0] !== PRIX_MIN ||
    prixRange[1] !== PRIX_MAX ||
    surfaceRange[0] !== SURFACE_MIN ||
    surfaceRange[1] !== SURFACE_MAX ||
    statuts.length !== 2 ||
    !statuts.includes("Disponible") ||
    !statuts.includes("Option");

  const exportCSV = () => {
    const headers = ["Numéro", "Surface terrain (m²)", "SP max (m²)", "Prix (€)", "Statut"];
    const rows = lots.map((l) => [
      l.numero,
      l.surface,
      l.sp,
      l.prix ?? "",
      l.statut,
    ]);
    const escape = (v: string | number) => {
      const s = String(v);
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv =
      "\uFEFF" +
      [headers, ...rows].map((r) => r.map(escape).join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `clos-des-cocales-lots-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="lots" className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Lots disponibles
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            Trouvez le terrain qui vous ressemble.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Filtrez par prix, surface et statut. Exportez la sélection en CSV pour la
            partager avec votre conseiller.
          </p>
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un n° de lot, une surface…"
              className="pl-11 h-12 rounded-full bg-background border-border"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((s) => !s)}
            className="h-12 rounded-full border-border"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
            {isFiltered && (
              <span className="ml-2 inline-flex items-center justify-center w-2 h-2 rounded-full bg-accent" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={lots.length === 0}
            className="h-12 rounded-full border-border"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter ({lots.length})
          </Button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-background border border-border rounded-2xl p-6 mb-4 shadow-soft animate-fade-in">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Prix */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Prix : {formatPrix(prixRange[0])} – {formatPrix(prixRange[1])}
                </Label>
                <Slider
                  value={prixRange}
                  onValueChange={(v) => setPrixRange([v[0], v[1]] as [number, number])}
                  min={PRIX_MIN}
                  max={PRIX_MAX}
                  step={1000}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatPrix(PRIX_MIN)}</span>
                  <span>{formatPrix(PRIX_MAX)}</span>
                </div>
              </div>

              {/* Surface */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Surface : {surfaceRange[0]} m² – {surfaceRange[1]} m²
                </Label>
                <Slider
                  value={surfaceRange}
                  onValueChange={(v) =>
                    setSurfaceRange([v[0], v[1]] as [number, number])
                  }
                  min={SURFACE_MIN}
                  max={SURFACE_MAX}
                  step={5}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{SURFACE_MIN} m²</span>
                  <span>{SURFACE_MAX} m²</span>
                </div>
              </div>

              {/* Statut */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Statut
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUTS.map((s) => {
                    const active = statuts.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleStatut(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {s} ({LOTS.filter((l) => l.statut === s).length})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {isFiltered && (
              <div className="mt-6 pt-5 border-t border-border flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-muted-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Compteur résultats */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{lots.length}</strong> lot
            {lots.length > 1 ? "s" : ""} affiché{lots.length > 1 ? "s" : ""} sur{" "}
            {LOTS.length}
          </span>
        </div>

        {/* Tableau */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <SortableTh label="Lot" sortKey="numero" current={sortBy} dir={sortDir} onSort={handleSort} />
                  <SortableTh label="Surface" sortKey="surface" current={sortBy} dir={sortDir} onSort={handleSort} />
                  <SortableTh label="SP max" sortKey="sp" current={sortBy} dir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
                  <SortableTh label="Prix" sortKey="prix" current={sortBy} dir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-4 font-semibold hidden md:table-cell">Statut</th>
                  <th className="px-5 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">
                      Aucun lot ne correspond à vos critères.
                      <button
                        onClick={resetFilters}
                        className="ml-2 text-accent hover:underline"
                      >
                        Réinitialiser
                      </button>
                    </td>
                  </tr>
                ) : (
                  lots.map((lot) => <LotRow key={lot.numero} lot={lot} onSelect={onSelectLot} />)
                )}
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

const SortableTh = ({
  label,
  sortKey,
  current,
  dir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}) => {
  const active = current === sortKey;
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`px-5 py-4 font-semibold ${className}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        <Icon className="w-3 h-3" />
      </button>
    </th>
  );
};

const LotRow = ({ lot, onSelect }: { lot: Lot; onSelect: (label: string) => void }) => {
  const isReserved = lot.statut === "Réservé";
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
      <td className="px-5 py-4 font-display font-semibold text-foreground">N° {lot.numero}</td>
      <td className="px-5 py-4 text-foreground">{lot.surface} m²</td>
      <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{lot.sp} m²</td>
      <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">
        {formatPrix(lot.prix)}
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <StatusBadge statut={lot.statut} />
      </td>
      <td className="px-5 py-4 text-right">
        <Button
          size="sm"
          disabled={isReserved}
          onClick={() =>
            onSelect(`Lot ${lot.numero} · ${lot.surface} m² · ${formatPrix(lot.prix)}`)
          }
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full disabled:opacity-40"
        >
          {isReserved ? "Réservé" : "Je m'intéresse"}
        </Button>
      </td>
    </tr>
  );
};

const StatusBadge = ({ statut }: { statut: LotStatus }) => {
  const styles = {
    Disponible: "bg-primary/10 text-primary",
    Option: "bg-accent/15 text-accent",
    Réservé: "bg-muted text-muted-foreground",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[statut]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statut}
    </span>
  );
};
