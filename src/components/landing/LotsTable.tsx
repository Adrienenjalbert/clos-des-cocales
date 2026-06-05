import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, X, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LOTS, formatPrix, type LotStatus, type Lot } from "@/data/lots";
import { useLots } from "@/hooks/useLots";
import { InterestModal } from "./InterestModal";

type SortKey = "numero" | "surface" | "sp" | "prix";
type SortDir = "asc" | "desc";
type SortRule = { key: SortKey; dir: SortDir };

const SORT_LABELS: Record<SortKey, string> = {
  numero: "Lot",
  surface: "Surface",
  sp: "SP max",
  prix: "Prix",
};
const DEFAULT_SORT: SortRule[] = [{ key: "prix", dir: "asc" }];

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
  const { lots: liveLots } = useLots();
  const [search, setSearch] = useState("");
  const [prixRange, setPrixRange] = useState<[number, number]>([PRIX_MIN, PRIX_MAX]);
  const [surfaceRange, setSurfaceRange] = useState<[number, number]>([SURFACE_MIN, SURFACE_MAX]);
  const [statuts, setStatuts] = useState<LotStatus[]>(["Disponible", "Option"]);
  const [sortRules, setSortRules] = useState<SortRule[]>(DEFAULT_SORT);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLot, setModalLot] = useState<string | undefined>();

  const openInterest = (label: string) => {
    setModalLot(label);
    setModalOpen(true);
  };

  const lots = useMemo(() => {
    const q = search.trim().toLowerCase();
    const arr = liveLots.filter((l) => {
      if (!statuts.includes(l.statut)) return false;
      if (l.surface < surfaceRange[0] || l.surface > surfaceRange[1]) return false;
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
      for (const { key, dir } of sortRules) {
        const av = (a[key] ?? 0) as number;
        const bv = (b[key] ?? 0) as number;
        if (av !== bv) return dir === "asc" ? av - bv : bv - av;
      }
      return 0;
    });
  }, [search, prixRange, surfaceRange, statuts, sortRules, liveLots]);

  const handleSort = (key: SortKey) => {
    setSortRules((rules) => {
      const idx = rules.findIndex((r) => r.key === key);
      if (idx === -1) return [...rules, { key, dir: "asc" }];
      const cur = rules[idx];
      if (cur.dir === "asc") {
        const next = [...rules];
        next[idx] = { key, dir: "desc" };
        return next;
      }
      return rules.filter((_, i) => i !== idx);
    });
  };

  const moveRule = (index: number, delta: -1 | 1) => {
    setSortRules((rules) => {
      const target = index + delta;
      if (target < 0 || target >= rules.length) return rules;
      const next = [...rules];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const toggleRuleDir = (index: number) => {
    setSortRules((rules) =>
      rules.map((r, i) => (i === index ? { ...r, dir: r.dir === "asc" ? "desc" : "asc" } : r))
    );
  };

  const removeRule = (index: number) => {
    setSortRules((rules) => rules.filter((_, i) => i !== index));
  };

  const resetSort = () => setSortRules(DEFAULT_SORT);

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
              id="lots-search"
              aria-label="Rechercher un lot par numéro ou surface"
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
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
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
              <span className="hidden sm:inline">Exporter</span>
              <span className="sm:hidden">CSV</span>
              <span className="ml-1">({lots.length})</span>
            </Button>
          </div>
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
                        {s} ({liveLots.filter((l) => l.statut === s).length})
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

        {/* Tri multi-critères */}
        <SortChips
          rules={sortRules}
          onMove={moveRule}
          onToggleDir={toggleRuleDir}
          onRemove={removeRule}
          onReset={resetSort}
        />

        {/* Compteur résultats */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{lots.length}</strong> lot
            {lots.length > 1 ? "s" : ""} affiché{lots.length > 1 ? "s" : ""} sur{" "}
            {liveLots.length}
          </span>
          {sortRules.length > 1 && (
            <span className="hidden sm:inline text-xs">
              Astuce : cliquez plusieurs fois sur les en-têtes pour empiler les tris.
            </span>
          )}
        </div>

        {/* Tableau (desktop) */}
        <div className="hidden md:block bg-background rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <SortableTh label="Lot" sortKey="numero" rules={sortRules} onSort={handleSort} />
                  <SortableTh label="Surface" sortKey="surface" rules={sortRules} onSort={handleSort} />
                  <SortableTh label="SP max" sortKey="sp" rules={sortRules} onSort={handleSort} className="hidden sm:table-cell" />
                  <SortableTh label="Prix" sortKey="prix" rules={sortRules} onSort={handleSort} />
                  <th className="px-5 py-4 font-semibold">Statut</th>
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
                  lots.map((lot) => <LotRow key={lot.numero} lot={lot} onSelect={openInterest} />)
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filtres + tri rapides (mobile uniquement) */}
        <div className="md:hidden mb-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {ALL_STATUTS.map((s) => {
              const active = statuts.includes(s);
              const count = liveLots.filter((l) => l.statut === s).length;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatut(s)}
                  className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {s} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground shrink-0">Trier&nbsp;:</label>
            <select
              value={sortRules[0] ? `${sortRules[0].key}:${sortRules[0].dir}` : ""}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":") as [SortKey, SortDir];
                setSortRules([{ key, dir }]);
              }}
              className="flex-1 h-9 rounded-full border border-border bg-background px-3 text-xs"
            >
              <option value="prix:asc">Prix croissant</option>
              <option value="prix:desc">Prix décroissant</option>
              <option value="surface:asc">Surface croissante</option>
              <option value="surface:desc">Surface décroissante</option>
              <option value="numero:asc">N° de lot</option>
            </select>
          </div>
        </div>

        {/* Cartes (mobile) */}
        <div className="md:hidden space-y-3">
          {lots.length === 0 ? (
            <div className="bg-background rounded-2xl border border-border p-8 text-center text-muted-foreground shadow-soft">
              Aucun lot ne correspond à vos critères.
              <button
                onClick={resetFilters}
                className="block mx-auto mt-3 text-accent font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            lots.map((lot) => <LotCard key={lot.numero} lot={lot} onSelect={openInterest} />)
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Prix indiqués TTC, hors frais annexes (2 730 €) et frais de notaire réduits (~3 %).
          Disponibilités sous réserve de mise à jour.
        </p>
      </div>
      <InterestModal open={modalOpen} onOpenChange={setModalOpen} lotLabel={modalLot} />
    </section>
  );
};

