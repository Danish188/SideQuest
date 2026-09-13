/**
 * Generation for the companion, shared by the Vercel and Cloudflare Pages handlers.
 *
 * Deliberately written against `fetch` rather than a provider SDK: the same file
 * has to run unchanged on Node (Vercel) and on the Workers runtime (Cloudflare
 * Pages), and it keeps the project's dependency count at zero for the backend.
 * Swapping providers means editing `requestBody` and `readContent` in this file.
 */

const ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

/** One endpoint serves both kinds of generation, so there is one route to deploy. */
export type GenerationKind = 'quest' | 'question';

export interface QuestionRequestBody {
  kind: 'question';
  /** How many suggestions in a row they have turned down. */
  rejectedCount: number;
  /** What they rejected. The model needs this to say something specific. */
  rejectedTitles: string[];
  preferences: QuestRequestBody['preferences'];
}

export interface QuestRequestBody {
  kind?: 'quest';
  preferences: {
    timeAvailable: number;
    mood: string;
    context: string;
    difficulty: string;
  } | null;
  avoidTitles?: string[];
}

const CATEGORIES = [
  'build',
  'learn',
  'creative',
  'outside',
  'social',
  'fitness',
  'explore',
  'random',
  'digital',
  'offline',
];

const CONTEXT_WORDS: Record<string, string> = {
  home: 'at home',
  outside: 'outdoors, away from home',
  computer: 'sitting at a computer',
  anywhere: 'anywhere, so it must not depend on being in a particular place',
};

/**
 * The house style, stated as rules rather than adjectives.
 *
 * "Be creative" produces nothing; "never suggest "go for a walk", and name a
 * specific first action" produces the thing we actually want. The bar is the same
 * one the hand-written catalogue has to clear.
 */
const SYSTEM_PROMPT = `You write single quests for SideQuest, an anti-boredom app.

A quest is one small, specific, genuinely interesting thing to do right now.

Rules, in order of importance:
1. BE SPECIFIC. "Read a book" is a failure. "Take an unread book off the shelf, read its last page first, then decide whether you still want the other three hundred" is a pass. Name the first concrete action.
2. NEVER suggest generic filler: go for a walk, read a book, watch a movie, listen to music, meditate, journal, call a friend, clean your room, take a nap, drink water.
3. It must be doable with things an ordinary person already owns, alone, right now, and must fit inside the stated time.
4. It must be safe and legal. No trespassing, no risk of injury, no deceiving people, no contacting strangers under false pretences, no spending money.
5. Have a point of view. Dry wit is welcome. Do not be twee and do not use exclamation marks.
6. NEVER use em dashes or en dashes. Use a full stop, a comma, a colon or brackets instead. This applies to every field.
7. The description is 2-4 sentences, second person, no preamble and no headings.
8. The title is 2-5 words, in Title Case, and is not a sentence.

You reply with JSON only.`;

function buildUserPrompt(body: QuestRequestBody): string {
  const { preferences, avoidTitles = [] } = body;

  const brief = preferences
    ? [
        `Time available: ${preferences.timeAvailable} minutes. The quest must fit comfortably inside this.`,
        `Mood: ${preferences.mood}.`,
        `Where they are: ${CONTEXT_WORDS[preferences.context] ?? preferences.context}.`,
        `Difficulty: ${preferences.difficulty}.${
          preferences.difficulty === 'unhinged'
            ? ' "Unhinged" means absurd, committed and memorable, still safe and legal, just a genuinely strange choice of thing to do.'
            : ''
        }`,
      ].join('\n')
    : 'No preferences given, so surprise them. Pick something that takes under 30 minutes and works almost anywhere.';

  const avoid = avoidTitles.length
    ? `\n\nThey have just been shown these, so write something different in kind, not a variation:\n${avoidTitles
        .slice(0, 12)
        .map((title) => `- ${title}`)
        .join('\n')}`
    : '';

  return `${brief}${avoid}\n\nWrite one quest for them.`;
}

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string', enum: CATEGORIES },
    estimatedMinutes: { type: 'integer' },
    difficulty: { type: 'string', enum: ['easy', 'medium', 'unhinged'] },
    companionLine: {
      type: 'string',
      description:
        'At most six words, said by a small mischievous companion reacting to THIS quest. No emoji.',
    },
  },
  required: ['title', 'description', 'category', 'estimatedMinutes', 'difficulty', 'companionLine'],
  additionalProperties: false,
} as const;

/**
 * The model writes the words; the app owns what the words do.
 *
 * `action` is an enum of behaviours the client already implements, so a generated
 * question can never promise something the app cannot deliver. This is the whole
 * reason the question is generated as structured data rather than as prose.
 */
