import { setCurrent, getState } from './state.js';
import { emit } from './utils/events.js';

let chaptersRef = null;

export function initRouter(chapters) {
  chaptersRef = chapters;
  window.addEventListener('hashchange', applyHash);
  applyHash();
}

function applyHash() {
  const hash = location.hash.replace(/^#/, '');
  const [chapterId, missionId] = hash.split('/');
  const resolved = resolve(chapterId, missionId);
  setCurrent(resolved);
  emit('route:changed', resolved);
}

function resolve(chapterId, missionId) {
  if (!chaptersRef || chaptersRef.length === 0) return { chapterId: null, missionId: null };

  const state = getState();
  const fromState = state.currentChapterId && state.currentMissionId
    ? { chapterId: state.currentChapterId, missionId: state.currentMissionId }
    : null;

  const chapter = chaptersRef.find((c) => c.id === chapterId)
    || (fromState && chaptersRef.find((c) => c.id === fromState.chapterId))
    || chaptersRef[0];

  const mission = (missionId && chapter.missions.includes(missionId))
    ? missionId
    : (fromState && chapter.missions.includes(fromState.missionId) ? fromState.missionId : chapter.missions[0]);

  return { chapterId: chapter.id, missionId: mission };
}

export function goTo(chapterId, missionId) {
  location.hash = `${chapterId}/${missionId}`;
}
