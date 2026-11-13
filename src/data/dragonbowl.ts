import { dragonbowlOpeningOdds } from './campaign.ts';

// Player-facing tournament data. Only verified outcomes and known quarterfinal
// pairings belong here. Future opponents and DM plans must remain private.
export type MatchStatus = 'final' | 'upcoming' | 'unverified';
export type BracketMatch = {
  id: string;
  teamA: string | null;
  teamB: string | null;
  status: MatchStatus;
  winner: string | null;
  kicker: string;
  description: string;
};
export type BracketRound = {
  id: 'round-of-16' | 'quarterfinals';
  title: string;
  subtitle: string;
  matches: BracketMatch[];
};
const unverified=(id:string,teamA:string,teamB:string):BracketMatch=>({
  id,teamA,teamB,status:'unverified',winner:null,
  kicker:'OPENING DRAW',description:'Opening-round result not recorded in the public archive.'
});
const quarterfinal=(id:string,teamA:string,teamB:string):BracketMatch=>({
  id,teamA,teamB,status:'unverified',winner:null,
  kicker:'QUARTERFINAL MATCHUP',description:'Quarterfinal pairing is set. No winner recorded.'
});
export const dragonbowlBracket:BracketRound[] = [
  {id:'round-of-16',title:'Round of 16',subtitle:'8 opening contests',matches:[
    {id:'r16-green-cackle',teamA:'THE GREEN IGUANAS',teamB:'The Cackle Crew',
     status:'final',winner:'THE GREEN IGUANAS',kicker:'FINAL · PLAYED',
     description:'The Green Iguanas defeated Cackle Crew in their first fight.'},
    unverified('r16-dandy-wild','The Dandy War Dolls','Wild Cats'),
    unverified('r16-twisted-shifty','Twisted Firestarters','Shifty Blades of Gray'),
    unverified('r16-apocalypse-stokey','Apocalypse Drow','Stokey and the Bandits'),
    unverified('r16-ghost-old','The Ghostmakers','The Old Guard'),
    unverified('r16-furry-orphans','The Furry & The Furious','The Awful Orphans'),
    unverified('r16-kiss-lizard','Kiss of Death','Lizard Blizzard'),
    unverified('r16-scimitar-machine','Scimitar Sisters','Green Machine')
  ]},
  {id:'quarterfinals',title:'Quarterfinals',subtitle:'4 upcoming contests',matches:[
    {id:'qf-green-dandy',teamA:'THE GREEN IGUANAS',teamB:'The Dandy War Dolls',
     status:'upcoming',winner:null,kicker:'UP NEXT',
     description:'Five Green Iguanas versus five Dandy War Dolls. Not yet played.'},
    quarterfinal('qf-twisted-apocalypse','Twisted Firestarters','Apocalypse Drow'),
    quarterfinal('qf-ghost-furry','The Ghostmakers','The Furry & The Furious'),
    quarterfinal('qf-kiss-scimitar','Kiss of Death','Scimitar Sisters')
  ]}
];

export const dragonbowlOddsByTeam = Object.fromEntries(
  dragonbowlOpeningOdds.map(team=>[team.team,team.odds])
) as Record<string,string>;

export const dragonbowlFacts = {
  edition:'XLIX',
  teams:16,
  mountain:'Mount Waterdeep',
  prize:'500,000 gp',
  additionalPrize:'Platinum Dragonbowl Rings',
  firstVictim:'Cackle Crew',
  nextOpponent:'Dandy War Dolls',
  arrivalOdds:'100:1',
  nextLevel:7
};
