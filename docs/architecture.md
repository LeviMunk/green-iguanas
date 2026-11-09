# Green Iguanas static-first architecture

## Deployed services

- Public website: GitHub Pages from a dedicated `green-iguanas` repository.
- Frontend: React + TypeScript + Vite, with custom cinematic styling and Tailwind tokens.
- Persisted published content: JSON files committed to GitHub (`public/data/`). All records here are public.
- Dice statistics: calculated in the browser, with optional locally imported JSON. No real-time service required.
- No database, accounts, API keys, backend, or live TableOS modifications.
- Automated CI/CD: GitHub Actions tests, validates public content file structure, builds the application, and deploys `dist`.
- PWA: Web App Manifest and service worker caching public app shell only.

## Current source

- `src/App.tsx`: hash routes, gallery, dossiers, Dice Chronicle, archive views.
- `src/data/campaign.ts`: verified character roster and optional sheet snapshots.
- `src/lib/dice.ts`: validated roll events, raw d20 faces, summaries.
- `src/lib/content.ts`: typed published archive records and read-only loader.
- `public/data/content.json`: published sessions, NPCs, quests, Dragonbowl matches, achievements.
- `public/data/rolls.json`: public approved dice events.

## Chosen tradeoffs

GitHub Pages cannot accept direct player edits or protect DM-only data. This is intentional: the initial site is a published campaign companion. The DM reviews and commits updates and players read them. GitHub Issues/PRs or a future backend could enable contributions, but are not presently implemented. A local transcription assistant can generate proposed content updates; the DM must approve before publishing.

## Later expansion

- D&D Beyond PDFs: extract structured data from uploaded form-fillable sheets in a controlled review flow; never guess unextracted stats or require D&D Beyond credentials.
- TableOS: separate read-only export, sanitize and authorize events, idempotently merge by event ID, then update JSON in GitHub through a bot/pull request. Do not expose TableOS to the internet.
- Achievements: evaluate typed, verified events (natural 20/1 counts, etc.). Combat feats require confirmed combat outcomes.
- Dragonbowl: structured opponents and matches with bracket visualization once source records exist.
- Optional private user data: only then consider an authenticated free-tier backend with server-side authorization. Do not preemptively adopt Supabase.
