interface LogoMarkProps {
  /** Rendered size of the square mark in px. Drawn to read down to 16px. */
  size?: number;
  className?: string;
}

/**
 * The SideQuest mark: the companion's face, knocked out of the accent tile.
 *
 * The app already has a character, and it is the only thing here nobody else
 * could put on their own product, so the logo is the character rather than a
 * metaphor about paths or dice.
 *
 * The proportions are taken from `SideQuestMascot` so the two read as the same
 * creature: the head keeps the body's rounded-square silhouette, and the eyes sit
 * at the same fractions across and down it. The eyes and mouth are then drawn
 * larger than a faithful scaling would give, because at 16px a faithful eye is
 * under a pixel wide. If anyone redraws this, that exaggeration is the part that
 * has to survive; the smile is allowed to disappear at small sizes, the eyes are
 * not.
 */
export function LogoMark({ size = 26, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="9" className="fill-accent" />

      <rect x="6.5" y="7" width="19" height="18.5" rx="8" className="fill-accent-ink" />

      <g className="fill-accent">
        <ellipse cx="12.4" cy="14.8" rx="2.5" ry="3" />
        <ellipse cx="19.6" cy="14.8" rx="2.5" ry="3" />
      </g>

      <path
        d="M13.2 20.4 q2.8 2.6 5.6 0"
        fill="none"
        className="stroke-accent"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps extends LogoMarkProps {
  /** The wordmark is dropped on the narrowest phones, where it costs too much. */
  wordmarkClassName?: string;
}

/** Mark plus wordmark, set the way it appears in the nav. */
export function Logo({ size = 26, className = '', wordmarkClassName = '' }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span
        className={`font-display text-[0.95rem] font-extrabold tracking-tight ${wordmarkClassName}`}
      >
        SideQuest
      </span>
    </span>
  );
}
