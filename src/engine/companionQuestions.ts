import type {
  MascotQuestion,
  MascotQuestionOption,
  MascotState,
  QuestPreferences,
} from '@/types';

const ENDPOINT = '/api/quest';
/** The user is already waiting on an outburst; past this, use the written question. */
const TIMEOUT_MS = 9_000;

const ACTIONS = ['redraw', 'easier', 'reconfigure', 'giveUp'] as const;
type Action = (typeof ACTIONS)[number];

/** The pose each answer is delivered with. The model writes words, not body language. */
const REPLY_STATE: Record<Action, MascotState> = {
  redraw: 'excited',
  easier: 'thinking',
  reconfigure: 'curious',
  giveUp: 'annoyed',
};

export interface QuestionContext {
  rejectedCount: number;
  rejectedTitles: string[];
  preferences: QuestPreferences | null;
}

interface RawOption {
  label?: unknown;
  action?: unknown;
  reply?: unknown;
}

function toOption(raw: RawOption): MascotQuestionOption | null {
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  const reply = typeof raw.reply === 'string' ? raw.reply.trim() : '';
  const action = ACTIONS.find((candidate) => candidate === raw.action);

  if (!label || !action) return null;

  return {
    label: label.slice(0, 40),
    action,
    reply: {
      text: (reply || 'Right.').slice(0, 48),
      state: REPLY_STATE[action],
      holdMs: action === 'giveUp' ? 2400 : undefined,
    },
  };
}

/**
 * Asks the model to write the companion's question.
 *
 * The model only ever supplies *words*. Every `action` is validated against the
 * behaviours the app already implements, so a generated question can never offer
 * the user a button that does nothing, which is the failure mode that would make
 * the whole conversation feel fake.
 *
 * Returns null on any problem at all; the caller falls back to a written question.
 */
export async function fetchCompanionQuestion(
  context: QuestionContext,
): Promise<MascotQuestion | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        kind: 'question',
        rejectedCount: context.rejectedCount,
        rejectedTitles: context.rejectedTitles,
        preferences: context.preferences,
      }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { text?: unknown; options?: unknown };
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';
    if (!text || !Array.isArray(payload.options)) return null;

    const options = payload.options
      .map((option) => toOption(option as RawOption))
      .filter((option): option is MascotQuestionOption => option !== null)
      // One button per action: two routes to the same outcome is just a longer menu.
      .filter(
        (option, index, all) => all.findIndex((other) => other.action === option.action) === index,
      );

    if (options.length < 2) return null;

    return { id: 'generated', text: text.slice(0, 80), options: options.slice(0, 3) };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
