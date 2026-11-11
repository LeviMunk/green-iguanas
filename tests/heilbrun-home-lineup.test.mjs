import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {characters} from '../src/data/campaign.ts';

const source=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const home=source.slice(source.indexOf('function HeroFellowship('),source.indexOf('\nfunction Home()',source.indexOf('function HeroFellowship(')));
test('homepage uses standalone Heilbrun portrait for consistent lineup height',()=>{
 assert.match(home,/character\.id==='heilbrun'\?'art\/heilbrun-lineup\.webp':character\.portrait/);
 assert.ok(existsSync(new URL('../public/art/heilbrun-lineup.webp',import.meta.url)));
 assert.ok(existsSync(new URL('../public/art/heilbrun.webp',import.meta.url)));
});
test('character profile keeps spectral-elk portrait sourced from character data',()=>{
 const heilbrun=characters.find(c=>c.id==='heilbrun');
 assert.equal(heilbrun?.portrait,'art/heilbrun.webp');
 assert.match(source,/function CharacterPage\(/);
 assert.match(source,/<PlaceholderArt character=\{character\} large\/>/);
});
