# KRIVET 터미널 시뮬레이터

한국직업능력연구원(KRIVET) 구성원(연구직·행정직)의 AI 활용 리터러시 향상을 위해 만든 웹 기반 터미널 시뮬레이터.

**왜 터미널이 필요한가** → **컨텍스트 윈도우의 이해** → **터미널을 넘어 IDE로** 의 3단 서사를 따라, 비개발자가 클릭 몇 번으로 터미널의 가치를 체감하게 한다. 가상의 셸 안에서 정해진 명령을 입력하면 실제처럼 동작하는 출력이 나오고, 단계마다 힌트와 회고 카드가 따라붙는다.

## 라이브 데모

- 공개 URL: <https://dongchan.github.io/krivet-terminal-sim/>
- GitHub Pages (main 브랜치 루트 서빙). 첫 진입은 미션 1부터 자동 시작되며, 우측 상단 [처음부터] 로 진행도 리셋 가능.

## 미션 구성 (현재 5종 전부 라이브)

| 미션 | 제목 | 핵심 체험 |
|---|---|---|
| Ch.1 · 미션 1 | 파일을 직접 읽어보기 | `cat` 한 줄로 파일 내용 출력 — 탐색기 더블클릭과의 차이 |
| Ch.1 · 미션 2 | 두 개의 터미널, 두 배의 속도 | 분할 레이아웃에서 두 셸 병렬 사용 |
| Ch.2 · 미션 3 | GUI에서는 안 보이는 것 | Claude Code 컨텍스트 사용량을 `@` 멘션·CLI 표기로 확인 |
| Ch.2 · 미션 4 | 오토컴팩트 시뮬레이션 | 게이지가 차면 모델이 무엇을 잊고 남기는지 시각화 (단순화 모형) |
| Ch.3 · 미션 5 | 터미널 + 에디터를 한 화면에 | 데스크톱 → IDE 모형 아이콘 더블클릭 → 통합 터미널에서 `claude` 부팅 → `@` 멘션 |

> 미션 5의 "IDE 모형" 은 새로운 개발 방법론이 아니라 **에디터·터미널·파일트리를 한 워크스페이스에 모은 도구** 임을 학습자에게 전달한다. 실제 VS Code/JetBrains 가 아닌 의도적으로 단순화된 모형이다.

## 로컬에서 실행하기

이 사이트는 `fetch` 로 JSON 을 불러오므로 `file://` 로는 동작하지 않는다. 다음 중 하나로 로컬 서버를 띄운다.

```powershell
# 1) Python 표준 라이브러리 (가장 흔함)
python -m http.server 5500

# 2) Node — npx serve
npx serve .
```

실행 후 브라우저에서 <http://localhost:5500/> 접속.

**VS Code 사용자**: **Live Server** 확장이 가장 간편하다 (`index.html` 우클릭 → "Open with Live Server"). 자동 새로고침이 따라온다.

## 폴더 구조

```
.
├─ index.html
├─ css/
│  ├─ tokens.css / reset.css / layout.css      # 디자인 토큰 + 기본 레이아웃
│  └─ panel.css / terminal.css / special.css / mission-overlay.css
├─ js/
│  ├─ main.js / router.js / state.js           # 부트스트랩 + 라우팅 + 전역 상태
│  ├─ panel.js / progress.js                   # 좌측 패널 + 상단 진행률
│  ├─ terminal/    # 가짜 터미널 (입력 / 출력 / 명령 매칭 / 셸 프롬프트)
│  ├─ mission/     # 미션 라이프사이클 (로더 / 엔진 / 검증 / 힌트)
│  ├─ special/     # 특수 미션 — parallel-terminals.js / autocompact.js / ide-mock.js
│  └─ utils/       # DOM·이벤트 헬퍼
├─ data/
│  ├─ chapters.json     # 챕터·미션 등록부
│  ├─ missions/         # 미션 JSON (코드 수정 없이 추가/편집 가능)
│  └─ fs-fixtures/      # 가짜 파일 시스템 (ls / cat 응답)
├─ Plan_sim_v.1.0.md    # 설계 정본
├─ Requirement.md       # 원본 요구사항
└─ Working_history.md   # 작업 이력 (역순, 세션 간 인수인계 문서)
```

