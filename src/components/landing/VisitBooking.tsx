import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2, Calendar, Clock, MapPin, Video, Phone, MessageCircle, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track, buildLeadMessage } from "@/lib/analytics";
import { CONTACT, whatsappLink } from "@/config/contact";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  phone: z.string().trim().min(8, "Téléphone requis").max(40),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

type Mode = "site" | "visio";
const SLOTS = ["09:30", "11:00", "14:30", "16:00", "17:30"];

const formatDate = (d: Date) =>
  d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

const isoDate = (d: Date) => d.toISOString().split("T")[0];

export const VisitBooking = () => {
  const dates = useMemo(() => {
    const arr: Date[] = [];
    const start = new Date();
    let added = 0;
    let i = 1;
    while (added < 7) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const day = d.getDay();
      if (day !== 0) {
        arr.push(d);
        added++;
      }
      i++;
    }
    return arr;
  }, []);

  const [mode, setMode] = useState<Mode>("site");
  const [date, setDate] = useState<string>(isoDate(dates[0]));
  const [slot, setSlot] = useState<string>(SLOTS[2]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 view event (fires once on mount / first visibility)
  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    track("visit_booking_view", { step: "mode" });
  }, []);

  // Track contact info focus once
  const contactStartedRef = useRef(false);
  const onContactFocus = () => {
    if (contactStartedRef.current) return;
    contactStartedRef.current = true;
    track("visit_booking_step", { step: "contact_started", mode, date, slot });
  };

  const selectMode = (m: Mode) => {
    setMode(m);
    track("visit_booking_step", { step: "mode_selected", mode: m });
  };
  const selectDate = (v: string) => {
    setDate(v);
    track("visit_booking_step", { step: "date_selected", mode, date: v });
  };
  const selectSlot = (s: string) => {
    setSlot(s);
    track("visit_booking_step", { step: "slot_selected", mode, date, slot: s });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, phone, consent });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      track("visit_booking_step", { step: "validation_error", mode, date, slot });
      return;
    }
    setLoading(true);
    track("visit_booking_step", { step: "submit", mode, date, slot });
    track("lead_submit", { source: `visit_booking_${mode}` });
    const baseMessage = `Visite ${mode === "site" ? "sur site" : "en visio"} demandée pour le ${date} à ${slot}.`;
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      consent: true,
      message: buildLeadMessage(baseMessage),
      source: `visit_booking_${mode}`,
    });
    setLoading(false);
    if (error) {
      toast.error("Erreur, merci de réessayer.");
      track("visit_booking_step", { step: "error", mode, error: error.message });
      track("lead_error", { source: `visit_booking_${mode}`, error: error.message });
      return;
    }
    track("visit_booking_step", { step: "success", mode, date, slot });
    track("lead_success", { source: `visit_booking_${mode}` });
    setSuccess(true);
  };

  if (success) {
    const dateLabel = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const modeLabel = mode === "site" ? "Sur site à Espondeilhan" : "En visio (Google Meet)";
    const waMessage = `Bonjour, je viens de réserver une visite ${mode === "site" ? "sur site" : "en visio"} le ${dateLabel} à ${slot}. Je m'appelle ${name}.`;

    const downloadIcs = () => {
      const [hh, mm] = slot.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hh, mm, 0, 0);
      const end = new Date(start.getTime() + 45 * 60 * 1000);
      const fmt = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Clos des Cocales//FR",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@clos-des-cocales`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:Visite Le Clos des Cocales (${mode === "site" ? "sur site" : "visio"})`,
        `DESCRIPTION:Visite ${modeLabel}. Conseiller: ${CONTACT.phone}`,
        mode === "site" ? "LOCATION:Le Clos des Cocales, Espondeilhan, 34290" : "LOCATION:Visioconférence (lien envoyé par email)",
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n");
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "visite-clos-des-cocales.ics"; a.click();
      URL.revokeObjectURL(url);
      track("visit_booking_step", { step: "ics_downloaded", mode, date, slot });
    };

    return (
      <section id="visite" className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background px-8 pt-10 pb-8 text-center border-b border-border">
              <div className="inline-flex w-16 h-16 rounded-full bg-primary/15 items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </div>
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                Confirmation
              </span>
              <h2 className="font-display text-3xl text-foreground mb-2">
                Votre visite est réservée
              </h2>
              <p className="text-muted-foreground text-sm">
                Bonjour <strong className="text-foreground">{name}</strong>, votre demande est
                bien enregistrée. Notre conseiller vous confirme par téléphone sous 24 h ouvrées.
              </p>
            </div>

            {/* Recap card */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                <RecapItem
                  icon={mode === "site" ? MapPin : Video}
                  label="Mode"
                  value={modeLabel}
                />
                <RecapItem icon={Calendar} label="Date" value={dateLabel} />
                <RecapItem icon={Clock} label="Créneau" value={slot} />
                <RecapItem icon={Phone} label="Téléphone communiqué" value={phone} />
              </div>

              <div className="rounded-xl bg-secondary/40 border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Prochaine étape :</strong> vous recevrez un
                email de confirmation à <strong className="text-foreground">{email}</strong>.
                {mode === "visio" && " Le lien Google Meet vous sera envoyé la veille."}
              </div>

              {/* Quick contact */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Une question avant la visite&nbsp;? Contactez directement
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappLink(waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("visit_booking_contact", { channel: "whatsapp" })}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">WhatsApp</div>
                      <div className="font-semibold text-foreground text-sm">Réponse rapide</div>
                    </div>
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    onClick={() => track("visit_booking_contact", { channel: "phone" })}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Appeler</div>
                      <div className="font-semibold text-foreground text-sm">{CONTACT.phone}</div>
                    </div>
                  </a>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={downloadIcs}
                className="w-full h-11 rounded-full"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Ajouter à mon calendrier (.ics)
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="visite" className="py-20 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            Réservation
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Réservez votre visite
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sur place à Espondeilhan ou en visio depuis chez vous. Réponse de notre conseiller sous 24 h.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-background rounded-2xl border border-border p-6 md:p-8 shadow-card space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Mode de visite</Label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { v: "site", icon: MapPin, label: "Sur site", sub: "Espondeilhan" },
                { v: "visio", icon: Video, label: "En visio", sub: "30 min · Google Meet" },
              ] as const).map((o) => {
                const Icon = o.icon;
                const active = mode === o.v;
                return (
                  <button
                    type="button"
                    key={o.v}
                    onClick={() => selectMode(o.v)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${active ? "text-accent" : "text-muted-foreground"}`} />
                    <div className="font-semibold text-foreground">{o.label}</div>
                    <div className="text-xs text-muted-foreground">{o.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </Label>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {dates.map((d) => {
                const v = isoDate(d);
                const active = v === date;
                return (
                  <button
                    type="button"
                    key={v}
                    onClick={() => selectDate(v)}
                    className={`shrink-0 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    {formatDate(d)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4" /> Créneau
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SLOTS.map((s) => {
                const active = s === slot;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => selectSlot(s)}
                    className={`py-2.5 rounded-lg border text-sm transition-all ${
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border" onFocus={onContactFocus}>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="vb-name">Nom complet *</Label>
              <Input id="vb-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vb-email">Email *</Label>
              <Input id="vb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vb-phone">Téléphone *</Label>
              <Input id="vb-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox id="vb-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
            <Label htmlFor="vb-consent" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
              J'accepte d'être recontacté pour confirmer ce créneau.
            </Label>
          </div>
          {errors.consent && <p className="text-xs text-destructive -mt-3">{errors.consent}</p>}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-base">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</> : "Confirmer ma demande de visite"}
          </Button>
        </form>
      </div>
    </section>
  );
};

const RecapItem = ({
  icon: Icon, label, value,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
    <div className="w-9 h-9 shrink-0 rounded-lg bg-background border border-border flex items-center justify-center">
      <Icon className="w-4 h-4 text-accent" />
    </div>
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  </div>
);
