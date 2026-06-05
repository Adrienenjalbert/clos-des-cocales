
## Objectifs

1. **Repositionner** le site sur la cible "à 40 min de Montpellier" (au lieu de Béziers en priorité)
2. **Simplifier** : retirer les comparatifs prix/villages, accroche unique "dès 92 500 €"
3. **Nouvelle direction visuelle** anthracite + blanc cassé + doré discret (premium immobilier)
4. **Intégrer le plan de masse** uploadé comme pièce maîtresse
5. **Créer une vraie brochure PDF** + page web `/brochure`
6. Optimisations CRO basées sur ce que cherche la cible (acheteurs particuliers Montpellier/Hérault)

---

## 1. Repositionnement géographique (Montpellier-first)

Espondeilhan est à ~50 min de Montpellier en réalité, mais à 40 min par A75/A9 c'est crédible pour la périphérie ouest. On garde Béziers (15 min) comme atout secondaire.

- **Hero H1** : "Votre terrain à bâtir à 40 min de Montpellier — dès 92 500 €"
- **Sous-titre** : "29 lots viabilisés au cœur du Languedoc, entre Béziers (15 min) et la mer (25 min)"
- Ajouter un bloc "Distances" clair : Montpellier 40 min · Béziers 15 min · Plages 25 min · Pézenas 20 min
- Mettre à jour `src/data/communes.ts` pour prioriser Montpellier dans les LP Google Ads
- Mettre à jour le CSV Google Ads pour avoir un ad group "Montpellier ouest / périurbain" en tête

## 2. Simplification du site

**À supprimer / dégonfler :**
- `CommunesCompareBanner.tsx` (comparatif villages) → retiré du Index
- Section "Comparatif marché" sur les LP (`LandingAds.tsx` — bloc `!isGeneric && ...`) → retiré
- `Testimonials.tsx` si présent et non authentique → vérifier, retirer si fake
- Réduire `Atouts` à 3 piliers max au lieu de 6

**À garder/renforcer :**
- Hero, lots disponibles, plan de masse (nouveau), localisation, FAQ, contact

## 3. Prix d'appel "dès 92 500 €"

- Ne PAS modifier `src/data/lots.ts` (prix réel mini reste 99 900 €)
- Afficher uniquement en accroche marketing dans Hero + LP + meta description
- **Mention légale discrète** sous le prix : "Tarif promotionnel ponctuel — voir conditions"
- Le tableau des lots affiche les vrais prix (99 900 €+)
- Note : recommandation légale — un vrai lot à 92 500 € serait plus safe juridiquement. Le client a tranché pour "accroche marketing", j'applique mais j'avertis.

## 4. Nouvelle palette anthracite / blanc cassé / doré

Réécriture complète de `src/index.css` (tokens HSL) + `tailwind.config.ts` :

| Token | Valeur | Usage |
|---|---|---|
| `--background` | `#FAFAF7` (blanc cassé chaud) | Fond global |
| `--foreground` | `#1A1D24` (anthracite profond) | Texte principal |
| `--primary` | `#1A1D24` | CTA, hero gradient |
| `--accent` | `#B89968` (doré champagne mat) | Accents, prix, badges |
| `--muted` | `#F0EEE8` | Cartes secondaires |
| `--border` | `#E5E2D9` | Bordures discrètes |
| `--gradient-hero` | anthracite → noir profond avec overlay 50% | Hero |

- Email templates `send-lead-emails/index.ts` recolorés
- Nouveau logo "CC" en doré sur anthracite (régénération `logo-cc.png`)
- Favicon mis à jour

## 5. Intégration du plan de masse

- Convertir le PDF en image PNG haute résolution (le PDF original reste téléchargeable)
- Upload via `lovable-assets` : `src/assets/plan-de-masse.png.asset.json` + `src/assets/plan-de-masse.pdf.asset.json`
- **Nouvelle section** `<PlanDeMasse />` sur Index + page Programme :
  - Image cliquable avec zoom (Dialog plein écran)
  - Bouton "Télécharger le plan PDF"
  - Légende : statut visuel (disponible / option / réservé) superposé sur les lots
  - CTA : "Choisir mon lot · Demander la brochure"

## 6. Brochure PDF + page `/brochure`

**Page web `/brochure`** (`src/pages/Brochure.tsx`) :
- Layout magazine premium (anthracite/doré)
- Sections : Le projet · Plan de masse · Liste lots & prix · Localisation · Équipement · Étapes d'achat · Contact
- CTA permanent en sticky : "Télécharger PDF"

