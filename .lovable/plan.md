## Le Clos des Cocales — Landing Page de Conversion

A single, beautifully designed French landing page promoting the **Le Clos des Cocales** building-plot development (terrains à bâtir) in **Espondeilhan, Hérault**, optimized for primary-residence buyers searching to build their home near Béziers.

### What we're working with (extracted from source)

- **Produit**: Lotissement / terrains viabilisés prêts à construire
- **Lieu**: Espondeilhan (34) — village héraultais, 15 min de Béziers
- **Surfaces**: de 239 m² à 835 m²
- **Prix**: à partir de **99 900 €**
- **Atouts uniques**: frais de notaire réduits 3 %, exonération de la part communale de taxe d'aménagement, frais annexes 2 730 €, livraison immédiate
- **Stock**: ~30 lots disponibles (le reste réservé) — réelle urgence à exploiter

### Audience & messaging angle (CRO)

Cible principale : **familles & primo-accédants** voulant construire leur résidence principale dans l'Hérault. Mots-clés à fort intent (recherche FR) :
- « terrain à bâtir Hérault / Béziers / Espondeilhan »
- « lotissement viabilisé »
- « construire sa maison près de Béziers »
- « terrain constructible avec frais de notaire réduits »

Messages d'accroche centraux :
1. *Construisez votre maison là où il fait bon vivre* (lifestyle)
2. *Frais de notaire réduits à 3 %* (avantage financier concret)
3. *Plus que X lots disponibles* (rareté)

### Page structure (one focused scrollable page)

```text
1. Sticky Header — logo, tél., bouton "Réserver une visite"
2. Hero — image du site, H1, prix de départ, 2 CTA (form + appel)
3. Bandeau de réassurance — 4 chiffres clés (à partir de 99 900 €,
   239–835 m², 15 min Béziers, frais notaire 3 %)
4. Pourquoi Espondeilhan — village, vignes, garrigue, écoles, commerces
5. Les atouts du lotissement — 6 cartes (viabilisé, frais réduits,
   exonération taxe d'aménagement, livraison immédiate, etc.)
6. Galerie — 3 photos du programme
7. Lots disponibles — tableau filtrable/triable + badge "Disponible"
   ou "Option", bouton "Je m'intéresse à ce lot" qui pré-remplit le form
8. Localisation — carte (image OpenStreetMap statique) + accès
9. Étapes de votre projet — timeline 4 étapes (visite → réservation →
   signature → construction)
10. FAQ — 6 questions (frais, délai, viabilisation, financement,
    construction libre du constructeur, exonération fiscale)
11. Bloc contact final — formulaire + tél + WhatsApp côte à côte
12. Footer — mentions, contact, lien source
13. Bouton flottant mobile — Appeler / WhatsApp toujours visible
```

### Lead capture (form + call/WhatsApp)

- **Formulaire** (validé client + serveur via Zod) : nom, email, téléphone, lot d'intérêt (select pré-rempli depuis le tableau), message, consentement RGPD.
- **Soumission** : appel d'une edge function Lovable Cloud qui (a) enregistre la demande dans la base, (b) envoie un email de notification via Resend à l'adresse de votre uncle.
- **Boutons directs** : `tel:` et `https://wa.me/...` — collent à l'écran sur mobile pour conversion immédiate.

### Visual direction — Modern & airy

- Palette : blanc cassé / crème, vert sauge profond (rappel garrigue/vignes), accent terracotta doux pour CTA
- Typo : sans-serif moderne (Inter) pour le corps, serif élégant (Fraunces) pour les titres → équilibre confiance + modernité
- Beaucoup de respiration, photos pleine largeur, cartes avec ombres douces, micro-animations au scroll
- Mobile-first, performant

### Technical details

- **Stack** : React + Vite + Tailwind + shadcn/ui (déjà en place)
- **Design system** : tokens HSL ajoutés à `index.css` + `tailwind.config.ts` (palette sauge/crème/terracotta, polices Google Fonts)
- **Backend** : Lovable Cloud activé → table `leads` (RLS public-insert), edge function `send-lead-notification` (Resend pour l'email)
- **Secrets nécessaires** : `RESEND_API_KEY` + adresse email de destination (à demander après validation)
- **WhatsApp/Tel** : numéro à fournir par votre uncle (placeholder en attendant)
- **SEO** : balises meta FR optimisées (title, description, OG), schema.org `RealEstateListing`, lang="fr"
- **Conformité** : checkbox RGPD obligatoire, lien vers politique de confidentialité (page placeholder)

### Ce dont j'aurai besoin de votre côté après validation

1. Numéro de téléphone et WhatsApp de votre uncle
2. Adresse email où recevoir les leads
3. Création d'un compte Resend gratuit pour l'envoi d'emails (je vous guide)

Si l'un de ces éléments n'est pas prêt, je mettrai des placeholders clairs et vous pourrez les remplacer en un message.