## 미션 추가 가이드 (KRIVET 동료용, 비개발자 기준)

### 1) 표준 step-based 미션 (가장 흔한 형태 — 미션 1·3 처럼 명령어 → 출력 → 다음 단계)

1. `data/missions/` 폴더에 새 JSON 파일을 만든다. 예: `ch1-m99-새미션.json`
2. 기존 **`ch1-m1-direct-read.json`** 을 복사해 시작하는 게 가장 빠르다.
3. 다음 필드만 수정한다.
   - `id` — 파일명(`.json` 제외)과 동일해야 함
   - `chapterId` — `ch1` / `ch2` / `ch3` 중 하나
   - `title` / `intro` — 미션 제목과 도입 카피 (`headline`, `bodyMarkdown`)
   - `steps[]` — 단계별 `instruction`, `expected.match`(허용 명령들), `output`(출력 스크립트), `hints[]`, `tip`
   - `completion.reflection` — 완료 후 회고 카드 (bullets)
4. **`data/chapters.json`** 의 해당 챕터 `missions` 배열에 새 미션 ID 를 추가하고, `missionMeta` 에 `title` / `summary` 도 등록한다.
5. 로컬 서버를 재시작하지 않아도 새로고침으로 반영된다.

### 2) 특수 미션 (special) — 병렬 터미널 / 오토컴팩트 / IDE 모형

미션 JSON 의 최상위에 `"special": { "kind": "..." }` 필드가 붙으면 표준 step 엔진 대신 전용 모듈이 동작한다. 현재 지원되는 `kind`:

- `parallel-terminals` — 미션 2 (`ch1-m2-parallel.json`, `js/special/parallel-terminals.js`)
- `autocompact` — 미션 4 (`ch2-m4-autocompact.json`, `js/special/autocompact.js`)
- `ide-mock` — 미션 5 (`ch3-m5-ide-mock.json`, `js/special/ide-mock.js`)

새 special 미션을 만드는 일은 JS 코드를 함께 작성해야 하므로 개발자 협업이 필요하다. 기존 special 미션의 **카피·시나리오 단계·회고 카드를 수정**하는 것은 JSON 만 고치면 된다.

자세한 스키마는 `Plan_sim_v.1.0.md` 의 "미션 JSON 스키마" 절을 참고한다.

## 디자인 톤

- 시그니처 네이비 `#003366`, 액션 블루 `#4A90E2` — KRIVET 홈페이지 톤 반영
- 라이트 패널 ↔ 다크 터미널 듀얼 컬러로 "일상 GUI ↔ CLI" 시각화
- 한글 `Pretendard`, 모노스페이스 `D2Coding` (둘 다 CDN, OFL 라이선스)
- `prefers-reduced-motion: reduce` 환경에서는 모든 transition/animation 자동 비활성

## 접근성 / 진행 상태

- 진행도는 `localStorage` 에 저장된다 (단일 PC 한정). 상단 [처음부터] 또는 좌측 패널 [↻ 새로 시작] / [건너뛰기 →] 로 언제든 초기화 가능.
- 좌측 패널 [← 이전] [↻ 새로 시작] [건너뛰기 →] 액션 바는 모든 미션에서 동일하게 노출된다 (첫 미션의 [← 이전] 만 비활성).

## 기여

이 저장소는 KRIVET 내부 학습 자료로 시작했지만 공개되어 있다. 미션을 추가하거나 카피를 개선하는 PR 환영. 작업 흐름·결정 이력은 `Working_history.md` 에 모두 남겨 둔다.

## 라이선스

**MIT License** — `LICENSE` 파일 참고. KRIVET 내부 학습 자료로 시작했지만 공개되어 있어, MIT 조건 아래 자유롭게 사용·수정·재배포 가능. 저작권 표기와 라이선스 전문 사본을 함께 두기만 하면 된다.
