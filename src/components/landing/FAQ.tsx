import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Les terrains sont-ils viabilisés ?",
    a: "Oui, tous les lots du Clos des Cocales sont entièrement viabilisés : raccordement à l'eau, à l'électricité, au tout-à-l'égout et aux télécommunications. Vous pouvez démarrer la construction immédiatement après la signature.",
  },
  {
    q: "Pourquoi les frais de notaire sont-ils réduits à 3 % ?",
    a: "Comme il s'agit de terrains à bâtir vendus dans le neuf, les frais de notaire (droits d'enregistrement) bénéficient du taux réduit d'environ 3 % du prix d'achat, contre 7 à 8 % dans l'ancien. Une économie immédiate de plusieurs milliers d'euros.",
  },
  {
    q: "Puis-je choisir mon constructeur ?",
    a: "Absolument. Vous êtes libre de choisir le constructeur, l'architecte ou le maître d'œuvre de votre choix. Aucun fournisseur ne vous est imposé. Nous pouvons toutefois vous recommander des partenaires locaux de confiance si vous le souhaitez.",
  },
  {
    q: "Quels sont les frais annexes ?",
    a: "Les frais annexes s'élèvent à 2 730 € au total et couvrent : géomètre, architecte (DP/PC), caution pour dégradations éventuelles, et provision pour l'Association Syndicale Libre (A.S.L) du lotissement.",
  },
  {
    q: "L'exonération de taxe d'aménagement, comment ça marche ?",
    a: "La commune d'Espondeilhan a accordé une exonération de la part communale de la taxe d'aménagement sur ce programme. C'est un avantage fiscal significatif (souvent plusieurs milliers d'euros) qui s'applique automatiquement au moment du dépôt du permis de construire.",
  },
  {
    q: "Quel est le délai pour réserver et signer ?",
    a: "La réservation peut se faire en quelques jours après votre visite. La signature de l'acte authentique chez le notaire intervient généralement entre 2 et 3 mois après la réservation, le temps d'instruire votre dossier et votre financement.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Questions fréquentes
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-tight">
            On répond à tout, sans détour.
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-background rounded-2xl border border-border px-6 shadow-soft"
            >
              <AccordionTrigger className="font-display text-left text-lg font-semibold text-foreground hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
