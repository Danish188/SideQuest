import type { AppSettings, QuestState, ThemeMode } from '@/types';

const STATE_KEY = 'sidequest:state';
const THEME_KEY = 'sidequest:theme';
const SCHEMA_VERSION = 1;

/** Enough history to stop repeats without hiding most of the catalogue. */
const RECENT_LIMIT = 12;

interface PersistedState extends QuestState {
  version: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  confirmCompletion: true,
  // Off by default: it costs money per quest and needs a deployed endpoint, so it
  // is something you switch on, never something that switches itself on for you.
  aiQuests: false,
};

export const EMPTY_STATE: QuestState = {
  completed: [],
  favorites: [],
  recentlyShown: [],
  activeQuestId: null,
  acceptedAt: null,
  streak: { current: 0, longest: 0, lastCompletedDate: null },
  preferences: null,
  celebratedMilestones: [],
  generatedQuests: [],
  settings: DEFAULT_SETTINGS,
};

/**
 * Every localStorage call in the app goes through here.
 *
 * Storage throws in private browsing modes and disabled-cookie setups, and a
 * bored user should still get a quest in those cases — so reads fall back to
 * empty state and writes fail silently rather than taking the page down.
 */
function readRaw<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage unavailable or full — the session still works, it just won't persist. */
  }
}

/** Trusts nothing from storage: a hand-edited or half-migrated blob must not crash the app. */
function reconcile(stored: Partial<PersistedState> | null): QuestState {
  if (!stored || typeof stored !== 'object') return { ...EMPTY_STATE };

  return {
    completed: Array.isArray(stored.completed) ? stored.completed : [],
    favorites: Array.isArray(stored.favorites) ? stored.favorites : [],
    recentlyShown: Array.isArray(stored.recentlyShown) ? stored.recentlyShown : [],
    activeQuestId: typeof stored.activeQuestId === 'string' ? stored.activeQuestId : null,
    acceptedAt: typeof stored.acceptedAt === 'string' ? stored.acceptedAt : null,
    streak: {
      current: Number(stored.streak?.current) || 0,
      longest: Number(stored.streak?.longest) || 0,
      lastCompletedDate: stored.streak?.lastCompletedDate ?? null,
    },
    preferences: stored.preferences ?? null,
    celebratedMilestones: Array.isArray(stored.celebratedMilestones)
      ? stored.celebratedMilestones
      : [],
    generatedQuests: Array.isArray(stored.generatedQuests) ? stored.generatedQuests : [],
    // Picked key by key rather than spread, so a setting a later release drops is
    // not left sitting in storage forever. `mascot3d` outlived the 3D companion
    // that way. Adding a setting means adding a line here, which at this size is
    // the better trade.
    settings: {
      confirmCompletion:
        typeof stored.settings?.confirmCompletion === 'boolean'
          ? stored.settings.confirmCompletion
          : DEFAULT_SETTINGS.confirmCompletion,
      aiQuests:
        typeof stored.settings?.aiQuests === 'boolean'
          ? stored.settings.aiQuests
          : DEFAULT_SETTINGS.aiQuests,
    },
  };
}

export const storageService = {
  loadState(): QuestState {
    return reconcile(readRaw<PersistedState>(STATE_KEY));
  },

  saveState(state: QuestState): void {
    const persisted: PersistedState = {
      ...state,
      recentlyShown: state.recentlyShown.slice(0, RECENT_LIMIT),
      version: SCHEMA_VERSION,
    };
    writeRaw(STATE_KEY, persisted);
  },

  loadTheme(): ThemeMode | null {
    // Stored as a bare string, not JSON, so the pre-paint script in index.html can
    // read it without a parser. Read it back the same way.
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  },

  saveTheme(theme: ThemeMode): void {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* no-op */
    }
  },

  clear(): void {
    try {
      window.localStorage.removeItem(STATE_KEY);
    } catch {
      /* no-op */
    }
  },
};

export { RECENT_LIMIT };
