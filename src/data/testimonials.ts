// Témoignages — placeholders à remplacer par de vrais avis Google ou clients
// TODO: récupérer 3-5 vrais avis du promoteur
export interface Testimonial {
  nom: string;
  ville: string;
  note: 1 | 2 | 3 | 4 | 5;
  texte: string;
  date: string;
  programme?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    nom: "Émilie & Julien R.",
    ville: "Béziers",
    note: 5,
    texte:
      "Nous cherchions depuis un an un terrain abordable près de Béziers. Le suivi a été irréprochable, du choix du lot à la signature. Frais de notaire réduits comme annoncé, aucune mauvaise surprise.",
    date: "2025-02",
    programme: "Le Clos des Cocales",
  },
  {
    nom: "Sophie M.",
    ville: "Pézenas",
    note: 5,
    texte:
      "Équipe disponible, transparente sur les prix et les délais. Le terrain était viabilisé comme prévu, on a pu démarrer le chantier dans les 3 mois. Je recommande.",
    date: "2024-11",
  },
  {
    nom: "Marc & Catherine L.",
    ville: "Servian",
    note: 5,
    texte:
      "Premier achat, on était stressés. Ils ont pris le temps de nous expliquer chaque étape, l'acte notarié, la viabilisation, le permis. Très professionnels et humains.",
    date: "2024-09",
  },
  {
    nom: "David P.",
    ville: "Magalas",
    note: 4,
    texte:
      "Bon rapport qualité/prix. Le lotissement est calme, bien intégré au village. Quelques détails à finaliser sur la voirie au début mais tout a été corrigé rapidement.",
    date: "2024-07",
  },
];

export const NOTE_MOYENNE =
  TESTIMONIALS.reduce((s, t) => s + t.note, 0) / TESTIMONIALS.length;
