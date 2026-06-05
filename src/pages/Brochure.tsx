import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Phone, MessageCircle, Check, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LOTS, LOTS_DISPONIBLES, formatPrix } from "@/data/lots";
import { CONTACT, whatsappLink } from "@/config/contact";
import { supabase } from "@/integrations/supabase/client";
import { track, buildLeadMessage } from "@/lib/analytics";
import logoCC from "@/assets/logo-cc.png";
import heroImg from "@/assets/hero-cocales.jpg";
import planImg from "@/assets/plan-de-masse.png.asset.json";
import planPdf from "@/assets/plan-de-masse.pdf.asset.json";
import brochurePdf from "@/assets/brochure.pdf.asset.json";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

const Brochure = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Brochure & plan — Le Clos des Cocales, terrains à 40 min de Montpellier";
  }, []);

  const lotsDispo = LOTS.filter((l) => l.statut === "Disponible" && l.prix);
  const prixMin = Math.min(...lotsDispo.map((l) => l.prix!));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setLoading(true);
    track("lead_submit", { source: "brochure_page" });
    try {
      const { error } = await supabase.from("leads").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: buildLeadMessage("Demande de brochure (page /brochure)"),
        consent: parsed.data.consent,
        source: "brochure_page",
      });
      if (error) throw error;
      track("brochure_request_success", {});
      toast.success("Merci ! Votre brochure arrive par email.");
      // Instant gratification: open brochure PDF immediately
      window.open(brochurePdf.url, "_blank");
      setTimeout(() => navigate("/merci?source=brochure"), 600);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue, contactez-nous au " + CONTACT.phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Brochure & plan de masse — Le Clos des Cocales"
        description="Téléchargez la brochure complète : plan de masse officiel, prix par lot, plan de financement, étapes. Terrains à 40 min de Montpellier dès 92 500 €."
        path="/brochure"
        noindex
      />

      {/* Minimal header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoCC} alt="Le Clos des Cocales" className="h-9 w-9" />
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold text-foreground">Le Clos des Cocales</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Brochure</div>
            </div>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Retour au site
          </Link>
        </div>
      </header>

      <main>
        {/* HERO COVER */}
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt="Vue aérienne — Le Clos des Cocales à Espondeilhan"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/70 to-foreground/55" />

          <div className="container mx-auto relative z-10 py-16 md:py-24 text-background">
            <span className="inline-flex items-center gap-2 bg-background/12 backdrop-blur border border-background/30 text-background text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-6 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Brochure officielle · 2025
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] max-w-3xl text-balance mb-5">
              Tout savoir sur Le Clos des Cocales,
              <span className="editorial text-accent block mt-2">en un document.</span>
            </h1>
            <p className="text-lg md:text-xl text-background/85 max-w-2xl font-light leading-relaxed">
              Plan de masse officiel, prix par lot, viabilisation, étapes d'achat,
              plan de financement. Téléchargez ou recevez la brochure par email.
            </p>
          </div>
        </section>

        {/* QUICK FACTS + FORM */}
        <section className="container mx-auto py-14 md:py-20 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Le projet</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3 mb-5">
                29 terrains viabilisés, au cœur du Languedoc.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Le Clos des Cocales est un lotissement neuf situé à Espondeilhan (Hérault),
                à 40 min de Montpellier et 15 min de Béziers. Les terrains, de 335 à 832 m²,
                sont livrés viabilisés et prêts à construire — vous choisissez librement
                votre constructeur.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Démarrage immédiat, frais de notaire réduits, fiscalité optimisée :
                tout est conçu pour simplifier votre projet.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { k: "Lots dispo", v: String(LOTS_DISPONIBLES) },
                { k: "Prix dès", v: formatPrix(prixMin).replace(" €", " €") },
                { k: "Surfaces", v: "335-832 m²" },
                { k: "Montpellier", v: "40 min" },
              ].map((s) => (
                <div key={s.k} className="p-5 rounded-2xl border border-border bg-secondary/40">
                  <div className="font-display text-2xl font-semibold text-foreground">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.k}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Inclus dans la brochure</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {[
                  "Plan de masse géomètre-expert (1/1000ᵉ)",
                  "Grille tarifaire des 29 lots",
                  "Détail des équipements et viabilisation",
                  "Plan de financement type (PTZ inclus)",
                  "Étapes d'achat : de la réservation à la signature",
                  "Conseils choix du constructeur",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 rounded-3xl border border-border bg-background shadow-card p-6 md:p-7">
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                Téléchargement immédiat
              </p>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                Recevez la brochure
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Plan de masse PDF instantané + brochure envoyée par email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="b-name">Nom complet</Label>
                  <Input
                    id="b-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 h-11"
                    placeholder="Jean Dupont"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="b-email">Email</Label>
                  <Input
                    id="b-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 h-11"
                    placeholder="vous@email.com"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="b-phone">Téléphone (optionnel)</Label>
                  <Input
                    id="b-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 h-11"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={form.consent}
                    onCheckedChange={(c) => setForm({ ...form, consent: c === true })}
                    className="mt-0.5"
                  />
                  <span>J'accepte d'être contacté(e) au sujet de mon projet.</span>
                </label>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 font-semibold shadow-cta"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  {loading ? "Envoi…" : "Télécharger la brochure"}
                </Button>
              </form>

              <div className="border-t border-border mt-5 pt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  onClick={() => track("click_call", { location: "brochure" })}
                  className="flex items-center justify-center gap-2 text-sm text-foreground hover:text-accent transition-colors py-2"
                >
                  <Phone className="w-4 h-4" /> Appeler
                </a>
                <a
                  href={whatsappLink("Bonjour, je souhaite recevoir la brochure du Clos des Cocales.")}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("click_whatsapp", { location: "brochure" })}
                  className="flex items-center justify-center gap-2 text-sm text-foreground hover:text-accent transition-colors py-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PLAN DE MASSE */}
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Plan officiel</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3">
                Plan de masse — octobre 2024
              </h2>
              <p className="text-muted-foreground mt-3">
                Document certifié par notre géomètre-expert Denis Steinberg (Béziers / Montpellier).
                29 lots de 335 à 832 m², voiries et réseaux livrés.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <a
                href={planImg.url}
                target="_blank"
                rel="noopener"
                onClick={() => track("plan_image_open", { location: "brochure" })}
                className="group relative block rounded-2xl overflow-hidden shadow-elevated border border-border bg-background"
                aria-label="Ouvrir le plan de masse en grand"
              >
                <img
                  src={planImg.url}
                  alt="Plan de masse complet du Clos des Cocales II"
                  width={1600}
                  height={2200}
                  loading="lazy"
                  className="w-full h-auto max-h-[70vh] object-contain bg-background"
                />
                <span className="absolute bottom-3 right-3 bg-foreground/85 text-background text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full opacity-90 group-hover:opacity-100 transition">
                  Cliquer pour agrandir
                </span>
              </a>

              {/* Légende */}
              <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-emerald-500/80" /> Disponible</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-amber-500/80" /> Optionné</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-muted-foreground/40" /> Réservé / vendu</span>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-cta">
                  <a href={planPdf.url} target="_blank" rel="noopener" download onClick={() => track("plan_pdf_download", { location: "brochure" })}>
                    <Download className="w-4 h-4 mr-2" /> Télécharger le plan PDF
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/#lots" onClick={() => track("plan_see_lots", { location: "brochure" })}>
                    Voir les lots disponibles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* LOTS TABLE */}
        <section className="container mx-auto py-16 md:py-24">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Grille tarifaire</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3">
              {lotsDispo.length} lots disponibles
            </h2>
            <p className="text-muted-foreground mt-3">
              Prix affichés TTC, hors frais de notaire (~3 %). Lots livrés viabilisés.
            </p>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4">Lot</th>
                    <th className="py-3 px-4">Surface terrain</th>
                    <th className="py-3 px-4">Surface plancher max.</th>
                    <th className="py-3 px-4 text-right">Prix TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {lotsDispo.map((l) => (
                    <tr key={l.numero} className="border-t border-border/60 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-semibold text-foreground">Lot {l.numero}</td>
                      <td className="py-3 px-4">{l.surface} m²</td>
                      <td className="py-3 px-4">{l.sp} m²</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">{formatPrix(l.prix)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ÉTAPES */}
        <section className="bg-foreground text-background py-16 md:py-24">
          <div className="container mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Étapes</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium mt-3">
                De la réservation aux clés, simplement.
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { n: "01", t: "Réservation", d: "Choix du lot, dépôt de garantie 5 % (séquestre notaire)." },
                { n: "02", t: "Compromis", d: "Sous 30 jours, signature du contrat de réservation." },
                { n: "03", t: "Financement", d: "60 à 90 jours pour obtenir votre prêt (PTZ éligible, zone B2)." },
                { n: "04", t: "Signature", d: "Acte authentique chez le notaire. Vous démarrez votre construction." },
              ].map((s) => (
                <div key={s.n} className="border-l-2 border-accent pl-5">
                  <div className="font-display text-accent text-xl font-semibold mb-2">{s.n}</div>
                  <h3 className="font-display text-lg font-semibold mb-2">{s.t}</h3>
                  <p className="text-sm text-background/75 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="container mx-auto py-16 md:py-24 text-center max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Une question ?</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3 mb-5">
            Parlez à un conseiller dédié.
          </h2>
          <p className="text-muted-foreground mb-8">
            Réponse sous 24 h. Visite sur site possible 7j/7 sur rendez-vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 px-7 font-semibold"
            >
              <a href={`tel:${CONTACT.phoneTel}`} onClick={() => track("click_call", { location: "brochure_bottom" })}>
                <Phone className="w-4 h-4 mr-2" /> {CONTACT.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7"
            >
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener"
                onClick={() => track("click_whatsapp", { location: "brochure_bottom" })}
              >
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Avenue de la Mer · 34290 Espondeilhan · Hérault
          </p>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
};

export default Brochure;
