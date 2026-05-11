const REQUIRED_BASE = ['id', 'chapterId', 'title', 'completion'];

export async function loadMission(missionId) {
  const url = `./data/missions/${missionId}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`미션 로드 실패 (${res.status}): ${url}`);
  const mission = await res.json();
  validate(mission, missionId);
  return mission;
}

export async function loadFixture(fixtureId) {
  if (!fixtureId) return null;
  const url = `./data/fs-fixtures/${fixtureId}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fs-fixture 로드 실패 (${res.status}): ${url}`);
  return res.json();
}

function validate(mission, missionId) {
  for (const key of REQUIRED_BASE) {
    if (!(key in mission)) throw new Error(`미션 JSON에 '${key}' 필드가 없습니다: ${missionId}`);
  }
  if (mission.id !== missionId) {
    console.warn(`[mission-loader] 파일명(${missionId})과 id(${mission.id})가 다릅니다.`);
  }
  if (mission.special) {
    if (!mission.special.kind) throw new Error(`미션 '${missionId}'에 special.kind 가 없습니다.`);
  } else {
    if (!Array.isArray(mission.steps) || mission.steps.length === 0) {
      throw new Error(`미션 '${missionId}'에 steps가 비어 있습니다.`);
    }
  }
}
