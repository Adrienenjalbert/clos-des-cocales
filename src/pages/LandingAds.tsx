import { useParams, Navigate, Link } from "react-router-dom";
import { Phone, MessageCircle, Check, MapPin, TrendingDown, ShieldCheck, Clock } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactSection } from "@/components/landing/ContactSection";
import { Button } from "@/components/ui/button";
import { getCommune, COMMUNES, type Commune } from "@/data/communes";
import { LOTS, LOTS_DISPONIBLES } from "@/data/lots";
import { CONTACT, whatsappLink } from "@/config/contact";
import { track } from "@/lib/analytics";
import logoCC from "@/assets/logo-cc.png";
import heroImg from "@/assets/hero-cocales.jpg";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " €";

// Generic LP (no commune) used for the "Hérault / général" ad group
const GENERIC: Commune = {
  slug: "herault",
  nom: "l'Hérault",
  codePostal: "34",
  distanceMin: 15,
  distanceKm: 17,
  population: 0,
  prixMoyenTerrainM2: 280,
  prixExempleConcurrence: [
    { surface: 450, prix: 135000 },
    { surface: 500, prix: 140000 },
  ],
  atouts: [
    "29 lots viabilisés, prêts à construire",
    "Entre Béziers (15 min) et Pézenas (20 min)",
    "Cadre village authentique du Languedoc",
  ],
  intro:
    "Vous cherchez un terrain à bâtir dans l'Hérault ? Le Clos des Cocales à Espondeilhan propose 29 lots viabilisés, dès 99 900 €, à 15 minutes de Béziers. Prix transparents, plan de masse disponible, livraison immédiate.",
  faq: [
    {
      q: "Les terrains sont-ils viabilisés ?",
      a: "Oui, tous les lots sont vendus viabilisés : eau, électricité, télécom et tout-à-l'égout en limite de propriété. Voirie et éclairage public livrés.",
    },
    {
      q: "Quels sont les délais pour construire ?",
      a: "Les terrains sont livrés immédiatement. Vous restez libre de choisir votre constructeur. Permis de construire en moyenne 3 à 4 mois.",
    },
    {
      q: "Quels frais de notaire ?",
      a: "Frais de notaire réduits car terrain en lotissement neuf. Comptez environ 2,5 à 3 % du prix d'achat.",
    },
  ],
};

