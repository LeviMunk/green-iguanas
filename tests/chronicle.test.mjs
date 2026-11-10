import test from 'node:test';
import assert from 'node:assert/strict';
import {diceTrophies,characterRolls,rollNights} from '../src/lib/chronicle.ts';
const roll=(id,character,face,day,critical=false)=>({
 schema_version:'1.0',event_id:id,source:'tableos',occurred_at:day,
 campaign_external_id:'green-iguanas',session_external_id:'test-session',
 character_external_id:character,roll_type:'attack',
 dice:[{sides:20,face,kept:true}],modifier_total:2,total:face+2,critical_hit:critical,visibility:'public'
});
const a=roll('one','freed',20,'2026-11-01T20:00:00Z',true);
const b=roll('two','freed',1,'2026-11-02T20:00:00Z');
const c=roll('three','indigo',15,'2026-11-02T20:01:00Z');
test('an empty ledger unlocks nothing',()=>{
 const badges=diceTrophies([]);
 assert.equal(badges.filter(x=>x.unlocked).length,0);
 assert.ok(badges.every(x=>x.current===0));
});
test('trophies require real kept d20 faces and explicit crits',()=>{
 const badges=diceTrophies([a,b]); const get=id=>badges.find(x=>x.id===id);
 assert.equal(get('first-natural-20').unlocked,true);
 assert.equal(get('first-natural-1').unlocked,true);
 assert.equal(get('first-confirmed-critical').unlocked,true);
 assert.equal(get('five-natural-20s').unlocked,false);
 assert.equal(get('twenty-five-d20s').current,2);
});
test('discarded advantage die does not count',()=>{
 const advantage={...a,event_id:'adv',critical_hit:false,dice:[{sides:20,face:20,kept:false},{sides:20,face:6,kept:true}],total:8};
 assert.equal(diceTrophies([advantage]).find(x=>x.id==='first-natural-20').unlocked,false);
});
test('character roll history ignores other characters and sorts newest first',()=>{
 const found=characterRolls([a,c,b],'freed');
 assert.deepEqual(found.map(x=>x.event_id),['two','one']);
});
test('play-day grouping uses UTC dates and preserved events',()=>{
 const days=rollNights([a,b,c]);
 assert.deepEqual(days.map(x=>[x.date,x.rolls]),[['2026-11-02',2],['2026-11-01',1]]);
});
