// Informations promoteur — à compléter avec les vraies données légales
// TODO: remplacer par les infos officielles de Sud Immo Catalogue / entité légale
export const PROMOTEUR = {
  nom: "Sud Immo Catalogue",
  baseline: "Spécialiste du foncier en Languedoc depuis plus de 15 ans",
  // Informations légales — à compléter
  rcs: "RCS Béziers 000 000 000", // TODO
  formeJuridique: "SAS au capital de 100 000 €", // TODO
  garantieFinanciere: "Garantie financière d'achèvement — Crédit Agricole Languedoc", // TODO
  permisAmenager: "Permis d'aménager n° PA 034 097 23 0000X", // TODO
  siegeSocial: "Béziers, Hérault (34)",
  // Statistiques de confiance
  anneesExperience: 15,
  programmesLivres: 47,
  lotsCommercialises: 980,
  villesPresence: 22,
} as const;

export const GARANTIES = [
  {
    titre: "Frais de notaire réduits",
    description: "≈ 3 % au lieu de 7-8 % en ancien — économie immédiate sur votre projet.",
  },
  {
    titre: "Terrains 100 % viabilisés",
    description: "Eau, électricité, télécom, voirie, assainissement collectif déjà en place.",
  },
  {
    titre: "Libre choix du constructeur",
    description: "Aucune obligation de constructeur imposé. Vous gardez la main sur votre maison.",
  },
  {
    titre: "Bornage et permis d'aménager validés",
    description: "Sécurité juridique totale. Plan de masse et règlement de lotissement fournis.",
  },
] as const;
