import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageShellProps {
  title?: string;
  lede?: string;
  children: ReactNode;
}

/** Shared frame for the secondary pages, so Home can stay a bespoke layout. */
export function PageShell({ title, lede, children }: PageShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-6 sm:pt-20"
    >
      {title && (
        <header className="mb-10 sm:mb-14">
          <h1 className="sq-display text-4xl sm:text-5xl">{title}</h1>
          {lede && <p className="mt-3 max-w-[48ch] text-pretty text-muted">{lede}</p>}
        </header>
      )}
      {children}
    </motion.main>
  );
}
