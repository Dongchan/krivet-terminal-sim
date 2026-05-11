# Working History — KRIVET 터미널 시뮬레이터

> 이 문서는 컨텍스트 컴팩트/클리어 이후에도 다음 세션이 작업 맥락을 즉시 복원하도록 모든 작업을 빠짐없이 역순(최신이 위)으로 기록한다.
> 매 entry의 timestamp는 작업 시점에 파이썬으로 호출해 부여한다: `python -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))"`
>
> **현재 단계**: **Phase 5 완료 (전체 미션 5종 라이브 deploy)** — 미션 1 / 미션 2 병렬 / 미션 3 (`@` 멘션) / 미션 4 오토컴팩트 / **미션 5 IDE 모형** + 전 미션 공통 패널 액션 바(이전·새로 시작·건너뛰기) 모두 라이브 동작 (commit `0f2f6dd`, Pages 빌드 28.9초). **다음 작업 후보: Phase 6 폴리시** (reduced-motion 점검, README 미션 추가 가이드, 사운드 토글 등) 또는 사용자가 직접 결정.
> **라이브 URL**: <https://dongchan.github.io/krivet-terminal-sim/>
> **GitHub 저장소**: <https://github.com/Dongchan/krivet-terminal-sim> (Public)
> **로컬 서버**: `python -m http.server 5500` 백그라운드 실행 중 (Bash ID: becnmuyej, http://localhost:5500/) — 새 세션에서는 만료되어 있을 수 있으므로 필요시 재실행.
> **계획 정본**: `./Plan_sim_v.1.0.md` (Claude Plan 모드 사본은 PC마다 `~/.claude/plans/` 아래에 위치)
> **경로 규칙**: 프로젝트 내부 파일은 항상 상대 경로(`./...`)로 참조 — 작업 PC에 따라 `D:\AI_Work\Claude\Terminal_Sim` 또는 `E:\AI_Work\krivet-terminal-sim` 등으로 절대 경로가 달라지므로 절대 경로 박지 말 것.
> **새 세션 시작 시**: 바로 아래 "다음 세션 진입 프롬프트" 섹션을 새 채팅창에 통째로 복사-붙여넣기 하세요.

---

## 🚀 다음 세션 진입 프롬프트 (복사-붙여넣기 전용 · 역순 entry 규칙 예외, 항상 헤더 직후 고정)

> 컨텍스트 컴팩트/클리어 이후 새 채팅창을 열어 다음 박스 안의 내용을 그대로 붙여넣으면 맥락이 즉시 복원된다. **이 박스 안의 글머리표 4개와 운영 규칙 3개는 임의로 줄이지 말고 그대로 사용한다** — 신규 세션 Claude가 길잡이로 삼는다.

```
krivet-terminal-sim 프로젝트(현재 작업 폴더의 루트, PC에 따라 `D:\AI_Work\Claude\Terminal_Sim` 또는 `E:\AI_Work\krivet-terminal-sim` 등)를 이어서 진행합니다. 응답은 한국어, learning/explanatory 톤을 유지하세요.

먼저 다음을 순서대로 수행하세요:

1. `./Working_history.md` 를 읽고 **상단 메타 박스 + 가장 위 entry** 를 확인하세요. 이 문서가 정본 인수인계 문서입니다. ("현재 단계" 라인 = 현재 상태의 진실값)
2. 필요하면 `Plan_sim_v.1.0.md` (계획 정본), `Requirement.md` (원본 요구사항), `README.md` (대외용 안내) 를 함께 참조하세요. Reference_Folder/References.txt 에 외부 디자인/레퍼런스 링크 있음.
3. 현재 어디까지 와있는지, 결정 대기 중인 다음 옵션이 무엇인지 1~2문장으로 한국어 요약해 보고하세요.
4. 사용자 다음 지시를 기다리세요. 임의로 다음 Phase 작업을 시작하지 마세요.

운영 규칙 (메모리에 자동 로드되지만 항상 확인):
- 모든 의미 있는 작업(파일 생성·수정·삭제, 검증, 의사결정, 버그 픽스 등)을 `Working_history.md` 맨 앞에 entry로 추가. 빠짐없이.
- 매 entry의 timestamp는 매번 Bash로 파이썬 호출해 획득: `python -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))"` (임의 시간 추정 금지)
- 로컬 서버는 이전 세션의 백그라운드 프로세스가 만료됐을 가능성 있음. 검증이 필요할 때 재실행: `python -m http.server 5500` (작업 폴더에서). 한 번 실행하면 http://localhost:5500/ 로 미션 확인 가능.

추가 컨텍스트:
- GitHub 저장소: https://github.com/Dongchan/krivet-terminal-sim (Public, main 브랜치 루트 서빙)
- 라이브 URL: https://dongchan.github.io/krivet-terminal-sim/
- 다음 push 시점은 사용자 확인을 받은 뒤 진행. 임의 push 금지. main 직접 푸시는 사용자가 매 사이클 명시 허락("푸시 진행", "메인 푸시" 등) 줄 때만.

다음 작업 후보 (사용자 확인 후 결정):
- **Phase 6 — 폴리시** (Plan_sim_v.1.0.md 305).
  - **README.md 정비** (Plan 288-293) — 라이브 데모 링크 / 한국어 한 문단 소개 / 로컬 실행법(`python -m http.server` / Live Server / `npx serve`) / 미션 추가 가이드 1쪽 (KRIVET 동료용, JSON 만 수정해 새 미션 추가하는 비개발자 가이드) / MIT 또는 CC-BY 라이선스 표기.
  - **reduced-motion 회귀 점검** — `prefers-reduced-motion: reduce` 환경에서 미션 1·2·4·5 의 모든 transition/animation 비활성 정상 동작 확인 (특히 ide-mock 페이드 + autocompact 게이지 + parallel typing).
  - **사운드 토글** (선택, 우선순위 낮음) — 글로벌 헤더에 무음/소리 토글 + `state.preferences.sound` (이미 state.js 에 자리 있음) 사용.
