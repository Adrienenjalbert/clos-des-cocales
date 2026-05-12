import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";

const BudgetTotal = () => {
  const [terrain, setTerrain] = useState(110000);
  const [surfaceMaison, setSurfaceMaison] = useState(110);
  const [coutM2, setCoutM2] = useState(1700); // RT2020 entrée de gamme/moyen

  const totals = useMemo(() => {
    const construction = surfaceMaison * coutM2;
    const fraisAnnexes = 2730; // bornage, branchements
    const fraisNotaire = Math.round(terrain * 0.03); // réduit terrain à bâtir
    const raccordements = 6000;
    const tva = 0; // déjà incluse dans construction
    const sous = terrain + construction + fraisNotaire + fraisAnnexes + raccordements + tva;
    const alea = Math.round(sous * 0.05);
    const total = sous + alea;
    return { construction, fraisAnnexes, fraisNotaire, raccordements, alea, total };
  }, [terrain, surfaceMaison, coutM2]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Estimateur budget total — terrain + construction maison | Le Clos des Cocales"
        description="Estimez le budget total de votre projet : terrain à bâtir + construction maison neuve, frais de notaire réduits 3 %, raccordements, aléas."
        path="/outils/budget-total"
      />
      <SiteHeader />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-5xl">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Outil gratuit</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
            Quel budget pour votre projet complet ?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Terrain + construction + frais : visualisez votre budget total tout-compris en quelques clics.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
              <div>
                <Label className="font-semibold text-foreground">Prix du terrain : {fmt(terrain)}</Label>
                <Slider value={[terrain]} onValueChange={(v) => setTerrain(v[0])} min={80000} max={200000} step={1000} className="mt-3" />
              </div>
              <div>
                <Label className="font-semibold text-foreground">Surface maison : {surfaceMaison} m²</Label>
                <Slider value={[surfaceMaison]} onValueChange={(v) => setSurfaceMaison(v[0])} min={70} max={200} step={5} className="mt-3" />
              </div>
              <div>
                <Label className="font-semibold text-foreground">Coût construction : {fmt(coutM2)} / m²</Label>
                <Slider value={[coutM2]} onValueChange={(v) => setCoutM2(v[0])} min={1300} max={2800} step={50} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Indicatif RE2020 : 1 500 € (entrée gamme) à 2 500 € (premium) / m² hors aménagements extérieurs.
                </p>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-card flex flex-col">
              <div className="text-xs uppercase tracking-[0.2em] opacity-70 font-semibold">Budget total estimé</div>
              <div className="font-display text-5xl md:text-6xl font-medium mt-3">{fmt(totals.total)}</div>
              <p className="text-sm opacity-70 mt-2">Marge aléas 5 % incluse</p>

              <div className="mt-8 space-y-3 text-sm">
                <Row label="Terrain" value={fmt(terrain)} />
                <Row label="Construction maison" value={fmt(totals.construction)} />
                <Row label="Frais de notaire (3 %)" value={fmt(totals.fraisNotaire)} />
                <Row label="Frais annexes terrain" value={fmt(totals.fraisAnnexes)} />
                <Row label="Raccordements" value={fmt(totals.raccordements)} />
                <Row label="Marge aléas (5 %)" value={fmt(totals.alea)} />
              </div>

              <div className="mt-auto pt-8 flex gap-3">
                <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Link to="/outils/simulateur-pret">Simuler mon prêt</Link>
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground max-w-3xl">
            Estimation indicative. Le coût réel dépend du choix du constructeur, des matériaux, du terrassement, des aménagements extérieurs et de votre situation fiscale. Demandez un devis personnalisé à 2-3 constructeurs partenaires.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between border-b border-primary-foreground/15 pb-2">
    <span className="opacity-70">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default BudgetTotal;
