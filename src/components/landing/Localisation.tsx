import { MapPin, Car, Train, ShoppingBag, GraduationCap, Plane } from "lucide-react";
import dreamHomeImg from "@/assets/dream-home.jpg";

const ACCESS = [
  { icon: Car, label: "Montpellier", value: "40 min" },
  { icon: Car, label: "Béziers centre", value: "15 min" },
  { icon: MapPin, label: "Plages Méditerranée", value: "25 min" },
  { icon: Car, label: "Autoroute A9 / A75", value: "10 min" },
  { icon: Train, label: "Gare TGV Béziers", value: "20 min" },
  { icon: ShoppingBag, label: "Commerces & écoles", value: "Sur place" },
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
              Proche de tout,<br />
              <span className="italic">loin du bruit.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Espondeilhan se situe au croisement de l'A9 et de l'A75 : Montpellier accessible
              en 40 min, Béziers en 15 min, la mer en 25 min. Un emplacement stratégique pour
              concilier travail à la ville et vie de village.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {ACCESS.map((a) => (
                <div
                  key={a.label}
                  className="p-4 rounded-xl bg-secondary/40 border border-border"
                >
                  <a.icon className="w-5 h-5 text-accent mb-2" />
                  <div className="text-sm text-muted-foreground">{a.label}</div>
                  <div className="font-display font-semibold text-foreground">{a.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-card aspect-[4/3] bg-secondary">
              <iframe
                title="Le Clos des Cocales — Avenue de la Mer, Espondeilhan"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.2545%2C43.4344%2C3.2745%2C43.4444&amp;layer=mapnik&amp;marker=43.4394%2C3.2645"
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
