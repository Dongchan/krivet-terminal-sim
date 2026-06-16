import { Terminal } from '../terminal/terminal.js';
import { el, clear } from '../utils/dom.js';
import { emit } from '../utils/events.js';

const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 미션 6 · 에이전트 분업(오케스트레이션) 특수 미션.
 *
 * 2막 구조:
 *   Act 1 (naive)     — 단일 세션에 논문을 통째로 던져 컨텍스트가 포화(빨강)되는 모습.
 *   Act 2 (decompose) — 전문 에이전트들이 stage 순서대로 분업. 각자 컨텍스트가 가벼움(초록).
 *   Act 3 (synthesis) — 오케스트레이터가 결과를 종합.
 *
 * DAG 는 각 에이전트의 `stage` 번호로 인코딩: 같은 stage 는 동시에, 다음 stage 는 이전 stage 완료 후.
 */
export class OrchestrationMission {
  constructor(rootEl, config) {
    this.root = rootEl;
    this.config = config || {};
    this.mission = null;
    this.terminal = null;
    this.disclaimerEl = null;
    this.bannerEl = null;
    this.bannerLabelEl = null;
    this.nextBtnEl = null;
    this.nextResolve = null;
    this.bodyEl = null;
    this.orchLogEl = null;
    this.synthesisBox = null;
    this.alive = true;
    this.started = false;
    this.completed = false;
    this.agentEls = new Map();
  }

  setMission(mission) {
    this.mission = mission;
  }

  get tokenBudget() {
    return this.config.tokenBudget || 200_000;
  }

  mount() {
    clear(this.root);
    this.alive = true;

    const wrapper = el('div', { class: 'orch-wrapper' });
    this.bannerLabelEl = el('span', { class: 'orch-banner-label' }, ['에이전트 분업 시연 — 시작을 기다리는 중']);
    this.nextBtnEl = el('button', { class: 'orch-banner-next', type: 'button', hidden: 'hidden' }, ['다음 →']);
    this.nextBtnEl.addEventListener('click', () => {
      if (this.nextResolve) {
        const resolve = this.nextResolve;
        this.nextResolve = null;
        this.nextBtnEl.hidden = true;
        resolve();
      }
    });
    this.bannerEl = el('div', { class: 'orch-banner' }, [this.bannerLabelEl, this.nextBtnEl]);
    this.bodyEl = el('div', { class: 'orch-body' });
    wrapper.appendChild(this.bannerEl);
    wrapper.appendChild(this.bodyEl);
    this.root.appendChild(wrapper);

    this.showDisclaimer();
  }

  setBanner(text) {
    if (this.bannerLabelEl) this.bannerLabelEl.textContent = text;
  }

  /** 단계 사이에서 멈추고 사용자가 "다음 →" 을 누를 때까지 기다린다. */
  awaitNext(label = '다음 →') {
    if (!this.alive) return Promise.resolve();
    emit('orchestration:stage', { act: this.currentAct, paused: true });
    return new Promise((resolve) => {
      this.nextResolve = resolve;
      if (this.nextBtnEl) {
        this.nextBtnEl.textContent = label;
        this.nextBtnEl.hidden = false;
      }
    });
  }

