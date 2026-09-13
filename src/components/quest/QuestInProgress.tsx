import { useEffect, useState } from 'react';
import { QuestCard } from '@/components/quest/QuestCard';
import { Button } from '@/components/ui/Button';
import type { Quest } from '@/types';

interface QuestInProgressProps {
  quest: Quest;
  acceptedAt: string | null;
  onComplete: () => void;
  onAbandon: () => void;
}

function elapsedLabel(acceptedAt: string | null): string | null {
  if (!acceptedAt) return null;
  const minutes = Math.floor((Date.now() - new Date(acceptedAt).getTime()) / 60_000);
  if (Number.isNaN(minutes) || minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
}

/** Ticks once a minute — the only resolution this label ever shows. */
function useElapsed(acceptedAt: string | null) {
  const [label, setLabel] = useState(() => elapsedLabel(acceptedAt));

  useEffect(() => {
    setLabel(elapsedLabel(acceptedAt));
    const id = window.setInterval(() => setLabel(elapsedLabel(acceptedAt)), 60_000);
    return () => window.clearInterval(id);
  }, [acceptedAt]);

  return label;
}

export function QuestInProgress({
  quest,
  acceptedAt,
  onComplete,
  onAbandon,
}: QuestInProgressProps) {
  const elapsed = useElapsed(acceptedAt);

  return (
    <div>
      <p className="mb-6 flex items-center gap-2.5 font-mono text-[0.75rem] uppercase tracking-[0.13em] text-accent">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Quest in progress
        {elapsed && <span className="text-faint">· accepted {elapsed}</span>}
      </p>

      <QuestCard quest={quest}>
        <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
          <Button size="lg" onClick={onComplete}>
            Complete Quest
          </Button>
          <Button variant="ghost" onClick={onAbandon}>
            Abandon
          </Button>
        </div>
      </QuestCard>
    </div>
  );
}
