import type { MascotQuestion, MascotReaction } from '@/types';
import type { MoodTier } from '@/services/companionMood';

/**
 * Everything the companion says, with the pose that delivers it.
 *
 * The rule when adding a line: read it out loud and ask what your body would do.
 * "Again?!" is not said while bobbing gently — it is said with your arms up. That
 * pairing is why these live together instead of in two separate lists.
 */
export const REACTIONS = {
  searching: [
    { text: 'Hmm...', state: 'thinking' },
    { text: 'Let me look.', state: 'thinking' },
    { text: 'One second.', state: 'thinking' },
  ],

  found: [
    { text: 'This one.', state: 'excited' },
    { text: "Okay, this one's good.", state: 'excited' },
    { text: 'Found something.', state: 'excited' },
  ],

  foundUnhinged: [
    { text: 'You sure? 👀', state: 'surprised' },
    { text: 'Oh, this is a choice.', state: 'surprised' },
    { text: 'Bold. Respect.', state: 'surprised' },
  ],

  /** First couple of re-rolls — mild, still cooperative. */
  rerollMild: [
    { text: 'Fine.', state: 'annoyed' },
    { text: 'Picky.', state: 'annoyed' },
    { text: 'Alright, alright.', state: 'annoyed' },
  ],

  /** It has now been asked several times and has stopped hiding it. */
  rerollFrustrated: [
    { text: 'Again?!', state: 'frustrated', holdMs: 1500 },
    { text: 'Oh, come ON.', state: 'frustrated', holdMs: 1500 },
    { text: 'Seriously?', state: 'frustrated', holdMs: 1500 },
    { text: 'I am trying my best here.', state: 'frustrated', holdMs: 1900 },
  ],

  accepted: [
    { text: 'Quest accepted.', state: 'celebrating' },
    { text: "Let's go.", state: 'celebrating' },
    { text: 'Good pick.', state: 'celebrating' },
  ],

  complete: [
    { text: 'Nice.', state: 'celebrating' },
    { text: 'That counts.', state: 'celebrating' },
    { text: 'Look at you.', state: 'celebrating' },
  ],

  abandoned: [
    { text: 'No worries.', state: 'annoyed' },
    { text: 'Another time.', state: 'annoyed' },
    { text: 'Fair enough.', state: 'annoyed' },
  ],

  interested: [
    { text: "Alright, let's do something.", state: 'excited' },
    { text: 'Finally.', state: 'excited' },
    { text: 'Oh good.', state: 'excited' },
  ],

  confirming: [
    { text: 'Did you though?', state: 'curious' },
    { text: 'Really?', state: 'curious' },
    { text: 'Honour system.', state: 'curious' },
  ],

  /** Said when it comes back after being left alone long enough to cool off. */
  reconciled: [
    { text: '...okay. Hi.', state: 'curious', holdMs: 2400 },
    { text: 'Right. Where were we.', state: 'curious', holdMs: 2600 },
    { text: "Fine, I'm over it.", state: 'idle', holdMs: 2400 },
  ],

  wokeUp: [
    { text: 'Hm? Oh.', state: 'surprised' },
    { text: "I wasn't asleep.", state: 'annoyed' },
  ],
} satisfies Record<string, MascotReaction[]>;

/**
 * Replies to being poked, by how much patience is left.
 *
 * Read down the tiers and it is one conversation going bad: full sentences, then
 * clipped ones, then a question asked with a full stop instead of a question mark,
 * then nothing at all. That shortening is what people actually do as they
 * disengage — the words run out before the temper does.
 */
export const POKE_LADDER = {
  patient: [
    { text: 'Oi.', state: 'surprised' },
    { text: 'That tickles.', state: 'excited' },
    { text: 'Hello to you too.', state: 'excited' },
  ],
  terse: [
    { text: 'Yes?', state: 'curious' },
    { text: 'Still here.', state: 'curious' },
    { text: 'Mm?', state: 'curious' },
  ],
  irritated: [
    { text: 'What.', state: 'annoyed', holdMs: 1500 },
    { text: 'Do you need something?', state: 'annoyed', holdMs: 1800 },
    { text: 'Okay, enough.', state: 'annoyed', holdMs: 1500 },
  ],
  frustrated: [
    { text: 'Stop.', state: 'frustrated', holdMs: 1400 },
    { text: "I'm not a toy.", state: 'frustrated', holdMs: 1700 },
    { text: 'Seriously, stop.', state: 'frustrated', holdMs: 1500 },
  ],
  // Nothing left to say. It turns its back and waits you out — the session's
  // `withdrawn` flag, not a line.
  done: [],
} satisfies Record<MoodTier, MascotReaction[]>;

let lastSpoken: string | null = null;

/**
 * Picks a line, avoiding an immediate repeat. Saying the identical thing twice in a
 * row is one of the fastest ways for a character to stop reading as one.
 */
export function pickReaction(pool: readonly MascotReaction[]): MascotReaction {
  if (pool.length === 0) return { text: '', state: 'idle' };

  const fresh = pool.filter((reaction) => reaction.text !== lastSpoken);
  const choices = fresh.length > 0 ? fresh : pool;
  const chosen = choices[Math.floor(Math.random() * choices.length)];

  lastSpoken = chosen.text;
  return chosen;
}

/**
 * Questions the companion asks once it has been re-rolled enough times to have an
 * opinion about it. Every answer changes what happens next — none of them are
 * decoration, because a character that asks a question it ignores is worse than
 * one that stays quiet.
 */
export const MASCOT_QUESTIONS: Record<'difficulty' | 'commitment', MascotQuestion> = {
  difficulty: {
    id: 'difficulty',
    text: 'Too much, or just not it?',
    options: [
      {
        label: 'Make it easier',
        action: 'easier',
        reply: { text: 'Okay, dialling it down.', state: 'thinking' },
      },
      {
        label: "I'll change my answers",
        action: 'reconfigure',
        reply: { text: 'Good. Start again.', state: 'curious' },
      },
      {
        label: 'Just keep going',
        action: 'redraw',
        reply: { text: 'Your funeral.', state: 'annoyed' },
      },
    ],
  },

  commitment: {
    id: 'commitment',
    text: 'Are you actually going to do one of these?',
    options: [
      {
        label: 'Yes. I mean it.',
        action: 'redraw',
        reply: { text: 'Right. Last one then.', state: 'excited' },
      },
      {
        label: 'Honestly, no',
        action: 'giveUp',
        reply: { text: 'At least you said it.', state: 'annoyed', holdMs: 2400 },
      },
    ],
  },
};

/** How many re-rolls before each escalation step. */
export const REROLL_FRUSTRATED_AT = 3;
export const REROLL_ASK_DIFFICULTY_AT = 4;
export const REROLL_ASK_COMMITMENT_AT = 7;
