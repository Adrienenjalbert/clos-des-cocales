import { Link } from "react-router-dom";
import { CONTACT } from "@/config/contact";
import { COMMUNES } from "@/data/communes";
import { PROMOTEUR } from "@/data/promoteur";
import { track } from "@/lib/analytics";

export const SiteFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground/80 pt-16 pb-28 lg:pb-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="font-display text-xl font-semibold text-primary-foreground mb-3">
              {CONTACT.programName}
            </div>
            <p className="text-sm leading-relaxed">
              Lotissement de 29 terrains à bâtir viabilisés à Espondeilhan, Hérault.
              À 15 min de Béziers, 20 min de Pézenas.
            </p>
            <div className="mt-5 text-xs text-primary-foreground/60 space-y-1">
              <div>Commercialisé par {PROMOTEUR.nom}</div>
              <div>{PROMOTEUR.formeJuridique}</div>
              <div>{PROMOTEUR.rcs}</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
              Programme
            </div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-primary-foreground">Accueil</Link></li>
              <li><Link to="/programme" className="hover:text-primary-foreground">Le programme</Link></li>
              <li><Link to="/programme#lots" className="hover:text-primary-foreground">Lots disponibles</Link></li>
              <li><Link to="/guide/acheter-terrain-a-batir" className="hover:text-primary-foreground">Guide d'achat</Link></li>
              <li><Link to="/a-propos" className="hover:text-primary-foreground">À propos</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
              Terrains à bâtir
            </div>
            <ul className="space-y-2.5 text-sm">
              {COMMUNES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/terrain-a-batir/${c.slug}`} className="hover:text-primary-foreground">
                    À {c.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
              Contact
            </div>
            <div className="space-y-2.5 text-sm">
              <div>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  onClick={() => track("click_phone", { location: "footer" })}
                  className="hover:text-primary-foreground"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <div>
                <a
                  href={`mailto:${CONTACT.email}`}
                  onClick={() => track("click_email", { location: "footer" })}
                  className="hover:text-primary-foreground"
                >
                  {CONTACT.email}
                </a>
              </div>
              <div>{CONTACT.location}</div>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4 mt-8">
              Outils
            </div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/outils/simulateur-pret" className="hover:text-primary-foreground">Simulateur de prêt</Link></li>
              <li><Link to="/outils/budget-total" className="hover:text-primary-foreground">Estimateur budget total</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/15 text-xs text-primary-foreground/60 flex flex-col md:flex-row justify-between gap-3">
          <div>© {new Date().getFullYear()} {CONTACT.programName}. Tous droits réservés.</div>
          <div className="flex gap-4 flex-wrap">
            <Link to="/mentions-legales" className="hover:text-primary-foreground">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="hover:text-primary-foreground">Confidentialité</Link>
            <span>Visuels non contractuels</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
