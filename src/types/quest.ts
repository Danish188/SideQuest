export const QUEST_CATEGORIES = [
  'build',
  'learn',
  'creative',
  'outside',
  'social',
  'fitness',
  'explore',
  'random',
  'digital',
  'offline',
] as const;

export const MOODS = ['productive', 'creative', 'chill', 'social', 'adventurous'] as const;

export const CONTEXTS = ['home', 'outside', 'computer', 'anywhere'] as const;

export const DIFFICULTIES = ['easy', 'medium', 'unhinged'] as const;

/** Minutes the user says they have. Quests are matched against this ceiling. */
export const TIME_BUDGETS = [10, 30, 60, 120] as const;

export type QuestCategory = (typeof QUEST_CATEGORIES)[number];
export type Mood = (typeof MOODS)[number];
export type QuestContext = (typeof CONTEXTS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type TimeBudget = (typeof TIME_BUDGETS)[number];

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  estimatedMinutes: number;
  difficulty: Difficulty;
  compatibleMoods: Mood[];
  compatibleContexts: QuestContext[];
}

export interface QuestPreferences {
  timeAvailable: TimeBudget;
  mood: Mood;
  context: QuestContext;
  difficulty: Difficulty;
}

/** A completed or abandoned run of a quest, kept for history and stats. */
export interface QuestRecord {
  questId: string;
  completedAt: string;
}

export type QuestPhase =
  | 'idle'
  | 'configuring'
  | 'generating'
  | 'previewing'
  | 'asking'
  | 'active'
  | 'confirming'
  | 'complete';
