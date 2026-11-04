export type RoleType = 'TANK' | 'FIGHTER' | 'MAGE' | 'MARKSMAN' | 'ASSASSIN' | 'SUPPORT';

export interface HeroSkill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldownTurns: number;
  effectType: 'DAMAGE_BOOST' | 'HEAL' | 'SHIELD' | 'HINT' | 'DOUBLE_EXP';
  effectValue: number;
  iconName: string;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  role: RoleType;
  description: string;
  quote: string;
  avatarUrl: string;
  baseHp: number;
  baseMana: number;
  attackPower: number;
  defense: number;
  speed: number;
  skills: HeroSkill[];
  skins: {
    id: string;
    name: string;
    colorScheme: string;
    unlocked: boolean;
  }[];
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
  effect: string;
  statBonus: {
    attack?: number;
    defense?: number;
    hp?: number;
    speed?: number;
    expBonus?: number;
  };
  consumable?: boolean;
}

export interface MathQuestion {
  id: string;
  prompt: string;
  expression: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  propertyRule: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  contextTag?: string;
}

export interface Monster {
  id: string;
  name: string;
  title: string;
  zoneId: number;
  hp: number;
  attack: number;
  rewardExp: number;
  rewardGold: number;
  description: string;
  questions: MathQuestion[];
}

export interface BossPhase {
  phase: number;
  title: string;
  ruleTitle: string;
  description: string;
  hp: number;
  question: MathQuestion;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  totalHp: number;
  phases: BossPhase[];
  rewardExp: number;
  rewardGold: number;
}

export interface Zone {
  id: number;
  slug: string;
  name: string;
  ruleFormula: string;
  conceptTitle: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  monsters: Monster[];
  bossMonster?: Monster;
  questTitle: string;
  questDescription: string;
  expReward: number;
  goldReward: number;
}

export interface PlayerProfile {
  name: string;
  school: string;
  classGrade: string;
  selectedHeroId: string;
  selectedSkinId: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  gold: number;
  highestZoneUnlocked: number;
  completedZones: number[];
  completedQuests: string[];
  inventory: { itemId: string; quantity: number }[];
  equippedItems: string[];
  badges: string[];
  battlesWon: number;
  battlesTotal: number;
  assessmentTaken: boolean;
  assessmentScore?: number;
  assessmentAnswers?: number[];
  lastPlayed: string;
}

export interface AssessmentQuestion {
  id: number;
  category: 'MULTIPLICATION' | 'DIVISION' | 'POWER_OF_POWER' | 'NEGATIVE_POWER' | 'ZERO_POWER' | 'MIXED_OPERATIONS';
  topic: string;
  vocationalContext: string; // e.g. Teknik Komputer & Jaringan, Teknik Otomotif, Teknik Elektronika, Akuntansi
  cognitiveLevel: 'C3' | 'C4';
  question: string;
  expression: string;
  options: string[];
  correctIndex: number;
  stepByStepSolution: string;
}

export interface DiscussionComment {
  id: string;
  author: string;
  authorRole: 'MURID' | 'GURU' | 'ADMIN';
  avatarHero: string;
  content: string;
  timestamp: string;
  likes: number;
  pinned?: boolean;
  replies?: DiscussionComment[];
}

export interface ChatMessage {
  id: string;
  channel: 'TIM' | 'GLOBAL' | 'GURU' | 'COACH';
  sender: string;
  senderRole: 'MURID' | 'GURU' | 'COACH';
  text: string;
  timestamp: string;
}

export interface StudentScoreRecord {
  id: string;
  nis: string;
  name: string;
  classGroup: string;
  hero: string;
  level: number;
  zonesCompleted: number;
  score: number;
  completedAt: string;
  status: 'LULUS' | 'REMEDIAL';
}

export interface TeacherSettings {
  chatEnabled: boolean;
  classCode: string;
  className: string;
  academicYear: string;
}

