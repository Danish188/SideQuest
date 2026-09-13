/**
 * Picks from `items` using `weights`, so a strong candidate usually wins but does
 * not win every time. This is what stops "Give Me Another" from cycling through
 * the same ranked list in the same order.
 */
export function pickWeighted<T>(items: readonly T[], weights: readonly number[]): T | undefined {
  if (items.length === 0) return undefined;

  const safeWeights = weights.map((weight) => Math.max(weight, 0.0001));
  const total = safeWeights.reduce((sum, weight) => sum + weight, 0);

  let threshold = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    threshold -= safeWeights[i];
    if (threshold <= 0) return items[i];
  }

  return items[items.length - 1];
}
