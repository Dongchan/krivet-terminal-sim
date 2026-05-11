import { $, clear, el } from './utils/dom.js';
import { getState } from './state.js';
import { on } from './utils/events.js';

let chaptersRef = null;
let currentCtx = null;

export function initPanel(chapters) {
  chaptersRef = chapters;
  renderIdle();
  on('route:changed', () => { currentCtx = null; renderIdle(); });
  on('mission:start', ({ mission, stepIndex, special, specialKind }) => {
    currentCtx = { mission, stepIndex, hint: null, failures: 0, special: !!special, specialKind: specialKind || null };
    renderActive();
  });
  on('mission:step-changed', (payload) => {
    currentCtx = {
      mission: payload.mission,
      stepIndex: payload.stepIndex,
      totalSteps: payload.totalSteps,
      hint: payload.hint,
      failures: payload.failures,
    };
    renderActive();
  });
  on('autocompact:turn', (payload) => {
    if (!currentCtx) return;
    currentCtx.autocompact = { phase: 'turn', ...payload };
    renderActive();
  });
  on('autocompact:compacting', (payload) => {
    if (!currentCtx) return;
    currentCtx.autocompact = { phase: 'compacting', ...payload };
    renderActive();
  });
  on('ide-mock:stage', (payload) => {
    if (!currentCtx) return;
    currentCtx.ideMock = { ...(currentCtx.ideMock || {}), stage: payload.stage };
    renderActive();
  });
  on('ide-mock:scenario', (payload) => {
    if (!currentCtx) return;
    currentCtx.ideMock = { ...(currentCtx.ideMock || {}), scenario: payload };
    renderActive();
  });
}

function renderIdle() {
  if (!chaptersRef) return;
  const state = getState();
  const chapter = chaptersRef.find((c) => c.id === state.currentChapterId) || chaptersRef[0];
  const missionId = state.currentMissionId || chapter.missions[0];
  const meta = chapter.missionMeta?.[missionId] || { title: missionId, summary: '' };

  const panel = $('.app-panel');
  clear(panel);

  panel.appendChild(el('span', { class: 'panel-tag' }, [`${chapter.shortLabel} · ${chapter.title}`]));
  panel.appendChild(el('h1', { class: 'panel-title' }, [meta.title]));
  panel.appendChild(el('p', { class: 'panel-body' }, [meta.summary]));

  if (meta.placeholder) {
    panel.appendChild(el('div', { class: 'panel-placeholder' }, [
      el('div', { class: 'panel-placeholder-label' }, ['🚧 곧 공개 예정']),
      el('div', {}, ['이 미션은 아직 준비 중입니다. 다음 업데이트에서 만나요. 그동안 상단의 다른 미션으로 이동하거나, "처음부터" 로 미션 1을 다시 체험해 보세요.']),
    ]));
    appendNavActions(panel, { mode: 'idle', missionId, isPlaceholder: true });
    return;
  }

  panel.appendChild(el('div', { class: 'panel-step' }, [
    el('div', { class: 'panel-step-label' }, ['미션을 시작하면 단계가 안내됩니다']),
    el('div', { class: 'panel-step-text' }, ['우측 터미널에 따라 명령을 입력하며 진행해 보세요.']),
  ]));

  appendNavActions(panel, { mode: 'idle', missionId });
}

function renderActive() {
  if (!currentCtx || !chaptersRef) return;
  const { mission, stepIndex, totalSteps, hint, failures, special, specialKind, autocompact, ideMock } = currentCtx;
  const chapter = chaptersRef.find((c) => c.id === mission.chapterId) || chaptersRef[0];
  const step = mission.steps?.[stepIndex];

  const panel = $('.app-panel');
  clear(panel);

  panel.appendChild(el('span', { class: 'panel-tag' }, [`${chapter.shortLabel} · ${chapter.title}`]));
  panel.appendChild(el('h1', { class: 'panel-title' }, [mission.title]));
  panel.appendChild(el('p', { class: 'panel-body' }, [mission.intro?.bodyMarkdown?.split('\n\n')[0] || '']));

  if (special && specialKind === 'autocompact') {
    renderAutocompactPanel(panel, autocompact);
  } else if (special && specialKind === 'ide-mock') {
    renderIdeMockPanel(panel, ideMock);
  } else if (special) {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, ['🚀 자동 진행 중']),
      el('div', { class: 'panel-step-text' }, ['좌/우 두 터미널이 같은 시간에 다른 작업을 처리합니다. 두 작업이 끝나면 회고 카드가 떠요.']),
    ]));
  } else if (step) {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, [`현재 단계 (${stepIndex + 1}/${totalSteps ?? mission.steps.length})`]),
      makeInstruction(step.instruction),
    ]));

    if (step.tip) {
      panel.appendChild(el('div', { class: 'panel-tip' }, [
        el('div', { class: 'panel-tip-label' }, [step.tip.label]),
        makeInstruction(step.tip.text),
      ]));
    }
  }

  if (hint) {
    panel.appendChild(el('div', { class: 'panel-hint' }, [
      el('div', { class: 'panel-hint-title' }, [`💡 힌트 (오답 ${failures}회)`]),
      el('div', {}, [hint.text]),
    ]));
  }

  appendNavActions(panel, { mode: 'active', missionId: mission.id });
}

