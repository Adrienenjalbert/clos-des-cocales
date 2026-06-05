import { useEffect, useRef } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Programme } from "@/components/landing/Programme";
import { Atouts } from "@/components/landing/Atouts";
import { PlanDeMasse } from "@/components/landing/PlanDeMasse";
import { LotsTable } from "@/components/landing/LotsTable";
import { Localisation } from "@/components/landing/Localisation";
import { Etapes } from "@/components/landing/Etapes";
import { FAQ } from "@/components/landing/FAQ";
import { ContactSection, type ContactSectionHandle } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { MobileCTA } from "@/components/landing/MobileCTA";
import { StickyDesktopBar } from "@/components/landing/StickyDesktopBar";
import { ExitIntentModal } from "@/components/landing/ExitIntentModal";
import { VisitBooking } from "@/components/landing/VisitBooking";
import { NumbersBlock } from "@/components/premium/NumbersBlock";

const Index = () => {
  const contactRef = useRef<ContactSectionHandle>(null);

  useEffect(() => {
    document.title = "Terrains à bâtir Espondeilhan — Le Clos des Cocales";

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
      "29 terrains à bâtir viabilisés à 40 min de Montpellier, dès 92 500 €. Frais de notaire réduits, livraison immédiate."
    );
    setMeta("robots", "index, follow");
    document.documentElement.lang = "fr";

    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };
    setCanonical("https://clos-des-cocales.fr/");

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
        "Lotissement de 29 terrains à bâtir viabilisés à Espondeilhan, à 40 min de Montpellier et 15 min de Béziers.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Avenue de la Mer",
        addressLocality: "Espondeilhan",
        postalCode: "34290",
        addressRegion: "Hérault",
        addressCountry: "FR",
      },
      geo: { "@type": "GeoCoordinates", latitude: 43.4394, longitude: 3.2645 },
      offers: { "@type": "Offer", priceCurrency: "EUR", price: "92500" },
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
        <PlanDeMasse />
        <LotsTable onSelectLot={(label) => contactRef.current?.setLot(label)} />
        <Localisation />
        <Etapes />
        <VisitBooking />
        <FAQ />
        <ContactSection ref={contactRef} />
      </main>
      <Footer />
      <MobileCTA />
      <StickyDesktopBar />
      <ExitIntentModal />
    </div>
  );
};

export default Index;
