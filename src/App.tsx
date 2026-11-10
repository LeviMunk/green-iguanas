import React, { useEffect, useMemo, useRef, useState } from 'react';
import { campaign, characters, storyChapters, type Character } from './data/campaign';
import { dragonbowlBracket, dragonbowlOddsByTeam, dragonbowlFacts, type BracketMatch, type BracketRound } from './data/dragonbowl';
import { demoRolls } from './data/demo';
import { summarize, validateEvents, type RollEvent } from './lib/dice';
import { useCampaignContent } from './lib/content';
import { characterRolls, diceTrophies, rollNights, usePublishedRolls } from './lib/chronicle';

type Glyph = 'arrow'|'arrow-up'|'chevron'|'compass'|'book'|'dice'|'shield'|'users'|'spark'|'crown'|'hourglass'|'lock'|'menu'|'close'|'search'|'plus'|'scroll'|'download'|'upload'|'feather'|'trophy'|'external'|'moon'|'check'|'filter'|'swords'|'user'|'coins';
function Icon({name, size=20}: {name:Glyph; size?:number}) {
  const common = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.55, strokeLinecap:'round' as const, strokeLinejoin:'round' as const, 'aria-hidden': true as const };
  const paths:Record<Glyph, React.ReactNode> = {
    arrow:<><path d="M4 12h15M13 6l6 6-6 6"/></>,
    'arrow-up':<><path d="M5 19 19 5M8 5h11v11"/></>,
    chevron:<><path d="m9 18 6-6-6-6"/></>,
    compass:<><circle cx="12" cy="12" r="9"/><path d="m15 9-2.5 5.5L9 15l2.5-5.5z"/></>,
    book:<><path d="M12 6a7 7 0 0 0-9-1v14a7 7 0 0 1 9 1V6Zm0 0a7 7 0 0 1 9-1v14a7 7 0 0 0-9 1V6Z"/></>,
    dice:<><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r=".75" fill="currentColor"/><circle cx="15.5" cy="8.5" r=".75" fill="currentColor"/><circle cx="12" cy="12" r=".75" fill="currentColor"/><circle cx="8.5" cy="15.5" r=".75" fill="currentColor"/><circle cx="15.5" cy="15.5" r=".75" fill="currentColor"/></>,
    shield:<><path d="M12 2 21 6v6c0 5-3.4 8.2-9 10-5.6-1.8-9-5-9-10V6l9-4Z"/></>,
    users:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M17 14a6 6 0 0 1 4 6"/></>,
    spark:<><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/></>,
    crown:<><path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z"/></>,
    hourglass:<><path d="M5 2h14M5 22h14M7 2v4c0 3 5 6 5 6s5-3 5-6V2M7 22v-4c0-3 5-6 5-6s5 3 5 6v4"/></>,
    lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close:<><path d="M5 5 19 19M19 5 5 19"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    scroll:<><path d="M7 4h13v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v10a2 2 0 0 1-4 0"/><path d="M9 4h11M11 9h6M11 13h6"/></>,
    download:<><path d="M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3"/></>,
    upload:<><path d="M12 17V5m-5 5 5-5 5 5M4 18v3h16v-3"/></>,
    feather:<><path d="M20 4c-6-1-12 2-14 9-1 3-1 5-1 7M3 21C9 14 14 11 21 3M9 15h5M12 11h6"/></>,
    trophy:<><path d="M7 4h10v7a5 5 0 0 1-10 0V4ZM7 6H3v3a4 4 0 0 0 4 4M17 6h4v3a4 4 0 0 1-4 4M12 16v4M8 21h8"/></>,
    external:<><path d="M14 4h6v6M20 4l-9 9M19 14v5H5V5h5"/></>,
    moon:<><path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/></>,
    check:<><path d="m5 12 4 4L19 6"/></>,
    filter:<><path d="M4 7h16M7 12h10M10 17h4"/></>,
    swords:<><path d="m3 3 7 7m4 4 7 7m-10-3-4 4M5 5l4-2 12 12-3 3L5 5ZM21 3 3 21"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    coins:<><circle cx="9" cy="9" r="6"/><path d="M13 14a6 6 0 1 0 7-7M6 9h6M9 6v6"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Crest({size=56}: {size?:number}) {
  return <img width={size} height={size} src={`${import.meta.env.BASE_URL}art/crest.webp`} className="crest-svg" alt="" aria-hidden="true" loading="eager" />;
}

const nav = [
  {href:'#/',label:'Home',glyph:'compass' as Glyph},
  {href:'#/dice',label:'Dice Chronicle',glyph:'dice' as Glyph},
  {href:'#/journal',label:'Story So Far',glyph:'book' as Glyph},
  {href:'#/archive',label:'World Archive',glyph:'scroll' as Glyph},
  {href:'#/dragonbowl',label:'Dragonbowl',glyph:'trophy' as Glyph},
];
const moreNav = [
  {href:'#/archive',label:'World Archive',glyph:'scroll' as Glyph},
  {href:'#/quests',label:'Quests',glyph:'compass' as Glyph},
  {href:'#/treasury',label:'Party Treasury',glyph:'coins' as Glyph},
  {href:'#/achievements',label:'Achievements',glyph:'spark' as Glyph}
];
function useRoute() {
  const [route,setRoute] = useState(() => window.location.hash.slice(1).split('?')[0] || '/');
  useEffect(() => {
    const update = () => {setRoute(window.location.hash.slice(1).split('?')[0] || '/');window.scrollTo({top:0,behavior:'instant'});};
    window.addEventListener('hashchange',update);
    return () => window.removeEventListener('hashchange',update);
  }, []);
  return route;
}
function Label({children}: {children:React.ReactNode}) {return <div className="eyebrow"><span className="eyebrow-rule"/>{children}</div>;}
function Action({href,children,variant='primary',icon='arrow'}:{href:string;children:React.ReactNode;variant?:'primary'|'outline'|'text';icon?:Glyph}) {return <a href={href} className={`btn btn-${variant}`}>{children}<Icon name={icon} size={17}/></a>;}
function PageIntro({eyebrow,title,description}: {eyebrow:string;title:React.ReactNode;description:string}) {return <header className="page-intro container"><Label>{eyebrow}</Label><h1 className="page-title">{title}</h1><p className="lead">{description}</p><span className="thin-divider"/></header>;}
function PlaceholderArt({character,large=false}: {character:Character;large?:boolean}) {
  const artworkSrc = character.portrait ? (character.portrait.startsWith("https://") ? character.portrait : `${import.meta.env.BASE_URL}${character.portrait.replace(/^\/+/, "")}`) : null;
  return <div className={`portrait-stage ${large?'portrait-large':''}`} style={{'--character-accent':character.accent} as React.CSSProperties}>
    <div className="portrait-radial"/><div className="portrait-ring portrait-ring-one"/><div className="portrait-ring portrait-ring-two"/>{artworkSrc&&<img className="character-portrait-image" src={artworkSrc} alt={`${character.name}, illustrated in heroic fantasy attire`} loading="lazy"/>}
    {!character.portrait&&<div className="portrait-sigil"><span className="sigil-ornament">✦</span><span className="sigil-initials">{character.givenInitials}</span><span className="sigil-decoration">✧</span></div>}
    {!character.portrait&&<div className="portrait-footnote">ILLUSTRATION PENDING</div>}
  </div>;
}
function SiteHeader({route}: {route:string}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>setOpen(false),[route]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  return <><header className="site-header"><div className="header-inner container">
    <a href="#/" className="brand" aria-label="Green Iguanas home"><Crest size={26}/><span className="brand-copy"><strong>GREEN IGUANAS</strong><small>THE LIVING CHRONICLE</small></span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{nav.slice(0,6).map(item=><a key={item.href} href={item.href} className={route===item.href.slice(1)?'active':''} aria-current={route===item.href.slice(1)?'page':undefined}>{item.label}</a>)}</nav>
    <div className="header-right"><span className="header-status"><span className="status-dot"/> CAMPAIGN COMPANION</span><button type="button" className="menu-trigger" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation"><Icon name={open?'close':'menu'} size={24}/></button></div>
  </div></header>
  {open && <nav id="mobile-navigation" className="mobile-menu" aria-label="Additional navigation">{nav.filter(n=>n.href!=='#/archive').map(n=><a className="mobile-menu-main" href={n.href} key={n.href} aria-current={route===n.href.slice(1)?'page':undefined}><Icon name={n.glyph}/>{n.label}<Icon name="arrow" size={15}/></a>)}{moreNav.map(n=><a href={n.href} key={n.href} aria-current={route===n.href.slice(1)?'page':undefined}><Icon name={n.glyph}/>{n.label}<Icon name="arrow" size={15}/></a>)}</nav>}
  <nav className="bottom-nav" aria-label="Mobile navigation">{[nav[0],nav[1],nav[2],nav[4]].map(n=><a key={n.href} href={n.href} aria-current={route===n.href.slice(1)?'page':undefined} className={route===n.href.slice(1)?'active':''}><Icon name={n.glyph} size={21}/><span>{n.label==='Dice Chronicle'?'Dice':n.label==='Story So Far'?'Story':n.label}</span></a>)}<button type="button" className={moreNav.some(n=>n.href.slice(1)===route)?'active':''} onClick={()=>setOpen(current=>!current)} aria-controls="mobile-navigation" aria-expanded={open} aria-label={open?'Close additional navigation':'More navigation'}><Icon name={open?'close':'menu'} size={21}/><span>More</span></button></nav></>;
}
function SectionTitle({eyebrow,title,sub,href,link}:{eyebrow:string;title:React.ReactNode;sub?:string;href?:string;link?:string}) {return <div className="section-heading"><div><Label>{eyebrow}</Label><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{href&&<Action href={href} variant="text">{link||'Explore'}</Action>}</div>}


const heroOrder=['owen','bobby-kills','indigo','freed','heilbrun'];
function HeroFellowship() {
  const heroes=heroOrder.map(id=>characters.find(c=>c.id===id)).filter((c):c is Character=>!!c);
  // The first hero starts highlighted. On phones, the hero nearest the
  // carousel's center becomes active without requiring an extra tap.
  const [activeId,setActiveId]=useState(heroOrder[0]);
  const stageRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const stage=stageRef.current;
    if(!stage)return;
    const mobile=window.matchMedia('(max-width:700px)');
    let frame=0;
    const update=()=>{
      frame=0;
      if(!mobile.matches)return;
      const stageRect=stage.getBoundingClientRect();
      const center=stageRect.left+stageRect.width/2;
      const cards=stage.querySelectorAll<HTMLAnchorElement>('.cinematic-hero');
      let nearestId:string|null=null;
      let nearestDistance=Infinity;
      cards.forEach(card=>{
        const rect=card.getBoundingClientRect();
        const distance=Math.abs(rect.left+rect.width/2-center);
        if(distance<nearestDistance){nearestDistance=distance;nearestId=card.dataset.heroId??null;}
      });
      if(nearestId)setActiveId(current=>current===nearestId?current:nearestId!);
    };
    const schedule=()=>{
      if(!frame)frame=window.requestAnimationFrame(update);
    };
    const onModeChange=()=>{if(mobile.matches)schedule();};
    stage.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    mobile.addEventListener('change',onModeChange);
    schedule();
    return ()=>{
      stage.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      mobile.removeEventListener('change',onModeChange);
      if(frame)window.cancelAnimationFrame(frame);
    };
  },[]);
  return <section className="cinematic-home" aria-labelledby="cinematic-title">
    <div className="cinematic-scenery" aria-hidden="true"><span className="ruin-arch arch-one"/><span className="ruin-arch arch-two"/><span className="ruin-arch arch-three"/><span className="cinematic-stars"/></div>
    <div className="cinematic-title-wrap">
      <div className="cinematic-overline"><span/>THE LIVING CHRONICLE<span/></div>
      <img src={`${import.meta.env.BASE_URL}art/crest.webp`} className="cinematic-crest" alt="The Green Iguanas crest" width="114" height="114" />
      <h1 id="cinematic-title"><span>THE</span> GREEN IGUANAS</h1>
    </div>
    <div className="cinematic-stage-outer">
      <div ref={stageRef} className="cinematic-stage" role="group" aria-label="Scroll through characters; the centered character is highlighted. Tap to open a dossier.">
        {heroes.map((character,index)=><a
            href={`#/character/${character.id}`}
            id={`hero-${character.id}`}
            data-hero-id={character.id}
            key={character.id}
            style={{'--character-accent':character.accent, '--hero-index':index} as React.CSSProperties}
            className={`cinematic-hero ${activeId===character.id?'is-active':''}`}
            onMouseEnter={()=>setActiveId(character.id)}
            onFocus={()=>setActiveId(character.id)}
            aria-label={`View ${character.name}'s character dossier`}
          >
            <span className="hero-backglow" aria-hidden="true" />
            <img src={`${import.meta.env.BASE_URL}${character.portrait}`} alt="" loading={index===2?'eager':'lazy'} decoding="async"/>
            <span className="hero-nameplate"><strong>{character.name}</strong><span className="hero-role">{character.class ?? 'Adventurer'}</span><span className="hero-divider" /></span>
          </a>)}
      </div>
    </div>
    
    <div className="cinematic-bottom-line" aria-hidden="true" />
  </section>;
}

