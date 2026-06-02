import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { formatPrix, type LotStatus } from "@/data/lots";
import { UI_TO_DB } from "@/hooks/useLots";

type Row = {
  id: string;
  numero: number;
  surface: number;
  sp: number;
  prix: number | null;
  statut: "disponible" | "option" | "reserve" | "vendu";
};

const STATUTS: LotStatus[] = ["Disponible", "Option", "Réservé", "Vendu"];

const STATUT_STYLE: Record<Row["statut"], string> = {
  disponible: "bg-emerald-100 text-emerald-800 border-emerald-200",
  option: "bg-amber-100 text-amber-800 border-amber-200",
  reserve: "bg-orange-100 text-orange-800 border-orange-200",
  vendu: "bg-rose-100 text-rose-800 border-rose-200",
};

const AdminLots = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/auth", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const fetchRows = async () => {
    const { data, error } = await supabase
      .from("lots")
      .select("id, numero, surface, sp, prix, statut")
      .order("numero");
    if (error) toast.error(error.message);
    else setRows((data || []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const updateStatut = async (row: Row, newStatutUI: LotStatus) => {
    const newStatut = UI_TO_DB[newStatutUI] as Row["statut"];
    setSavingId(row.id);
    const { error } = await supabase
      .from("lots")
      .update({ statut: newStatut })
      .eq("id", row.id);
    setSavingId(null);
    if (error) toast.error(error.message);
    else {
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, statut: newStatut } : x)));
      toast.success(`Lot ${row.numero} → ${newStatutUI}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const counts = STATUTS.reduce((acc, s) => {
    acc[s] = rows.filter((r) => r.statut === UI_TO_DB[s]).length;
    return acc;
  }, {} as Record<LotStatus, number>);

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl">Administration — Lots</h1>
            <p className="text-xs text-muted-foreground">Mise à jour en temps réel sur le site public</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="rounded-full">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STATUTS.map((s) => (
            <div key={s} className="bg-background border border-border rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s}</div>
              <div className="font-display text-3xl mt-1">{counts[s]}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Lot</th>
                    <th className="px-4 py-3">Surface</th>
                    <th className="px-4 py-3">SP</th>
                    <th className="px-4 py-3">Prix</th>
                    <th className="px-4 py-3">Statut actuel</th>
                    <th className="px-4 py-3">Changer le statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 font-semibold">N°{row.numero}</td>
                      <td className="px-4 py-3">{row.surface} m²</td>
                      <td className="px-4 py-3">{row.sp} m²</td>
                      <td className="px-4 py-3">{formatPrix(row.prix)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUT_STYLE[row.statut]}`}>
                          {STATUTS.find((s) => UI_TO_DB[s] === row.statut)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {STATUTS.map((s) => {
                            const isCurrent = UI_TO_DB[s] === row.statut;
                            return (
                              <button
                                key={s}
                                disabled={isCurrent || savingId === row.id}
                                onClick={() => updateStatut(row, s)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                                  isCurrent
                                    ? "bg-primary text-primary-foreground border-primary cursor-default"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLots;
