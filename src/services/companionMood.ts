/**
 * The companion's patience, modelled the way a person's actually works.
 *
 * Three things make this read as human rather than as a counter:
 *
 * 1. **It is continuous, not stepped.** One shared meter rises from every kind of
 *    pestering — poking it, rejecting suggestion after suggestion — so it reacts to
 *    how you have been behaving overall, not to one action in isolation.
 * 2. **Rapid-fire costs more.** Five pokes in five seconds is a different act from
 *    five pokes over a minute, and people respond to the difference, so repeated
 *    disturbances inside a short window land harder.
 * 3. **It cools off.** Nobody stays annoyed forever. Leave it alone and the meter
 *    drains on its own, which means walking away really is how you fix it.
 */

export type MoodTier = 'patient' | 'terse' | 'irritated' | 'frustrated' | 'done';

export interface MoodState {
  annoyance: number;
  /** When the meter was last touched, for time-based decay. */
  at: number;
}

/** Seconds of being left alone to go from "done with you" back to fine. */
const COOL_DOWN_MS = 40_000;
/** Two disturbances closer together than this count as pestering. */
const RAPID_WINDOW_MS = 2_600;
const RAPID_MULTIPLIER = 1.7;

export const DISTURBANCE = {
  poke: 0.13,
  reroll: 0.12,
} as const;

/**
 * Once it has fully disengaged it stays that way until the meter has genuinely
 * fallen, not the instant it dips below the line. Without that gap it would snap
 * back the moment you stopped, which reads as a switch rather than a sulk.
 */
export const RECOVERY_THRESHOLD = 0.55;

export const INITIAL_MOOD: MoodState = { annoyance: 0, at: 0 };

/** The meter as it stands right now, after however long it has been left alone. */
export function currentAnnoyance(mood: MoodState, now: number = Date.now()): number {
  if (mood.annoyance <= 0) return 0;
  const elapsed = Math.max(0, now - mood.at);
  return Math.max(0, mood.annoyance - elapsed / COOL_DOWN_MS);
}

export function disturb(
  mood: MoodState,
  weight: number,
  now: number = Date.now(),
): MoodState {
  const settled = currentAnnoyance(mood, now);
  const rapid = mood.at > 0 && now - mood.at < RAPID_WINDOW_MS;
  const applied = rapid ? weight * RAPID_MULTIPLIER : weight;

  return { annoyance: Math.min(1, settled + applied), at: now };
}

export function tierFor(annoyance: number): MoodTier {
  if (annoyance < 0.28) return 'patient';
  if (annoyance < 0.52) return 'terse';
  if (annoyance < 0.72) return 'irritated';
  if (annoyance < 0.92) return 'frustrated';
  return 'done';
}

export function moodTier(mood: MoodState, now: number = Date.now()): MoodTier {
  return tierFor(currentAnnoyance(mood, now));
}
