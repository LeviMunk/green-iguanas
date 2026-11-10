import { dragonbowlOpeningOdds } from './campaign.ts';

/**
 * Public tournament record. The source document mixes actual play with DM prep;
 * planned winners NEVER appear here as completed results.
 */
export type MatchStatus = 'final' | 'upcoming' | 'unverified' | 'pending';
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

const unverified = (id:string, teamA:string, teamB:string):BracketMatch=>({
  id,teamA,teamB,status:'unverified',winner:null,
  kicker:'DRAW LISTED · RESULT UNVERIFIED',
  description:'This pairing appears in the campaign planning record; its played outcome has not been confirmed.'
});
const pending = (id:string):BracketMatch=>({
  id,teamA:null,teamB:null,status:'pending',winner:null,
  kicker:'AWAITING RESULTS',description:'Participants will be entered when earlier rounds are confirmed.'
});

export const dragonbowlBracket:BracketRound[] = [
  {id:'round-of-16',title:'Round of 16',subtitle:'8 opening contests',matches:[
    {
      id:'r16-green-cackle',teamA:'THE GREEN IGUANAS',teamB:'The Cackle Crew',
      status:'final',winner:'THE GREEN IGUANAS',kicker:'FINAL · PLAYED',
      description:'Green Iguanas defeated Cackle Crew in their first Dragonbowl fight.'
    },
    unverified('r16-dandy-wild','The Dandy War Dolls','Wild Cats'),
    unverified('r16-twisted-shifty','Twisted Firestarters','Shifty Blades of Gray'),
    unverified('r16-apocalypse-stokey','Apocalypse Drow','Stokey and the Bandits'),
    unverified('r16-ghost-old','The Ghostmakers','The Old Guard'),
    unverified('r16-furry-orphans','The Furry & The Furious','The Awful Orphans'),
    unverified('r16-kiss-lizard','Kiss of Death','Lizard Blizzard'),
    unverified('r16-scimitar-machine','Scimitar Sisters','Green Machine')
  ]},
  {id:'quarterfinals',title:'Quarterfinals',subtitle:'4 contests',matches:[
    {
      id:'qf-green-dandy',teamA:'THE GREEN IGUANAS',teamB:'The Dandy War Dolls',
      status:'upcoming',winner:null,kicker:'UP NEXT · CONFIRMED',
      description:'Known next matchup: five Green Iguanas against five Dandy War Dolls. Not yet played.'
    },
    pending('qf-other-1'),pending('qf-other-2'),pending('qf-other-3')
  ]},
  {id:'semifinals',title:'Semifinals',subtitle:'2 contests',matches:[
    pending('sf-1'),pending('sf-2')
  ]},
  {id:'final',title:'Championship',subtitle:'The final contest',matches:[
    pending('final')
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
