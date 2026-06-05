import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, MapPin, TrendingDown } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { getCommune, COMMUNES } from "@/data/communes";
import { CONTACT } from "@/config/contact";
import { LOTS } from "@/data/lots";

const formatEuro = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " €";

export const CommunePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const commune = slug ? getCommune(slug) : undefined;
  if (!commune) return <Navigate to="/" replace />;

  const lotMin = Math.min(...LOTS.filter((l) => l.prix !== null).map((l) => l.prix!));
  const concurrenceMin = Math.min(...commune.prixExempleConcurrence.map((p) => p.prix));
  const economie = Math.round(((concurrenceMin - lotMin) / concurrenceMin) * 100);

  const title = `Terrain à bâtir ${commune.nom} dès ${formatEuro(lotMin)} — Le Clos des Cocales`;
  const description = `Terrain à bâtir près de ${commune.nom} : 29 lots viabilisés à ${commune.distanceMin} min, dès ${formatEuro(lotMin)}. Comparatif prix, FAQ, plan de masse.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://clos-des-cocales.lovable.app/" },
        { "@type": "ListItem", position: 2, name: `Terrain à bâtir ${commune.nom}`, item: `https://clos-des-cocales.lovable.app/terrain-a-batir/${commune.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: commune.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={title}
        description={description}
        path={`/terrain-a-batir/${commune.slug}`}
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="pt-24">
        {/* Breadcrumb */}
        <nav className="container mx-auto pt-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <span className="mx-2">/</span>
          <span>Terrain à bâtir {commune.nom}</span>
        </nav>

        {/* Hero */}
        <section className="container mx-auto py-10 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-5">
              <MapPin className="w-3.5 h-3.5" /> {commune.distanceMin} min de {commune.nom}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-medium leading-[1.05] text-foreground text-balance">
              Terrain à bâtir près de <span className="text-primary">{commune.nom}</span> dès {formatEuro(lotMin)}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              {commune.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-cta">
                <Link to="/#lots">Voir les 29 lots disponibles <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={`tel:${CONTACT.phoneTel}`}>Être rappelé</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Comparatif prix */}
        <section className="bg-secondary/40 py-16 md:py-20">
          <div className="container mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Comparatif prix</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 leading-tight">
                Jusqu'à <span className="text-primary">{economie}%</span> moins cher qu'à {commune.nom}
              </h2>
              <p className="mt-3 text-muted-foreground">
                Comparez les terrains à bâtir disponibles près de {commune.nom} avec Le Clos des Cocales à Espondeilhan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background rounded-2xl border border-border p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                  Marché à {commune.nom} (2025)
                </div>
                <div className="space-y-3">
                  {commune.prixExempleConcurrence.map((p, i) => (
                    <div key={i} className="flex items-baseline justify-between border-b border-border pb-2 last:border-0">
                      <span className="text-sm text-muted-foreground">{p.surface} m²</span>
                      <span className="font-display text-lg font-semibold text-foreground">{formatEuro(p.prix)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  Prix moyen ≈ {commune.prixMoyenTerrainM2} €/m²
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-card">
                <div className="text-xs uppercase tracking-wider opacity-70 font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-3.5 h-3.5" /> Le Clos des Cocales — {commune.distanceMin} min
                </div>
                <div className="space-y-3">
                  {LOTS.filter((l) => l.statut !== "Réservé" && l.prix !== null).slice(0, 3).map((l) => (
                    <div key={l.numero} className="flex items-baseline justify-between border-b border-primary-foreground/15 pb-2 last:border-0">
                      <span className="text-sm opacity-80">Lot {l.numero} · {l.surface} m²</span>
                      <span className="font-display text-lg font-semibold">{formatEuro(l.prix!)}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-5 w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Link to="/#lots">Voir tous les lots</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Atouts commune */}
        <section className="container mx-auto py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Pourquoi cette zone</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 leading-tight">
                Tous les avantages de {commune.nom}, le prix d'un village.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Espondeilhan partage avec {commune.nom} le même bassin de vie : commerces, écoles, accès rapides. Vous gagnez en cadre de vie et en pouvoir d'achat.
              </p>
            </div>
            <ul className="space-y-3">
              {commune.atouts.map((a, i) => (
                <li key={i} className="flex items-start gap-3 bg-background border border-border rounded-xl p-4">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-secondary/40 py-16 md:py-20">
          <div className="container mx-auto max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Questions fréquentes</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 mb-8 leading-tight">
              Acheter un terrain à bâtir près de {commune.nom}
            </h2>
            <div className="space-y-3">
              {commune.faq.map((f, i) => (
                <details key={i} className="group bg-background border border-border rounded-xl p-5 open:shadow-soft">
                  <summary className="cursor-pointer font-display font-semibold text-foreground flex items-center justify-between gap-3">
                    {f.q}
                    <span className="text-accent text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto py-16 md:py-24 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-medium leading-tight max-w-2xl mx-auto text-balance">
            Réservez votre lot avant qu'il ne parte.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            29 lots viabilisés. Disponibilité immédiate. Frais de notaire réduits 3 %.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-cta">
              <Link to="/#lots">Voir la grille des prix</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/outils/simulateur-pret">Simuler mon financement</Link>
            </Button>
          </div>
        </section>

        {/* Autres communes */}
        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
              Voir aussi
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMUNES.filter((c) => c.slug !== commune.slug).map((c) => (
                <Link
                  key={c.slug}
                  to={`/terrain-a-batir/${c.slug}`}
                  className="px-4 py-2 rounded-full bg-background border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Terrain à bâtir {c.nom}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CommunePage;
