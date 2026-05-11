import { resetAll, getState } from './state.js';
import { initRouter } from './router.js';
import { initProgress } from './progress.js';
import { initPanel } from './panel.js';
import { Terminal } from './terminal/terminal.js';
import { MissionEngine } from './mission/mission-engine.js';
import { $, el, clear } from './utils/dom.js';
import { on, emit } from './utils/events.js';

let chaptersRef = null;
let terminal = null;
let engine = null;

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
    if (e.target.closest('.btn-skip')) startCurrentMission();
    if (e.target.closest('.btn-skip-mission')) skipMission();
    if (e.target.closest('.btn-next-mission')) goToNextMission();
    if (e.target.closest('.btn-close-overlay')) closeOverlay();
  });
}

function bindMissionEvents() {
  on('mission:completed', ({ mission }) => {
    showCompletionOverlay(mission);
  });
}

async function startCurrentMission() {
  const state = getState();
  const missionId = state.currentMissionId;
  if (!missionId || !engine) return;
  try {
    await engine.loadAndStart(missionId);
  } catch (err) {
    console.error('[main] 미션 시작 실패', err);
    alert('미션을 불러오지 못했습니다: ' + err.message);
  }
}

function skipMission() {
  if (!engine?.mission) return;
  if (!confirm('이 미션을 건너뛸까요?')) return;
  const missionId = engine.mission.id;
  import('./state.js').then(({ updateProgress }) => {
    updateProgress(missionId, { status: 'skipped' });
    goToNextMission();
  });
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
    await engine.loadAndStart(missionId);
  }
}

boot();
