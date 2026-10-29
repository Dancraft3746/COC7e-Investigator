// ========================================================
// Call of Cthulhu 7th Edition & Keeper's Companion
// Master TypeScript Schema
// ========================================================

export type VitalsState =
  | 'Healthy'
  | 'MinorInjury'
  | 'MajorWound'
  | 'Unconscious'
  | 'Dying'
  | 'InstantDeath';

export type SanityState =
  | 'Sane'
  | 'Shock'
  | 'Changed'
  | 'IndefiniteInsanity'
  | 'PermanentInsanity';

export type PanicReaction5F =
  | 'Fight'
  | 'Flight'
  | 'Freeze'
  | 'Fawn'
  | 'Flop'
  | 'None';

export type DiceBotPrefix = '.ra' | 'cc' | '.r';

export interface Characteristics {
  STR: number;
  CON: number;
  DEX: number;
  APP: number;
  POW: number;
  INT: number;
  SIZ: number;
  EDU: number;
  LUCK: number;
}

export interface CharacteristicModifiers {
  STR: number;
  CON: number;
  DEX: number;
  APP: number;
  POW: number;
  INT: number;
  SIZ: number;
  EDU: number;
  LUCK: number;
}

export interface InvestigatorProfile {
  name: string;
  job: string;
  player: string;
  age: number;
  gender: string;
  era: string;
  avatarUrl?: string;
  birthplace?: string;
  residence?: string;
  description?: string;
  creationMethod?: string;
  specialAbility?: string;

  // Realtime vitals
  hp: number;
  mp: number;
  san: number;
  luck: number;
  majorWound: boolean;
  shock: boolean;
  changed: boolean;
  panic5F: PanicReaction5F;
  keyConnectionIndex: number; // 0-9 index in backstory elements
}

export interface SkillItem {
  id: string;
  name: string;
  category?: 'Combat' | 'Interpersonal' | 'Academic' | 'Practical' | 'Language' | 'Custom';
  base: number;
  occ: number;
  interest: number;
  growth: number;
  total: number;
  checked: boolean;
}

export interface WeaponItem {
  id: string;
  name: string;
  skillName: string;
  damage: string;
  range: string;
  attacksPerRound: string;
  currentAmmo: number;
  maxAmmo: number;
  malfunction: number;
  notes: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  armorPoints: number;
  vsBulletsOnly?: boolean;
  notes?: string;
  isEquipped: boolean;
}

export interface TomeItem {
  id: string;
  name: string;
  language: string;
  status: 'Unread' | 'Skimmed' | 'Studied' | 'Mastered' | string;
  sanLoss: string;
  mythosGain: number;
  studyTime: string;
  spells: string;
  notes?: string;
}

export interface SpellItem {
  id: string;
  name: string;
  cost: string;
  castTime: string;
  source: string;
  desc: string;
}

export interface EntityItem {
  id: string;
  category: '舊日支配者/外神' | '神話生物/眷族' | '邪教組織' | '神話造物與神器' | string;
  name: string;
  aliases?: string;
  sanLossSuccess?: string;
  sanLossFailure?: string;
  hasEncountered?: boolean;
  notes: string;
}

export interface ContactItem {
  id: string;
  name: string;
  relation: string;
  role: string;
  notes: string;
  isKeyConnection?: boolean;
}

export interface ChronicleItem {
  id: string;
  title: string;
  type: string;
  kp: string;
  date: string;
  sanReward: string;
  mythosGain: number;
  luckGain: number;
  notes: string;
}

export interface BackstoryElement {
  title: string;
  content: string;
  rewritten?: string; // If changed by Changed state
}

export interface InvestigatorData {
  id: string;
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean; // For dead or retired investigators
  investigator: InvestigatorProfile;
  characteristics: Characteristics;
  ageModifiers?: CharacteristicModifiers;
  skills: SkillItem[];
  weapons: WeaponItem[];
  armors?: ArmorItem[];
  tomes: TomeItem[];
  spells: SpellItem[];
  entities: EntityItem[];
  contacts: ContactItem[];
  chronicles: ChronicleItem[];
  backstory?: BackstoryElement[];
}

export interface CharacterSummary {
  id: string;
  name: string;
  job: string;
  age: number;
  hp: number;
  maxHP: number;
  san: number;
  updatedAt: number;
  isArchived?: boolean;
}
