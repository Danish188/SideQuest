import type { Difficulty, Mood, QuestCategory, QuestContext, TimeBudget } from '@/types';

export const CATEGORY_LABELS: Record<QuestCategory, string> = {
  build: 'Build something',
  learn: 'Learn something',
  creative: 'Make something',
  outside: 'Go outside',
  social: 'Involve someone',
  fitness: 'Move',
  explore: 'Explore',
  random: 'Wildcard',
  digital: 'Digital',
  offline: 'Offline',
};

export const MOOD_LABELS: Record<Mood, string> = {
  productive: 'Productive',
  creative: 'Creative',
  chill: 'Chill',
  social: 'Social',
  adventurous: 'Adventurous',
};

export const CONTEXT_LABELS: Record<QuestContext, string> = {
  home: 'At home',
  outside: 'Outside',
  computer: 'At my computer',
  anywhere: 'Anywhere',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  unhinged: 'Unhinged',
};

export const TIME_LABELS: Record<TimeBudget, string> = {
  10: '10 minutes',
  30: '30 minutes',
  60: '1 hour',
  120: '2+ hours',
};

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return hours === 1 ? '1 hour' : `${hours % 1 === 0 ? hours : hours.toFixed(1)} hours`;
}

function formatCompletedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Groups history into "Today" / "Yesterday" / a date, for section headings. */
export function relativeDayLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);

  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;
  return formatCompletedDate(iso);
}
