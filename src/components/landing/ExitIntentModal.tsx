import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track, buildLeadMessage } from "@/lib/analytics";

const STORAGE_KEY = "exit_intent_seen_v1";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

export const ExitIntentModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    // Desktop: exit intent
    document.addEventListener("mouseleave", onMouseLeave);

    // Mobile fallback: after 35s of activity
    const timer = window.setTimeout(trigger, 35000);

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, consent });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      consent: true,
      source: "exit_intent",
    });
    setLoading(false);
    if (error) { toast.error("Erreur, merci de réessayer."); return; }
    setSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 mx-auto text-primary mb-4" />
            <DialogTitle className="font-display text-2xl mb-2">C'est noté</DialogTitle>
            <DialogDescription className="text-base">
              Vous recevrez la grille des prix et l'alerte dès qu'un nouveau lot se libère.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-6 rounded-full">Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl">Avant de partir…</DialogTitle>
                  <DialogDescription className="text-xs">Offre réservée aux visiteurs du site</DialogDescription>
                </div>
              </div>
              <DialogDescription className="text-base">
                Recevez la <strong>grille des prix complète</strong> et soyez prévenu en priorité quand un terrain se libère.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="ei-name">Nom *</Label>
                <Input id="ei-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ei-email">Email *</Label>
                <Input id="ei-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox id="ei-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
                <Label htmlFor="ei-consent" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                  J'accepte de recevoir les informations sur le programme. Désinscription en 1 clic.
                </Label>
              </div>
              {errors.consent && <p className="text-xs text-destructive -mt-2">{errors.consent}</p>}
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</> : "Recevoir la grille des prix"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
