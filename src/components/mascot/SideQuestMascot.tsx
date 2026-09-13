import { motion, useReducedMotion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import type { MascotState } from '@/types';
import { MascotFace } from './MascotFace';
import { MascotSpeechBubble } from './MascotSpeechBubble';

interface SideQuestMascotProps {
  state?: MascotState;
  /** Rendered width in px. The creature is designed to read well from 72px up. */
  size?: number;
  speech?: string | null;
  speechSide?: 'left' | 'right';
  /** Mirrors the creature only — the speech bubble stays the right way round. */
  facing?: 'left' | 'right';
  /** Poking the companion is the cheapest interaction in the app; wire it up. */
  onPoke?: () => void;
  className?: string;
}

interface Move {
  animate: Record<string, number | number[]>;
  transition: Transition;
}

const loop = (duration: number): Transition => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut',
});

const BODY_MOTION: Record<MascotState, Move> = {
  idle: { animate: { y: [0, -3.5, 0], rotate: 0 }, transition: loop(3.4) },
  thinking: {
    // Pacing back and forth — the universal shorthand for "working on it".
    animate: { x: [0, -6, 0, 6, 0], rotate: [0, -2.5, 0, 2.5, 0] },
    transition: loop(2.2),
  },
  excited: { animate: { y: [0, -9, 0], scale: [1, 1.03, 1] }, transition: loop(0.62) },
  celebrating: {
    animate: { y: [0, -24, 0, -11, 0], rotate: [0, -7, 7, -3, 0] },
    transition: { duration: 1.15, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.15 },
  },
  surprised: {
    animate: { y: [0, -6, -2], rotate: [0, -6, -4], scale: [1, 1.09, 1.03] },
    transition: { duration: 0.45, ease: 'backOut' },
  },
  annoyed: {
    animate: { y: [0, 5, 4], rotate: [0, -3, -2] },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  frustrated: {
    // A sharp stomp, then a shudder it can't quite suppress. Reads as "ARGH".
    animate: { y: [0, -14, 3, 0, 1, 0], rotate: [0, -9, 9, -5, 4, 0], scaleY: [1, 0.9, 1.06, 1] },
    transition: { duration: 0.75, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' },
  },
  curious: {
    // Leans in and holds it — the body language of waiting for your answer.
    animate: { y: [0, -3, -2], rotate: [0, 7, 6], x: [0, 3, 2] },
    transition: { duration: 0.5, ease: 'backOut' },
  },
  sleeping: { animate: { y: [0, -2, 0], scaleY: [1, 1.035, 1] }, transition: loop(4.2) },
  walking: { animate: { y: [0, -4, 0], rotate: [0, 1.5, 0] }, transition: loop(0.52) },
};

const LEG_SWING: Partial<Record<MascotState, number>> = {
  walking: 16,
  excited: 7,
  celebrating: 12,
  frustrated: 20,
};

const ARM_LIFT: Partial<Record<MascotState, number>> = {
  celebrating: -55,
  excited: -22,
  surprised: -34,
  annoyed: 12,
  // Arms thrown up — the gesture that actually means "Again?!".
  frustrated: -72,
  curious: -14,
};

const CONFETTI = [
  { x: -46, y: -42, r: -25, c: 'var(--m-pack)' },
  { x: 44, y: -48, r: 30, c: 'var(--m-body)' },
  { x: -60, y: 2, r: 55, c: 'var(--m-flag)' },
  { x: 58, y: -6, r: -40, c: 'var(--m-pack)' },
  { x: -28, y: -62, r: 15, c: 'var(--m-body)' },
  { x: 26, y: -66, r: -15, c: 'var(--m-flag)' },
];

export function SideQuestMascot({
  state = 'idle',
  size = 132,
  speech = null,
  speechSide = 'right',
  facing = 'right',
  onPoke,
  className = '',
}: SideQuestMascotProps) {
  const reduceMotion = useReducedMotion();
  const move = BODY_MOTION[state];
  const swing = LEG_SWING[state] ?? 0;
  const armLift = ARM_LIFT[state] ?? 0;

  // With reduced motion the creature still changes expression and pose — it just
  // stops moving. Personality survives; the vestibular trigger does not.
  const bodyAnimation = reduceMotion
    ? { animate: { y: 0, rotate: 0 }, transition: { duration: 0.2 } }
    : move;

  // Arm lift is a pose, not a motion loop — reduced-motion users should still see the
  // celebration, just without the spring overshoot.
  const armTransition: Transition = reduceMotion
    ? { duration: 0.15 }
    : { type: 'spring', stiffness: 260, damping: 18 };

  const legAnimate = (invert: boolean) => {
    if (reduceMotion || swing === 0) return { rotate: 0 };
    const value = invert ? [-swing, swing, -swing] : [swing, -swing, swing];
    return { rotate: value };
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size }}
      role="img"
      aria-label={`SideQuest companion, ${state}`}
    >
      <MascotSpeechBubble text={speech} side={speechSide} />

      <motion.svg
        viewBox="0 0 130 150"
        width={size}
        height={(size * 150) / 130}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible focus:outline-none ${
          onPoke ? 'pointer-events-auto cursor-pointer' : ''
        }`}
        animate={{ scaleX: facing === 'left' ? -1 : 1 }}
        transition={{ duration: 0.25 }}
        onPointerDown={onPoke}
        whileTap={onPoke ? { scale: 0.94 } : undefined}
      >
        <ellipse cx="58" cy="132" rx="33" ry="5" fill="var(--m-shadow)" />

        <motion.g
          animate={bodyAnimation.animate}
          transition={bodyAnimation.transition}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 90%' }}
        >
          {/* Pack and pennant sit behind the body so the silhouette stays simple. */}
          <g>
            <motion.g
              animate={reduceMotion ? { rotate: 0 } : { rotate: [0, 5, 0, -4, 0] }}
              transition={loop(state === 'walking' ? 1.1 : 3)}
              style={{ transformOrigin: '100px 60px' }}
            >
              <rect x="99" y="14" width="3.4" height="48" rx="1.7" fill="var(--m-pack-dark)" />
              <path d="M102 16 L121 24 L102 32 Z" fill="var(--m-flag)" />
            </motion.g>
            <rect x="82" y="56" width="23" height="32" rx="10" fill="var(--m-pack)" />
            <rect x="82" y="66" width="23" height="4" rx="2" fill="var(--m-pack-dark)" />
          </g>

          <motion.g
            animate={{ rotate: armLift }}
            transition={armTransition}
            style={{ transformOrigin: '25px 70px' }}
          >
            <ellipse cx="21" cy="80" rx="7.5" ry="10.5" fill="var(--m-body-shade)" />
          </motion.g>

          <g>
            <motion.g
              animate={legAnimate(false)}
              transition={loop(state === 'frustrated' ? 0.26 : 0.52)}
              style={{ transformOrigin: '47.5px 106px' }}
            >
              <rect x="41" y="104" width="13" height="21" rx="6.5" fill="var(--m-body-shade)" />
            </motion.g>
            <motion.g
              animate={legAnimate(true)}
              transition={loop(state === 'frustrated' ? 0.26 : 0.52)}
              style={{ transformOrigin: '68.5px 106px' }}
            >
              <rect x="62" y="104" width="13" height="21" rx="6.5" fill="var(--m-body-shade)" />
            </motion.g>
          </g>

          <g>
            <rect x="20" y="32" width="72" height="79" rx="30" fill="var(--m-body)" />
            {/* A single soft highlight keeps the body from reading as a flat sticker. */}
            <ellipse cx="40" cy="50" rx="15" ry="10" fill="#fff" opacity="0.16" />
            <rect
              x="66"
              y="60"
              width="20"
              height="5"
              rx="2.5"
              fill="var(--m-pack-dark)"
              opacity="0.5"
            />
            <MascotFace state={state} blink={!reduceMotion} />
          </g>

          <motion.g
            animate={{ rotate: armLift }}
            transition={armTransition}
            style={{ transformOrigin: '86px 76px' }}
          >
            <ellipse cx="89" cy="86" rx="7.5" ry="10" fill="var(--m-body-shade)" />
          </motion.g>
        </motion.g>

        {/*
          Plain conditional rendering, not AnimatePresence. Its child here was a
          keyless <g>, which framer cannot track for exit — so the confetti was never
          unmounted and accumulated in the DOM for the rest of the session. These
          particles already fade out inside their own cycle, so there is nothing for
          an exit animation to do.
        */}
        <g>
          {state === 'celebrating' && !reduceMotion && (
            <g>
              {CONFETTI.map((piece, index) => (
                <motion.rect
                  key={index}
                  x="54"
                  y="58"
                  width="6"
                  height="9"
                  rx="1.5"
                  fill={piece.c}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: piece.x,
                    y: [0, piece.y, piece.y + 26],
                    rotate: piece.r * 4,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1.15,
                    repeat: Infinity,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </g>
          )}

          {state === 'sleeping' && !reduceMotion && (
            <g>
              {[0, 1, 2].map((index) => (
                <motion.text
                  key={index}
                  x="94"
                  y="40"
                  fontSize="14"
                  fontWeight="700"
                  fill="var(--m-body-shade)"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], x: 10 + index * 4, y: -16 - index * 12 }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.85 }}
                >
                  z
                </motion.text>
              ))}
            </g>
          )}
        </g>
      </motion.svg>
    </div>
  );
}
