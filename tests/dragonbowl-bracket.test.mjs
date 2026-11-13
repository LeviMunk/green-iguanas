import test from 'node:test';
import assert from 'node:assert/strict';
import { dragonbowlBracket, dragonbowlOddsByTeam } from '../src/data/dragonbowl.ts';
import { dragonbowlOpeningOdds } from '../src/data/campaign.ts';

const r16=dragonbowlBracket.find(r=>r.id==='round-of-16').matches;
const quarter=dragonbowlBracket.find(r=>r.id==='quarterfinals').matches;

test('opening draw has 16 distinct teams and four quarterfinal pairings',()=>{
 assert.deepEqual(dragonbowlBracket.map(r=>r.id),['round-of-16','quarterfinals']);
 assert.deepEqual(dragonbowlBracket.map(r=>r.matches.length),[8,4]);
 const teams=r16.flatMap(m=>[m.teamA,m.teamB]);
 assert.equal(new Set(teams).size,16);
 assert.ok(teams.every(t=>t&&Object.hasOwn(dragonbowlOddsByTeam,t)));
 assert.equal(dragonbowlOpeningOdds.length,16);
});

test('only the Iguanas opening victory is marked played',()=>{
 const completed=dragonbowlBracket.flatMap(r=>r.matches).filter(m=>m.status==='final');
 assert.deepEqual(completed.map(m=>m.id),['r16-green-cackle']);
 assert.equal(completed[0].winner,'THE GREEN IGUANAS');
});

test('Dandy War Dolls are the next opponent',()=>{
 const next=quarter.filter(m=>m.status==='upcoming');
 assert.equal(next.length,1);
 assert.equal(next[0].teamA,'THE GREEN IGUANAS');
 assert.equal(next[0].teamB,'The Dandy War Dolls');
 assert.equal(next[0].winner,null);
});

test('all quarterfinal matchups are visible without predicted winners',()=>{
 assert.deepEqual(quarter.map(m=>[m.teamA,m.teamB]),[
  ['THE GREEN IGUANAS','The Dandy War Dolls'],
  ['Twisted Firestarters','Apocalypse Drow'],
  ['The Ghostmakers','The Furry & The Furious'],
  ['Kiss of Death','Scimitar Sisters']
 ]);
 assert.ok(quarter.every(m=>m.winner===null));
 assert.ok(dragonbowlBracket.flatMap(r=>r.matches).filter(m=>m.status!=='final').every(m=>m.winner===null));
 assert.equal(dragonbowlOddsByTeam['THE GREEN IGUANAS'],'100:1');
 assert.equal(dragonbowlOddsByTeam['The Ghostmakers'],'5:1');
});

test('player-facing app does not reveal semifinals, finalists, or DM predictions',async()=>{
 const {readFileSync}=await import('node:fs');
 const page=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 const publicBracket=readFileSync(new URL('../src/data/dragonbowl.ts',import.meta.url),'utf8');
 assert.match(page,/Quarterfinal matchups/);
 assert.match(page,/dragon-bracket-board--public/);
 assert.match(page,/dragonbowlBracket\.map\(/);
 assert.match(page,/DragonbowlMatch match=/);
 assert.doesNotMatch(page,/DM PICK|DM's planned path|Projected advancement|Twisted Firestarters in the semifinals|Ghostmakers in the championship/);
 assert.doesNotMatch(publicBracket,/sf-green|final-green|DM-planned|planned winner/i);
});
