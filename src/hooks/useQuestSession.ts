import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MASCOT_QUESTIONS,
  POKE_LADDER,
  REACTIONS,
  REROLL_ASK_COMMITMENT_AT,
  REROLL_ASK_DIFFICULTY_AT,
  REROLL_FRUSTRATED_AT,
  pickReaction,
} from '@/data/mascotReactions';
import { questProvider } from '@/engine';
import { fetchCompanionQuestion } from '@/engine/companionQuestions';
import {
  DISTURBANCE,
  INITIAL_MOOD,
  RECOVERY_THRESHOLD,
  currentAnnoyance,
  disturb,
  moodTier,
} from '@/services/companionMood';
import type { MoodState } from '@/services/companionMood';
import type {
  Difficulty,
  MascotQuestion,
  MascotQuestionOption,
  MascotReaction,
  MascotState,
  Quest,
  QuestPhase,
  QuestPreferences,
  QuestSuggestion,
} from '@/types';
import { useQuestStore } from './useQuestStore';

/**
 * The search is deliberately slower than the local engine needs.
 *
 * A local draw resolves in well under a millisecond, and revealing it instantly
 * makes the answer feel cheap. The reel plays for at least this long so the result
 * lands as an arrival. When the AI provider is answering, the real request usually
 * takes longer and simply absorbs the padding.
 */
const THINKING_MS = 1750;
/** Re-draws are shorter — the user has already watched the full search once. */
const REDRAW_THINKING_MS = 1150;
const REACTION_MS = 620;
const DEFAULT_HOLD_MS = 2200;
/** Left alone on the landing screen this long, the companion dozes off. */
const BOREDOM_MS = 45_000;

export interface QuestSession {
  phase: QuestPhase;
  suggestion: QuestSuggestion | null;
  completedQuest: Quest | null;
  question: MascotQuestion | null;
  error: string | null;
  mascotState: MascotState;
  speech: string | null;
  milestone: number | null;
  searchDurationMs: number;
  /** True while a provider request is in flight, so the reel keeps spinning. */
  awaitingProvider: boolean;
  /** It has had enough of you: turned away, saying nothing, waiting you out. */
  withdrawn: boolean;
  startConfiguring: () => void;
  cancelConfiguring: () => void;
  generate: (preferences: QuestPreferences) => void;
  surpriseMe: () => void;
  another: () => void;
  accept: () => void;
  requestComplete: () => void;
  cancelComplete: () => void;
  complete: () => void;
  abandon: () => void;
  reset: () => void;
  answerQuestion: (option: MascotQuestionOption) => void;
  poke: () => void;
  setInterested: (interested: boolean) => void;
}

/** Used when the user asks for something easier but never answered the questionnaire. */
const GENTLE_DEFAULTS: QuestPreferences = {
  timeAvailable: 30,
  mood: 'chill',
  context: 'anywhere',
  difficulty: 'medium',
};

const EASIER: Record<Difficulty, Difficulty> = {
  unhinged: 'medium',
  medium: 'easy',
  easy: 'easy',
};

