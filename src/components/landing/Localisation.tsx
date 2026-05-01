import { MapPin, Car, Train, ShoppingBag, GraduationCap } from "lucide-react";
import dreamHomeImg from "@/assets/dream-home.jpg";

const ACCESS = [
  { icon: Car, label: "Béziers centre", value: "15 min" },
  { icon: Car, label: "Autoroute A9", value: "10 min" },
  { icon: Train, label: "Gare TGV Béziers", value: "20 min" },
  { icon: ShoppingBag, label: "Commerces & marché", value: "Sur place" },
  { icon: GraduationCap, label: "Écoles", value: "À proximité" },
  { icon: MapPin, label: "Plage Méditerranée", value: "30 min" },
];

export const Localisation = () => {
  return (
    <section id="localisation" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">
              Localisation
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground leading-tight">
              Tout est à portée,<br />
              <span className="italic">rien ne vous gêne.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Espondeilhan, c'est le meilleur des deux mondes : la quiétude d'un village
              authentique et un accès rapide aux grands axes, à Béziers, à la gare TGV
              et aux plages méditerranéennes.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {ACCESS.map((a) => (
                <div
                  key={a.label}
                  className="p-4 rounded-xl bg-secondary/40 border border-border"
                >
                  <a.icon className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">{a.label}</div>
                  <div className="font-display font-semibold text-foreground">{a.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-card aspect-[4/3] bg-secondary">
              <iframe
                title="Carte d'Espondeilhan"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.27%2C43.40%2C3.34%2C43.46&amp;layer=mapnik&amp;marker=43.4308%2C3.3050"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <img
              src={dreamHomeImg}
              alt="Maison contemporaine méditerranéenne avec piscine"
              loading="lazy"
              width={1280}
              height={960}
              className="w-full h-48 md:h-60 object-cover rounded-2xl shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