function Home() {
  return <main id="main-content" tabIndex={-1} className="home-simplified">
    <HeroFellowship/>
    <section className="campaign-pulse container" aria-label="Campaign status">
      <div><span>NOW PLAYING</span><strong>{campaign.tournament}</strong><small>{campaign.location}</small></div>
      <div><span>PARTY LEVEL</span><strong>{campaign.currentLevel}</strong><small>{campaign.nextMilestone}</small></div>
      <div><span>LAST RESULT</span><strong>Cackle Crew defeated</strong><small>Next: Dandy War Dolls · Quarterfinal</small></div>
    </section>
  </main>;
}
function DetailBox({label,value}:{label:string;value:string|null|number}) {return <div className="detail-box"><span>{label}</span><strong>{value ?? 'Awaiting records'}</strong></div>}
function EmptyState({glyph='scroll',heading,detail}:{glyph?:Glyph;heading:string;detail:string}) {return <div className="empty-state"><div className="empty-icon"><Icon name={glyph} size={30}/></div><h3>{heading}</h3><p>{detail}</p></div>}

function CharacterSheetPanel({character}:{character:Character}) {
  const pdf=character.sheetPdf ? import.meta.env.BASE_URL+(character.sheetPdf.startsWith('/')?character.sheetPdf.slice(1):character.sheetPdf) : null;
  return <div className="sheet-panel">
    <Label>D&D BEYOND · CHARACTER RECORD</Label>
    <h2>The character <em>sheet.</em></h2>
    <p className="body-muted">Two complementary views: the current D&D Beyond character sheet and the last DM-reviewed PDF snapshot. A static PDF will not update automatically.</p>
    <div className="sheet-link-grid">
      <article className="sheet-link-card"><Icon name="external" size={26}/><span>LIVE CHARACTER</span><h3>D&D Beyond</h3>
        <p>{character.beyondUrl?'Visit this character in D&D Beyond.':'A direct D&D Beyond character URL has not been supplied yet.'}</p>
        {character.beyondUrl?<a className="btn btn-outline" href={character.beyondUrl} target="_blank" rel="noopener noreferrer">Open character sheet <Icon name="external" size={16}/></a>:<small className="sheet-awaiting">LINK NOT YET ATTACHED</small>}
      </article>
      <article className="sheet-link-card"><Icon name="scroll" size={26}/><span>APPROVED EXPORT</span><h3>PDF snapshot</h3>
        <p>{pdf?'View the most recent DM-reviewed exported character sheet.':'No approved PDF export has been added to this character yet.'}</p>
        {pdf?<a className="btn btn-outline" href={pdf} target="_blank" rel="noopener noreferrer">View PDF snapshot <Icon name="external" size={16}/></a>:<small className="sheet-awaiting">PDF NOT YET ATTACHED</small>}
      </article>
    </div>
    <p className="sheet-footnote">Character links may require D&D Beyond login or sharing permissions. Every PDF committed to GitHub Pages is publicly accessible; approve each export before publishing it.</p>
  </div>;
}
function CharacterDicePanel({character}:{character:Character}) {
  const {events,loading,error}=usePublishedRolls();
  const {content}=useCampaignContent();
  const rolls=useMemo(()=>characterRolls(events,character.id),[events,character.id]);
  const stats=useMemo(()=>summarize(rolls),[rolls]);
  const trophies=useMemo(()=>diceTrophies(rolls),[rolls]);
  const days=useMemo(()=>rollNights(rolls),[rolls]);
  const played=content.achievements.filter(a=>a.characterId===character.id);
  return <div className="character-chronicle">
    <Label>GAME LOG · CHARACTER RECORD</Label><h2>Dice & <em>achievements.</em></h2>
    <p className="body-muted">RollWarden-inspired personal history: raw die faces, modifiers, totals, memorable rolls and trophies. Only published, validated game events count. No unverified luck ratings or fabricated statistics.</p>
    <div className="character-dice-stats">{[
      ['D20 FACES',stats.d20s],['NATURAL 20S',stats.natural20s],
      ['NATURAL 1S',stats.natural1s],['AVG RAW D20',stats.average===null?'—':stats.average.toFixed(2)],
      ['CONFIRMED CRITS',stats.confirmedCrits]
    ].map(([label,value])=><div key={label}><span>{label}</span><strong>{loading?'…':value}</strong></div>)}</div>
    {error&&<p role="alert" className="dice-import-notice">Published roll feed unavailable: {error}</p>}
    {!loading&&rolls.length===0&&<p className="dice-import-notice">No verified dice events have been published for {character.name} yet. These counters describe the published archive, not everything rolled at the table.</p>}
    <div className="record-heading"><h3>The trophy case</h3><span>{played.length+trophies.filter(t=>t.unlocked).length} UNLOCKED</span></div>
    <div className="character-award-grid">
      {played.map(a=><article className="character-award is-unlocked" key={a.id}><span>✦ PLAYED STORY MILESTONE</span><h4>{a.title}</h4><p>{a.description}</p><small>CONFIRMED IN PLAY</small></article>)}
      {trophies.map(t=><article className={'character-award '+(t.unlocked?'is-unlocked':'is-locked')} key={t.id}><span>{t.unlocked?'✦ DICE TROPHY':'◇ LOCKED DICE TROPHY'}</span><h4>{t.title}</h4><p>{t.description}</p><small>{t.unlocked?'UNLOCKED · '+new Date(t.unlockedAt as string).toLocaleDateString():Math.min(t.current,t.target)+' / '+t.target+' VERIFIED'}</small></article>)}
    </div>
    <div className="record-heading"><h3>Personal Game Log</h3><span>{rolls.length} VERIFIED EVENTS</span></div>
    {rolls.length?<div className="character-roll-list">{rolls.slice(0,12).map(e=>{
      const raw=e.dice.filter(d=>d.sides===20&&d.kept).map(d=>d.face);
      return <div className="character-roll-row" key={e.event_id}><div><strong>{e.roll_type.replaceAll('_',' ')}</strong><small>{new Date(e.occurred_at).toLocaleString()}</small></div><span>RAW {raw.join('/')||'—'} · MOD {e.modifier_total>=0?'+':''}{e.modifier_total}</span><strong>{e.total}</strong></div>;
    })}</div>:<p className="body-muted">Game Log entries will appear here when an approved event export is published.</p>}
    {days.length>0&&<div className="night-summary"><h3>Recorded play dates</h3>{days.slice(0,8).map(day=><p key={day.date}><span>{day.date} UTC</span><span>{day.rolls} events · {day.natural20s} nat 20 · {day.natural1s} nat 1</span></p>)}</div>}
    <div className="centered"><Action href={'#/dice?character='+encodeURIComponent(character.id)} variant="outline">Open full Dice Chronicle</Action></div>
  </div>;
}
function CharacterPage({id}:{id:string}) {
 const character=characters.find(c=>c.id===id);
 const [tab,setTab]=useState<'overview'|'timeline'|'chronicle'|'sheet'>('overview');
 useEffect(()=>setTab('overview'),[id]);
 if(!character)return <main id="main-content" tabIndex={-1} className="container"><EmptyState heading="The name is not in our records" detail="This character could not be found in the Green Iguanas roster."/><Action href="#/" variant="outline">Return to the homepage</Action></main>;
 return <main id="main-content" tabIndex={-1} style={{'--character-accent':character.accent} as React.CSSProperties}>
   <section className="container dossier-top"><a className="breadcrumb" href="#/">THE GREEN IGUANAS <Icon name="chevron" size={12}/> DOSSIER {character.index}</a>
    <div className="dossier-layout"><div className="dossier-portrait"><PlaceholderArt character={character} large/></div>
     <div className="dossier-copy"><Label>CHARACTER FILE {character.index} / 05</Label><h1>{character.name}</h1><p className="dossier-kicker">{character.descriptor}</p><div className="accent-line"/><p className="dossier-description">{character.highlight}</p>
      <div className="dossier-details"><DetailBox label="CLASS" value={character.class}/><DetailBox label="LEVEL" value={character.level}/><DetailBox label="ANCESTRY" value={character.ancestry}/><DetailBox label="SHEET BACKGROUND" value={character.background}/></div>
      {character.sheetSnapshot?<div className="sheet-stat-group"><div className="sheet-stat-head">VERIFIED PDF SNAPSHOT <span>UPDATED {character.sheetSnapshot.asOf}</span></div><div className="dossier-details"><DetailBox label="ARMOR CLASS" value={character.sheetSnapshot.armorClass??null}/><DetailBox label="MAXIMUM HP" value={character.sheetSnapshot.maxHitPoints??null}/><DetailBox label="MOVEMENT" value={character.sheetSnapshot.speed??null}/><DetailBox label="INITIATIVE" value={character.sheetSnapshot.initiative??null}/></div></div>:<div className="sheet-pending">Current sheet mechanics await a verified D&D Beyond PDF export.</div>}
      <div className="dossier-actions"><a className="btn btn-outline" href={'#/dice?character='+character.id}><Icon name="dice" size={16}/> Character Dice Log</a><span className="muted-action"><Icon name="scroll" size={16}/>{character.sheetPdf||character.beyondUrl?'Character sheet available':'Sheet PDF / link not attached'}</span></div>
     </div>
    </div>
   </section>
   <div className="tab-wrapper"><div className="container tab-row" role="group" aria-label={character.name+' sections'}>{(['overview','timeline','chronicle','sheet'] as const).map(item=><button type="button" key={item} aria-pressed={tab===item} className={tab===item?'selected':''} onClick={()=>setTab(item)}>{item==='overview'?'Background & Story':item==='timeline'?'The Journey':item==='chronicle'?'Dice & Achievements':'D&D Beyond Sheet'}</button>)}</div></div>
   <section className="container dossier-body">
    {tab==='overview'?<div className="dossier-columns character-story-layout"><div><Label>THE CHARACTER'S ORIGIN</Label><h2>Deeds behind <em>the name.</em></h2><p className="body-muted">{character.biography??'Character history is still being documented.'}</p>
      <div className="character-story-sections">{character.profileSections.map((section,i)=><article className="character-story-chapter" key={i}><span>{String(i+1).padStart(2,'0')}{section.status==='concept'?' / CHARACTER CONCEPT, NOT CANON':' / CHARACTER HISTORY'}</span><h3>{section.title}</h3><p>{section.text}</p></article>)}</div>
      </div><div className="dossier-side"><div className="small-panel"><Icon name="scroll" size={23}/><h3>Character sheet</h3><p>See the living D&D Beyond sheet or a reviewed PDF snapshot when attached.</p><span>SHEET TAB</span></div><div className="small-panel"><Icon name="trophy" size={23}/><h3>Dice & achievements</h3><p>See the character's story achievements, verified rolls and trophy unlocks.</p><span>CHRONICLE TAB</span></div></div>
    </div>:tab==='timeline'?(character.moments.length?<div className="moments-list"><Label>RECORDED CHARACTER MOMENTS</Label><h2>The path <em>so far.</em></h2>{character.moments.map((moment,i)=><article className="moment-entry" key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{moment.title}</h3><p>{moment.description}</p></div></article>)}</div>:<EmptyState glyph="hourglass" heading="The introduction awaits" detail="No played moments are confirmed for this character yet."/>):tab==='chronicle'?<CharacterDicePanel character={character}/>:<CharacterSheetPanel character={character}/>}
   </section>
   <div className="container dossier-next"><span>CONTINUE THE STORY</span><a href={'#/character/'+characters[(characters.indexOf(character)+1)%characters.length].id}>NEXT DOSSIER <strong>{characters[(characters.indexOf(character)+1)%characters.length].name}</strong><Icon name="arrow" size={22}/></a></div>
 </main>;
}

