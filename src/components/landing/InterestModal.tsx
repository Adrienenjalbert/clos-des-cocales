import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est requis" }),
  }),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotLabel?: string;
}

export const InterestModal = ({ open, onOpenChange, lotLabel }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setConsent(false);
    setSuccess(false); setErrors({});
  };

  const handleClose = (o: boolean) => {
    if (!o) setTimeout(reset, 200);
    onOpenChange(o);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, phone, consent });
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
      phone: parsed.data.phone || null,
      lot_interest: lotLabel ?? null,
      consent: true,
      source: "interest_modal",
    });
    setLoading(false);
    if (error) {
      toast.error("Une erreur est survenue. Merci de réessayer.");
      return;
    }
    setSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 mx-auto text-primary mb-4" />
            <DialogTitle className="font-display text-2xl mb-2">Demande envoyée</DialogTitle>
            <DialogDescription className="text-base">
              Merci ! Notre conseiller vous contactera sous 24h ouvrées.
            </DialogDescription>
            <Button onClick={() => handleClose(false)} className="mt-6 rounded-full">
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Je m'intéresse</DialogTitle>
              <DialogDescription>
                {lotLabel ? <>Pour le <strong>{lotLabel}</strong>. </> : null}
                Laissez vos coordonnées, on vous rappelle sous 24h.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="im-name">Nom complet *</Label>
                <Input id="im-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="im-email">Email *</Label>
                <Input id="im-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="im-phone">Téléphone</Label>
                <Input id="im-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox id="im-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
                <Label htmlFor="im-consent" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                  J'accepte d'être recontacté concernant ma demande. Mes données ne seront pas cédées.
                </Label>
              </div>
              {errors.consent && <p className="text-xs text-destructive -mt-2">{errors.consent}</p>}
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</> : "Envoyer ma demande"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
