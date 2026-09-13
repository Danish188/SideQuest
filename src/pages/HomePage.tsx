import { AnimatePresence, motion } from 'framer-motion';
import { MascotStage } from '@/components/mascot/MascotStage';
import { HeroIdle } from '@/components/quest/HeroIdle';
import { MascotQuestionPrompt } from '@/components/quest/MascotQuestionPrompt';
import { QuestCard } from '@/components/quest/QuestCard';
import { QuestComplete } from '@/components/quest/QuestComplete';
import { QuestConfigurator } from '@/components/quest/QuestConfigurator';
import { QuestConfirm } from '@/components/quest/QuestConfirm';
import { QuestInProgress } from '@/components/quest/QuestInProgress';
import { QuestShuffle } from '@/components/quest/QuestShuffle';
import { Button } from '@/components/ui/Button';
import { useQuestSession } from '@/hooks/useQuestSession';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useQuestStore } from '@/hooks/useQuestStore';

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const },
};

export function HomePage() {
  const session = useQuestSession();
  const { state, activeQuest } = useQuestStore();
  const { phase, suggestion } = session;

  useScrollTop(phase);

  return (
    // The bottom inset is what keeps the companion clear of the iOS home indicator:
    // the page is drawn edge to edge (viewport-fit=cover), and env() is 0 elsewhere.
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pb-[env(safe-area-inset-bottom)] sm:justify-start sm:px-6 sm:pb-0"
    >
      {/* Every phase renders into the same grid cell, so the outgoing and incoming
          steps overlap without shifting the layout. `mode="wait"` is deliberately
          not used: it gates mounting the next step on the previous one's exit
          finishing, which made the time-boxed search step get skipped entirely. */}
      {/*
        On a phone the content and the companion are centred together as one block.
        Stretching the content and pinning the companion to the bottom, as on desktop,
        left a ~200px void between them and made the two read as unrelated.
      */}
      <div className="grid items-center py-8 sm:flex-1 sm:py-16">
        <AnimatePresence initial={false}>
          <motion.div key={phase} {...fade} className="col-start-1 row-start-1">
            {phase === 'idle' && (
              <HeroIdle
                onConfigure={session.startConfiguring}
                onSurprise={session.surpriseMe}
                onInterest={session.setInterested}
              />
            )}

            {phase === 'configuring' && (
              <QuestConfigurator
                initial={state.preferences}
                error={session.error}
                onGenerate={session.generate}
                onCancel={session.cancelConfiguring}
              />
            )}

            {phase === 'generating' && (
              <QuestShuffle
                durationMs={session.searchDurationMs}
                awaiting={session.awaitingProvider}
              />
            )}

            {phase === 'asking' && session.question && (
              <MascotQuestionPrompt question={session.question} onAnswer={session.answerQuestion} />
            )}

            {phase === 'previewing' && suggestion && (
              <QuestCard
                quest={suggestion.quest}
                reasons={suggestion.reasons}
                source={suggestion.source}
              >
                <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
                  <Button size="lg" onClick={session.accept}>
                    Accept Quest
                  </Button>
                  <Button variant="ghost" onClick={session.another}>
                    Give Me Another
                  </Button>
                </div>
              </QuestCard>
            )}

            {phase === 'active' && activeQuest && (
              <QuestInProgress
                quest={activeQuest}
                acceptedAt={state.acceptedAt}
                onComplete={session.requestComplete}
                onAbandon={session.abandon}
              />
            )}

            {phase === 'confirming' && activeQuest && (
              <QuestConfirm
                quest={activeQuest}
                onConfirm={session.complete}
                onCancel={session.cancelComplete}
              />
            )}

            {phase === 'complete' && session.completedQuest && (
              <QuestComplete
                quest={session.completedQuest}
                milestone={session.milestone}
                onAgain={session.reset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <MascotStage
        phase={phase}
        state={session.mascotState}
        speech={session.speech}
        onPoke={session.poke}
        withdrawn={session.withdrawn}
      />
    </motion.main>
  );
}
