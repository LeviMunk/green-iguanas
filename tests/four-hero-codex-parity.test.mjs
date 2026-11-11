import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {characters} from '../src/data/campaign.ts';

const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');

test('each of the four heroes has a distinct full codex atmosphere',()=>{
  const schemes=['bobby-kills','owen','freed','heilbrun'];
  const skin=css.split('/* CODEX PARITY: Bobby, Owen, Freed and Heilbrun')[1];
  assert.ok(skin,'codex parity styles are present');
  for(const id of schemes){
    assert.match(skin,new RegExp('character-profile-codex\\.character-dossier--'+id+'\\{'));
    assert.match(skin,/--codex-light-a:/);
    const character=characters.find(c=>c.id===id);
    assert.ok(character,'Missing hero '+id);
    assert.ok(character.beyondUrl?.startsWith('https://www.dndbeyond.com/characters/'));
    assert.ok(character.profileSections.length>0);
  }
  assert.match(skin,/character-codex-sidebar/);
  assert.match(skin,/character-codex-story-main/);
});

test('story beats have art and retain the left-image responsive layout',()=>{
  for(const character of characters){
    assert.ok(existsSync(new URL('../public/character-art/'+character.id+'/backdrop.webp',import.meta.url)),character.id+' backdrop is missing');
    for(let i=0;i<character.profileSections.length;i++){
      assert.ok(existsSync(new URL('../public/character-art/'+character.id+'/beat-'+(i+1)+'.webp',import.meta.url)),character.id+' story illustration '+(i+1)+' is missing');
    }
  }
  assert.match(app,/character-codex-story-grid/);
  assert.match(css,/object-fit:contain!important;object-position:center center/);
  assert.match(css,/grid-template-columns:minmax\(0,45%\) minmax\(0,55%\)/);
  assert.match(css,/@media\(max-width:700px\)/);
});

test('user-facing hero profile labels are intact',()=>{
  assert.match(app,/HERO PROFILE/);
  assert.match(app,/NEXT HERO/);
  assert.doesNotMatch(app,/>[^<]*\bDOSSIER\b/i);
});