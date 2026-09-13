import type { Difficulty } from '@/types';
import { DIFFICULTY_LABELS } from '@/utils/format';

const TONE: Record<Difficulty, string> = {
  easy: 'text-easy bg-easy/10',
  medium: 'text-medium bg-medium/10',
  unhinged: 'text-unhinged bg-unhinged/10',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] ${TONE[difficulty]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
