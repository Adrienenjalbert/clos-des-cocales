import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-cocales.jpg";
import { CONTACT } from "@/config/contact";
import { LOTS_DISPONIBLES } from "@/data/lots";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Vue aérienne du lotissement Le Clos des Cocales à Espondeilhan, entre vignes et garrigue"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="container mx-auto relative z-10 pb-16 md:pb-24 pt-32 text-primary-foreground animate-fade-up">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-background/15 backdrop-blur-sm border border-background/20 text-background text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Nouvelle grille de prix · Plus que {LOTS_DISPONIBLES} lots disponibles
          </span>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-background mb-6">
            Construisez votre maison
            <br />
            <span className="italic font-normal text-accent-soft">là où il fait bon vivre.</span>
          </h1>

          <p className="text-lg md:text-xl text-background/90 max-w-2xl mb-8 font-light leading-relaxed">
            Terrains à bâtir viabilisés à Espondeilhan, au cœur du Languedoc — à 15 min
            de Béziers. De 250 à 832 m², à partir de{" "}
            <strong className="font-semibold text-accent-soft">99 900 €</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full text-base h-14 px-8 shadow-cta"
            >
              <a href="#contact">
                Demander la brochure
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/10 backdrop-blur-sm border-background/40 text-background hover:bg-background hover:text-foreground rounded-full text-base h-14 px-8"
            >
              <a href={`tel:${CONTACT.phoneTel}`}>
                <Phone className="mr-2 w-5 h-5" />
                {CONTACT.phone}
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 max-w-2xl border-t border-background/20 pt-6">
            <Stat label="À partir de" value="99 900 €" />
            <Stat label="Surfaces" value="250–832 m²" />
            <Stat label="Béziers" value="15 min" />
            <Stat label="Frais notaire" value="3 % réduits" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-background/70 mb-1">{label}</div>
    <div className="font-display text-xl md:text-2xl font-medium text-background">{value}</div>
  </div>
);
