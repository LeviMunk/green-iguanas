# Dragonbowl XLIX bracket and history

The public website deliberately separates **confirmed play**, **known upcoming pairing**, and **planning-record opening matchups whose actual outcomes remain unverified**.

## Current canonical public results

- Sixteen teams in the 49th tournament beneath Mount Waterdeep; original championship odds listed in `src/data/campaign.ts`.
- Green Iguanas beat Cackle Crew in Round One (the only match shown as completed).
- Green Iguanas versus Dandy War Dolls is the confirmed five-on-five quarterfinal pairing; **not played**.
- Other Round One pairings were listed in campaign planning materials, but their outcomes have **not been confirmed** as played. Do not use planned winners.
- Semifinal, final and champion remain unknown.
- Opening Green Iguanas tournament-winner odds are **100:1**. Never confuse these with match-specific odds or reprice existing tickets.
- The prize includes **500,000 gp** for surviving champions and Platinum Dragonbowl Rings.
- The party reaches level **7 only if it reaches the semifinals**.

## How to update the bracket

Edit `src/data/dragonbowl.ts`. For any completed match, require a confirmed actual-play result before setting `status:'final'` and `winner`. Update the corresponding next-round teams **only** once their advancement is known. If a bout is only scheduled, use `status:'upcoming'`, `winner:null`. If the pairing is drawn but the result isn't on record, use `status:'unverified'`.

Re-run `npm test` and `npm run build`; commit and push to the default branch to deploy to GitHub Pages.

**Player safety:** The private campaign master includes future scenarios, planned victories, NPC mysteries and possible plot paths that are not established as real events. Never expose those notes or link the DM document from this public website. The public history section includes only established tournament context and played milestones, not DM preparation.

The UI uses a horizontal-scroll bracket with keyboard-accessible round navigation, accessible result labels and explicit data states. There is no online match editor; this is a static published bracket.
