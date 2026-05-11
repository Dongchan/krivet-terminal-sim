import { emit } from './utils/events.js';

const STORAGE_KEY = 'krivet.terminalSim.v1';

const defaultState = () => ({
  currentChapterId: null,
  currentMissionId: null,
  progress: {},
  preferences: { reducedMotion: false, sound: false },
});

let state = load();
let saveTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (err) {
    console.warn('[state] load failed, resetting', err);
    return defaultState();
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[state] save failed', err);
    }
  }, 500);
}

export function getState() {
  return state;
}

export function setCurrent({ chapterId, missionId }) {
  state.currentChapterId = chapterId ?? state.currentChapterId;
  state.currentMissionId = missionId ?? state.currentMissionId;
  scheduleSave();
  emit('state:changed', state);
}

export function updateProgress(missionId, patch) {
  const prev = state.progress[missionId] || { status: 'pending', failures: 0 };
  state.progress[missionId] = { ...prev, ...patch };
  scheduleSave();
  emit('progress:updated', state);
}

export function resetAll() {
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  emit('state:changed', state);
  emit('progress:updated', state);
}