function appendNavActions(panel, { mode, missionId, isPlaceholder = false }) {
  const firstMissionId = chaptersRef[0]?.missions?.[0];
  const isFirst = missionId === firstMissionId;

  const actions = el('div', { class: 'panel-actions' });

  const navGroup = el('div', { class: 'panel-actions-nav' });

  const prevAttrs = {
    class: 'btn-secondary btn-prev-mission',
    type: 'button',
    title: '이전 미션으로',
  };
  if (isFirst) {
    prevAttrs.disabled = true;
    prevAttrs.title = '첫 미션입니다';
  }
  navGroup.appendChild(el('button', prevAttrs, ['← 이전']));

  if (!isPlaceholder) {
    navGroup.appendChild(el('button', {
      class: 'btn-secondary btn-restart-mission',
      type: 'button',
      title: '이 미션을 처음부터 다시',
    }, ['↻ 새로 시작']));
  }

  navGroup.appendChild(el('button', {
    class: 'btn-ghost btn-skip-mission',
    type: 'button',
    title: '이 미션을 건너뛰고 다음으로',
  }, ['건너뛰기 →']));

  actions.appendChild(navGroup);

  if (mode === 'idle') {
    const startAttrs = {
      class: 'btn-primary btn-start',
      type: 'button',
    };
    if (isPlaceholder) {
      startAttrs.disabled = true;
      startAttrs.title = '준비 중인 미션입니다';
    }
    actions.appendChild(el('button', startAttrs, [isPlaceholder ? '미션 시작 (준비 중)' : '미션 시작']));
  }

  panel.appendChild(actions);
}

