import { useEffect, useState } from 'react';
import { CHARACTER_IDS } from './dice.ts';
import { demoCombatAnalytics } from '../data/demo-analytics.ts';

export const COMBAT_ANALYTICS_SCHEMA_VERSION = '1.0' as const;
export type CombatKind = 'attack'|'damage'|'ability_check'|'saving_throw'|'other';
export type CombatDie = {sides:number;face:number;selected:boolean};
export type CombatAnalyticsEvent = {
  schema_version: typeof COMBAT_ANALYTICS_SCHEMA_VERSION;
  analytics_event_id:string; source_event_id:string; occurred_at:string; session_id:string|null;
  character_id:typeof CHARACTER_IDS[number]; action:string|null; kind:CombatKind;
  attack:null|{total:number;modifier:number;mode:'normal'|'advantage'|'disadvantage'|'unknown';dice:CombatDie[];critical:boolean|null};
  damage:null|{total:number;modifier:number;dice:CombatDie[];type:string|null;correlation:'unlinked'};
  outcome:null|'hit'|'miss'; target:null|{id:string;ac:number|null}; effective_damage:number|null;
};
export type CombatAnalyticsBundle={schema_version:typeof COMBAT_ANALYTICS_SCHEMA_VERSION;events:CombatAnalyticsEvent[]};

export function validateCombatAnalytics(raw:unknown):CombatAnalyticsEvent[]{
  const source=raw&&typeof raw==='object'&&'events' in raw?(raw as CombatAnalyticsBundle).events:null;
  if(!Array.isArray(source)||source.length>10000)throw new Error('Expected a combat analytics event bundle of at most 10,000 records.');
  const ids=new Set<string>();
  return source.map((entry,index)=>{
    const e=entry as CombatAnalyticsEvent; const fail=(message:string):never=>{throw new Error(`Analytics event ${index+1}: ${message}`)};
    if(!e||e.schema_version!==COMBAT_ANALYTICS_SCHEMA_VERSION)fail('unsupported schema_version');
    if(typeof e.analytics_event_id!=='string'||!e.analytics_event_id||ids.has(e.analytics_event_id))fail('missing or duplicate analytics_event_id'); ids.add(e.analytics_event_id);
    if(typeof e.source_event_id!=='string'||!e.source_event_id||typeof e.occurred_at!=='string'||Number.isNaN(Date.parse(e.occurred_at)))fail('invalid source reference or timestamp');
    if(!CHARACTER_IDS.includes(e.character_id)||!['attack','damage','ability_check','saving_throw','other'].includes(e.kind))fail('unrecognized character or kind');
    if(e.session_id!==null&&typeof e.session_id!=='string')fail('invalid session_id');
    if(e.action!==null&&typeof e.action!=='string')fail('invalid action');
    if(e.outcome!==null&&e.outcome!=='hit'&&e.outcome!=='miss')fail('invalid outcome');
    if(e.effective_damage!==null&&!Number.isFinite(e.effective_damage))fail('invalid effective_damage');
    if(e.attack!==null){if(e.kind!=='attack'||!Number.isInteger(e.attack.total)||!Number.isInteger(e.attack.modifier)||!['normal','advantage','disadvantage','unknown'].includes(e.attack.mode)||!Array.isArray(e.attack.dice)||!e.attack.dice.length)fail('invalid attack facts');}
    if(e.damage!==null){if(e.kind!=='damage'||!Number.isInteger(e.damage.total)||!Number.isInteger(e.damage.modifier)||!Array.isArray(e.damage.dice)||!e.damage.dice.length||e.damage.correlation!=='unlinked')fail('invalid damage facts');}
    if((e.kind==='attack')!==Boolean(e.attack)||(e.kind==='damage')!==Boolean(e.damage))fail('kind and facts disagree');
    return e;
  }).sort((a,b)=>a.occurred_at.localeCompare(b.occurred_at)||a.analytics_event_id.localeCompare(b.analytics_event_id));
}

export function usePublishedCombatAnalytics(){
  const [events,setEvents]=useState<CombatAnalyticsEvent[]>(demoCombatAnalytics.events); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{let active=true;fetch(`${import.meta.env.BASE_URL}data/combat-analytics.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('No public combat analytics feed available');return r.json()}).then(raw=>{const events=validateCombatAnalytics(raw);if(active){setEvents(events.length?events:demoCombatAnalytics.events);setError('');}}).catch(e=>{if(active){setEvents(demoCombatAnalytics.events);setError(e instanceof Error?e.message:'Unable to read combat analytics');}}).finally(()=>active&&setLoading(false));return()=>{active=false};},[]);
  return {events,loading,error,demonstration:events.every(e=>e.analytics_event_id.startsWith('demo:'))};
}

export function combatSummary(events:CombatAnalyticsEvent[]){
  const attacks=events.filter(e=>e.attack); const damages=events.filter(e=>e.damage);
  const attackTotals=attacks.map(e=>e.attack?.total??0), damageTotals=damages.map(e=>e.damage?.total??0);
  const selectedD20=attacks.flatMap(e=>e.attack?.dice.filter(d=>d.selected&&d.sides===20).map(d=>d.face)??[]);
  const actions=new Map<string,{uses:number;damage:number[]}>();
  for(const e of events){if(!e.action)continue;const row=actions.get(e.action)??{uses:0,damage:[]};if(e.attack)row.uses++;if(e.damage)row.damage.push(e.damage.total);actions.set(e.action,row);}
  return {attacks:attacks.length, damages:damages.length, checks:events.filter(e=>e.kind==='ability_check').length, saves:events.filter(e=>e.kind==='saving_throw').length, natural20s:selectedD20.filter(x=>x===20).length,natural1s:selectedD20.filter(x=>x===1).length,averageAttack:attackTotals.length?attackTotals.reduce((a,b)=>a+b,0)/attackTotals.length:null,totalDamage:damageTotals.reduce((a,b)=>a+b,0),highestDamage:damageTotals.length?Math.max(...damageTotals):null,averageDamage:damageTotals.length?damageTotals.reduce((a,b)=>a+b,0)/damageTotals.length:null, criticals:attacks.filter(e=>e.attack?.critical===true).length, outcomes:attacks.filter(e=>e.outcome!==null).length, effective:damages.filter(e=>e.effective_damage!==null).length,
    actions:[...actions.entries()].map(([name,value])=>({name,...value,totalDamage:value.damage.reduce((a,b)=>a+b,0),highestDamage:value.damage.length?Math.max(...value.damage):null,averageDamage:value.damage.length?value.damage.reduce((a,b)=>a+b,0)/value.damage.length:null})).sort((a,b)=>b.uses-a.uses||b.totalDamage-a.totalDamage||a.name.localeCompare(b.name)),
    sessions:[...new Set(events.map(e=>e.session_id).filter((x):x is string=>!!x))].sort()};
}
