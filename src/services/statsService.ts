import { getQuestById } from '@/data/quests';
import type { QuestCategory, QuestState, Stats, StreakState } from '@/types';

/** Milestones the mascot makes a fuss about. */
export const MILESTONES = [3, 5, 10, 25, 50] as const;

export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  const start = new Date(`${from}T00:00:00`).getTime();
  const end = new Date(`${to}T00:00:00`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.POSITIVE_INFINITY;
  return Math.round((end - start) / 86_400_000);
}

/**
 * A streak counts consecutive *days* with at least one completion, not quests.
 * Finishing five quests in one evening is one day of momentum, not five.
 */
export function advanceStreak(streak: StreakState, today = toDateKey()): StreakState {
  if (streak.lastCompletedDate === today) return streak;

  const gap = streak.lastCompletedDate ? daysBetween(streak.lastCompletedDate, today) : null;
  const current = gap === 1 ? streak.current + 1 : 1;

  return {
    current,
    longest: Math.max(streak.longest, current),
    lastCompletedDate: today,
  };
}

/**
 * A streak that was not extended yesterday is already over, so it is reported as
 * broken on read rather than waiting for the next completion to notice.
 */
export function resolveStreak(streak: StreakState, today = toDateKey()): StreakState {
  if (!streak.lastCompletedDate) return streak;
  const gap = daysBetween(streak.lastCompletedDate, today);
  if (gap <= 1) return streak;
  return { ...streak, current: 0 };
}

export function favoriteCategory(state: QuestState): QuestCategory | null {
  const counts = new Map<QuestCategory, number>();

  for (const record of state.completed) {
    const quest = getQuestById(record.questId);
    if (!quest) continue;
    counts.set(quest.category, (counts.get(quest.category) ?? 0) + 1);
  }

  let best: QuestCategory | null = null;
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }

  return best;
}

export function computeStats(state: QuestState): Stats {
  const streak = resolveStreak(state.streak);

  return {
    totalCompleted: state.completed.length,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    favoriteCategory: favoriteCategory(state),
  };
}

/** The highest milestone newly reached by this completion, if any. */
export function milestoneReached(total: number, alreadyCelebrated: number[]): number | null {
  const hit = MILESTONES.find(
    (milestone) => total === milestone && !alreadyCelebrated.includes(milestone),
  );
  return hit ?? null;
}
