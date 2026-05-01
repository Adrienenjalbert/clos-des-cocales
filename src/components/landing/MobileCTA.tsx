import { Phone, MessageCircle } from "lucide-react";
import { CONTACT, whatsappLink } from "@/config/contact";

export const MobileCTA = () => {
  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 flex gap-3">
      <a
        href={`tel:${CONTACT.phoneTel}`}
        className="flex-1 bg-primary text-primary-foreground rounded-full py-4 flex items-center justify-center gap-2 font-semibold shadow-cta"
      >
        <Phone className="w-5 h-5" />
        Appeler
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-accent text-accent-foreground rounded-full py-4 flex items-center justify-center gap-2 font-semibold shadow-cta"
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp
      </a>
    </div>
  );
};
