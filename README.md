# BIOMYR — Landing cinématique

Nouvelle version premium du site BIOMYR : une **expérience pilotée par le scroll**.
Un arbre à 4 branches (les 4 axes de l'entreprise) grandit et fleurit au fil du défilement,
dans une forêt macro réaliste. Rendu sur `<canvas>` (séquence de 144 frames), sans vidéo HTML.

## Stack
- **Next.js 15** + **React 19**
- **Framer Motion** (apparition des sections)
- Canvas + rendu piloté par le scroll (requestAnimationFrame pour le lissage)
- Typographies **Playfair Display** + **Inter**
- Charte BIOMYR : vert `#4DBD4D`, vert profond `#0E3F1F`, fond `#070F0A`, doré `#8A6D1A`

## Lancer en local
```bash
npm install
npm run dev
```
Puis ouvrir **http://localhost:3000** et scroller.

## Build de production
```bash
npm run build
npm start
```

## Structure
- `app/` — layout, page, styles globaux
- `components/Cinematic.tsx` — moteur canvas + scroll + panneaux
- `lib/content.ts` — textes et contenu éditorial
- `public/frames/` — 144 frames de la séquence
- `public/stills/` — 7 images clés

## Sections
Hero · Produit physique (VÉYÈR) · Produit digital (Agronomie digitale) ·
Accompagnement (Ingénierie & études) · Transfert de connaissance (BIOMYR Académie) ·
Qui sommes-nous · CTA final