- 직전에 끝난 작업: Phase 5 미션 5 IDE 모형 — 데스크톱 풍 사전 화면(폴더·IDE 앱 아이콘) + IDE 모형 아이콘 더블클릭 → IDE 모형 진입 → 시나리오 3단계(보고서.md 클릭 → `claude` 입력해 PowerShell→Claude Code 셸 전환 → `@2024_직업역량_보고서_초안.md` 멘션) + 전 미션 공통 패널 액션 바(이전·새로 시작·건너뛰기). 라이브 deploy 됨 (commit `0f2f6dd` feat, `d77c19d` verification).
- 참고 (Plan 정본과의 차이): Plan_sim_v.1.0.md 254-258 의 미션 5 사양은 `code .` + `git status` 이지만 사용자 결정으로 데스크톱 아이콘 더블클릭 + Claude Code 부팅 + `@` 멘션으로 변경됨 (Working_history 2026-05-11 20:13:35 entry 참조). Plan 정본 본문 자체는 그대로 유지 — Phase 6 에서 plan 정본 동기화 여부도 함께 결정 가능.
- Phase 6 시작 흐름: ① Plan 폴리시 섹션 + 현재 README.md 상태 점검 → ② 사용자에게 우선순위 확인(README 우선? 미션 추가 가이드 우선? reduced-motion 회귀 점검 우선?) → ③ 작성 → ④ 푸시 (사용자 명시 허락 후).
```

---

## [2026-05-11 21:51:49] /clear 직전 점검 — Phase 5 완료 + 진입 프롬프트 박스 Phase 6 으로 갱신

- 사용자 요청: "클리어 점검. 이후 다음 단계 수행 프롬프트 제시."
- 정합성 점검 결과 (모두 정상):
  - `git status` clean, `HEAD = origin/main = d77c19d` (Phase 5 verification entry 커밋과 일치)
  - 라이브 빌드 latest commit: `0f2f6dd` (feat), duration 23,655 ms (~23.6초) — verification 커밋 `d77c19d` 의 빌드도 큐에 들어갔겠지만 latest 갱신은 시간차 있을 수 있음. 외부 노출 자산은 이미 `0f2f6dd` 빌드로 모두 반영됨(Working_history.md 변경만 있는 `d77c19d` 는 사용자 노출 X)
  - 메모리 디렉토리 (`C:\Users\chant\.claude\projects\E--AI-Work-krivet-terminal-sim\memory\`): `MEMORY.md` + 4 feedback 파일 (`working_history` / `path_convention` / `push_workflow` / `ide_framing`) — 이번 세션 신규 추가 없음
  - `MEMORY.md` 인덱스 4 항목으로 일치
  - Working_history 메타박스 "현재 단계" = "Phase 5 완료 (전체 미션 5종 라이브 deploy)" → 진실값 일치
  - 진입 프롬프트 박스 "다음 작업 후보" 섹션을 **Phase 6 폴리시(README / reduced-motion 회귀 / 사운드 토글) 흐름으로 통째 갱신**. Plan 정본과의 미션 5 사양 차이(20:13:35 entry 참조)도 박스 안에 명시해 다음 세션이 Plan 본문만 읽고 혼란 받지 않도록 보강.
- 이번 세션 작업 요약 (`b21e6be..d77c19d` · 2 커밋):
  - `0f2f6dd` feat(mission5): 미션 5 IDE 모형 — 데스크톱 + 아이콘 더블클릭 + Claude Code 부팅 + `@` 멘션 시나리오 (+ 전 미션 공통 패널 액션 바)
  - `d77c19d` docs: Phase 5 푸시·라이브 검증 entry + 메타박스 갱신
- 이번 세션 내 Working_history entry 5건 (역순):
  - 21:48:30 Phase 5 푸시·라이브 검증
  - 20:20:10 전 미션 공통 패널 액션 바 통일 (이전·새로 시작·건너뛰기)
  - 20:13:35 미션 5 재설계 (사전 터미널 → 데스크톱 + 아이콘 + Claude Code 부팅 + `@` 멘션) — 사용자 피드백 3회 반영
  - 20:00:09 fix(mission5): IDE 모형 전환 시 prompt line 두 개 보이는 버그 픽스
  - 19:52:04 미션 5 1차 구현 (사전 터미널 + `git status` 시나리오, 이후 재설계로 대체됨)
- 메모리 신규: **없음** (이번 세션). 기존 4종 메모리(`working_history` / `path_convention` / `push_workflow` / `ide_framing`)는 그대로 적용·유지 — 특히 `ide_framing` 의 "방법론·패러다임 단어 금지 / 도구·환경 통일" 규칙이 미션 5 모든 카피(intro / panel / 회고 6 bullets) 에서 일관 준수됨.
- 다음 세션 진입 시 보강할 점: 없음. 진입 프롬프트 박스만 그대로 복사-붙여넣기 하면 Phase 6 점검·설계부터 즉시 시작 가능.
- 향후 Phase 6 가 끝나면: 진입 프롬프트 박스의 "다음 작업 후보" 섹션을 갱신/제거(stale 방지), 메타박스 "현재 단계" 라인은 "Phase 6 완료" 또는 "프로덕션 준비 완료" 로.

---

## [2026-05-11 21:48:30] Phase 5 푸시 + 라이브 자산 키워드 검증

- 사용자 결정: "메인 푸시 진행"
- staged 8 파일:
  - `M` Working_history.md / css/panel.css / css/special.css / data/chapters.json / js/main.js / js/panel.js
  - `A` data/missions/ch3-m5-ide-mock.json / js/special/ide-mock.js
- `git commit` (HEREDOC): **commit `0f2f6dd`** — 8 files / +1889/-23, 한국어 메시지(미션 5 시나리오 + 패널 액션바 부가) + `Co-Authored-By`
- `git push origin main`: `b21e6be..0f2f6dd  main -> main` 성공
- Pages 빌드 폴링: poll 1 `building` → 폴링 5초 간격 until `built` → **`built`** · duration **28,937 ms (~28.9초)** — 평소 25~30초 범위 정상
- 라이브 자산 GET (8 URL × 200): index.html(2258 B) / data/chapters.json(2052) / data/missions/ch3-m5-ide-mock.json(10966) / js/main.js(10543) / js/panel.js(12057) / js/special/ide-mock.js(21759) / css/special.css(17392) / css/panel.css(3847)
- 미션 5 JSON 라이브 sanity (모두 OK):
  - `id=ch3-m5-ide-mock`, `special.kind=ide-mock`
  - desktop icons = [(folder-krivet, folder), (app-ide, app-ide)]
  - ide.terminal = `{ kind: 'powershell', cwd: 'C:\\KRIVET\\연구' }`
  - scenarioSteps = [openFile/보고서.md, terminalCommand/`claude`/exact, terminalCommand/`@2024_직업역량_보고서_초안.md`/prefix]
  - reflection bullets = 6
- chapters.json 라이브 상태: 활성 5종 (ch1-m1/ch1-m2/ch2-m3/ch2-m4/ch3-m5), placeholder 0
- 라이브 코드 키워드 노출 (전부 OK):
  - `js/special/ide-mock.js` — `export class IdeMockMission`, `mountDesktop`, `buildDesktopIcon`, `handleIconDoubleClick`, `buildTaskbar`, `flashDesktopToast`, `transitionToIde`, `returnToDesktop`, `matchesStepCommand`, `afterSwitchShell`, `updateTerminalMeta`, `makeDesktopIconSvg`
  - `js/main.js` — `import { IdeMockMission }`, `goToPreviousMission`, `restartCurrentMission`, `startIdeMockMission`, `mission.special?.kind === 'ide-mock'` 분기, `btn-prev-mission` / `btn-restart-mission` 핸들러
  - `js/panel.js` — `appendNavActions`, `renderIdeMockPanel`, `ide-mock:stage` / `ide-mock:scenario` 구독, `btn-prev-mission` / `btn-restart-mission` / `panel-actions-nav` / `btn-secondary` / `btn-ghost`
  - `css/special.css` — `.ide-mock-desktop`, `.ide-mock-desktop-icon`, `.ide-mock-desktop-grid`, `.ide-mock-taskbar`, `.ide-mock-desktop-toast`, `.ide-mock-shell`, `.ide-mock-watermark`
  - `css/panel.css` — `.btn-secondary`, `.btn-ghost`, `.panel-actions-nav`, `justify-content: space-between`
- 사람 눈 검증은 사용자가 직접: <https://dongchan.github.io/krivet-terminal-sim/#ch3/ch3-m5-ide-mock>. 캐시 무시하려면 Ctrl+F5 또는 시크릿 창. 이전 in_progress 상태가 localStorage 에 남아 있다면 우측 상단 [처음부터] 로 리셋하거나 좌측 패널 [↻ 새로 시작] 사용.

---

## [2026-05-11 20:20:10] 전 미션 공통 — 패널 액션 바 통일 (이전 미션 / 새로 시작 / 건너뛰기)

- 사용자 피드백: "모든 미션에서, 미션 새로 시작하기, 이전으로 가기 이런 것들도 필요하지 않을까?"
- 진단: 진행 중 패널에는 `.btn-skip-mission` (건너뛰기) 하나만 있었음. idle 패널은 `[미션 시작] [건너뛰기]` 2개. "이전 미션" / "현재 미션 재시작" 부재. 또 기존 `skipMission()` 가 `engine?.mission` 만 확인해 special 미션 진행 중에는 건너뛰기 자체가 동작 안 하는 잠재 버그도 발견 — 동시 픽스.
- 설계: panel 좌측 하단 `panel-actions` 를 모든 모드에서 동일한 3-버튼 nav 그룹으로 통일.
  - `[← 이전]` `.btn-secondary` — 챕터 경계 넘어 직전 미션 hash 로 이동. 첫 미션(ch1-m1)은 `disabled`.
  - `[↻ 새로 시작]` `.btn-secondary` — confirm 후 현재 미션 진행도 리셋 + special 인스턴스 destroy + 즉시 재시작 (`emit('route:changed') + startCurrentMission()`).
  - `[건너뛰기 →]` `.btn-ghost` — 기존 skipMission 동작 (status='skipped' + 다음 미션). engine?.mission 가드 제거 → currentMissionId 기반으로 special 미션에서도 동작.
  - idle 모드에서는 우측에 `[미션 시작]` `.btn-primary` 가 추가로 붙음. placeholder 미션은 `[새로 시작]` 만 숨김.
- 신규 파일/변경:
  - `js/main.js` — `goToPreviousMission()`(챕터 경계 처리 mirror of goToNextMission), `restartCurrentMission()`(updateProgress reset + emit route:changed + startCurrentMission 재호출) 추가. `skipMission()` 의 `engine?.mission` 가드 제거, getState().currentMissionId 기반으로 재작성. document click 핸들러에 `.btn-prev-mission` / `.btn-restart-mission` 추가, 잘못된 `.btn-skip → startCurrentMission` 매핑 제거.
  - `js/panel.js` — 신규 helper `appendNavActions(panel, { mode, missionId, isPlaceholder })`. `renderIdle` 의 placeholder/일반 분기 + `renderActive` 끝 부분 모두 helper 호출로 통일. 첫 미션 자동 감지(`chaptersRef[0]?.missions?.[0]`)로 [← 이전] disabled.
  - `css/panel.css` — `.panel-actions` justify-content: space-between + flex-wrap (좁은 화면 줄바꿈). 신규 `.panel-actions-nav` 가로 그룹. 신규 버튼 클래스 `.btn-secondary` (액션블루 outline) / `.btn-ghost` (회색 ghost) + hover/disabled. 기존 `.btn-primary` 유지.
- 검증 (로컬 5500):
  - HTTP 200: main.js (10837 B), panel.js (12350 B), panel.css (4022 B)
  - main.js 키워드: `goToPreviousMission`, `restartCurrentMission`, `btn-prev-mission`, `btn-restart-mission`
  - panel.js 키워드: `appendNavActions`, 3개 nav 버튼 클래스, `panel-actions-nav`, `btn-secondary`, `btn-ghost`
  - panel.css 키워드: `.btn-secondary`, `.btn-ghost`, `.panel-actions-nav`, `justify-content: space-between`
- 미수행 (사용자 시연 위임):
  - 사람 눈 검증 — 모든 미션(특히 첫 미션 ch1-m1 의 [← 이전] disabled / special 미션 ch3-m5 에서 [↻ 새로 시작] 시 데스크톱 단계부터 다시 시작) 동작. 챕터 경계 미션(ch2-m3 의 [← 이전] → ch1-m2) 동작. [건너뛰기 →] 가 special 미션 진행 중에도 동작 (이전 잠재 버그 픽스 확인).
  - 라이브 푸시 — 사용자 사람-눈 검수 통과 후 명시 허락 필요.

---

## [2026-05-11 20:13:35] 미션 5 재설계 — 사전 터미널 → 데스크톱 + 아이콘 더블클릭 + 통합 터미널 안 Claude Code 부팅

- 사용자 피드백 1차: "`code .` 를 입력하세요. 같은 폴더가 IDE 모형 안에서 그대로 열립니다 — 이건 무슨 뜻이야? IDE를 부른다는 건가? 차라리 아이콘 같은 걸 더블클릭하게 하는 게 낫지 않을까? 터미널에서 저렇게 입력하면 진짜 뜨는 줄 알겠어."
- 사용자 피드백 2차: "마지막 예제 git 은 너무 나간 듯한데? 깃허브 자체를 모르는데 명령어를 조금 더 쉽고 친숙한 걸로 바꾸면 어떨까?"
- 사용자 피드백 3차: "아 그러려면 IDE에서 터미널 뜨고 클로드 접속하는 것도 보여주면 좋겠다."
- AskUserQuestion 결정 (1회): 사전 화면 = "데스크톱 풍 + 아이콘 더블클릭" / `code .` 처리 = "회고 카드 노트로만 언급". 후속 채팅으로 추가 결정: 마지막 명령 = `@` 멘션 (`git status` 폐기), 통합 터미널은 PowerShell 로 시작 후 `claude` 입력으로 Claude Code 부팅 단계 추가.
- 진단/의도:
  - `code .` 흐름은 학습자에게 "터미널만으로 IDE 가 뜬다" 오해 가능 + Plan 미션 5 의 핵심 메시지("IDE 는 도구") 와 어울리지 않는 트릭. → 데스크톱 아이콘 더블클릭으로 변경 (Windows 비개발자에게 가장 익숙한 행동).
  - `git status` 는 비개발자 학습자(KRIVET 직원) 가 git/GitHub 자체를 모르는 상황에 너무 어려운 명령. → `@` 멘션 + 한 줄 요약 요청. 미션 3·4 에서 익힌 `@` 멘션을 재활용해 학습 연속성 확보.
  - IDE 안 통합 터미널이 처음부터 Claude Code 셸로 떠 있으면 "IDE 가 새 환경" 으로 보임. → PowerShell 로 시작 후 `claude` 입력으로 부팅하는 단계를 추가, "같은 셸 위에 같은 CLI 가 뜬다" 는 점을 시각화.
- 시나리오 (3단계로 확장):
  1. 좌측 트리에서 `2024_직업역량_보고서_초안.md` 클릭 → 에디터 미리보기 (1단계, openFile)
  2. 하단 PowerShell 에 `claude` 입력 → 부팅 시퀀스 출력 + 셸이 Claude Code 로 전환(setPrompt + refreshTitlebar + header meta 갱신) (2단계, terminalCommand exact)
  3. Claude Code 프롬프트에 `@2024_직업역량_보고서_초안.md ...` 입력(prefix 매칭) → 보고서 한 줄 요약 응답 (3단계, terminalCommand prefix)
- 신규 파일/대체:
  - `data/missions/ch3-m5-ide-mock.json` — `preIde` → `desktop` 으로 교체. desktop 안: watermark / icons[folder, app-ide] / taskbar(start·search·locale·clock·lockedNote) / transitionDurationMs. ide.terminal = PowerShell. ide.terminalGreeting dim 안내 1줄. scenarioSteps 3개 (matchKind: 'exact' 또는 'prefix'). step2 에 `afterSwitchShell: { kind: 'claude', cwd }` 추가. 회고 bullets 6개로 확장 (`code .` 단축키 노트 + 단순화 모형 고지).
  - `js/special/ide-mock.js` — 전면 재작성:
    - 신규 메서드: `mountDesktop / buildDesktopIcon / handleIconClick / handleIconDoubleClick / buildTaskbar / clearDesktopSelection / flashDesktopToast / makeDesktopIconSvg`
    - 변경: `handlePreInput` 제거. `transitionToIde` 가 `.ide-mock-desktop.ide-mock-fading-out` 로 전환. `returnToPreIde` → `returnToDesktop`. `flashTooltip` → `flashIdeToast` (데스크톱용 toast 와 분리)
    - 핵심 신규 로직: `matchesStepCommand(step, cmd)` — `matchKind: 'prefix'` 면 `cmd.startsWith(step.command)`, 아니면 exact. `handleIdeTermInput` 에서 매칭 후 `step.afterSwitchShell` 있으면 `ideTerminal.setPrompt(...) + refreshTitlebar() + updateTerminalMeta()` 호출 → 다음 prompt line 부터 새 셸 표시. `terminalMetaEl` 헤더 라벨도 갱신.
    - 이전 픽스 (`this.preTerminal.readOnly = true`) 는 이제 해당 없음 — preTerminal 자체가 없음.
  - `js/panel.js` — `renderIdeMockPanel` 의 stage 분기 갱신:
    - `'pre-ide'` → `'desktop'` 카피 "🖥 바탕화면 — IDE 모형을 띄울 차례" + 행동 카드 "IDE 모형 아이콘을 **더블클릭**".
    - terminalCommand 분기에서 step.displayHint 가 있으면 "입력할 명령" 코드 카드로 보여줌. step.command === 'claude' 면 관찰 포인트 카피를 "PowerShell 위 Claude Code 부팅" 톤으로, 아니면 "한 파일을 두 시각으로" 톤으로 분기.
  - `css/special.css` — Desktop stage 레이아웃 추가:
    - `.ide-mock-desktop` (그라데이션 배경 + 우상단 워터마크 + 페이드 transition)
    - `.ide-mock-desktop-grid` (110×110 그리드)
    - `.ide-mock-desktop-icon` (hover/focus/is-selected 상태 + tile + label/sublabel) + `.kind-app-ide` 액션블루 톤
    - `.ide-mock-taskbar` (시작·검색·로케일·시계, 클릭 시 lockedNote 토스트)
    - `.ide-mock-desktop-toast` (데스크톱 토스트)
    - prefers-reduced-motion + 모바일 분기(≤900: 96×96 그리드, ≤640: 검색 박스 숨김) 확장
- 검증:
  - JSON parse — id/kind/desktop.icons/ide.terminal/scenarioSteps 3개/reflection bullets 6개 모두 일치
  - HTTP 200 — mission JSON(10966 B) / ide-mock.js(21759 B) / panel.js(11221 B) / special.css(17392 B)
  - 라이브 ide-mock.js 키워드 12종 모두 노출 (mountDesktop · buildDesktopIcon · handleIconDoubleClick · matchesStepCommand · afterSwitchShell · updateTerminalMeta · returnToDesktop 등)
  - CSS `.ide-mock-desktop*` 32 occurrences
- 미수행 (사용자 시연 위임):
  - 사람 눈 검증 — 바탕화면 화면, 아이콘 hover/selected/dblclick, IDE 페이드 전환, 1단계 파일 클릭, 2단계 `claude` 입력 → 부팅 응답 + prompt 색·헤더 라벨이 Claude Code 로 전환, 3단계 `@` 멘션 prefix 응답, 회고 카드 6 bullets, ESC 바탕화면 복귀.
  - 라이브 푸시 — 사용자 사람-눈 검수 통과 후 명시 허락 필요.
- Plan 정본 사양과의 트레이드오프: Plan_sim_v.1.0.md 254-258 의 미션 5 사양은 `code .` 명령으로 IDE 전환을 명시하지만, 학습자 오해 가능성 + KRIVET 비개발자 대상이라는 점에서 사용자 결정으로 데스크톱 아이콘 더블클릭으로 변경. `code .` 는 회고 카드 5번째 bullet "참고" 노트로만 언급해 학습 가치 보존. Plan 본문 자체는 그대로 두고 변경 사유를 이 entry 에 기재.

---

## [2026-05-11 20:00:09] fix(mission5): IDE 모형 전환 시 prompt line 두 개 보이는 버그 픽스

- 사용자 사람-눈 검증 중 발견 (스크린샷 첨부): IDE 모형으로 전환된 후 하단 통합 터미널에 `PS C:\KRIVET\연구> 여기에 명령을 입력하고 Enter` prompt 줄이 **두 개** 표시됨. 진짜 input element 가 두 개라 placeholder 도 두 개 노출.
- 근본 원인: `Terminal.submit()` 의 흐름이 `await this.onSubmit?.(value, this)` 종료 직후 무조건 `this.attachPromptLine()` 호출. 사전 터미널에서 `code .` 입력 → `handlePreInput` → `await this.preTerminal.printScript(...)` → `await this.transitionToIde()` 가 await chain 안에서 끝나면, `submit()` 컨텍스트의 `this` 는 여전히 사전 `Terminal` 인스턴스인데 그 객체의 `this.root` 는 `.app-terminal` 컨테이너를 가리킴(같은 참조). transitionToIde() 가 `.app-terminal` 의 내용을 IDE 모형(.ide-mock-shell 안에 새 통합 터미널 .term-window)으로 교체한 뒤 control 이 submit() 으로 되돌아가 `attachPromptLine()` 실행 → `this.root.querySelector('.term-window').appendChild(this.promptLineEl)` 가 새 IDE 통합 터미널의 .term-window 를 찾아 사전 터미널의 prompt line 을 끼워넣음. 그래서 IDE 통합 터미널의 자체 prompt line + 사전 터미널이 끼운 prompt line = 2개.
- 픽스: `js/special/ide-mock.js` 의 `handlePreInput` 의 launchCommand 분기에서 `await this.transitionToIde()` 진입 직전에 `this.preTerminal.readOnly = true;` 토글. `attachPromptLine()` 첫 줄에 이미 `if (this.readOnly) return;` 가드가 있어 재부착을 차단.
- 부가 영향 검토: fallbackResponse 분기는 transition 발생 안 함 → preTerminal 의 root 가 그대로라 정상. returnToPreIde() 흐름은 새 preTerminal 인스턴스(readOnly 기본 false)를 만들어 정상.
- 검증: 라이브 `js/special/ide-mock.js` 에 `this.preTerminal.readOnly = true` 마커 노출 확인. 사용자 사람-눈 재검증 대기.

---

## [2026-05-11 19:52:04] Phase 5 — 미션 5 `ch3-m5-ide-mock` 구현 (로컬 검증 통과, 사용자 사람-눈 검수 + 푸시 대기)

- 사용자 결정: "진입하자" — Plan 정본 (`./Plan_sim_v.1.0.md` 미션 5 섹션 254~258) 재확인 후 즉시 설계·구현 진입.
- 시나리오 설계 — Plan 사양 그대로 두 단계 화면:
  - **사전 터미널 단계**: 일반 `Terminal` 인스턴스(`shell: { kind: 'powershell', cwd: 'C:\\KRIVET\\연구' }`) + 환영 스크립트("같은 폴더에 보고서·CSV·참고문헌이 있지만 한 명령으로만 들춰볼 수 있어요. `code .` 입력 시 같은 폴더를 IDE 모형 안에서 열어 봅니다.")
  - 사용자가 정확히 `code .` 입력 → 응답 스크립트 → **700ms 페이드 아웃 → IDE 마운트 → 페이드 인** (`prefers-reduced-motion: reduce` 면 즉시 점프)
  - **IDE 모형 단계**: 타이틀바(macOS 풍 dots + workspace 라벨) / 좌측 48px 활동 표시줄(SVG 일반 아이콘 5개 — 파일/검색/소스 제어/확장/계정) / 220px 탐색기(.git 잠금 + 4 파일) / 중앙 탭바 + 에디터(라인 게터 + 미리보기) / 하단 통합 터미널(`Terminal` 클래스 재사용) / 액션블루 status bar / 우하단 워터마크 "교육용 모형 (Educational Mockup)" opacity ≈0.55
  - 시나리오: ① 좌측에서 `2024_직업역량_보고서_초안.md` 클릭 → 에디터에 md 미리보기 + 자동 advance → ② 하단 터미널에 `git status` 입력 → 응답 스크립트(modified 표시) + 자동 advance → 회고 카드 발현
  - **ESC 키** 핸들러: stage='ide' & !completed 일 때 `confirm()` → 사전 터미널 복귀(scenarioIndex 0 리셋). Plan 체크리스트 343 "ESC 복귀" 충족.
- 신규 파일:
  - `js/special/ide-mock.js` — `IdeMockMission` 클래스 (15개 메서드 + 2개 SVG 헬퍼). 핵심: `mountPreIde/handlePreInput/transitionToIde/buildIde(+ Activity/Explorer)/openFile/renderEditor/handleIdeTermInput/advanceScenario/attachEscHandler/returnToPreIde/flashTooltip/destroy`.
  - `data/missions/ch3-m5-ide-mock.json` — `special.kind: "ide-mock"` + `preIde`(shell·welcome·launchCommand·launchResponse·fallbackResponse·transitionDurationMs:700) + `ide`(workspaceName·root·watermark·terminal·fileTree[5 entries: .git locked + 보고서.md+modified + 설문.csv + 참고문헌.bib + README.md]) + `scenarioSteps[2]` + 회고 5 bullets.
- 코드 일반화 변경:
  - `js/main.js` — `IdeMockMission` import, 모듈 상태 `ideMockMission`. `startCurrentMission` 의 `'ide-mock'` 분기 → 신규 `startIdeMockMission(mission)`. autocompact 와 동일하게 panel.js 가 `currentCtx` 세팅하도록 `mission:start` (specialKind: 'ide-mock') 를 mount() 호출 이전에 발행. `route:changed` 핸들러에서 `ideMockMission.destroy()` 정리. `maybeAutoStart` 의 `mission.special` 가드는 기존 그대로 유효 (ide-mock 도 special 미션이라 자동 재개 건너뜀).
  - `js/panel.js` — `mission:start` 의 `specialKind` 받아 처리. 신규 이벤트 구독 `ide-mock:stage` (pre-ide/ide/complete) + `ide-mock:scenario` (현재 step 인덱스/총 개수/step 메타). `renderActive` 분기에 `specialKind === 'ide-mock'` 추가 → 신규 `renderIdeMockPanel(panel, ideMock)`. 단계별 카피: 사전 터미널/openFile/terminalCommand/완료 4종 + "관찰 포인트" 팁 카드.
  - `css/special.css` — `.ide-mock-shell` grid layout(타이틀바 30px / main 1fr / statusbar 24px) + 활동표시줄·탐색기·탭바·에디터·통합 터미널·status bar·워터마크 토큰 일관 다크 IDE 톤(#0f1a28 ~ #1a2638 음영). 액션블루(`--color-action`) 강조 + 활성 파일은 액션블루 14% 옅게. modified 파일은 `--term-system`(앰버) M 배지. 전환 애니: `.ide-mock-fading-out`/`.ide-mock-fading-in` + `.ide-mock-visible` 컴비. `prefers-reduced-motion: reduce` 면 모든 transition 무효화. 모바일 분기(≤900: 활동표시줄+탐색기 축소, ≤640: 탐색기 숨김).
- 데이터:
  - `data/chapters.json` — `ch3-m5-ide-mock.placeholder: true` 제거 → idle 패널이 정상 "미션 시작" 버튼 노출. 활성 미션 5종 (ch1-m1/ch1-m2/ch2-m3/ch2-m4/ch3-m5), placeholder 0.
- IDE 프레임 메모리(`feedback_ide_framing.md`) 일관 적용 — "방법론·패러다임·방식론" 단어 일절 사용 안 함. intro 첫 문장 "IDE는 새로운 개발 방법론이 아닙니다" 로 부정 형태로만 등장. 회고 5 bullets 는 모두 "도구·환경·워크스페이스" 톤. 마지막 bullet 은 "이 화면은 일반화된 IDE 레이아웃의 모형" 단순화 고지.
- 검증 (로컬 5500, Bash bg ID `bx0cv41y4`):
  - JSON parse — mission id 일치 / `special.kind: ide-mock` / `preIde.launchCommand: code .` / fileTree 5 / scenarioSteps 2 / chapters.json 활성 5·placeholder 0
  - HTTP 200 — index.html / data/chapters.json / data/missions/ch3-m5-ide-mock.json (8742 B) / js/main.js (9461 B) / js/panel.js (10497 B) / js/special/ide-mock.js (15745 B) / css/special.css (12951 B)
  - 라이브 자산 키워드 — `export class IdeMockMission`, `mountPreIde`, `handlePreInput`, `transitionToIde`, `buildIde`, `buildActivityBar`, `buildExplorer`, `renderEditor`, `handleIdeTermInput`, `advanceScenario`, `attachEscHandler`, `returnToPreIde`, `flashTooltip`, `makeActivityIconSvg`, `makeFileIconSvg` 모두 노출
  - main.js — `import { IdeMockMission }` / `ideMockMission` 모듈 상태 / `mission.special?.kind === 'ide-mock'` 분기 / `startIdeMockMission` 정의 / `mission:start ... specialKind: 'ide-mock'`
  - panel.js — `on('ide-mock:stage')` / `on('ide-mock:scenario')` / `specialKind === 'ide-mock'` 분기 / `renderIdeMockPanel`
  - special.css — `.ide-mock-*` 44 occurrences (shell/titlebar/activity-bar/explorer/filetree/tabbar/editor/terminal-pane/statusbar/watermark/toast/fading-*)
- 미수행 (의도적, 사용자 시연 위임):
  - 사람 눈 검증 — `code .` 입력 후 700ms 페이드 전환, 활동표시줄 hover/active 상태, 파일트리 클릭 시 에디터 미리보기(라인 게터·M 배지), 잠긴 `.git` 클릭 시 토스트 안내, 하단 터미널 `git status` 응답, ESC 복귀 confirm 흐름, 회고 카드 5 bullets. 사용자가 `http://localhost:5500/#ch3/ch3-m5-ide-mock` 에서 직접 확인 예정.
  - 라이브 푸시 — 사용자 사람-눈 검수 통과 후 명시 허락 필요.
