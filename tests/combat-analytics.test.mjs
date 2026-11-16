import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCombatAnalytics, combatSummary } from '../src/lib/combat-analytics.ts';
import { demoCombatAnalytics } from '../src/data/demo-analytics.ts';
test('demo combat facts are schema-valid, deterministic, and cover every hero',()=>{
 const events=validateCombatAnalytics(demoCombatAnalytics); assert.equal(events.length,150);
 assert.deepEqual(new Set(events.map(e=>e.character_id)),new Set(['bobby-kills','indigo','owen','freed','heilbrun']));
 assert.ok(events.every(e=>e.analytics_event_id.startsWith('demo:')&&e.outcome===null&&e.effective_damage===null));
});
test('analytics keeps damage unlinked and reports unavailable outcome facts',()=>{
 const summary=combatSummary(demoCombatAnalytics.events); assert.ok(summary.actions.some(a=>a.uses>0)); assert.ok(summary.criticals>0);
 assert.equal(summary.outcomes,0); assert.equal(summary.effective,0);
 assert.ok(demoCombatAnalytics.events.filter(e=>e.damage).every(e=>e.damage?.correlation==='unlinked'));
});
test('analytics rejects duplicate references and mismatched facts',()=>{
 const [first]=demoCombatAnalytics.events; assert.throws(()=>validateCombatAnalytics({events:[first,{...first}]}),/duplicate/);
 assert.throws(()=>validateCombatAnalytics({events:[{...first,kind:'damage'}]}),/invalid attack facts/);
});
