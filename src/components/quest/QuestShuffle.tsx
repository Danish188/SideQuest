import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { QUESTS } from '@/data/quests';
import { CATEGORY_LABELS } from '@/utils/format';

interface QuestShuffleProps {
  /** How long the search runs, so the reel lands as the real quest arrives. */
  durationMs: number;
  /**
   * True while a provider request is still in flight. An AI quest can take longer
   * than the scripted search, and a reel that stops early turns anticipation back
   * into waiting, so it keeps turning, slowly, until the answer lands.
   */
  awaiting?: boolean;
}

/**
 * Steps an index forward on a decelerating timer — fast at first, slowing to a
 * crawl — so the reel reads as a search coming to rest rather than a spinner.
 */
function useDeceleratingTicker(durationMs: number, keepGoing: boolean) {
  const [index, setIndex] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    let timer = 0;
    let cancelled = false;
    startedAt.current = Date.now();

    const tick = () => {
      if (cancelled) return;
      setIndex((current) => current + 1);

      const progress = Math.min((Date.now() - startedAt.current) / durationMs, 1);
      // 45ms at the start, ~300ms by the end. The curve is what sells it.
      const delay = 45 + progress ** 2.4 * 290;
      if (progress < 1 || keepGoing) timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 45);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [durationMs, keepGoing]);

  return index;
}

export function QuestShuffle({ durationMs, awaiting = false }: QuestShuffleProps) {
  const reduceMotion = useReducedMotion();
  const index = useDeceleratingTicker(
    reduceMotion ? Number.MAX_SAFE_INTEGER : durationMs,
    awaiting && !reduceMotion,
  );

  // A fixed random order per search, so the reel never repeats a title back to back.
  const reel = useMemo(() => [...QUESTS].sort(() => Math.random() - 0.5).slice(0, 24), []);

  if (reduceMotion) {
    return (
      <div>
        <p className="sq-eyebrow">Searching</p>
        <p className="sq-display mt-3 text-4xl text-faint">Finding something&hellip;</p>
      </div>
    );
  }

  const quest = reel[index % reel.length];

  return (
    <div aria-hidden="true">
      <div className="flex items-center gap-2.5">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [1, 0.25, 1], scale: [1, 0.7, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <p className="sq-eyebrow text-accent">Searching</p>
      </div>

      {/* Clipped to a fixed height so the page doesn't jitter as titles change
          length — the reel moves, the layout does not. */}
      <div className="mt-3 h-[2.6rem] overflow-hidden xs:h-[3rem] sm:h-[3.75rem] lg:h-[4.25rem]">
        <motion.p
          key={index}
          initial={{ y: '55%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="sq-display truncate text-[2.2rem] leading-[1.15] text-muted xs:text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem]"
        >
          {quest.title}
        </motion.p>
      </div>

      <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-faint">
        {CATEGORY_LABELS[quest.category]} · ~{quest.estimatedMinutes} min
      </p>
    </div>
  );
}
