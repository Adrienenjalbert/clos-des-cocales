import villageImg from "@/assets/village-street.jpg";
import vineyardsImg from "@/assets/vineyards.jpg";

export const Programme = () => {
  return (
    <section id="programme" className="py-20 md:py-28 bg-warm-gradient">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">
              Le programme
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground leading-tight">
              Un village héraultais qui allie{" "}
              <span className="italic">authenticité</span> et douceur de vivre.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Niché entre vignes et garrigue, <strong className="text-foreground">Espondeilhan</strong>{" "}
              séduit par ses ruelles pittoresques, son église médiévale et son ambiance
              conviviale. Un cadre rare, à 15 minutes seulement de Béziers et de ses commerces.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Le Clos des Cocales est un lotissement <strong className="text-foreground">prêt à bâtir</strong> :
              terrains viabilisés, livraison immédiate, et la liberté de choisir votre constructeur.
              Votre projet de vie commence ici.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {["Vignes & garrigue", "Église médiévale", "Écoles à proximité", "Commerces"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-background border border-border rounded-full text-sm text-foreground"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <img
              src={villageImg}
              alt="Ruelle pittoresque d'un village héraultais"
              loading="lazy"
              width={1280}
              height={960}
              className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-card"
            />
            <img
              src={vineyardsImg}
              alt="Vignobles du Languedoc au coucher du soleil"
              loading="lazy"
              width={1280}
              height={960}
              className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-card mt-8 md:mt-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
