// Coordonnées de contact
export const CONTACT = {
  phone: "+33 6 83 42 13 66",
  phoneTel: "+33683421366",
  whatsapp: "33683421366",
  email: "s1tjm65@gmail.com",
  programName: "Le Clos des Cocales",
  location: "Avenue de la Mer, 34290 Espondeilhan, Hérault",
  address: "Avenue de la Mer, 34290 Espondeilhan",
  coords: { lat: 43.4394, lng: 3.2645 },
  sourceUrl: "https://www.sudimmocatalogue.fr/programmes/le-clos-des-cocales/",
};

export const whatsappLink = (message = "Bonjour, je suis intéressé par Le Clos des Cocales.") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
