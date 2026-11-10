import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { storyChapters } from '../src/data/campaign.ts';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const index=app.slice(app.indexOf('function StorySoFar()'),app.indexOf('\nfunction AdventurePage(',app.indexOf('function StorySoFar()')));
const detail=app.slice(app.indexOf('function AdventurePage('),app.indexOf('\nfunction ',app.indexOf('function AdventurePage(')+10));

test('story landing is a linked chapter bookshelf without embedded chapter galleries',()=>{
 assert.match(index,/cinema-adventure-grid/);
 assert.match(index,/href=\{'#\/adventure\/'.chapter.id\}/);
 assert.doesNotMatch(index,/cinema-gallery-grid|cinema-memory|cinema-chapters|SCENES FROM/);
 assert.equal(storyChapters.length,7);
});

test('each existing chapter has a unique deep-link and grounded public details',()=>{
 const ids=storyChapters.map(chapter=>chapter.id);
 assert.equal(new Set(ids).size,7);
 for(const chapter of storyChapters){
   assert.ok(chapter.title);
   assert.ok(chapter.hero.src);
   assert.ok(chapter.record?.length>=2,chapter.id+' needs a detailed public record');
 }
 assert.match(app,/route.startsWith\('\/adventure\/'\)\)page=<AdventurePage/);
 assert.match(detail,/const chapter=storyChapters\[chapterIndex\]/);
});

test('standalone pages retain their own scenes, return and next chapter navigation, and content caveats',()=>{
 assert.match(detail,/cinema-gallery-grid/);
 assert.match(detail,/chapter.gallery.map/);
 assert.match(detail,/href="#\/journal"/);
 assert.match(detail,/NEXT ADVENTURE/);
 assert.match(detail,/Planned encounters and possible outcomes/);
 assert.match(detail,/chapter.status==='confirmed'/);
});
