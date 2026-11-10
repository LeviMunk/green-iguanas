import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { characters } from '../src/data/campaign.ts';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const profile=app.slice(app.indexOf('function CharacterPage('),app.indexOf('\nfunction ',app.indexOf('function CharacterPage(')+20));

test('all five characters have a distinct atmospheric color scheme',()=>{
 for(const character of characters){
   assert.match(app,new RegExp("'"+character.id+"':?\\s*\\{accent:|"+character.id+":\\{accent:"));
   assert.match(css,new RegExp('character-dossier--'+character.id));
 }
 assert.match(profile,/dossier-backdrop/);
 assert.match(css,/--dossier-highlight/);
});

test('every existing biography beat has a numbered art URL with readable fallback',()=>{
 assert.equal(characters.reduce((n,ch)=>n+ch.profileSections.length,0),22);
 assert.match(profile,/character.profileSections.map/);
 assert.match(profile,/sceneBase\+'beat-'\+\(i\+1\)\+'.webp'/);
 assert.match(profile,/character-story-art-fallback/);
 assert.match(profile,/onError=\{e=>\{e.currentTarget.style.display='none'\}\}/);
 assert.match(profile,/section.text/);
});

test('preserves live D&D Beyond links and mobile reading order',()=>{
 assert.match(profile,/href=\{character.beyondUrl\}/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/character-story-chapter--illustrated:nth-child\(even\) .character-story-image\{order:0\}/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
