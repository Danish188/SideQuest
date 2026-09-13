import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { to: '/', label: 'Quest' },
  { to: '/history', label: 'History' },
  { to: '/stats', label: 'Stats' },
  { to: '/about', label: 'About' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4 sm:h-16 sm:px-6">
        {/* Below 360px the wordmark is what pushes the theme toggle off the edge of
            the screen entirely: measured at 320px, the toggle sat at x=314 in a
            320px viewport and could not be tapped. The mark alone still reads. */}
        <NavLink to="/" aria-label="SideQuest, home" className="tap-target mr-auto">
          <Logo wordmarkClassName="max-[359px]:hidden" />
        </NavLink>

        <ul className="flex items-center">
          {LINKS.slice(1).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `tap-target block px-2.5 py-2 text-sm transition-colors sm:px-3 ${
                    isActive ? 'text-ink' : 'text-faint hover:text-muted'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2.5 -bottom-px h-px bg-ink sm:inset-x-3"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-1 border-l border-line pl-1 sm:ml-2 sm:pl-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
