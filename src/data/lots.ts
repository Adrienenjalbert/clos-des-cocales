// Source: https://www.sudimmocatalogue.fr/programmes/le-clos-des-cocales/
export type LotStatus = "Disponible" | "Option" | "Réservé" | "Vendu";

export interface Lot {
  numero: number;
  surface: number; // terrain m²
  sp: number; // surface plancher m²
  prix: number | null;
  statut: LotStatus;
}

export const LOTS: Lot[] = [
  { numero: 16, surface: 443, sp: 140, prix: 116900, statut: "Disponible" },
  { numero: 18, surface: 508, sp: 160, prix: 130500, statut: "Disponible" },
  { numero: 24, surface: 361, sp: 140, prix: 104900, statut: "Disponible" },
  { numero: 25, surface: 340, sp: 130, prix: 99900, statut: "Disponible" },
  { numero: 26, surface: 340, sp: 160, prix: 99900, statut: "Disponible" },
  { numero: 27, surface: 340, sp: 160, prix: 99900, statut: "Disponible" },
  { numero: 28, surface: 342, sp: 160, prix: 99900, statut: "Disponible" },
  { numero: 29, surface: 346, sp: 160, prix: 99900, statut: "Disponible" },
  { numero: 30, surface: 461, sp: 220, prix: 120900, statut: "Disponible" },
  { numero: 31, surface: 832, sp: 400, prix: 189900, statut: "Disponible" },
  { numero: 34, surface: 562, sp: 270, prix: 158900, statut: "Disponible" },
  { numero: 37, surface: 335, sp: 170, prix: 101500, statut: "Disponible" },
  { numero: 39, surface: 345, sp: 170, prix: 102900, statut: "Disponible" },
  { numero: 40, surface: 350, sp: 130, prix: 101500, statut: "Disponible" },
  { numero: 41, surface: 453, sp: 160, prix: 120900, statut: "Disponible" },
  { numero: 42, surface: 515, sp: 200, prix: 132900, statut: "Disponible" },
  { numero: 43, surface: 380, sp: 150, prix: 107900, statut: "Disponible" },
  { numero: 44, surface: 367, sp: 140, prix: 105900, statut: "Disponible" },
  { numero: 45, surface: 551, sp: 200, prix: 143400, statut: "Disponible" },
  { numero: 46, surface: 477, sp: 170, prix: 125500, statut: "Disponible" },
  { numero: 47, surface: 519, sp: 200, prix: 133500, statut: "Disponible" },
  { numero: 48, surface: 341, sp: 140, prix: 101900, statut: "Option" },
  { numero: 49, surface: 340, sp: 140, prix: 101700, statut: "Disponible" },
  { numero: 50, surface: 446, sp: 170, prix: 118500, statut: "Disponible" },
  { numero: 51, surface: 423, sp: 170, prix: 116900, statut: "Disponible" },
  { numero: 52, surface: 357, sp: 150, prix: 104900, statut: "Disponible" },
  { numero: 59, surface: 443, sp: 170, prix: 118900, statut: "Disponible" },
  { numero: 60, surface: 377, sp: 150, prix: 105900, statut: "Disponible" },
  { numero: 61, surface: 385, sp: 150, prix: 105900, statut: "Disponible" },
];

export const LOTS_DISPONIBLES = LOTS.filter((l) => l.statut === "Disponible").length;

export const formatPrix = (prix: number | null) =>
  prix === null
    ? "—"
    : new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(prix);
