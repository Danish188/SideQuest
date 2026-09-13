import { QUESTS } from '@/data/quests';
import type {
  Quest,
  QuestPreferences,
  QuestProvider,
  QuestRequest,
  QuestSuggestion,
} from '@/types';
import { NoQuestFoundError } from '@/types';
import { pickWeighted } from '@/utils/random';
import { fitsContext, fitsTimeBudget, normaliseScore, scoreQuest } from './scoring';

/** How many of the top-ranked quests are eligible for the final weighted draw. */
const SHORTLIST_SIZE = 6;

/**
 * Chooses quests from the bundled catalogue, with no network involved.
 *
 * The public surface is deliberately just `suggest(request)`, so swapping in a
 * network-backed provider later is a one-line change at the composition root
 * rather than a rewrite of every screen that shows a quest.
 */
export class LocalQuestProvider implements QuestProvider {
  readonly id = 'local';

  constructor(private readonly catalogue: readonly Quest[] = QUESTS) {}

  async suggest(request: QuestRequest): Promise<QuestSuggestion> {
    return request.preferences
      ? this.suggestMatched(request, request.preferences)
      : this.suggestRandom(request);
  }

  /** "Surprise Me": no questionnaire, so the only rule is "not one you just saw". */
  private suggestRandom(request: QuestRequest): QuestSuggestion {
    const recent = new Set(request.recentIds);
    const completed = new Set(request.completedIds);

    const unseen = this.catalogue.filter((quest) => !recent.has(quest.id));
    const pool = unseen.length > 0 ? unseen : this.catalogue;

    // Mild bias towards quests the user has never finished, without ruling out
    // favourites they might want again.
    const weights = pool.map((quest) => (completed.has(quest.id) ? 1 : 3));
    const quest = pickWeighted(pool, weights);

    if (!quest) throw new NoQuestFoundError('The quest catalogue is empty.');

    return { quest, score: 0.5, reasons: ['Straight from the deck'], source: 'local' };
  }

  private suggestMatched(request: QuestRequest, preferences: QuestPreferences): QuestSuggestion {
    const recent = new Set(request.recentIds);
    const completed = new Set(request.completedIds);

    const candidates = this.selectCandidates(preferences);
    if (candidates.length === 0) throw new NoQuestFoundError();

    const shortlist = candidates
      .map((quest) => scoreQuest(quest, preferences, recent, completed))
      .sort((a, b) => b.score - a.score)
      .slice(0, SHORTLIST_SIZE);

    const chosen = pickWeighted(
      shortlist,
      // Rank-based weights keep the top result likely without making it certain.
      shortlist.map((_, index) => SHORTLIST_SIZE - index),
    );

    if (!chosen) throw new NoQuestFoundError();

    return {
      quest: chosen.quest,
      score: normaliseScore(chosen.score),
      reasons: chosen.reasons,
      source: 'local',
    };
  }

  /**
   * Time and place are real constraints, so they filter rather than score — but if
   * a narrow combination empties the pool we relax place, then time, rather than
   * telling the user there is nothing to do.
   */
  private selectCandidates(preferences: QuestPreferences): Quest[] {
    const withinTime = this.catalogue.filter((quest) =>
      fitsTimeBudget(quest, preferences.timeAvailable),
    );

    const withinTimeAndPlace = withinTime.filter((quest) => fitsContext(quest, preferences.context));
    if (withinTimeAndPlace.length > 0) return withinTimeAndPlace;
    if (withinTime.length > 0) return withinTime;

    return [...this.catalogue];
  }
}
