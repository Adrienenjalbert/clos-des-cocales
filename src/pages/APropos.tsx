import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { PROMOTEUR } from "@/data/promoteur";

const APropos = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title={`À propos — ${PROMOTEUR.nom} | Aménageur Hérault`}
      description={`${PROMOTEUR.nom} aménage des lotissements de terrains à bâtir dans l'Hérault. Garantie financière d'achèvement, permis d'aménager.`}
      path="/a-propos"
    />
    <SiteHeader />
    <main className="pt-28 pb-20">
      <article className="container mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">À propos</span>
        <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
          {PROMOTEUR.nom}, aménageur de terrains à bâtir dans l'Hérault.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          {PROMOTEUR.baseline}. Nous concevons, viabilisons et commercialisons des lotissements de terrains à bâtir en accompagnant chaque acquéreur de la réservation à la signature de l'acte authentique.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Card label="Années d'expérience" value={`${PROMOTEUR.anneesExperience}+`} />
          <Card label="Programmes livrés" value={`${PROMOTEUR.programmesLivres}+`} />
          <Card label="Lots commercialisés" value={`${PROMOTEUR.lotsCommercialises}+`} />
          <Card label="Villes de présence" value={PROMOTEUR.villesPresence} />
        </div>

        <div className="mt-12 bg-secondary/40 border border-border rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Mentions légales</h2>
          <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <Item k="Raison sociale" v={PROMOTEUR.nom} />
            <Item k="Forme juridique" v={PROMOTEUR.formeJuridique} />
            <Item k="RCS" v={PROMOTEUR.rcs} />
            <Item k="Siège social" v={PROMOTEUR.siegeSocial} />
            <Item k="Garantie financière d'achèvement" v={PROMOTEUR.garantieFinanciere} />
            <Item k="N° permis d'aménager" v={PROMOTEUR.permisAmenager} />
          </dl>
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Link to="/#contact">Nous contacter</Link>
          </Button>
        </div>
      </article>
    </main>
    <SiteFooter />
  </div>
);

const Card = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-background border border-border rounded-2xl p-6">
    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
    <div className="font-display text-3xl font-medium text-primary mt-2">{value}</div>
  </div>
);

const Item = ({ k, v }: { k: string; v: string }) => (
  <div>
    <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{k}</dt>
    <dd className="text-foreground font-medium">{v}</dd>
  </div>
);

export default APropos;
