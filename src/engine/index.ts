import type { QuestProvider, QuestRequest, QuestSuggestion } from '@/types';
import { AIQuestProvider } from './aiQuestProvider';
import { LocalQuestProvider } from './localQuestProvider';

export { AIQuestProvider } from './aiQuestProvider';
export { LocalQuestProvider } from './localQuestProvider';

/**
 * Routes each request to the AI provider or the catalogue, and guarantees an answer.
 *
 * The local engine is not a degraded mode, it is the default and the floor. If the
 * model is slow, rate-limited, returns nonsense, or the endpoint is not deployed at
 * all, the user still gets a real quest instead of an error. A bored person pressing
 * a button should never be told to try again later.
 */
class CompositeQuestProvider implements QuestProvider {
  readonly id = 'composite';

  constructor(
    private readonly local: QuestProvider,
    private readonly ai: QuestProvider,
  ) {}

  async suggest(request: QuestRequest): Promise<QuestSuggestion> {
    if (!request.preferAi) return this.local.suggest(request);

    try {
      return await this.ai.suggest(request);
    } catch (error) {
      if (import.meta.env.DEV) console.warn('AI quest failed, using the catalogue:', error);
      return this.local.suggest(request);
    }
  }
}

/**
 * The single place the app decides where quests come from. No screen imports a
 * concrete provider, so swapping or adding one is a change to this file alone.
 */
export const questProvider: QuestProvider = new CompositeQuestProvider(
  new LocalQuestProvider(),
  new AIQuestProvider(),
);
