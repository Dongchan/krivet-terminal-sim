export function pickHint(hints, failures) {
  if (!Array.isArray(hints) || hints.length === 0) return null;
  let best = null;
  for (const h of hints) {
    if (failures >= h.afterFailures) best = h;
  }
  return best;
}