export function useQuestSession(): QuestSession {
  const store = useQuestStore();
  const { markShown, acceptQuest, completeQuest, abandonQuest, activeQuest, state } = store;

  const [phase, setPhase] = useState<QuestPhase>(() => (activeQuest ? 'active' : 'idle'));
  const [suggestion, setSuggestion] = useState<QuestSuggestion | null>(null);
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [question, setQuestion] = useState<MascotQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [speech, setSpeech] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [searchDurationMs, setSearchDurationMs] = useState(THINKING_MS);
  const [awaitingProvider, setAwaitingProvider] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  // Patience. One shared meter for every kind of pestering, so the companion reacts
  // to how you have been behaving rather than to one isolated action.
  const mood = useRef<MoodState>(INITIAL_MOOD);

  const timers = useRef<number[]>([]);
  // Guards against a slow request from an abandoned draw overwriting a newer one.
  const requestId = useRef(0);
  // What the current quest was drawn with. "Give Me Another" repeats *this*, not
  // whatever preferences happen to be saved.
  const lastRequest = useRef<QuestPreferences | undefined>(undefined);
  // How many suggestions in a row the user has rejected. The only thing the
  // companion holds a grudge about.
  const rerolls = useRef(0);
  // Titles turned down in this run. A question like "not in the mood for people?"
  // is only possible if the model knows what they actually said no to.
  const rejected = useRef<string[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /**
   * Speech and pose are set together, always.
   *
   * Setting them separately is what made the companion look dubbed — it could say
   * "Again?!" while placidly bobbing. Every line now arrives with its body language.
   */
  const react = useCallback(
    (reaction: MascotReaction, { hold = true }: { hold?: boolean } = {}) => {
      setMascotState(reaction.state);
      setSpeech(reaction.text);
      if (hold) later(() => setSpeech(null), reaction.holdMs ?? DEFAULT_HOLD_MS);
    },
    [later],
  );

  /**
   * While it is sulking, keep checking whether it has calmed down.
   *
   * Leaving it alone is the only thing that works — and it does not snap back the
   * instant the meter dips, it waits until it has genuinely cooled, then comes back
   * and says something about it. People do not flip straight from furious to fine.
   */
  useEffect(() => {
    if (!withdrawn) return;

    const id = window.setInterval(() => {
      if (currentAnnoyance(mood.current) > RECOVERY_THRESHOLD) return;
      window.clearInterval(id);
      setWithdrawn(false);
      react(pickReaction(REACTIONS.reconciled));
    }, 1000);

    return () => window.clearInterval(id);
  }, [withdrawn, react]);

  /**
   * Returns the companion to a resting pose after a burst.
   *
   * Every big reaction needs one of these. A celebration that never ends stops
   * being a celebration and becomes the character's permanent state — which is
   * exactly what was happening on the completion screen.
   */
  const settleTo = useCallback(
    (resting: MascotState, afterMs: number) => {
      later(() => setMascotState(resting), afterMs);
    },
    [later],
  );

  // Idling on the hero long enough sends it to sleep — the only place the
  // `sleeping` pose is reachable, and a quiet joke about the app's subject.
  useEffect(() => {
    if (phase !== 'idle' || mascotState !== 'idle') return;
    const id = window.setTimeout(() => setMascotState('sleeping'), BOREDOM_MS);
    return () => window.clearTimeout(id);
  }, [phase, mascotState]);

  // A quest accepted in a previous visit puts the app straight back into progress.
  useEffect(() => {
    if (activeQuest && phase === 'idle') {
      setPhase('active');
      setMascotState('walking');
    }
  }, [activeQuest, phase]);

  const draw = useCallback(
    (preferences: QuestPreferences | undefined, thinkingMs = THINKING_MS) => {
      const id = requestId.current + 1;
      requestId.current = id;
      lastRequest.current = preferences;

      clearTimers();
      setError(null);
      setQuestion(null);
      setPhase('generating');
      setSearchDurationMs(thinkingMs);
      setAwaitingProvider(true);
      react(pickReaction(REACTIONS.searching), { hold: false });

      const startedAt = Date.now();

      questProvider
        .suggest({
          preferences,
          recentIds: state.recentlyShown,
          completedIds: state.completed.map((record) => record.questId),
          preferAi: state.settings.aiQuests,
          recentTitles: store.recentTitles,
        })
        .then((next) => {
          if (requestId.current !== id) return;
          setAwaitingProvider(false);

          // Hold the reveal until the search has had time to read as a search.
          later(
            () => {
              if (requestId.current !== id) return;
              setSuggestion(next);
              setPhase('previewing');
              markShown(next.quest);

              const unhinged = next.quest.difficulty === 'unhinged';
              react(
                next.companionLine
                  ? { text: next.companionLine, state: unhinged ? 'surprised' : 'excited' }
                  : pickReaction(unhinged ? REACTIONS.foundUnhinged : REACTIONS.found),
              );
            },
            Math.max(0, thinkingMs - (Date.now() - startedAt)),
          );
        })
        .catch(() => {
          if (requestId.current !== id) return;
          setAwaitingProvider(false);
          setError('Nothing matched that combination. Try loosening one answer.');
          setPhase('configuring');
          react({ text: "That's a tough one.", state: 'annoyed' });
          settleTo('idle', 2400);
        });
    },
    [
      clearTimers,
      later,
      markShown,
      react,
      settleTo,
      state.completed,
      state.recentlyShown,
      state.settings.aiQuests,
      store.recentTitles,
    ],
  );

  /**
   * Puts the question on screen. With AI enabled it asks the model to write one
   * about what was actually rejected, and quietly uses the written fallback if that
   * is slow, unavailable, or returns something unusable. The companion must never
   * be left mid-outburst with nothing to say.
   */
  const ask = useCallback(
    async (fallback: MascotQuestion) => {
      clearTimers();
      setPhase('asking');
      setMascotState('curious');
      setSpeech(null);
      setQuestion(fallback);

      if (!state.settings.aiQuests) return;

      const generated = await fetchCompanionQuestion({
        rejectedCount: rerolls.current,
        rejectedTitles: rejected.current,
        preferences: lastRequest.current ?? state.preferences,
      });

      // Only swap it in if the user is still looking at the question.
      if (generated) setQuestion((current) => (current?.id === fallback.id ? generated : current));
    },
    [clearTimers, state.preferences, state.settings.aiQuests],
  );

  const startConfiguring = useCallback(() => {
    clearTimers();
    rerolls.current = 0;
    rejected.current = [];
    setPhase('configuring');
    setMascotState('excited');
    setSpeech(null);
    setError(null);
    settleTo('idle', 1600);
  }, [clearTimers, settleTo]);

  const cancelConfiguring = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setMascotState('idle');
    setSpeech(null);
  }, [clearTimers]);

  const generate = useCallback(
    (preferences: QuestPreferences) => {
      rerolls.current = 0;
      rejected.current = [];
      store.savePreferences(preferences);
      draw(preferences);
    },
    [draw, store],
  );

  const surpriseMe = useCallback(() => {
    rerolls.current = 0;
    rejected.current = [];
    draw(undefined);
  }, [draw]);

  /**
   * Rejecting a suggestion escalates: mild irritation, then visible frustration,
   * then it stops drawing and asks you something instead.
   */
  const another = useCallback(() => {
    clearTimers();
    rerolls.current += 1;
    mood.current = disturb(mood.current, DISTURBANCE.reroll);
    if (suggestion) rejected.current = [...rejected.current, suggestion.quest.title].slice(-8);
    const count = rerolls.current;

    const pending =
      count === REROLL_ASK_DIFFICULTY_AT
        ? MASCOT_QUESTIONS.difficulty
        : count >= REROLL_ASK_COMMITMENT_AT
          ? MASCOT_QUESTIONS.commitment
          : null;

    react(
      pickReaction(
        count >= REROLL_FRUSTRATED_AT ? REACTIONS.rerollFrustrated : REACTIONS.rerollMild,
      ),
      { hold: false },
    );

    if (pending) {
      // Let the outburst land before it turns into a question.
      later(() => ask(pending), REACTION_MS + 520);
      return;
    }

    later(() => draw(lastRequest.current, REDRAW_THINKING_MS), REACTION_MS);
  }, [ask, clearTimers, draw, later, react, suggestion]);

  const answerQuestion = useCallback(
    (option: MascotQuestionOption) => {
      clearTimers();
      setQuestion(null);
      react(option.reply, { hold: option.action === 'giveUp' });
      rerolls.current = 0;
      rejected.current = [];

      switch (option.action) {
        case 'easier': {
          // A "Surprise Me" run has no preferences to ease, and answering "make it
          // easier" must never be a no-op — so fall back to a gentle default rather
          // than promising something and then drawing at random again.
          const current = lastRequest.current ?? state.preferences ?? GENTLE_DEFAULTS;
          const eased = { ...current, difficulty: EASIER[current.difficulty] };
          store.savePreferences(eased);
          later(() => draw(eased, REDRAW_THINKING_MS), 900);
          break;
        }
        case 'reconfigure':
          later(startConfiguring, 900);
          break;
        case 'giveUp':
          setSuggestion(null);
          setPhase('idle');
          settleTo('idle', 2600);
          break;
        case 'redraw':
        default:
          later(() => draw(lastRequest.current, REDRAW_THINKING_MS), 900);
          break;
      }
    },
    [clearTimers, draw, later, react, settleTo, startConfiguring, state.preferences, store],
  );

  const accept = useCallback(() => {
    if (!suggestion) return;
    clearTimers();
    rerolls.current = 0;
    rejected.current = [];
    acceptQuest(suggestion.quest.id);
    setPhase('active');
    react(pickReaction(REACTIONS.accepted), { hold: false });
    later(() => {
      setMascotState('walking');
      setSpeech(null);
    }, 1400);
  }, [acceptQuest, clearTimers, later, react, suggestion]);

  const complete = useCallback(() => {
    const quest = activeQuest ?? suggestion?.quest;
    if (!quest) return;

    clearTimers();
    const reached = completeQuest(quest.id);
    setCompletedQuest(quest);
    setMilestone(reached);
    setPhase('complete');
    react(
      reached
        ? { text: `${reached} quests!`, state: 'celebrating', holdMs: 2800 }
        : pickReaction(REACTIONS.complete),
    );

    // Two cycles of the jump, then it calms down and just stands there pleased.
    // A milestone earns a little longer.
    settleTo('idle', reached ? 3400 : 2500);
  }, [activeQuest, clearTimers, completeQuest, react, settleTo, suggestion]);

  const requestComplete = useCallback(() => {
    clearTimers();

    // Opt-out, not opt-in: the check is on by default because a streak you did not
    // earn is the one thing that would quietly make this app mean nothing.
    if (!state.settings.confirmCompletion) {
      complete();
      return;
    }

    setPhase('confirming');
    react(pickReaction(REACTIONS.confirming));
  }, [clearTimers, complete, react, state.settings.confirmCompletion]);

  const cancelComplete = useCallback(() => {
    clearTimers();
    setPhase('active');
    setMascotState('walking');
    setSpeech(null);
  }, [clearTimers]);

  const abandon = useCallback(() => {
    clearTimers();
    abandonQuest();
    setPhase('idle');
    setSuggestion(null);
    react(pickReaction(REACTIONS.abandoned));
    later(() => setMascotState('idle'), 1800);
  }, [abandonQuest, clearTimers, later, react]);

  const reset = useCallback(() => {
    clearTimers();
    rerolls.current = 0;
    rejected.current = [];
    setPhase('idle');
    setSuggestion(null);
    setMilestone(null);
    setCompletedQuest(null);
    setQuestion(null);
    setMascotState('idle');
    setSpeech(null);
  }, [clearTimers]);

  const poke = useCallback(() => {
    if (phase === 'generating') return;

    mood.current = disturb(mood.current, DISTURBANCE.poke);
    const tier = moodTier(mood.current);

    // Past the last tier it stops answering altogether. Continuing to poke keeps the
    // meter pinned, so pestering it while it sulks only makes the silence last longer.
    if (tier === 'done') {
      clearTimers();
      setWithdrawn(true);
      setMascotState('annoyed');
      setSpeech(null);
      return;
    }

    clearTimers();
    const resting: MascotState = phase === 'active' ? 'walking' : 'idle';
    react(
      mascotState === 'sleeping'
        ? pickReaction(REACTIONS.wokeUp)
        : pickReaction(POKE_LADDER[tier]),
      { hold: false },
    );
    later(() => {
      setMascotState(resting);
      setSpeech(null);
    }, 1300);
  }, [clearTimers, later, mascotState, phase, react]);

  const setInterested = useCallback(
    (interested: boolean) => {
      if (phase !== 'idle') return;
      if (interested) {
        react(pickReaction(REACTIONS.interested), { hold: false });
      } else {
        setMascotState('idle');
        setSpeech(null);
      }
    },
    [phase, react],
  );

  return {
    phase,
    suggestion,
    completedQuest,
    question,
    error,
    mascotState,
    speech,
    milestone,
    searchDurationMs,
    awaitingProvider,
    withdrawn,
    startConfiguring,
    cancelConfiguring,
    generate,
    surpriseMe,
    another,
    accept,
    requestComplete,
    cancelComplete,
    complete,
    abandon,
    reset,
    answerQuestion,
    poke,
    setInterested,
  };
}
