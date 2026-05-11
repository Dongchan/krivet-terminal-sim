# Working History — KRIVET 터미널 시뮬레이터

> 이 문서는 컨텍스트 컴팩트/클리어 이후에도 다음 세션이 작업 맥락을 즉시 복원하도록 모든 작업을 빠짐없이 역순(최신이 위)으로 기록한다.
> 매 entry의 timestamp는 작업 시점에 파이썬으로 호출해 부여한다: `python -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))"`
>
> **현재 단계**: Phase 2 완료(미션 3 `ch2-m3-gui-vs-cli` 데이터-only 추가 · `/status`·`/context`·`/cost` 3 step). Ch.1 ▶ Ch.2 첫 미션 활성. 다음 결정 대기 중 — Phase 3(미션 2 병렬 터미널) / Phase 4(미션 4 오토컴팩트) / 추가 폴리시.
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
- 다음 push 시점은 사용자 확인을 받은 뒤 진행. 임의 push 금지.
```

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
