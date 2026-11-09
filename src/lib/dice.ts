export const CHARACTER_IDS = ['bobby-kills','indigo','owen','freed','heilbrun'] as const;
export type RollKind = 'attack' | 'ability_check' | 'saving_throw' | 'other';
export type DieFace = { sides: number; face: number; kept: boolean };
export type RollEvent = {
  schema_version: '1.0';
  event_id: string;
  source: string;
  occurred_at: string;
  campaign_external_id: string;
  session_external_id: string | null;
  character_external_id: string;
  roll_type: RollKind;
  dice: DieFace[];
  modifier_total: number;
  total: number;
  critical_hit: boolean | null;
  visibility: 'public' | 'members' | 'dm';
};
export type RollBundle = { label: string; events: RollEvent[]; demonstration: boolean };

export function validateEvents(raw: unknown): RollEvent[] {
  const source = Array.isArray(raw) ? raw : raw && typeof raw === 'object' && 'events' in raw ? (raw as {events: unknown}).events : null;
  if (!Array.isArray(source)) throw new Error('Expected an array of events or an object containing an events array.');
  if (source.length > 10000) throw new Error('For safety, import a maximum of 10,000 events at once.');
  const ids = new Set<string>();
  return source.map((entry: unknown, index: number): RollEvent => {
    const e = entry as Partial<RollEvent> | null;
    const fail = (reason: string): never => { throw new Error(`Event ${index + 1}: ${reason}`); };
    if (!e || typeof e !== 'object') return fail('not an object');
    if (e.schema_version !== '1.0') return fail('unsupported schema_version');
    if (typeof e.event_id !== 'string' || e.event_id.length < 1 || e.event_id.length > 180) return fail('invalid event_id');
    if (ids.has(e.event_id)) return fail('duplicate event_id in import');
    ids.add(e.event_id);
    if (typeof e.source !== 'string' || !e.source) return fail('missing source');
    if (typeof e.occurred_at !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:\d{2})$/.test(e.occurred_at) || Number.isNaN(Date.parse(e.occurred_at))) return fail('timestamp must include timezone');
    if (e.campaign_external_id !== 'green-iguanas') return fail('unexpected campaign_external_id');
    if (!CHARACTER_IDS.includes(e.character_external_id as typeof CHARACTER_IDS[number])) return fail('unrecognized character_external_id');
    if (!['attack','ability_check','saving_throw','other'].includes(e.roll_type ?? '')) return fail('invalid roll_type');
    if (!Array.isArray(e.dice) || !e.dice.length || e.dice.length > 100) return fail('missing/invalid dice');
    for (const die of e.dice) {
      if (!die || !Number.isInteger(die.sides) || die.sides < 2 || die.sides > 100 || !Number.isInteger(die.face) || die.face < 1 || die.face > die.sides || typeof die.kept !== 'boolean') return fail('invalid die face');
    }
    if (!Number.isInteger(e.modifier_total) || !Number.isInteger(e.total)) return fail('modifier and total must be integers');
    const diceSum = e.dice.filter(d => d.kept).reduce((s, d) => s + d.face, 0);
    if (diceSum + (e.modifier_total as number) !== e.total) return fail('kept dice + modifier_total must equal total');
    if (!(e.critical_hit === null || typeof e.critical_hit === 'boolean')) return fail('invalid critical_hit');
    if (e.roll_type !== 'attack' && e.critical_hit === true) return fail('critical_hit can only be true for attack rolls');
    if (!['public','members','dm'].includes(e.visibility ?? '')) return fail('invalid visibility');
    if (e.session_external_id !== null && (typeof e.session_external_id !== 'string' || !e.session_external_id)) return fail('invalid session_external_id');
    return e as RollEvent;
  });
}

export function d20Faces(events: RollEvent[]): number[] {
  return events.flatMap(event => event.dice.filter(die => die.sides === 20 && die.kept).map(die => die.face));
}

export function summarize(events: RollEvent[]) {
  const faces = d20Faces(events);
  const distribution = Array.from({ length: 20 }, (_, i) => faces.filter(x => x === i + 1).length);
  return {
    events: events.length,
    d20s: faces.length,
    natural20s: faces.filter(face => face === 20).length,
    natural1s: faces.filter(face => face === 1).length,
    average: faces.length ? faces.reduce((a, b) => a + b, 0) / faces.length : null,
    distribution,
    confirmedCrits: events.filter(e => e.critical_hit === true).length,
  };
}
