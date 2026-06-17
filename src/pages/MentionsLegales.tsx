import { SEOHead } from "@/components/seo/SEOHead";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CONTACT } from "@/config/contact";
import { PROMOTEUR } from "@/data/promoteur";

const MentionsLegales = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Mentions légales | Le Clos des Cocales"
      description="Mentions légales du site clos-des-cocales.fr : éditeur, hébergeur, propriété intellectuelle et coordonnées."
      path="/mentions-legales"
      noindex
    />
    <SiteHeader />
    <main className="pt-28 pb-20">
      <article className="container mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          Informations légales
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium mt-3 leading-[1.1] text-balance">
          Mentions légales
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la
          confiance dans l'économie numérique (LCEN), les informations suivantes sont portées à la
          connaissance des utilisateurs du site <strong>clos-des-cocales.fr</strong>.
        </p>

        <Section title="Éditeur du site">
          <dl>
            <Row k="Raison sociale" v={PROMOTEUR.nom} />
            <Row k="Forme juridique" v={PROMOTEUR.formeJuridique} />
            <Row k="RCS" v={PROMOTEUR.rcs} />
            <Row k="Siège social" v={PROMOTEUR.siegeSocial} />
            <Row k="Email" v={CONTACT.email} />
            <Row k="Téléphone" v={CONTACT.phone} />
            <Row k="Programme commercialisé" v={`${CONTACT.programName} — ${CONTACT.location}`} />
          </dl>
        </Section>

        <Section title="Directeur de la publication">
          <p className="text-muted-foreground leading-relaxed">
            Le directeur de la publication est le représentant légal de {PROMOTEUR.nom}.
          </p>
        </Section>

        <Section title="Hébergement">
          <p className="text-muted-foreground leading-relaxed">
            Le site est hébergé par <strong>GitHub Pages</strong> — GitHub, Inc., 88 Colin P. Kelly
            Jr. Street, San Francisco, CA 94107, États-Unis.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Les formulaires et données sont traités via <strong>Supabase</strong> (Supabase, Inc.).
          </p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p className="text-muted-foreground leading-relaxed">
            L'ensemble des contenus présents sur ce site (textes, images, plans, logo, visuels) est
            la propriété de {PROMOTEUR.nom} ou de ses partenaires et est protégé par le droit de la
            propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans
            autorisation écrite préalable est interdite.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Les visuels et illustrations du programme sont non contractuels.
          </p>
        </Section>

        <Section title="Responsabilité">
          <p className="text-muted-foreground leading-relaxed">
            Les informations diffusées sur ce site (prix, surfaces, disponibilités) sont fournies à
            titre indicatif et sont susceptibles d'évoluer. Elles ne constituent pas une offre
            contractuelle. {PROMOTEUR.nom} ne saurait être tenu responsable d'éventuelles erreurs ou
            omissions.
          </p>
        </Section>

        <Section title="Données personnelles">
          <p className="text-muted-foreground leading-relaxed">
            Le traitement des données personnelles collectées via les formulaires est détaillé dans
            notre{" "}
            <a href="/politique-confidentialite" className="text-accent underline">
              politique de confidentialité
            </a>
            .
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

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex flex-col sm:flex-row sm:gap-3 py-2 border-b border-border/60 last:border-0">
    <dt className="text-sm text-muted-foreground sm:w-56 shrink-0">{k}</dt>
    <dd className="text-sm text-foreground font-medium">{v}</dd>
  </div>
);

export default MentionsLegales;
