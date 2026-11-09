/* Read-only checks for data that will be publicly served by GitHub Pages. */
import { readFileSync } from 'node:fs';
const root = new URL('../public/data/', import.meta.url);
const json = filename => JSON.parse(readFileSync(new URL(filename, root), 'utf8'));
const rolls = json('rolls.json');
if (!Array.isArray(rolls)) throw new Error('rolls.json must be an array');
const seen = new Set();
for (const r of rolls) {
  if (r.visibility !== 'public') throw new Error('Non-public roll in public/ directory: '+(r.event_id||'unknown'));
  if (!r.event_id || seen.has(r.event_id)) throw new Error('Missing or duplicate roll event_id');
  seen.add(r.event_id);
}
const content = json('content.json');
for (const key of ['sessions','npcs','quests','dragonbowlMatches','achievements']) {
  if (!Array.isArray(content[key])) throw new Error(`${key} must be an array in content.json`);
  for (const x of content[key]) if (x?.visibility && x.visibility !== 'public') throw new Error(`Non-public ${key} record`);
}
console.log(`Public content verified: ${rolls.length} rolls, ${content.sessions.length} sessions, ${content.achievements.length} achievements.`);
