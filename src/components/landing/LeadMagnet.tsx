import { useState } from "react";
import { z } from "zod";
import { Loader2, Download, CheckCircle2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

interface Props {
  trigger?: React.ReactNode;
  source?: string;
}

export const LeadMagnet = ({ trigger, source = "lead_magnet_brochure" }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      source,
    });
    setLoading(false);
    if (error) { toast.error("Erreur, merci de réessayer."); return; }
    setSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="rounded-full">
            <Download className="w-4 h-4" /> Recevoir la brochure
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 mx-auto text-primary mb-4" />
            <DialogTitle className="font-display text-2xl mb-2">Brochure envoyée</DialogTitle>
            <DialogDescription className="text-base">
              Vérifiez votre boîte mail dans quelques minutes. Pensez à regarder vos spams.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-6 rounded-full">Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl">Brochure du programme</DialogTitle>
                  <DialogDescription className="text-xs">PDF · Prix, plans, prestations</DialogDescription>
                </div>
              </div>
              <DialogDescription>
                Recevez immédiatement la brochure complète : grille des prix, plan de masse et descriptif des terrains.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="lm-name">Nom complet *</Label>
                <Input id="lm-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lm-email">Email *</Label>
                <Input id="lm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox id="lm-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
                <Label htmlFor="lm-consent" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                  J'accepte de recevoir la brochure et les actualités du programme. Désinscription en 1 clic.
                </Label>
              </div>
              {errors.consent && <p className="text-xs text-destructive -mt-2">{errors.consent}</p>}
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</> : <><Download className="w-4 h-4 mr-2" /> Télécharger la brochure</>}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
