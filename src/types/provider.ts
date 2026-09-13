import type { Quest, QuestPreferences } from './quest';

export interface QuestRequest {
  /** Absent for "Surprise Me", where the user skipped the questionnaire. */
  preferences?: QuestPreferences;
  /** Quests shown in the last few draws — avoided so users don't see repeats. */
  recentIds: string[];
  /** Quests the user already finished, deprioritised but not banned forever. */
  completedIds: string[];
  /** Titles of recent quests. The model has no idea what our ids mean. */
  recentTitles?: string[];
}

export interface QuestSuggestion {
  quest: Quest;
  /** 0-1 confidence that this quest fits the request. Drives copy, not layout. */
  score: number;
  /** Short human-readable reasons, e.g. "fits 30 min". */
  reasons: string[];
  /** One line from the companion about this specific quest. AI provider only. */
  companionLine?: string;
  /** Where this came from, so the UI can be honest about it. */
  source: 'local' | 'ai';
}

/**
 * The seam between the UI and whatever is choosing quests.
 *
 * `LocalQuestProvider` scores a bundled dataset; `AIQuestProvider` calls a
 * backend. Neither is imported by a component, which is why `suggest` is async
 * even though the local implementation has nothing to await.
 */
export interface QuestProvider {
  readonly id: string;
  suggest(request: QuestRequest): Promise<QuestSuggestion>;
}

export class NoQuestFoundError extends Error {
  constructor(message = 'No quest matched that combination.') {
    super(message);
    this.name = 'NoQuestFoundError';
  }
}
