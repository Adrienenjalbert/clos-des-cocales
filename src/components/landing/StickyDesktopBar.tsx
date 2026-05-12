import { useEffect, useState } from "react";
import { Phone, MessageCircle, Flame } from "lucide-react";
import { CONTACT, whatsappLink } from "@/config/contact";
import { LOTS_DISPONIBLES } from "@/data/lots";
import { LeadMagnet } from "./LeadMagnet";
import { Button } from "@/components/ui/button";

export const StickyDesktopBar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-card animate-fade-in">
      <div className="container mx-auto py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-foreground">
              Plus que <span className="text-accent">{LOTS_DISPONIBLES} terrains disponibles</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Dès 99 900 € · Frais de notaire réduits 3 % · Livraison immédiate
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <LeadMagnet
            source="sticky_bar"
            trigger={
              <Button variant="outline" className="rounded-full">
                Brochure PDF
              </Button>
            }
          />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-accent text-accent-foreground text-sm font-semibold shadow-cta hover:bg-accent/90 transition-colors"
          >
            <Phone className="w-4 h-4" /> {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
