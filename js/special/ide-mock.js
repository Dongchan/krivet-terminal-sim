import { Terminal } from '../terminal/terminal.js';
import { el, clear } from '../utils/dom.js';
import { emit } from '../utils/events.js';

const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const DOUBLE_CLICK_MS = 350;

export class IdeMockMission {
  constructor(rootEl, config) {
    this.root = rootEl;
    this.config = config || {};
    this.mission = null;

    this.desktopEl = null;
    this.ideTerminal = null;

    this.ideShellEl = null;
    this.tabBarEl = null;
    this.editorEl = null;
    this.fileTreeEl = null;
    this.toastEl = null;

    this.activeFile = null;
    this.stage = 'desktop'; // 'desktop' | 'transitioning' | 'ide' | 'complete'
    this.scenarioIndex = 0;
    this.completed = false;
    this.escHandler = null;

    this._iconClickCache = new Map();
  }

  setMission(mission) {
    this.mission = mission;
  }

  mount() {
    clear(this.root);
    this.mountDesktop();
  }

  // ── Desktop stage ───────────────────────────────────────────────

  mountDesktop() {
    const desktop = this.config.desktop || {};
    const wrapper = el('div', { class: 'ide-mock-desktop' });

    wrapper.appendChild(el('div', { class: 'ide-mock-desktop-watermark', 'aria-hidden': 'true' }, [
      desktop.watermark || '교육용 모형 (Educational Mockup)',
    ]));

    const grid = el('div', { class: 'ide-mock-desktop-grid' });
    (desktop.icons || []).forEach((icon) => grid.appendChild(this.buildDesktopIcon(icon)));
    wrapper.appendChild(grid);

    wrapper.appendChild(this.buildTaskbar(desktop.taskbar || {}));

    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper || e.target.classList?.contains('ide-mock-desktop-grid')) {
        this.clearDesktopSelection();
      }
    });

    this.desktopEl = wrapper;
    this.root.appendChild(wrapper);

    this.emitStage('desktop');
  }

  buildDesktopIcon(icon) {
    const item = el('button', {
      class: `ide-mock-desktop-icon kind-${icon.kind || 'folder'}`,
      type: 'button',
      'data-icon-id': icon.id,
      'aria-label': icon.label,
    });

    const tile = el('div', { class: 'ide-mock-desktop-icon-tile', 'aria-hidden': 'true' });
    tile.innerHTML = makeDesktopIconSvg(icon.kind);
    item.appendChild(tile);

    item.appendChild(el('div', { class: 'ide-mock-desktop-icon-label' }, [icon.label || icon.id]));
    if (icon.subLabel) {
      item.appendChild(el('div', { class: 'ide-mock-desktop-icon-sublabel' }, [icon.subLabel]));
    }

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleIconClick(icon, item);
    });
    item.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.handleIconDoubleClick(icon);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleIconDoubleClick(icon);
      }
    });

    return item;
  }

  handleIconClick(icon, itemEl) {
    this.clearDesktopSelection();
    itemEl.classList.add('is-selected');

    // 마지막 클릭 시각 기록 → dblclick 이벤트가 지원되지 않는 경우 백업
    const last = this._iconClickCache.get(icon.id) || 0;
    const now = performance.now();
    this._iconClickCache.set(icon.id, now);
    if (now - last < DOUBLE_CLICK_MS) {
      this.handleIconDoubleClick(icon);
    }
  }

  handleIconDoubleClick(icon) {
    if (this.stage !== 'desktop') return;
    if (icon.kind === 'app-ide') {
      this.transitionToIde();
      return;
    }
    // 폴더 또는 기타: 안내 토스트
    this.flashDesktopToast(icon.hint || `${icon.label} 는 IDE 모형 안에서 열어 보세요.`);
  }

  buildTaskbar(taskbar) {
    const bar = el('div', { class: 'ide-mock-taskbar', 'aria-label': '작업 표시줄' });

    bar.appendChild(el('button', {
      class: 'ide-mock-taskbar-start', type: 'button', 'aria-label': '시작',
      title: taskbar.lockedNote || '모형 — 동작하지 않아요',
    }, [el('span', { class: 'ide-mock-taskbar-start-glyph' }, ['⊞']), taskbar.start || '시작']));

    bar.appendChild(el('div', { class: 'ide-mock-taskbar-search' }, [
      el('span', { class: 'ide-mock-taskbar-search-icon' }, ['🔍']),
      el('span', { class: 'ide-mock-taskbar-search-text' }, [taskbar.search || '검색']),
    ]));

    bar.appendChild(el('div', { class: 'ide-mock-taskbar-spacer' }));

    bar.appendChild(el('div', { class: 'ide-mock-taskbar-tray' }, [
      el('span', { class: 'ide-mock-taskbar-locale' }, [taskbar.locale || '한국어']),
      el('span', { class: 'ide-mock-taskbar-clock' }, [taskbar.clock || '']),
    ]));

    bar.addEventListener('click', (e) => {
      if (e.target.closest('.ide-mock-taskbar-search-text')) return;
      this.flashDesktopToast(taskbar.lockedNote || '(모형이라 작업 표시줄은 동작하지 않아요)');
    });

    return bar;
  }

  clearDesktopSelection() {
    if (!this.desktopEl) return;
    this.desktopEl.querySelectorAll('.ide-mock-desktop-icon.is-selected').forEach((el) => {
      el.classList.remove('is-selected');
    });
  }

  flashDesktopToast(message) {
    if (!this.desktopEl) return;
    if (this.toastEl) {
      this.toastEl.remove();
      this.toastEl = null;
    }
    const toast = el('div', { class: 'ide-mock-desktop-toast', role: 'status' }, [message]);
    this.desktopEl.appendChild(toast);
    this.toastEl = toast;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        toast.remove();
        if (this.toastEl === toast) this.toastEl = null;
      }, 200);
    }, 1800);
  }

  // ── Desktop → IDE transition ─────────────────────────────────────

  async transitionToIde() {
    if (this.stage !== 'desktop') return;
    this.stage = 'transitioning';
    const duration = this.config.desktop?.transitionDurationMs ?? 700;
    const halfMs = Math.max(120, Math.min(400, Math.round(duration / 2)));

    if (!REDUCED_MOTION && this.desktopEl) {
      this.desktopEl.classList.add('ide-mock-fading-out');
      await wait(halfMs);
    }

    this.desktopEl = null;
    clear(this.root);

    this.buildIde();
    this.stage = 'ide';
    this.emitStage('ide');
    this.emitScenario();
    this.attachEscHandler();

    if (!REDUCED_MOTION && this.ideShellEl) {
      this.ideShellEl.classList.add('ide-mock-fading-in');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => this.ideShellEl?.classList.add('ide-mock-visible'))
      );
      setTimeout(() => {
        this.ideShellEl?.classList.remove('ide-mock-fading-in', 'ide-mock-visible');
      }, halfMs + 220);
    }
  }

  // ── IDE stage ────────────────────────────────────────────────────

  buildIde() {
    const ide = this.config.ide || {};
    const shell = el('div', { class: 'ide-mock-shell' });

    shell.appendChild(this.buildTitlebar(ide));

    const main = el('div', { class: 'ide-mock-main' });
    main.appendChild(this.buildActivityBar());
    main.appendChild(this.buildExplorer());

    const center = el('div', { class: 'ide-mock-center' });
    this.tabBarEl = el('div', { class: 'ide-mock-tabbar' });
    this.editorEl = el('div', { class: 'ide-mock-editor' });
    center.appendChild(this.tabBarEl);
    center.appendChild(this.editorEl);

    const termPane = el('div', { class: 'ide-mock-terminal-pane' });
    this.terminalHeaderEl = el('div', { class: 'ide-mock-terminal-header' }, [
      el('span', { class: 'ide-mock-terminal-tab' }, ['터미널']),
      this.terminalMetaEl = el('span', { class: 'ide-mock-terminal-meta' }, [
        `${shellLabel(ide.terminal?.kind)} · ${ide.workspaceRoot || ''}`,
      ]),
    ]);
    termPane.appendChild(this.terminalHeaderEl);
    const termRoot = el('div', { class: 'ide-mock-terminal-root' });
    termPane.appendChild(termRoot);
    center.appendChild(termPane);

    main.appendChild(center);
    shell.appendChild(main);

    shell.appendChild(el('div', { class: 'ide-mock-statusbar' }, [
      el('span', { class: 'ide-mock-statusbar-branch' }, ['⎇ main']),
      el('span', { class: 'ide-mock-statusbar-sync' }, ['● git']),
      el('span', { class: 'ide-mock-statusbar-spacer' }),
      el('span', { class: 'ide-mock-statusbar-path' }, [ide.workspaceRoot || '']),
      el('span', { class: 'ide-mock-statusbar-esc' }, ['ESC · 바탕화면으로']),
    ]));

    shell.appendChild(el('div', { class: 'ide-mock-watermark', 'aria-hidden': 'true' }, [
      ide.watermark || '교육용 모형 (Educational Mockup)',
    ]));

    this.ideShellEl = shell;
    this.root.appendChild(shell);

    this.renderEmptyEditor();

    this.ideTerminal = new Terminal(termRoot, {
      shell: ide.terminal || { kind: 'powershell', cwd: ide.workspaceRoot || 'C:\\KRIVET\\연구' },
      onSubmit: (value) => this.handleIdeTermInput(value),
    });
    this.ideTerminal.mount();

    if (ide.terminalGreeting?.length) {
      this.ideTerminal.printScript(ide.terminalGreeting);
    }
  }

  buildTitlebar(ide) {
    return el('div', { class: 'ide-mock-titlebar' }, [
      el('div', { class: 'ide-mock-titlebar-dots' }, [
        el('span', { class: 'ide-mock-dot ide-mock-dot-r' }),
        el('span', { class: 'ide-mock-dot ide-mock-dot-y' }),
        el('span', { class: 'ide-mock-dot ide-mock-dot-g' }),
      ]),
      el('div', { class: 'ide-mock-titlebar-text' }, [
        `${ide.workspaceName || 'workspace'} — ${ide.title || 'IDE'}`,
      ]),
      el('div', { class: 'ide-mock-titlebar-meta' }, [ide.workspaceRoot || '']),
    ]);
  }

  buildActivityBar() {
    const bar = el('div', { class: 'ide-mock-activity-bar', 'aria-label': '활동 표시줄' });
    const icons = [
      { id: 'files',      label: '탐색기', active: true },
      { id: 'search',     label: '검색' },
      { id: 'scm',        label: '소스 제어' },
      { id: 'extensions', label: '확장' },
      { id: 'account',    label: '계정' },
    ];
    icons.forEach((ic) => {
      const btn = el('button', {
        class: `ide-mock-activity-btn${ic.active ? ' is-active' : ''}`,
        type: 'button',
        'aria-label': ic.label,
        title: ic.label,
        'data-icon': ic.id,
      });
      btn.innerHTML = makeActivityIconSvg(ic.id);
      btn.addEventListener('click', () => {
        if (!ic.active) this.flashIdeToast(`${ic.label} — 이번 모형에서는 비활성화된 도구예요.`);
      });
      bar.appendChild(btn);
    });
    return bar;
  }

  buildExplorer() {
    const ide = this.config.ide || {};
    const explorer = el('div', { class: 'ide-mock-explorer' });
    explorer.appendChild(el('div', { class: 'ide-mock-explorer-header' }, ['탐색기']));
    explorer.appendChild(el('div', { class: 'ide-mock-explorer-workspace' }, [
      (ide.workspaceName || 'workspace').toUpperCase(),
    ]));

    this.fileTreeEl = el('ul', { class: 'ide-mock-filetree' });
    const tree = ide.fileTree || [];
    tree.forEach((entry) => {
      const classes = ['ide-mock-filetree-item'];
      classes.push(entry.type === 'folder' ? 'is-folder' : 'is-file');
      if (entry.modified) classes.push('is-modified');
      if (entry.locked) classes.push('is-locked');

      const item = el('li', {
        class: classes.join(' '),
        'data-name': entry.name,
        tabindex: '0',
      });

      const icon = el('span', { class: 'ide-mock-filetree-icon', 'aria-hidden': 'true' });
      icon.innerHTML = makeFileIconSvg(entry);
      item.appendChild(icon);
      item.appendChild(el('span', { class: 'ide-mock-filetree-name' }, [entry.name]));
      if (entry.modified) {
        item.appendChild(el('span', { class: 'ide-mock-filetree-badge', title: '변경됨' }, ['M']));
      }
      item.addEventListener('click', () => this.handleFileTreeClick(entry));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleFileTreeClick(entry);
        }
      });

      this.fileTreeEl.appendChild(item);
    });
    explorer.appendChild(this.fileTreeEl);
    return explorer;
  }

  handleFileTreeClick(entry) {
    if (entry.locked || entry.type === 'folder') {
      this.flashIdeToast(`${entry.name} — ${entry.hint || '이번 모형에서는 열 수 없는 항목이에요.'}`);
      return;
    }
    this.openFile(entry);
  }

  openFile(entry) {
    this.activeFile = entry;
    this.renderTabBar();
    this.renderEditor(entry);

    if (this.fileTreeEl) {
      this.fileTreeEl.querySelectorAll('.ide-mock-filetree-item').forEach((li) => {
        li.classList.toggle('is-active', li.dataset.name === entry.name);
      });
    }

    const step = this.currentScenarioStep();
    if (step?.kind === 'openFile' && step.file === entry.name) {
      this.advanceScenario();
    }
  }

  renderTabBar() {
    if (!this.tabBarEl) return;
    clear(this.tabBarEl);
    if (!this.activeFile) return;
    const tab = el('div', { class: 'ide-mock-tab is-active' }, [
      el('span', { class: 'ide-mock-tab-name' }, [this.activeFile.name]),
      el('span', { class: 'ide-mock-tab-close', 'aria-hidden': 'true' }, ['×']),
    ]);
    this.tabBarEl.appendChild(tab);
  }

  renderEmptyEditor() {
    if (!this.editorEl) return;
    clear(this.editorEl);
    this.editorEl.appendChild(el('div', { class: 'ide-mock-editor-empty' }, [
      el('div', { class: 'ide-mock-editor-empty-title' }, ['파일을 선택해 미리보기']),
      el('div', { class: 'ide-mock-editor-empty-body' }, [
        '좌측 탐색기에서 파일 이름을 한 번 누르면 여기에서 미리볼 수 있어요.',
      ]),
    ]));
  }

  renderEditor(entry) {
    if (!this.editorEl) return;
    clear(this.editorEl);

    const lines = (entry.content ?? '').split('\n');
    const doc = el('div', {
      class: 'ide-mock-editor-doc',
      'data-lang': entry.language || 'plaintext',
    });
    const gutter = el('div', { class: 'ide-mock-editor-gutter' });
    const content = el('div', { class: 'ide-mock-editor-content' });

    lines.forEach((line, idx) => {
      gutter.appendChild(el('div', { class: 'ide-mock-editor-line-num' }, [`${idx + 1}`]));
      content.appendChild(el('div', { class: 'ide-mock-editor-line' }, [
        line === '' ? ' ' : line,
      ]));
    });

    doc.appendChild(gutter);
    doc.appendChild(content);
    this.editorEl.appendChild(doc);
    this.editorEl.scrollTop = 0;
  }

  async handleIdeTermInput(value) {
    if (!value.trim()) return;
    const cmd = value.trim();
    const step = this.currentScenarioStep();

    if (step?.kind === 'terminalCommand' && this.matchesStepCommand(step, cmd)) {
      await this.ideTerminal.printScript(step.response || []);
      if (step.afterSwitchShell) {
        this.ideTerminal.setPrompt(step.afterSwitchShell);
        this.ideTerminal.refreshTitlebar();
        this.updateTerminalMeta();
      }
      this.advanceScenario();
      return;
    }

    if (step?.kind === 'terminalCommand' && step.fallbackResponse?.length) {
      await this.ideTerminal.printScript(step.fallbackResponse);
      return;
    }

    await this.ideTerminal.printScript([
      { type: 'dim', text: `  (시뮬레이션 모형 — '${cmd}' 응답은 준비되어 있지 않아요. 좌측 안내를 따라 입력해 보세요.)` },
      { type: 'blank' },
    ]);
  }

  matchesStepCommand(step, cmd) {
    if (!step?.command) return false;
    if (step.matchKind === 'prefix') {
      return cmd.startsWith(step.command);
    }
    return cmd === step.command;
  }

  updateTerminalMeta() {
    if (!this.terminalMetaEl || !this.ideTerminal) return;
    const cwd = this.ideTerminal.shell.cwd || '';
    this.terminalMetaEl.textContent = `${shellLabel(this.ideTerminal.shell.kind)} · ${cwd}`;
  }

  currentScenarioStep() {
    const steps = this.config.scenarioSteps || [];
    return steps[this.scenarioIndex];
  }

  advanceScenario() {
    this.scenarioIndex += 1;
    const steps = this.config.scenarioSteps || [];
    if (this.scenarioIndex >= steps.length) {
      this.completeMission();
      return;
    }
    this.emitScenario();
  }

  completeMission() {
    if (this.completed) return;
    this.completed = true;
    this.stage = 'complete';
    this.emitStage('complete');
    if (this.mission) emit('mission:completed', { mission: this.mission });
  }

  emitStage(stage) {
    emit('ide-mock:stage', { stage });
  }

  emitScenario() {
    const steps = this.config.scenarioSteps || [];
    const step = this.currentScenarioStep();
    emit('ide-mock:scenario', {
      index: this.scenarioIndex,
      total: steps.length,
      step: step ? {
        kind: step.kind,
        panelLabel: step.panelLabel,
        panelHint: step.panelHint,
        command: step.command,
        displayHint: step.displayHint,
        file: step.file,
      } : null,
    });
  }

  attachEscHandler() {
    if (this.escHandler) return;
    this.escHandler = (e) => {
      if (e.key !== 'Escape') return;
      if (this.stage !== 'ide' || this.completed) return;
      e.preventDefault();
      if (confirm('IDE 모형을 닫고 바탕화면으로 돌아갈까요? (시나리오 진행은 처음부터 다시 시작돼요)')) {
        this.returnToDesktop();
      }
    };
    document.addEventListener('keydown', this.escHandler);
  }

  detachEscHandler() {
    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler);
      this.escHandler = null;
    }
  }

  returnToDesktop() {
    this.detachEscHandler();
    this.stage = 'desktop';
    this.scenarioIndex = 0;
    this.activeFile = null;
    this.ideTerminal = null;
    this.ideShellEl = null;
    this.editorEl = null;
    this.tabBarEl = null;
    this.fileTreeEl = null;
    this.terminalHeaderEl = null;
    this.terminalMetaEl = null;
    clear(this.root);
    this.mountDesktop();
  }

  flashIdeToast(message) {
    if (!this.ideShellEl) return;
    if (this.toastEl) {
      this.toastEl.remove();
      this.toastEl = null;
    }
    const toast = el('div', { class: 'ide-mock-toast', role: 'status' }, [message]);
    this.ideShellEl.appendChild(toast);
    this.toastEl = toast;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        toast.remove();
        if (this.toastEl === toast) this.toastEl = null;
      }, 200);
    }, 1800);
  }

  destroy() {
    this.detachEscHandler();
    if (this.toastEl) {
      this.toastEl.remove();
      this.toastEl = null;
    }
    clear(this.root);
    this.desktopEl = null;
    this.ideTerminal = null;
    this.ideShellEl = null;
    this.editorEl = null;
    this.tabBarEl = null;
    this.fileTreeEl = null;
    this.terminalHeaderEl = null;
    this.terminalMetaEl = null;
    this.activeFile = null;
    this.stage = 'desktop';
    this.scenarioIndex = 0;
    this.completed = false;
    this.mission = null;
    this._iconClickCache.clear();
  }
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shellLabel(kind) {
  if (kind === 'bash') return 'bash';
  if (kind === 'claude') return 'Claude Code';
  return 'PowerShell';
}

