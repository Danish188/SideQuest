import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useQuestStore } from '@/hooks/useQuestStore';
import type { Quest } from '@/types';

interface QuestConfirmProps {
  quest: Quest;
  onConfirm: () => void;
  onCancel: () => void;
}

export function QuestConfirm({ quest, onConfirm, onCancel }: QuestConfirmProps) {
  const { updateSettings } = useQuestStore();

  const confirmAndStopAsking = () => {
    updateSettings({ confirmCompletion: false });
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="sq-eyebrow">Before it counts</p>

      <h1 className="sq-display mt-3 text-balance text-[2.4rem] leading-[0.95] sm:text-5xl lg:text-6xl">
        Did you actually do it?
      </h1>

      <p className="mt-5 max-w-[46ch] text-pretty text-lg text-muted">
        <span className="text-ink">{quest.title}</span>. Nobody is checking but you. The streak is
        only worth something if it is true.
      </p>

      <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
        <Button size="lg" onClick={onConfirm}>
          Yes, it&rsquo;s done
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Not yet
        </Button>
      </div>

      <button
        type="button"
        onClick={confirmAndStopAsking}
        className="mt-7 text-sm text-faint underline decoration-line underline-offset-4 transition-colors hover:text-muted"
      >
        Yes, and stop asking me this
      </button>
    </motion.div>
  );
}
