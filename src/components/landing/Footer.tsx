import { CONTACT } from "@/config/contact";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 py-12 pb-28 lg:pb-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-display text-xl font-semibold text-background mb-3">
              {CONTACT.programName}
            </div>
            <p className="text-sm leading-relaxed">
              Lotissement de terrains à bâtir viabilisés à Espondeilhan, Hérault.
              Au cœur du Languedoc, à 15 minutes de Béziers.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-background/60 mb-3">
              Contact
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-background">
                  {CONTACT.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-background">
                  {CONTACT.email}
                </a>
              </div>
              <div>{CONTACT.location}</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-background/60 mb-3">
              Liens
            </div>
            <ul className="space-y-2 text-sm">
              <li><a href="#programme" className="hover:text-background">Le programme</a></li>
              <li><a href="#lots" className="hover:text-background">Lots disponibles</a></li>
              <li><a href="#contact" className="hover:text-background">Contact</a></li>
              <li>
                <a
                  href={CONTACT.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background"
                >
                  Fiche officielle Sud Immo Catalogue
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-background/15 text-xs text-background/60 flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} {CONTACT.programName}. Tous droits réservés.</div>
          <div>
            Programme commercialisé par Sud Immo Catalogue. Visuels non contractuels.
          </div>
        </div>
      </div>
    </footer>
  );
};