  showDisclaimer() {
    if (this.config.disclaimer === false) {
      this.run();
      return;
    }

    const overlay = el('div', { class: 'disclaimer-overlay' });
    const card = el('div', { class: 'disclaimer-card' }, [
      el('span', { class: 'disclaimer-tag' }, ['ⓘ 안내']),
      el('h2', { class: 'disclaimer-title' }, ['단순화된 시뮬레이션']),
      el('p', { class: 'disclaimer-body' }, [
        '이 미션은 한 작업을 여러 전문 에이전트로 나눠 맡기는 패턴을, 효과가 한눈에 보이도록 단순화한 모형입니다.',
      ]),
      el('ul', { class: 'disclaimer-bullets' }, [
        el('li', {}, ['Claude Code 에는 실제로 Explore·Plan 같은 전문 서브에이전트와 작업 위임 기능이 있습니다. 화면의 게이지·진행 속도는 직관을 위해 단순화한 것이에요.']),
        el('li', {}, ['에이전트 출력과 토큰 수치는 사전 정의된 스크립트로, 실제 LLM 출력이 아닙니다.']),
        el('li', {}, ['핵심은 숫자가 아니라 대비입니다 — 한 세션에 다 담으면 포화(빨강), 나눠 맡기면 가볍게(초록).']),
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
    const overlay = this.disclaimerEl;
    this.disclaimerEl = null;
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 200);
    this.run();
  }

  async run() {
    if (this.started || !this.alive) return;
    this.started = true;

    await this.runNaiveAct();
    if (!this.alive) return;
    await this.awaitNext('다음 → 분업 방식 보기');
    if (!this.alive) return;

    await this.runDecomposeAct();
    if (!this.alive) return;
    await this.awaitNext('다음 → 종합 결과 보기');
    if (!this.alive) return;

    await this.runSynthesisAct();
    if (!this.alive) return;

    this.completed = true;
    emit('orchestration:stage', { act: 'done' });
    if (this.mission) emit('mission:completed', { mission: this.mission });
  }

  // ─────────────────────────────── Act 1 — 막무가내 단일 세션
  async runNaiveAct() {
    const naive = this.config.naive || {};
    this.currentAct = 'naive';
    emit('orchestration:stage', { act: 'naive' });
    this.setBanner('① 막무가내 — 한 세션에 논문을 통째로');

    clear(this.bodyEl);
    const view = el('div', { class: 'orch-naive' });

    const gauge = this.makeGauge('단일 세션 · Context use', `${this.config.model || 'claude-opus-4-8'} · ${this.tokenBudget.toLocaleString()} tok`);
    view.appendChild(gauge.wrapper);

    const termRoot = el('div', { class: 'orch-naive-term' });
    view.appendChild(termRoot);
    this.bodyEl.appendChild(view);

    this.terminal = new Terminal(termRoot, {
      shell: { kind: 'claude', cwd: this.config.cwd || 'C:\\KRIVET\\연구' },
      readOnly: true,
    });
    this.terminal.mount();

    // 게이지를 빨갛게 채우면서 동시에 로그를 흘린다.
    const peak = naive.peakRatio ?? 0.96;
    const fill = this.animateBar(gauge, 0, peak, naive.fillMs ?? 2600);
    const log = this.terminal.printScript(naive.script || []);
    await Promise.all([fill, log]);

    await sleep(REDUCED_MOTION ? 200 : 900);
  }

  // ─────────────────────────────── Act 2 — 전문 에이전트 분업
  async runDecomposeAct() {
    const orch = this.config.orchestrator || {};
    const agents = this.config.agents || [];
    this.currentAct = 'decompose';
    this.setBanner('② 동적 워크플로우 — 독립은 동시에, 의존은 순서대로');

    clear(this.bodyEl);
    this.agentEls.clear();

    const board = el('div', { class: 'orch-board' });
    this.orchLogEl = el('div', { class: 'orch-orchestrator' }, [
      el('div', {}, [orch.intro || '● 오케스트레이터: 독립 작업은 동시에, 의존 작업은 순서대로.']),
    ]);
    board.appendChild(this.orchLogEl);

    const grid = el('div', { class: 'orch-agents' });
    for (const agent of agents) {
      const card = this.makeAgentCard(agent);
      grid.appendChild(card.root);
      this.agentEls.set(agent.id, card);
    }
    board.appendChild(grid);

    this.synthesisBox = el('div', { class: 'orch-synthesis' });
    board.appendChild(this.synthesisBox);

    this.bodyEl.appendChild(board);

    // stage 번호 오름차순: 같은 stage 는 동시(병렬), 다음 stage 는 이전 완료 후(의존).
    const stages = [...new Set(agents.map((a) => a.stage || 1))].sort((x, y) => x - y);
    for (let i = 0; i < stages.length; i++) {
      if (!this.alive) return;
      const stage = stages[i];
      const inStage = agents.filter((a) => (a.stage || 1) === stage);

      // 오케스트레이터의 동적 판단을 한 줄 내레이션 (왜 동시 / 왜 대기).
      const note = orch.stageNotes?.[String(stage)];
      if (note) {
        this.orchLogEl.appendChild(el('div', { class: 'orch-orch-note' }, [note]));
        await sleep(REDUCED_MOTION ? 60 : 500);
        if (!this.alive) return;
      }

      emit('orchestration:stage', { act: 'decompose', stage, totalStages: stages.length, parallel: inStage.length > 1 });
      await Promise.all(inStage.map((a) => this.runAgent(a)));

      // 마지막 stage 가 아니면 멈추고 사용자가 확인 후 다음 단계로.
      if (i < stages.length - 1) {
        if (!this.alive) return;
        await this.awaitNext('다음 → 의존 단계 실행');
      }
    }
  }

  async runAgent(agent) {
    const card = this.agentEls.get(agent.id);
    if (!card || !this.alive) return;

    card.root.classList.remove('is-waiting');
    card.root.classList.add('is-running');
    card.status.textContent = '진행 중';

    await this.animateBar(card.gauge, 0, agent.peakRatio ?? 0.18, agent.runMs ?? 1800);
    if (!this.alive) return;

    card.root.classList.remove('is-running');
    card.root.classList.add('is-done');
    card.status.textContent = '완료 ✓';

    for (const line of agent.result || []) {
      card.results.appendChild(el('li', {}, [line]));
    }
  }

  // ─────────────────────────────── Act 3 — 종합
  async runSynthesisAct() {
    const orch = this.config.orchestrator || {};
    this.currentAct = 'synthesis';
    emit('orchestration:stage', { act: 'synthesis' });
    this.setBanner('③ 종합 — 네 결과를 하나로');

    const lines = orch.synthesis || [
      '● 종합: 네 에이전트의 결과를 합쳐 분석 메모를 작성합니다.',
      '✓ 분석_메모.md 저장.',
    ];
    for (const text of lines) {
      if (!this.alive) return;
      const cls = text.startsWith('✓') ? 'orch-synthesis-ok' : (text.startsWith('●') ? 'orch-synthesis-run' : 'orch-synthesis-dim');
      this.synthesisBox?.appendChild(el('div', { class: cls }, [text]));
      await sleep(REDUCED_MOTION ? 80 : 500);
    }
  }

  // ─────────────────────────────── DOM helpers
  makeGauge(label, meta) {
    const wrapper = el('div', { class: 'autocompact-gauge orch-gauge' });
    wrapper.appendChild(el('div', { class: 'autocompact-gauge-header' }, [
      el('span', { class: 'autocompact-gauge-label' }, [label]),
      el('span', { class: 'autocompact-gauge-meta' }, [meta]),
    ]));
    const track = el('div', { class: 'autocompact-gauge-track' });
    const bar = el('div', { class: 'autocompact-gauge-bar' });
    track.appendChild(bar);
    wrapper.appendChild(track);
    const numeric = el('div', { class: 'autocompact-gauge-numeric' }, [
      el('span', { class: 'autocompact-gauge-percent' }, ['0%']),
      el('span', { class: 'autocompact-gauge-tokens' }, [`0 / ${this.tokenBudget.toLocaleString()} tok`]),
    ]);
    wrapper.appendChild(numeric);
    return {
      wrapper,
      bar,
      percentEl: numeric.querySelector('.autocompact-gauge-percent'),
      tokensEl: numeric.querySelector('.autocompact-gauge-tokens'),
    };
  }

  makeAgentCard(agent) {
    const status = el('span', { class: 'orch-agent-status' }, ['대기']);
    const results = el('ul', { class: 'orch-agent-results' });
    const gaugeBar = el('div', { class: 'orch-mini-bar' });
    const gaugeTrack = el('div', { class: 'orch-mini-track' }, [gaugeBar]);
    const pct = el('span', { class: 'orch-mini-pct' }, ['0%']);

    const root = el('div', { class: 'orch-agent is-waiting' }, [
      el('div', { class: 'orch-agent-head' }, [
        el('span', { class: 'orch-agent-stage' }, [`${agent.stage || 1}단계`]),
        status,
      ]),
      el('div', { class: 'orch-agent-title' }, [agent.title || agent.id]),
      el('div', { class: 'orch-agent-role' }, [agent.role || '']),
      el('div', { class: 'orch-mini-gauge' }, [gaugeTrack, pct]),
      results,
    ]);

    return { root, status, results, gauge: { bar: gaugeBar, percentEl: pct, tokensEl: null } };
  }

  /** 게이지 바를 from→to 비율로 애니메이션. autocompact 의 tier 색 규칙을 재사용. */
  animateBar(gauge, from, to, durationMs) {
    const apply = (ratio) => {
      const pct = ratio * 100;
      gauge.bar.style.width = `${pct}%`;
      if (gauge.percentEl) gauge.percentEl.textContent = `${pct.toFixed(0)}%`;
      if (gauge.tokensEl) {
        gauge.tokensEl.textContent = `${Math.round(ratio * this.tokenBudget).toLocaleString()} / ${this.tokenBudget.toLocaleString()} tok`;
      }
      if (gauge.wrapper) {
        gauge.wrapper.classList.remove('tier-safe', 'tier-warn', 'tier-danger');
        gauge.wrapper.classList.add(ratio >= 0.85 ? 'tier-danger' : ratio >= 0.70 ? 'tier-warn' : 'tier-safe');
      }
    };

    if (REDUCED_MOTION || durationMs <= 0) {
      apply(to);
      return Promise.resolve();
    }

    const startedAt = performance.now();
    return new Promise((resolve) => {
      const tick = (now) => {
        if (!this.alive || !gauge.bar.isConnected) return resolve();
        const t = Math.min(1, (now - startedAt) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        apply(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  destroy() {
    this.alive = false;
    // 대기 중인 awaitNext 가 있으면 풀어줘 run() 루프가 alive=false 로 빠져나오게 함.
    if (this.nextResolve) {
      const resolve = this.nextResolve;
      this.nextResolve = null;
      resolve();
    }
    if (this.disclaimerEl) {
      this.disclaimerEl.remove();
      this.disclaimerEl = null;
    }
    clear(this.root);
    this.terminal = null;
    this.mission = null;
    this.orchLogEl = null;
    this.synthesisBox = null;
    this.bannerLabelEl = null;
    this.nextBtnEl = null;
    this.started = false;
    this.completed = false;
    this.agentEls.clear();
  }
}