const SortableTh = ({
  label,
  sortKey,
  rules,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  rules: SortRule[];
  onSort: (k: SortKey) => void;
  className?: string;
}) => {
  const idx = rules.findIndex((r) => r.key === sortKey);
  const active = idx !== -1;
  const dir = active ? rules[idx].dir : "asc";
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  const showOrder = active && rules.length > 1;
  return (
    <th className={`px-5 py-4 font-semibold ${className}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${
          active ? "text-foreground" : ""
        }`}
        title={
          active
            ? dir === "asc"
              ? "Cliquer pour passer en décroissant"
              : "Cliquer pour retirer ce tri"
            : "Cliquer pour ajouter au tri"
        }
      >
        {label}
        <Icon className="w-3 h-3" />
        {showOrder && (
          <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
            {idx + 1}
          </span>
        )}
      </button>
    </th>
  );
};

const SortChips = ({
  rules,
  onMove,
  onToggleDir,
  onRemove,
  onReset,
}: {
  rules: SortRule[];
  onMove: (i: number, d: -1 | 1) => void;
  onToggleDir: (i: number) => void;
  onRemove: (i: number) => void;
  onReset: () => void;
}) => {
  return (
    <div className="bg-background border border-border rounded-2xl p-3 mb-3 flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-2">
        Trié par
      </span>
      {rules.length === 0 ? (
        <span className="text-sm text-muted-foreground italic">Aucun tri actif</span>
      ) : (
        rules.map((rule, i) => (
          <div
            key={rule.key}
            className="inline-flex items-center gap-0.5 bg-secondary/60 border border-border rounded-full pl-1 pr-1 py-1"
          >
            <button
              type="button"
              onClick={() => onMove(i, -1)}
              disabled={i === 0}
              className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
              aria-label="Monter en priorité"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onToggleDir(i)}
              className="px-2 py-0.5 text-sm font-medium text-foreground inline-flex items-center gap-1 hover:text-primary"
              title="Inverser le sens"
            >
              {SORT_LABELS[rule.key]}
              {rule.dir === "asc" ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onMove(i, 1)}
              disabled={i === rules.length - 1}
              className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
              aria-label="Descendre en priorité"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
              aria-label="Retirer ce tri"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))
      )}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground h-8"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Réinitialiser le tri
        </Button>
      </div>
    </div>
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

const LotCard = ({ lot, onSelect }: { lot: Lot; onSelect: (label: string) => void }) => {
  const isReserved = lot.statut === "Réservé";
  const prixM2 =
    lot.prix !== null ? Math.round(lot.prix / lot.surface) : null;
  return (
    <div
      className={`bg-background rounded-2xl border border-border p-4 shadow-soft transition-all ${
        isReserved ? "opacity-60" : "active:scale-[0.99]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-display text-xl font-semibold text-foreground leading-none">
            Lot N° {lot.numero}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {lot.surface} m² · SP max {lot.sp} m²
          </div>
        </div>
        <StatusBadge statut={lot.statut} />
      </div>

      <div className="flex items-end justify-between gap-3 pt-3 border-t border-border">
        <div>
          <div className="text-2xl font-display font-semibold text-primary leading-none">
            {formatPrix(lot.prix)}
          </div>
          {prixM2 !== null && (
            <div className="mt-1 text-xs text-muted-foreground">
              soit {prixM2.toLocaleString("fr-FR")} €/m²
            </div>
          )}
        </div>
        <Button
          size="sm"
          disabled={isReserved}
          onClick={() =>
            onSelect(`Lot ${lot.numero} · ${lot.surface} m² · ${formatPrix(lot.prix)}`)
          }
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full disabled:opacity-40 shrink-0"
        >
          {isReserved ? "Réservé" : "Je m'intéresse"}
        </Button>
      </div>
    </div>
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
