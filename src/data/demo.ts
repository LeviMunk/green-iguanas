import type { RollEvent, RollKind } from '../lib/dice';

// Fully fictitious, deterministic client-side fixture. It is never written to
// TableOS, public/data/rolls.json, campaign content, or achievements.
const ids = ['bobby-kills','indigo','owen','freed','heilbrun'] as const;
const types: RollKind[] = ['attack','ability_check','saving_throw','other'];
const faces = [17,4,12,20,8,15,9,1,18,11,6,14,20,3,13,7,16,10,5,19,2,20,1,18,9];
const modifiers = [5,3,2,1,4,6,0,-1,7,2,4,3,5,1,6,0,2,4,3,5,1,6,2,4,0];

export const demoRolls: RollEvent[] = Array.from({length:125}, (_, i) => {
  const roll_type = types[i % types.length], face = faces[i % faces.length], modifier_total = modifiers[i % modifiers.length];
  const advantage = i % 11 === 0, disadvantage = i % 13 === 0;
  const alternate = advantage ? Math.max(1, face - 4) : disadvantage ? Math.min(20, face + 5) : null;
  const dice = alternate === null ? [{sides:20,face,kept:true}] : [
    {sides:20,face,kept:true}, {sides:20,face:alternate,kept:false}
  ];
  return {
    schema_version:'1.0', event_id:`demo:green-iguanas:${String(i + 1).padStart(3,'0')}`,
    source:'synthetic-demo', occurred_at:new Date(Date.UTC(2026, 8 + Math.floor(i / 42), 4 + (i % 21), 18, 15 + (i % 4) * 10)).toISOString(),
    campaign_external_id:'green-iguanas', session_external_id:`demo-session-${1 + Math.floor(i / 25)}`,
    character_external_id:ids[i % ids.length], roll_type, dice, modifier_total, total:face + modifier_total,
    critical_hit:roll_type === 'attack' && face === 20, visibility:'public'
  };
});