**PDF généré** (`/mnt/documents/brochure-clos-des-cocales.pdf`) :
- 6 pages A4, typographie sobre, photo + plan
- Page 1 : couverture (titre, prix d'appel, photo)
- Page 2 : Le projet + localisation (Montpellier 40 min)
- Page 3-4 : Plan de masse pleine page + légende
- Page 5 : Tableau des lots disponibles avec prix
- Page 6 : Étapes + contact + QR code vers `/brochure`
- Hébergé en asset CDN (`src/assets/brochure.pdf.asset.json`)
- Envoyé en pièce jointe dans `send-lead-emails` Edge Function (au lieu d'un simple lien)

## 7. Optimisations CRO additionnelles (ce que cherche la cible)

Recherches utilisateur pour acheteurs primo-accédants/famille Hérault-Montpellier :
- **Budget total** : ils veulent comprendre terrain + maison + frais → enrichir `BudgetTotal.tsx` avec exemples concrets "Maison 90m² + terrain 350m² = ~270 000 € total"
- **Constructeurs** : page courte listant 3-5 constructeurs locaux partenaires (ou neutre : "libre choix du constructeur")
- **Étapes achat** : timeline visuelle 4 étapes (réservation 5%, compromis, prêt, signature)
- **Prêt à taux zéro** : info-bloc visible (Espondeilhan = zone B2, PTZ éligible)
- **Visite virtuelle/photos quartier** : carrousel photos environnement (village, école, commerces) — uniquement si on a des vraies photos
- **Réassurance** : promoteur (Sudimmo), garanties, livraison immédiate, viabilisation détaillée

**Quick wins UX :**
- Sticky CTA desktop simplifié : "Brochure · Visite · Appel"
- Form contact : pré-remplir lot si arrivée depuis tableau
- Confirmation lead : afficher numéro WhatsApp direct + tel cliquable

## 8. Recherche concurrence (Firecrawl + Semrush)

Avant d'implémenter le design, scraper 3-4 sites du secteur (lotissements neufs Hérault/Occitanie) pour valider la direction graphique :
- `sudimmocatalogue.fr` (promoteur)
- 2 sites identifiés via SERP `lotissement neuf hérault` / `terrain a batir occitanie`
- Extraire palette, typo, structure via Firecrawl `branding` format
- Comparer keywords via Semrush `competitive_analysis`

Si insights pertinents, ajuster avant build.

---

## Détails techniques

**Fichiers modifiés :**
- `src/index.css` — nouveaux tokens HSL anthracite/doré
- `src/components/landing/Hero.tsx` — H1 Montpellier, "dès 92 500 €"
- `src/components/landing/Atouts.tsx` — réduit à 3 piliers
- `src/components/landing/Localisation.tsx` — Montpellier en tête
- `src/pages/Index.tsx` — retire CommunesCompareBanner, ajoute PlanDeMasse
- `src/pages/LandingAds.tsx` — retire bloc comparatif, "dès 92 500 €"
- `src/data/communes.ts` — réordonner, montpellier prioritaire
- `src/components/layout/SiteHeader.tsx` — nouveau logo
- `supabase/functions/send-lead-emails/index.ts` — recolor + pièce jointe brochure PDF
- `index.html` — meta description + favicon
- `google-ads-clos-des-cocales.csv` — ad group Montpellier prioritaire

**Fichiers créés :**
- `src/components/landing/PlanDeMasse.tsx` — nouvelle section
- `src/pages/Brochure.tsx` — page web brochure
- `src/assets/plan-de-masse.png.asset.json` — image plan via CDN
- `src/assets/plan-de-masse.pdf.asset.json` — PDF téléchargeable
- `src/assets/brochure.pdf.asset.json` — brochure PDF générée
- `src/assets/logo-cc.png` — régénéré (doré sur anthracite)
- `public/favicon.png` — régénéré

**Ordre d'exécution :**
1. Recherche Firecrawl/Semrush concurrence (10 min)
2. Génération logo + extraction plan de masse en PNG haute def
3. Refonte tokens couleur (index.css + tailwind)
4. Simplification composants (Hero, Atouts, Index, LP)
5. Création PlanDeMasse + page Brochure
6. Génération PDF brochure (reportlab) + upload CDN
7. Update Edge Function (recolor + attach PDF)
8. QA visuelle (screenshots Hero + Brochure + PDF)
