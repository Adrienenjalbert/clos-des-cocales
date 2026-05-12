// Données communes pour les landings SEO locales
// Sources prix : Orpi, iad, SeLoger, Lalliance.fr, Alentoor (recherches 2025)

export interface Commune {
  slug: string;
  nom: string;
  codePostal: string;
  distanceMin: number;
  distanceKm: number;
  population: number;
  prixMoyenTerrainM2: number; // € / m² médian terrain à bâtir local
  prixExempleConcurrence: { surface: number; prix: number }[];
  atouts: string[];
  intro: string;
  faq: { q: string; a: string }[];
}

export const COMMUNES: Commune[] = [
  {
    slug: "beziers",
    nom: "Béziers",
    codePostal: "34500",
    distanceMin: 15,
    distanceKm: 17,
    population: 79000,
    prixMoyenTerrainM2: 280,
    prixExempleConcurrence: [
      { surface: 541, prix: 149000 },
      { surface: 578, prix: 148000 },
      { surface: 477, prix: 152000 },
    ],
    atouts: [
      "Capitale économique de l'Ouest héraultais",
      "Gare TGV (Paris en 4h15), aéroport Béziers-Cap d'Agde",
      "Tous commerces, hôpital, lycées, université (campus Du Guesclin)",
    ],
    intro:
      "Acheter un terrain à bâtir à Béziers représente un budget moyen de 115 000 à 158 000 € pour 477 à 578 m². À seulement 15 minutes au nord-ouest, Le Clos des Cocales propose des terrains équivalents à partir de 99 900 € — soit jusqu'à 35 % d'économie pour le même cadre de vie, avec en prime la tranquillité d'un village du Languedoc.",
    faq: [
      {
        q: "Combien coûte un terrain à bâtir à Béziers en 2025 ?",
        a: "Le prix médian d'un terrain constructible viabilisé à Béziers se situe entre 115 000 € et 158 000 € pour 470 à 580 m² (sources Orpi, iad, SeLoger, données 2025). Soit environ 250 à 320 €/m² selon le quartier.",
      },
      {
        q: "Pourquoi acheter à Espondeilhan plutôt qu'à Béziers ?",
        a: "À 15 minutes de Béziers, vous bénéficiez d'un terrain 25 à 35 % moins cher, d'une fiscalité locale plus douce (taxe foncière inférieure), et d'un cadre de village authentique entre vignes et garrigue. Vous gardez l'accès rapide à tous les services biterrois.",
      },
      {
        q: "Comment se rendre de Béziers à Espondeilhan ?",
        a: "Comptez 15 min en voiture par la D11 puis la D154E2. La sortie autoroutière A9 'Béziers Ouest' est à 20 minutes du Clos des Cocales.",
      },
    ],
  },
  {
    slug: "pezenas",
    nom: "Pézenas",
    codePostal: "34120",
    distanceMin: 20,
    distanceKm: 22,
    population: 8500,
    prixMoyenTerrainM2: 320,
    prixExempleConcurrence: [
      { surface: 359, prix: 130000 },
      { surface: 581, prix: 134000 },
      { surface: 905, prix: 178000 },
    ],
    atouts: [
      "Cité de Molière, classée Ville d'Art et d'Histoire",
      "Forte attractivité touristique et culturelle",
      "Tous services, marchés, écoles et collège public/privé",
    ],
    intro:
      "Les terrains à bâtir à Pézenas oscillent entre 130 000 € et 178 000 € pour des surfaces de 359 à 905 m² (données 2025). Le Clos des Cocales, à 20 minutes seulement, vous propose des terrains viabilisés équivalents à partir de 99 900 € dans un cadre village paisible — idéal si vous appréciez l'art de vivre piscénois sans son budget.",
    faq: [
      {
        q: "Quel budget pour un terrain à Pézenas ?",
        a: "À Pézenas, un terrain constructible viabilisé coûte entre 130 000 € et 180 000 € selon la surface et l'emplacement. Le prix moyen au m² avoisine 320 €.",
      },
      {
        q: "Espondeilhan est-il proche de Pézenas ?",
        a: "Oui, Espondeilhan se situe à seulement 20 minutes en voiture de Pézenas via la D13. Vous bénéficiez de tout l'art de vivre piscénois sans le coût foncier.",
      },
    ],
  },
  {
    slug: "servian",
    nom: "Servian",
    codePostal: "34290",
    distanceMin: 5,
    distanceKm: 4,
    population: 4500,
    prixMoyenTerrainM2: 240,
    prixExempleConcurrence: [
      { surface: 461, prix: 119900 },
      { surface: 538, prix: 125000 },
    ],
    atouts: [
      "Village voisin avec écoles maternelle et élémentaire",
      "Commerces de proximité, médecins, pharmacie",
      "Marché hebdomadaire et tissu associatif dynamique",
    ],
    intro:
      "Servian, à 5 minutes seulement d'Espondeilhan, est un village très recherché pour sa qualité de vie. Les terrains à bâtir y sont rares et se vendent rapidement entre 119 000 € et 125 000 €. Le Clos des Cocales offre une alternative immédiatement disponible à partir de 99 900 €, avec 29 lots livrés et viabilisés.",
    faq: [
      {
        q: "Y a-t-il des terrains à bâtir disponibles à Servian ?",
        a: "L'offre est très limitée à Servian, avec seulement 1 à 2 terrains constructibles disponibles à un instant donné, à des prix élevés (≥ 120 000 €). Le Clos des Cocales à Espondeilhan voisin propose 29 lots disponibles dès 99 900 €.",
      },
    ],
  },
  {
    slug: "magalas",
    nom: "Magalas",
    codePostal: "34480",
    distanceMin: 8,
    distanceKm: 8,
    population: 2900,
    prixMoyenTerrainM2: 220,
    prixExempleConcurrence: [
      { surface: 500, prix: 110000 },
    ],
    atouts: [
      "Village viticole AOC Faugères à proximité",
      "Écoles, médiathèque, complexe sportif",
      "Cadre de vie nature, tissu commerçant local",
    ],
    intro:
      "Magalas, charmant village viticole à 8 minutes d'Espondeilhan, attire les familles cherchant le calme et la nature. Les rares terrains à bâtir s'y négocient autour de 110 000 €. Le Clos des Cocales offre la même proximité avec une grille tarifaire transparente dès 99 900 €.",
    faq: [
      {
        q: "Quels avantages d'acheter près de Magalas ?",
        a: "Magalas et Espondeilhan partagent un même bassin de vie : écoles, commerces, accès rapide à Béziers. Acheter au Clos des Cocales vous donne accès à toutes les commodités magalassiennes en 8 minutes.",
      },
    ],
  },
  {
    slug: "boujan-sur-libron",
    nom: "Boujan-sur-Libron",
    codePostal: "34760",
    distanceMin: 12,
    distanceKm: 12,
    population: 3500,
    prixMoyenTerrainM2: 290,
    prixExempleConcurrence: [
      { surface: 450, prix: 135000 },
    ],
    atouts: [
      "Commune en première couronne biterroise",
      "Écoles, crèche, équipements sportifs",
      "Accès rapide A9 et zone commerciale Béziers",
    ],
    intro:
      "Boujan-sur-Libron est très demandé pour sa proximité immédiate avec Béziers. Les terrains à bâtir y atteignent 135 000 € pour 450 m². À 12 minutes, Espondeilhan et Le Clos des Cocales offrent un cadre plus rural, des prix plus doux dès 99 900 €, tout en restant à portée immédiate des emplois biterrois.",
    faq: [
      {
        q: "Boujan-sur-Libron est-il bien desservi ?",
        a: "Oui, Boujan bénéficie d'un accès direct à l'A9 et à la zone commerciale de Béziers. Le Clos des Cocales se situe à 12 minutes, dans le même bassin de vie.",
      },
    ],
  },
  {
    slug: "lieuran-les-beziers",
    nom: "Lieuran-lès-Béziers",
    codePostal: "34290",
    distanceMin: 7,
    distanceKm: 6,
    population: 2200,
    prixMoyenTerrainM2: 230,
    prixExempleConcurrence: [
      { surface: 480, prix: 115000 },
    ],
    atouts: [
      "Village limitrophe d'Espondeilhan",
      "École primaire, périscolaire, complexe sportif",
      "Bassin viticole AOC Faugères",
    ],
    intro:
      "Lieuran-lès-Béziers et Espondeilhan partagent un bassin de vie commun : écoles, commerces, médecins. Les terrains constructibles à Lieuran sont rarissimes et coûtent autour de 115 000 €. Le Clos des Cocales, à 7 minutes, propose une offre étoffée et immédiate à partir de 99 900 €.",
    faq: [
      {
        q: "Peut-on scolariser les enfants à Lieuran depuis Espondeilhan ?",
        a: "Oui, plusieurs familles d'Espondeilhan inscrivent leurs enfants dans les écoles de Lieuran-lès-Béziers ou Servian, selon les places et le projet pédagogique. Les transports scolaires sont organisés.",
      },
    ],
  },
  {
    slug: "bassan",
    nom: "Bassan",
    codePostal: "34290",
    distanceMin: 6,
    distanceKm: 5,
    population: 1500,
    prixMoyenTerrainM2: 235,
    prixExempleConcurrence: [
      { surface: 400, prix: 110000 },
    ],
    atouts: [
      "Petit village authentique du vignoble biterrois",
      "École primaire, vie associative",
      "10 minutes de Béziers, 30 minutes des plages",
    ],
    intro:
      "Bassan, petit village voisin d'Espondeilhan (6 minutes), incarne l'authenticité du Languedoc rural. L'offre foncière y est très limitée. Le Clos des Cocales est l'opportunité de s'installer dans le même cadre, avec la sécurité d'un programme neuf à partir de 99 900 €.",
    faq: [
      {
        q: "Comment est la vie quotidienne à Espondeilhan ?",
        a: "Espondeilhan est un village d'environ 1 500 habitants avec école maternelle et primaire, commerces de proximité, médecins, et un cadre rural préservé entre vignes et garrigue. Béziers, Pézenas et la mer sont accessibles rapidement.",
      },
    ],
  },
  {
    slug: "coulobres",
    nom: "Coulobres",
    codePostal: "34290",
    distanceMin: 6,
    distanceKm: 5,
    population: 800,
    prixMoyenTerrainM2: 220,
    prixExempleConcurrence: [
      { surface: 600, prix: 120000 },
    ],
    atouts: [
      "Village de caractère du Pays de Béziers",
      "Cadre nature préservé, vignobles",
      "Accès rapide aux services de Servian et Béziers",
    ],
    intro:
      "Coulobres, village confidentiel à 6 minutes d'Espondeilhan, séduit ceux qui cherchent l'authenticité du Languedoc rural. Très peu de terrains s'y libèrent. Le Clos des Cocales propose 29 lots viabilisés dès 99 900 € dans le même bassin paisible.",
    faq: [
      {
        q: "Coulobres est-il bien situé pour travailler à Béziers ?",
        a: "Oui, Coulobres et Espondeilhan se trouvent à 15-20 minutes du centre de Béziers. C'est un compromis idéal entre la tranquillité d'un village et l'accès aux emplois urbains.",
      },
    ],
  },
];

export const getCommune = (slug: string): Commune | undefined =>
  COMMUNES.find((c) => c.slug === slug);
