import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Phone, Mail, MessageCircle, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  lot_interest: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, email, phone, lot_interest, message, source, created_at")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setLeads((data || []) as Lead[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.lot_interest, l.message, l.source]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [leads, q]);

  const exportCSV = () => {
    const head = ["Date", "Nom", "Email", "Téléphone", "Lot", "Source", "Message"];
    const rows = filtered.map((l) => [
      new Date(l.created_at).toISOString(),
      l.name,
      l.email,
      l.phone ?? "",
      l.lot_interest ?? "",
      l.source ?? "",
      (l.message ?? "").replace(/[\r\n]+/g, " "),
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-clos-des-cocales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Pipeline
          </span>
          <h1 className="font-display text-3xl md:text-4xl mt-1">
            Leads <span className="text-muted-foreground text-xl">({filtered.length})</span>
          </h1>
        </div>
        <Button variant="outline" onClick={exportCSV} className="rounded-full">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher nom, email, lot…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-background border border-border rounded-2xl p-12 text-center text-muted-foreground">
          Aucun lead {q ? "ne correspond à votre recherche." : "pour le moment."}
        </div>
      ) : (
        <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Lot</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((l) => {
                  const wa = l.phone
                    ? `https://wa.me/${l.phone.replace(/\D/g, "")}`
                    : null;
                  return (
                    <tr key={l.id} className="hover:bg-secondary/30 align-top">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(l.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{l.email}</div>
                        {l.phone && (
                          <div className="text-muted-foreground text-xs mt-0.5">{l.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {l.lot_interest ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-medium">
                            {l.lot_interest}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-muted-foreground line-clamp-3">
                          {l.message || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {l.source || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`mailto:${l.email}`}
                            className="p-2 rounded-full border border-border hover:border-primary/40 hover:text-primary"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {l.phone && (
                            <a
                              href={`tel:${l.phone}`}
                              className="p-2 rounded-full border border-border hover:border-primary/40 hover:text-primary"
                              title="Appeler"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full border border-border hover:border-primary/40 hover:text-primary"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
