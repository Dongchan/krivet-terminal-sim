import { matchCommand } from '../terminal/command-matcher.js';

export function evaluateStep(step, input) {
  if (step.expected?.type === 'command') {
    return matchCommand(input, step.expected);
  }
  return { ok: false };
}
