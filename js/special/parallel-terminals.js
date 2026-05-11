import { Terminal } from '../terminal/terminal.js';
import { el, clear } from '../utils/dom.js';
import { emit } from '../utils/events.js';

export class ParallelTerminals {
  constructor(rootEl, config) {
    this.root = rootEl;
    this.config = config;
    this.subs = [];
    this.mission = null;
    this.started = false;
  }

  setMission(mission) {
    this.mission = mission;
  }

  mount() {
    clear(this.root);
    const container = el('div', { class: 'parallel-terminals' });

    for (const t of this.config.terminals || []) {
      const subRoot = el('div', { class: 'parallel-sub' });
      const labelEl = el('div', { class: 'parallel-sub-label' }, [t.label || t.id || '터미널']);
      const termRoot = el('div', { class: 'parallel-sub-terminal' });
      subRoot.appendChild(labelEl);
      subRoot.appendChild(termRoot);
      container.appendChild(subRoot);

      const term = new Terminal(termRoot, {
        shell: t.shell || { kind: 'powershell', cwd: 'C:\\KRIVET\\연구' },
        readOnly: true,
      });
      term.mount();

      this.subs.push({ config: t, terminal: term });
    }

    this.root.appendChild(container);
  }

  async startAll() {
    if (this.started) return;
    this.started = true;

    const runs = this.subs.map(async ({ config, terminal }) => {
      const intro = config.introLine ? [{ type: 'dim', text: config.introLine }, { type: 'blank' }] : [];
      await terminal.printScript([...intro, ...(config.script || [])]);
    });

    await Promise.all(runs);
    if (this.mission) emit('mission:completed', { mission: this.mission });
  }

  destroy() {
    clear(this.root);
    this.subs = [];
    this.mission = null;
    this.started = false;
  }
}
