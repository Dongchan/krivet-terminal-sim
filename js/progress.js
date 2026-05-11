import { $, clear, el } from './utils/dom.js';
import { getState } from './state.js';
import { on } from './utils/events.js';

let chaptersRef = null;

export function initProgress(chapters) {
  chaptersRef = chapters;
  render();
  on('progress:updated', render);
  on('route:changed', render);
  on('state:changed', render);
}

function render() {
  if (!chaptersRef) return;
  const state = getState();

  const chapter = chaptersRef.find((c) => c.id === state.currentChapterId) || chaptersRef[0];

  $('.chapter-label').textContent = `${chapter.shortLabel} ${chapter.title}`;

  const dotsEl = $('.progress-dots');
  clear(dotsEl);

  const allMissions = chaptersRef.flatMap((c) => c.missions);
  const completedCount = allMissions.filter((m) => state.progress[m]?.status === 'completed').length;

  allMissions.forEach((mId, idx) => {
    const done = state.progress[mId]?.status === 'completed';
    const active = mId === state.currentMissionId;
    dotsEl.appendChild(el('span', {
      class: `progress-dot ${done ? 'done' : ''} ${active && !done ? 'active' : ''}`.trim(),
      title: mId,
    }));
    if (idx < allMissions.length - 1) {
      dotsEl.appendChild(el('span', { class: `progress-sep ${done ? 'done' : ''}` }));
    }
  });

  $('.progress-count').textContent = `[${completedCount}/${allMissions.length}]`;
}
