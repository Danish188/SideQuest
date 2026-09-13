import { motion } from 'framer-motion';
import { useId } from 'react';

export interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface OptionGroupProps<T extends string | number> {
  legend: string;
  step: number;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

export function OptionGroup<T extends string | number>({
  legend,
  step,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  const groupId = useId();

  return (
    <fieldset>
      <legend className="mb-3 flex items-baseline gap-2.5">
        <span className="sq-eyebrow tabular-nums">{`0${step}`}</span>
        <span className="text-base font-medium text-ink">{legend}</span>
      </legend>

      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`tap-target rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                selected ? 'text-accent-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId={`${groupId}-pill`}
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                />
              )}
              {!selected && <span className="absolute inset-0 rounded-xl border border-line" />}
              <span className="relative">{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
