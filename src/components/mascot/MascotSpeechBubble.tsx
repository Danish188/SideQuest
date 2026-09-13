import { AnimatePresence, motion } from 'framer-motion';

interface MascotSpeechBubbleProps {
  text: string | null;
  /** Flips the tail so the bubble can sit on either side of the mascot. */
  side?: 'left' | 'right';
}

export function MascotSpeechBubble({ text, side = 'right' }: MascotSpeechBubbleProps) {
  return (
    // The bubble is capped and allowed to wrap rather than set nowrap: it is
    // anchored to a companion that walks the width of the strip, so on a phone a
    // single unbreakable line pushed it straight off the right edge of the page.
    //
    // `w-max` is doing the real work and must stay. The bubble is absolutely
    // positioned at 62% of a box only as wide as the companion, so shrink-to-fit
    // offers it about 48px and it wraps every line to ribbons. A max-width caps,
    // it never expands, so the 10rem cap alone did nothing: max-content sets the
    // natural one-line width and the cap then only bites on genuinely long lines.
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="pointer-events-none absolute bottom-full mb-1 w-max max-w-[min(10rem,42vw)]"
          style={side === 'right' ? { left: '62%' } : { right: '62%' }}
          aria-hidden="true"
        >
          <div className="relative rounded-2xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-lift">
            {text}
            <span
              className="absolute top-full h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-line bg-surface"
              style={side === 'right' ? { left: '1rem' } : { right: '1rem' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
