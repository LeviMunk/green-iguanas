import test from 'node:test';
import assert from 'node:assert/strict';
import { dragonbowlBracket, dragonbowlOddsByTeam } from '../src/data/dragonbowl.ts';
import { dragonbowlOpeningOdds } from '../src/data/campaign.ts';

const r16=dragonbowlBracket.find(r=>r.id==='round-of-16').matches;
const quarter=dragonbowlBracket.find(r=>r.id==='quarterfinals').matches;
const allFirstRoundTeams=r16.flatMap(match=>[match.teamA,match.teamB]);

test('single-elimination board includes 16 distinct opening teams',()=>{
 assert.deepEqual(dragonbowlBracket.map(round=>round.matches.length),[8,4,2,1]);
 assert.equal(new Set(allFirstRoundTeams).size,16);
 assert.ok(allFirstRoundTeams.every(team=>team&&Object.hasOwn(dragonbowlOddsByTeam,team)));
 assert.equal(dragonbowlOpeningOdds.length,16);
});

test('only Green Iguanas over Cackle Crew is recorded as a played result',()=>{
 const completed=dragonbowlBracket.flatMap(round=>round.matches).filter(match=>match.status==='final');
 assert.deepEqual(completed.map(match=>match.id),['r16-green-cackle']);
 assert.equal(completed[0].winner,'THE GREEN IGUANAS');
 assert.equal(completed[0].teamB,'The Cackle Crew');
});

test('Dandy War Dolls are known next opponent, without falsely reporting a previous win',()=>{
 const next=quarter.filter(match=>match.status==='upcoming');
 assert.equal(next.length,1);
 assert.equal(next[0].teamA,'THE GREEN IGUANAS');
 assert.equal(next[0].teamB,'The Dandy War Dolls');
 assert.equal(next[0].winner,null);
 assert.equal(r16.find(m=>m.id==='r16-dandy-wild').winner,'The Dandy War Dolls');
 assert.equal(r16.find(m=>m.id==='r16-dandy-wild').status,'projected');
});

test('no planned outcomes are promoted as confirmed',()=>{
 const staged=dragonbowlBracket.flatMap(round=>round.matches);
 assert.equal(staged.filter(m=>m.status==='final').length,1);
 assert.ok(staged.filter(m=>m.status==='projected').every(m=>m.winner===m.teamA||m.winner===m.teamB));
 assert.ok(staged.filter(m=>m.status==='pending').every(m=>m.winner===null));
 assert.equal(dragonbowlOddsByTeam['THE GREEN IGUANAS'],'100:1');
 assert.equal(dragonbowlOddsByTeam['The Ghostmakers'],'5:1');
});

test('planned quarterfinal and later path remains internally consistent',()=>{
 const semifinals=dragonbowlBracket.find(r=>r.id==='semifinals').matches;
 const championship=dragonbowlBracket.find(r=>r.id==='final').matches[0];
 assert.deepEqual(quarter.map(m=>[m.teamA,m.teamB]),[
  ['THE GREEN IGUANAS','The Dandy War Dolls'],
  ['Twisted Firestarters','Apocalypse Drow'],
  ['The Ghostmakers','The Furry & The Furious'],
  ['Kiss of Death','Scimitar Sisters']
 ]);
 assert.deepEqual(quarter.slice(1).map(m=>m.winner),[
  'Twisted Firestarters','The Ghostmakers','Kiss of Death'
 ]);
 assert.deepEqual(semifinals.map(m=>[m.teamA,m.teamB]),[
  ['THE GREEN IGUANAS','Twisted Firestarters'],
  ['The Ghostmakers','Kiss of Death']
 ]);
 assert.deepEqual([championship.teamA,championship.teamB],['THE GREEN IGUANAS','The Ghostmakers']);
 assert.ok([...semifinals,championship].every(m=>m.status==='pending'&&m.winner===null));
});
