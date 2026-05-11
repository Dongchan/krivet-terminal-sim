# KRIVET 터미널 시뮬레이터

한국직업능력연구원(KRIVET) 구성원(연구직·행정직)의 AI 활용 리터러시 향상을 위해 만든 웹 기반 터미널 시뮬레이터.

**왜 터미널이 필요한가** → **컨텍스트 윈도우의 이해** → **터미널을 넘어 IDE로** 의 3단 서사를 따라, 비개발자가 클릭 몇 번으로 터미널의 가치를 체감하게 한다.

## 라이브 데모

- 공개 URL: <https://dongchan.github.io/krivet-terminal-sim/> (배포 후 활성화)

## 현재 상태

- **Phase 1 완료** — 미션 1(파일을 직접 읽어보기)이 끝부터 끝까지 동작 (MVP).
- 다음 단계: 미션 2(병렬 터미널), 미션 3(GUI vs CLI), 미션 4(오토컴팩트), 미션 5(IDE 모형).

## 로컬에서 실행하기

이 사이트는 `fetch`로 JSON을 불러오므로 `file://` 로는 동작하지 않는다. 다음 중 하나로 로컬 서버를 띄운다.

```powershell
# 1. Python (가장 흔함)
python -m http.server 5500

# 2. Node (npx 사용)
npx serve .
```

실행 후 브라우저에서 <http://localhost:5500/> 접속.

VSCode 사용자는 **Live Server** 확장이 가장 간편하다 (우클릭 → "Open with Live Server").

## 폴더 구조

```
.
├─ index.html
├─ css/        # 디자인 토큰, 레이아웃, 컴포넌트별 CSS
├─ js/         # 부트스트랩, 상태, 라우터, 패널/진행률
│  ├─ terminal/  # 가짜 터미널 (입력/출력/매칭)
│  ├─ mission/   # 미션 라이프사이클 (로더/엔진/검증)
│  └─ utils/
├─ data/
│  ├─ chapters.json
│  ├─ missions/        # 미션 JSON (코드 수정 없이 추가/편집 가능)
│  └─ fs-fixtures/     # 가짜 파일 시스템 (ls/cat 응답용)
├─ Plan_sim_v.1.0.md   # 설계 문서
└─ Working_history.md  # 작업 이력 (역순)
```

## 미션 추가 가이드 (KRIVET 동료용, 비개발자 기준)

1. `data/missions/` 폴더에 새 JSON 파일을 만든다. 예: `ch1-m99-새미션.json`
2. 기존 `ch1-m1-direct-read.json` 을 복사해 시작하는 게 가장 빠르다.
3. 다음 필드만 수정한다:
   - `id`: 파일명과 동일해야 함
   - `chapterId`: `ch1` / `ch2` / `ch3` 중 하나
   - `title`: 미션 제목
   - `intro`: 미션 소개 (headline, bodyMarkdown)
   - `steps`: 단계별 instruction, expected.match(허용 명령들), output(출력 스크립트), hints, tip
   - `completion.reflection`: 완료 후 회고 카드 내용
4. `data/chapters.json` 의 해당 챕터 `missions` 배열에 새 미션 ID를 추가한다.
5. 로컬 서버를 재시작하지 않아도 새로고침으로 반영된다.

자세한 스키마는 `Plan_sim_v.1.0.md` 의 "미션 JSON 스키마" 절 참고.

## 디자인 톤

- 시그니처 네이비 `#003366`, 액션 블루 `#4A90E2` — KRIVET 홈페이지 톤 반영
- 라이트 패널 ↔ 다크 터미널 듀얼 컬러로 "일상 GUI ↔ CLI" 시각화
- 한글 `Pretendard`, 모노스페이스 `D2Coding` (둘 다 CDN, OFL 라이선스)

## 기여

이 저장소는 KRIVET 내부 학습 자료로 시작했지만 공개되어 있다. 미션을 추가하거나 카피를 개선하는 PR 환영.

## 라이선스

MIT (예정 — `LICENSE` 파일 추가 시점에 확정).