export const LandingAds = () => {
  const { slug } = useParams<{ slug: string }>();
  const commune = !slug || slug === "herault" ? GENERIC : getCommune(slug);
  if (!commune) return <Navigate to="/" replace />;

  const lotsDispo = LOTS.filter((l) => l.statut === "Disponible" && l.prix);
  const lotMin = Math.min(...lotsDispo.map((l) => l.prix!));
  const concMin = Math.min(...commune.prixExempleConcurrence.map((p) => p.prix));
  const economie = Math.round(((concMin - lotMin) / concMin) * 100);

  const isGeneric = commune.slug === "herault";
  const h1 = isGeneric
    ? `Terrain à bâtir dans l'Hérault dès ${fmt(lotMin)}`
    : `Terrain à bâtir près de ${commune.nom} dès ${fmt(lotMin)}`;
  const title = isGeneric
    ? `Terrain à bâtir Hérault (34) — 29 lots viabilisés dès ${fmt(lotMin)}`
    : `Terrain à bâtir ${commune.nom} — alternative à ${commune.distanceMin} min dès ${fmt(lotMin)}`;
  const description = isGeneric
    ? `29 terrains à bâtir viabilisés dans l'Hérault, dès ${fmt(lotMin)}. Prix transparents, plan de masse, à 15 min de Béziers. Demandez la brochure.`
    : `Terrain à bâtir près de ${commune.nom} : 29 lots viabilisés à ${commune.distanceMin} min, dès ${fmt(lotMin)}. Jusqu'à ${economie} % moins cher. Brochure & visite.`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={`/lp/${commune.slug}`} noindex />

      {/* Minimal header (no nav menu) */}
      <header className="fixed top-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoCC} alt="Le Clos des Cocales" className="h-9 w-9" />
            <span className="font-display font-semibold text-foreground hidden sm:inline">
              Le Clos des Cocales
            </span>
          </Link>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            onClick={() => track("click_call", { location: "lp_header", commune: commune.slug })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{CONTACT.phone}</span>
            <span className="sm:hidden">Appeler</span>
          </a>
        </div>
      </header>

      <main className="pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt={`Terrain à bâtir près de ${commune.nom} — Le Clos des Cocales à Espondeilhan`}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/50" />

          <div className="container mx-auto relative z-10 py-16 md:py-24 grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3 text-primary-foreground">
              <span className="inline-flex items-center gap-2 bg-background/15 backdrop-blur border border-background/30 text-background text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {LOTS_DISPONIBLES} lots disponibles · Livraison immédiate
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-medium leading-[1.05] mb-5 text-balance">
                {h1}
              </h1>
              <p className="text-lg md:text-xl text-background/90 max-w-2xl mb-6 font-light">
                {commune.intro}
              </p>

              <ul className="grid sm:grid-cols-2 gap-2 mb-7 max-w-xl">
                {[
                  "29 lots viabilisés (340 à 832 m²)",
                  "Prix affichés, sans négociation",
                  "Frais de notaire réduits (~2,5 %)",
                  "À 15 min de Béziers, 20 min des plages",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-background/95">
                    <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-14 px-7 shadow-cta font-semibold"
                >
                  <a href="#form" onClick={() => track("cta_brochure_click", { location: "lp_hero", commune: commune.slug })}>
                    Recevoir la brochure
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-7 bg-background/10 text-background border-background/40 hover:bg-background/20"
                >
                  <a
                    href={whatsappLink(`Bonjour, je suis intéressé par un terrain au Clos des Cocales (recherche près de ${commune.nom}).`)}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track("click_whatsapp", { location: "lp_hero", commune: commune.slug })}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick form card */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-3xl p-6 md:p-7 shadow-card border border-border">
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                  Brochure & plan de masse
                </p>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                  Recevez les prix par lot
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Document PDF complet : surface, prix, plan, disponibilité. Envoi immédiat par email.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 font-semibold"
                >
                  <a href="#form" onClick={() => track("cta_brochure_click", { location: "lp_hero_card", commune: commune.slug })}>
                    Demander la brochure
                  </a>
                </Button>
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-border text-center">
                  <div>
                    <div className="text-xl font-display font-semibold text-foreground">{LOTS_DISPONIBLES}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">lots dispo</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-semibold text-foreground">{fmt(lotMin).replace(" €", "")}€</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">dès</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-semibold text-foreground">{commune.distanceMin}min</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">de {commune.nom.split("-")[0]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-border bg-muted/30">
          <div className="container mx-auto py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { i: ShieldCheck, t: "Lots viabilisés" },
              { i: TrendingDown, t: "Prix transparents" },
              { i: Clock, t: "Livraison immédiate" },
              { i: MapPin, t: "Espondeilhan (34)" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="flex items-center gap-2 text-foreground/80">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparatif prix */}
        {!isGeneric && (
          <section className="container mx-auto py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                Comparatif marché
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 mb-4">
                Jusqu'à <span className="text-accent">{economie}%</span> moins cher qu'à {commune.nom}
              </h2>
              <p className="text-muted-foreground">
                Comparaison entre les terrains à bâtir disponibles près de {commune.nom} et Le Clos des Cocales à {commune.distanceMin} min.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="rounded-3xl border border-border bg-muted/30 p-7">
                <h3 className="font-display text-xl font-semibold mb-1">Marché à {commune.nom}</h3>
                <p className="text-sm text-muted-foreground mb-5">Prix moyen ≈ {commune.prixMoyenTerrainM2} €/m²</p>
                <ul className="space-y-2">
                  {commune.prixExempleConcurrence.map((p, i) => (
                    <li key={i} className="flex justify-between text-sm border-b border-border/60 pb-2">
                      <span>{p.surface} m²</span>
                      <span className="font-semibold">{fmt(p.prix)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border-2 border-accent bg-background p-7 shadow-card">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                  <TrendingDown className="w-3.5 h-3.5" /> Le Clos des Cocales — {commune.distanceMin} min
                </div>
                <h3 className="font-display text-xl font-semibold mb-5">{LOTS_DISPONIBLES} lots viabilisés</h3>
                <ul className="space-y-2">
                  {lotsDispo.slice(0, 4).map((l) => (
                    <li key={l.numero} className="flex justify-between text-sm border-b border-border/60 pb-2">
                      <span>Lot {l.numero} — {l.surface} m²</span>
                      <span className="font-semibold text-primary">{fmt(l.prix!)}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="sm" variant="link" className="mt-3 p-0 h-auto text-accent">
                  <a href="#form">Voir tous les lots & prix →</a>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Atouts */}
        <section className="bg-muted/30">
          <div className="container mx-auto py-16 md:py-20">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                Pourquoi {commune.nom}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 mb-4">
                {isGeneric ? "Un emplacement stratégique" : `Tous les avantages de ${commune.nom}, le prix d'un village`}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {commune.atouts.map((a, i) => (
                <div key={i} className="bg-background rounded-2xl p-6 border border-border">
                  <Check className="w-5 h-5 text-accent mb-3" />
                  <p className="text-sm text-foreground/90 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto py-16 md:py-20 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {commune.faq.map((f, i) => (
              <details
                key={i}
                className="group bg-background rounded-2xl border border-border p-5 open:shadow-soft"
              >
                <summary className="cursor-pointer font-display font-semibold text-foreground list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-accent group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Form */}
        <div id="form">
          <ContactSection />
        </div>

        <SiteFooter />
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur border-t border-border p-3 flex gap-2">
        <Button
          asChild
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 font-semibold"
        >
          <a href="#form" onClick={() => track("cta_brochure_click", { location: "lp_sticky", commune: commune.slug })}>
            Brochure
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full h-12 px-4 border-primary text-primary"
        >
          <a href={`tel:${CONTACT.phoneTel}`} onClick={() => track("click_call", { location: "lp_sticky", commune: commune.slug })}>
            <Phone className="w-4 h-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full h-12 px-4"
        >
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener"
            onClick={() => track("click_whatsapp", { location: "lp_sticky", commune: commune.slug })}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default LandingAds;

export const LP_COMMUNES = [...COMMUNES.map((c) => c.slug), "herault"];
