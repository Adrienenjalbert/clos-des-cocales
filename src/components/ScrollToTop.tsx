import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolle en haut de la page à chaque changement de route.
 * Respecte les ancres (#section) si présentes dans l'URL.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // laisser le navigateur gérer l'ancre
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};
