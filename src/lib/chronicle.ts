import { useEffect, useState } from 'react';
import { summarize, validateEvents, type RollEvent } from './dice.ts';

export type DiceTrophy = {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type NightRecord = {
  date: string;
  rolls: number;
  d20s: number;
  natural20s: number;
  natural1s: number;
};

export function usePublishedRolls() {
  const [events,setEvents] = useState<RollEvent[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  useEffect(()=>{
    let active=true;
    fetch(`${import.meta.env.BASE_URL}data/rolls.json`,{cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error('No public roll feed available');return r.json();})
      .then(raw=>{
        const checked=validateEvents(raw);
        if(checked.some(e=>e.visibility!=='public'))throw new Error('Roll feed contains non-public entries');
        if(active){setEvents(checked);setError('');}
      })
      .catch(e=>{if(active)setError(e instanceof Error?e.message:'Unable to read the roll archive')})
      .finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[]);
  return {events,loading,error};
}

export function characterRolls(events: RollEvent[], characterId:string):RollEvent[]{
  return events.filter(e=>e.character_external_id===characterId)
    .sort((a,b)=>b.occurred_at.localeCompare(a.occurred_at));
}

export function diceTrophies(events: RollEvent[]):DiceTrophy[]{
  const sorted=[...events].sort((a,b)=>a.occurred_at.localeCompare(b.occurred_at));
  const countD20=(e:RollEvent)=>e.dice.filter(d=>d.sides===20&&d.kept).length;
  const countFaces=(e:RollEvent,n:number)=>e.dice.filter(d=>d.sides===20&&d.kept&&d.face===n).length;
  const progress={
    d20:0,nat20:0,nat1:0,crits:0,events:0
  };
  const rules=[
    {id:'first-natural-20',title:'A Perfect Twenty',description:'Record the first raw natural 20.',target:1,kind:'nat20' as const},
    {id:'first-natural-1',title:'The Other Side of Fate',description:'Record the first raw natural 1.',target:1,kind:'nat1' as const},
    {id:'twenty-five-d20s',title:'Twenty-Five Rolls Deep',description:'Record 25 kept d20 faces.',target:25,kind:'d20' as const},
    {id:'five-natural-20s',title:'Five Times Favored',description:'Record five raw natural 20s.',target:5,kind:'nat20' as const},
    {id:'first-confirmed-critical',title:'Critical Moment',description:'Record a confirmed critical attack (not merely a natural 20).',target:1,kind:'crits' as const},
    {id:'fifty-events',title:'Fifty Rolls in the Ledger',description:'Record 50 distinct, verified roll events.',target:50,kind:'events' as const}
  ];
  const unlocked:Record<string,string|null>={};
  for(const event of sorted){
    progress.events+=1;
    progress.d20+=countD20(event);
    progress.nat20+=countFaces(event,20);
    progress.nat1+=countFaces(event,1);
    progress.crits+=event.roll_type==='attack'&&event.critical_hit===true?1:0;
    for(const rule of rules){
      if(!unlocked[rule.id]&&progress[rule.kind]>=rule.target){
        unlocked[rule.id]=event.occurred_at;
      }
    }
  }
  return rules.map(rule=>({
    id:rule.id,title:rule.title,description:rule.description,
    current:progress[rule.kind],target:rule.target,
    unlocked:progress[rule.kind]>=rule.target,unlockedAt:unlocked[rule.id]??null
  }));
}

export function rollNights(events: RollEvent[]):NightRecord[]{
  const byDay=new Map<string,RollEvent[]>();
  for(const e of events){
    const day=e.occurred_at.slice(0,10);
    const list=byDay.get(day)??[];list.push(e);byDay.set(day,list);
  }
  return [...byDay.entries()].sort((a,b)=>b[0].localeCompare(a[0]))
    .map(([date,list])=>{const stats=summarize(list);
      return {date,rolls:stats.events,d20s:stats.d20s,natural20s:stats.natural20s,natural1s:stats.natural1s};
    });
}
