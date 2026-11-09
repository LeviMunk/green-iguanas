import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEvents, summarize } from '../src/lib/dice.ts';
const valid = {
  schema_version:'1.0', event_id:'test-1', source:'tableos', occurred_at:'2026-11-09T18:30:00Z',
  campaign_external_id:'green-iguanas', session_external_id:null,character_external_id:'bobby-kills',
  roll_type:'attack',dice:[{sides:20,face:20,kept:true}],modifier_total:5,total:25,critical_hit:true,visibility:'members'
};
test('validates a contract event',()=>assert.equal(validateEvents([valid]).length,1));
test('rejects duplicate IDs',()=>assert.throws(()=>validateEvents([valid,valid]),/duplicate/));
test('rejects impossible final totals',()=>assert.throws(()=>validateEvents([{...valid,total:999}]),/total/));
test('rejects timestamps without timezone',()=>assert.throws(()=>validateEvents([{...valid,occurred_at:'2026-11-09T18:30:00'}]),/timezone/));
test('kept d20 faces only',()=>{
 const event={...valid,dice:[{sides:20,face:4,kept:false},{sides:20,face:17,kept:true}],modifier_total:5,total:22,critical_hit:false};
 const summary=summarize([event]);
 assert.deepEqual([summary.d20s,summary.average,summary.natural20s],[1,17,0]);
});
test('rejects unrecognized character mappings',()=>assert.throws(()=>validateEvents([{...valid,character_external_id:'unknown'}]),/unrecognized/));
test('counts explicit critical hits separately from natural 20s',()=>{
 const summary=summarize([{...valid,roll_type:'ability_check',critical_hit:null}]);
 assert.equal(summary.natural20s,1);
 assert.equal(summary.confirmedCrits,0);
});
test('rejects forged attacks with critical flag on checks',()=>assert.throws(()=>validateEvents([{...valid,roll_type:'saving_throw',critical_hit:true}]),/attack rolls/));
