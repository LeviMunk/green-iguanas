import { useEffect, useState } from 'react';

export type Session = { id:string; number:number; title:string; date?:string; summary:string };
export type NPC = { id:string; name:string; description:string };
export type Quest = { id:string; title:string; status:'active'|'completed'|'failed'|'unresolved'; summary:string };
export type Match = { id:string; title:string; summary:string };
export type Achievement = { id:string; title:string; description:string; characterId?:string; unlockedAt?:string };
export type CampaignContent = {
  version:number;
  sessions:Session[];
  npcs:NPC[];
  quests:Quest[];
  dragonbowlMatches:Match[];
  achievements:Achievement[];
};
const empty:CampaignContent={version:1,sessions:[],npcs:[],quests:[],dragonbowlMatches:[],achievements:[]};

export function useCampaignContent() {
  const [content,setContent]=useState<CampaignContent>(empty);
  useEffect(()=>{
    let active=true;
    fetch(`${import.meta.env.BASE_URL}data/content.json`,{cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error('Campaign records unavailable');return r.json()})
      .then(raw=>{if(!raw||raw.version!==1||!['sessions','npcs','quests','dragonbowlMatches','achievements'].every(k=>Array.isArray(raw[k]))) throw new Error('Invalid campaign record format');if(active) setContent(raw as CampaignContent)})
      .catch(()=>{/* The archive remains honestly empty if data is offline or missing. */});
    return()=>{active=false};
  },[]);
  return {content};
}
