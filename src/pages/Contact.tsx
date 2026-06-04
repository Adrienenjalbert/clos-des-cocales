import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactSection } from "@/components/landing/ContactSection";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Contact — Le Clos des Cocales | Terrains à bâtir Espondeilhan"
      description="Contactez Le Clos des Cocales : téléphone, WhatsApp, email ou formulaire. Brochure, plan de masse et visite sur place sous 24 h ouvrées."
      path="/contact"
    />
    <SiteHeader />
    <main className="pt-24">
      <div className="container mx-auto pt-8 md:pt-12">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          Contact
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance max-w-2xl">
          Parlons de votre projet de terrain à bâtir.
        </h1>
      </div>
      <ContactSection />
    </main>
    <SiteFooter />
  </div>
);

export default Contact;
