import type { Quest, QuestCategory, QuestPreferences, QuestRecord } from './quest';

export interface StreakState {
  current: number;
  longest: number;
  /** ISO date (YYYY-MM-DD) of the most recent completion, used to extend or reset. */
  lastCompletedDate: string | null;
}

export interface AppSettings {
  /** Ask "did you actually do it?" before a quest counts. On by default. */
  confirmCompletion: boolean;
}

export interface QuestState {
  completed: QuestRecord[];
  favorites: string[];
  recentlyShown: string[];
  /** The quest the user accepted and has not yet finished or abandoned. */
  activeQuestId: string | null;
  acceptedAt: string | null;
  streak: StreakState;
  preferences: QuestPreferences | null;
  /** Milestone counts already celebrated, so the mascot doesn't repeat itself. */
  celebratedMilestones: number[];
  /**
   * Quests the model invented, kept so History and Stats can still resolve them.
   * A generated quest exists nowhere else once the session ends.
   */
  generatedQuests: Quest[];
  settings: AppSettings;
}

export interface Stats {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: QuestCategory | null;
}

export type ThemeMode = 'light' | 'dark';
