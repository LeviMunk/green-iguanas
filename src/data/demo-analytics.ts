import type { CombatAnalyticsBundle, CombatAnalyticsEvent } from '../lib/combat-analytics.ts';

const heroes=['bobby-kills','indigo','owen','freed','heilbrun'] as const;
const actions=[['Greataxe','Slashing'],['Vicious Mockery','Psychic'],['Quarterstaff','Bludgeoning'],['Longbow','Piercing'],['Longsword','Slashing']] as const;
const faces=[17,4,12,20,8,15,9,1,18,11,6,14,20,3,13,7,16,10,5,19];
// Fully fictional, deterministic facts. Damage is deliberately unlinked: it is
// never presented as proof that a preceding attack hit.
const events:CombatAnalyticsEvent[]=Array.from({length:150},(_,i)=>{
 const hero=heroes[i%heroes.length], [action,type]=actions[i%actions.length], session=`demo-session-${1+Math.floor(i/30)}`, at=new Date(Date.UTC(2026,8+Math.floor(i/50),4+(i%20),18,20+(i%4)*9)).toISOString(), face=faces[i%faces.length], modifier=2+(i%6), id=`demo:analytics:${String(i+1).padStart(3,'0')}`;
 if(i%5===2)return {schema_version:'1.0',analytics_event_id:id,source_event_id:`demo:green-iguanas:check-${String(i+1).padStart(3,'0')}`,occurred_at:at,session_id:session,character_id:hero,action:i%10===2?'Perception':'Athletics',kind:'ability_check',attack:null,damage:null,outcome:null,target:null,effective_damage:null};
 if(i%5===3)return {schema_version:'1.0',analytics_event_id:id,source_event_id:`demo:green-iguanas:save-${String(i+1).padStart(3,'0')}`,occurred_at:at,session_id:session,character_id:hero,action:i%10===3?'Dexterity Save':'Wisdom Save',kind:'saving_throw',attack:null,damage:null,outcome:null,target:null,effective_damage:null};
 if(i%2===0){const dice=[{sides:20,face,selected:true},{sides:20,face:Math.max(1,face-5),selected:false}];const critical=face===20||i%34===0;if(critical)dice[0].face=20;return {schema_version:'1.0',analytics_event_id:id,source_event_id:`demo:green-iguanas:attack-${String(i+1).padStart(3,'0')}`,occurred_at:at,session_id:session,character_id:hero,action,kind:'attack',attack:{total:dice[0].face+modifier,modifier,mode:i%6===0?'advantage':i%8===0?'disadvantage':'normal',dice,critical},damage:null,outcome:null,target:null,effective_damage:null};}
 const d8=2+(i%7), d6=1+(i%6);return {schema_version:'1.0',analytics_event_id:id,source_event_id:`demo:green-iguanas:damage-${String(i+1).padStart(3,'0')}`,occurred_at:at,session_id:session,character_id:hero,action,kind:'damage',attack:null,damage:{total:d8+d6+modifier,modifier,dice:[{sides:8,face:d8,selected:true},{sides:6,face:d6,selected:true}],type,correlation:'unlinked'},outcome:null,target:null,effective_damage:null};
});
export const demoCombatAnalytics:CombatAnalyticsBundle={schema_version:'1.0',events};
