import { loadMission, loadFixture } from './mission-loader.js';
import { evaluateStep } from './validators.js';
import { pickHint } from './hint.js';
import { matchGlobal } from '../terminal/command-matcher.js';
import { emit } from '../utils/events.js';
import { getState, updateProgress } from '../state.js';

export class MissionEngine {
  constructor({ terminal }) {
    this.terminal = terminal;
    this.mission = null;
    this.fixture = null;
    this.stepIndex = 0;
    this.failures = 0;
  }

  async loadAndStart(missionId) {
    const mission = await loadMission(missionId);
    const fixture = mission.shell?.fsFixture
      ? await loadFixture(mission.shell.fsFixture).catch(() => null)
      : null;

    this.mission = mission;
    this.fixture = fixture;

    const prev = getState().progress[mission.id];
    this.stepIndex = prev?.currentStepIndex ?? 0;
    this.failures = prev?.failures ?? 0;

    if (this.stepIndex >= mission.steps.length) {
      this.stepIndex = 0;
      this.failures = 0;
    }

    if (this.terminal) {
      this.terminal.shell = {
        kind: mission.shell?.kind || 'powershell',
        cwd: mission.shell?.initialCwd || 'C:\\KRIVET\\연구',
      };
      this.terminal.mount();
    }

    updateProgress(mission.id, { status: 'in_progress', currentStepIndex: this.stepIndex, failures: this.failures });
    emit('mission:start', { mission, stepIndex: this.stepIndex });
    this.emitStep();
  }

  emitStep() {
    const step = this.currentStep();
    const hint = pickHint(step?.hints, this.failures);
    emit('mission:step-changed', {
      mission: this.mission,
      step,
      stepIndex: this.stepIndex,
      totalSteps: this.mission.steps.length,
      failures: this.failures,
      hint,
    });
  }

  currentStep() {
    return this.mission?.steps[this.stepIndex] ?? null;
  }

  async handleInput(value, terminal) {
    const global = matchGlobal(value);
    if (global) {
      if (global.kind === 'clear') terminal.clear();
      else if (global.kind === 'output') await terminal.printScript(global.output);
      return;
    }

    const step = this.currentStep();
    if (!step) return;

    const result = evaluateStep(step, value);
    if (result.ok) {
      await terminal.printScript(step.output || []);
      this.advance();
    } else {
      this.failures += 1;
      updateProgress(this.mission.id, { failures: this.failures });
      await terminal.printScript([
        { type: 'error', text: `'${value}'을(를) 인식하지 못했습니다. 좌측 패널의 힌트를 확인하세요.` },
      ]);
      this.emitStep();
      emit('mission:failed', { failures: this.failures, missionId: this.mission.id });
    }
  }

  advance() {
    this.stepIndex += 1;
    this.failures = 0;
    updateProgress(this.mission.id, { currentStepIndex: this.stepIndex, failures: 0 });
    emit('mission:step-passed', { missionId: this.mission.id, stepIndex: this.stepIndex });

    if (this.stepIndex >= this.mission.steps.length) {
      this.complete();
    } else {
      this.emitStep();
    }
  }

  complete() {
    updateProgress(this.mission.id, {
      status: 'completed',
      currentStepIndex: this.mission.steps.length,
      completedAt: new Date().toISOString(),
    });
    emit('mission:completed', { mission: this.mission });
  }
}
