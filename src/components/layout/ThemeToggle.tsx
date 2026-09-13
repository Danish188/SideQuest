import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="tap-target grid h-9 w-9 place-items-center rounded-xl text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-[1.15rem] w-[1.15rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
        animate={{ rotate: dark ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {dark ? (
          <path d="M20 14.2A8.2 8.2 0 019.8 4 8.4 8.4 0 1020 14.2z" />
        ) : (
          <g>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
          </g>
        )}
      </motion.svg>
    </button>
  );
}
