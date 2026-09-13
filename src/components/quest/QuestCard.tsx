import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import type { Quest } from '@/types';
import { CATEGORY_LABELS, formatDuration } from '@/utils/format';

interface QuestCardProps {
  quest: Quest;
  reasons?: string[];
  /** Generated quests say so. The user should never have to guess. */
  source?: 'local' | 'ai';
  /** Rendered under the quest. The actions differ by phase, the card does not. */
  children?: ReactNode;
}

const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * index, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function QuestCard({ quest, reasons, source = 'local', children }: QuestCardProps) {
  return (
    <motion.article
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
      className="relative w-full"
    >
      <motion.div variants={reveal} custom={0} className="flex items-start justify-between gap-4">
        <p className="sq-eyebrow pt-1">
          {CATEGORY_LABELS[quest.category]}
          {source === 'ai' && <span className="ml-2 text-accent">· generated</span>}
        </p>
        <FavoriteButton questId={quest.id} />
      </motion.div>

      <motion.h2
        variants={reveal}
        custom={1}
        className="sq-display mt-3 text-balance text-[2.6rem] leading-[0.95] xs:text-5xl sm:text-6xl lg:text-[4.25rem]"
      >
        {quest.title}
      </motion.h2>

      <motion.p
        variants={reveal}
        custom={2}
        className="mt-5 max-w-[54ch] text-pretty text-[1.0625rem] leading-relaxed text-muted sm:text-lg"
      >
        {quest.description}
      </motion.p>

      <motion.div
        variants={reveal}
        custom={3}
        className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3"
      >
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-faint">
          ~{formatDuration(quest.estimatedMinutes)}
        </span>
        <DifficultyBadge difficulty={quest.difficulty} />
      </motion.div>

      {reasons && reasons.length > 0 && (
        <motion.p variants={reveal} custom={4} className="mt-3 text-sm text-faint">
          {reasons.join(' · ')}
        </motion.p>
      )}

      {children && (
        <motion.div variants={reveal} custom={5} className="mt-9">
          {children}
        </motion.div>
      )}
    </motion.article>
  );
}
