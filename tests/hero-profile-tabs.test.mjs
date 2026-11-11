import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {characters} from '../src/data/campaign.ts';

const source=readFileSync(new URL('../src/App.tsx', import.meta.url),'utf8');
const start=source.indexOf('function CharacterPage({id}:');
const end=source.indexOf('\nfunction ',start+18);
const component=source.slice(start,end);

test('character pages show only the three requested tabs',()=>{
 assert.match(component,/\(\['overview','chronicle','sheet'\] as const\)/);
 assert.match(component,/His Story/);
 assert.match(component,/Dice & Achievements/);
 assert.match(component,/Character Sheet/);
 assert.doesNotMatch(component,/The Journey|tab==='timeline'|item==='timeline'/);
});
test('story chapters, links and recorded moments remain in source data',()=>{
 assert.match(component,/character\.profileSections\.map/);
 assert.match(component,/character\.beyondUrl/);
 assert.match(component,/CharacterDicePanel/);
 assert.match(component,/CharacterSheetPanel/);
 assert.equal(characters.length,5);
 for(const character of characters){
   assert.ok(Array.isArray(character.moments),character.id+' moment records should be preserved');
 }
});