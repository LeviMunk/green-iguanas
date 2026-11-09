import type { RollEvent, RollKind } from '../lib/dice';
// Fully fictitious illustrations, never automatically shown as campaign facts.
// These exist solely to exercise the client-only Dice Chronicle interface.
const faces = [17,4,12,20,8,15,9,1,18,11,6,14,20,3,13,7,16,10,5,19];
const ids = ['bobby-kills','indigo','owen','freed','heilbrun'];
const types: RollKind[] = ['attack','ability_check','saving_throw','other'];
export const demoRolls: RollEvent[] = faces.map((face, i) => {
  const roll_type = types[i % types.length];
  return {
    schema_version: '1.0', event_id: `DEMONSTRATION-ONLY-${String(i + 1).padStart(3,'0')}`,
    source: 'demonstration', occurred_at: new Date(Date.UTC(2026, 9, 10 + i, 18, 30)).toISOString(),
    campaign_external_id: 'green-iguanas', session_external_id: 'DEMO-SESSION',
    character_external_id: ids[i % ids.length], roll_type,
    dice: [{ sides: 20, face, kept: true }], modifier_total: 3,
    total: face + 3, critical_hit: roll_type === 'attack' && face === 20, visibility: 'members'
  };
});
