import type { Difficulty, Quest, QuestPreferences } from '@/types';
import { DIFFICULTIES } from '@/types';

export interface ScoredQuest {
  quest: Quest;
  score: number;
  reasons: string[];
}

const WEIGHTS = {
  mood: 30,
  difficultyExact: 26,
  difficultyAdjacent: 11,
  contextExact: 20,
  contextAnywhere: 13,
  timeFit: 22,
  recentlyShown: -60,
  alreadyCompleted: -14,
  jitter: 9,
} as const;

/** How far apart two difficulties are on the easy → medium → unhinged scale. */
function difficultyDistance(a: Difficulty, b: Difficulty): number {
  return Math.abs(DIFFICULTIES.indexOf(a) - DIFFICULTIES.indexOf(b));
}

export function fitsTimeBudget(quest: Quest, minutes: number): boolean {
  return quest.estimatedMinutes <= minutes;
}

export function fitsContext(quest: Quest, context: QuestPreferences['context']): boolean {
  if (context === 'anywhere') return true;
  return quest.compatibleContexts.includes(context) || quest.compatibleContexts.includes('anywhere');
}

/**
 * Rewards quests that use most of the time the user offered. With two hours free,
 * a ten-minute quest is a technically valid but disappointing answer.
 */
function timeFitRatio(quest: Quest, minutes: number): number {
  return Math.min(quest.estimatedMinutes / minutes, 1);
}

export function scoreQuest(
  quest: Quest,
  preferences: QuestPreferences,
  recentIds: ReadonlySet<string>,
  completedIds: ReadonlySet<string>,
): ScoredQuest {
  const reasons: string[] = [];
  let score = 0;

  if (quest.compatibleMoods.includes(preferences.mood)) {
    score += WEIGHTS.mood;
    reasons.push(`Suits a ${preferences.mood} mood`);
  }

  const gap = difficultyDistance(quest.difficulty, preferences.difficulty);
  if (gap === 0) {
    score += WEIGHTS.difficultyExact;
    reasons.push(`${preferences.difficulty} difficulty, as ordered`);
  } else if (gap === 1) {
    score += WEIGHTS.difficultyAdjacent;
  }

  if (preferences.context !== 'anywhere' && quest.compatibleContexts.includes(preferences.context)) {
    score += WEIGHTS.contextExact;
    reasons.push('Works where you are');
  } else if (quest.compatibleContexts.includes('anywhere')) {
    score += WEIGHTS.contextAnywhere;
  }

  const ratio = timeFitRatio(quest, preferences.timeAvailable);
  score += WEIGHTS.timeFit * (0.35 + 0.65 * ratio);
  if (ratio >= 0.5) {
    reasons.push(`Fills your ${preferences.timeAvailable} minutes`);
  } else {
    reasons.push('Leaves time to spare');
  }

  if (recentIds.has(quest.id)) score += WEIGHTS.recentlyShown;
  if (completedIds.has(quest.id)) {
    score += WEIGHTS.alreadyCompleted;
  } else {
    reasons.push('You have not done this one');
  }

  score += Math.random() * WEIGHTS.jitter;

  return { quest, score, reasons: reasons.slice(0, 3) };
}

/** Squashes a raw score into the 0-1 range the UI uses for confidence copy. */
export function normaliseScore(score: number): number {
  const best = WEIGHTS.mood + WEIGHTS.difficultyExact + WEIGHTS.contextExact + WEIGHTS.timeFit;
  return Math.max(0, Math.min(1, score / best));
}
