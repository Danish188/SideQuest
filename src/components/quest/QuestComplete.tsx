import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useQuestStore } from '@/hooks/useQuestStore';
import type { Quest } from '@/types';

interface QuestCompleteProps {
  quest: Quest;
  milestone: number | null;
  onAgain: () => void;
}

const MILESTONE_COPY: Record<number, string> = {
  3: 'Three down. That is officially a habit forming.',
  5: 'Five quests. You are dangerously un-bored.',
  10: 'Ten. Your companion is visibly proud.',
  25: 'Twenty-five. This is a lifestyle now.',
  50: 'Fifty quests. Genuinely impressive.',
};

export function QuestComplete({ quest, milestone, onAgain }: QuestCompleteProps) {
  const { stats } = useQuestStore();
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="relative inline-block">
        {/* A single expanding ring: enough to feel like a reward, over in 700ms. */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0.5 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="absolute -inset-6 rounded-full border-2 border-accent"
          />
        )}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="sq-display relative text-[3rem] leading-[0.9] sm:text-6xl lg:text-7xl"
        >
          Quest Complete.
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="mt-6 max-w-[46ch] text-pretty text-lg text-muted"
      >
        {milestone ? MILESTONE_COPY[milestone] : `You finished ${quest.title}.`}
      </motion.p>

      <motion.dl
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.4 }}
        className="mt-8 flex gap-8"
      >
        <div>
          <dt className="sq-eyebrow">Completed</dt>
          <dd className="sq-display mt-1 text-3xl tabular-nums">{stats.totalCompleted}</dd>
        </div>
        <div>
          <dt className="sq-eyebrow">Streak</dt>
          <dd className="sq-display mt-1 text-3xl tabular-nums">{stats.currentStreak}</dd>
        </div>
      </motion.dl>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.4 }}
        className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center"
      >
        <Button size="lg" onClick={onAgain}>
          Another one
        </Button>
        <Link
          to="/history"
          className="inline-flex h-11 items-center justify-center rounded-2xl px-5 text-[0.95rem] font-medium text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          See history
        </Link>
      </motion.div>
    </div>
  );
}
