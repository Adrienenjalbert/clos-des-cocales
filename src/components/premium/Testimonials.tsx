import { Star, Quote } from "lucide-react";
import { TESTIMONIALS, NOTE_MOYENNE } from "@/data/testimonials";

export const Testimonials = () => {
  return (
    <section id="avis" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Avis clients
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mt-3 leading-[1.1] text-balance">
            Ils ont choisi <span className="editorial">de construire</span> avec nous.
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(NOTE_MOYENNE) ? "fill-accent text-accent" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{NOTE_MOYENNE.toFixed(1)}/5</strong> · {TESTIMONIALS.length} avis vérifiés
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.nom}
              className="bg-secondary/50 border border-border rounded-2xl p-6 flex flex-col shadow-soft"
            >
              <Quote className="w-7 h-7 text-accent mb-4" />
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < t.note ? "fill-accent text-accent" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed flex-1 italic">
                « {t.texte} »
              </p>
              <div className="mt-5 pt-4 border-t border-border">
                <div className="font-semibold text-sm text-foreground">{t.nom}</div>
                <div className="text-xs text-muted-foreground">{t.ville}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
