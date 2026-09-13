import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { useQuestStore } from '@/hooks/useQuestStore';
import type { HistoryEntry } from '@/hooks/useQuestStore';
import { CATEGORY_LABELS, formatDuration, relativeDayLabel } from '@/utils/format';

type Filter = 'all' | 'favorites';

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const { quest, completedAt } = entry;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.22 }}
      className="border-b border-line py-5 first:pt-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="sq-eyebrow">{CATEGORY_LABELS[quest.category]}</p>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">{quest.title}</h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <DifficultyBadge difficulty={quest.difficulty} />
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-faint">
              {formatDuration(quest.estimatedMinutes)}
            </span>
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-faint">
              {relativeDayLabel(completedAt)}
            </span>
          </div>
        </div>

        <FavoriteButton questId={quest.id} />
      </div>
    </motion.li>
  );
}

export function HistoryPage() {
  const { history, state } = useQuestStore();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? history : history.filter((e) => state.favorites.includes(e.quest.id))),
    [filter, history, state.favorites],
  );

  return (
    <PageShell
      title="History"
      lede="Everything you have finished, most recent first. Star the ones worth doing twice."
    >
      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
          <p className="text-muted">Nothing here yet.</p>
          <Link
            to="/"
            className="mt-4 inline-block font-medium text-accent underline-offset-4 hover:underline"
          >
            Go and finish one
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-1.5">
            {(['all', 'favorites'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`tap-target rounded-xl px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === option
                    ? 'bg-ink text-canvas'
                    : 'border border-line text-muted hover:text-ink'
                }`}
              >
                {option === 'all' ? `All ${history.length}` : `Favourites ${state.favorites.length}`}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-muted">No favourites yet.</p>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {visible.map((entry) => (
                  <HistoryRow key={`${entry.quest.id}-${entry.completedAt}`} entry={entry} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}
    </PageShell>
  );
}
