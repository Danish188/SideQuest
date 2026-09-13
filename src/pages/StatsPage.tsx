import { motion } from 'framer-motion';
import { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { useQuestStore } from '@/hooks/useQuestStore';
import { CATEGORY_LABELS } from '@/utils/format';

interface ToggleProps {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-6 text-left"
    >
      <span>
        <span className="block font-medium text-ink">{label}</span>
        <span className="mt-1 block text-sm text-faint">{hint}</span>
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-line'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-lift"
          style={checked ? { right: 2 } : { left: 2 }}
        />
      </span>
    </button>
  );
}

function Stat({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-line pt-5"
    >
      <p className="sq-eyebrow">{label}</p>
      {/* 30px, not 36px, below the sm breakpoint. The column is 156px wide on a
          375px phone and "something" alone renders at 171px at the larger size, so
          three of the ten category labels used to spill out of their cell. */}
      <p className="sq-display mt-2 break-words text-3xl tabular-nums sm:text-5xl">{value}</p>
    </motion.div>
  );
}

export function StatsPage() {
  const { stats, state, updateSettings, resetProgress } = useQuestStore();
  const [confirming, setConfirming] = useState(false);

  return (
    <PageShell title="Stats" lede="Four numbers. That is the whole dashboard.">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10">
        <Stat label="Quests completed" value={String(stats.totalCompleted)} index={0} />
        <Stat label="Current streak" value={`${stats.currentStreak}d`} index={1} />
        <Stat label="Longest streak" value={`${stats.longestStreak}d`} index={2} />
        <Stat
          label="Favourite category"
          value={stats.favoriteCategory ? CATEGORY_LABELS[stats.favoriteCategory] : 'None yet'}
          index={3}
        />
      </div>

      <p className="mt-10 max-w-[52ch] text-sm text-faint">
        A streak counts consecutive days with at least one completed quest, not the number of
        quests. Everything is stored in this browser and never leaves it.
      </p>

      <div className="mt-12 space-y-7 border-t border-line pt-7">
        <Toggle
          label="Confirm before completing"
          hint="Asks whether you actually did it before a quest counts."
          checked={state.settings.confirmCompletion}
          onChange={(value) => updateSettings({ confirmCompletion: value })}
        />
        <Toggle
          label="AI-generated quests"
          hint="Writes a brand-new quest for your exact answers instead of drawing from the 97. Slower, and needs the API endpoint deployed. Falls back to the catalogue if anything goes wrong."
          checked={state.settings.aiQuests}
          onChange={(value) => updateSettings({ aiQuests: value })}
        />
      </div>

      <div className="mt-10 border-t border-line pt-6">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">Erase all quest history from this browser?</p>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
            >
              Yes, erase it
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
            Reset progress
          </Button>
        )}
      </div>
    </PageShell>
  );
}