function DiceChronicle() {
 const [bundle,setBundle]=useState<{events:RollEvent[];label:string;mode:'demo'|'import'|'published'}|null>(null);
 useEffect(()=>{let cancelled=false;fetch(`${import.meta.env.BASE_URL}data/rolls.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Public roll feed unavailable');return r.json()}).then(raw=>{const events=validateEvents(raw);if(events.some(e=>e.visibility!=='public'))throw new Error('Public feed contains restricted events');if(!cancelled&&events.length) setBundle(prev=>prev??{events,label:'published campaign export',mode:'published'});}).catch(()=>{/* Missing feed leaves the honest empty state. */});return()=>{cancelled=true}},[]);
 const [character,setCharacter]=useState(()=>{const chosen=new URLSearchParams(window.location.hash.split('?')[1]??'').get('character');return characters.some(c=>c.id===chosen)?chosen as string:'all'});
 const [kind,setKind]=useState('all');
 const [query,setQuery]=useState('');
 const [error,setError]=useState('');
 const input=useRef<HTMLInputElement>(null);
 const filtered=useMemo(()=> (bundle?.events||[]).filter(e=>(character==='all'||e.character_external_id===character)&&(kind==='all'||e.roll_type===kind)&&(query===''||`${e.event_id} ${e.session_external_id ?? ''} ${e.total}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>b.occurred_at.localeCompare(a.occurred_at)),[bundle,character,kind,query]);
 const stats=useMemo(()=>summarize(filtered),[filtered]);
 async function handleImport(file:File|undefined){
   if(!file)return;
   try {if(file.size>5*1024*1024)throw new Error('File too large (5 MB maximum).'); const parsed=JSON.parse(await file.text()); const events=validateEvents(parsed); setBundle({events,label:file.name,mode:'import'});setError('');setCharacter('all');setKind('all');setQuery('');}
   catch(e){setError(e instanceof Error?e.message:'Could not read that file.');}
   if(input.current)input.current.value='';
 }
 const characterName=(id:string)=>characters.find(c=>c.id===id)?.name||id;
 return <main id="main-content" tabIndex={-1}><PageIntro eyebrow="THE ARCHIVE / II" title={<>Dice <em>Chronicle.</em></>} description="Behind every impossible victory and spectacular failure is a roll worth remembering. Explore the record with the mathematics kept honest."/>
  <section className="container dice-workspace">
  <div className="workspace-banner"><div><div className="banner-eyebrow"><span className="status-dot"/>{bundle?.mode==='demo'?'DEMONSTRATION MODE':bundle?.mode==='import'?'LOCAL IMPORT / UNVERIFIED':bundle?.mode==='published'?'PUBLISHED CAMPAIGN EXPORT':'AWAITING PUBLISHED EVENTS'}</div><h2>{bundle?'Your current viewing session':'A legend in the making.'}</h2><p>{bundle?.mode==='demo'?'These fictitious rolls are strictly demonstration data. They are not campaign history.':bundle?.mode==='import'?`Showing ${bundle.events.length} locally imported events from ${bundle.label}. This file has not been authenticated against TableOS.`:bundle?.mode==='published'?`Displaying ${bundle.events.length} approved public events from the campaign export. Raw faces and modifiers are kept distinct.`:'There are no published rolls yet. Load clearly marked sample rolls to explore the interface, or import a JSON export locally.'}</p></div>
  <div className="workspace-actions"><input type="file" accept=".json,application/json" hidden ref={input} onChange={e=>handleImport(e.target.files?.[0])}/><button type="button" className="btn btn-outline" onClick={()=>input.current?.click()}><Icon name="upload" size={17}/> Import JSON</button>{bundle?<button type="button" className="btn btn-quiet" onClick={()=>{setBundle(null);setError('');}}>Clear session</button>:<button type="button" className="btn btn-primary" onClick={()=>{setBundle({events:demoRolls,label:'Fictitious demonstration set',mode:'demo'});setError('');}}><Icon name="spark" size={17}/> Try demo data</button>}</div></div>
  {error&&<div role="alert" className="import-error">{error}</div>}
  <div className="dice-filters"><div className="filter-title"><Icon name="filter" size={17}/> FILTER THE RECORD</div><div className="filter-controls"><label><span>CHARACTER</span><select value={character} onChange={e=>setCharacter(e.target.value)}><option value="all">All characters</option>{characters.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label><span>ROLL TYPE</span><select value={kind} onChange={e=>setKind(e.target.value)}><option value="all">All types</option><option value="attack">Attacks</option><option value="ability_check">Ability checks</option><option value="saving_throw">Saving throws</option><option value="other">Other</option></select></label><label className="dice-search"><span>SEARCH EVENTS</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Event ID, session, result…"/></label></div></div>
  <div className="stat-grid">{[{label:'D20 FACES',value:stats.d20s|| (bundle?'0':'—'),note:'Kept d20 results'},{label:'NATURAL 20S',value:bundle?stats.natural20s:'—',note:'Raw faces of 20'},{label:'NATURAL 1S',value:bundle?stats.natural1s:'—',note:'Raw faces of 1'},{label:'AVERAGE RAW D20',value:stats.average===null?'—':stats.average.toFixed(2),note:'Unmodified mean'}].map((s,i)=><div className="stat-card" key={s.label}><div className="stat-head"><span>{s.label}</span><span>0{i+1}</span></div><strong>{s.value}</strong><small>{s.note}</small></div>)}</div>
  <div className="analytics-grid"><div className="analytics-panel"><div className="panel-heading"><div><Label>ROLL DISTRIBUTION</Label><h3>Twenty faces. <em>Endless possibilities.</em></h3></div><span className="panel-index">01 / 02</span></div>{stats.d20s>0?<><div className="distribution" role="img" aria-label="Raw kept d20 face distribution">{stats.distribution.map((count,i)=><div className="bar-column" key={i}><span className="bar-count">{count||''}</span><div className={`bar ${i===0||i===19?'bar-special':''}`} style={{height:`${Math.max(3,(count/Math.max(...stats.distribution))*100)}%`}} title={`Face ${i+1}: ${count} rolls`}/><span className="bar-label">{i+1}</span></div>)}</div><p className="chart-footnote">Based on {stats.d20s} kept raw d20 faces. Advantage/disadvantage discarded dice are excluded. Interpret small samples cautiously.</p></>:<EmptyState glyph="dice" heading="Nothing to chart yet" detail="The face distribution will appear when dice events are loaded."/>}</div>
  <div className="analytics-panel records-panel"><div className="panel-heading"><div><Label>THE LOGBOOK</Label><h3>Roll <em>history.</em></h3></div><span className="panel-index">02 / 02</span></div>{filtered.length?<div className="roll-list">{filtered.slice(0,30).map(e=>{const d=e.dice.find(d=>d.sides===20&&d.kept);return <div className="roll-row" key={e.event_id}><div className={`roll-face ${d?.face===20?'nat20':d?.face===1?'nat1':''}`}>{d?.face??'—'}</div><div className="roll-description"><strong>{characterName(e.character_external_id)}</strong><span>{e.roll_type.replaceAll('_',' ')} · {new Date(e.occurred_at).toLocaleDateString()}</span></div><div className="roll-total"><span>RAW {d?.face??'—'} · MOD {e.modifier_total>=0?'+':''}{e.modifier_total}</span><strong>{e.total}</strong></div></div>})}</div>:<EmptyState glyph="scroll" heading="An empty ledger" detail="No events match the current filters. Import an export or try demonstration data."/>}</div></div>
  <div className="dice-disclaimer"><Icon name="shield" size={19}/><div><strong>Integrity of the record</strong><p>Imported JSON is validated locally, not authenticated. The production ingestion service will enforce event IDs, role-based permissions, deduplication and signatures. Critical hits are recorded only when explicitly supplied for attack rolls.</p></div></div>
 </section></main>;
}

const archiveSections = [
  {name:'Adventure Journal',href:'#/journal',glyph:'book' as Glyph,description:'Session recaps, major discoveries and memorable moments.'},
  {name:'Quests & Mysteries',href:'#/quests',glyph:'compass' as Glyph,description:'Ongoing, completed, failed and unresolved storylines.'},
  {name:'People & Places',href:'#/archive',glyph:'scroll' as Glyph,description:'NPCs, factions, locations and their connections.'},
  {name:'Dragonbowl',href:'#/dragonbowl',glyph:'trophy' as Glyph,description:'Opponents, tournament matches and outcomes.'},
  {name:'Party Treasury',href:'#/treasury',glyph:'coins' as Glyph,description:'Shared riches, discoveries and important assets.'},
  {name:'Achievements',href:'#/achievements',glyph:'spark' as Glyph,description:'Milestones earned by the company and its members.'}
];
function WorldArchive(){const [search,setSearch]=useState('');const {content}=useCampaignContent();const items=archiveSections.filter(x=>`${x.name} ${x.description}`.toLowerCase().includes(search.toLowerCase()));return <main id="main-content" tabIndex={-1}><PageIntro eyebrow="THE ARCHIVE / III" title={<>World <em>Archive.</em></>} description="A growing encyclopedia of the people, places, pursuits, and legends that shape our world."/><section className="container directory-section"><div className="directory-toolbar"><span className="directory-count">EXPLORE THE INDEX <span>06 COLLECTIONS</span></span><label className="search-field"><Icon name="search" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search collections" aria-label="Search archive collections"/></label></div><div className="archive-cards">{items.map((section,i)=><a href={section.href} key={section.name} className="archive-tile"><span className="archive-number">{String(i+1).padStart(2,'0')}</span><Icon name={section.glyph} size={32}/><h3>{section.name}</h3><p>{section.description}</p><span>EXPLORE COLLECTION <Icon name="arrow" size={17}/></span></a>)}</div>{content.npcs.length>0&&<div className="world-npcs"><SectionTitle eyebrow="KNOWN TO THE PARTY" title={<>People <em>we’ve met.</em></>}/><div className="record-grid">{content.npcs.map(n=><article className="record-entry" key={n.id}><span className="record-star">✦</span><h3>{n.name}</h3><p>{n.description}</p></article>)}</div></div>}{!items.length&&<EmptyState glyph="search" heading="No matching collection" detail="Try a broader search."/>}<div className="directory-note"><Icon name="lock" size={17}/>This public archive contains only player-known material. Keep unrevealed DM notes outside the public repository.</div></section></main>}

function StorySoFar(){
 const artUrl=(src:string)=>import.meta.env.BASE_URL+src;
 return <div className="cinema-chronicle">
   <header className="cinema-prologue" id="story-top">
     <div className="cinema-prologue-light" aria-hidden="true"/>
     <div className="cinema-prologue-content container">
       <span className="cinema-kicker">THE GREEN IGUANAS / A LIVING CAMPAIGN</span>
       <h1>Previously, in the <em>Green Iguanas…</em></h1>
       <p>From a midnight museum caper to the roaring arena beneath Mount Waterdeep. Seven chapters of adventures, legends and unfinished business.</p>
       <div className="cinema-prologue-utility">
         <button type="button" className="cinema-scroll-link" onClick={()=>document.getElementById("story-chapters")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}>Enter the story <Icon name="chevron" size={17}/></button>
         <span>SCROLL TO REVISIT THE CAMPAIGN</span>
       </div>
     </div>
   </header>
   <div className="cinema-chapter-index container" aria-label="Chapter navigation">
     {storyChapters.map((chapter,i)=><button type="button" key={chapter.id} onClick={()=>document.getElementById("chapter-"+chapter.id)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})} aria-label={"Jump to "+chapter.title}><span>{String(i+1).padStart(2,'0')}</span><strong>{chapter.title}</strong></button>)}
   </div>
   <div className="cinema-chapters" id="story-chapters">{storyChapters.map((chapter,i)=>
      <article key={chapter.id} className={'cinema-chapter cinema-chapter--'+chapter.mood+(i%2?' cinema-chapter--right':'')} id={'chapter-'+chapter.id} aria-labelledby={'chapter-title-'+chapter.id}>
       <div className="cinema-chapter-hero">
         <img src={artUrl(chapter.hero.src)} alt={chapter.hero.alt} className="cinema-chapter-image" loading={i<2?'eager':'lazy'} decoding="async" onError={e=>{e.currentTarget.style.display='none'}}/>
         <div className="cinema-chapter-shade" aria-hidden="true"/>
         <div className="cinema-chapter-glow" aria-hidden="true"/>
         <div className="cinema-chapter-caption"><span>THE GREEN IGUANAS</span><span>{chapter.hero.caption}</span></div>
         <div className="cinema-chapter-content container">
           <div className="cinema-chapter-copy">
             <div className="cinema-chapter-topline"><span>CHAPTER {String(i+1).padStart(2,'0')} / {String(storyChapters.length).padStart(2,'0')}</span><span className={chapter.status==='confirmed'?'cinema-confirmed':'cinema-pending'}>{chapter.status==='confirmed'?'RECORDED HISTORY':'DETAILS TO VERIFY'}</span></div>
             <span className="cinema-chapter-kicker">{chapter.kicker}</span>
             <h2 id={'chapter-title-'+chapter.id}>{chapter.title}</h2>
             <p className="cinema-chapter-description">{chapter.summary}</p>
             <span className="cinema-chapter-signature">THE GREEN IGUANAS <i aria-hidden="true">✦</i> {chapter.hero.label}</span>
           </div>
         </div>
       </div>
       {chapter.gallery.length>0&&<div className="cinema-gallery-wrap">
         <div className="container cinema-gallery">
           <div className="cinema-gallery-label"><span>SCENES FROM THE CHAPTER</span><small>ORIGINAL ARTWORK & OTHER PERSPECTIVES</small></div>
           <div className="cinema-gallery-grid">{chapter.gallery.map((art,index)=>
             <a key={art.src} href={artUrl(art.src)} className="cinema-memory" target="_blank" rel="noopener noreferrer" aria-label={'Open illustration: '+art.caption}>
               <span className="cinema-memory-image"><img src={artUrl(art.src)} loading="lazy" decoding="async" alt={art.alt} onError={e=>{e.currentTarget.style.display='none'}}/></span>
               <span className="cinema-memory-meta"><small>{String(index+1).padStart(2,'0')} · {art.label}</small><strong>{art.caption}</strong><Icon name="external" size={16}/></span>
             </a>
           )}</div>
         </div>
       </div>}
      </article>
   )}</div>
   <footer className="cinema-epilogue">
     <span className="cinema-kicker">OUR STORY IS STILL BEING WRITTEN</span>
     <h2>Next stop: <em>The Dandy War Dolls.</em></h2>
     <p>The Green Iguanas' first Dragonbowl victory is on the record. What happens in the quarterfinal will only become history after it is played.</p>
     <div className="cinema-end-links"><Action href="#/dragonbowl" variant="outline">The Dragonbowl</Action><Action href="#/" variant="outline">Return to the Heroes</Action></div>
     <small>ARTISTIC RENDITIONS OF CAMPAIGN EVENTS · ILLUSTRATIONS DO NOT VERIFY UNRECORDED DETAILS</small>
   </footer>
 </div>;
}

function DragonbowlMatch({match,round}:{match:BracketMatch;round:BracketRound['id']}) {
 const known=match.status==='final';
 const next=match.status==='upcoming';
 const isParty=(name:string|null)=>name==='THE GREEN IGUANAS';
 const names=[match.teamA,match.teamB];
 return <article className={['dragon-bracket-match','dragon-bracket-match--'+match.status,(names.some(isParty)?'dragon-bracket-match--iguana':'')].join(' ')} aria-label={match.kicker+': '+(match.teamA??'To be determined')+' versus '+(match.teamB??'To be determined')}>
   <div className="dragon-bracket-match-head">
     <span className="dragon-match-state">{known?'FINAL':next?'UP NEXT':match.status==='unverified'?'RESULT PENDING':'TBD'}</span>
     <span className="dragon-match-id">{match.id.replaceAll('-',' ').toUpperCase()}</span>
   </div>
   {names.map((name,i)=><div key={i} className={['dragon-match-team',name&&isParty(name)?'is-iguana':'',known&&name===match.winner?'is-winner':''].filter(Boolean).join(' ')}>
     <span className="dragon-match-team-mark" aria-hidden="true">{name&&isParty(name)?'✦':name?'◈':'·'}</span>
     <span className="dragon-match-team-name">{name??'To be determined'}</span>
     {round==='round-of-16'&&name&&<span className="dragon-team-odds" title="Original whole-tournament winning odds">{dragonbowlOddsByTeam[name]??'—'}</span>}
     {known&&name===match.winner&&<Icon name="check" size={15}/>}
   </div>)}
   {next&&<div className="dragon-match-bout">CONFIRMED QUARTERFINAL · 5 VS 5</div>}
 </article>;
}

function DragonbowlOverview(){
 const [activeRound,setActiveRound]=useState<BracketRound['id']>('round-of-16');
 const bracketView=useRef<HTMLDivElement>(null);
 const openRound=(round:BracketRound['id'])=>{
   setActiveRound(round);
   const target=bracketView.current?.querySelector<HTMLElement>('[data-round="'+round+'"]');
   if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'start'});
 };
 return <div className="dragon-tournament">
   <section className="container tournament-section" aria-labelledby="dragon-tournament-heading">
     <div className="tournament-head"><Label>DRAGONBOWL XLIX · BENEATH MOUNT WATERDEEP</Label>
       <h2 id="dragon-tournament-heading">The road to <em>glory.</em></h2>
       <p>Sixteen teams entered the Blood Games. One Green Iguanas victory is confirmed, and their next opponent is already on the board. Every other result stays open until the table establishes what happened.</p>
     </div>
     <div className="tournament-highlights">
       <div><span>LAST CONFIRMED VICTORY</span><strong>Green Iguanas over Cackle Crew</strong><small>Round of 16 · Played</small></div>
       <div><span>NEXT ESTABLISHED BOUT</span><strong>Dandy War Dolls</strong><small>Quarterfinal · 5 vs 5 · Not yet played</small></div>
       <div><span>CHAMPION'S PRIZE</span><strong>{dragonbowlFacts.prize}</strong><small>Plus Platinum Dragonbowl Rings</small></div>
     </div>
     <div className="dragon-bracket-head">
       <div><span className="dragon-bracket-kicker">SINGLE ELIMINATION · 16 TEAMS</span><h3>Championship Bracket</h3></div>
       <div className="dragon-bracket-legend"><span><i className="dragon-legend-final"/>Played result</span><span><i className="dragon-legend-next"/>Known next bout</span><span><i className="dragon-legend-pending"/>Awaiting confirmation</span></div>
     </div>
     <div className="dragon-round-shortcuts" aria-label="Jump between tournament rounds">{dragonbowlBracket.map(round=>
        <button type="button" key={round.id} onClick={()=>openRound(round.id)} className={activeRound===round.id?'active':''} aria-label={'Show '+round.title}>{round.title}</button>
     )}</div>
     <div className="dragon-bracket-viewport" ref={bracketView} role="region" tabIndex={0} aria-label="Dragonbowl tournament bracket. Scroll horizontally to see all rounds.">
       <div className="dragon-bracket-board">
         {dragonbowlBracket.map((round,index)=><section key={round.id} data-round={round.id} className={'dragon-bracket-round dragon-bracket-round--'+round.id} aria-labelledby={'dragon-round-'+round.id}>
           <header className="dragon-bracket-round-head"><span>0{index+1} / 04</span><div><h4 id={'dragon-round-'+round.id}>{round.title}</h4><small>{round.subtitle}</small></div></header>
           {round.matches.map((match,i)=>{const span=2**index;return <div className="dragon-bracket-slot" key={match.id} style={{gridRow:`${2+i*span} / span ${span}`}}>
              <DragonbowlMatch match={match} round={round.id}/>
           </div>})}
         </section>)}
       </div>
     </div>
     <div className="dragon-bracket-notes">
       <div><Icon name="shield" size={19}/><p><strong>What is confirmed:</strong> the Green Iguanas defeated Cackle Crew, then drew a known quarterfinal against Dandy War Dolls. A listed opening pairing does not prove its fight has been played or won.</p></div>
       <div><Icon name="coins" size={19}/><p><strong>About the odds:</strong> the small ratios beside Round One teams are their original <em>whole-tournament winner odds</em>, not single-bout prices. Green Iguanas opened at <strong>100:1</strong>; bets retain their purchase odds.</p></div>
     </div>
   </section>
   <section className="dragon-history-section">
     <div className="container">
       <div className="dragon-history-heading"><Label>BEHIND THE BLOOD GAMES</Label><h2>Welcome to <em>Dragonbowl XLIX.</em></h2><p>Deep beneath Mount Waterdeep, the forty-ninth Dragonbowl brings together sixteen competing teams, festival spectacle and a dangerous path toward the championship.</p></div>
       <div className="dragon-history-grid">
         <article><span>01 / THE SPECTACLE</span><h3>Festival of Champions</h3><p>The Green Iguanas arrived to an arena festival of opening celebrations, the Gladiators' Salute and Blood Challenges. Events included Stirge Shooting, Lava Leaping, Halfling Tossing and Beast Chase. Individual results and prizes remain unrecorded.</p></article>
         <article><span>02 / THE FACES</span><h3>Masters of Ceremony</h3><p>Osmois Tearlock handled the team's registration. Obi Dew Diva is the extravagant arena announcer; Peaborg is the blue dragonborn official associated with the tournament draw.</p></article>
         <article><span>03 / THE STAKES</span><h3>One Surviving Champion Team</h3><p>The grand prize is {dragonbowlFacts.prize} shared by surviving winners, plus Platinum Dragonbowl Rings. The Green Iguanas entered as 100:1 long shots against favorites such as the Ghostmakers at 5:1.</p></article>
       </div>
       <div className="dragon-history-road" aria-label="Green Iguanas tournament journey">
         <div className="dragon-history-road-item is-done"><small>ENTRY / PLAYED</small><strong>Under Mount Waterdeep</strong><p>The team registered and experienced the opening festivities.</p></div>
         <div className="dragon-history-road-item is-done"><small>ROUND ONE / VICTORY</small><strong>Cackle Crew Defeated</strong><p>Bobby's axe, Owen's tiger form, Indigo's crowd work and Freed's severed-arm triumph marked the victory.</p></div>
         <div className="dragon-history-road-item is-next"><small>QUARTERFINAL / UP NEXT</small><strong>The Dandy War Dolls</strong><p>The established five-on-five matchup has not yet been played. The party advances to level 7 if it reaches the semifinals.</p></div>
       </div>
     </div>
   </section>
 </div>;
}

