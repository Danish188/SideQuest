import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getQuestById } from '@/data/quests';
import { EMPTY_STATE, RECENT_LIMIT, storageService } from '@/services/storageService';
import {
  advanceStreak,
  computeStats,
  milestoneReached,
  resolveStreak,
} from '@/services/statsService';
import type { AppSettings, Quest, QuestPreferences, QuestState, Stats } from '@/types';

/** Cap on stored generated quests, so localStorage cannot grow without bound. */
const GENERATED_LIMIT = 200;

export interface HistoryEntry {
  quest: Quest;
  completedAt: string;
}

interface QuestStoreValue {
  state: QuestState;
  stats: Stats;
  history: HistoryEntry[];
  activeQuest: Quest | null;
  /** Titles of recently shown quests, for prompting the AI provider. */
  recentTitles: string[];
  isFavorite: (questId: string) => boolean;
  toggleFavorite: (questId: string) => void;
  /**
   * Takes the whole quest, not an id: a generated quest exists nowhere but this
   * object, so showing it is the only chance to keep it.
   */
  markShown: (quest: Quest) => void;
  acceptQuest: (questId: string) => void;
  /** Returns the milestone this completion unlocked, so the mascot can react. */
  completeQuest: (questId: string) => number | null;
  abandonQuest: () => void;
  savePreferences: (preferences: QuestPreferences) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetProgress: () => void;
}

const QuestStoreContext = createContext<QuestStoreValue | null>(null);

export function QuestStoreProvider({ children }: { children: ReactNode }) {
  // Read once, synchronously, so the first render already has the user's data and
  // History never flashes an empty state on reload.
  const [state, setState] = useState<QuestState>(() => {
    const loaded = storageService.loadState();
    return { ...loaded, streak: resolveStreak(loaded.streak) };
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    storageService.saveState(state);
  }, [state]);

  const markShown = useCallback((quest: Quest) => {
    setState((prev) => {
      // A generated quest exists nowhere but here, so it has to be kept or History
      // and the active-quest lookup lose it the moment the session ends.
      const isGenerated = !getQuestById(quest.id);
      const alreadyStored = prev.generatedQuests.some((entry) => entry.id === quest.id);

      return {
        ...prev,
        recentlyShown: [quest.id, ...prev.recentlyShown.filter((id) => id !== quest.id)].slice(
          0,
          RECENT_LIMIT,
        ),
        generatedQuests:
          isGenerated && !alreadyStored
            ? [quest, ...prev.generatedQuests].slice(0, GENERATED_LIMIT)
            : prev.generatedQuests,
      };
    });
  }, []);

  const acceptQuest = useCallback((questId: string) => {
    setState((prev) => ({ ...prev, activeQuestId: questId, acceptedAt: new Date().toISOString() }));
  }, []);

  const abandonQuest = useCallback(() => {
    setState((prev) => ({ ...prev, activeQuestId: null, acceptedAt: null }));
  }, []);

  // Derived here rather than inside the updater: updaters must stay pure (React
  // runs them twice in development) and the caller needs the answer immediately.
  const completeQuest = useCallback(
    (questId: string) => {
      const milestone = milestoneReached(
        state.completed.length + 1,
        state.celebratedMilestones,
      );

      setState((prev) => ({
        ...prev,
        completed: [{ questId, completedAt: new Date().toISOString() }, ...prev.completed],
        activeQuestId: null,
        acceptedAt: null,
        streak: advanceStreak(prev.streak),
        celebratedMilestones: milestone
          ? [...prev.celebratedMilestones, milestone]
          : prev.celebratedMilestones,
      }));

      return milestone;
    },
    [state.completed.length, state.celebratedMilestones],
  );

  const toggleFavorite = useCallback((questId: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(questId)
        ? prev.favorites.filter((id) => id !== questId)
        : [questId, ...prev.favorites],
    }));
  }, []);

  const savePreferences = useCallback((preferences: QuestPreferences) => {
    setState((prev) => ({ ...prev, preferences }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    storageService.clear();
    setState({ ...EMPTY_STATE });
  }, []);

  const value = useMemo<QuestStoreValue>(() => {
    const generated = new Map(state.generatedQuests.map((quest) => [quest.id, quest]));
    const resolve = (id: string): Quest | undefined => getQuestById(id) ?? generated.get(id);

    const history = state.completed
      .map((record) => {
        const quest = resolve(record.questId);
        return quest ? { quest, completedAt: record.completedAt } : null;
      })
      // Quests removed from the catalogue between releases are simply dropped.
      .filter((entry): entry is HistoryEntry => entry !== null);

    return {
      state,
      stats: computeStats(state),
      history,
      activeQuest: state.activeQuestId ? (resolve(state.activeQuestId) ?? null) : null,
      recentTitles: state.recentlyShown
        .map((id) => resolve(id)?.title)
        .filter((title): title is string => Boolean(title)),
      isFavorite: (questId: string) => state.favorites.includes(questId),
      toggleFavorite,
      markShown,
      acceptQuest,
      completeQuest,
      abandonQuest,
      savePreferences,
      updateSettings,
      resetProgress,
    };
  }, [
    state,
    toggleFavorite,
    markShown,
    acceptQuest,
    completeQuest,
    abandonQuest,
    savePreferences,
    updateSettings,
    resetProgress,
  ]);

  return <QuestStoreContext.Provider value={value}>{children}</QuestStoreContext.Provider>;
}

export function useQuestStore(): QuestStoreValue {
  const context = useContext(QuestStoreContext);
  if (!context) throw new Error('useQuestStore must be used inside a QuestStoreProvider');
  return context;
}
