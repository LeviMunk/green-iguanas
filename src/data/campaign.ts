export type SheetSnapshot = {
  asOf: string; // ISO date of last approved D&D Beyond PDF export
  armorClass?: number;
  maxHitPoints?: number;
  speed?: string;
  initiative?: string;
  passivePerception?: number;
  abilityScores?: Partial<Record<'strength'|'dexterity'|'constitution'|'intelligence'|'wisdom'|'charisma',number>>;
};

export type Character = {
  id: string;
  name: string;
  givenInitials: string;
  index: string;
  accent: string;
  portrait: string | null;
  class: string | null;
  level: number | null;
  ancestry: string | null;
  background: string | null;
  biography: string | null;
  beyondUrl: string | null;
  sheetSnapshot?: SheetSnapshot | null;
};

// This is the complete verified Phase 1 roster. Null = not supplied/verified.
// No mechanical stats, portraits or backstories are synthesized.
export const characters: Character[] = [
  { id: 'bobby-kills', name: 'Bobby Kills', givenInitials: 'BK', index: '01', accent: '#af805c', portrait: null, class: null, level: null, ancestry: null, background: null, biography: null, beyondUrl: null },
  { id: 'indigo', name: 'Indigo', givenInitials: 'IN', index: '02', accent: '#7594aa', portrait: null, class: null, level: null, ancestry: null, background: null, biography: null, beyondUrl: null },
  { id: 'owen', name: 'Owen', givenInitials: 'OW', index: '03', accent: '#91a186', portrait: null, class: null, level: null, ancestry: null, background: null, biography: null, beyondUrl: null },
  { id: 'freed', name: 'Freed', givenInitials: 'FR', index: '04', accent: '#a88caa', portrait: null, class: null, level: null, ancestry: null, background: null, biography: null, beyondUrl: null },
  { id: 'heilbrun', name: 'Heilbrun', givenInitials: 'HE', index: '05', accent: '#c5aa69', portrait: null, class: null, level: null, ancestry: null, background: null, biography: null, beyondUrl: null },
];

export const campaign = {
  title: 'The Green Iguanas',
  tagline: 'TableOS runs the game. Green Iguanas preserves the adventure.',
  characterCount: characters.length,
};
