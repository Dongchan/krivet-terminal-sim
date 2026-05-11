# KRIVET 터미널 시뮬레이터 (Plan_sim_v.1.0)

## Context (왜 만드는가)

KRIVET(한국직업능력연구원) 구성원(연구직·행정직)의 AI 활용 리터러시를 높이기 위해, "왜 터미널이 필요한가"를 비개발자도 체감할 수 있는 웹 기반 시뮬레이터를 만든다. 학습 흐름은 `Requirement.md`에 정의된 3단 서사를 따른다:

1. **왜 터미널인가?** — 파일 직접 R/W, 동시 병렬 작업.
2. **컨텍스트 윈도우의 이해** — Claude Code 기준으로 LLM이 왜 "바보가 되는지", 오토컴팩트, 세션 종료.
3. **터미널의 한계와 IDE로의 확장** — VSCode 같은 IDE가 왜 등장하는지.

레퍼런스 앱(<https://terminal-playground.netlify.app/>)의 게임형 UX(미션 + 진행률)를 빌리되, **단순 명령어 학습이 아니라 "왜?"를 체감시키는 서사**가 핵심이다.

## 확정된 설계 결정

| 항목 | 결정 |
|---|---|
| 학습 구조 | 스토리형 챕터 (Ch.1~Ch.3, 미션 5개) |
| 기술 스택 | Vanilla HTML/CSS/JS, 빌드 도구 없음 |
| 터미널 충실도 | 스크립티드 (정해진 명령만 인식, 미리 만든 출력) |
| 플랫폼 | Windows PowerShell 중심 (macOS 탭은 확장) |
| 언어 | 한국어 UI |
| 미션 5 IDE 표현 | 범용 IDE 디자인 (VSCode 상표 회피) |
| 미션 2 상호작용 | 자동 진행 체험형 ("둘 다 시작" 버튼 한 번) |
| 진행 저장 | `localStorage`, 키 `krivet.terminalSim.v1` |
| 배포 | GitHub Pages, `main` 브랜치 루트 직접 서빙 |
| 저장소명 | `krivet-terminal-sim` (URL: `https://{user}.github.io/krivet-terminal-sim/`) |

## 챕터·미션 구성

- **Ch.1 왜 터미널이 필요한가**
  - 미션 1 · 파일을 직접 읽어보기 (`ls` → `cat`)
  - 미션 2 · 두 개의 터미널, 두 배의 속도 (병렬 시연, 자동)
- **Ch.2 컨텍스트 윈도우의 이해**
  - 미션 3 · GUI에서는 안 보이는 것 (CLI에서 모델/토큰 확인)
  - 미션 4 · 오토컴팩트 시뮬레이션 (게이지 차오름 → 자동 압축)
- **Ch.3 터미널을 넘어 IDE로**
  - 미션 5 · 터미널 + 에디터를 한 화면에 (가짜 범용 IDE)

## 파일·폴더 구조

```
D:\AI_Work\Claude\Terminal_Sim\
├─ index.html                 # 진입점, 3분할 그리드 마크업
├─ README.md                  # 실행법 + 배포 안내 + KRIVET 동료용 미션 추가 가이드
├─ Plan_sim_v.1.0.md          # 이 계획서 (승인 후 복사)
├─ Requirement.md             # (기존)
├─ Reference_Folder\References.txt   # (기존)
├─ .gitignore                 # OS/IDE/임시 파일 무시
├─ .nojekyll                  # GitHub Pages가 _로 시작하는 파일/폴더를 차단하지 않도록
│
├─ css\
│   ├─ reset.css · tokens.css · layout.css
│   ├─ terminal.css · panel.css · mission-overlay.css
│   └─ special.css            # 병렬·오토컴팩트·IDE 모형 전용
│
├─ js\
│   ├─ main.js · state.js · router.js · progress.js · panel.js
│   ├─ terminal\
│   │   ├─ terminal.js        # Terminal 클래스 (입력·출력·히스토리)
│   │   ├─ input.js · renderer.js · command-matcher.js · shell-prompt.js
│   ├─ mission\
│   │   ├─ mission-engine.js · mission-loader.js · hint.js · validators.js
│   ├─ special\
│   │   ├─ parallel-terminals.js   # 미션 2
│   │   ├─ autocompact.js          # 미션 4
│   │   └─ ide-mock.js             # 미션 5 (범용 IDE)
│   └─ utils\
│       └─ dom.js · events.js · i18n.js
│
├─ data\
│   ├─ chapters.json
│   ├─ missions\
│   │   ├─ ch1-m1-direct-read.json
│   │   ├─ ch1-m2-parallel.json
│   │   ├─ ch2-m3-gui-vs-cli.json
│   │   ├─ ch2-m4-autocompact.json
│   │   └─ ch3-m5-ide-mock.json
│   ├─ fs-fixtures\workspace.json   # 가짜 파일트리
│   └─ i18n\ko.json
│
└─ assets\
    ├─ fonts\                       # D2Coding 또는 Pretendard (라이선스 확인)
    ├─ images\ui\ · images\ide-mock\
    └─ audio\                       # 선택
```

## 미션 JSON 스키마 (핵심)

```json
{
  "id": "ch1-m1-direct-read",
  "chapterId": "ch1",
  "title": "미션 1 · 파일을 직접 읽어보기",
  "order": 1,
  "intro": { "headline": "...", "bodyMarkdown": "..." },
  "shell": {
    "kind": "powershell",
    "prompt": "PS C:\\KRIVET\\연구> ",
    "initialCwd": "C:\\KRIVET\\연구",
    "fsFixture": "workspace.json"
  },
  "steps": [
    {
      "id": "step-ls",
      "instruction": "현재 폴더 파일을 보세요. `ls` 입력.",
      "expected": {
        "type": "command",
        "match": ["ls", "dir", "Get-ChildItem"],
        "caseSensitive": false
      },
      "output": [{ "type": "line", "text": "..." }],
      "hints": [
        { "afterFailures": 2, "text": "윈도우에서도 ls가 됩니다." },
        { "afterFailures": 4, "text": "정답: ls" }
      ]
    }
  ],
  "completion": {
    "type": "allStepsPassed",
    "reflection": { "headline": "...", "bullets": ["...", "..."] }
  },
  "special": null
}
```

- `expected.type` ∈ `command` | `sequence` | `custom`
- `output[i].type` ∈ `line` | `blank` | `typing` (cps) | `error` | `system`
- 특수 미션은 `special: { kind: "parallel" | "autocompact" | "ide-mock", config: {...} }`
- 파일명 = `id` 필드 (로더가 검증)
- KRIVET 동료가 JSON만 수정해 미션 추가/편집 가능

## 핵심 컴포넌트 명세

**Terminal 클래스 (`js/terminal/terminal.js`)**
```js
class Terminal {
  constructor(rootEl, { prompt, initialCwd, fsFixture, onSubmit }) {}
  mount() {}                          // DOM 부착 + 키 리스너
  print(line, opts = { type: 'line' })
  printScript(outputArray)            // 타이핑 애니메이션 포함 큐잉
  clear() · setPrompt(text) · focus() · destroy()
}
```

**명령 매칭 (`js/terminal/command-matcher.js`)**
```js
function matchCommand(input, expected) {
  // returns: { ok, matchedAlias?, normalizedInput }
}
```

**입력 처리 규칙**
- ↑/↓ 히스토리, Ctrl+L clear, Ctrl+C 타이핑 즉시 완료, Tab은 확장 지점만.
- 미인식 명령 → 빨강 에러 + 힌트 단계화(누적 실패 횟수 기준).
- 글로벌 화이트리스트: `whoami`, `echo`, `cls`/`clear`, `pwd`, `date` (분위기용 통과).

**상태 (`js/state.js`)**
```js
{
  currentChapterId, currentMissionId,
  progress: { [missionId]: { status, currentStepIndex, failures, completedAt } },
  preferences: { reducedMotion, sound }
}
```
- `localStorage` 키 `krivet.terminalSim.v1` 에 디바운스(500ms) 저장.
- 이벤트 버스 토픽: `mission:start`, `mission:step-passed`, `mission:failed`, `mission:completed`, `chapter:completed`, `progress:updated`.

## 디자인 토큰 (KRIVET 톤 반영)

참고: `Reference_Folder/References.txt`의 KRIVET 홈페이지 톤(<https://krivet.re.kr/kor/index.do>) — 단정한 공공 연구기관 인상. 시뮬레이터는 **헤더·패널은 라이트 톤, 터미널 영역만 다크 톤**의 듀얼 컬러로 "평소 환경과 다른 도구"임을 시각적으로 구분.

### 컬러 팔레트
```css
/* css/tokens.css */
:root {
  /* KRIVET 시그니처 */
  --color-navy:        #003366;  /* 헤더, 챕터 강조, 상단바 */
  --color-action:      #4A90E2;  /* 버튼, 진행률 채움, 링크, 강조 */
  --color-action-hover:#3A78C0;

  /* 라이트 영역 (패널/헤더) */
  --color-bg:          #FFFFFF;
  --color-bg-sub:      #F5F5F5;
  --color-border:      #E5E5E5;
  --color-text:        #333333;
  --color-text-mute:   #666666;

  /* 터미널 다크 영역 */
  --term-bg:           #0F2238;  /* KRIVET 네이비 다크 */
  --term-fg:           #E8E8E8;  /* 일반 출력 */
  --term-prompt:       #4A90E2;  /* 프롬프트 PS, 캐럿 */
  --term-error:        #E06C75;  /* 미인식 명령 */
  --term-system:       #E5C07B;  /* 시스템 메시지(오토컴팩트 등) */
  --term-dim:          #7A8FA5;  /* 보조 정보 */
}
```

### 타이포그래피
- 한글 UI: `Pretendard`(CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`) → fallback `"Noto Sans KR"`, `"맑은 고딕"`, sans-serif
- 터미널 모노: `D2Coding`(네이버, OFL 라이선스, jsdelivr CDN) → fallback `Consolas`, `"Cascadia Mono"`, monospace
- 사이즈: 본문 14~15px, 패널 제목 18~22px, 상단바 16px, 터미널 14px 고정(80×24 그리드)
- 자간: 한글 본문 -0.01em(Pretendard 권장), 터미널은 자간 0

### 형태/공간
- **둥근 모서리 최소화**: `border-radius: 0 ~ 2px` (KRIVET 직각 톤 유지)
- 그림자: 패널 분리에만 `0 1px 2px rgba(0,0,0,0.04)` 수준
- 구분선: `1px solid var(--color-border)`
- 패딩: 카드 16~24px, 섹션 24~32px

### 헤더/식별
- 상단바 좌측: 텍스트 로고 "**KRIVET 터미널 시뮬레이터**" (KRIVET 공식 로고는 직접 사용하지 않음 — 부속 학습 도구임을 명확히)
- 부제: "한국직업능력연구원 AI 리터러시 시뮬레이터"
- 푸터: "© KRIVET · 교육용 시뮬레이터 · 라이브 출력은 사전 정의 스크립트입니다"

### 색 사용 원칙
- 그라데이션·광택·과한 둥근 박스 금지
- 강조는 액션 블루 1색으로만 (산만함 방지)
- 다크/라이트 경계가 곧 "일상 GUI ↔ CLI" 메시지를 시각화

## 레이아웃 (데스크톱 ≥ 1280px)

```
┌──────────────────────────────────────────────────────────────────────┐
│ KRIVET 터미널 시뮬레이터  Ch.1 ●━●━○━○━○ [2/5]      [처음부터]      │
├────────────────────────────────┬─────────────────────────────────────┤
│ 미션 1 · 파일을 직접 읽기      │ PS C:\KRIVET\연구>  _               │
│                                │                                     │
│ 현재 단계 (1/2)                │   (80 cols × 24 rows)               │
│ ▸ `ls` 또는 `dir` 입력         │                                     │
│ 💡 힌트                        │                                     │
│ [건너뛰기] [정답 보기]         │                                     │
├────────────────────────────────┴─────────────────────────────────────┤
│ 💬 다음 미션 예고: 두 개의 터미널, 두 배의 속도                       │
└──────────────────────────────────────────────────────────────────────┘
```
- CSS Grid: `grid-template-columns: 380px 1fr` / `grid-template-rows: 56px 1fr 64px`
- < 900px: 세로 스택 (모바일은 best-effort, 사내 PC가 1순위)

## 특수 미션 처리

**미션 2 — 병렬 터미널** (`special.kind = "parallel"`)
- 우측을 좌/우 분할, 동일 Terminal 두 인스턴스.
- "둘 다 시작" 버튼 한 번 → 양쪽이 자동으로 다른 가짜 작업 진행(예: 좌=보고서 변환, 우=백업).
- 두 작업 완료 후 회고 카드: "탐색기였다면 한 번에 하나씩만 가능했을 것".
- 데이터: `special.config.terminals = [{ id, script: [...] }, ...]`

**미션 4 — 오토컴팩트** (`special.kind = "autocompact"`)
- 상단에 컨텍스트 게이지: `[████████░░] 142,300 / 200,000`
- 사용자가 사전정의 더미 질문 5~7회 입력 → 토큰 누적.
- 임계치(85%) 도달 시 시스템 메시지 → 게이지가 30%로 줄어드는 애니메이션 → 모의 요약 표시.
- 모달 고지: **"실제 Claude Code 동작을 단순화한 시뮬레이션"** (오정보 방지).
- 데이터: `tokenBudget`, `messages[]`, `compactionThreshold`.

**미션 5 — 범용 IDE 모형** (`special.kind = "ide-mock"`)
- VSCode를 직접 모방하지 않고 **일반화된 IDE 레이아웃**: 좌측 활동 표시줄(SVG 일반 아이콘), 좌측 탐색기, 중앙 에디터, 하단 통합 터미널.
- 핵심 메시지: **IDE 는 새로운 개발 방법론이 아니라, 에디터·터미널·파일트리를 한 워크스페이스에 모은 도구·환경**임을 학습자에게 전달.
- 워터마크 "교육용 모형 (Educational Mockup)" 항시 표시. 상태바에 `ESC · 바탕화면으로` 항시 노출 + Escape 키로 데스크톱 복귀.
- 시나리오 (3단계):
  1. **데스크톱 풍 사전 화면** — 폴더 아이콘 + IDE 모형 아이콘. 학습자는 IDE 모형 아이콘을 **더블클릭** 해 IDE 진입(0.7초 페이드).
  2. **좌측 탐색기에서 `2024_직업역량_보고서_초안.md` 클릭** → 중앙 에디터에 md 미리보기.
  3. **하단 통합 터미널(PowerShell)에 `claude` 입력** → Claude Code 부팅 시퀀스 + 셸 전환 → **새 프롬프트에서 `@2024_직업역량_보고서_초안.md ...` 멘션 입력**(prefix 매칭) → 보고서 한 줄 요약 응답.
- Terminal 클래스를 그대로 임베드 + 셸 종류 동적 전환(PowerShell → Claude Code, `setPrompt` + `refreshTitlebar`) (재사용성 검증).
- 설계 변경 메모: 2026-05-11 사용자 결정으로 원안의 `code .` + `git status` 흐름을 위 3단 시나리오로 교체. (1) 터미널 입력만으로 IDE 가 뜨는 것은 학습자에게 오해 가능, (2) 비개발자에게 `git status` 는 사전 지식 부담이 큼, (3) 미션 3·4 에서 익힌 `@` 멘션 재활용으로 학습 연속성 확보. 자세한 흐름은 `Working_history.md` 의 2026-05-11 20:13:35 entry 참조.

## GitHub Pages 배포 설계

**핵심 제약 — 모든 경로는 상대 경로**
- Project Pages URL은 `https://{user}.github.io/krivet-terminal-sim/` 형태로 서비스되므로, 절대 경로(`/data/...`)는 깨진다.
- 모든 `fetch`/`<link>`/`<script>`/`<img>` 경로는 `./data/...`, `./js/main.js` 식의 **상대 경로**로 작성한다.
- `index.html`의 `<base>` 태그는 사용하지 않는다(상대 경로만 신뢰).

**배포 흐름 (사용자가 따라할 절차)**
1. 로컬에서 `git init` → 첫 커밋 (Claude가 도움)
2. GitHub 웹에서 빈 저장소 `krivet-terminal-sim` 생성 (사용자가 직접, public)
3. `git remote add origin ...` → `git push -u origin main` (Claude가 도움)
4. GitHub 저장소 Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save (사용자가 직접)
5. 1~2분 뒤 `https://{user}.github.io/krivet-terminal-sim/` 접속 확인

**`.gitignore` 핵심 항목**
```
.DS_Store
Thumbs.db
.vscode/
.idea/
*.log
node_modules/
```

**`.nojekyll` 빈 파일을 루트에 둠**
- Jekyll 자동 처리를 끄고, 모든 파일을 있는 그대로 서빙.
- 향후 `_data/` 같은 폴더를 써도 안전.

**README.md 필수 섹션**
- 라이브 데모 링크 (`https://{user}.github.io/krivet-terminal-sim/`)
- "이 사이트가 무엇인가" 한국어 한 문단
- 로컬 실행법 (Live Server / `python -m http.server` / `npx serve`)
- 미션 추가 가이드 1쪽 (KRIVET 동료용, 비개발자 기준)
- 라이선스 표기

## 단계별 구현 순서

| Phase | 작업 | 산출물 | 예상 |
|---|---|---|---|
| 0 | 골격 마크업/CSS, state·router·progress 깡통 | 정적 와이어프레임 | 0.5d |
| **1** | **Terminal + command-matcher + 미션 1 JSON (MVP)** | **미션 1 끝까지 동작** | **1d** ← 데모/리뷰 분기점 |
| 2 | 미션 3 추가 (데이터만으로 가능한지 검증) | 데이터-only 확장 입증 | 0.5d |
| 3 | 미션 2 (병렬 터미널 + 분할 레이아웃) | `parallel-terminals.js` | 1d |
| 4 | 미션 4 (오토컴팩트 + 게이지) | `autocompact.js` | 1d |
| 5 | 미션 5 (범용 IDE 모형) | `ide-mock.js`, IDE 아이콘 | 1.5d |
| 6 | 폴리시: reduced-motion, 사운드 토글, README, 미션 추가 가이드 | 1쪽 문서 | 0.5d |
| **D** | **`git init` + `.gitignore` + `.nojekyll` + 첫 커밋 + 원격 연결 + `git push`** | **GitHub Pages 공개 URL** | **0.25d** |
| 7 (선택) | macOS/Bash 탭, i18n, 진행률 CSV 내보내기 | 확장 | TBD |

## 위험요소 / 트레이드오프

| 위험 | 대응 |
|---|---|
| 정답 외 명령 → 좌절 | 글로벌 화이트리스트 + 단계화 힌트(2회→힌트1, 4회→정답) |
| 한글 파일명 fetch 인코딩 | 미션 JSON 파일명은 영문, 콘텐츠 한글만 |
| 80×24 vs 반응형 | 데스크톱 기본, 모바일 가로 스크롤 |
| `localStorage` 단일 PC 한정 | 확장으로 "내보내기/가져오기" 메뉴 검토 |
| 타이핑 애니메이션 지루함 | Ctrl+C 스킵, `prefers-reduced-motion` 자동 끔 |
| 미션 4가 사실과 다른 인상 | "단순화된 시뮬레이션" 고지 모달 |
| 비개발자 JSON 오타 → 무음 실패 | 로더에서 스키마 검증 + 콘솔 빨강 + 화면 토스트 |
| Pages 배포 후 404 (경로 깨짐) | 모든 fetch/asset 경로를 `./` 상대로 통일, `.nojekyll` 포함 |
| 공개 저장소 → 누가 클론할 수 있음 | 라이선스 명시(MIT 또는 CC-BY 권장), `.credentials` 같은 키 절대 커밋 X |

## 검증 방법

**로컬 실행 (README에 명시)**
1. VSCode + Live Server 확장 (1순위)
2. PowerShell: `python -m http.server 5500`
3. `npx serve .`
4. ⚠ `file://` 직접 열기는 fetch가 막혀 동작 X

**GitHub Pages 배포 후 추가 검증**
- [ ] `https://{user}.github.io/krivet-terminal-sim/` 접속 → 200 OK
- [ ] 브라우저 DevTools Network 탭 → 모든 `data/*.json` fetch가 `https://{user}.github.io/krivet-terminal-sim/data/...`로 해석 (절대 경로 없음)
- [ ] 폰트/이미지/CSS 로드 실패(404) 없음
- [ ] 다른 PC에서 시크릿 창으로 접속 시에도 미션 1 정상 동작

**수동 검증 시나리오**
- [ ] 첫 방문 → 진행률 0/5, 한국어 환영, 미션 1 자동 진입
- [ ] 미션 1에서 오답 4회 → 힌트1(2회) → 정답(4회) 노출 순서
- [ ] 미션 3 진행 중 새로고침 → 같은 스텝 복귀 (`localStorage` 복원)
- [ ] 건너뛰기 누름 → status='skipped', 진행률 표기 분리
- [ ] 미션 4 게이지가 임계치(±1%)에서 정확히 압축 트리거
- [ ] 미션 5의 IDE 아이콘 더블클릭 → 0.7초 내 IDE 전환, ESC 복귀
- [ ] "처음부터" 버튼 → DevTools에서 `localStorage` 키 삭제 확인
- [ ] 80번째 글자에서 줄바꿈, 25번째 줄에서 스크롤 시작
- [ ] Tab 키 순회 (좌패널 → 터미널 → 푸터)
- [ ] `prefers-reduced-motion: reduce` 적용 시 타이핑 애니메이션 꺼짐
- [ ] 한/영 IME 전환 중에도 입력 끊김 없음

## Critical Files (구현 시 가장 먼저/자주 수정)

1. `D:\AI_Work\Claude\Terminal_Sim\index.html`
2. `D:\AI_Work\Claude\Terminal_Sim\js\terminal\terminal.js`
3. `D:\AI_Work\Claude\Terminal_Sim\js\mission\mission-engine.js`
4. `D:\AI_Work\Claude\Terminal_Sim\data\missions\ch1-m1-direct-read.json`
5. `D:\AI_Work\Claude\Terminal_Sim\js\state.js`

## 실행 권장 흐름

승인 후 곧장 전체를 만들지 말고 **Phase 0 → Phase 1(미션 1 MVP)** 까지 만들어 한 번 시연을 거친 뒤, 사용자 피드백 받고 나머지 미션을 확장하는 것을 권장. 미션 1이 검증되면 나머지는 대부분 데이터 추가 작업이 된다.
