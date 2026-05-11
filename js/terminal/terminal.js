import { $, clear, el } from '../utils/dom.js';
import { appendLine, runOutputScript } from './renderer.js';
import { attachKeyHandlers } from './input.js';
import { formatPrompt } from './shell-prompt.js';

export class Terminal {
  constructor(rootEl, { shell, onSubmit } = {}) {
    this.root = rootEl;
    this.shell = shell || { kind: 'powershell', cwd: 'C:\\KRIVET\\연구' };
    this.onSubmit = onSubmit;
    this.history = [];
    this.outputEl = null;
    this.promptLineEl = null;
    this.inputEl = null;
    this.promptText = '';
    this.runAbort = null;
    this.busy = false;
  }

  mount() {
    this.promptText = formatPrompt({ kind: this.shell.kind, cwd: this.shell.cwd });
    this.render();
    this.focus();
  }

  render() {
    clear(this.root);

    const window = el('div', { class: 'term-window' });

    const titlebar = el('div', { class: 'term-titlebar' }, [
      el('div', { class: 'term-dots' }, [
        el('span', { class: 'term-dot' }),
        el('span', { class: 'term-dot' }),
        el('span', { class: 'term-dot' }),
      ]),
      el('span', {}, [`${labelForShell(this.shell.kind)} · ${this.shell.cwd.split('\\').slice(-2).join('\\')}`]),
    ]);
    window.appendChild(titlebar);

    this.outputEl = el('div', { class: 'term-output' });
    window.appendChild(this.outputEl);

    this.promptLineEl = this.makePromptLine();
    window.appendChild(this.promptLineEl);

    this.root.appendChild(window);

    appendLine(this.outputEl, { type: 'dim', text: 'Windows PowerShell' });
    appendLine(this.outputEl, { type: 'dim', text: 'Copyright (C) Microsoft Corporation. All rights reserved.' });
    appendLine(this.outputEl, { type: 'line', text: '' });
  }

  makePromptLine() {
    const promptLine = el('div', { class: 'term-prompt-line' });
    const promptSpan = el('span', { class: 'term-prompt' }, [this.promptText]);
    const inputEl = el('input', {
      class: 'term-input',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      'aria-label': '터미널 명령 입력',
    });
    promptLine.appendChild(promptSpan);
    promptLine.appendChild(inputEl);

    attachKeyHandlers(inputEl, {
      history: this.history,
      onSubmit: (value) => this.submit(value),
      onCtrlL: () => this.clear(),
      onCtrlC: () => this.abortRun(),
    });

    this.inputEl = inputEl;
    return promptLine;
  }

  async submit(value) {
    if (this.busy) return;

    this.commitInputEcho(value);
    if (!value.trim()) {
      this.attachPromptLine();
      return;
    }
    await this.onSubmit?.(value, this);
    this.attachPromptLine();
  }

  commitInputEcho(value) {
    if (this.promptLineEl) {
      const echoLine = el('span', { class: 'term-line' }, [
        el('span', { class: 'term-prompt' }, [this.promptText]),
        document.createTextNode(value),
      ]);
      this.outputEl.appendChild(echoLine);
      this.promptLineEl.remove();
      this.promptLineEl = null;
      this.inputEl = null;
    }
  }

  attachPromptLine() {
    if (this.promptLineEl) return;
    this.promptLineEl = this.makePromptLine();
    this.root.querySelector('.term-window').appendChild(this.promptLineEl);
    this.focus();
  }

  async print(line) {
    appendLine(this.outputEl, line);
  }

  async printScript(lines) {
    if (!lines?.length) return;
    this.busy = true;
    const ac = new AbortController();
    this.runAbort = ac;
    try {
      await runOutputScript(this.outputEl, lines, { signal: ac.signal });
    } finally {
      this.runAbort = null;
      this.busy = false;
    }
  }

  abortRun() {
    this.runAbort?.abort();
  }

  clear() {
    if (this.outputEl) clear(this.outputEl);
  }

  setPrompt({ cwd }) {
    if (cwd) this.shell.cwd = cwd;
    this.promptText = formatPrompt({ kind: this.shell.kind, cwd: this.shell.cwd });
  }

  focus() {
    this.inputEl?.focus();
  }
}

function labelForShell(kind) {
  if (kind === 'powershell') return 'PowerShell';
  if (kind === 'bash')       return 'Bash';
  return 'Shell';
}
