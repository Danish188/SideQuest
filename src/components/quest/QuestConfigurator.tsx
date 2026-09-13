import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OptionGroup } from '@/components/ui/OptionGroup';
import type { Option } from '@/components/ui/OptionGroup';
import type { Difficulty, Mood, QuestContext, QuestPreferences, TimeBudget } from '@/types';
import { CONTEXTS, DIFFICULTIES, MOODS, TIME_BUDGETS } from '@/types';
import { CONTEXT_LABELS, DIFFICULTY_LABELS, MOOD_LABELS, TIME_LABELS } from '@/utils/format';

interface QuestConfiguratorProps {
  initial: QuestPreferences | null;
  error: string | null;
  onGenerate: (preferences: QuestPreferences) => void;
  onCancel: () => void;
}

const toOptions = <T extends string | number>(
  values: readonly T[],
  labels: Record<T, string>,
): Option<T>[] => values.map((value) => ({ value, label: labels[value] }));

export function QuestConfigurator({
  initial,
  error,
  onGenerate,
  onCancel,
}: QuestConfiguratorProps) {
  const [time, setTime] = useState<TimeBudget | null>(initial?.timeAvailable ?? null);
  const [mood, setMood] = useState<Mood | null>(initial?.mood ?? null);
  const [context, setContext] = useState<QuestContext | null>(initial?.context ?? null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(initial?.difficulty ?? null);

  const ready = time !== null && mood !== null && context !== null && difficulty !== null;

  const submit = () => {
    if (!ready) return;
    onGenerate({ timeAvailable: time, mood, context, difficulty });
  };

  return (
    <div>
      <h1 className="sq-display text-3xl sm:text-4xl">Four questions.</h1>

      <div className="mt-9 space-y-8">
        <OptionGroup
          legend="How long have you got?"
          step={1}
          options={toOptions(TIME_BUDGETS, TIME_LABELS)}
          value={time}
          onChange={setTime}
        />
        <OptionGroup
          legend="What mood are you in?"
          step={2}
          options={toOptions(MOODS, MOOD_LABELS)}
          value={mood}
          onChange={setMood}
        />
        <OptionGroup
          legend="Where are you?"
          step={3}
          options={toOptions(CONTEXTS, CONTEXT_LABELS)}
          value={context}
          onChange={setContext}
        />
        <OptionGroup
          legend="How far should this go?"
          step={4}
          options={toOptions(DIFFICULTIES, DIFFICULTY_LABELS)}
          value={difficulty}
          onChange={setDifficulty}
        />
      </div>

      {error && <p className="mt-7 text-sm text-unhinged">{error}</p>}

      <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
        <Button size="lg" onClick={submit} disabled={!ready}>
          Generate My SideQuest
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
      </div>
    </div>
  );
}
