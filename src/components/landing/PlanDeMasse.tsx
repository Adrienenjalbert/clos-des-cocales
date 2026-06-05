import { useState } from "react";
import { Download, Maximize2, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import planImg from "@/assets/plan-de-masse.png.asset.json";
import planPdf from "@/assets/plan-de-masse.pdf.asset.json";
import { LOTS_DISPONIBLES } from "@/data/lots";
import { track } from "@/lib/analytics";

export const PlanDeMasse = () => {
  const [zoom, setZoom] = useState(false);

  return (
    <section id="plan" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Plan de masse officiel
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            Découvrez l'implantation des {LOTS_DISPONIBLES} lots disponibles.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Plan certifié par notre géomètre-expert (octobre 2024). Surfaces, voiries, espaces
            verts et orientation : tout est documenté.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 relative group">
            <button
              type="button"
              onClick={() => {
                setZoom(true);
                track("plan_zoom_open", {});
              }}
              className="block w-full relative rounded-2xl overflow-hidden shadow-card border border-border bg-background hover:shadow-elevated transition-shadow"
            >
              <img
                src={planImg.url}
                alt="Plan de masse du lotissement Le Clos des Cocales à Espondeilhan, 29 lots viabilisés"
                width={1600}
                height={2200}
                loading="lazy"
                className="w-full h-auto"
              />
              <span className="absolute top-4 right-4 inline-flex items-center gap-2 bg-foreground/85 backdrop-blur text-background text-xs font-semibold px-3 py-2 rounded-full opacity-90 group-hover:opacity-100">
                <Maximize2 className="w-3.5 h-3.5" /> Agrandir
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Le projet en chiffres
              </h3>
              <ul className="space-y-2.5 text-sm text-foreground/85">
                <li className="flex justify-between border-b border-border/60 pb-2"><span>Lots disponibles</span><strong className="font-semibold">{LOTS_DISPONIBLES}</strong></li>
                <li className="flex justify-between border-b border-border/60 pb-2"><span>Surface min.</span><strong className="font-semibold">335 m²</strong></li>
                <li className="flex justify-between border-b border-border/60 pb-2"><span>Surface max.</span><strong className="font-semibold">832 m²</strong></li>
                <li className="flex justify-between border-b border-border/60 pb-2"><span>Viabilisation</span><strong className="font-semibold">Complète</strong></li>
                <li className="flex justify-between"><span>Échelle plan</span><strong className="font-semibold">1/1000ᵉ</strong></li>
              </ul>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 font-semibold shadow-cta"
            >
              <a
                href={planPdf.url}
                target="_blank"
                rel="noopener"
                download
                onClick={() => track("plan_pdf_download", {})}
              >
                <Download className="w-4 h-4 mr-2" /> Télécharger le plan (PDF)
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full h-12 border-foreground/20 text-foreground hover:bg-foreground hover:text-background"
            >
              <Link to="/brochure" onClick={() => track("click_brochure", { location: "plan_section" })}>
                Voir la brochure complète
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur p-4 md:p-8 overflow-auto animate-fade-in"
          onClick={() => setZoom(false)}
        >
          <button
            className="fixed top-4 right-4 z-10 bg-background text-foreground rounded-full p-3 shadow-elevated hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setZoom(false)}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={planImg.url}
            alt="Plan de masse — vue agrandie"
            className="max-w-none w-auto h-auto mx-auto"
            style={{ minWidth: "min(1600px, 200vw)" }}
          />
        </div>
      )}
    </section>
  );
};