function makeDesktopIconSvg(kind) {
  const common = 'width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  if (kind === 'folder') {
    return `<svg ${common}>
      <path d="M5 12h12l3 4h23v23H5z" fill="rgba(74,144,226,0.18)" />
      <path d="M5 12h12l3 4h23" />
    </svg>`;
  }
  if (kind === 'app-ide') {
    return `<svg ${common}>
      <rect x="5" y="8" width="38" height="32" rx="2" fill="rgba(74,144,226,0.18)" />
      <path d="M5 14h38" />
      <path d="M11 22l-4 4 4 4" />
      <path d="M21 22l-4 4 4 4" />
      <path d="M27 32l5-12" />
    </svg>`;
  }
  return `<svg ${common}><rect x="6" y="6" width="36" height="36" rx="2"/></svg>`;
}

function makeActivityIconSvg(id) {
  const common = 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  if (id === 'files') {
    return `<svg ${common}><path d="M3 5h6l2 2h10v12H3z"/></svg>`;
  }
  if (id === 'search') {
    return `<svg ${common}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.6-3.6"/></svg>`;
  }
  if (id === 'scm') {
    return `<svg ${common}><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="14" r="2.5"/><path d="M6 8.5v7"/><path d="M8.2 17.4 16 14.5"/></svg>`;
  }
  if (id === 'extensions') {
    return `<svg ${common}><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><path d="M17 13v3a2 2 0 0 0 2 2h3"/></svg>`;
  }
  if (id === 'account') {
    return `<svg ${common}><circle cx="12" cy="9" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>`;
  }
  return '';
}

function makeFileIconSvg(entry) {
  const common = 'width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  if (entry.type === 'folder') {
    return `<svg ${common}><path d="M3 6h6l2 2h10v10H3z"/></svg>`;
  }
  return `<svg ${common}><path d="M7 3h8l4 4v14H7z"/><path d="M14 3v4h4"/></svg>`;
}
