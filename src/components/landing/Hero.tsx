import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-cocales.jpg";
import { CONTACT } from "@/config/contact";
import { LOTS_DISPONIBLES } from "@/data/lots";
import { TrustStrip } from "@/components/premium/TrustStrip";
import { track } from "@/lib/analytics";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Vue aérienne du lotissement Le Clos des Cocales à Espondeilhan, entre Montpellier et Béziers"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      {/* extra vignette for headline anchoring */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,hsl(220_14%_4%/0.55)_0%,transparent_55%)] pointer-events-none" />

      <div className="container mx-auto relative z-10 pb-10 md:pb-16 pt-32 text-primary-foreground [text-shadow:0_2px_24px_hsl(220_14%_4%/0.45)]">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-md border border-background/25 text-background text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 font-semibold [text-shadow:none]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            À 40 min de Montpellier · {LOTS_DISPONIBLES} lots disponibles
          </span>

          <h1 className="font-display text-[40px] md:text-7xl lg:text-[88px] font-medium leading-[0.98] text-background mb-6 text-balance">
            Votre terrain à bâtir
            <br />
            <span className="editorial text-accent">à 40 min de Montpellier.</span>
          </h1>

          <p className="text-base md:text-xl text-background/90 max-w-2xl mb-6 font-light leading-relaxed">
            29 terrains viabilisés au cœur du Languedoc, à 15 min de Béziers et 25 min des plages.{" "}
            <span className="font-normal text-background">De 335 à 832 m², avec frais de notaire réduits.</span>
          </p>

          <div className="mb-8 flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              <span className="text-background/65 text-[11px] uppercase tracking-[0.3em] [text-shadow:none]">À partir de</span>
              <span className="font-display text-4xl md:text-5xl font-semibold text-accent tracking-tight">
                92&nbsp;500&nbsp;€
              </span>
            </div>
            <span className="text-[11px] text-background/55 uppercase tracking-wide italic [text-shadow:none]">
              Offre promotionnelle ponctuelle — voir conditions
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full text-base h-14 px-7 shadow-cta font-semibold [text-shadow:none]"
            >
              <Link to="/brochure" onClick={() => track("click_brochure", { location: "hero" })}>
                Recevoir la brochure
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/10 backdrop-blur-md border-background/40 text-background hover:bg-background hover:text-foreground rounded-full text-base h-14 px-7 [text-shadow:none]"
            >
              <a
                href={`tel:${CONTACT.phoneTel}`}
                onClick={() => track("click_phone", { location: "hero" })}
              >
                <Phone className="mr-2 w-5 h-5" />
                {CONTACT.phone}
              </a>
            </Button>
          </div>

          <TrustStrip variant="dark" />
        </div>
      </div>
    </section>
  );
};