function Collection({kind}:{kind:'journal'|'quests'|'dragonbowl'|'treasury'|'achievements'}){
 const {content}=useCampaignContent();
 if(kind==='journal') return <main id="main-content" tabIndex={-1}><StorySoFar/></main>;
 if(kind==='dragonbowl') return <main id="main-content" tabIndex={-1}><PageIntro eyebrow="THE TOURNAMENT / XLIX" title={<>Dragon<em>bowl.</em></>} description="Sixteen teams. Eight opening bouts. One crown. Follow the Green Iguanas' progress through the Blood Games."/><DragonbowlOverview/></main>;
 const entries = kind==='quests' ? content.quests.map(x=>({key:x.id,title:x.title,details:`${x.status} · ${x.summary}`})) : kind==='achievements' ? content.achievements.map(x=>({key:x.id,title:x.title,details:x.description})) : [];
 const cfg={journal:{overline:'CAMPAIGN RECORDS / IV',title:'Previously…',description:'The Green Iguanas’ story so far, gathered into broad chapters. No invented session dates or numbered recaps.',glyph:'book' as Glyph,empty:'The first entry awaits',detail:'No verified session recaps have been published yet. Entries will feature dates, illustrated moments, participants and linked discoveries.'},quests:{overline:'STORYLINES / V',title:'Quests & Mysteries',description:'Some threads are resolved. Others are waiting to be pulled.',glyph:'compass' as Glyph,empty:'No quests published',detail:'This record will track active, completed, failed and unresolved quests with their NPC, place and session backlinks.'},dragonbowl:{overline:'THE TOURNAMENT / VI',title:'Dragonbowl',description:'An arena for the names, matches, and outcomes that deserve to be remembered.',glyph:'trophy' as Glyph,empty:'The tournament records await',detail:'Opponents, matches, results and major Dragonbowl developments will appear after verified details are entered.'},treasury:{overline:'THE COMPANY / VII',title:'Party Treasury',description:'What we carry tells part of our story.',glyph:'coins' as Glyph,empty:'The treasury ledger is empty',detail:'Shared currency, meaningful discoveries and party assets will be tracked after an authorized DM entry.'},achievements:{overline:'THE COMPANY / VIII',title:'Achievements',description:'Not every victory is measured in gold.',glyph:'spark' as Glyph,empty:'No achievements certified',detail:'Achievements will be earned from verified campaign milestones and TableOS dice records, never invented.'}}[kind];
 return <main id="main-content" tabIndex={-1}><PageIntro eyebrow={cfg.overline} title={<>{cfg.title.split(' ').slice(0,-1).join(' ')} <em>{cfg.title.split(' ').slice(-1)}</em></>} description={cfg.description}/><section className="container collection-body"><div className="collection-section-label"><span>{'THE COMPLETE RECORD'}</span><span>{entries.length} PUBLISHED ENTRIES</span></div>{entries.length?<div className="record-grid">{entries.map(entry=><article className="record-entry" key={entry.key}><span className="record-star">✦</span><h3>{entry.title}</h3><p>{entry.details}</p></article>)}</div>:<EmptyState glyph={cfg.glyph} heading={cfg.empty} detail={cfg.detail}/>}<div className="centered"><Action href="#/archive" variant="outline">Return to World Archive</Action></div></section></main>
}
function Restricted({mode}:{mode:'account'|'dm'}){return <main id="main-content" tabIndex={-1}><PageIntro eyebrow="THE VAULT / RESTRICTED" title={mode==='account'?<>Player <em>Access.</em></>:<>DM <em>Sanctum.</em></>} description="Private campaign information belongs behind actual authentication and database-level access controls."/><section className="container collection-body"><EmptyState glyph="lock" heading="Secure access is not yet enabled" detail="This first public release does not collect passwords or store personal notes. Player sign-in and DM publishing tools will appear only after secure backend configuration and permission tests."/></section></main>}
export default function App(){const route=useRoute();let page:React.ReactNode;
 useEffect(()=>{
    const names:Record<string,string>={'/':'The Living Chronicle','/party':'The Living Chronicle','/dice':'Dice Chronicle','/journal':'Previously in the Green Iguanas','/archive':'World Archive','/dragonbowl':'Dragonbowl','/quests':'Quests','/treasury':'Party Treasury','/achievements':'Achievements'};
    const member=route.startsWith('/character/')?characters.find(c=>c.id===route.split('/')[2]):null;
    document.title=`${member?.name ?? names[route] ?? 'Green Iguanas'} | The Green Iguanas`;
 },[route]);
 if(route==='/'||route==='')page=<Home/>;
 else if(route==='/party')page=<Home/>;
 else if(route.startsWith('/character/'))page=<CharacterPage id={route.split('/')[2]}/>;
 else if(route==='/dice')page=<DiceChronicle/>;
 else if(route==='/archive')page=<WorldArchive/>;
 else if(['journal','quests','dragonbowl','treasury','achievements'].includes(route.replace('/','')))page=<Collection kind={route.slice(1) as 'journal'|'quests'|'dragonbowl'|'treasury'|'achievements'}/>;
 else if(route==='/account'||route==='/dm')page=<Restricted mode={route==='/dm'?'dm':'account'}/>;
 else page=<WorldArchive/>;
 return <div className={(route==='/'||route==='/party') ? 'site-shell site-shell--home' : 'site-shell'}><a href="#main-content" className="skip-link" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}}>Skip to content</a><div className="ambient ambient-a"/><div className="ambient ambient-b"/><SiteHeader route={route}/>{page}</div>
}
