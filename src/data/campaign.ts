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
  sheetName: string; // Full name on the reviewed D&D Beyond export.
  sheetHighlights?: string[]; // Concise, publicly shareable mechanical highlights.
  class: string | null;
  level: number | null;
  ancestry: string | null;
  background: string | null;
  biography: string | null;
  beyondUrl: string | null;
  sheetSnapshot?: SheetSnapshot | null;
};

// Current mechanics are transcribed from five user-provided D&D Beyond PDF exports, reviewed Nov 10, 2026.
// Heilbrun's Oath of Vengeance is explicitly player/DM-confirmed, although the export does not show it.
// PDFs are intentionally not placed under public/sheets/; only direct live D&D Beyond links appear.
export const characters: Character[] = [
  {
    id:'bobby-kills',name:'Bobby Kills',givenInitials:'BK',index:'01',
    accent:'#af805c',portrait:'art/bobby-kills.webp',
    descriptor:'Orc barbarian · Exiled axe-wielder',
    highlight:'From the Army of Tex-ass to the Green Iguanas. Nobody forgets his axe.',
    class:'Barbarian',level:6,ancestry:'Orc',background:'Soldier',
    biography:'Bobby grew up in a small alley where his father was a celebrated smith of axes and axe accessories. After watching his best friend Joseph die on the front line, Bobby fled the Army of Tex-ass, was branded a deserter and was rejected by his father. With nowhere to go, he turned to crime before his adventures with the Green Iguanas.',
    profileSections:[
      {title:'The axe-maker’s son',text:'Bobby came from a small alley where his father was known as the mightiest maker of axes and axe accessories. That family legacy stood in sharp contrast to the path Bobby would eventually take.'},
      {title:'The Army of Tex-ass',text:'Bobby joined the Army of Tex-ass. He watched his best friend Joseph die on the front line and fled the war. The Land of Tex-ass labeled him a deserter; his father, dishonored by his actions, cast him out of the alley.'},
      {title:'A life after exile',text:'Homeless and cut off from his family, Bobby turned to a life of crime. How that road ultimately brought him to the already-established Green Iguanas has not yet been documented.'},
      {title:'The warrior today',text:'A towering green orc with a backward black cap, a cigar, skull-and-spike armor and a huge double-headed axe. During the Green Iguanas’ first Dragonbowl fight, he landed a devastating axe strike against a gnoll.'}
    ],
    moments:[{title:'Dragonbowl · Round One',description:'Delivered a devastating axe strike during the victory over Cackle Crew.'}],
    sheetName:'BOBBY KILLS',beyondUrl:'https://www.dndbeyond.com/characters/161599175',sheetPdf:null,
    sheetSnapshot:{asOf:'2026-11-10',armorClass:13,maxHitPoints:59,speed:'40 ft.',initiative:'+1',passivePerception:12,abilityScores:{strength:17,dexterity:12,constitution:15,intelligence:10,wisdom:8,charisma:13}},
    sheetHighlights:['Rage · 4 uses per long rest','Adrenaline Rush · 3 uses per short rest','+3 Greataxe · +9 attack']
  },
  {
    id:'indigo',name:'Indigo',givenInitials:'IN',index:'02',
    accent:'#7594aa',portrait:'art/indigo.webp',
    descriptor:'Human bard · A voice out of time',
    highlight:'Five centuries vanished while the world carried on without him.',
    class:'Bard',level:6,ancestry:'Human',background:'Artisan',
    biography:'Indigo is 536 years old, but has experienced only 36 years of conscious life. During a previous quest he fell asleep in a pool, remained there for 500 years without aging, and awoke to a world that had carried on without him. Everyone he once loved was gone. He now travels as a charismatic bard, musician and formidable negotiator.',
    profileSections:[
      {title:'Five centuries asleep',text:'During an earlier quest, Indigo fell asleep in a pool. He did not age during the 500 years that passed around him. Though 536 years have elapsed since his birth, he has lived only 36 conscious years.'},
      {title:'A world that moved on',text:'When Indigo returned, the world he knew had continued without him. The loved ones from his former life were gone. The full circumstances of that quest and his awakening are still to be documented.'},
      {title:'The power of a voice',text:'Indigo is a skilled bard and strong negotiator, as comfortable with persuasion as performance. His distinctive navy-blue coat, lute or mandolin, and Kingfisher Mystic Ink tattoo have become part of his recognizable look.'},
      {title:'A new audience',text:'After the Green Iguanas beat Cackle Crew, Indigo hyped the arena crowd by dancing in sunglasses. He wants to celebrate the victory with a proper drinking party.'}
    ],
    moments:[{title:'The long sleep',description:'Spent 500 years asleep in a pool without aging; his previous life and loved ones were lost to time.'},{title:'Dragonbowl · Round One',description:'Celebrated the Cackle Crew victory with sunglasses, dancing and crowd hype.'}],
    sheetName:'Indigo Matthews',beyondUrl:'https://www.dndbeyond.com/characters/150861638',sheetPdf:null,
    sheetSnapshot:{asOf:'2026-11-10',armorClass:13,maxHitPoints:39,speed:'30 ft.',initiative:'+2',passivePerception:14,abilityScores:{strength:10,dexterity:15,constitution:12,intelligence:17,wisdom:12,charisma:20}},
    sheetHighlights:['Bardic Inspiration · d8, 5 uses','Cutting Words','+11 Performance and Persuasion']
  },
  {
    id:'owen',name:'Owen',givenInitials:'OW',index:'03',
    accent:'#91a186',portrait:'art/owen.webp',
    descriptor:'Mendicant druid · Wanderer on a Walk',
    highlight:'A pacifist by conviction, learning how difficult peace can be.',
    class:'Druid',level:6,ancestry:'Human',background:'Emerald Enclave Caretaker',
    biography:'Owen was raised among the Mendicants, a community devoted to simplicity, mutual aid and harmony with the natural world. Six months ago he began a solitary Walk, an old Mendicant tradition of learning from the world and helping those in need. What began as a peaceful pilgrimage is testing his patience with cruelty and injustice.',
    profileSections:[
      {title:'The Mendicants',text:'The Mendicants are a community of women and men who seek simple lives in harmony with nature. Families and marriage are welcome, and newcomers may join. Some live at permanent hubs, including the one where Owen grew up; others travel in groups along nomadic routes to assist those in need.'},
      {title:'The Walk',text:'After growing up among Mendicant communities and accompanying their traveling groups, Owen chose to undertake a Walk: an old tradition of journeying alone to learn from the world and help others. Solo travel is now rare among Mendicants, but Owen demonstrated that he could care for himself. He has been traveling for approximately six months.'},
      {title:'Ideals under pressure',text:'Owen hoped to help people reconnect with the natural world. Instead, his travels exposed him to increasing cruelty and injustice. He has begun taking covert, unconventional action against corruption, including frightening corrupt merchants and limited sabotage.'},
      {title:'Peace and the primal',text:'Owen sees all Creation as one family and believes that everyone deserves justice and what they need to live safely. To him, moral or natural law comes before civil law. He considers himself a pacifist, but will use force in defense of himself or others, and his definition of necessity has become less strict. His growing supernatural power also demands that he control primal instincts as well as human anger.'},
      {title:'Friends and opposition',text:'He has no named allies recorded yet. Owen generally distrusts the rich and powerful, whose interests often clash with Mendicant ideals.'}
    ],
    moments:[{title:'Vhal Drakar’s Red Run',description:'Rode the Shadow Panther. Final race details have not yet been confirmed.'},{title:'Dragonbowl · Round One',description:'Fought in tiger wild shape, protected by Globe of Twilight, against a gnoll.'}],
    sheetName:'Owen Shepherd',beyondUrl:'https://www.dndbeyond.com/characters/172723105',sheetPdf:null,
    sheetSnapshot:{asOf:'2026-11-10',armorClass:15,maxHitPoints:57,speed:'30 ft.',initiative:'+3',passivePerception:21,abilityScores:{strength:8,dexterity:14,constitution:14,intelligence:12,wisdom:18,charisma:10}},
    sheetHighlights:['Wild Shape · 3 uses per long rest','Staff of the Woodlands','Starry Wisp · +9 attack']
  },
  {
    id:'freed',name:'Freed',givenInitials:'FR',index:'04',
    accent:'#b56a62',portrait:'art/freed.webp',
    descriptor:'Human fighter / ranger · Wandering monster hunter',
    highlight:'He once sought the glory of a hero. Now he carries the debt of Oakhaven.',
    class:'Fighter 4 / Ranger 2',level:6,ancestry:'Human',background:'Custom Background',
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
    sheetName:'Freed Gloomshine',beyondUrl:'https://www.dndbeyond.com/characters/159982298',sheetPdf:null,
    sheetSnapshot:{asOf:'2026-11-10',armorClass:21,maxHitPoints:40,speed:'30 ft.',initiative:'+3',passivePerception:15,abilityScores:{strength:16,dexterity:17,constitution:11,intelligence:11,wisdom:14,charisma:8}},
    sheetHighlights:['Action Surge · 1 use per short rest','Improved Critical · 19–20','Hunter’s Mark · 2 free uses per long rest']
  },
  {
    id:'heilbrun',name:'Heilbrun',givenInitials:'HE',index:'05',
    accent:'#c5aa69',portrait:'art/heilbrun.webp',
    descriptor:'High elf paladin · Oath of Vengeance',
    highlight:'A golden-eyed paladin who joined the Green Iguanas at Dragonbowl XLIX.',
    class:'Paladin · Oath of Vengeance',level:6,ancestry:'Elf',background:'Haunted One',
    biography:'Heilbrun is an elegant high elf paladin with long blond hair, regal blue-and-gold armor, an ornate warhammer and glowing golden eyes. His composed, reasonable demeanor contrasts with a proposed character direction of sudden, fierce intensity. He joined the Green Iguanas at Dragonbowl XLIX. His Oath of Vengeance is confirmed; the events that led him to swear it and the circumstances of his introduction remain undocumented.',
    profileSections:[
      {title:'The noble exterior',text:'Heilbrun’s established visual identity is a calm, stern high elf in intricate blue, ivory and gold armor, with long blond hair, a shimmering cloak and a heavy warhammer. His eyes glow gold.'},
      {title:'An oath of vengeance',text:'Heilbrun is an Oath of Vengeance paladin with the Haunted One background. He presents himself with restraint, but carries a fierce sense of purpose. The precise cause of his oath and his earlier adventures are still to be documented.'},
      {title:'The fifth Iguana',text:'Heilbrun joined the Green Iguanas at Dragonbowl XLIX. His earlier company, relationships and the exact circumstances of that meeting still await the player’s history.'}
    ],
    moments:[{title:'Dragonbowl XLIX · Joined the Green Iguanas',description:'Heilbrun became the party’s fifth member at Dragonbowl. How the introduction unfolded has not yet been recorded.'}],
    sheetName:'Heilbrun Onnedros',beyondUrl:'https://www.dndbeyond.com/characters/150651437',sheetPdf:null,
    sheetSnapshot:{asOf:'2026-11-10',armorClass:18,maxHitPoints:46,speed:'30 ft.',initiative:'+1',passivePerception:18,abilityScores:{strength:18,dexterity:12,constitution:13,intelligence:8,wisdom:10,charisma:16}},
    sheetHighlights:['Oath of Vengeance · player-confirmed','Aura of Protection','Warhammer +2 · +9 attack']
  }
];

