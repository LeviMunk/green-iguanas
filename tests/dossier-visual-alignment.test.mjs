import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const profile=app.slice(app.indexOf('function CharacterPage('),app.indexOf('\nfunction ',app.indexOf('function CharacterPage(')+15));
test('full dossier portraits do not inherit opaque portrait-card overlays',()=>{
  assert.match(app,/portrait-stage--dossier/);
  assert.match(css,/\.character-dossier \.dossier-portrait \.portrait-stage::before/);
  assert.match(css,/content:none!important;display:none!important/);
  assert.match(css,/object-fit:contain;object-position:center bottom/);
});
test('all biography images are to the left of their text and are never cropped',()=>{
  assert.match(css,/nth-child\(even\) \.character-story-image\{\s*order:0/);
  assert.match(css,/grid-template-columns:minmax\(0,44%\) minmax\(0,56%\)/);
  assert.match(css,/object-fit:contain;object-position:center center/);
  assert.match(css,/transform:none!important/);
  assert.match(profile,/character.profileSections.map/);
});
test('character-specific color palettes and player sheet links remain intact',()=>{
  for(const id of ['indigo','bobby-kills','owen','freed','heilbrun']){
    assert.match(css,new RegExp('character-dossier--'+id));
  }
  assert.match(profile,/href=\{character.beyondUrl\}/);
  assert.match(profile,/THE STORY OF \{character.name.toUpperCase\(\)\}/);
});
