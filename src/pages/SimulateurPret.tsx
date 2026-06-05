import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);

const SimulateurPret = () => {
  const [montant, setMontant] = useState(120000);
  const [apport, setApport] = useState(15000);
  const [duree, setDuree] = useState(20);
  const [taux, setTaux] = useState(3.6);

  const result = useMemo(() => {
    const capital = Math.max(0, montant - apport);
    const n = duree * 12;
    const i = taux / 100 / 12;
    const mensualite = i === 0 ? capital / n : (capital * i) / (1 - Math.pow(1 + i, -n));
    const total = mensualite * n;
    const interets = total - capital;
    return { capital, mensualite, total, interets };
  }, [montant, apport, duree, taux]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Simulateur de prêt immobilier | Le Clos des Cocales"
        description="Calculez votre mensualité de prêt pour l'achat d'un terrain à bâtir à Espondeilhan, Béziers, Pézenas. Simulation gratuite."
        path="/outils/simulateur-pret"
      />
      <SiteHeader />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-5xl">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Outil gratuit</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
            Simulateur de prêt immobilier
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Estimez votre mensualité de prêt pour l'acquisition d'un terrain à bâtir. Simulation indicative — un courtier partenaire peut affiner avec votre profil.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
              <div>
                <Label className="font-semibold text-foreground">Prix du terrain</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Slider value={[montant]} onValueChange={(v) => setMontant(v[0])} min={50000} max={300000} step={1000} className="flex-1" />
                  <Input type="number" value={montant} onChange={(e) => setMontant(+e.target.value || 0)} className="w-32" />
                </div>
              </div>
              <div>
                <Label className="font-semibold text-foreground">Apport personnel</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Slider value={[apport]} onValueChange={(v) => setApport(v[0])} min={0} max={Math.max(montant, 50000)} step={1000} className="flex-1" />
                  <Input type="number" value={apport} onChange={(e) => setApport(+e.target.value || 0)} className="w-32" />
                </div>
              </div>
              <div>
                <Label className="font-semibold text-foreground">Durée : {duree} ans</Label>
                <Slider value={[duree]} onValueChange={(v) => setDuree(v[0])} min={5} max={30} step={1} className="mt-3" />
              </div>
              <div>
                <Label className="font-semibold text-foreground">Taux annuel : {taux.toFixed(2)} %</Label>
                <Slider value={[taux]} onValueChange={(v) => setTaux(v[0])} min={1} max={6} step={0.05} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-2">Taux moyen marché 2025 : 3,5 – 3,9 % sur 20 ans (hors assurance).</p>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-card flex flex-col">
              <div className="text-xs uppercase tracking-[0.2em] opacity-70 font-semibold">Mensualité estimée</div>
              <div className="font-display text-5xl md:text-6xl font-medium mt-3">
                {fmt(result.mensualite)} €<span className="text-xl opacity-70">/mois</span>
              </div>
              <p className="text-sm opacity-70 mt-2">Hors assurance emprunteur (≈ 0,30 % à 0,45 %)</p>

              <div className="mt-8 space-y-3 text-sm">
                <Row label="Capital emprunté" value={fmt(result.capital) + " €"} />
                <Row label="Coût total du crédit" value={fmt(result.total) + " €"} />
                <Row label="Intérêts" value={fmt(result.interets) + " €"} />
              </div>

              <div className="mt-auto pt-8">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Link to="/#contact">Être contacté par un conseiller <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground max-w-3xl">
            ⚠️ Simulation à titre indicatif. Le taux et la mensualité réels dépendent de votre profil emprunteur, de l'assurance retenue et du barème de la banque. Un emprunt vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
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

export default SimulateurPret;
