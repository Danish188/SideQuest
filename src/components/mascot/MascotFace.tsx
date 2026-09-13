import { AnimatePresence, motion } from 'framer-motion';
import type { MascotState } from '@/types';

interface MascotFaceProps {
  state: MascotState;
  /** Suppresses the blink loop when the user prefers reduced motion. */
  blink: boolean;
}

const LEFT_EYE = { x: 43, y: 68 };
const RIGHT_EYE = { x: 69, y: 68 };

/** Where the eyes point, in local units. Small numbers — this reads as attention. */
const GAZE: Record<MascotState, { x: number; y: number }> = {
  idle: { x: 0, y: 0 },
  thinking: { x: 1.5, y: -2.2 },
  excited: { x: 1, y: 0.5 },
  celebrating: { x: 0, y: 0 },
  surprised: { x: 0, y: 0 },
  annoyed: { x: -1.8, y: 0 },
  frustrated: { x: 0, y: -1 },
  curious: { x: 2.4, y: -1.4 },
  sleeping: { x: 0, y: 0 },
  walking: { x: 2, y: 0 },
};

type EyeShape = 'open' | 'wide' | 'happyArc' | 'closed' | 'half' | 'cross';

const EYE_SHAPE: Record<MascotState, EyeShape> = {
  idle: 'open',
  thinking: 'open',
  excited: 'wide',
  celebrating: 'happyArc',
  surprised: 'wide',
  annoyed: 'half',
  frustrated: 'cross',
  curious: 'wide',
  sleeping: 'closed',
  walking: 'open',
};

function Eye({ x, y, shape, blink }: { x: number; y: number; shape: EyeShape; blink: boolean }) {
  if (shape === 'happyArc') {
    return (
      <path
        d={`M${x - 8} ${y + 2} q8 -9 16 0`}
        fill="none"
        stroke="var(--m-eye)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    );
  }

  if (shape === 'cross') {
    return (
      <g>
        <ellipse cx={x} cy={y + 1} rx={6.4} ry={7} fill="var(--m-eye)" />
        <circle cx={x + 2.2} cy={y - 1.6} r={1.9} fill="#fff" />
      </g>
    );
  }

  if (shape === 'closed') {
    return (
      <path
        d={`M${x - 7} ${y} q7 6 14 0`}
        fill="none"
        stroke="var(--m-eye)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    );
  }

  const rx = shape === 'wide' ? 8.4 : 7;
  const ry = shape === 'wide' ? 9.6 : 8.2;

  return (
    <g>
      <motion.ellipse
        cx={x}
        cy={y}
        rx={rx}
        fill="var(--m-eye)"
        initial={false}
        animate={blink ? { ry: [ry, ry, 0.9, ry] } : { ry }}
        transition={
          blink
            ? { duration: 4.4, times: [0, 0.92, 0.96, 1], repeat: Infinity, repeatDelay: 1.6 }
            : { duration: 0.18 }
        }
      />
      {/* Catchlight. Two dots are the difference between "eyes" and "alive". */}
      <circle cx={x + rx * 0.34} cy={y - ry * 0.36} r={shape === 'wide' ? 2.6 : 2.1} fill="#fff" />
      {shape === 'half' && (
        // The lid is body-coloured rather than transparent so it reads as a droop.
        <rect
          x={x - rx - 1}
          y={y - ry - 2}
          width={rx * 2 + 2}
          height={ry + 1.5}
          fill="var(--m-body)"
        />
      )}
    </g>
  );
}

function Mouth({ state }: { state: MascotState }) {
  const stroke = {
    fill: 'none',
    stroke: 'var(--m-eye)',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
  };

  switch (state) {
    case 'excited':
    case 'celebrating':
      return <path d="M48 86 q8 11 16 0 q-8 4 -16 0z" fill="var(--m-eye)" />;
    case 'surprised':
      return <ellipse cx="56" cy="88" rx="4.6" ry="5.6" fill="var(--m-eye)" />;
    case 'annoyed':
      return <path d="M49 88 q7 -2 14 0" {...stroke} />;
    case 'frustrated':
      // A small open shout, not a frown — frustration is loud, not sad.
      return <ellipse cx="56" cy="89" rx="6.2" ry="4.4" fill="var(--m-eye)" />;
    case 'curious':
      return <path d="M50 87 q5 3 10 -1" {...stroke} />;
    case 'thinking':
      return <path d="M50 88 q4 -4 8 0" {...stroke} />;
    case 'sleeping':
      return <path d="M52 88 q4 4 8 0" {...stroke} />;
    case 'walking':
      return <path d="M49 86 q7 6 14 0" {...stroke} />;
    default:
      return <path d="M50 86 q6 5 12 0" {...stroke} />;
  }
}

export function MascotFace({ state, blink }: MascotFaceProps) {
  const shape = EYE_SHAPE[state];
  const gaze = GAZE[state];

  return (
    <motion.g
      animate={{ x: gaze.x, y: gaze.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <Eye x={LEFT_EYE.x} y={LEFT_EYE.y} shape={shape} blink={blink && shape === 'open'} />
      <Eye x={RIGHT_EYE.x} y={RIGHT_EYE.y} shape={shape} blink={blink && shape === 'open'} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.g
          key={state}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.14 }}
          style={{ transformOrigin: '56px 87px' }}
        >
          <Mouth state={state} />
        </motion.g>
      </AnimatePresence>

      {state === 'annoyed' && (
        // One angled brow does more for "unimpressed" than any mouth shape.
        <path
          d="M36 54 l14 5"
          fill="none"
          stroke="var(--m-eye)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {state === 'frustrated' && (
        // Both brows down and inward: the universal "I have had enough" face.
        <g stroke="var(--m-eye)" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M34 52 l13 6" />
          <path d="M78 52 l-13 6" />
        </g>
      )}

      {state === 'curious' && (
        // One brow up. Nothing says "go on then" more economically.
        <path
          d="M63 52 q7 -4 14 1"
          fill="none"
          stroke="var(--m-eye)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </motion.g>
  );
}
