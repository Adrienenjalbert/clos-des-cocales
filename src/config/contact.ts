// Coordonnées de contact — à personnaliser
// Remplacez par vos vraies coordonnées
export const CONTACT = {
  phone: "+33 4 67 00 00 00", // <-- À REMPLACER
  phoneTel: "+33467000000",
  whatsapp: "33600000000", // <-- À REMPLACER (sans le +)
  email: "contact@clos-des-cocales.fr",
  programName: "Le Clos des Cocales",
  location: "Espondeilhan, Hérault (34)",
  sourceUrl: "https://www.sudimmocatalogue.fr/programmes/le-clos-des-cocales/",
};

export const whatsappLink = (message = "Bonjour, je suis intéressé par Le Clos des Cocales.") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
