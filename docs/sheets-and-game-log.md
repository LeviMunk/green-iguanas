# Green Iguanas | D&D Beyond sheets, Game Log & achievements

## Current state

The campaign companion is **static, hosted on GitHub Pages**. No Supabase, player accounts or external service are needed for character dossiers, published game events and calculated trophies.

- Character backgrounds are in `src/data/campaign.ts`; player-supplied story is distinguished from draft/concept notes.
- Each character has a dedicated **D&D Beyond Sheet** tab and a **Dice & Achievements** tab.
- Verified, **public-only** events are loaded from `public/data/rolls.json`. This file is currently empty. A browser-only demo/import remains a separate, unverified preview.
- Played story milestones are entered by the DM in `public/data/content.json` with a `characterId`.
- Dice trophies unlock automatically from validated event records after these are **published**. They never derive from demonstration data or an imported preview.
- The `#/journal` route is the existing *Previously, in the Green Iguanas* chronology. No duplicate numbered session recap page is required.

## Attach the living character sheet

A player or DM supplies the actual public/shareable D&D Beyond character URL (do not guess it). In the matching character object in `src/data/campaign.ts`, replace `beyondUrl:null` with the approved URL, e.g. a **real link they provided**.

The site links to D&D Beyond rather than pretending to render its internal live stats or sync without authorization. D&D Beyond may require viewers to log in or have link access.

## Attach a reviewed PDF export

1. Download the character PDF from D&D Beyond after the session.
2. Confirm its contents are safe to publish publicly; the entire `public/` directory is accessible on GitHub Pages.
3. Save to `public/sheets/<character-id>.pdf` (for example `public/sheets/owen.pdf`).
4. Set the character’s `sheetPdf` field to `sheets/owen.pdf`.
5. Optionally transcribe **verified** mechanical fields into `sheetSnapshot` with an accurate `asOf` date. Never infer stats from character class or level alone.
6. Commit and push to main. GitHub Actions tests and deploys the update.

The site shows a PDF placeholder until a file is attached. No direct PDF upload UI is claimed.

## Bring in D&D Beyond Game Log or RollWarden export

D&D Beyond has a shared Game Log for rolls from its sheets/app, Avrae, encounters and the Combat Tracker. RollWarden has separate local per-character statistics, Game Log history import, and JSON/CSV export features. **Neither automatically sends our website a public roll history**.

**Start with a real export sample.** Source-specific fields must be mapped truthfully to `docs/tableos-integration-contract.md` v1 event format, including:

- `event_id`: stable across retries/backfills; deduplicate before publishing.
- `occurred_at`: original timezone-aware event time.
- `character_external_id`: one of the five character IDs.
- `session_external_id`: recorded session key if available; otherwise null.
- `dice`: each raw die with `sides`, `face`, and `kept`, including dropped advantage dice.
- `modifier_total` and `total`: must reconcile exactly.
- `critical_hit`: explicit attack critical or null; do not infer from a check's natural 20.
- `visibility`: only `public` events go in `public/data/rolls.json`.

The Dice Chronicle accepts an array of these validated events for **local preview**, but browser imports are intentionally not written to GitHub or counted toward public achievements. Publish the reviewed event JSON to `public/data/rolls.json` for persistent character records.

RollWarden's own raw export schema has **not been verified** in this project. A faithful mapping adapter requires one actual sample; do not blindly rename fields or fake missing die faces.

## Trophy rules

The character’s Dice & Achievements tab calculates: first nat 20, first nat 1, 25 kept d20 faces, five nat 20s, first explicitly confirmed attack critical, and 50 verified roll events. All are shown as locked when no event data exists. Progress uses kept d20 faces only. This is a record of observed rolls, not proof of supernatural luck. In parallel, the DM can award played story achievements through `public/data/content.json`.

## Data boundaries

- Do not export `dm` or `members` visibility records to a public GitHub Pages JSON file.
- Do not alter the live TableOS database, event collector or combat system for this integration without explicit approval.
- Historical roll backfills should preserve original timestamps and event identifiers and undergo a dry run.
- Do not claim direct D&D Beyond or RollWarden automatic synchronization until a supported, tested export path exists.
