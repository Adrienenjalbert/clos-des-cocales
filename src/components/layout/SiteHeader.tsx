import { useState, useEffect } from "react";
import { Phone, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/config/contact";
import { COMMUNES } from "@/data/communes";

const NAV: { to: string; label: string; children?: { to: string; label: string }[] }[] = [
  { to: "/programme", label: "Le programme" },
  {
    to: "#",
    label: "Par commune",
    children: COMMUNES.map((c) => ({
      to: `/terrain-a-batir/${c.slug}`,
      label: c.nom,
    })),
  },
  {
    to: "#",
    label: "Outils",
    children: [
      { to: "/outils/simulateur-pret", label: "Simulateur de prêt" },
      { to: "/outils/budget-total", label: "Budget total projet" },
    ],
  },
  { to: "/guide/acheter-terrain-a-batir", label: "Guide d'achat" },
  { to: "/a-propos", label: "À propos" },
];

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on nav
  useEffect(() => {
    setOpen(false);
    setOpenSub(null);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-background/90 backdrop-blur-md border-b border-border shadow-soft"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3.5">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className={`w-10 h-10 rounded-md ${
              transparent ? "bg-background/15 backdrop-blur-sm border border-background/30" : "bg-primary"
            } flex items-center justify-center font-display text-lg font-semibold ${
              transparent ? "text-background" : "text-primary-foreground"
            }`}
          >
            C
          </div>
          <div className="leading-tight">
            <div
              className={`font-display text-base font-semibold ${
                transparent ? "text-background" : "text-foreground"
              }`}
            >
              Le Clos des Cocales
            </div>
            <div
              className={`text-[11px] flex items-center gap-1 ${
                transparent ? "text-background/75" : "text-muted-foreground"
              }`}
            >
              <MapPin className="w-3 h-3" /> Espondeilhan · Hérault
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((n) =>
            n.children ? (
              <div
                key={n.label}
                className="relative"
                onMouseEnter={() => setOpenSub(n.label)}
                onMouseLeave={() => setOpenSub(null)}
              >
                <button
                  className={`text-sm flex items-center gap-1 transition-colors ${
                    transparent ? "text-background/90 hover:text-accent" : "text-foreground/85 hover:text-primary"
                  }`}
                >
                  {n.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openSub === n.label && (
                  <div className="absolute top-full left-0 pt-3">
                    <div className="bg-background border border-border rounded-xl shadow-card p-2 min-w-[220px] animate-fade-in">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          className="block px-3 py-2 text-sm rounded-md text-foreground hover:bg-secondary transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    transparent
                      ? `${isActive ? "text-accent" : "text-background/90"} hover:text-accent`
                      : `${isActive ? "text-primary font-semibold" : "text-foreground/85"} hover:text-primary`
                  }`
                }
              >
                {n.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className={`text-sm font-medium hidden xl:flex items-center gap-2 transition-colors ${
              transparent ? "text-background hover:text-accent" : "text-foreground hover:text-primary"
            }`}
          >
            <Phone className="w-4 h-4" />
            {CONTACT.phone}
          </a>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-cta"
          >
            <Link to="/programme#contact">Brochure & visite</Link>
          </Button>
        </div>

        <button
          className={`lg:hidden p-2 ${transparent ? "text-background" : "text-foreground"}`}
          onClick={() => setOpen((s) => !s)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border max-h-[calc(100vh-64px)] overflow-y-auto animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col">
            {NAV.map((n) =>
              n.children ? (
                <div key={n.label} className="border-b border-border/50">
                  <button
                    className="w-full flex items-center justify-between py-3 text-base text-foreground"
                    onClick={() => setOpenSub(openSub === n.label ? null : n.label)}
                  >
                    {n.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openSub === n.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openSub === n.label && (
                    <div className="pb-3 pl-3 flex flex-col gap-1">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          className="py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  className="py-3 text-base text-foreground border-b border-border/50"
                >
                  {n.label}
                </Link>
              )
            )}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="text-base font-medium text-primary flex items-center gap-2 py-3"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phone}
            </a>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full mt-2"
            >
              <Link to="/programme#contact">Brochure & visite</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
