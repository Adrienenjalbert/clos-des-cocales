## Objectif

Remplacer le tri unique (un seul critère à la fois) du tableau des lots par un **tri multi-critères ordonné** (ex. : trier d'abord par prix croissant, puis par surface décroissante en cas d'égalité), avec une UI claire et lisible.

## Comportement utilisateur

1. Au clic sur l'en-tête d'une colonne triable (Lot, Surface, SP max, Prix) :
   - 1er clic : ajoute la colonne à la pile de tri en `asc`.
   - 2e clic : bascule en `desc`.
   - 3e clic : retire la colonne de la pile.
2. Un **petit badge numéroté** (1, 2, 3…) apparaît à côté de la flèche de tri pour montrer l'ordre de priorité.
3. Au-dessus du tableau, une **barre "Trié par"** affiche les critères actifs sous forme de chips réordonnables :
   - Chaque chip montre `1. Prix ↑`, `2. Surface ↓`, etc.
   - Boutons sur chaque chip : flèches ◀ ▶ pour changer la priorité, ⇅ pour inverser asc/desc, ✕ pour retirer.
   - Bouton "Réinitialiser le tri" qui remet le défaut (`prix asc`).
4. Tri par défaut au chargement : `[{ key: "prix", dir: "asc" }]` (inchangé).
5. La logique de filtres / recherche / export CSV n'est pas modifiée — l'export reflète l'ordre multi-critères affiché.

## Détails techniques

Fichier modifié : `src/components/landing/LotsTable.tsx`

- Remplacer `sortBy: SortKey` + `sortDir: SortDir` par :
  ```ts
  type SortRule = { key: SortKey; dir: SortDir };
  const [sortRules, setSortRules] = useState<SortRule[]>([{ key: "prix", dir: "asc" }]);
  ```
- Nouvelle fonction `handleSort(key)` :
  - Si la clé n'est pas dans `sortRules` → l'ajouter en fin avec `dir: "asc"`.
  - Si elle y est en `asc` → passer en `desc`.
  - Si elle y est en `desc` → la retirer.
- Tri dans `useMemo` :
  ```ts
  arr.sort((a, b) => {
    for (const { key, dir } of sortRules) {
      const av = (a[key] ?? 0) as number;
      const bv = (b[key] ?? 0) as number;
      if (av !== bv) return dir === "asc" ? av - bv : bv - av;
    }
    return 0;
  });
  ```
- `SortableTh` : afficher la flèche + un badge rond avec le numéro d'ordre (`sortRules.findIndex(...) + 1`) si la colonne est dans la pile. Si une seule règle active, le badge peut rester masqué pour ne pas alourdir.
- Nouveau composant inline `SortChips` placé juste au-dessus du compteur de résultats, visible seulement si `sortRules.length > 0`. Utilise les composants shadcn déjà présents (`Button`) + lucide-react (`ChevronLeft`, `ChevronRight`, `ArrowUpDown`, `X`).
- Ajouter helpers : `moveRule(index, dir)`, `toggleRuleDir(index)`, `removeRule(index)`, `resetSort()`.
- Libellés FR des colonnes pour les chips : `{ numero: "Lot", surface: "Surface", sp: "SP max", prix: "Prix" }`.

## Hors scope

- Pas de changement du schéma de données ni des filtres existants (prix, surface, statut, recherche).
- Pas de persistance du tri (localStorage) — peut être ajouté plus tard si besoin.
