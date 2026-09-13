import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { MascotQuestion, MascotQuestionOption } from '@/types';

interface MascotQuestionPromptProps {
  question: MascotQuestion;
  onAnswer: (option: MascotQuestionOption) => void;
}

/**
 * The companion stops suggesting and asks you something instead.
 *
 * This is a real question: every answer changes what happens next — eases the
 * difficulty, reopens the questionnaire, or lets you off the hook. A character
 * that asks something and then ignores the answer is worse than one that stays
 * quiet, so there is no "dismiss".
 */
export function MascotQuestionPrompt({ question, onAnswer }: MascotQuestionPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="sq-eyebrow">Your companion has a question</p>

      <h1 className="sq-display mt-3 text-balance text-[2.4rem] leading-[0.95] sm:text-5xl lg:text-6xl">
        {question.text}
      </h1>

      <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
        {question.options.map((option, index) => (
          <Button
            key={option.label}
            size={index === 0 ? 'lg' : 'md'}
            variant={index === 0 ? 'primary' : 'secondary'}
            onClick={() => onAnswer(option)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