function makeInstruction(text) {
  const node = el('div', { class: 'panel-step-text' });
  const parts = text.split(/`([^`]+)`/);
  parts.forEach((part, idx) => {
    if (idx % 2 === 1) node.appendChild(el('code', {}, [part]));
    else node.appendChild(document.createTextNode(part));
  });
  return node;
}

function renderAutocompactPanel(panel, autocompact) {
  if (autocompact?.phase === 'compacting') {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, ['⚠ 임계치 도달 — 자동 압축 중']),
      el('div', { class: 'panel-step-text' }, ['컨텍스트가 85%를 넘어 Claude Code 가 이전 대화를 요약으로 압축하고 있어요. 게이지가 어떻게 떨어지는지 보세요.']),
    ]));
    return;
  }

  const phase = autocompact?.phase;
  const turn = autocompact?.turnIndex ?? 0;
  const total = autocompact?.totalTurns ?? 5;
  const nextHint = autocompact?.nextPromptHint;

  panel.appendChild(el('div', { class: 'panel-step' }, [
    el('div', { class: 'panel-step-label' }, [phase ? `대화 진행 (${turn}/${total} 턴)` : '💬 자유롭게 대화해 보세요']),
    el('div', { class: 'panel-step-text' }, [
      '우측 터미널의 `> ` 프롬프트에 질문을 입력하면 Claude Code 가 응답하고, 상단 게이지가 그만큼 차오릅니다. 게이지가 85% 에 닿으면 자동 압축이 발동돼요.',
    ]),
  ]));

  if (nextHint) {
    panel.appendChild(el('div', { class: 'panel-tip' }, [
      el('div', { class: 'panel-tip-label' }, ['예시 질문 (그대로 또는 자유롭게)']),
      makeInstruction('`' + nextHint + '`'),
    ]));
  }
}

function renderIdeMockPanel(panel, ideMock) {
  const stage = ideMock?.stage || 'desktop';

  if (stage === 'desktop') {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, ['🖥 바탕화면 — IDE 모형을 띄울 차례']),
      el('div', { class: 'panel-step-text' }, [
        '우측 바탕화면에 폴더와 IDE 모형 아이콘이 보여요. IDE 는 그저 도구 — 시작 아이콘을 더블클릭해서 같은 폴더를 한 창에 펼쳐 봅니다.',
      ]),
    ]));
    panel.appendChild(el('div', { class: 'panel-tip' }, [
      el('div', { class: 'panel-tip-label' }, ['이번 단계의 행동']),
      makeInstruction('우측 바탕화면의 `IDE 모형` 아이콘을 **더블클릭** 하세요. 더블클릭이 어렵다면 한 번 클릭 후 Enter 키도 같은 동작이에요.'),
    ]));
    return;
  }

  if (stage === 'complete') {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, ['✨ 시나리오 완료']),
      el('div', { class: 'panel-step-text' }, [
        '같은 폴더, 같은 셸, 같은 파일을 두 가지 시각으로 다뤘어요 — 회고 카드를 확인해 주세요.',
      ]),
    ]));
    return;
  }

  // stage === 'ide' (or 'transitioning' which is briefly visible)
  const scenario = ideMock?.scenario;
  const step = scenario?.step;
  const indexLabel = scenario ? `(${(scenario.index ?? 0) + 1}/${scenario.total || 0})` : '';

  if (step?.kind === 'openFile') {
    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, [`${step.panelLabel || '1단계'} ${indexLabel}`]),
      makeInstruction(step.panelHint || `좌측 탐색기에서 \`${step.file}\` 를 한 번 클릭하세요.`),
    ]));
    panel.appendChild(el('div', { class: 'panel-tip' }, [
      el('div', { class: 'panel-tip-label' }, ['관찰 포인트']),
      el('div', { class: 'panel-step-text' }, [
        '터미널에서 `cat` 으로 보던 같은 파일을, IDE 안에서는 클릭 한 번으로 큰 미리보기 영역에 펼칠 수 있어요. 폴더가 바뀐 게 아니라 시선 이동이 줄어든 거예요.',
      ]),
    ]));
    return;
  }

  if (step?.kind === 'terminalCommand') {
    const isClaudeBoot = step.command === 'claude';
    const tipLabel = isClaudeBoot ? '관찰 포인트' : '관찰 포인트';
    const tipBody = isClaudeBoot
      ? 'IDE 안 통합 터미널은 처음엔 평범한 PowerShell 입니다. `claude` 한 줄을 입력하면 미션 3·4 에서 익힌 그 Claude Code 가 같은 셸 위에서 부팅돼요 — 새로운 환경이 아니라, 같은 폴더에 같은 CLI 를 띄우는 것뿐이에요.'
      : '좌측 트리로 한 번 연 같은 파일을, 하단 터미널에서는 `@` 멘션으로 다시 가리킬 수 있어요. 한 파일을 두 가지 시각으로 다뤄 보는 단계예요.';

    panel.appendChild(el('div', { class: 'panel-step' }, [
      el('div', { class: 'panel-step-label' }, [`${step.panelLabel || '다음 단계'} ${indexLabel}`]),
      makeInstruction(step.panelHint || `하단 통합 터미널에 \`${step.command}\` 를 입력하세요.`),
    ]));

    if (step.displayHint) {
      panel.appendChild(el('div', { class: 'panel-tip' }, [
        el('div', { class: 'panel-tip-label' }, ['입력할 명령']),
        makeInstruction('`' + step.displayHint + '`'),
      ]));
    }

    panel.appendChild(el('div', { class: 'panel-tip' }, [
      el('div', { class: 'panel-tip-label' }, [tipLabel]),
      el('div', { class: 'panel-step-text' }, [tipBody]),
    ]));
    return;
  }

  // fallback (no scenario step)
  panel.appendChild(el('div', { class: 'panel-step' }, [
    el('div', { class: 'panel-step-label' }, ['🧰 IDE 모형 — 한 창에 모인 도구']),
    el('div', { class: 'panel-step-text' }, [
      '좌측 탐색기에서 파일을 클릭하거나 하단 터미널을 사용해 보세요. ESC 를 누르면 바탕화면으로 되돌아갑니다.',
    ]),
  ]));
}
