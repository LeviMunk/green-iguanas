import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const home=app.slice(app.indexOf('function Home()'),app.indexOf('\nfunction ',app.indexOf('function Home()')+10));
const hero=app.slice(app.indexOf('function HeroFellowship()'),app.indexOf('\nfunction ',app.indexOf('function HeroFellowship()')+10));

test('the homepage is only the immersive character selector, not a gallery plus status panels',()=>{
  assert.match(home,/<HeroFellowship\/>/);
  assert.doesNotMatch(home,/campaign-pulse|NOW PLAYING|footer|party-preview/);
  assert.match(hero,/cinematic-home--immersive/);
  assert.match(css,/height:calc\(100svh - 91px\)/);
  assert.match(css,/\.home-simplified \.cinematic-home--immersive/);
});

test('mobile scroll activation and character dossier links are preserved',()=>{
  assert.match(hero,/querySelectorAll<HTMLAnchorElement>\('\.cinematic-hero'\)/);
  assert.match(hero,/addEventListener\('scroll',schedule/);
  assert.match(css,/scroll-snap-type:x mandatory/);
  assert.match(hero,/href=\{`#\/character\/\$\{character.id\}`\}/);
});

test('cinematic details honor reduced-motion and remain decorative',()=>{
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(hero,/className="cinematic-ember-field" aria-hidden="true"/);
  assert.match(hero,/className="cinematic-scenery" aria-hidden="true"/);
  assert.match(css,/pointer-events:none/);
  assert.match(hero,/--scene-spot/);
});
