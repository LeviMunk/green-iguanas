# Updating Green Iguanas after a session

The public website is a static GitHub Pages application. It does not require Supabase, accounts or a server.

## Updated D&D Beyond character sheets

1. In D&D Beyond, select the character's menu, then **Export to PDF**.
2. Export updated sheets for Bobby Kills, Indigo, Owen, Freed, and Heilbrun (only those who changed).
3. Upload them in the Green Iguanas ChatGPT project/conversation with a request to update the website's verified character records. This enables extraction and human review of the class, level, species, background and mechanical scores. **No automatic PDF-to-GitHub service is configured yet.**
4. After verifying the extracted fields, update `src/data/campaign.ts` (including the `sheetSnapshot` and its `asOf` date) and commit. The GitHub Actions workflow publishes the change.
5. Avoid committing the full PDFs unless everyone involved agrees to publish them: exported sheets can contain player names, notes and other information that should not be published unnecessarily.

D&D Beyond remains authoritative; this website stores only an approved snapshot of relevant facts. Changes never flow back to D&D Beyond.

## After-session recap publishing

1. Produce a transcript after the session using your existing process.
2. Prepare a recap and extract facts into **reviewable** records: session number/title/date/summary, NPCs, quests, and Dragonbowl results.
3. Verify names, speaker attribution, discoveries, and any confidential DM knowledge before release.
4. Add the reviewed records to `public/data/content.json`. CI runs a basic structure check and the public website picks up the new information after deployment.
5. Do not publish raw transcripts or unrevealed plot information. The website has no login or protected storage.

A content pipeline can later automate steps 1–2 and create a GitHub PR for DM approval. GitHub Pages cannot run transcription/AI processing itself.

## Dice Chronicle publication

Place an approved public roll-event JSON array in `public/data/rolls.json`. Every event must have `visibility: "public"` and a unique `event_id`. Commit it; the site loads it automatically. See `docs/tableos-integration-contract.md` for the proposed event schema. **Do not connect a live TableOS database until the event contract has been verified against the actual implementation.**

Public repository means public data: do not place DM-only events in `public/data`, even if the frontend hides them. CI checks basic record visibility but is not a substitute for reviewing exports.

## Live site URL

For the repository `LeviMunk/green-iguanas`, the intended GitHub Pages address is:

`https://levimunk.github.io/green-iguanas/`

It becomes live only after the repository exists, GitHub Pages is set to **GitHub Actions**, and the deployment workflow succeeds.
