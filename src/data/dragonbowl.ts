import { dragonbowlOpeningOdds } from './campaign.ts';

/**
 * Public tournament record. The source document mixes actual play with DM prep;
 * DM-planned winners are labeled as projected, NEVER as played results.
 */
export type MatchStatus = 'final' | 'upcoming' | 'projected' | 'unverified' | 'pending';
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
  id: 'round-of-16' | 'quarterfinals' | 'semifinals' | 'final';
  title: string;
  subtitle: string;
  matches: BracketMatch[];
};

const projected = (id:string,teamA:string,teamB:string,winner:string,description:string):BracketMatch=>({
  id,teamA,teamB,status:'projected',winner,
  kicker:'DM BRACKET PLAN · NOT A PLAYED RESULT',description
});
const future = (id:string,teamA:string,teamB:string,description:string):BracketMatch=>({
  id,teamA,teamB,status:'pending',winner:null,
  kicker:'PLANNED PATH · NOT YET PLAYED',description
});

export const dragonbowlBracket:BracketRound[] = [
  {id:'round-of-16',title:'Round of 16',subtitle:'8 opening contests',matches:[
    {
      id:'r16-green-cackle',teamA:'THE GREEN IGUANAS',teamB:'The Cackle Crew',
      status:'final',winner:'THE GREEN IGUANAS',kicker:'FINAL · PLAYED',
      description:'Green Iguanas defeated Cackle Crew in their first Dragonbowl fight.'
    },
    projected('r16-dandy-wild','The Dandy War Dolls','Wild Cats','The Dandy War Dolls','DM-set advancement to the Green Iguanas quarterfinal; opening-round play not independently recorded.'),
    projected('r16-twisted-shifty','Twisted Firestarters','Shifty Blades of Gray','Twisted Firestarters','DM-planned opening-round winner.'),
    projected('r16-apocalypse-stokey','Apocalypse Drow','Stokey and the Bandits','Apocalypse Drow','DM-planned opening-round winner.'),
    projected('r16-ghost-old','The Ghostmakers','The Old Guard','The Ghostmakers','DM-planned opening-round winner.'),
    projected('r16-furry-orphans','The Furry & The Furious','The Awful Orphans','The Furry & The Furious','DM-planned opening-round winner.'),
    projected('r16-kiss-lizard','Kiss of Death','Lizard Blizzard','Kiss of Death','DM-planned opening-round winner.'),
    projected('r16-scimitar-machine','Scimitar Sisters','Green Machine','Scimitar Sisters','DM-planned opening-round winner.')
  ]},
  {id:'quarterfinals',title:'Quarterfinals',subtitle:'4 contests',matches:[
    {
      id:'qf-green-dandy',teamA:'THE GREEN IGUANAS',teamB:'The Dandy War Dolls',
      status:'upcoming',winner:null,kicker:'UP NEXT · CONFIRMED',
      description:'Known next matchup: five Green Iguanas against five Dandy War Dolls. Not yet played.'
    },
    projected('qf-twisted-apocalypse','Twisted Firestarters','Apocalypse Drow','Twisted Firestarters','Planned winner to meet the Green Iguanas if they defeat Dandy War Dolls.'),
    projected('qf-ghost-furry','The Ghostmakers','The Furry & The Furious','The Ghostmakers','Planned winner on the opposite side of the bracket.'),
    projected('qf-kiss-scimitar','Kiss of Death','Scimitar Sisters','Kiss of Death','Planned winner to meet the Ghostmakers in the other semifinal.')
  ]},
  {id:'semifinals',title:'Semifinals',subtitle:'2 contests · projected',matches:[
    future('sf-green-twisted','THE GREEN IGUANAS','Twisted Firestarters','Projected semifinal if the Green Iguanas beat Dandy War Dolls and the Firestarters advance.'),
    future('sf-ghost-kiss','The Ghostmakers','Kiss of Death','Projected semifinal on the opposite side of the bracket.')
  ]},
  {id:'final',title:'Championship',subtitle:'The final contest · projected',matches:[
    future('final-green-ghost','THE GREEN IGUANAS','The Ghostmakers','Intended championship pairing, contingent on both teams winning their remaining matches.')
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
