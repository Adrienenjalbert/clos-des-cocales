import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-cocales.jpg";
import { CONTACT } from "@/config/contact";
import { LOTS_DISPONIBLES } from "@/data/lots";
import { TrustStrip } from "@/components/premium/TrustStrip";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Vue aérienne du lotissement Le Clos des Cocales à Espondeilhan, entre vignes et garrigue"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="container mx-auto relative z-10 pb-10 md:pb-16 pt-32 text-primary-foreground">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-md border border-background/25 text-background text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Plus que {LOTS_DISPONIBLES} lots · Livraison immédiate
          </span>

          <h1 className="font-display text-[40px] md:text-7xl lg:text-[88px] font-medium leading-[0.98] text-background mb-6 text-balance">
            Construisez votre maison
            <br />
            <span className="editorial text-accent">là où il fait bon vivre.</span>
          </h1>

          <p className="text-base md:text-xl text-background/85 max-w-2xl mb-8 font-light leading-relaxed">
            29 terrains à bâtir viabilisés à Espondeilhan, au cœur du Languedoc — à 15 min
            de Béziers. De 250 à 832 m², dès{" "}
            <strong className="font-semibold text-background">99 900 €</strong> avec frais de
            notaire réduits.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full text-base h-14 px-7 shadow-cta font-semibold"
            >
              <Link to="/programme#lots">
                Voir les {LOTS_DISPONIBLES} lots
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/10 backdrop-blur-md border-background/40 text-background hover:bg-background hover:text-foreground rounded-full text-base h-14 px-7"
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