export type StoryArtwork = {
  src: string;
  alt: string;
  caption: string;
  label: string;
};
export type StoryChapter = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  status: 'confirmed' | 'details-pending';
  mood: 'museum' | 'ocean' | 'red-run' | 'freed' | 'dragon' | 'dragonbowl' | 'victory';
  hero: StoryArtwork;
  gallery: StoryArtwork[];
};

// All artwork depicts the campaign artistically. An illustration is not itself
// evidence of mounts, exact actions, ordering, or the completion of unplayed scenes.
export const storyChapters: StoryChapter[] = [
  {
    id:'museum-heist', title:'The Museum Heist', kicker:'THE RELIC THAT STARTED A RECKONING',
    summary:'Earlier campaign material references a museum heist involving a rare magical egg or Murkmire Stone, a rival crew and a chaotic escape. The relic’s ultimate fate, exact encounter details and consequences still need verification against the table record.',
    status:'details-pending', mood:'museum',
    hero:{src:'history/museum-relic.webp',alt:'Bobby Kills, Freed, Owen and Indigo inside a moonlit museum beside a glowing turquoise egg',caption:'The rare egg · museum chapter illustration',label:'THE RELIC'},
    gallery:[{src:'history/museum-original.webp',alt:'The original Green Iguanas art of the party entering a museum with a luminous egg under a glass dome',caption:'The original museum heist artwork',label:'THE FIRST CAPER'}]
  },
  {
    id:'revels-end', title:'A Voyage to Revel’s End', kicker:'BEYOND THE EDGE OF THE MAP',
    summary:'The Green Iguanas traveled by sea toward Revel’s End. Their reason for going, the people they met and the outcome of the voyage have not yet been established in the published record.',
    status:'details-pending', mood:'ocean',
    hero:{src:'history/revels-voyage.webp',alt:'The Green Iguanas on the deck of a sailing ship as the sea rises toward a coastal stronghold',caption:'The party at sea · chapter illustration',label:'SAIL THE UNKNOWN'},
    gallery:[
      {src:'history/revels-ship.webp',alt:'A tall sailing ship cuts through deep-blue ocean waves beneath large white clouds',caption:'The voyage across the open water',label:'THE PASSAGE'},
      {src:'history/indigo-sunset.webp',alt:'Indigo plays his lute on a cliff at sunset under a fiery orange sky',caption:'Indigo · a quieter moment',label:'A SONG AT SUNSET'}
    ]
  },
  {
    id:'red-run', title:'The Red Run', kicker:'DUST. TEETH. THE SOUND OF THE CROWD.',
    summary:'The Green Iguanas entered Vhal Drakar’s Red Run, a dangerous monster-racing chapter. Owen rode the Shadow Panther. The remaining mounts, wagers and final standings have not yet been verified.',
    status:'details-pending', mood:'red-run',
    hero:{src:'history/red-run-charge.webp',alt:'Owen rides a shadow panther amid a ferocious monster race while the Green Iguanas charge through the arena',caption:'Vhal Drakar’s Red Run · racing illustration',label:'THE RACE'},
    gallery:[
      {src:'history/red-run-original.webp',alt:'Monster racers surge through a red-dust canyon beneath the Red Run banner',caption:'A second view of the Red Run spectacle',label:'THE ARENA'},
      {src:'history/owen-moon.webp',alt:'Owen in hooded druid robes beneath a full moon with his owl companion',caption:'Owen · the rider of the Shadow Panther',label:'THE DRUID'}
    ]
  },
  {
    id:'eye-of-freed', title:'The Price of Sight', kicker:'ONE WISH. ONE SACRIFICE. ONE HUNDRED.',
    summary:'Before entering the red dragon’s den, Freed sacrificed one of his eyes as part of a Wish. A natural 100 on the d100 roll brought forth the Eye of Freed, an evolving artifact-grade replacement. Its exact mechanical powers still await verification against the character sheet.',
    status:'confirmed', mood:'freed',
    hero:{src:'history/freed-eye.webp',alt:'A close-up of Freed in steel armor, sword raised across his chest and a red glow visible within his visor',caption:'The Eye of Freed · character illustration',label:'THE SACRIFICE'},
    gallery:[]
  },
  {
    id:'red-dragon', title:'The Dragon’s False Fortune', kicker:'NOT ALL THAT GLITTERS IS GOLD',
    summary:'The Green Iguanas fought and defeated a red dragon. Its immense hoard was largely counterfeit: painted wooden coins, gilded cheap metal and glass. The party also freed a wizard who had been forced to manufacture the illusion of wealth.',
    status:'confirmed', mood:'dragon',
    hero:{src:'history/dragon-hoard.webp',alt:'The Green Iguanas face a gigantic red dragon perched above a hoard of glittering treasure',caption:'The red dragon’s counterfeit hoard · chapter illustration',label:'THE HOARD'},
    gallery:[
      {src:'history/dragon-original.webp',alt:'A huge crimson dragon spreads its wings inside a torchlit vaulted chamber above the four adventurers',caption:'The dragon confrontation · another perspective',label:'THE ENCOUNTER'}
    ]
  },
  {
    id:'dragonbowl-arrival', title:'Under Mount Waterdeep', kicker:'THE WORLD’S BIGGEST ARENA AWAITS',
    summary:'After freeing the captive wizard, the party gained access to an already-paid tournament entry and reached Dragonbowl XLIX beneath Mount Waterdeep. They toured the festival and entered the competition. Heilbrun joined the Green Iguanas at Dragonbowl, becoming the party’s fifth member. The precise circumstances of his arrival and earlier history remain to be documented.',
    status:'confirmed', mood:'dragonbowl',
    hero:{src:'history/dragonbowl-arrival.webp',alt:'Bobby, Freed, Owen and Indigo stand together at sunset overlooking the city and sea before Dragonbowl',caption:'Arrival at the tournament · chapter illustration',label:'A NEW ARENA'},
    gallery:[
      {src:'history/dragonbowl-airship.webp',alt:'A majestic tournament airship with a pale balloon and red trim floats through the sky',caption:'The championship airship',label:'OVER THE ARENA'},
      {src:'history/dragonbowl-tavern.webp',alt:'Bobby, Freed, Owen and Indigo gather at a feast while a blond elf paladin stands at a nearby bar',caption:'The Dragonbowl gathering · featuring Heilbrun',label:'FIFTH IGUANA'},
      {src:'history/bobby-tavern.webp',alt:'Bobby Kills sits in a warm candlelit tavern holding a drink with his massive axe nearby',caption:'Bobby · off the battlefield',label:'AFTER HOURS'}
    ]
  },
  {
    id:'cackle-crew', title:'Cackle Crew Falls', kicker:'THE UNDERDOGS HAVE ENTERED THE STORY',
    summary:'In their first Dragonbowl bout, the Green Iguanas defeated Cackle Crew. Freed severed King Cackle’s arm and held it high, Bobby delivered a devastating axe strike, Owen fought in tiger form under Globe of Twilight, and Indigo whipped the crowd into celebration. Their next known opponent is the Dandy War Dolls in the quarterfinal.',
    status:'confirmed', mood:'victory',
    hero:{src:'history/dragonbowl-victory.webp',alt:'The Green Iguanas celebrate a victorious pose beneath confetti and a tournament airship in the arena',caption:'Dragonbowl Round One · victory illustration',label:'THE VICTORY'},
    gallery:[
      {src:'history/dragonbowl-original.webp',alt:'The four adventurers pose together in a brightly lit tournament arena with banners and cheering crowds',caption:'Another view of the Dragonbowl arena',label:'THE FOUR'}
    ]
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
