import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useElementWidth } from '@/hooks/useElementWidth';
import type { MascotState, QuestPhase } from '@/types';
import { SideQuestMascot } from './SideQuestMascot';

interface MascotStageProps {
  state: MascotState;
  speech: string | null;
  phase: QuestPhase;
  onPoke?: () => void;
  /** It has had enough: it moves off and faces away until you leave it alone. */
  withdrawn?: boolean;
}

/**
 * Where along the strip the companion stands, as a fraction of the walkable
 * width. It leaves the hero when there is a quest to stand next to, heads for the
 * edge once you accept, and runs back to celebrate.
 */
const TRAVEL: Record<QuestPhase, number> = {
  idle: 0.04,
  configuring: 0.02,
  generating: 0.3,
  previewing: 0.58,
  // Standing right next to you, waiting for an answer.
  asking: 0.66,
  active: 0.93,
  confirming: 0.7,
  complete: 0.4,
};

/**
 * How far it wanders while searching, as a fraction of the strip.
 *
 * The pace is anchored to wherever it is already standing rather than to a fixed
 * span: a keyframe array always begins at its first keyframe, so a fixed span made
 * the companion teleport to the left edge and slide back in every time you asked
 * for another quest from a position further right.
 */
const PACE_DISTANCE = 0.24;
const PACE_LIMIT = 0.72;

/** How far it removes itself once it has stopped engaging, as a fraction of the strip. */
const WITHDRAW_STEP = 0.22;

export function MascotStage({
  state,
  speech,
  phase,
  onPoke,
  withdrawn = false,
}: MascotStageProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  // Where it was standing before the search began. The effect deliberately skips
  // `generating`, so during a search this still holds the previous resting spot.
  const anchor = useRef(TRAVEL.idle);
  useEffect(() => {
    if (phase !== 'generating') anchor.current = TRAVEL[phase];
  }, [phase]);

  const size = width < 420 ? 118 : width < 720 ? 126 : 134;
  const walkable = Math.max(0, width - size);
  const searching = phase === 'generating' && !reduceMotion;

  const from = anchor.current;
  const to = Math.min(from + PACE_DISTANCE, PACE_LIMIT);

  // Putting distance between itself and you is the clearest thing it can do without
  // words, and it is what a person does when they are done with a conversation.
  const retreat = withdrawn ? WITHDRAW_STEP : 0;

  // Where it is actually standing, retreat included. The speech bubble picks its
  // side from this rather than from TRAVEL alone: a bubble hung off the right of a
  // companion standing past halfway ran clean off a 375px screen, and withdrawing
  // pushes it a further 0.22 to the right without TRAVEL ever knowing.
  const position = Math.min(TRAVEL[phase] + retreat, 1);

  // Starting the keyframes at `from` is the whole point: the first keyframe is
  // where it already is, so the pace begins from a standstill instead of a jump.
  const travel = searching
    ? [walkable * from, walkable * to, walkable * from]
    : walkable * position;

  // Walking has a travel-time feel; everything else snaps into place.
  const transition = reduceMotion
    ? { duration: 0 }
    : searching
      ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const }
      : withdrawn
        ? { duration: 1.1, ease: [0.4, 0, 0.3, 1] as const }
        : phase === 'active' || phase === 'complete'
          ? { duration: 1.5, ease: [0.45, 0, 0.2, 1] as const }
          : { type: 'spring' as const, stiffness: 70, damping: 18 };

  return (
    <div
      ref={ref}
      className="pointer-events-none relative h-[152px] select-none sm:h-[156px]"
      aria-hidden="true"
    >
      {/* The ground line is what makes the companion part of the page rather than a
          sticker floating on top of it. Faded at both ends so it reads as a surface
          it stands on: a hard full-width rule looks like a stray divider, especially
          on mobile where the line no longer sits at the bottom of the screen. */}
      <div className="absolute inset-x-0 bottom-4 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <motion.div
        className="absolute bottom-3 left-0"
        animate={{ x: travel }}
        transition={transition}
      >
        <SideQuestMascot
          state={state}
          size={size}
          speech={speech}
          facing={withdrawn || phase === 'complete' ? 'left' : 'right'}
          speechSide={position > 0.5 ? 'left' : 'right'}
          onPoke={onPoke}
        />
      </motion.div>
    </div>
  );
}
