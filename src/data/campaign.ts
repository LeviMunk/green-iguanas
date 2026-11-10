export type SheetSnapshot = {
  asOf: string;
  armorClass?: number;
  maxHitPoints?: number;
  speed?: string;
  initiative?: string;
  passivePerception?: number;
  abilityScores?: Partial<Record<'strength'|'dexterity'|'constitution'|'intelligence'|'wisdom'|'charisma',number>>;
};

export type CharacterMoment = {
  title: string;
  description: string;
};

export type Character = {
  id: string;
  name: string;
  givenInitials: string;
  index: string;
  accent: string;
  portrait: string | null;
  descriptor: string;
  highlight: string;
  moments: CharacterMoment[];
  class: string | null;
  level: number | null;
  ancestry: string | null;
  background: string | null;
  biography: string | null;
  beyondUrl: string | null;
  sheetSnapshot?: SheetSnapshot | null;
};

// The party's level is 6. The guest paladin's character-sheet level is still unverified.
// Class / ancestry below come from the supplied campaign history; precise mechanics remain PDF-only.
export const characters: Character[] = [
  {
    id: 'bobby-kills', name: 'Bobby Kills', givenInitials: 'BK', index: '01',
    accent: '#af805c', portrait: 'art/bobby-kills.webp',
    descriptor: 'Orc barbarian · Double-axe powerhouse',
    highlight: 'The arena remembers the impact of his axe.',
    class: 'Barbarian', level: 6, ancestry: 'Orc', background: null,
    biography: 'A towering green orc with a backward cap, cigar, skull-and-spike armor and an enormous double-headed axe. In the Green Iguanas’ opening Dragonbowl bout, Bobby delivered a devastating strike against a gnoll.',
    moments: [
      {title:'Dragonbowl · Round One',description:'Delivered a devastating axe strike in the victory over Cackle Crew.'}
    ],
    beyondUrl: null
  },
  {
    id: 'indigo', name: 'Indigo', givenInitials: 'IN', index: '02',
    accent: '#7594aa', portrait: 'art/indigo.webp',
    descriptor: 'Human bard · Voice of the arena',
    highlight: 'Music, swagger and a flair for the spotlight.',
    class: 'Bard', level: 6, ancestry: 'Human', background: null,
    biography: 'A charismatic bard in an embroidered navy coat who plays a lute or mandolin and bears a Kingfisher Mystic Ink tattoo. After the party defeated Cackle Crew, Indigo danced in sunglasses and stirred up the crowd, ready for a victory celebration.',
    moments: [
      {title:'Dragonbowl · Round One',description:'Celebrated the Cackle Crew victory with sunglasses, dancing and arena crowd hype.'}
    ],
    beyondUrl: null
  },
  {
    id: 'owen', name: 'Owen', givenInitials: 'OW', index: '03',
    accent: '#91a186', portrait: 'art/owen.webp',
    descriptor: 'Druid · Shapechanger of the wild',
    highlight: 'Nature answers when Owen enters the fight.',
    class: 'Druid', level: 6, ancestry: null, background: null,
    biography: 'A hooded druid carrying a nature-themed staff and accompanied in his artwork by an owl. Owen rode the Shadow Panther during Vhal Drakar’s Red Run. Against Cackle Crew he fought in tiger form, protected by Globe of Twilight.',
    moments: [
      {title:'Vhal Drakar’s Red Run',description:'Rode the Shadow Panther. Race outcome and other details remain to be confirmed.'},
      {title:'Dragonbowl · Round One',description:'Used tiger wild shape under Globe of Twilight while fighting a gnoll.'}
    ],
    beyondUrl: null
  },
  {
    id: 'freed', name: 'Freed', givenInitials: 'FR', index: '04',
    accent: '#b56a62', portrait: 'art/freed.webp',
    descriptor: 'Armored fighter · Bearer of the Eye of Freed',
    highlight: 'One eye lost to a Wish. One legend gained.',
    class: 'Fighter', level: 6, ancestry: null, background: null,
    biography: 'A steel-helmed fighter with sword, shield and a single glowing red eye in his current character art. Before the red dragon’s den, Freed sacrificed an eye for a Wish. The natural 100 on the d100 roll produced the evolving Eye of Freed, a unique artifact-inspired replacement. During the Cackle Crew fight, he severed Gnashhu / King Cackle’s arm and held it aloft after the win. The Eye’s precise mechanics still await character-sheet verification.',
    moments: [
      {title:'The Wish',description:'Sacrificed an eye; rolled a natural 100 on d100 and received the Eye of Freed.'},
      {title:'Dragonbowl · Round One',description:'Severed King Cackle’s arm and raised it after the team’s victory.'}
    ],
    beyondUrl: null
  },
  {
    id: 'heilbrun', name: 'Heilbrun', givenInitials: 'HE', index: '05',
    accent: '#c5aa69', portrait: 'art/heilbrun.webp',
    descriptor: 'High elf paladin · The radiant guest',
    highlight: 'Golden eyes. Regal armor. A story still to begin.',
    class: 'Paladin', level: null, ancestry: 'High elf', background: null,
    biography: 'The fifth-character concept is an elegant high elf paladin with long blond hair, blue-and-gold armor, a warhammer and glowing golden eyes. His appearance is established by the artwork; his first played introduction, personal history and full character sheet are not yet recorded.',
    moments: [],
    beyondUrl: null
  }
];

