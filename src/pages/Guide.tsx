import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";

const sections = [
  {
    h: "1. Bien choisir son terrain à bâtir",
    p: "Vérifiez 3 points : la viabilisation (eau, électricité, tout-à-l'égout, fibre), le zonage du PLU (constructible immédiat, hauteur max, emprise au sol) et l'orientation. Un terrain plat orienté sud est idéal pour la RE2020.",
  },
  {
    h: "2. Lotissement vs terrain isolé",
    p: "Un lot en lotissement (comme Le Clos des Cocales) garantit terrain borné, viabilisé, permis d'aménager validé et règlement de lotissement clair. Vous économisez 3 à 6 mois et plusieurs milliers d'euros versus un terrain isolé.",
  },
  {
    h: "3. Frais de notaire réduits",
    p: "L'achat d'un terrain à bâtir auprès d'un aménageur professionnel bénéficie de frais de notaire réduits à environ 3 % (vs 7-8 % en ancien). Une économie immédiate de 4 000 à 6 000 € sur un terrain à 100 000 €.",
  },
  {
    h: "4. Financer votre projet",
    p: "Le financement se fait en deux temps : prêt terrain (déblocage à la signature de l'acte) puis prêt construction (déblocage par tranches selon avancement). Le PTZ peut couvrir jusqu'à 40 % du coût terrain + construction sous conditions de revenus.",
  },
  {
    h: "5. Choisir son constructeur",
    p: "Privilégiez un Contrat de Construction de Maison Individuelle (CCMI) loi 1990 : il sécurise prix, délai et garanties (parfait achèvement, biennale, décennale, dommage-ouvrage). Comparez 2 à 3 devis pour le même cahier des charges.",
  },
  {
    h: "6. Délais et étapes",
    p: "Comptez 12 à 18 mois entre la réservation du terrain et la remise des clés : signature acte (3 mois), permis de construire (3-4 mois d'instruction + 2 mois de recours), construction (8-10 mois).",
  },
];

const Guide = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Guide d'achat — Acheter un terrain à bâtir dans l'Hérault en 2025"
      description="Tout savoir pour acheter un terrain à bâtir dans l'Hérault : viabilisation, PLU, frais de notaire réduits, financement, CCMI, délais. Guide complet."
      path="/guide/acheter-terrain-a-batir"
    />
    <SiteHeader />
    <main className="pt-28 pb-20">
      <article className="container mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Guide d'achat</span>
        <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
          Acheter un terrain à bâtir dans l'Hérault : le guide complet 2025
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Vous envisagez d'acheter un terrain pour faire construire dans la région biterroise (Béziers, Pézenas, Servian, Espondeilhan) ? Ce guide synthétise les 6 étapes clés pour sécuriser votre projet, éviter les pièges et optimiser votre budget.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground leading-tight">{s.h}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-secondary/50 border border-border rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl font-medium text-foreground">Prêt à concrétiser ?</h3>
          <p className="mt-2 text-muted-foreground">29 lots viabilisés à Espondeilhan, dès 99 900 €.</p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              <Link to="/#lots">Voir les terrains</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/outils/simulateur-pret">Simuler mon prêt</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
    <SiteFooter />
  </div>
);

export default Guide;
