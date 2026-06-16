import { resetAll, getState, updateProgress } from './state.js';
import { initRouter } from './router.js';
import { initProgress } from './progress.js';
import { initPanel } from './panel.js';
import { Terminal } from './terminal/terminal.js';
import { MissionEngine } from './mission/mission-engine.js';
import { loadMission } from './mission/mission-loader.js';
import { ParallelTerminals } from './special/parallel-terminals.js';
import { AutocompactMission } from './special/autocompact.js';
import { IdeMockMission } from './special/ide-mock.js';
import { OrchestrationMission } from './special/orchestration.js';
import { $, el, clear } from './utils/dom.js';
import { on, emit } from './utils/events.js';

let chaptersRef = null;
let terminal = null;
let engine = null;
let parallelTerminals = null;
let autocompactMission = null;
let ideMockMission = null;
let orchestrationMission = null;

async function boot() {
  chaptersRef = await loadChapters();

  initProgress(chaptersRef);
  initPanel(chaptersRef);
  initRouter(chaptersRef);

  terminal = new Terminal($('.app-terminal'), {
    onSubmit: (value, term) => engine?.handleInput(value, term),
  });
  terminal.mount();
  terminal.print({ type: 'system', text: '[시뮬레이터] 좌측 패널에서 "미션 시작" 버튼을 눌러 시작하세요.' });

  engine = new MissionEngine({ terminal });

  bindGlobalUI();
  bindMissionEvents();

  await maybeAutoStart();
  updateFooterHint(); // 부팅 시 첫 route:changed 는 리스너 부착 전이라 한 번 직접 갱신

  console.info('[KRIVET 터미널 시뮬레이터] Phase 1 부트 완료');
}

