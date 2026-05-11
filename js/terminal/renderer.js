import { el } from '../utils/dom.js';

const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function appendLine(outputEl, line) {
  const span = el('span', { class: `term-line ${classFor(line.type)}` }, [line.text ?? '']);
  outputEl.appendChild(span);
  scrollToEnd(outputEl);
  return span;
}

function classFor(type) {
  switch (type) {
    case 'error':  return 'error';
    case 'system': return 'system';
    case 'dim':    return 'dim';
    default:       return '';
  }
}

function scrollToEnd(outputEl) {
  const scroller = outputEl.closest('.app-terminal') || outputEl;
  scroller.scrollTop = scroller.scrollHeight;
}

export async function runOutputScript(outputEl, lines, { signal } = {}) {
  for (const line of lines) {
    if (signal?.aborted) return;

    if (line.type === 'blank') {
      appendLine(outputEl, { type: 'line', text: '' });
      continue;
    }
    if (line.type === 'typing') {
      await typeLine(outputEl, line, signal);
      continue;
    }
    appendLine(outputEl, line);
  }
}

async function typeLine(outputEl, line, signal) {
  const span = el('span', { class: 'term-line' }, ['']);
  outputEl.appendChild(span);

  if (REDUCED_MOTION) {
    span.textContent = line.text;
    scrollToEnd(outputEl);
    return;
  }

  const cps = line.cps || 50;
  const delay = 1000 / cps;
  const chars = [...line.text];

  for (let i = 0; i < chars.length; i++) {
    if (signal?.aborted) {
      span.textContent = line.text;
      break;
    }
    span.textContent += chars[i];
    if (i % 4 === 0) scrollToEnd(outputEl);
    await sleep(delay);
  }
  scrollToEnd(outputEl);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
