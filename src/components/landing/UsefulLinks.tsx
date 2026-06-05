import { Link } from "react-router-dom";
import { Calculator, Wallet, BookOpen, ArrowRight, FileText } from "lucide-react";
import { track } from "@/lib/analytics";

const LINKS = [
  {
    to: "/outils/simulateur-pret",
    icon: Calculator,
    title: "Simulateur de prêt",
    desc: "Calculez votre mensualité en 30 sec.",
  },
  {
    to: "/outils/budget-total",
    icon: Wallet,
    title: "Budget total terrain + maison",
    desc: "Estimez le coût complet de votre projet.",
  },
  {
    to: "/guide/acheter-terrain-a-batir",
    icon: BookOpen,
    title: "Guide pratique",
    desc: "Les 6 étapes pour acheter sans pièges.",
  },
  {
    to: "/brochure",
    icon: FileText,
    title: "Brochure complète",
    desc: "Téléchargez la brochure du programme.",
  },
] as const;

interface Props {
  source?: string;
  variant?: "card" | "compact";
  className?: string;
}

export const UsefulLinks = ({ source = "post_lead", variant = "card", className = "" }: Props) => {
  if (variant === "compact") {
    return (
      <div className={`text-left ${className}`}>
        <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
          Pendant que vous attendez notre appel
        </p>
        <ul className="space-y-2">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => track("useful_link_click", { source, to: l.to })}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 hover:border-accent/60 hover:bg-accent/5 transition-colors"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <l.icon className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{l.title}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`text-left ${className}`}>
      <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3 text-center">
        Pour préparer votre projet
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={() => track("useful_link_click", { source, to: l.to })}
            className="group rounded-xl border border-border bg-background p-4 hover:border-accent/60 hover:shadow-card transition-all"
          >
            <l.icon className="w-5 h-5 text-accent mb-2" />
            <div className="font-display font-semibold text-foreground text-sm leading-tight mb-1">
              {l.title}
            </div>
            <div className="text-xs text-muted-foreground leading-snug">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
