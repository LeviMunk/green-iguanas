# TableOS → Green Iguanas: proposed event contract, v1.0

**Status: documentation only. Nothing here is installed in TableOS.** The existing combat manager, Dice Ledger, event collector, database, and private network remain unchanged.

## Boundary

TableOS continues to be authoritative for live gameplay. Green Iguanas is a downstream, asynchronous archive. No Green Iguanas action can write to TableOS. Its backend never needs public inbound access to TableOS.

**Recommended transport:** a future, explicitly authorized TableOS-side outbound exporter sends batches via HTTPS to a secured Supabase Edge Function (or Cloudflare Worker). A secondary workflow imports signed/validated JSON files by a DM. The exporter must read from an existing verified event history, not scrape ephemeral UI events.

## Envelope

`examples/roll-event.json` contains a deliberately synthetic example. The browser's local Dice Chronicle import accepts `{ "events": [...] }` or a direct array. Production ingestion additionally enforces authentication, source ownership and idempotence.

| Field | Rule |
|---|---|
| `schema_version` | Exactly `1.0` |
| `event_id` | Stable across retries; never a new random ID each send |
| `source` | Known sender (for example `tableos`) |
| `occurred_at` | Original UTC or offset-aware timestamp, never import time |
| `campaign_external_id` | `green-iguanas` for this project |
| `session_external_id` | Stable TableOS session identifier, or `null` for explicitly unmatched |
| `character_external_id` | Stable mapped character identifier |
| `roll_type` | `attack`, `ability_check`, `saving_throw`, `other` |
| `dice` | Array of `{sides, face, kept}`; includes discarded advantage/disadvantage dice |
| `modifier_total` | Integer sum of numeric modifiers applied to **kept** dice |
| `total` | Integer final total; equals sum of `kept` faces plus `modifier_total` |
| `critical_hit` | `true`, `false` or `null`; never infer a confirmed crit from a non-attack natural 20 |
| `visibility` | `public`, `members`, `dm`; server policies decide what can actually be read |

If a complex D&D Beyond expression cannot be represented honestly (rerolls, percentile modifiers, chosen dice, nested calculations), quarantine it for review rather than silently rewriting it. Extend the versioned schema before supporting such events.

## Ingestion safety

1. Exporter reads a durable event record and assigns `source + event_id` consistently. Avoid using receipt timestamp as ID.
2. Batch includes signed authentication (server-held secret or scoped token), and supports idempotent retries with exponential backoff. Do not put credentials in browser JavaScript.
3. Edge function validates version, timestamps, character mapping, dice faces/kept flags/total, request size, visibility, source authorization, and optional revision number.
4. Database stores `(source, event_id)` under a unique constraint. Replayed identical events are acknowledged without duplicate insertion. Conflicting revisions are quarantined, never silently overwritten.
5. Preserve both `occurred_at` and `ingested_at`, plus raw source payload and a processing status. Maintain an import cursor/watermark for backfills.
6. Unmatched sessions/characters go to a correction queue, not arbitrary characters. Reconciliation history must be audited.
7. User-facing stats derive from retained raw d20 faces. A natural 20 is a face, not a guarantee of a critical hit; critical attacks are counted separately.
8. Privileged ingestion endpoint must only be reachable by the exporter, not anonymous users. Rate-limit and log failures; redact secrets.

## Privacy and lifecycle

- Group members see only published data allowed by database policies.
- DM-only events never ship in static HTML/JSON, public GitHub commits or PWA caches.
- Player journal visibility is independent of roll visibility.
- DM can correct event mapping using audited revisions, preserving original source event.
- Use explicit retention, backup and deletion rules before launch.
- Backfill is a one-way historical read with previews and a dry run; require DM approval before importing anything real.

## Approval gates

**Do not touch TableOS** until: (a) actual source schema and event examples are inspected, (b) DM approves exporter code and data scope, (c) Supabase or alternative backend and row-level policies are deployed and tested, and (d) a small dry-run confirms no combat-side effects.
