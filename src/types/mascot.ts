export type MascotState =
  | 'idle'
  | 'thinking'
  | 'excited'
  | 'celebrating'
  | 'surprised'
  | 'annoyed'
  | 'frustrated'
  | 'curious'
  | 'sleeping'
  | 'walking';

/**
 * A line and the body language that goes with it, kept together on purpose.
 *
 * Choosing the words and the pose independently is what made the companion look
 * dubbed — it could say "Again?!" while placidly bobbing. A reaction is one unit:
 * if you add a line here, you decide how it is delivered.
 */
export interface MascotReaction {
  text: string;
  state: MascotState;
  /** How long the line stays up, in ms. Angry lines land harder when they're short. */
  holdMs?: number;
}

/** A question the companion actually asks, with answers that do something. */
export interface MascotQuestion {
  id: string;
  text: string;
  options: MascotQuestionOption[];
}

export interface MascotQuestionOption {
  label: string;
  /** What the companion does about your answer — the point of asking. */
  action: 'redraw' | 'easier' | 'reconfigure' | 'giveUp';
  reply: MascotReaction;
}
