import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LOTS as STATIC_LOTS, type Lot, type LotStatus } from "@/data/lots";

const DB_TO_UI: Record<string, LotStatus> = {
  disponible: "Disponible",
  option: "Option",
  reserve: "Réservé",
  vendu: "Vendu",
};

export const UI_TO_DB: Record<LotStatus, string> = {
  Disponible: "disponible",
  Option: "option",
  Réservé: "reserve",
  Vendu: "vendu",
};

export function useLots() {
  const [lots, setLots] = useState<Lot[]>(STATIC_LOTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLots = async () => {
      const { data, error } = await supabase
        .from("lots")
        .select("numero, surface, sp, prix, statut")
        .order("numero");
      if (!mounted) return;
      if (!error && data && data.length) {
        setLots(
          data.map((r) => ({
            numero: r.numero,
            surface: r.surface,
            sp: r.sp,
            prix: r.prix,
            statut: DB_TO_UI[r.statut] ?? "Disponible",
          }))
        );
      }
      setLoading(false);
    };
    fetchLots();

    const channel = supabase
      .channel("lots-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "lots" }, fetchLots)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { lots, loading };
}
