import type { QuestProvider, QuestRequest, QuestSuggestion } from '@/types';
import { AIQuestProvider } from './aiQuestProvider';
import { LocalQuestProvider } from './localQuestProvider';

export { AIQuestProvider } from './aiQuestProvider';
export { LocalQuestProvider } from './localQuestProvider';

/**
 * Asks the model first, and guarantees an answer either way.
 *
 * Every draw goes to the model, so the catalogue is no longer something you fall
 * back *to* by choice: it is the floor under a network call that can always fail.
 * If the model is slow, rate-limited, returns nonsense, or the endpoint is not
 * deployed at all, the user still gets a real quest instead of an error. A bored
 * person pressing a button should never be told to try again later, and they
 * should never be able to tell which of the two answered.
 */
class CompositeQuestProvider implements QuestProvider {
  readonly id = 'composite';

  constructor(
    private readonly local: QuestProvider,
    private readonly ai: QuestProvider,
  ) {}

  async suggest(request: QuestRequest): Promise<QuestSuggestion> {
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
