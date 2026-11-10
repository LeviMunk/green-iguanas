# Green Iguanas — Cinematic Fellowship Release

The existing Vite/React campaign companion has been enhanced, not replaced.

## New
- Five verified campaign character illustrations, individually optimized for the web in `public/art/*.webp`.
- Freed has a glowing red **right** eye in the left-hand visor opening (viewer perspective). The other eye remains dark.
- The finished transparent green crest is in `public/art/crest.webp`, used as the site's brand mark and hero crest.
- Interactive full-width cinematic homepage, separate character layers, responsive highlight transitions, keyboard focus, accessible selection controls and mobile swipe/selection.
- Offline app-shell now precaches optimized character art and crest.
- Existing Party, Dice Chronicle, character dossiers, Archive, Dragonbowl, and JSON content are preserved.
- Character statistics, biographies and D&D Beyond URLs are still blank until verified.

## Preview
Open `visual-preview.html` locally to preview the home hero without a Node build. It includes the character interactions and main styling, but is not a complete React app.

## Install into GitHub
1. Download `Green-Iguanas-Cinematic-Update.zip` to your Linux machine's Downloads folder.
2. Extract into a **fresh clone** of `https://github.com/LeviMunk/green-iguanas`. This avoids overwriting the existing `design/awwwards-upgrade` branch or audit files.
3. Commit and push the changed files to `main`, or use the accompanying Fish-shell deployment script (provided separately).

GitHub Actions will run its normal tests and production build before publishing to GitHub Pages.

## Integrity
No TableOS code/data changes, no D&D Beyond scraping, no invented character-sheet statistics or achievements. Public data remains static JSON. Preserve `.gitignore` and authentication discipline.

## Browser QA targets
320px, 390px, 768px, 1440px, Firefox and Chromium, keyboard focus, reduced motion, mobile tapping. Browser screenshot QA couldn't be completed in the packaging environment (navigation was blocked by the local browser runtime). Production build not independently verified here; TSX syntax transpilation and all 8 existing dice tests passed.
