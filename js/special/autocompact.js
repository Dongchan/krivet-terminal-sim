import { Terminal } from '../terminal/terminal.js';
import { el, clear } from '../utils/dom.js';
import { emit } from '../utils/events.js';

const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export class AutocompactMission {
  constructor(rootEl, config) {
    this.root = rootEl;
    this.config = config;
    this.mission = null;
    this.terminal = null;
    this.gaugeBarEl = null;
    this.gaugeNumericEl = null;
    this.gaugePercentEl = null;
    this.gaugeWrapperEl = null;
    this.disclaimerEl = null;
    this.turnIndex = 0;
    this.currentTokens = config.startTokens || 0;
    this.completed = false;
    this.compacting = false;
  }

  setMission(mission) {
    this.mission = mission;
  }

  get tokenBudget() {
    return this.config.tokenBudget || 1_000_000;
  }

  get thresholdTokens() {
    return this.tokenBudget * (this.config.compactionThreshold ?? 0.85);
  }

  mount() {
    clear(this.root);

    const wrapper = el('div', { class: 'autocompact-wrapper' });
    wrapper.appendChild(this.makeGauge());

    const termRoot = el('div', { class: 'autocompact-terminal' });
    wrapper.appendChild(termRoot);
    this.root.appendChild(wrapper);

    this.terminal = new Terminal(termRoot, {
      shell: this.config.shell || { kind: 'claude', cwd: 'C:\\KRIVET\\연구' },
      onSubmit: (value) => this.handleInput(value),
    });
    this.terminal.mount();

    this.printWelcome();
    this.renderGauge();
    this.emitTurnPanel();
    this.showDisclaimer();
  }

  makeGauge() {
    this.gaugeWrapperEl = el('div', { class: 'autocompact-gauge' });

    const header = el('div', { class: 'autocompact-gauge-header' }, [
      el('span', { class: 'autocompact-gauge-label' }, ['Context use']),
      el('span', { class: 'autocompact-gauge-meta' }, [
        `${this.config.model || 'claude-opus-4-7'} · ${this.tokenBudget.toLocaleString()} tok budget`,
      ]),
    ]);

    const track = el('div', { class: 'autocompact-gauge-track' });
    this.gaugeBarEl = el('div', { class: 'autocompact-gauge-bar' });
    track.appendChild(this.gaugeBarEl);

    const numeric = el('div', { class: 'autocompact-gauge-numeric' }, [
      (this.gaugePercentEl = el('span', { class: 'autocompact-gauge-percent' }, ['0%'])),
      (this.gaugeNumericEl = el('span', { class: 'autocompact-gauge-tokens' }, ['0 / 0 tok'])),
    ]);

    this.gaugeWrapperEl.appendChild(header);
    this.gaugeWrapperEl.appendChild(track);
    this.gaugeWrapperEl.appendChild(numeric);

    return this.gaugeWrapperEl;
  }

  renderGauge(overrideTokens) {
    const tokens = overrideTokens ?? this.currentTokens;
    const ratio = Math.min(1, Math.max(0, tokens / this.tokenBudget));
    const pct = (ratio * 100);
    const pctText = `${pct.toFixed(1)}%`;

    if (this.gaugeBarEl) this.gaugeBarEl.style.width = `${pct}%`;
    if (this.gaugePercentEl) this.gaugePercentEl.textContent = pctText;
    if (this.gaugeNumericEl) {
      this.gaugeNumericEl.textContent = `${Math.round(tokens).toLocaleString()} / ${this.tokenBudget.toLocaleString()} tok`;
    }

    // Tier-based color states (CSS handles colors)
    if (!this.gaugeWrapperEl) return;
    this.gaugeWrapperEl.classList.remove('tier-safe', 'tier-warn', 'tier-danger');
    if (ratio >= (this.config.compactionThreshold ?? 0.85)) {
      this.gaugeWrapperEl.classList.add('tier-danger');
    } else if (ratio >= 0.70) {
      this.gaugeWrapperEl.classList.add('tier-warn');
    } else {
      this.gaugeWrapperEl.classList.add('tier-safe');
    }
  }

  printWelcome() {
    const lines = this.config.welcomeScript || [
      { type: 'system', text: '● Anthropic · Claude Code  (educational mock)' },
      { type: 'line',   text: `  Model       : ${this.config.model || 'claude-opus-4-7'}` },
      { type: 'line',   text: `  Workspace   : ${this.config.shell?.cwd || 'C:\\KRIVET\\연구'}` },
      { type: 'blank' },
      { type: 'dim',    text: '  이전 미션의 세션을 이어받았습니다 (컨텍스트 사용량 ↑).' },
      { type: 'dim',    text: '  자유롭게 질문을 입력해 보세요. /context 게이지가 어떻게 차오르는지 위쪽을 보세요.' },
      { type: 'blank' },
    ];
    this.terminal.printScript(lines);
  }

  showDisclaimer() {
    if (this.config.disclaimer === false) return;

    const overlay = el('div', { class: 'disclaimer-overlay' });
    const card = el('div', { class: 'disclaimer-card' }, [
      el('span', { class: 'disclaimer-tag' }, ['ⓘ 안내']),
      el('h2', { class: 'disclaimer-title' }, ['단순화된 시뮬레이션']),
      el('p', { class: 'disclaimer-body' }, [
        '이 미션은 Claude Code 의 자동 컨텍스트 압축(auto-compact) 동작을 직관적으로 보여주기 위한 단순화된 모형입니다.',
      ]),
      el('ul', { class: 'disclaimer-bullets' }, [
        el('li', {}, ['실제 임계치·압축 비율·요약 알고리즘은 모델 버전마다 다르며, 사용자에게 보이는 게이지 형태와도 다를 수 있어요.']),
        el('li', {}, ['여기서는 임계치 85% 도달 시 누적 컨텍스트를 30% 수준으로 압축하는 모습을 시각화합니다.']),
        el('li', {}, ['터미널 응답은 사전 정의된 스크립트로, 실제 LLM 출력이 아닙니다.']),
      ]),
      el('div', { class: 'disclaimer-actions' }, [
        el('button', { class: 'btn-primary btn-disclaimer-dismiss' }, ['이해했어요 — 시작하기']),
      ]),
    ]);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    this.disclaimerEl = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target.closest('.btn-disclaimer-dismiss') || e.target === overlay) {
        this.dismissDisclaimer();
      }
    });

    requestAnimationFrame(() => overlay.classList.add('open'));
  }

  dismissDisclaimer() {
    if (!this.disclaimerEl) return;
    this.disclaimerEl.classList.remove('open');
    const overlay = this.disclaimerEl;
    this.disclaimerEl = null;
    setTimeout(() => overlay.remove(), 200);
    this.terminal?.focus();
  }

  async handleInput(value) {
    if (!value.trim()) return;
    if (this.compacting) return;
    if (this.completed) {
      await this.terminal.printScript([
        { type: 'dim', text: '  (시뮬레이션이 끝났어요. 좌측 회고 카드의 [다음 미션으로] 를 눌러 진행해 주세요.)' },
        { type: 'blank' },
      ]);
      return;
    }

    const turns = this.config.userPrompts || [];
    if (this.turnIndex >= turns.length) {
      await this.terminal.printScript([
        { type: 'dim', text: '  (이미 모든 시연 턴이 끝났어요. 회고 카드를 확인해 보세요.)' },
      ]);
      return;
    }

    const turn = turns[this.turnIndex];
    await this.terminal.printScript(turn.responseScript || []);

    const targetTokens = this.currentTokens + (turn.tokensAdded || 0);
    await this.animateGauge(this.currentTokens, targetTokens, turn.gaugeDurationMs ?? 600);
    this.currentTokens = targetTokens;
    this.renderGauge();

    this.turnIndex += 1;

    if (this.currentTokens >= this.thresholdTokens) {
      await this.runCompaction();
    } else {
      this.emitTurnPanel();
    }
  }

  async runCompaction() {
    this.compacting = true;
    this.emitCompactingPanel();

    const cfg = this.config.compaction || {};
    const beforeTokens = this.currentTokens;

    // Step 1: announcement + thinking
    await this.terminal.printScript(cfg.preScript || [
      { type: 'blank' },
      { type: 'system', text: '⚠ Context limit approaching · 85% threshold reached' },
      { type: 'dim',    text: '● Compacting conversation history ...' },
    ]);

    // Step 2: animated gauge drop
    const afterTokens = this.tokenBudget * (this.config.afterCompactionRatio ?? 0.30);
    await this.animateGauge(beforeTokens, afterTokens, cfg.compactDurationMs ?? 1800);
    this.currentTokens = afterTokens;
    this.renderGauge();

    // Step 3: post script (summary block + complete)
    await this.terminal.printScript(cfg.postScript || [
      { type: 'blank' },
      { type: 'system', text: '● Compaction complete' },
      { type: 'line',   text: `  Conversation summarized · ${Math.round(beforeTokens - afterTokens).toLocaleString()} tok freed.` },
      { type: 'blank' },
    ]);

    this.completed = true;
    if (this.mission) emit('mission:completed', { mission: this.mission });
  }

  async animateGauge(from, to, durationMs) {
    if (REDUCED_MOTION || durationMs <= 0) {
      this.renderGauge(to);
      return;
    }

    const startedAt = performance.now();
    return new Promise((resolve) => {
      const tick = (now) => {
        if (!this.gaugeBarEl) return resolve();
        const elapsed = now - startedAt;
        const t = Math.min(1, elapsed / durationMs);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = from + (to - from) * eased;
        this.renderGauge(cur);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  emitTurnPanel() {
    const turns = this.config.userPrompts || [];
    const next = turns[this.turnIndex];
    emit('autocompact:turn', {
      turnIndex: this.turnIndex,
      totalTurns: turns.length,
      tokens: this.currentTokens,
      ratio: this.currentTokens / this.tokenBudget,
      nextPromptHint: next?.label || null,
    });
  }

  emitCompactingPanel() {
    emit('autocompact:compacting', {
      tokens: this.currentTokens,
      threshold: this.thresholdTokens,
    });
  }

  destroy() {
    if (this.disclaimerEl) {
      this.disclaimerEl.remove();
      this.disclaimerEl = null;
    }
    clear(this.root);
    this.terminal = null;
    this.mission = null;
    this.completed = false;
    this.compacting = false;
    this.turnIndex = 0;
  }
}