async function loadChapters() {
  try {
    const res = await fetch('./data/chapters.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.chapters;
  } catch (err) {
    console.error('[main] chapters.json 로드 실패. 로컬 서버로 열어야 합니다.', err);
    document.body.innerHTML = `
      <div style="padding: 32px; font-family: system-ui; color: #333; line-height: 1.6;">
        <h1 style="color: #003366;">데이터 로드 실패</h1>
        <p>이 페이지는 <code>file://</code> 로 직접 열 수 없습니다.</p>
        <p>PowerShell에서 다음을 실행한 뒤 <a href="http://localhost:5500">http://localhost:5500</a> 으로 접속하세요:</p>
        <pre style="background: #f5f5f5; padding: 12px;">python -m http.server 5500</pre>
      </div>
    `;
    return [];
  }
}

function bindGlobalUI() {
  $('.btn-reset')?.addEventListener('click', () => {
    if (confirm('진행 상태를 모두 초기화할까요?')) {
      resetAll();
      location.hash = '';
      location.reload();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-start')) startCurrentMission();
    if (e.target.closest('.btn-prev-mission')) goToPreviousMission();
    if (e.target.closest('.btn-restart-mission')) restartCurrentMission();
    if (e.target.closest('.btn-skip-mission')) skipMission();
    if (e.target.closest('.btn-next-mission')) goToNextMission();
    if (e.target.closest('.btn-close-overlay')) closeOverlay();
  });
}

function bindMissionEvents() {
  on('mission:completed', ({ mission }) => {
    showCompletionOverlay(mission);
  });
  on('route:changed', () => {
    updateFooterHint();
    // 이전 미션 출력 잔재 제거. 사용자가 미션을 시작하면 다시 mount하므로 안전.
    if (parallelTerminals) {
      parallelTerminals.destroy();
      parallelTerminals = null;
    }
    if (autocompactMission) {
      autocompactMission.destroy();
      autocompactMission = null;
    }
    if (ideMockMission) {
      ideMockMission.destroy();
      ideMockMission = null;
    }
    if (orchestrationMission) {
      orchestrationMission.destroy();
      orchestrationMission = null;
    }
    if (!terminal) return;
    if (engine?.mission && engine.mission.id !== getState().currentMissionId) {
      engine.mission = null;
    }
    terminal.mount();
    terminal.print({ type: 'system', text: '[시뮬레이터] 좌측 패널에서 "미션 시작" 버튼을 눌러 시작하세요.' });
  });
}

async function startCurrentMission() {
  const state = getState();
  const missionId = state.currentMissionId;
  if (!missionId || !engine) return;
  if (isPlaceholder(missionId)) {
    alert('이 미션은 아직 준비 중입니다. 곧 공개될 예정이에요.');
    return;
  }
  try {
    const mission = await loadMission(missionId);
    if (mission.special?.kind === 'parallel') {
      await startParallelMission(mission);
    } else if (mission.special?.kind === 'autocompact') {
      await startAutocompactMission(mission);
    } else if (mission.special?.kind === 'ide-mock') {
      await startIdeMockMission(mission);
    } else if (mission.special?.kind === 'orchestration') {
      await startOrchestrationMission(mission);
    } else {
      await engine.loadAndStart(missionId);
    }
  } catch (err) {
    console.error('[main] 미션 시작 실패', err);
    alert('미션을 불러오지 못했습니다: ' + err.message);
  }
}

async function startParallelMission(mission) {
  const rootEl = $('.app-terminal');
  if (parallelTerminals) parallelTerminals.destroy();
  parallelTerminals = new ParallelTerminals(rootEl, mission.special.config || {});
  parallelTerminals.setMission(mission);
  parallelTerminals.mount();

  updateProgress(mission.id, { status: 'in_progress' });
  emit('mission:start', { mission, stepIndex: 0, special: true });

  // 마운트 직후 startAll — 약간의 시각적 텀을 줘 사용자가 분할 레이아웃을 인식하게 함
  setTimeout(() => parallelTerminals?.startAll(), 400);
}

async function startAutocompactMission(mission) {
  const rootEl = $('.app-terminal');
  if (autocompactMission) autocompactMission.destroy();
  autocompactMission = new AutocompactMission(rootEl, mission.special.config || {});
  autocompactMission.setMission(mission);

  updateProgress(mission.id, { status: 'in_progress' });
  // panel.js가 currentCtx를 세팅한 뒤에 mount()의 emitTurnPanel이 들어와야 첫 예시 질문이 패널에 뜸
  emit('mission:start', { mission, stepIndex: 0, special: true, specialKind: 'autocompact' });

  autocompactMission.mount();
}

async function startIdeMockMission(mission) {
  const rootEl = $('.app-terminal');
  if (ideMockMission) ideMockMission.destroy();
  ideMockMission = new IdeMockMission(rootEl, mission.special.config || {});
  ideMockMission.setMission(mission);

  updateProgress(mission.id, { status: 'in_progress' });
  // panel.js가 currentCtx를 먼저 세팅하도록 mission:start 를 mount() 호출 이전에 보냄
  emit('mission:start', { mission, stepIndex: 0, special: true, specialKind: 'ide-mock' });

  ideMockMission.mount();
}

async function startOrchestrationMission(mission) {
  const rootEl = $('.app-terminal');
  if (orchestrationMission) orchestrationMission.destroy();
  orchestrationMission = new OrchestrationMission(rootEl, mission.special.config || {});
  orchestrationMission.setMission(mission);

  updateProgress(mission.id, { status: 'in_progress' });
  // panel.js 가 currentCtx 를 먼저 세팅하도록 mission:start 를 mount() 이전에 보냄
  emit('mission:start', { mission, stepIndex: 0, special: true, specialKind: 'orchestration' });

  orchestrationMission.mount();
}

function isPlaceholder(missionId) {
  for (const chapter of chaptersRef || []) {
    const meta = chapter.missionMeta?.[missionId];
    if (meta?.placeholder) return true;
  }
  return false;
}

function skipMission() {
  const state = getState();
  const missionId = state.currentMissionId;
  if (!missionId) return;
  if (!confirm('이 미션을 건너뛸까요?')) return;
  updateProgress(missionId, { status: 'skipped' });
  goToNextMission();
}

function restartCurrentMission() {
  const state = getState();
  const missionId = state.currentMissionId;
  if (!missionId) return;
  if (isPlaceholder(missionId)) {
    alert('이 미션은 아직 준비 중입니다.');
    return;
  }
  if (!confirm('이 미션을 처음부터 다시 시작할까요? 현재 진행도가 초기화됩니다.')) return;
  updateProgress(missionId, { status: 'pending', failures: 0 });
  if (engine) engine.mission = null;
  // route:changed 핸들러가 special 인스턴스 destroy + 글로벌 터미널 복원 + 패널 idle 처리
  emit('route:changed', { chapterId: state.currentChapterId, missionId });
  startCurrentMission();
}

function goToPreviousMission() {
  const state = getState();
  const chapter = chaptersRef.find((c) => c.id === state.currentChapterId) || chaptersRef[0];
  const idx = chapter.missions.indexOf(state.currentMissionId);
  closeOverlay();
  if (idx > 0) {
    location.hash = `${chapter.id}/${chapter.missions[idx - 1]}`;
    return;
  }
  const chapIdx = chaptersRef.indexOf(chapter);
  if (chapIdx > 0) {
    const prev = chaptersRef[chapIdx - 1];
    location.hash = `${prev.id}/${prev.missions[prev.missions.length - 1]}`;
    return;
  }
  // 가장 첫 미션 — 무동작 (패널 버튼이 disabled 로 그려짐)
}

function goToNextMission() {
  const state = getState();
  const chapter = chaptersRef.find((c) => c.id === state.currentChapterId) || chaptersRef[0];
  const idx = chapter.missions.indexOf(state.currentMissionId);

  closeOverlay();

  if (idx >= 0 && idx < chapter.missions.length - 1) {
    location.hash = `${chapter.id}/${chapter.missions[idx + 1]}`;
    return;
  }
  const chapIdx = chaptersRef.indexOf(chapter);
  if (chapIdx < chaptersRef.length - 1) {
    const next = chaptersRef[chapIdx + 1];
    location.hash = `${next.id}/${next.missions[0]}`;
    return;
  }
  alert('모든 미션을 완료했습니다! 🎉');
}

// 현재 미션의 "다음 미션"을 찾는다. goToNextMission 의 순회 규칙과 동일:
// 같은 챕터의 다음 → 없으면 다음 챕터의 첫 미션 → 그것도 없으면 null(마지막).
function findNextMission(chapterId, missionId) {
  const chapter = chaptersRef?.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const idx = chapter.missions.indexOf(missionId);

  if (idx >= 0 && idx < chapter.missions.length - 1) {
    return describeMission(chapter, chapter.missions[idx + 1]);
  }
  const chapIdx = chaptersRef.indexOf(chapter);
  if (chapIdx >= 0 && chapIdx < chaptersRef.length - 1) {
    const nextChapter = chaptersRef[chapIdx + 1];
    return describeMission(nextChapter, nextChapter.missions[0]);
  }
  return null; // 마지막 미션 — 다음 없음
}

// 챕터 + 미션 id 로 표시에 필요한 메타를 모은다.
function describeMission(chapter, missionId) {
  const meta = chapter.missionMeta?.[missionId] || {};
  return {
    chapterId: chapter.id,
    missionId,
    title: meta.title || missionId,        // 예: "미션 2 · 두 개의 터미널, 두 배의 속도"
    summary: meta.summary || '',            // 예: "탐색기에선 불가능했던 '동시에' 를 체험합니다."
    chapterTitle: chapter.title || '',
  };
}

// 현재 라우트 기준으로 푸터 한 줄을 다시 그린다.
function updateFooterHint() {
  const hintEl = $('.footer-hint');
  if (!hintEl) return;
  const state = getState();
  const next = findNextMission(state.currentChapterId, state.currentMissionId);
  hintEl.textContent = formatFooterHint(next);
}

/**
 * 푸터의 "다음 미션 예고" 한 줄 문구를 만든다. (← 콘텐츠 결정 지점)
 *
 * @param {object|null} next - 다음 미션 정보. 마지막 미션이면 null.
 *   next = { title, summary, chapterTitle, chapterId, missionId }
 * @returns {string} 푸터에 표시할 문구
 *
 * 결정 포인트:
 *  1) next 가 있을 때 — 무엇을 보여줄지:
 *     · next.title.split('·').pop().trim()  →  "두 개의 터미널, 두 배의 속도" (승인한 미리보기)
 *     · next.summary                        →  "탐색기에선 불가능했던 '동시에' 를 체험합니다."
 *  2) next 가 null(마지막)일 때 — 어떤 마무리 문구를 보여줄지.
 */
function formatFooterHint(next) {
  if (!next) {
    return '🎉 모든 미션을 마쳤어요!';
  }
  const label = next.title.split('·').pop().trim();
  return `💬 다음 미션 예고: ${label}`;
}

function showCompletionOverlay(mission) {
  const reflection = mission.completion?.reflection;
  if (!reflection) return goToNextMission();

  let overlay = $('.mission-overlay');
  if (!overlay) {
    overlay = el('div', { class: 'mission-overlay' });
    document.body.appendChild(overlay);
  }
  clear(overlay);

  overlay.appendChild(el('div', { class: 'mission-card' }, [
    el('span', { class: 'mission-card-tag' }, ['미션 완료']),
    el('h2', { class: 'mission-card-title' }, [reflection.headline]),
    el('ul', { class: 'mission-card-bullets' },
      (reflection.bullets || []).map((b) => el('li', {}, [b]))),
    reflection.nextHint ? el('div', { class: 'mission-card-next' }, ['다음 → ' + reflection.nextHint]) : null,
    el('div', { class: 'mission-card-actions' }, [
      el('button', { class: 'btn-close-overlay' }, ['닫기']),
      el('button', { class: 'btn-primary btn-next-mission' }, ['다음 미션으로']),
    ]),
  ]));

  requestAnimationFrame(() => overlay.classList.add('open'));
}

function closeOverlay() {
  const overlay = $('.mission-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 200);
}

async function maybeAutoStart() {
  const state = getState();
  const missionId = state.currentMissionId;
  if (!missionId) return;
  const progress = state.progress[missionId];
  if (progress && progress.status === 'in_progress') {
    // special 미션은 steps 가 없어 engine.loadAndStart 가 throw — 자동 재개 대신 idle 로 두고 사용자가 다시 "미션 시작" 누르게 함
    try {
      const mission = await loadMission(missionId);
      if (mission.special) return;
    } catch (_) { return; }
    await engine.loadAndStart(missionId);
  }
}

boot();
