import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {characters} from '../src/data/campaign.ts';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const profile=app.slice(app.indexOf('function CharacterPage('),app.indexOf('\nfunction ',app.indexOf('function CharacterPage(')+15));

test('visible character wording uses hero profile instead of dossier',()=>{
  assert.doesNotMatch(app,/>[^<]*\bDOSSIER\b/);
  assert.doesNotMatch(app,/NEXT DOSSIER/);
  assert.doesNotMatch(app,/character dossier[.\`]/i);
  assert.match(profile,/HERO PROFILE/);
  assert.match(profile,/NEXT HERO/);
});

test('the page is a real split-header codex with a distinct story sidebar',()=>{
  assert.match(profile,/character-codex-hero-grid/);
  assert.match(profile,/character-codex-portrait/);
  assert.match(profile,/character-codex-stats/);
  assert.match(profile,/character-codex-story-grid/);
  assert.match(profile,/character-codex-sidebar/);
  assert.match(profile,/character-codex-story-main/);
  assert.match(css,/grid-template-columns:minmax\(190px,225px\) minmax\(0,1fr\)/);
  assert.match(css,/grid-template-columns:minmax\(0,45%\) minmax\(0,55%\)/);
});

test('all biography images remain on the left, fully contained, and readable on mobile',()=>{
  assert.match(css,/object-fit:contain!important;object-position:center center/);
  assert.match(css,/\.character-codex-story-main \.character-story-chapter--illustrated:nth-child\(even\) \.character-story-image/);
  assert.match(css,/\.character-codex-story-main \.character-story-image,/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(css,/flex-direction:column;min-height:0/);
  assert.match(profile,/section.text/);
});

test('all five character color identities, backstories and existing player sheet links remain',()=>{
  assert.equal(characters.length,5);
  for(const character of characters){
    assert.ok(character.profileSections.length>=3);
    assert.ok(character.beyondUrl);
    assert.match(app,new RegExp('character-dossier--'));
  }
  assert.match(profile,/href=\{character.beyondUrl\}/);
  assert.match(profile,/character.profileSections.map/);
});