const QUESTION_SCHEMA = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'The question, max 8 words, addressed to the user. No emoji.',
    },
    options: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          label: { type: 'string', description: 'The button, max 5 words, first person.' },
          action: {
            type: 'string',
            enum: ['redraw', 'easier', 'reconfigure', 'giveUp'],
            description:
              'redraw = try another quest. easier = lower the difficulty. reconfigure = start the questionnaire over. giveUp = stop for now.',
          },
          reply: {
            type: 'string',
            description: 'What the companion says back, max 6 words.',
          },
        },
        required: ['label', 'action', 'reply'],
        additionalProperties: false,
      },
    },
  },
  required: ['text', 'options'],
  additionalProperties: false,
} as const;

const QUESTION_SYSTEM_PROMPT = `You write one line of dialogue for the companion character in SideQuest, an anti-boredom app.

The user has rejected several suggested quests in a row. The companion is a small, dry, slightly mischievous creature who has run out of patience and is now asking them a direct question instead of suggesting anything else.

Rules:
1. Be SPECIFIC to what they actually rejected. If they turned down three social quests, notice that. Generic exasperation is a failure.
2. The question is at most 8 words. Short is funnier and more human.
3. Dry and deadpan. Never cute, never twee, no exclamation marks, no emoji.
4. NEVER use em dashes or en dashes. Use a full stop, a comma or a colon instead.
5. Do not be cruel and do not shame them. It is exasperated, not mean.
6. Give 2-3 options. Each must map to one of the allowed actions, and the label must honestly describe what that action does.
7. Always include one option that lets them off the hook or changes the terms. Never make every option "try again".

You reply with JSON only.`;

function buildQuestionPrompt(body: QuestionRequestBody): string {
  const { rejectedCount, rejectedTitles, preferences } = body;

  const context = preferences
    ? `They asked for: ${preferences.timeAvailable} minutes, ${preferences.mood} mood, ${preferences.context}, ${preferences.difficulty} difficulty.`
    : 'They did not answer the questionnaire. They just kept asking to be surprised.';

  const listed = rejectedTitles
    .slice(0, 8)
    .map((title) => `- ${title}`)
    .join('\n');

  const rejected = listed ? `\n\nThey rejected these, in order:\n${listed}` : '';

  return `They have turned down ${rejectedCount} suggestions in a row. ${context}${rejected}\n\nAsk them one question.`;
}

export interface GenerateResult {
  status: number;
  body: unknown;
}

export async function generateQuest(
  body: QuestRequestBody,
  apiKey: string | undefined,
): Promise<GenerateResult> {
  if (!apiKey) {
    // Not an error the user should see: the client falls back to the catalogue.
    return { status: 503, body: { error: 'Quest generation is not configured.' } };
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      // High enough to be surprising, low enough to stay coherent and on-brief.
      temperature: 1,
      max_tokens: 400,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(body) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'quest', strict: true, schema: SCHEMA },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    return {
      status: response.status === 429 ? 429 : 502,
      body: { error: 'Quest generation failed.', detail: detail.slice(0, 300) },
    };
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) return { status: 502, body: { error: 'Empty response from the model.' } };

  try {
    return { status: 200, body: JSON.parse(content) };
  } catch {
    return { status: 502, body: { error: 'The model returned malformed JSON.' } };
  }
}

export async function generateQuestion(
  body: QuestionRequestBody,
  apiKey: string | undefined,
): Promise<GenerateResult> {
  if (!apiKey) return { status: 503, body: { error: 'Generation is not configured.' } };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 1,
      max_tokens: 300,
      messages: [
        { role: 'system', content: QUESTION_SYSTEM_PROMPT },
        { role: 'user', content: buildQuestionPrompt(body) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'companion_question', strict: true, schema: QUESTION_SCHEMA },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    return {
      status: response.status === 429 ? 429 : 502,
      body: { error: 'Question generation failed.', detail: detail.slice(0, 300) },
    };
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return { status: 502, body: { error: 'Empty response from the model.' } };

  try {
    return { status: 200, body: JSON.parse(content) };
  } catch {
    return { status: 502, body: { error: 'The model returned malformed JSON.' } };
  }
}

/** Shared request handling, so both platform adapters stay three lines long. */
export async function handleQuestRequest(
  request: Request,
  apiKey: string | undefined,
): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  let body: QuestRequestBody | QuestionRequestBody;
  try {
    body = (await request.json()) as QuestRequestBody | QuestionRequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const result =
    body.kind === 'question'
      ? await generateQuestion(body, apiKey)
      : await generateQuest(body, apiKey);
  return Response.json(result.body, {
    status: result.status,
    // Every request must be freshly generated; a cached quest defeats the point.
    headers: { 'cache-control': 'no-store' },
  });
}