export type StoryChapter = {
  id: string;
  title: string;
  summary: string;
  status: 'confirmed' | 'details-pending';
};

export const storyChapters: StoryChapter[] = [
  {
    id:'museum-heist',
    title:'Museum & the rare egg',
    summary:'Earlier campaign material references a museum heist, a rare magical egg or Murkmire Stone, a rival crew and an escape. The exact outcome and consequences still need to be checked against play records.',
    status:'details-pending'
  },
  {
    id:'revels-end',
    title:'Voyage to Revel’s End',
    summary:'An earlier voyage is referenced in campaign notes. Its purpose, encounters and final outcome are not yet verified.',
    status:'details-pending'
  },
  {
    id:'red-run',
    title:'Vhal Drakar’s Red Run',
    summary:'The party participated in a monster-racing chapter. Owen rode the Shadow Panther; winners, wagers and the other mounts remain unconfirmed.',
    status:'details-pending'
  },
  {
    id:'eye-of-freed',
    title:'The Wish & the Eye of Freed',
    summary:'Before the red dragon’s den, Freed sacrificed one of his eyes in a Wish, rolled a natural 100 on d100 and gained the evolving Eye of Freed. Its specific powers still need character-sheet confirmation.',
    status:'confirmed'
  },
  {
    id:'red-dragon',
    title:'The dragon’s counterfeit fortune',
    summary:'The Green Iguanas defeated a red dragon. Much of its apparently enormous hoard was fake: painted wooden coins, cheap metal and glass. They freed the wizard compelled to manufacture it.',
    status:'confirmed'
  },
  {
    id:'dragonbowl-arrival',
    title:'Beneath Mount Waterdeep',
    summary:'The freed wizard’s former party had an existing tournament entry. The Green Iguanas used that opportunity to enter Dragonbowl XLIX, explored the festival and began their arena journey.',
    status:'confirmed'
  },
  {
    id:'cackle-crew',
    title:'Cackle Crew falls',
    summary:'The Green Iguanas defeated Cackle Crew in Round One. Freed claimed King Cackle’s arm, Bobby struck hard with his axe, Owen fought as a tiger and Indigo won over the crowd.',
    status:'confirmed'
  }
];

export type TournamentOddsRow = { rank:number; team:string; odds:string; isParty?:boolean };
export const dragonbowlOpeningOdds: TournamentOddsRow[] = [
  {rank:1,team:'The Ghostmakers',odds:'5:1'},
  {rank:2,team:'Kiss of Death',odds:'6:1'},
  {rank:3,team:'Twisted Firestarters',odds:'8:1'},
  {rank:4,team:'The Dandy War Dolls',odds:'10:1'},
  {rank:5,team:'Scimitar Sisters',odds:'11:1'},
  {rank:6,team:'The Furry & The Furious',odds:'12:1'},
  {rank:7,team:'Apocalypse Drow',odds:'12:1'},
  {rank:8,team:'Shifty Blades of Gray',odds:'14:1'},
  {rank:9,team:'Green Machine',odds:'15:1'},
  {rank:10,team:'The Cackle Crew',odds:'16:1'},
  {rank:11,team:'The Awful Orphans',odds:'18:1'},
  {rank:12,team:'Wild Cats',odds:'20:1'},
  {rank:13,team:'Lizard Blizzard',odds:'22:1'},
  {rank:14,team:'Stokey and the Bandits',odds:'25:1'},
  {rank:15,team:'The Old Guard',odds:'33:1'},
  {rank:16,team:'THE GREEN IGUANAS',odds:'100:1',isParty:true}
];

export const campaign = {
  title: 'The Green Iguanas',
  tagline: 'TableOS runs the game. Green Iguanas preserves the adventure.',
  characterCount: characters.length,
  currentLevel: 6,
  tournament: 'Dragonbowl XLIX',
  location: 'Beneath Mount Waterdeep',
  lastResult: 'Defeated Cackle Crew · Round One',
  nextBout: 'Dandy War Dolls · Quarterfinal (5v5)',
  grandPrize: '500,000 gp shared among surviving champions',
  nextMilestone: 'Level 7 upon reaching the semifinals',
  openingOdds: '100:1'
};
