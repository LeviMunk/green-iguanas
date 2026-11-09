# The Green Iguanas — The Living Chronicle

**TableOS runs the game. Green Iguanas preserves the adventure.**

Premium mobile-first D&D campaign companion: React, TypeScript, Vite, Tailwind, GitHub Pages, static JSON archives and PWA support. There is **no Supabase, hosted database, or player-account requirement** in this release.

## Current state

- Cinematic homepage with recent-session slot and five real character names
- Character gallery / dossiers with grayscale-to-color portrait hover/focus effects (artwork not yet supplied)
- Verified PDF snapshot fields in character profiles (blank until a D&D Beyond PDF is reviewed)
- Dice Chronicle with demo/import modes and automatic reading of approved `public/data/rolls.json`
- Adventure Journal, campaign encyclopedia, Dragonbowl and achievements archive pages powered by `public/data/content.json` (currently empty)
- Android/iOS installability foundation (manifest, icon, service worker) and responsive navigation
- Automated GitHub Actions tests, public content checks, Vite build and GitHub Pages deploy

**Not implemented:** PDF auto-parser/publisher, NPC relationship graph, automatic achievement evaluation, tournament-bracket editor, private journals, player login, automatic TableOS export. These are future integrations, not features claimed as complete.

## First deployment

1. Create a **new public repository** named `green-iguanas` at https://github.com/new, owned by `LeviMunk`. Do not create a README or other starter files. Do not use `levimunk.github.io` (the separate portfolio repository).
2. On your computer extract this project zip. Enter the inner `green-iguanas` folder that contains `package.json`.
3. Run these commands from that folder using a terminal (compatible with **fish**):

```fish
 git init -b main
 git add .
 git commit -m "Launch Green Iguanas campaign companion"
 git remote add origin https://github.com/LeviMunk/green-iguanas.git
 git push -u origin main
```

You must be authenticated to GitHub from your terminal for `git push` to succeed. Alternatively, upload all extracted files through the repository's GitHub web UI, ensuring the hidden `.github/workflows/deploy.yml` file is included.

4. Open repository **Settings → Pages → Build and deployment → Source: GitHub Actions**. Wait until the `Test and deploy Green Iguanas` workflow completes successfully.
5. The resulting address should be **https://levimunk.github.io/green-iguanas/**. This address is not live until the deployment succeeds.

### Local development

Requires Node.js 22 or later and npm registry access:

```fish
npm install
npm test
npm run build
npm run dev
```

In the environment that prepared this release, npm registry downloads failed due to DNS/network restrictions; therefore a complete Vite production build was **not verified locally**. All eight existing dice-unit tests and the public-content structural/visibility check passed. GitHub Actions will be the first full build verification.

## Updating site content

- Characters & optional PDF snapshot fields: `src/data/campaign.ts`
- Latest recaps, NPCs, quests, matches, achievements: `public/data/content.json`
- Public dice events: `public/data/rolls.json`
- Original approved portraits: `public/art/` and add `portrait` to matching character record

See **[How to update after a session](docs/how-to-update.md)** for the end-to-end workflow, including D&D Beyond PDF exports and transcript-driven recap publishing.

## Notes

- Until authentication exists, **all committed site data must be safe for everyone to see**. Never commit DM spoilers, secrets, private names or full unreviewed transcripts/PDFs.
- The supplied character roster is real; no character classes, mechanical values, portraits or campaign achievements have been fabricated.
- This is an independent fan-made companion, not endorsed by Wizards of the Coast or D&D Beyond.
- The proposed TableOS integration is **read-only and has not been connected**. Existing TableOS and combat systems have not been changed.
