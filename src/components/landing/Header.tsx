import { useState, useEffect } from "react";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/config/contact";

const NAV = [
  { href: "#programme", label: "Le programme" },
  { href: "#atouts", label: "Atouts" },
  { href: "#lots", label: "Lots disponibles" },
  { href: "#localisation", label: "Localisation" },
  { href: "#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-lg font-semibold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-foreground">
              Le Clos des Cocales
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Espondeilhan · Hérault
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {CONTACT.phone}
          </a>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-cta"
          >
            <a href="#contact">Réserver une visite</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen((s) => !s)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-base text-foreground py-2 border-b border-border/50"
              >
                {n.label}
              </a>
            ))}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="text-base font-medium text-primary flex items-center gap-2 py-2"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phone}
            </a>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
            >
              <a href="#contact" onClick={() => setOpen(false)}>
                Réserver une visite
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
