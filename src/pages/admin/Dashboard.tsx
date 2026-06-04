import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPinned,
  Users,
  CircleDollarSign,
  TrendingUp,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { formatPrix } from "@/data/lots";

type LotRow = {
  numero: number;
  surface: number;
  prix: number | null;
  statut: "disponible" | "option" | "reserve" | "vendu";
};
type LeadRow = {
  id: string;
  name: string;
  email: string;
  lot_interest: string | null;
  created_at: string;
};

const STAT_LABEL: Record<LotRow["statut"], string> = {
  disponible: "Disponibles",
  option: "Sous option",
  reserve: "Réservés",
  vendu: "Vendus",
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState<LotRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [leads7, setLeads7] = useState(0);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 86400_000).toISOString();
      const [lotsRes, leadsRes, leads7Res] = await Promise.all([
        supabase.from("lots").select("numero, surface, prix, statut").order("numero"),
        supabase
          .from("leads")
          .select("id, name, email, lot_interest, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since),
      ]);
      setLots((lotsRes.data || []) as LotRow[]);
      setLeads((leadsRes.data || []) as LeadRow[]);
      setLeads7(leads7Res.count ?? 0);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const byStatut = lots.reduce(
    (acc, l) => {
      acc[l.statut] = (acc[l.statut] || 0) + 1;
      return acc;
    },
    { disponible: 0, option: 0, reserve: 0, vendu: 0 } as Record<LotRow["statut"], number>,
  );
  const dispoValue = lots
    .filter((l) => l.statut === "disponible")
    .reduce((s, l) => s + (l.prix || 0), 0);
  const venduValue = lots
    .filter((l) => l.statut === "vendu")
    .reduce((s, l) => s + (l.prix || 0), 0);
  const taux = lots.length
    ? Math.round(((byStatut.vendu + byStatut.reserve + byStatut.option) / lots.length) * 100)
    : 0;

  const cards = [
    { label: "Lots disponibles", value: byStatut.disponible, icon: MapPinned, hint: `sur ${lots.length} lots` },
    { label: "Leads (7 j)", value: leads7, icon: Users, hint: "demandes reçues" },
    { label: "Valeur disponible", value: formatPrix(dispoValue), icon: CircleDollarSign, hint: "stock à vendre" },
    { label: "Taux commercialisé", value: `${taux}%`, icon: TrendingUp, hint: "option + réservé + vendu" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Cockpit</span>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Vue d'ensemble</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-background border border-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="font-display text-3xl mt-2">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-background border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Répartition des lots</h2>
            <Link to="/admin/lots" className="text-sm text-accent inline-flex items-center gap-1">
              Gérer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {(["disponible", "option", "reserve", "vendu"] as const).map((s) => {
              const n = byStatut[s];
              const pct = lots.length ? (n / lots.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{STAT_LABEL[s]}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-5 border-t border-border text-sm text-muted-foreground">
            CA réalisé (vendus) : <strong className="text-foreground">{formatPrix(venduValue)}</strong>
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Derniers leads</h2>
            <Link to="/admin/leads" className="text-sm text-accent inline-flex items-center gap-1">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun lead pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {leads.map((l) => (
                <li key={l.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {l.email}
                      {l.lot_interest ? ` · lot ${l.lot_interest}` : ""}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
