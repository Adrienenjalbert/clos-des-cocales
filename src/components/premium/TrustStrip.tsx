import { Award, ShieldCheck, FileCheck, Building2 } from "lucide-react";
import { PROMOTEUR } from "@/data/promoteur";

export const TrustStrip = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const isDark = variant === "dark";
  const base = isDark
    ? "text-background/80 border-background/15"
    : "text-muted-foreground border-border";
  const icon = isDark ? "text-accent" : "text-accent";
  const items = [
    { Icon: Building2, label: PROMOTEUR.nom, sub: `${PROMOTEUR.programmesLivres} programmes livrés` },
    { Icon: Award, label: "Garantie financière", sub: "d'achèvement bancaire" },
    { Icon: FileCheck, label: "Permis d'aménager", sub: "validé en mairie" },
    { Icon: ShieldCheck, label: "Frais notaire réduits", sub: "≈ 3 % vs 7-8 %" },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 py-4 px-4 md:px-6 rounded-xl border ${base} backdrop-blur-sm ${isDark ? "bg-background/5" : "bg-background"}`}>
      {items.map(({ Icon, label, sub }) => (
        <div key={label} className="flex items-center gap-3 min-w-0">
          <Icon className={`w-5 h-5 shrink-0 ${icon}`} />
          <div className="min-w-0">
            <div className={`text-xs md:text-sm font-semibold leading-tight ${isDark ? "text-background" : "text-foreground"} truncate`}>
              {label}
            </div>
            <div className="text-[11px] md:text-xs leading-tight opacity-80 truncate">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
