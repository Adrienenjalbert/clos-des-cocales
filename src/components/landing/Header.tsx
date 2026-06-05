import { useState, useEffect } from "react";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/config/contact";
import { track } from "@/lib/analytics";
import logoCC from "@/assets/logo-cc.png";

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
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${scrolled ? "bg-background border border-border" : "bg-background/15 backdrop-blur-sm border border-background/30"}`}>
            <img src={logoCC} alt="Le Clos des Cocales" width={40} height={40} className={`w-8 h-8 object-contain ${scrolled ? "" : "brightness-0 invert"}`} />
          </div>
          <div className="leading-tight">
            <div className={`font-display text-base font-semibold ${scrolled ? "text-foreground" : "text-background"}`}>
              Le Clos des Cocales
            </div>
            <div className={`text-[11px] flex items-center gap-1 ${scrolled ? "text-muted-foreground" : "text-background/75"}`}>
              <MapPin className="w-3 h-3" /> Espondeilhan · Hérault
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`text-sm transition-colors ${scrolled ? "text-foreground/80 hover:text-accent" : "text-background/85 hover:text-accent"}`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            onClick={() => track("click_phone", { location: "header_desktop" })}
            className={`text-sm font-medium flex items-center gap-2 transition-colors ${scrolled ? "text-foreground hover:text-accent" : "text-background hover:text-accent"}`}
          >
            <Phone className="w-4 h-4" />
            {CONTACT.phone}
          </a>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-cta"
          >
            <Link to="/brochure" onClick={() => track("click_brochure", { location: "header_desktop" })}>
              Brochure & visite
            </Link>
          </Button>
        </div>

        <button
          className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-background"}`}
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
              onClick={() => track("click_phone", { location: "header_mobile" })}
              className="text-base font-medium text-primary flex items-center gap-2 py-2"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phone}
            </a>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
            >
              <a href="#contact" onClick={() => { setOpen(false); track("click_brochure", { location: "header_mobile" }); }}>
                Réserver une visite
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
