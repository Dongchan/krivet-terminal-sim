import { $, clear, el } from './utils/dom.js';
import { getState } from './state.js';
import { on } from './utils/events.js';

let chaptersRef = null;
let currentCtx = null;

export function initPanel(chapters) {
  chaptersRef = chapters;
  renderIdle();
  on('route:changed', () => { currentCtx = null; renderIdle(); });
  on('mission:start', ({ mission, stepIndex, special }) => {
    currentCtx = { mission, stepIndex, hint: null, failures: 0, special: !!special };
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
    panel.appendChild(el('div', { class: 'panel-actions' }, [
      el('button', { class: 'btn-primary btn-start', disabled: true, title: '준비 중인 미션입니다' }, ['미션 시작 (준비 중)']),
    ]));
    return;
  }

  panel.appendChild(el('div', { class: 'panel-step' }, [
    el('div', { class: 'panel-step-label' }, ['미션을 시작하면 단계가 안내됩니다']),
    el('div', { class: 'panel-step-text' }, ['우측 터미널에 따라 명령을 입력하며 진행해 보세요.']),
  ]));

  panel.appendChild(el('div', { class: 'panel-actions' }, [
    el('button', { class: 'btn-primary btn-start' }, ['미션 시작']),
    el('button', { class: 'btn-skip' }, ['건너뛰기']),
  ]));
}

function renderActive() {
  if (!currentCtx || !chaptersRef) return;
  const { mission, stepIndex, totalSteps, hint, failures, special } = currentCtx;
  const chapter = chaptersRef.find((c) => c.id === mission.chapterId) || chaptersRef[0];
  const step = mission.steps?.[stepIndex];

  const panel = $('.app-panel');
  clear(panel);

  panel.appendChild(el('span', { class: 'panel-tag' }, [`${chapter.shortLabel} · ${chapter.title}`]));
  panel.appendChild(el('h1', { class: 'panel-title' }, [mission.title]));
  panel.appendChild(el('p', { class: 'panel-body' }, [mission.intro?.bodyMarkdown?.split('\n\n')[0] || '']));

  if (special) {
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

  panel.appendChild(el('div', { class: 'panel-actions' }, [
    el('button', { class: 'btn-skip-mission' }, ['건너뛰기']),
  ]));
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
