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

export type CharacterSection = { title: string; text: string; status?: 'confirmed' | 'concept' };
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
  profileSections: CharacterSection[];
  sheetPdf: string | null; // Public, DM-reviewed PDF path under public/sheets/, or null.
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
    id:'bobby-kills',name:'Bobby Kills',givenInitials:'BK',index:'01',
    accent:'#af805c',portrait:'art/bobby-kills.webp',
    descriptor:'Orc barbarian · Exiled axe-wielder',
    highlight:'From the Army of Tex-ass to the Green Iguanas. Nobody forgets his axe.',
    class:'Barbarian',level:6,ancestry:'Orc',background:null,
    biography:'Bobby grew up in a small alley where his father was a celebrated smith of axes and axe accessories. After watching his best friend Joseph die on the front line, Bobby fled the Army of Tex-ass, was branded a deserter and was rejected by his father. With nowhere to go, he turned to crime before his adventures with the Green Iguanas.',
    profileSections:[
      {title:'The axe-maker’s son',text:'Bobby came from a small alley where his father was known as the mightiest maker of axes and axe accessories. That family legacy stood in sharp contrast to the path Bobby would eventually take.'},
      {title:'The Army of Tex-ass',text:'Bobby joined the Army of Tex-ass. He watched his best friend Joseph die on the front line and fled the war. The Land of Tex-ass labeled him a deserter; his father, dishonored by his actions, cast him out of the alley.'},
      {title:'A life after exile',text:'Homeless and cut off from his family, Bobby turned to a life of crime. How that road ultimately brought him to the already-established Green Iguanas has not yet been documented.'},
      {title:'The warrior today',text:'A towering green orc with a backward black cap, a cigar, skull-and-spike armor and a huge double-headed axe. During the Green Iguanas’ first Dragonbowl fight, he landed a devastating axe strike against a gnoll.'}
    ],
    moments:[{title:'Dragonbowl · Round One',description:'Delivered a devastating axe strike during the victory over Cackle Crew.'}],
    beyondUrl:null,sheetPdf:null
  },
  {
    id:'indigo',name:'Indigo',givenInitials:'IN',index:'02',
    accent:'#7594aa',portrait:'art/indigo.webp',
    descriptor:'Human bard · A voice out of time',
    highlight:'Five centuries vanished while the world carried on without him.',
    class:'Bard',level:6,ancestry:'Human',background:null,
    biography:'Indigo is 536 years old, but has experienced only 36 years of conscious life. During a previous quest he fell asleep in a pool, remained there for 500 years without aging, and awoke to a world that had carried on without him. Everyone he once loved was gone. He now travels as a charismatic bard, musician and formidable negotiator.',
    profileSections:[
      {title:'Five centuries asleep',text:'During an earlier quest, Indigo fell asleep in a pool. He did not age during the 500 years that passed around him. Though 536 years have elapsed since his birth, he has lived only 36 conscious years.'},
      {title:'A world that moved on',text:'When Indigo returned, the world he knew had continued without him. The loved ones from his former life were gone. The full circumstances of that quest and his awakening are still to be documented.'},
      {title:'The power of a voice',text:'Indigo is a skilled bard and strong negotiator, as comfortable with persuasion as performance. His distinctive navy-blue coat, lute or mandolin, and Kingfisher Mystic Ink tattoo have become part of his recognizable look.'},
      {title:'A new audience',text:'After the Green Iguanas beat Cackle Crew, Indigo hyped the arena crowd by dancing in sunglasses. He wants to celebrate the victory with a proper drinking party.'}
    ],
    moments:[{title:'The long sleep',description:'Spent 500 years asleep in a pool without aging; his previous life and loved ones were lost to time.'},{title:'Dragonbowl · Round One',description:'Celebrated the Cackle Crew victory with sunglasses, dancing and crowd hype.'}],
    beyondUrl:null,sheetPdf:null
  },
  {
    id:'owen',name:'Owen',givenInitials:'OW',index:'03',
    accent:'#91a186',portrait:'art/owen.webp',
    descriptor:'Mendicant druid · Wanderer on a Walk',
    highlight:'A pacifist by conviction, learning how difficult peace can be.',
    class:'Druid',level:6,ancestry:null,background:null,
    biography:'Owen was raised among the Mendicants, a community devoted to simplicity, mutual aid and harmony with the natural world. Six months ago he began a solitary Walk, an old Mendicant tradition of learning from the world and helping those in need. What began as a peaceful pilgrimage is testing his patience with cruelty and injustice.',
    profileSections:[
      {title:'The Mendicants',text:'The Mendicants are a community of women and men who seek simple lives in harmony with nature. Families and marriage are welcome, and newcomers may join. Some live at permanent hubs, including the one where Owen grew up; others travel in groups along nomadic routes to assist those in need.'},
      {title:'The Walk',text:'After growing up among Mendicant communities and accompanying their traveling groups, Owen chose to undertake a Walk: an old tradition of journeying alone to learn from the world and help others. Solo travel is now rare among Mendicants, but Owen demonstrated that he could care for himself. He has been traveling for approximately six months.'},
      {title:'Ideals under pressure',text:'Owen hoped to help people reconnect with the natural world. Instead, his travels exposed him to increasing cruelty and injustice. He has begun taking covert, unconventional action against corruption, including frightening corrupt merchants and limited sabotage.'},
      {title:'Peace and the primal',text:'Owen sees all Creation as one family and believes that everyone deserves justice and what they need to live safely. To him, moral or natural law comes before civil law. He considers himself a pacifist, but will use force in defense of himself or others, and his definition of necessity has become less strict. His growing supernatural power also demands that he control primal instincts as well as human anger.'},
      {title:'Friends and opposition',text:'He has no named allies recorded yet. Owen generally distrusts the rich and powerful, whose interests often clash with Mendicant ideals.'}
    ],
    moments:[{title:'Vhal Drakar’s Red Run',description:'Rode the Shadow Panther. Final race details have not yet been confirmed.'},{title:'Dragonbowl · Round One',description:'Fought in tiger wild shape, protected by Globe of Twilight, against a gnoll.'}],
    beyondUrl:null,sheetPdf:null
  },
  {
    id:'freed',name:'Freed',givenInitials:'FR',index:'04',
    accent:'#b56a62',portrait:'art/freed.webp',
    descriptor:'Fighter · Wandering monster hunter',
    highlight:'He once sought the glory of a hero. Now he carries the debt of Oakhaven.',
    class:'Fighter',level:6,ancestry:null,background:null,
    biography:'Freed grew up in Oakhaven, a farm boy eager to become a hero. His reckless confrontation with the Whispering Maw, a necrotic shambling mound, sent a burning monster into his home. Oakhaven was devastated, and Freed was banished. For eighteen years he has wandered as a monster hunter, dedicated to saving others rather than chasing glory.',
    profileSections:[
      {title:'The farm boy of Oakhaven',text:'In the quiet hamlet of Oakhaven, Freed dreamed of the horizon while his brothers tended the fields. The elders told stories of the Whispering Maw, a creature haunting the Deepwood, to keep children from wandering there. Freed saw the creature as the challenge that could make him a hero.'},
      {title:'The Whispering Maw',text:'Armed with a rusted wood-axe and a stolen vial of alchemist’s fire, he tracked a necrotic shambling mound beneath a dead willow. He hurled the fire at it, expecting an easy kill. Instead, the burning creature panicked and fled toward the hearths of Oakhaven.'},
      {title:'The tragedy',text:'Freed chased it, but reached the village too late. The monster smashed through the granary and communal hall, spreading fire and necrotic sickness. By morning the Maw was dead, but the village lay in ashes. Freed was physically unharmed and carried a terrible guilt. The survivors banished him.'},
      {title:'Eighteen years of redemption',text:'He took up the blade of a fallen villager and became a wandering hunter, joining guilds, completing quest-board contracts and helping common people. The work has earned him allies, favors, information and opportunities. His mission is to protect others from monsters, including monsters who wear human faces. He seeks not fame or wealth but to save as many lives as he can.'},
      {title:'The Eye of Freed',text:'Before entering the red dragon’s den, Freed sacrificed an eye as part of a Wish. A natural 100 on the d100 roll yielded the unique, evolving Eye of Freed. His player notes also mention ideas for a Beast Master’s Eye made with a Wish and an eye from the defeated red dragon; the relationship between those designs and the established Eye of Freed has not yet been reconciled. Specific mechanical powers await his character sheet.'},
      {title:'Blood in the arena',text:'Against Cackle Crew, Freed severed Gnashhu / King Cackle’s arm, then held it aloft in celebration after the Green Iguanas’ victory.'}
    ],
    moments:[{title:'The fall of Oakhaven',description:'His reckless battle with the Whispering Maw destroyed his home; he was banished and chose a life of protecting others.'},{title:'The Wish',description:'Sacrificed an eye, rolled a natural 100 on d100, and received the Eye of Freed.'},{title:'Dragonbowl · Round One',description:'Severed King Cackle’s arm and raised it after the team won.'}],
    beyondUrl:null,sheetPdf:null
  },
  {
    id:'heilbrun',name:'Heilbrun',givenInitials:'HE',index:'05',
    accent:'#c5aa69',portrait:'art/heilbrun.webp',
    descriptor:'High elf paladin · The quiet tempest',
    highlight:'A composed noble bearing a warhammer, glowing gold eyes and an unspoken past.',
    class:'Paladin',level:null,ancestry:'High elf',background:null,
    biography:'Heilbrun is an elegant high elf paladin with long blond hair, regal blue-and-gold armor, an ornate warhammer and glowing golden eyes. His composed, reasonable demeanor contrasts with a proposed character direction of sudden, fierce intensity. His played introduction and sworn oath are not yet established.',
    profileSections:[
      {title:'The noble exterior',text:'Heilbrun’s established visual identity is a calm, stern high elf in intricate blue, ivory and gold armor, with long blond hair, a shimmering cloak and a heavy warhammer. His eyes glow gold.'},
      {title:'A possible oath',text:'The concept under consideration is an Oath of Vengeance paladin with a Haunted One background: outwardly controlled and reasonable, but capable of unexpectedly intense action. This is a creative direction, not a locked-in oath, sheet background or played backstory.',status:'concept'},
      {title:'The unwritten chapter',text:'The guest character’s prior team, personal history, relationships and first played introduction remain unspecified. These details should be established by the player and the table before they become campaign canon.',status:'concept'}
    ],
    moments:[],
    beyondUrl:null,sheetPdf:null
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
