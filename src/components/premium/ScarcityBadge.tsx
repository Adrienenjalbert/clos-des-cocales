import { Flame } from "lucide-react";
import { LOTS_DISPONIBLES } from "@/data/lots";

export const ScarcityBadge = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/12 border border-accent/30 text-accent-foreground text-xs font-semibold ${className}`}
  >
    <Flame className="w-3.5 h-3.5 text-accent" />
    Plus que {LOTS_DISPONIBLES} lots disponibles
  </span>
);
