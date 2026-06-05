import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  Download,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UsefulLinks } from "@/components/landing/UsefulLinks";
import { Button } from "@/components/ui/button";
import { CONTACT, whatsappLink } from "@/config/contact";
import { track } from "@/lib/analytics";

const Merci = () => {
  const [params] = useSearchParams();
  const name = params.get("name")?.trim() || "";
  const lot = params.get("lot")?.trim() || "";

  useEffect(() => {
    // Conversion tracking — GA4 & dataLayer
    track("lead_thank_you_view", { lot: lot || null });
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        event_category: "lead",
        event_label: lot || "no_lot",
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [lot]);

  const wa = whatsappLink(
    `Bonjour, je viens d'envoyer ma demande${
      lot ? ` pour le lot ${lot}` : ""
    } sur le site du Clos des Cocales. Pouvons-nous échanger ?`,
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Merci — Demande reçue | Le Clos des Cocales"
        description="Votre demande a bien été reçue. Notre équipe vous recontacte sous 24 h ouvrées. En attendant, découvrez nos outils et notre guide pratique."
        path="/merci"
        noindex
      />
      <SiteHeader />

      <main className="pt-24">
        {/* Hero confirmation */}
        <section className="bg-warm-gradient">
          <div className="container mx-auto py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground mb-6 shadow-soft">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                Demande reçue
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-medium mt-3 leading-[1.05] text-balance">
                Merci{name ? `, ${name}` : ""}.
                <br />
                <span className="text-accent">À très vite.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
                Notre équipe vous recontacte sous{" "}
                <strong className="text-foreground">24 h ouvrées</strong>
                {lot ? (
                  <>
                    {" "}
                    au sujet du{" "}
                    <strong className="text-foreground">lot {lot}</strong>
                  </>
                ) : null}
                . Vérifiez vos emails (et le dossier indésirables) — une confirmation
                vient de partir.
              </p>
            </div>
          </div>
        </section>

        {/* Next steps timeline */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-medium text-center mb-10">
                Les prochaines étapes
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    n: "1",
                    title: "Premier contact",
                    desc: "Un appel ou email sous 24 h ouvrées pour comprendre votre projet.",
                  },
                  {
                    n: "2",
                    title: "Brochure & plan",
                    desc: "Nous vous envoyons brochure, plan de masse et disponibilités à jour.",
                  },
                  {
                    n: "3",
                    title: "Visite sur place",
                    desc: "Découvrez les terrains à Espondeilhan avec un conseiller.",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="bg-background border border-border rounded-2xl p-6 shadow-card"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/15 text-accent font-display font-semibold flex items-center justify-center mb-4">
                      {s.n}
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Urgent contact CTAs */}
        <section className="py-12 bg-accent-soft/40 border-y border-border">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-3">
                Vous préférez parler maintenant ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Nous sommes disponibles directement par téléphone ou WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    onClick={() =>
                      track("click_phone", { location: "thank_you" })
                    }
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler {CONTACT.phone}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-full border-primary/30"
                >
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("click_whatsapp", { location: "thank_you" })
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="rounded-full"
                >
                  <a
                    href={`mailto:${CONTACT.email}`}
                    onClick={() =>
                      track("click_email", { location: "thank_you" })
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Resources / engagement to reduce bounce */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <UsefulLinks source="thank_you" variant="card" className="mb-12" />

              <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
                <Link
                  to="/a-propos"
                  onClick={() => track("thank_you_resource_click", { to: "/a-propos", title: "Le programme" })}
                  className="group bg-background border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-soft transition-all flex flex-col"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Le programme
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Espondeilhan, à 15 min de Béziers.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-accent font-medium mt-4">
                    Découvrir
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/programme#lots"
                  onClick={() => track("thank_you_resource_click", { to: "/programme#lots", title: "Voir les lots disponibles" })}
                  className="group bg-background border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-soft transition-all flex flex-col"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Voir les lots disponibles
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Surfaces, prix et plan de masse.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-accent font-medium mt-4">
                    Découvrir
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Merci;
