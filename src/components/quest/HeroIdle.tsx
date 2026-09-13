import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useQuestStore } from '@/hooks/useQuestStore';

interface HeroIdleProps {
  onConfigure: () => void;
  onSurprise: () => void;
  onInterest: (interested: boolean) => void;
}

export function HeroIdle({ onConfigure, onSurprise, onInterest }: HeroIdleProps) {
  const { stats } = useQuestStore();

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="sq-display text-[4.5rem] leading-[0.85] xs:text-[5.5rem] sm:text-[7rem] lg:text-[8.5rem]"
      >
        Bored?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 max-w-[34ch] text-pretty text-lg text-muted sm:text-xl"
      >
        Let&rsquo;s find you something better to do.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap"
      >
        <Button
          size="lg"
          onClick={onConfigure}
          onMouseEnter={() => onInterest(true)}
          onMouseLeave={() => onInterest(false)}
          onFocus={() => onInterest(true)}
          onBlur={() => onInterest(false)}
        >
          Give me a SideQuest
        </Button>
        <Button size="lg" variant="secondary" onClick={onSurprise}>
          Surprise Me
        </Button>
      </motion.div>

      {stats.totalCompleted > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-7 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-faint"
        >
          {stats.totalCompleted} completed
          {stats.currentStreak > 0 && ` · ${stats.currentStreak} day streak`}
        </motion.p>
      )}
    </div>
  );
}
