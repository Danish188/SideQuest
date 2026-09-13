import type {
  Difficulty,
  Quest,
  QuestCategory,
  QuestProvider,
  QuestRequest,
  QuestSuggestion,
} from '@/types';
import { DIFFICULTIES, QUEST_CATEGORIES } from '@/types';

const ENDPOINT = '/api/quest';

/**
 * Past this the wait stops reading as anticipation and starts reading as a bug.
 * The catalogue answers instantly, so giving up early costs the user nothing.
 */
const TIMEOUT_MS = 12_000;

/** A generated quest has no catalogue id, so it gets one that cannot collide. */
function generatedId(): string {
  return `gen-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface RawQuest {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  estimatedMinutes?: unknown;
  difficulty?: unknown;
  companionLine?: unknown;
}

/**
 * Turns whatever came back into a `Quest`, or null if it is not usable.
 *
 * The model is constrained by a JSON schema server-side, but "constrained" is not
 * "guaranteed", and the one thing this product cannot do is show the user a broken
 * or impossible quest. Anything that fails here is thrown away and the catalogue
 * answers instead, which the user experiences as a normal draw.
 */
function toQuest(raw: RawQuest, request: QuestRequest): Quest | null {
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  if (!title || !description) return null;

  const category = QUEST_CATEGORIES.find((c) => c === raw.category) as QuestCategory | undefined;
  const difficulty = DIFFICULTIES.find((d) => d === raw.difficulty) as Difficulty | undefined;
  if (!category || !difficulty) return null;

  const minutes = Number(raw.estimatedMinutes);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;

  // A quest that does not fit the time they told us they had is worse than no
  // quest at all: it is the one promise the questionnaire actually made.
  const budget = request.preferences?.timeAvailable;
  if (budget !== undefined && minutes > budget) return null;

  return {
    id: generatedId(),
    title: title.slice(0, 80),
    description,
    category,
    estimatedMinutes: Math.round(minutes),
    difficulty,
    // It was written for exactly these answers, so it matches them by construction.
    compatibleMoods: request.preferences ? [request.preferences.mood] : [],
    compatibleContexts: request.preferences ? [request.preferences.context] : [],
  };
}

/**
 * Asks the backend for a quest written for this exact request.
 *
 * Throws on any failure rather than returning something degraded. The caller
 * (`CompositeQuestProvider`) catches and falls back to the catalogue, so every
 * failure mode here is invisible to the user.
 */
export class AIQuestProvider implements QuestProvider {
  readonly id = 'ai';

  async suggest(request: QuestRequest): Promise<QuestSuggestion> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          kind: 'quest',
          preferences: request.preferences ?? null,
          avoidTitles: request.recentTitles ?? [],
        }),
      });

      // 503 means no key is configured, which is a normal state, not a fault.
      if (!response.ok) throw new Error(`Quest generation failed (${response.status}).`);

      const raw = (await response.json()) as RawQuest;
      const quest = toQuest(raw, request);
      if (!quest) throw new Error('The model returned a quest we cannot use.');

      const companionLine =
        typeof raw.companionLine === 'string' && raw.companionLine.trim()
          ? raw.companionLine.trim().slice(0, 48)
          : undefined;

      return {
        quest,
        score: 0.95,
        reasons: ['Written for your answers'],
        companionLine,
        source: 'ai',
      };
    } finally {
      window.clearTimeout(timeout);
    }
  }
}
