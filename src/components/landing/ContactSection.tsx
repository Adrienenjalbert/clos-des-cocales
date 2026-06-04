import { sendLeadEmails } from "@/lib/sendLeadEmails";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Phone, MessageCircle, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT, whatsappLink } from "@/config/contact";
import { track, buildLeadMessage } from "@/lib/analytics";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  lot_interest: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

export interface ContactSectionHandle {
  setLot: (label: string) => void;
}

export const ContactSection = forwardRef<ContactSectionHandle>((_props, ref) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    lot_interest: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useImperativeHandle(ref, () => ({
    setLot: (label: string) => {
      setForm((s) => ({ ...s, lot_interest: label }));
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      track("lead_validation_error", { source: "landing_page" });
      return;
    }

    setLoading(true);
    track("lead_submit", { source: "landing_page", lot: parsed.data.lot_interest || null });
    try {
      const { error } = await supabase.from("leads").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        lot_interest: parsed.data.lot_interest || null,
        message: buildLeadMessage(parsed.data.message || null),
        consent: parsed.data.consent,
        source: "landing_page",
      });

      if (error) throw error;

      sendLeadEmails({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        lot_interest: parsed.data.lot_interest,
        message: parsed.data.message,
        source: "landing_page",
      });

      track("lead_success", { source: "landing_page", lot: parsed.data.lot_interest || null });
      setSuccess(true);
      toast.success("Demande envoyée ! Nous vous recontactons sous 24 h.");
      setForm({
        name: "",
        email: "",
        phone: "",
        lot_interest: "",
        message: "",
        consent: false,
      });
    } catch (err) {
      console.error("Lead submission error:", err);
      track("lead_error", { source: "landing_page", error: (err as Error).message });
      toast.error("Une erreur est survenue. Merci d'utiliser le téléphone ou WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-warm-gradient scroll-mt-20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">
              Contact
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground leading-tight">
              Parlons de votre projet.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Visite sur place, brochure, plan de masse, simulation de financement —
              nous vous répondons sous 24 h ouvrées.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                onClick={() => track("click_phone", { location: "contact_section" })}
                className="flex items-center gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-soft transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Appeler
                  </div>
                  <div className="font-display font-semibold text-foreground">
                    {CONTACT.phone}
                  </div>
                </div>
              </a>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("click_whatsapp", { location: "contact_section" })}
                className="flex items-center gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-soft transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    WhatsApp
                  </div>
                  <div className="font-display font-semibold text-foreground">
                    Réponse rapide
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                onClick={() => track("click_email", { location: "contact_section" })}
                className="flex items-center gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-soft transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Email
                  </div>
                  <div className="font-display font-semibold text-foreground">
                    {CONTACT.email}
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-background rounded-3xl p-6 md:p-10 shadow-card border border-border">
              {success ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                    Demande bien reçue !
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Nous vous recontactons sous 24 h ouvrées pour échanger sur votre projet.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSuccess(false)}
                    className="rounded-full"
                  >
                    Envoyer une autre demande
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                    Demander la brochure
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Champs marqués d'un <span className="text-accent">*</span> obligatoires.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="Nom & prénom"
                      required
                      error={errors.name}
                      input={
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Marie Dupont"
                          maxLength={120}
                          required
                        />
                      }
                    />
                    <Field
                      label="Email"
                      required
                      error={errors.email}
                      input={
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="marie@email.fr"
                          maxLength={254}
                          required
                        />
                      }
                    />
                    <Field
                      label="Téléphone"
                      error={errors.phone}
                      input={
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          maxLength={40}
                        />
                      }
                    />
                    <Field
                      label="Lot d'intérêt"
                      error={errors.lot_interest}
                      input={
                        <Input
                          value={form.lot_interest}
                          onChange={(e) =>
                            setForm({ ...form, lot_interest: e.target.value })
                          }
                          placeholder="Pas de lot en particulier"
                          maxLength={80}
                        />
                      }
                    />
                  </div>

                  <Field
                    label="Votre projet (optionnel)"
                    error={errors.message}
                    input={
                      <Textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Surface souhaitée, budget, calendrier, questions…"
                        rows={4}
                        maxLength={2000}
                      />
                    }
                  />

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={form.consent}
                      onCheckedChange={(c) => setForm({ ...form, consent: c === true })}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      J'accepte que mes informations soient utilisées pour me recontacter
                      au sujet du programme Le Clos des Cocales.{" "}
                      <span className="text-accent">*</span>
                    </Label>
                  </div>
                  {errors.consent && (
                    <p className="text-sm text-destructive">{errors.consent}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full text-base h-14 shadow-cta"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer ma demande
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

const Field = ({
  label,
  required,
  error,
  input,
}: {
  label: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-foreground">
      {label} {required && <span className="text-accent">*</span>}
    </Label>
    {input}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);
