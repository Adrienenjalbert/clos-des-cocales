import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CONTACT } from "@/config/contact";
import { PROMOTEUR } from "@/data/promoteur";

const PolitiqueConfidentialite = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Politique de confidentialité | Le Clos des Cocales"
      description="Politique de confidentialité et protection des données personnelles (RGPD) du site clos-des-cocales.fr."
      path="/politique-confidentialite"
      noindex
    />
    <SiteHeader />
    <main className="pt-28 pb-20">
      <article className="container mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          RGPD
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
          Politique de confidentialité
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          La présente politique décrit comment {PROMOTEUR.nom} collecte et traite vos données
          personnelles lorsque vous utilisez le site <strong>clos-des-cocales.fr</strong>,
          conformément au Règlement général sur la protection des données (RGPD) et à la loi
          Informatique et Libertés.
        </p>

        <Section title="Responsable du traitement">
          <p className="text-muted-foreground leading-relaxed">
            {PROMOTEUR.nom} — {PROMOTEUR.siegeSocial}. Contact :{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-accent underline">
              {CONTACT.email}
            </a>
            .
          </p>
        </Section>

        <Section title="Données collectées">
          <p className="text-muted-foreground leading-relaxed mb-3">
            Lorsque vous remplissez un formulaire de contact ou de demande de brochure, nous
            collectons :
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>votre nom et prénom ;</li>
            <li>votre adresse email ;</li>
            <li>votre numéro de téléphone (facultatif) ;</li>
            <li>le lot qui vous intéresse et votre message (facultatifs) ;</li>
            <li>
              des données techniques d'attribution (source de visite, UTM) à des fins de mesure
              d'audience.
            </li>
          </ul>
        </Section>

        <Section title="Finalités et base légale">
          <p className="text-muted-foreground leading-relaxed">
            Vos données sont utilisées pour répondre à votre demande, vous adresser la documentation
            du programme et assurer le suivi commercial. La base légale est votre{" "}
            <strong>consentement</strong> (case à cocher du formulaire) et l'intérêt légitime de
            {" "}{PROMOTEUR.nom} à traiter les demandes reçues.
          </p>
        </Section>

        <Section title="Destinataires et sous-traitants">
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              <strong>Supabase, Inc.</strong> — hébergement de la base de données des demandes ;
            </li>
            <li>
              <strong>Resend</strong> — envoi des emails de confirmation et de suivi ;
            </li>
            <li>
              <strong>Google Analytics</strong> — mesure d'audience anonymisée.
            </li>
          </ul>
        </Section>

        <Section title="Durée de conservation">
          <p className="text-muted-foreground leading-relaxed">
            Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et
            au plus <strong>3 ans</strong> à compter de notre dernier contact, sauf obligation légale
            contraire.
          </p>
        </Section>

        <Section title="Vos droits">
          <p className="text-muted-foreground leading-relaxed">
            Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation,
            d'opposition et de portabilité de vos données. Pour les exercer, écrivez-nous à{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-accent underline">
              {CONTACT.email}
            </a>
            . Vous pouvez également introduire une réclamation auprès de la CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </Section>

        <Section title="Cookies">
          <p className="text-muted-foreground leading-relaxed">
            Le site utilise des cookies de mesure d'audience (Google Analytics). Vous pouvez
            configurer votre navigateur pour les refuser.
          </p>
        </Section>

        <p className="mt-12 text-xs text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.
        </p>
      </article>
    </main>
    <SiteFooter />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2 className="font-display text-2xl font-semibold text-foreground mb-4">{title}</h2>
    {children}
  </section>
);

export default PolitiqueConfidentialite;
