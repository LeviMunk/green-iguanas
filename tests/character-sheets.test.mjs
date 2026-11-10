import test from 'node:test';
import assert from 'node:assert/strict';
import { characters } from '../src/data/campaign.ts';

const expected = {
  'bobby-kills': {dndId:'161599175',sheetName:'BOBBY KILLS',ac:13,hp:59,level:6},
  freed: {dndId:'159982298',sheetName:'Freed Gloomshine',ac:21,hp:40,level:6},
  owen: {dndId:'172723105',sheetName:'Owen Shepherd',ac:15,hp:57,level:6},
  indigo: {dndId:'150861638',sheetName:'Indigo Matthews',ac:13,hp:39,level:6},
  heilbrun: {dndId:'150651437',sheetName:'Heilbrun Onnedros',ac:18,hp:46,level:6},
};

test('every hero has the correct distinct direct D&D Beyond character link',()=>{
  assert.equal(characters.length,5);
  assert.equal(new Set(characters.map(c=>c.beyondUrl)).size,5);
  for(const character of characters){
    const verified=expected[character.id];
    assert.ok(verified,'unmapped character: '+character.id);
    assert.equal(character.beyondUrl,'https://www.dndbeyond.com/characters/'+verified.dndId);
    assert.equal(character.sheetName,verified.sheetName);
    assert.equal(character.level,verified.level);
    assert.equal(character.sheetSnapshot?.armorClass,verified.ac);
    assert.equal(character.sheetSnapshot?.maxHitPoints,verified.hp);
    assert.equal(Object.keys(character.sheetSnapshot?.abilityScores??{}).length,6);
    assert.equal(character.sheetSnapshot?.asOf,'2026-11-10');
  }
});

test('class and background data reflect reviewed exports and player-corrected oath',()=>{
  assert.equal(characters.find(c=>c.id==='freed').class,'Fighter 4 / Ranger 2');
  assert.equal(characters.find(c=>c.id==='bobby-kills').background,'Soldier');
  assert.equal(characters.find(c=>c.id==='indigo').background,'Artisan');
  assert.equal(characters.find(c=>c.id==='owen').background,'Emerald Enclave Caretaker');
  const heilbrun=characters.find(c=>c.id==='heilbrun');
  assert.equal(heilbrun.background,'Haunted One');
  assert.match(heilbrun.class,/Oath of Vengeance/);
  assert.ok(heilbrun.profileSections.some(s=>s.title==='An oath of vengeance'&&!s.status));
});

test('private uploaded PDFs are summarized, not exposed as public files',()=>{
  assert.ok(characters.every(c=>c.sheetPdf===null));
});
