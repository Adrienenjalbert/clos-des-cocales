import { useEffect, useRef } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Programme } from "@/components/landing/Programme";
import { Atouts } from "@/components/landing/Atouts";
import { LotsTable } from "@/components/landing/LotsTable";
import { Localisation } from "@/components/landing/Localisation";
import { Etapes } from "@/components/landing/Etapes";
import { FAQ } from "@/components/landing/FAQ";
import { ContactSection, type ContactSectionHandle } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { MobileCTA } from "@/components/landing/MobileCTA";
import { StickyDesktopBar } from "@/components/landing/StickyDesktopBar";
import { NumbersBlock } from "@/components/premium/NumbersBlock";
import { Testimonials } from "@/components/premium/Testimonials";
import { CommunesGrid } from "@/components/premium/CommunesGrid";

const Index = () => {
  const contactRef = useRef<ContactSectionHandle>(null);

  useEffect(() => {
    document.title = "Le Clos des Cocales — Terrains à bâtir à Espondeilhan dès 99 900 €";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta(
      "description",
      "Terrains à bâtir viabilisés à Espondeilhan (Hérault), à 15 min de Béziers. De 250 à 832 m² dès 99 900 €. Frais de notaire réduits 3 %. Livraison immédiate."
    );
    setMeta("robots", "index, follow");
    document.documentElement.lang = "fr";

    // JSON-LD
    const ldId = "ld-real-estate";
    let ld = document.getElementById(ldId);
    if (!ld) {
      ld = document.createElement("script");
      ld.id = ldId;
      (ld as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Residence",
      name: "Le Clos des Cocales",
      description:
        "Lotissement de terrains à bâtir viabilisés à Espondeilhan, Hérault.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Espondeilhan",
        addressRegion: "Hérault",
        addressCountry: "FR",
      },
      offers: { "@type": "Offer", priceCurrency: "EUR", price: "99900" },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <NumbersBlock />
        <Programme />
        <Atouts />
        <LotsTable onSelectLot={(label) => contactRef.current?.setLot(label)} />
        <Localisation />
        <CommunesGrid />
        <Testimonials />
        <Etapes />
        <FAQ />
        <ContactSection ref={contactRef} />
      </main>
      <Footer />
      <MobileCTA />
      <StickyDesktopBar />
    </div>
  );
};

export default Index;