- 알려진 설계 트레이드오프:
  - `code .` 외 명령은 `fallbackResponse` 로 부드럽게 안내(거부 X). IDE 안 통합 터미널도 마찬가지로 시나리오 외 명령은 dim 메시지.
  - 에디터는 readOnly 미리보기(타이핑 X) — Plan 사양상 "에디터에 내용" 만 요구. 단순 라인 게터 + 단색 톤(언어별 살짝 다른 color).
  - 잠긴 `.git` 폴더는 클릭 시 토스트만 — 트리 expand 없음. "git 메타 폴더는 일반 작업에서 건드리지 않아요" 메시지로 학습 가치 유지.
  - 워터마크는 항시 표시(opacity 0.55, `pointer-events: none`) — Plan 256 "항시 표시" 사양 충족. 모바일에서는 위치 살짝 조정.
- Pre-existing 가드 재확인: `maybeAutoStart` 가 special 미션 in_progress 상태일 때 자동 재개 건너뛰는 가드는 기존 그대로 작동. ide-mock 도 `mission.special` 이라 안전.

---



- 사용자 요청: "클리어 전 점검."
- 정합성 점검 결과 (모두 정상):
  - `git status` clean, `HEAD = origin/main = fa5a561` (라이브 deploy 된 커밋과 일치)
  - 라이브 빌드 commit: `fa5a561` `built` · duration 25,638 ms (~26초) — verification entry 와 동기화
  - 메모리 디렉토리 (`C:\Users\chant\.claude\projects\E--AI-Work-krivet-terminal-sim\memory\`): `MEMORY.md` + 4 feedback 파일 (`working_history` / `path_convention` / `push_workflow` / **`ide_framing` ← 이번 세션 신규**)
  - `MEMORY.md` 인덱스 4 항목으로 일치
  - Working_history 메타박스 "현재 단계" = "Phase 4 완료 (Ch.1·Ch.2 모두 활성, 라이브 deploy)" → 진실값 일치
  - 진입 프롬프트 박스 "다음 작업 후보" = Phase 5 미션 5 IDE 모형 + 직전 작업 메모 정확
- 이번 세션 작업 요약 (`12ffcc4..fa5a561` · 4 커밋):
  - `5566289` feat(mission4): 오토컴팩트 시뮬레이션 — 게이지 + 5턴 누적 + 85% 임계 자동 압축
  - `491e9bd` docs: Phase 4 푸시·라이브 검증 entry
  - `b0af36b` fix(copy): Ch.3·미션 5 — IDE를 방법론이 아닌 도구로 명확화
  - `fa5a561` docs: IDE 프레임 보강 푸시·검증 entry
- 메모리 1종 신규 (이번 세션): `feedback_ide_framing.md` — Ch.3/미션 5 작성 시 "방법론·패러다임·방식론" 단어 금지, "도구·환경·워크스페이스" 프레임 통일. 향후 Phase 5 가 자동 로드해 따름.
- 다음 세션 진입 시 새로 보강할 점 없음 — 진입 프롬프트 박스만 그대로 복사-붙여넣기 하면 Phase 5 점검·설계부터 즉시 시작 가능.
- 향후 Phase 5 가 끝나면: 진입 프롬프트 박스의 "다음 작업" 섹션을 갱신/제거(stale 방지), 메타박스 "현재 단계" 라인은 자연스럽게 Phase 6 (폴리시) 또는 완료 상태로.

---

## [2026-05-11 19:38:51] IDE 프레임 보강 푸시 + 라이브 카피 검증

- 사용자 결정: "푸시 진행" (옵션 A — 별도 푸시)
- `git commit` (HEREDOC): **commit `b0af36b`** — 2 files / +15/-2, 한국어 메시지 + `Co-Authored-By`
- `git push origin main`: `491e9bd..b0af36b  main -> main` 성공
- Pages 빌드 폴링: poll 1 `building` → poll 2 (10초 후) `building` → poll 3 (20초 후) **`built`** · duration **18,099 ms (~18초)** — 평소 25~30초보다 짧음 (소규모 변경)
- 라이브 카피 확인 (`/data/chapters.json` GET + python parse):
  - Ch.3 summary: "터미널만으로는 불편합니다. 에디터·터미널·파일트리를 한 창에 묶은 도구로서 IDE가 왜 등장했을까요?" ← 의도대로 노출
  - 미션 5 summary: "IDE는 새로운 개발 방법론이 아니라, 여러 도구를 한 워크스페이스에 모은 환경입니다. 그 차이를 직접 체험합니다." ← 의도대로 노출
  - 미션 5 placeholder: true 유지 (Phase 5 진입 시까지)
- 결과: 라이브 placeholder 카드(`#ch3/ch3-m5-ide-mock`) 가 새 카피로 표시. Phase 5 코드 작성 전에도 학습자에게 "도구·환경" 프레임이 정확히 전달.

---

## [2026-05-11 19:36:48] IDE 는 방법론이 아닌 도구 — Ch.3 카피 프레임 보강 + 메모리 등록 (선행 점검)

- 사용자 지적: "IDE 관련 내용 작성할 때, 누군가는 IDE 를 방법론으로 알고 있는 것 같아. Tool 또는 개발환경에 불과한 거 아니야?" → "방법론이 아닌 도구라는 점을 강조해 주는 무언가가 있으면 좋겠어."
- 진단: 동의. IDE = Integrated Development **Environment**(에디터·디버거·빌드·VCS UI·통합 터미널을 한 창에 묶은 도구/환경). Agile·TDD·DDD 같은 방법론과는 다른 층위. 한국어 "통합 개발" 어감 + 일부 입문서가 "IDE 개발 vs 명령줄 개발" 을 "개발 방식" 처럼 묶어 가르치는 영향으로 비개발자가 오해할 위험.
- 수정 (`data/chapters.json` 라이브 노출 카피 2 곳):
  - **Ch.3 summary**: "터미널만으로는 불편합니다. IDE는 왜 등장했을까요?" → **"터미널만으로는 불편합니다. 에디터·터미널·파일트리를 한 창에 묶은 도구로서 IDE가 왜 등장했을까요?"**
  - **미션 5 (`ch3-m5-ide-mock`) summary**: "코드와 터미널을 한 워크스페이스에서 다루는 경험." → **"IDE는 새로운 개발 방법론이 아니라, 여러 도구를 한 워크스페이스에 모은 환경입니다. 그 차이를 직접 체험합니다."** — "방법론 아님" 을 본문에 명시 (placeholder 카드에 그대로 노출).
  - 미션 5 placeholder 플래그는 유지 — Phase 5 진입 시까지는 "🚧 곧 공개 예정" 카드 안에 새 summary 로 노출.
- 메모리 신규: `C:\Users\chant\.claude\projects\E--AI-Work-krivet-terminal-sim\memory\feedback_ide_framing.md`. 향후 Phase 5 작성 시 "방법론·패러다임·방식론" 단어 금지, "도구·환경·워크스페이스" 통일. 회고/첫 step 안내에 "IDE 는 새로운 개발 방법론이 아니라 여러 도구를 한 창에 모은 환경" 명시 박을 것. `MEMORY.md` 인덱스 4 항목으로 갱신.
- 미수행: 푸시 미진행 — 다음 사이클(예: Phase 5 진입 또는 별도 푸시 허락) 때 함께 보낼 예정. 작은 카피 변경이라 사용자가 별도 푸시 요청해도 가능.

---

## [2026-05-11 19:33:06] Phase 4 푸시 + 라이브 자산 키워드 검증

- 사용자 결정: "메인 푸시 진행"
- staged 7 파일(이전 entry 의 모든 변경):
  - `M` Working_history.md / css/special.css / data/chapters.json / js/main.js / js/panel.js
  - `A` data/missions/ch2-m4-autocompact.json / js/special/autocompact.js
- `git commit` (HEREDOC): **commit `5566289`** — 7 files / +713/-14, 한국어 메시지 + `Co-Authored-By`
- `git push origin main`: `12ffcc4..5566289  main -> main` 성공
- Pages 빌드 폴링: poll 1 `building` → poll 2 (10초 후) `building` → poll 3 (20초 후) **`built`** · duration **36,426 ms (~36초)** — 평소 25~30초 대비 살짝 길지만 정상 범위
- 라이브 자산 GET (7 URL × 200): index.html, js/special/autocompact.js, data/missions/ch2-m4-autocompact.json, css/special.css, js/main.js, js/panel.js, data/chapters.json
- 키워드 노출 확인 (전부 OK):
  - autocompact.js — `export class AutocompactMission`, `runCompaction`, `animateGauge`, `showDisclaimer`, `emitTurnPanel`
  - main.js — `import { AutocompactMission }`, `mission.special?.kind === 'autocompact'` 분기, `startAutocompactMission`, `mission:start … specialKind: 'autocompact'`, `mission.special` 가드(maybeAutoStart)
  - panel.js — `specialKind` 구조분해, `autocompact:turn` / `autocompact:compacting` 구독, `renderAutocompactPanel`
  - special.css — `.autocompact-gauge` + 3-tier(`tier-safe`/`tier-warn`/`tier-danger`) + `.disclaimer-overlay`
- 미션 JSON 라이브 sanity: `special.kind=autocompact`, budget/start/threshold/after = `1000000/700000/0.85/0.3`, userPrompts=5, compaction keys=[preScript, compactDurationMs, postScript], reflection bullets=5
- chapters.json 라이브 상태: 활성 4 (ch1-m1/ch1-m2/ch2-m3/ch2-m4) + placeholder 1 (ch3-m5)
- 사람 눈 검증은 사용자가 직접: <https://dongchan.github.io/krivet-terminal-sim/#ch2/ch2-m4-autocompact>. 캐시 무시하려면 Ctrl+F5 또는 시크릿 창. 진행 중이던 미션 4 in_progress 상태가 localStorage 에 남았다면 우측 상단 [처음부터] 로 리셋.

---

## [2026-05-11 18:21:18] Phase 4 — 미션 4 `ch2-m4-autocompact` 오토컴팩트 시뮬레이션 구현 (로컬 검증 완료, 사용자 사람-눈 검수 대기)

- 사용자 결정: "진행하자" — Plan 정본 (`./Plan_sim_v.1.0.md` 미션 4 섹션) 재확인 후 즉시 설계·구현 진입.
- 시나리오 설계 — 미션 3 의 1M 컨텍스트 모델(Opus 4.7) 연속성 유지하기 위해 `tokenBudget: 1,000,000` 채택 (Plan 의 `200,000` 예시는 작성 당시 placeholder 수치로 판단). 시작 70% (700,000 tok) — 미션 3 끝 시점(40.3%) 에서 누적 더 쌓인 가정. 5턴 사전정의 더미 질문이 순차적으로 토큰을 더해 마지막 5번째 턴이 정확히 85% 임계치 돌파:
  - T1: +31,000 → 731,000 (73.1%) — "보고서 핵심 결론 3개"
  - T2: +38,000 → 769,000 (76.9%) — "설문 연령대 분포 표"
  - T3: +28,000 → 797,000 (79.7%) — "참고문헌 2023+ 만"
  - T4: +42,000 → 839,000 (83.9%) — "방법론 영어 번역"
  - T5: +34,000 → 873,000 (87.3%) ← 임계 돌파 → 자동 압축 → 30.0% (300,000 tok)
- 신규 파일:
  - `js/special/autocompact.js` — `AutocompactMission` 클래스. `mount/handleInput/runCompaction/animateGauge/showDisclaimer/destroy`. 게이지는 위쪽 띠로 자체 렌더링(외부 CSS 클래스 `.autocompact-gauge` + `.autocompact-gauge-bar`), 색 단계 3종 (`tier-safe` <70% / `tier-warn` 70~85% / `tier-danger` ≥85%). 게이지 변화는 `requestAnimationFrame` 기반 ease-out cubic 자체 애니메이션(600ms 일반 턴 / 1800ms 압축). `prefers-reduced-motion: reduce` 면 즉시 점프. 사용자 입력은 자유 텍스트로 받되 응답·토큰은 `turnIndex` 로 deterministic 진행. 압축 후엔 `completed=true` 로 추가 입력 차단(친절한 dim 메시지로 회고 모달 안내).
  - `data/missions/ch2-m4-autocompact.json` — `special.kind: "autocompact"` + 5턴 `userPrompts[]` + `compaction.preScript/postScript`. 회고 `bullets` 5개 (마지막 bullet 은 "단순화된 모형" 재고지 — 오정보 방지). `completion.type: "specialComplete"`.
- 코드 일반화 변경:
  - `js/main.js` — `AutocompactMission` import, 모듈 상태 `autocompactMission` 추가. `startCurrentMission` 의 `mission.special?.kind === 'autocompact'` 분기 → `startAutocompactMission(mission)` 신설. **이벤트 순서 주의**: `mount()` 안의 `emitTurnPanel()` 이 panel.js `currentCtx` 세팅보다 먼저 들어가지 않도록, `emit('mission:start', ...)` → `autocompactMission.mount()` 순서로 보정. `route:changed` 핸들러에서 `autocompactMission.destroy()` 정리.
  - `js/panel.js` — `mission:start` 페이로드의 `specialKind` 받아 `currentCtx.specialKind` 저장. 신규 이벤트 구독 `autocompact:turn` (다음 예시 질문 카드 갱신) + `autocompact:compacting` (압축 중 안내). `renderActive` 가 `specialKind === 'autocompact'` 면 신규 `renderAutocompactPanel(panel, autocompact)` 호출 — 일반 step 카드 대신 "💬 자유롭게 대화" + "예시 질문 (그대로 또는 자유롭게)" 코드 카드를 띄움. 압축 phase 에서는 "⚠ 임계치 도달 — 자동 압축 중" 라벨.
  - `css/special.css` — `.autocompact-wrapper`(flex column full height), `.autocompact-gauge`(다크 배경 위쪽 띠 + 헤더·트랙·numeric), `.autocompact-gauge-bar`(width transition + 3 tier 색), `.autocompact-terminal`(flex 1 + min-height 0). 신규 `.disclaimer-overlay` + `.disclaimer-card` 풀스크린 모달 (액션블루 상단 보더, 본문 + 3 bullets + "이해했어요 — 시작하기" 버튼). 모바일(≤900px) `max-width: none`.
- 데이터:
  - `data/chapters.json` — `ch2-m4-autocompact.placeholder: true` 제거 → idle 패널이 정상 "미션 시작" 버튼 노출, `chapters.json` 키만 갱신해 자동 활성화.
- 검증 (로컬 5500, 코드 0회 회귀 의심 없음):
  - JSON parse OK, 토큰 수학 검증 (T5 가 정확히 임계 돌파, 873,000 = preScript 텍스트와 일치, 87.3% = postScript "87.3% → 30.0%" 와 일치)
  - 자산 6 종 HTTP 200 (`ch2-m4-autocompact.json`, `js/special/autocompact.js`, `css/special.css`, `js/main.js`, `js/panel.js`, `data/chapters.json`)
  - 신규 코드 키워드 노출 확인 — `class AutocompactMission`, `runCompaction`, `animateGauge`, `showDisclaimer`, `startAutocompactMission`, `autocompactMission`, `specialKind`, `autocompact:turn`, `autocompact:compacting`, `renderAutocompactPanel`, `.autocompact-gauge`, `.disclaimer-overlay`, `tier-warn`, `tier-danger`
  - chapters.json placeholder 상태 — 활성 4 (ch1-m1/ch1-m2/ch2-m3/ch2-m4) + placeholder 1 (ch3-m5)
- 미수행 (의도적, 사용자 시연 위임):
  - 사람 눈 검증 — disclaimer 모달 동작, 게이지 색 단계 전환(70% / 85%), 5턴 입력하며 게이지 차오름 시각 효과, 5턴째 자동 압축 애니메이션(87.3% → 30%, 1.8s ease-out), 회고 모달 발현. 사용자가 `http://localhost:5500/#ch2/ch2-m4-autocompact` 에서 직접 확인 예정.
  - 라이브 푸시 — 사용자가 사람 눈 검증 통과시킨 후 명시 허락 필요.
- 알려진 설계 트레이드오프:
  - 사용자 입력은 자유 텍스트지만 응답·토큰은 사전정의 turn 인덱스대로 진행. "예시 질문 그대로 또는 자유롭게" 카드로 안내. 진짜 LLM 응답이 아니라는 점은 disclaimer 에서 한 번 더 명시.
  - 게이지 색은 `--term-error` (빨강) / `--term-system` (앰버) / 그린(#6ec07a 신규) 으로 디자인 토큰 톤 안에서 해결. 신규 컬러 토큰은 추가하지 않고 인라인.
- Pre-existing 버그 가드 추가: `maybeAutoStart` 가 special 미션을 자동 재개하려 들면 `engine.loadAndStart` 가 `mission.steps.length` 접근에서 throw — parallel 미션부터 잠재해 있던 문제. 사용자 검증 중 새로고침 가능성 있어 `mission.special` 이면 자동 재개 건너뛰고 사용자가 다시 "미션 시작" 누르게 가드. 자동 재개 흐름은 일반 step 미션에만 적용 유지.

---



- 사용자 요청: "다음 페이즈로 가기 전, 클리어 점검. 점검 후, 페이즈4부터 시작 프롬프트 삽입."
- 정합성 점검 결과 (모두 정상):
  - `git status` clean, `HEAD = origin/main = c1603e1` (라이브 deploy 된 커밋과 일치)
  - 라이브 빌드: `c1603e1` `built` — 마지막 verification entry 와 동기화
  - 메모리 디렉토리: `MEMORY.md` + `feedback_path_convention.md` 만 — 이번 세션의 push 워크플로/인수인계 운영 규칙은 미저장
- 메타박스 "현재 단계" 갱신: "Phase 3 완료 (Ch.1 모두 활성) + **다음 작업 결정 완료: Phase 4 미션 4 오토컴팩트**" 로 변경. 더 이상 "결정 대기 중" 아님.
- 진입 프롬프트 박스 내부에 **"다음 작업 (결정 완료 · 사용자 확인 후 시작)"** 섹션 신설. Phase 4 사양 정본 위치, special.kind 신규('autocompact'), 데이터 스키마, 선행 코드 작업 목록(`js/special/autocompact.js`, 게이지 컴포넌트 등), 시작 흐름 5 단계 명시. 다음 세션 Claude 가 박스만 보고 Phase 4 점검·설계부터 즉시 시작 가능.
- 메모리 2종 신규 (PC: `C:\Users\chant\.claude\projects\E--AI-Work-krivet-terminal-sim\memory\`):
  - `feedback_working_history.md` — Working_history.md 가 정본 인수인계 문서, timestamp 파이썬 호출 규칙, 메타박스 "현재 단계" 진실값, 진입 프롬프트 stale-free 설계, 작업/검증 entry 분리 패턴.
  - `feedback_push_workflow.md` — main 직접 푸시는 사용자 명시 허락마다 필요(이전 허락 standing 아님), Pages 빌드 폴링(보통 25~30초, 가끔 2~3분) → 자산 grep 검증 → verification entry 별도 커밋의 2단 사이클.
- `MEMORY.md` 인덱스 3 항목으로 갱신.
- 향후 Phase 4 가 끝나면: 진입 프롬프트 박스의 "다음 작업" 섹션을 갱신/제거(stale 방지), 메타박스 "현재 단계" 라인은 자연스럽게 Phase 5 로.

---

## [2026-05-11 17:32:18] Phase 3 푸시 + 라이브 자산 키워드 검증

- 사용자 결정: "메인 푸시 진행"
- `git push origin main`: `3ff0155..714c9ca  main -> main` 성공
- Pages 빌드 폴링: poll 1 `building` → poll 2 (10초 후) `built` · duration 23,488 ms (~23초)
- 라이브 자산 GET (9 URL × 200): index.html, css/special.css, js/special/parallel-terminals.js, js/main.js, js/mission/mission-loader.js, js/terminal/terminal.js, js/panel.js, data/chapters.json, data/missions/ch1-m2-parallel.json
- 키워드 노출 확인:
  - parallel-terminals.js — `class ParallelTerminals`, `startAll`, `destroy`
  - terminal.js — `readOnly` 옵션, mount의 `if (this.readOnly) return`
  - main.js — `import { ParallelTerminals } from './special/parallel-terminals.js'`, `startParallelMission`, `mission.special?.kind === 'parallel'` 분기
  - panel.js — `mission:start` 의 `special` 받기, `renderActive` 의 `special` 분기
  - chapters.json — ch1-m2 keys=['title','summary'] (placeholder 키 부재)
  - ch1-m2 미션 JSON — special.kind='parallel', terminals 2개 × 9 라인 script
- 알려진 정적 어색함 (자질구레, 보정 가능): `index.html` 의 footer-hint 가 "💬 다음 미션 예고: 두 개의 터미널, 두 배의 속도" 로 고정 — 미션 2가 활성된 지금은 더 이상 미래형이 아님. 동적 갱신(현재 미션 다음 미션으로 표시) 또는 라벨 변경으로 추후 폴리시.
- 사람 눈 검증은 사용자가 직접 (라이브 URL 의 미션 2 진입 + 시작 + 동시 진행 + 완료 모달).

---

## [2026-05-11 17:28:33] Phase 3 — 미션 2 `ch1-m2-parallel` 병렬 터미널 구현

- 사용자 결정 (AskUserQuestion): "Phase 3 미션 2 병렬 터미널 (추천)"
- 시나리오 설계: 좌 터미널 A 는 `pandoc 2024_직업역량_보고서_초안.md -o 보고서.docx --reference-doc=KRIVET_template.docx`, 우 터미널 B 는 `7z a -t7z .\백업\연구_백업_20260511.7z .\*.md .\*.csv .\*.bib`. 둘 다 typing 애니메이션(cps 45 + 55) 으로 거의 같은 시간에 진행, 끝나면 한 번에 완료 모달.
- 신규 파일:
  - `js/special/parallel-terminals.js` — `ParallelTerminals` 클래스 (mount/startAll/destroy). 각 sub-terminal 은 `Terminal` 인스턴스를 `readOnly: true` 로 마운트. `Promise.all` 로 두 `printScript` 병렬 실행, 끝나면 `mission:completed` emit.
  - `css/special.css` — `.parallel-terminals` flex row + gap, `.parallel-sub` flex column, `.parallel-sub-label` (모노 dim 헤더), 모바일(≤900px) 세로 스택.
  - `data/missions/ch1-m2-parallel.json` — `special.kind: "parallel"` + `config.terminals[2]` 각각 9 라인 script + completion.reflection 4 bullets.
- 코드 일반화 변경:
  - `js/terminal/terminal.js` — constructor 에 `readOnly` 옵션. readOnly 면 mount 후 `ensureRootClickFocus`/`focus` 안 부르고, `render` 에서 promptLine + 환영 두 줄을 만들지 않으며, `attachPromptLine` 도 no-op. 향후 다른 자동 시연 미션에도 재사용 가능.
  - `js/mission/mission-loader.js` — `REQUIRED` → `REQUIRED_BASE`(steps 제외). `mission.special` 있으면 `special.kind` 만 검증, steps 검증 스킵.
  - `js/main.js` — `loadMission`/`ParallelTerminals`/`updateProgress` import, 모듈 상태 `parallelTerminals` 추가. `startCurrentMission` 이 mission 로드 후 `mission.special?.kind === 'parallel'` 분기 → `startParallelMission(mission)`. 신규 함수가 `.app-terminal` 에 `ParallelTerminals` 마운트하고 `setTimeout 400ms` 후 `startAll` 호출(분할 레이아웃 시각 인식 텀). `route:changed` 핸들러에서 `parallelTerminals.destroy()` 정리.
  - `js/panel.js` — `mission:start` 페이로드에 `special` 받아 `currentCtx.special` 저장. `renderActive` 에서 `special` 이면 "🚀 자동 진행 중" 카드(step 안내 대체). `mission.steps?.[stepIndex]` 옵셔널 체이닝.
  - `index.html` — `./css/special.css` link 추가.
- 데이터:
  - `data/chapters.json` — `ch1-m2-parallel.placeholder: true` 제거 → 자동 활성화 + 사이드바에 idle 패널 "미션 시작" 버튼 노출.
- 검증 (로컬 5500): JSON parse OK (special.kind=parallel, terminals 2 × 9 lines), chapters.json keys=['title','summary'] (placeholder 없음), 7개 자산 모두 200, 신규 코드 키워드(parallel-terminals.js의 ParallelTerminals/startAll, terminal.js의 readOnly, mission-loader.js의 REQUIRED_BASE, main.js의 startParallelMission, panel.js의 special) 노출.
- 미수행 (의도적, 사용자 시연 위임): 두 터미널의 typing 동기, completion 모달이 두 작업 모두 끝난 후에만 뜨는지, 좁은 화면(≤900px) 에서 세로 스택, 미션 2 → 미션 3 이동 시 parallel destroy.
- Ch.1 (m1·m2) 가 모두 활성으로 끝남. 다음 결정: Phase 4(미션 4 오토컴팩트) / Phase 5(미션 5 IDE 모형) / 폴리시.

---

## [2026-05-11 17:15:35] 미션 3 GUI 비교 카피 정정 — 사실관계 보정

- 사용자 검토 지적: "폴더를 통째로 다 읽는다는 표현은 틀린 것 같은데?"
- 검토 결과 동의: 채팅 GUI(Claude.ai 등) 는 사실 폴더를 통째로 못 읽음. 파일 단위 업로드만 가능하고, 도구가 자동으로 청크/요약을 하기 때문에 **실제 문제는 "통째로 읽어 토큰을 낭비"가 아니라 "어떻게 처리됐는지 사용자가 볼 수 없는 불투명성"**. "~6배 토큰" 같은 정량 비교도 근거 약함.
- 학습 포인트 핵심(CLI = 정확한 지정 + 토큰 변화 가시화 / GUI = 불투명)은 유지하고, 사실에 맞는 표현으로 교체. 3 군데 수정 (`data/missions/ch2-m3-gui-vs-cli.json`):
  - **step-mention-multi tip 라벨**: "여러 파일 vs 폴더 통째로" → "여러 파일 명시 vs 폴더 한 번에"
  - **step-mention-multi tip 본문**: "'GUI 가 폴더를 통째로 읽어버리는' 모드와 같아져요" 부분 제거, "'필요한 만큼만' 의 원칙을 잃지 마세요" 로 결말 교체
  - **step-mention-multi 출력 dim 비교**: 기존 "GUI 에서 '폴더를 봐줘'…같은 작업에 ~6배 토큰" → "채팅 GUI 에서는 파일을 첨부해도 도구가 어떻게 잘라/요약해 읽었는지 사용자가 알 수 없습니다. CLI 는 추가 토큰이 +71,200 처럼 즉시 표시돼 통제할 수 있어요."
  - **reflection bullet 3**: "GUI 가 폴더를 통째로 읽어 토큰을 낭비하는 동안, CLI 는 필요한 파일만 정확히 짚어 같은 작업을 더 싸게 끝냅니다." → "`@파일명` 으로 무엇을 어디까지 컨텍스트에 넣을지 사용자가 직접 통제하고, 추가된 토큰이 즉시 표시됩니다. 채팅 GUI 는 첨부한 파일을 도구가 어떻게 잘라/요약해 처리했는지 보이지 않아 의도와 실제가 일치하는지 확인하기 어렵습니다."
- 검증: `python json.load` parse OK, `grep -E "폴더 통째|6배 토큰|모든 파일을 읽"` 으로 잔존 부정확 표현 없음 확인.
- 과거 [16:55:47] entry 본문에는 "GUI 폴더 통째로 → ~6배 토큰" 메모가 남아있는데, 그건 그 시점 기록이라 보정하지 않음 — 이 정정 entry가 진실값.

---

## [2026-05-11 17:03:58] 미션 3 확장 푸시 + 라이브 자산 키워드 검증

- 사용자 결정: "푸시 진행" (직전 호환성 우려에 대해 "본인 외 접속자 없어 무시 가능"으로 정리 후)
- `git push origin main`: `5522096..e4a8fd3  main -> main` 성공
- Pages 빌드 폴링: 13회(10초 간격), duration **165,640 ms (~166초)** — 평소 25~30초 대비 길었지만 정상 `built`. (긴 이유는 빌드 큐 혼잡 가능성)
- 라이브 자산 GET + grep (4 URL × 200):
  - `/js/terminal/shell-prompt.js` — `kind === 'claude'` 분기 노출
  - `/js/terminal/terminal.js` — `setPrompt({ cwd, kind })`, `refreshTitlebar()`, `'Claude Code'` 라벨 모두 노출
  - `/js/mission/mission-engine.js` — `applyEffects`, `effects.setShell`, `terminal.refreshTitlebar` 호출 노출
  - `/data/missions/ch2-m3-gui-vs-cli.json` — steps 6개(`step-launch-claude`, …, `step-mention-multi`), step 0 effects=`{setShell: {kind: 'claude', cwd: 'C:\\KRIVET\\연구'}}`, alias 셋 모두 정상 직렬화
- 사람 눈 검증은 사용자가 직접: <https://dongchan.github.io/krivet-terminal-sim/#ch2/ch2-m3-gui-vs-cli>. 본인 브라우저는 5 step 버전 잔여 진행 상태가 있을 수 있으니 우측 상단 **[처음부터]** 또는 시크릿 창으로 step 0 부터 진입 권장.

---

## [2026-05-11 16:55:47] 미션 3 확장: `@` 멘션 step 2개 + `claude` 접속 step 0 + 셸 전환 효과

- 사용자 요청 (두 단계, 같은 흐름으로 묶음):
  - (1) "터미널의 장점 중 하나가 `@` 기호 사용인데, 단일 파일과 여러개 파일을 지정해서 사용자가 의도한 대로 작업을 수행할 수 있다는 것. GUI는 지정을 못하니까 전체 파일을 다 읽어서 토큰 비효율적이잖아."
  - (2) "미션3의 경우, 터미널에서 클로드 코드 같은 cli를 썼을 때 나오는 기능인데, 마치 터미널에서 다 되는 건줄 알겠어. 클로드 코드를 예제로 만들 수 있어? 클로드 코드에 접속하는 경험도 같이 할 수 있도록."
- 문제 진단: 현재 미션 3가 PowerShell prompt에서 `/status` 등을 받기 때문에 사용자가 "이건 PowerShell 의 기본 기능"으로 오해할 위험. 그리고 `@` 멘션의 토큰 효율 이점이 미션에서 누락됨.
- 설계: 미션 3을 3 step → **6 step** 으로 확장.
  - `step-launch-claude` (신규) — PowerShell 에서 `claude` 입력 → 환영 출력 + **셸 전환**(prompt `PS …> ` → `> `, titlebar 'PowerShell · KRIVET\\연구' → 'Claude Code · KRIVET\\연구')
  - `/status` · `/context` · `/cost` — 기존 (단, 첫 instruction에 "프롬프트가 바뀌었나요? 이제 Claude Code 안" 환기)
  - `step-mention-single` (신규) — `@2024_직업역량_보고서_초안.md` → +14,200 tok, 정확히 한 파일만 컨텍스트
  - `step-mention-multi` (신규) — `@설문조사_원본.csv @참고문헌.bib` → 두 파일 합 +74,380 tok, dim 비교 "GUI 폴더 통째로 → ~6배 토큰"
- 데이터-only 원칙은 한 번 깨고 코드 일반화 추가(향후 재사용 가능한 **step effects 슬롯** 신설):
  - `js/terminal/shell-prompt.js`: `kind === 'claude'` → `'> '` 분기 1줄
  - `js/terminal/terminal.js`:
    - `labelForShell`: `'claude'` → `'Claude Code'` 분기 1줄
    - `setPrompt({ cwd, kind })`: kind 옵션도 받도록 확장
    - `refreshTitlebar()` 메서드 신설 — titlebar의 lastElementChild span text를 셸/cwd 기반으로 갱신 (DOM 부분 갱신, remount 불필요해 출력 보존)
  - `js/mission/mission-engine.js`:
    - `applyEffects(effects, terminal)` 신설 — 현재는 `effects.setShell` 만 처리 (`terminal.setPrompt(...)` + `terminal.refreshTitlebar()`). 향후 다른 효과(예: `setCwd`, `addBadge`)도 같은 슬롯에서 확장 가능.
    - `handleInput` 의 success 경로에서 `printScript` 후 `applyEffects` 호출, 그 다음 `advance`
- 데이터 (`data/missions/ch2-m3-gui-vs-cli.json`):
  - intro headline 변경 ("PowerShell 에서 Claude Code 로 — 채팅 GUI 가 못 하는 일들"), bodyMarkdown에 ④(@멘션) 추가, 첫 step 위주로 흐름 안내
  - title 보강: "미션 3 · GUI에서는 안 보이는 것 (그리고 못 고르는 것)"
  - reflection bullets 4개로 확장 (PowerShell → claude 셸 전환 메커니즘 / 슬래시 노출 / `@` 멘션 절약 / `/context` 습관)
  - estimatedMinutes 5 → 8
- 알려진 호환성 이슈 (의도적, 사용자 수가 적어 무시 가능):
  - 기존 사용자가 5 step 버전 미션 3을 진행 중이었다면 새 6 step 의 중간 step부터 재개될 수 있음. `mission-engine.loadAndStart` 의 `stepIndex >= length` 가드는 작동(=완료자는 reset). idle/재시작은 정상.
- 검증 (로컬 5500 서버):
  - JSON parse OK, steps 6개, alias 셋 모두 의도대로 (`['claude']`, 슬래시 셋, `@` 단일·다중)
  - `shell-prompt.js` / `terminal.js` / `mission-engine.js` 본문에 신규 키워드(`'claude'`, `refreshTitlebar`, `applyEffects`, `setShell`) 모두 노출
- 미수행 (의도적): 사람 눈 검증. 라이브 푸시 후 사용자가 셸 전환 시각 효과(`PS …> ` → `> `, titlebar 변화)를 직접 확인.

---

## [2026-05-11 16:48:06] 입력 UX 패치 푸시 + 라이브 자산 키워드 확인

- `git push origin main`: `deb43b1..5522096  main -> main` 성공
- Pages 빌드 폴링: poll 1 `building` → poll 2 (10초 후) `built` — duration 30,803 ms (~31초)
- 라이브 자산 GET + grep:
  - `/css/terminal.css` 200, 본문에 `.term-prompt-line`·`.term-prompt-line:focus-within`·`.term-input::placeholder` 셋 다 존재
  - `/js/terminal/terminal.js` 200, 본문에 `ensureRootClickFocus`·`여기에 명령을 입력하고 Enter` 존재
- 사람 눈 검증은 사용자가 라이브 URL(<https://dongchan.github.io/krivet-terminal-sim/>) 에서 직접 진행 예정. 캐시 무시하려면 Ctrl+F5 또는 시크릿 창.

---

## [2026-05-11 16:46:06] 터미널 입력 UX 보강: prompt-line 강조 + 클릭 자동 포커스 + placeholder

- 사용자 신고: "실습창 하단 명령어 입력 부분을 하이라이트 해주던가 해야겠어. 다른데 클릭하면 커서가 없어지는데, 어디에 뭘 입력해야 할지 헷갈리겠어."
- 원인 분석: `.term-input`은 native input이라 `caret-color`는 포커스가 있을 때만 보임. 사용자가 패널/타이틀바/출력 영역을 클릭하면 input이 blur → 캐럿 사라짐 → 입력 위치 시각 신호 0.
- 설계 결정 (두 가지 동시 적용):
  - **항상 보이는 입력 줄 신호** — `.term-prompt-line` 에 좌측 2px 액션블루 보더 + 옅은 액션블루 배경(`rgba(74,144,226,0.06)`) + `:focus-within` 시 더 진한 배경(`0.14`). 포커스 잃어도 "여기가 입력 줄"이 항상 인식됨.
  - **터미널 영역 어디든 클릭 → 자동 포커스** — `Terminal.ensureRootClickFocus()` 신설, `this.root` 에 click 리스너 한 번만 부착(`_rootClickAttached` 가드). 입력 자체 클릭은 native가 처리(early return), 사용자가 출력 텍스트를 드래그 선택한 직후(`window.getSelection().toString().length > 0`)에는 포커스 가로채지 않음.
  - **placeholder 안내** — input에 `placeholder="여기에 명령을 입력하고 Enter"` 추가, 입력 시작하면 자동 사라짐.
- 1차 시도/회전: `mousedown` 이벤트로 구현했다가, 사용자가 출력 텍스트 드래그 선택을 시작할 때 mousedown 시점엔 selection이 비어있어 가로채일 가능성을 발견 → `click` 이벤트(mouseup 후 발생, selection 확정 시점)로 변경.
- 수정 파일:
  - `css/terminal.css`: `.term-prompt-line` 에 padding/border-left/background/transition, `.term-prompt-line:focus-within`, `.term-input::placeholder` 추가
  - `js/terminal/terminal.js`: `mount()` 에서 `ensureRootClickFocus()` 호출, 신규 메서드 추가, `makePromptLine()` 의 input 속성에 `placeholder` 추가
- 검증 (로컬): `css/terminal.css`, `js/terminal/terminal.js` 모두 200 (`http://127.0.0.1:5500/`), 파일 내용에 변경 반영 확인. UI/UX 결함이 핵심이라 실제 시연 검증은 라이브 푸시 후 사용자가 진행 예정.

---

## [2026-05-11 16:39:37] Phase 2 푸시 + 라이브 검증

- 사용자 결정: "메인 직접 푸시" — Auto mode classifier가 main 직푸시를 1차 차단했으나, 이 프로젝트의 기존 패턴(a25885e → f6e8eed → 2006970 모두 main 직푸시)에 따라 명시 허락 후 진행.
- `git push origin main`: `2006970..7c1b4cd  main -> main` 성공.
- Pages 빌드 폴링 (`gh api .../pages/builds/latest`):
  - poll 1 즉시: `building` (commit=7c1b4cd)
  - poll 2 (10초 후): `built` — duration 25,390 ms (~25초)
- 라이브 URL 검증 (`curl -s -o /dev/null -w` + `python -c "json.load(...)"`):
  - <https://dongchan.github.io/krivet-terminal-sim/> → 200
  - <https://dongchan.github.io/krivet-terminal-sim/data/chapters.json> → 200, ch2-m3 메타에서 `placeholder` 키 사라짐 확인
  - <https://dongchan.github.io/krivet-terminal-sim/data/missions/ch2-m3-gui-vs-cli.json> → 200, id/chapterId/3 steps/별칭 셋 모두 정상 직렬화
- 결과: Ch.2 첫 미션이 라이브에서 placeholder가 아니라 정상 활성 미션으로 보임. `#ch2/ch2-m3-gui-vs-cli` 해시로 직접 진입 가능.
- 미수행: 사람 눈 검증(브라우저에서 실제 미션 진입 → /status·/context·/cost 입력 → 출력 시퀀스 확인). 사용자가 라이브 URL에서 직접 시연 후 피드백을 줄 예정.

---

## [2026-05-11 16:35:34] Phase 2 — 미션 3 `ch2-m3-gui-vs-cli` 데이터-only 추가

- 사용자 결정 (AskUserQuestion): "Phase 2: 미션 3 데이터-only 확장 (추천)"
- 목표: Phase 1 인프라(Terminal/MissionEngine/스키마)가 새 미션을 데이터 추가만으로 수용하는지 검증 — 코드 0줄 수정 원칙.
- 시나리오 설계 (Ch.2 첫 미션, "Claude Code에서만 보이는 메타 정보"):
  - step 1 `/status` — 모델·계정·워크스페이스·세션 나이·컨텍스트 % 요약
  - step 2 `/context` — ASCII 게이지 + 구성 항목(system prompt / loaded files / conversation / reserve) 분해
  - step 3 `/cost` — input/output 토큰 분리, cache hit, 누적 비용, burn rate
  - 학습 포인트: Claude.ai 같은 GUI는 모델/잔량/비용을 숨김 → CLI는 즉시 노출 → 응답이 이상해지면 `/context` 먼저 보는 습관.
- 셸 설정: `shell.kind: "powershell"` 유지 (shell-prompt.js 건드리면 데이터-only 원칙 깨짐). intro에서 "이미 `claude` 실행해 Claude Code 세션 안에 들어와 있다"고 가정 명시.
- 슬래시 명령은 글로벌 화이트리스트(`whoami/pwd/date/echo/cls/clear/help`)와 충돌 없음 — `matchGlobal`은 head 토큰 lookup이라 `/`로 시작하면 매칭 안됨. 별칭은 `/status` + `status` 둘 다 허용(슬래시 망각 대비).
- 출력 line type: `blank` / `system` / `line` / `dim` 사용 (모두 renderer.js + terminal.css에 이미 정의됨, 신규 type 0).
- 수정 파일:
  - `data/missions/ch2-m3-gui-vs-cli.json` (신규, 3 step + intro + reflection + 각 step에 `tip` 카드)
  - `data/chapters.json`: 미션 3의 `"placeholder": true` 한 줄만 제거 → idle 패널이 "🚧 곧 공개 예정"에서 정상 활성 미션으로 자동 전환 (`js/main.js`의 `isPlaceholder()` 가드가 데이터 기반이라 코드 변경 불필요).
- 검증 (데이터-only라 UI 회귀 생략, 스키마+HTTP만):
  - `python -c "import json; ..."` → JSON parse OK, steps=3, alias 셋 모두 확인, ch2-m3 placeholder='absent'
  - 로컬 서버 (`python -m http.server 5500 --bind 127.0.0.1`, Bash ID `bmy93c8mi`):
    - `/data/chapters.json` → 200
    - `/data/missions/ch2-m3-gui-vs-cli.json` → 200
    - `/data/missions/ch1-m1-direct-read.json` → 200 (회귀 없음)
    - `/` → 200
- 결과: 코드 0줄 수정, 데이터 2 파일(1신규 + 1수정)만으로 새 미션 1개 추가 완료. Phase 2 검증 가설("미션 1 인프라는 데이터-only 확장 가능") 입증.
- 미수행 (의도적): 미션 4(`ch2-m4-autocompact`), 미션 2(`ch1-m2-parallel`), 미션 5(`ch3-m5-ide-mock`)는 placeholder 유지 — 각각 special 컴포넌트 필요해 데이터-only로 불가.

---

## [2026-05-11 16:29:25] 인수인계 문서 경로 규칙 상대 경로화 (PC 이동 대응)

- 배경: 작업 PC가 바뀌면 프로젝트 루트가 `D:\AI_Work\Claude\Terminal_Sim` (이전 PC) ↔ `E:\AI_Work\krivet-terminal-sim` (현재 PC)로 달라짐. 프로젝트명은 동일하므로 절대 경로 대신 상대 경로(`./...`)로 통일하기로 결정.
- 사용자 결정: "다른 PC에서 작업할 때는 D:, 현재 작업 PC에서는 E:니까 상대 주소로 하면 되겠다. 프로젝트 명은 같으니까 말이야."
- 수정 (Working_history.md):
  - 헤더 메타 박스 "계획 정본" 라인: 절대 경로 → `./Plan_sim_v.1.0.md`, Claude Plan 사본은 PC마다 `~/.claude/plans/` 아래로 일반화
  - 헤더 메타 박스에 "경로 규칙" 라인 신설 — 향후 entry/문서 작성 시 절대 경로 박지 말 것을 명시
  - 진입 프롬프트 박스 1행: `D:\AI_Work\Claude\Terminal_Sim 프로젝트를 이어서 진행합니다` → `krivet-terminal-sim 프로젝트(현재 작업 폴더의 루트, PC에 따라 D:\... 또는 E:\... 등)`
  - 진입 프롬프트 박스 1번 항목: `D:\AI_Work\Claude\Terminal_Sim\Working_history.md` → `./Working_history.md`
- 과거 entries(현 entry 아래 모든 항목)는 그 시점의 사실 기록이므로 보정하지 않음. 이후 새로 추가되는 entry는 상대 경로 규칙 따름.
- git 환경 메모: 새 PC에서 `git config --global --add safe.directory E:/AI_Work/krivet-terminal-sim` 1회 실행해 dubious ownership 경고 해제 완료.
- 메모리: `feedback_path_convention.md` 신규 저장 (`MEMORY.md` 인덱스 갱신) — 새 세션도 이 규칙을 자동 로드.

---

## [2026-05-11 12:07:51] 전환 픽스 커밋 + 푸시 + 라이브 검증

- 사용자 요청: "기록하고, 다음 세션 프롬프트 입력하고, 커밋하고 푸쉬."
- 진입 프롬프트 섹션은 stale-free 설계라 본문 수정 없음. 메타박스 "현재 단계" 라인만 갱신("미션 전환 UX 보정" 추가).
- staged 변경(6 파일):
  - `M .gitignore` (live-*.png 패턴 추가)
  - `M Working_history.md`, `M css/panel.css`, `M data/chapters.json`, `M js/main.js`, `M js/panel.js`
  - `live-pages.png` 는 새 .gitignore 패턴으로 자동 제외 — 빈 검증 산출물이 staging에 끼지 않음
- `git commit` (HEREDOC): **commit `f6e8eed`** — 6 files / +170/-6, 한국어 메시지 + `Co-Authored-By`
- `git push origin main`: `a25885e..f6e8eed  main -> main` 성공
- Pages 빌드 폴링:
  - poll 1: building (sha=f6e8eed)
  - poll 2: building
  - poll 3: **built** (10초 간격 폴링, ~20초 만에 완료)
- 라이브 URL 검증: <https://dongchan.github.io/krivet-terminal-sim/#ch1/ch1-m2-parallel>
  - `.panel-placeholder` DOM 존재, label = "🚧 곧 공개 예정"
  - 미션 1 (`/#` 또는 hash 없음)으로 가면 정상 활성 미션 표시, 미션 2~5 hash는 placeholder 카드
- 결과: 사용자가 신고한 두 UX 결함(미션 전환 잔재 + 미션 2 데드엔드) 모두 라이브에서 해결. 작업 종료.

---

## [2026-05-11 12:05:15] 미션 전환 UX 보정: 터미널 clear + placeholder 카드

- 사용자 발견: "우측 터미널이 어딨어?" — 미션 1 완료 후 "다음 미션으로" 클릭 시 미션 2로 라우팅됐는데 ① 미션 1 출력 잔재 그대로 ② 미션 2 JSON 없어 "미션 시작" 누르면 alert ③ 캐럿 focus 잃음.
- 사용자 결정 (AskUserQuestion): "전환 시 clear + Placeholder 안내 (추천)"
- 수정 파일:
  - `js/main.js`:
    - `bindMissionEvents()` 에 `on('route:changed', ...)` 추가 — 미션 전환 시 `terminal.mount()` 재호출(전체 reset)하고 idle 안내 메시지 + focus 재부착. 진행 중인 미션이 있으면 `engine.mission = null` 로 끊어줌.
    - `startCurrentMission()` 에 `isPlaceholder(missionId)` 가드 추가 — placeholder 미션 시작 차단, "준비 중" alert.
    - `isPlaceholder()` 헬퍼 신설 — chapter.missionMeta[id].placeholder 확인.
  - `data/chapters.json`: 미션 2, 3, 4, 5의 missionMeta에 `"placeholder": true` 플래그 추가. 미션 1만 placeholder 없음 = 활성.
  - `js/panel.js` `renderIdle()`: meta.placeholder 이면 `.panel-placeholder` 카드("🚧 곧 공개 예정") + `btn-primary[disabled]` "미션 시작 (준비 중)" 만 렌더. 건너뛰기 버튼은 숨김.
  - `css/panel.css`: `.btn-primary:disabled` (회색 배경 + not-allowed 커서), `.panel-placeholder` (점선 + 액션블루 좌측 보더 + bg-sub 배경), `.panel-placeholder-label` 추가.
- 검증: Playwright로 <http://localhost:5500/#ch1/ch1-m2-parallel> 직접 이동 → 좌측 placeholder 카드 + disabled 버튼, 우측 터미널 clear + 인사 메시지만(미션 1 잔재 사라짐) 확인 (`phase1-placeholder.png`).
- 향후 Phase 3에서 미션 2 JSON을 만들 때는 `chapters.json` 에서 미션 2의 `placeholder: true` 한 줄만 제거하면 자동 활성화 — 데이터-only 확장 유지.

---

## [2026-05-11 11:57:43] 다음 세션 진입 프롬프트 추가

- 사용자 요청: "클리어 후, 다음 세션에서 입력해야 할 프롬프트를 작성해서 Working_history.md 에 넣자. 세션 시작하면 바로 실행할 수 있게."
- 결정 사항:
  - Working_history.md 상단(헤더 메타 박스 직후, 모든 entry 앞)에 고정 섹션으로 배치 → 새 세션 Claude가 가장 먼저 보게 됨
  - "역순 entry 규칙"의 예외임을 섹션 제목과 메타 박스 양쪽에 명시
  - 프롬프트는 코드블록으로 감싸 복사 용이성 확보
  - "현재 상태"는 프롬프트에 박지 않고 "Working_history.md 메타 박스를 진실값으로 따르라"로 위임 → stale 방지
- 헤더 메타 박스에 "새 세션 시작 시 안내" 한 줄 추가
- 새 entry 본 항목은 역순 entry 규칙에 따라 메타박스/진입 프롬프트 다음 자리에 삽입

---

## [2026-05-11 11:55:31] GitHub Public 저장소 생성 + Pages 배포 완료

- 사용자 결정 (AskUserQuestion):
  - 저장소 공개 범위: **Public** (GitHub Free + Pages 무료 활성화를 위한 선택)
  - git commit identity: `Dongchan` / `chan.tangentbeta@gmail.com` / `--global`
- 환경 점검 (Bash 병렬):
  - `git --version` → 2.50.1.windows.1
  - `gh --version` → 2.83.2 (로그인 계정: `Dongchan`, scope: gist/read:org/repo/workflow, keyring 저장)
  - `git config user.name/email` → 글로벌·시스템 모두 미설정 (커밋 전 설정 필요)
- git config 글로벌 설정:
  - `user.name = Dongchan`
  - `user.email = chan.tangentbeta@gmail.com`
  - `init.defaultBranch = main`
- 신규 파일 작성:
  - `.gitignore` — OS/IDE/log/node_modules + `.playwright-mcp/`, `phase*.png` 제외
  - `.nojekyll` (빈 파일) — Jekyll 자동 처리 차단
  - `README.md` — 라이브 데모 링크, 로컬 실행법, 폴더 구조, 미션 추가 가이드, 디자인 톤 요약, MIT 라이선스 예고
- git 흐름:
  - `git init -b main` → main 브랜치로 빈 저장소 생성
  - 명시 파일 stage (`-A` 회피): `.gitignore .nojekyll README.md Plan_sim_v.1.0.md Working_history.md Requirement.md Reference_Folder index.html css js data`
  - LF→CRLF 경고 30여건 발생 — Windows 정상 동작, 무해
  - `git commit` (HEREDOC 사용): **commit `a25885e`** — 33 files / +2250 lines, 한국어 메시지 + `Co-Authored-By` 라인
- GitHub 저장소 생성 + push:
  - `gh repo create krivet-terminal-sim --public --source=. --remote=origin --description ... --push`
  - 결과: <https://github.com/Dongchan/krivet-terminal-sim>, `main → origin/main` 트래킹 설정
- GitHub Pages 활성화:
  - `gh api -X POST repos/Dongchan/krivet-terminal-sim/pages -f "source[branch]=main" -f "source[path]=/"`
  - 1차 시도 leading slash 사용 → Git Bash가 fs 경로로 변환해 실패. leading slash 제거 후 성공.
  - 응답: `html_url: https://dongchan.github.io/krivet-terminal-sim/`, `https_enforced: true`, `build_type: legacy`
- 라이브 URL 검증:
  - `gh api repos/.../pages/builds/latest --jq .status` → 1차 폴링 즉시 `built`
  - `curl` 응답 (5개 자산 모두 200):
    - `/` (index.html), `/data/chapters.json`, `/data/missions/ch1-m1-direct-read.json`, `/js/main.js`, `/css/tokens.css`
  - Playwright로 <https://dongchan.github.io/krivet-terminal-sim/> 접속 → 페이지 타이틀 OK, 콘솔 에러는 favicon 404 1건만(무해)
  - 캡처: `live-pages.png` — KRIVET 헤더, 좌측 idle 패널, 다크 터미널, 부드러운 흰색 도트, 푸터 모두 의도대로

---

## [2026-05-11 11:45:13] Working_history.md 운영 체계 도입

- 사용자 요청: 모든 작업을 Working_history.md에 빠짐없이 역순으로 기록. 매번 파이썬으로 timestamp 부여. 핵심 목적은 컴팩트/클리어 후 맥락 인수인계.
- 메모리 저장: `C:\Users\krivet\.claude\projects\D--AI-Work-Claude-Terminal-Sim\memory\feedback_working_history.md` 생성 + `MEMORY.md` 인덱스 갱신
- 새 파일 작성: `D:\AI_Work\Claude\Terminal_Sim\Working_history.md` (이 문서)
- 시간 획득 명령: `python -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))"` → `2026-05-11 11:45:13`

---

## [이전 세션, 정확한 timestamp 없음 — Working_history 도입 이전 작업] 미션 1 UI 폴리시: 터미널 도트 색 변경

- 사용자 피드백: "PowerShell · KRIVET\연구 옆에 있는 동그라미 세개는 잘 보이지도 않고, 흰색으로 바꾸던지 파란색으로 바꾸던지 하자."
- 결정: 부드러운 흰색 톤 채택
- 수정: `css/terminal.css` — `.term-dot { background: var(--term-fg-mute) }` (이전: `--term-bg-soft`)
- 검증: Playwright로 `.term-titlebar`만 부분 캡처 → `phase1-dots.png` 확인. #B8C3D1 톤이 다크 배경 위에서 명확히 보임.

## 미션 1 카피 조정: Windows 정통 dir/type 메인 + step.tip 추가

- 사용자 피드백: "ls는 맥용 커맨드잖아? 가능하면 윈도우 쪽으로 가자. 그리고 팁 같은 걸로 맥과 리눅스는 이런걸 써요 정도 표시해 주면 어떨까?"
- 결정: `dir`/`type` 메인 + `step.tip` 필드 추가 (매칭 별칭은 ls/dir·cat/type 모두 유지)
- 수정 파일:
  - `data/missions/ch1-m1-direct-read.json`:
    - step-ls: instruction을 `dir` 메인으로, hints 갱신, tip 추가(`macOS / Linux 사용자라면` + `ls`)
    - step-cat: instruction을 `type 2024_직업역량_보고서_초안.md` 메인으로, hints 갱신, tip 추가(`cat 파일명`)
  - `js/panel.js`: `step.tip` 있으면 메인 단계 카드 아래에 `.panel-tip` 렌더 추가
  - `css/panel.css`: `.panel-tip`(점선 + 회색 좌측 보더), `.panel-tip-label`, `.panel-tip code`(연한 회색 톤) 추가
- 검증: Playwright reload → step 1(dir) → dir 입력 → step 2(type) 흐름에서 두 카드의 시각 위계(메인=액션블루, 팁=회색) 명확.
- 스크린샷: `phase1-tip-step1.png`, `phase1-tip-step2.png`

## 미션 1 버그 픽스: 힌트 카운트 step 단위 리셋

- 검증 중 발견: step 1에서 2회 오답 후 ls 통과 → step 2 진입 시 패널에 "(오답 2회)" 힌트가 그대로 노출됨. step 누적이 아니라 미션 누적으로 처리되던 버그.
- 수정: `js/mission/mission-engine.js` `advance()` 에 `this.failures = 0` 추가 + `updateProgress({ failures: 0 })`로 저장.
- 검증: reload → step 1에서 2회 오답 후 ls → step 2 진입 시 `.panel-hint` 없음 확인(evaluate로 `hintPresent: false`).

## Phase 1 end-to-end 검증 (미션 1)

- Playwright 1920×1080 뷰포트로 수동 시나리오 실행:
  1. `localStorage.clear()` + reload → idle 상태(미션 시작 버튼 노출)
  2. "미션 시작" 클릭 → 미션 1 step 1 진입 (좌측 패널 업데이트, 터미널 재마운트)
  3. `xyz`, `foo` 입력 → 빨강 에러 출력 + 오답 2회에서 힌트1 등장 (`phase1-hint.png`)
  4. `ls` 입력 → 디렉터리 출력 + step 2 진입 (`phase1-after-ls.png`)
  5. `cat 2024_직업역량_보고서_초안.md` 입력 → 타이핑 애니메이션 + 완료 모달 등장 (`phase1-complete.png`)
  6. localStorage 확인 → `progress.ch1-m1-direct-read.currentStepIndex: 1` 정상 영속
  7. reload → `maybeAutoStart()`로 step 2부터 재개 ("현재 단계 (2/2)" 확인)
- 콘솔 에러: favicon 404 외 없음.

## Phase 1 산출물: Terminal/Mission 컴포넌트 + 미션 1 데이터

- 새 파일:
  - `js/terminal/terminal.js` (Terminal 클래스: mount/print/printScript/clear/destroy)
  - `js/terminal/input.js` (키 핸들러: Enter, ↑/↓ 히스토리, Ctrl+L clear, Ctrl+C abort)
  - `js/terminal/renderer.js` (라인 출력, 타이핑 애니메이션 cps 기반, prefers-reduced-motion 대응)
  - `js/terminal/command-matcher.js` (matchCommand + matchGlobal 화이트리스트: whoami/pwd/date/echo/cls/clear/help)
  - `js/terminal/shell-prompt.js` (formatPrompt: powershell/bash)
  - `js/mission/mission-engine.js` (MissionEngine: loadAndStart/handleInput/advance/complete)
  - `js/mission/mission-loader.js` (loadMission/loadFixture + 스키마 검증)
  - `js/mission/hint.js` (afterFailures 기반 힌트 선택)
  - `js/mission/validators.js` (evaluateStep 래퍼)
  - `css/mission-overlay.css` (완료 모달: 다크 오버레이, 카드, 회고 bullets, 액션 버튼)
  - `data/missions/ch1-m1-direct-read.json` (미션 1: ls/cat 두 step, 힌트 단계화, reflection)
  - `data/fs-fixtures/workspace.json` (가짜 파일트리: 보고서·CSV·bib 3개)
- 수정 파일:
  - `js/main.js`: Terminal 부트 + MissionEngine 연결, `bindGlobalUI`(start/skip/next/close 버튼 위임), `bindMissionEvents`(completed → 오버레이), `maybeAutoStart`(in_progress 상태 복원)
  - `js/panel.js`: idle/active 두 렌더 모드, `mission:start`/`mission:step-changed` 구독, 인라인 코드 박스 렌더
  - `index.html`: 정적 터미널 마크업 제거(Terminal이 동적 렌더), `mission-overlay.css` 로드 추가
- 폴더 생성: `js/terminal/`, `js/mission/`, `data/missions/`, `data/fs-fixtures/`

## Phase 0 폴리시: 슈퍼와이드 화면 대응

- 사용자 결정: "터미널 내부만 max-width로 제한 (추천)" — 1000px
- 수정: `css/terminal.css` — `.term-window`에 `max-width: 1000px` 추가
- 효과: 1920+ 화면에서 콘텐츠는 좌측 1000px 안, 다크 배경은 우측까지 유지(듀얼 컬러 의도 보존)
- 검증: Playwright 1920×1080 캡처(`phase0-1920-maxwidth.png`)

## Phase 0 검증 (Playwright)

- Bash로 로컬 서버 백그라운드 실행: `cd "D:/AI_Work/Claude/Terminal_Sim" && python -m http.server 5500` (ID: becnmuyej, 포트 5500)
- HTTP 응답 확인: `/`, `/data/chapters.json`, `/js/main.js`, `/css/tokens.css` 모두 200
- Playwright 1440×900 캡처(`phase0-1440.png`) — 정상 동작 확인
- Playwright 1920×1080 캡처(`phase0-1920.png`) — `.app`이 풀 너비 정상
- 사용자가 자신의 화면에서 "오른쪽 여백 너무 많아 보임" 피드백 → 트레이 아이콘 위치로 보아 데스크톱 배경임이 확인됨

## Phase 0 산출물: 골격 + 디자인 토큰

- 새 파일:
  - `css/tokens.css` (KRIVET 컬러 토큰, 폰트, 사이즈, 공간, 헤더/푸터 높이 등)
  - `css/reset.css` (미니멀 reset)
  - `css/layout.css` (3분할 그리드, 헤더/푸터/패널/터미널 영역, 모바일 ≤900px 세로 스택)
  - `css/panel.css` (패널 카드, 단계, 힌트, 액션 버튼)
  - `css/terminal.css` (다크 터미널, 타이틀바, 캐럿 깜빡임, prefers-reduced-motion)
  - `js/utils/dom.js` (`$`, `$$`, `el`, `clear`)
  - `js/utils/events.js` (`on`/`off`/`emit` pub-sub)
  - `js/state.js` (defaultState, load, scheduleSave, getState, setCurrent, updateProgress, resetAll; localStorage 키 `krivet.terminalSim.v1` 디바운스 500ms)
  - `js/router.js` (hashchange 기반 chapterId/missionId 해석)
  - `js/progress.js` (상단 진행률 도트/세퍼레이터/카운트 렌더)
  - `js/panel.js` (idle 상태 패널 렌더)
  - `js/main.js` (boot: chapters 로드 → 진행률/패널/라우터 초기화)
  - `data/chapters.json` (3 챕터 + 5 미션 메타: title/summary/missionMeta)
  - `index.html` (3분할 그리드 마크업, Pretendard·D2Coding CDN, 정적 와이어프레임)
- 폴더 생성: `css/`, `js/`, `js/utils/`, `data/`

## 디자인 토큰 결정 (KRIVET 홈페이지 톤 반영)

- 사용자 결정 옵션: "둘 다 (Plan 표준 경로 + 작업 폴더 사본)" 등 모든 옵션에서 "추천" 선택
- WebFetch `https://krivet.re.kr/kor/index.do` 분석:
  - 시그니처 네이비 추정 #003366, 액션 밝은 파랑, 본문 다크그레이 #333333, 흰 배경
  - 거의 직각 모서리, 그림자 최소, 넓은 여백, 한글 sans-serif 굵은 가중치
- 채택 토큰(Plan_sim_v.1.0.md에 반영):
  - 시그니처: `#003366`(navy), `#4A90E2`(action), `#3A78C0`(hover)
  - 라이트 영역: bg `#FFFFFF`, sub `#F5F5F5`, border `#E5E5E5`, text `#333333`, mute `#666666`
  - 터미널: bg `#0F2238`, fg `#E8E8E8`, prompt `#4A90E2`, error `#E06C75`, system `#E5C07B`, dim `#7A8FA5`, mute `#B8C3D1`, bg-soft `#15314f`
  - 폰트: Pretendard(CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/...`) / D2Coding(jsdelivr) + Consolas fallback
  - 형태: 둥근 모서리 0~2px, 그림자 0 1px 2px rgba(0,0,0,0.04), 한글 자간 -0.01em
  - 듀얼 컬러 원칙: 라이트 패널/헤더 ↔ 다크 터미널 영역 ("일상 GUI ↔ CLI" 시각화)

## 계획 수립 (Plan_sim_v.1.0)

- 사용자 결정 (AskUserQuestion 5회 진행):
  - 학습 구조: **스토리형 챕터** (Ch.1~Ch.3, 미션 5개)
  - 기술 스택: **Vanilla HTML/CSS/JS**, 빌드 도구 없음
  - 터미널 충실도: **스크립티드** (정해진 명령만 인식)
  - 플랫폼: **Windows PowerShell 중심**
  - 미션 5 IDE 표현: **범용 IDE 디자인** (VSCode 상표 회피)
  - 미션 2 상호작용: **자동 진행 체험형** (둘 다 시작 버튼 한 번)
  - GitHub 저장소명: **krivet-terminal-sim**
  - 배포 방식: **main 브랜치 루트 직접 서빙**
  - git 작업 범위: **git init + .gitignore까지** Claude가 도움
  - 계획 파일 저장 위치: **둘 다** (.claude\plans 정본 + 작업 폴더 사본)
- Explore 에이전트로 `terminal-playground.netlify.app` + 작업 디렉토리 구조 조사
- Plan 에이전트로 구체 설계 (파일 구조, 미션 JSON 스키마, 핵심 컴포넌트 명세, 레이아웃, 특수 미션 처리, 확장성, 검증 방법, 단계별 구현 순서, 위험요소)
- 작성된 파일:
  - `C:\Users\krivet\.claude\plans\requirement-md-polymorphic-wozniak.md` (Plan 모드 정본)
  - `D:\AI_Work\Claude\Terminal_Sim\Plan_sim_v.1.0.md` (작업 폴더 사본, 사용자 요청 위치)
- GitHub Pages 핵심 제약 명시: 모든 fetch/asset 경로는 `./` 상대, `.nojekyll` 파일 루트에 둠
- 단계별 순서: Phase 0 → 1(MVP 분기점) → 2 → 3 → 4 → 5 → 6(폴리시) → D(배포) → 7(선택)
