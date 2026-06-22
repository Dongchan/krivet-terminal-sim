# Analysis_Demo — 재현 번들 (KEEP I 패널 분석 데모)

KEEP I(한국교육고용패널 I) 자료로 **가구 SES와 노동시장 임금의 연관**을 중3(mid3)·고3(high3) 코호트로 비교하는 패널 분석 데모의 재현 번들이다. 본 디렉터리는 원자료를 **읽기 전용 입력**으로만 사용하며, 모든 분석 생성물(분석셋·표·그림·검증코드)은 이곳에 둔다.

> 해석 초안은 [`interpretation.md`](interpretation.md)를 참조한다. 본 README는 **재현 절차**에 집중한다.
> 본 분석은 연관·이동성의 기술을 목표로 하며 **인과를 단정하지 않는다.**

---

## 1. 디렉터리 구조

```
Analysis_Demo/
├── 01_load.py                 # [load]   원자료 적재 + 정찰(메타·분포 점검)
├── 02_build.py                # [build]  분석셋 2종(DS-A wide / DS-B long) 산출 + 데이터사전
├── 03_explore.py              # [explore] 기초통계 2종 + 시각화 3종(V1/V2/V4)
├── 04_analyze.py              # [analyze] 검정 3종 + 모형 4종 + 결과그림 2종(R1/R2)
├── interpretation.md          # 한국어 해석 초안(논문체)
├── README.md                  # (본 문서) 재현 번들 안내
├── data/
│   ├── keep_analysis_wide.csv # DS-A: 1인 1행 단면 분석셋
│   ├── keep_analysis_wide.dta #        (Stata 검증용 동일 데이터)
│   ├── keep_analysis_long.csv # DS-B: 개인-연도 패널 분석셋(계량 본체)
│   ├── keep_analysis_long.dta #        (Stata 검증용 동일 데이터)
│   └── data_dictionary.csv    # 변수 사전(출처·결측규칙·파생식·소속 분석셋)
├── tables/
│   ├── descriptives_variance.csv          # 표1: Between/Within 분산분해(DS-B)
│   ├── descriptives_cohort.csv            # 표2: 코호트×성별 요약(DS-A)
│   ├── models.csv                         # 모형 4종 계수표
│   ├── tests.csv                          # 검정 3종 결과표
│   ├── transition_ses_x_daejol_counts.csv # 이동성 전이행렬(빈도)
│   └── transition_ses_x_daejol_rowpct.csv # 이동성 전이행렬(행 %)
├── figures/
│   ├── V1_spaghetti.png       # 개인별 임금궤적 + 집단평균
│   ├── V2_cohort_trend.png    # 코호트별 연도평균 임금추세
│   ├── V4_transition.png      # 세대 간 이동성 전이행렬(2패널)
│   ├── R1_forest.png          # 종착모형(Mundlak) 핵심계수 forest plot
│   └── R2_model_compare.png   # 추정량 간 계수 비교
├── logs/
│   ├── load.log               # 01 단계 적재 로그
│   ├── build.log              # 02 단계 빌드 로그
│   └── 04_analyze_summary.json# 04 단계 핵심 결과 요약(JSON)
└── verify/
    ├── verify.R               # R(plm/lme4/sandwich) 교차검증 코드 (미실행)
    └── verify.do              # Stata(xtreg/hausman) 교차검증 코드 (미실행)
```

---

## 2. 실행 순서 (01 → 02 → 03 → 04)

스크립트는 번호 순서대로 의존한다. **작업디렉터리 이동 없이** 절대경로로 실행한다.

```bash
python3 Analysis_Demo/01_load.py     # 원자료 적재·정찰 -> logs/load.log
python3 Analysis_Demo/02_build.py    # 분석셋 2종 + data_dictionary.csv 산출
python3 Analysis_Demo/03_explore.py  # 기초통계 2종 + 그림 V1/V2/V4
python3 Analysis_Demo/04_analyze.py  # 검정 3종 + 모형 4종 + 그림 R1/R2 + 요약 JSON
```

- **01_load.py:** `직업데이터.SAV`·`학력데이터.SAV`·`기타데이터.SAV`와 직업력 종단 xlsx를 적재하고, BYSID 집합 동일성·코호트 카운트·연도 매핑(`year=2003+A02`)을 점검한다. 원자료가 없으면 이 단계만 실패한다(아래 §6).
- **02_build.py:** 음수결측(-1~-6)→NaN 정제, 코호트 정의, 메인표본(2,238) 필터 후 **DS-A(wide)**·**DS-B(long)**를 CSV·DTA로 저장하고 `data_dictionary.csv`를 생성한다.
- **03_explore.py:** DS-B 분산분해(표1)·DS-A 코호트요약(표2)과 V1/V2/V4 그림을 생성한다. **입력은 이미 빌드된 `data/`의 CSV**이므로 원자료 없이도 재현 가능하다.
- **04_analyze.py:** DS-B로 Pooled/RE/FE/Mundlak 4종을 적합하고 F·BP-LM·Hausman 3종 검정·R1/R2 그림·`04_analyze_summary.json`을 산출한다. **입력은 `data/`의 CSV**이므로 원자료 없이 재현 가능하다.

> **재현성 핵심:** `03`·`04`는 `data/keep_analysis_*.csv`만 있으면 원자료 없이 표·그림·검정을 그대로 재생산한다. 따라서 검증자는 본 번들의 분석셋만으로 모든 계량 결과를 검증할 수 있다.

---

## 3. 분석셋 파일 설명 (검증가능성)

| 파일 | 단위 | 행/주요열 | 검증 포인트 |
|---|---|---|---|
| `data/keep_analysis_wide.csv` | 1인 1행(DS-A) | 2,238행 / `byid, cohort, female, wage, ln_wage, ses_raw, ses_log, q1, daejol` | `ln_wage_n=1713`, `ln_wage_mean≈5.1354`; cohort mid3=753 / high3=1485 |
| `data/keep_analysis_long.csv` | 개인-연도(DS-B) | 6,608행 / 위 + `year(2005–2012), wage_t, n_spell` | complete-case 4,399 py / 1,612명; within(≥2obs) 3,912 py / 1,125명; cohort py high3=3,626 / mid3=773 |
| `data/data_dictionary.csv` | 메타 | 17변수 | 변수별 출처·결측규칙·파생식·소속 분석셋 |

- `.dta`는 동일 데이터의 Stata 호환본(R/Stata 교차검증용)이다.
- **분석표본(complete-case):** `04_analyze.py`는 `ln_wage, ses_log, daejol, female, cohort` 모두 비결측인 행만 사용한다 → 4,399 person-year / 1,612명.
- **핵심 사실:** `ses_log`·`daejol`·`female`은 개인 내 **시불변**(분산분해 Within SD=0.0000) → FE에서 식별 불가 → Mundlak/CRE 종착모형 채택의 직접 근거.

### 핵심 결과 요약(보고값)

- SES 주효과 `ses_log`(BYSID 군집강건): Pooled −0.1025(p=0.0026) / RE −0.1065(p=0.0021) / **Mundlak −0.1012(p=0.0036)**. FE는 시불변 소거로 식별 불가.
- SES×코호트 `ses_x_high3`: Pooled 0.1313(p=0.00042) / RE 0.1384(p=0.00027) / **Mundlak 0.1318(p=0.00053)** — 양·유의, 추정량 전반 강건.
- 검정 3종: F=2.8925, df=(1611,2780), p≈1.11e-16 (→FE) / BP-LM=255.97, df=1, p≈1.30e-57 (→RE) / Hausman χ²=21.72, df=7, p≈0.00284 (→FE).

---

## 4. R/Stata 검증코드 안내 (미실행)

본 환경에는 **R·Stata가 미설치**되어 `verify/verify.R`·`verify/verify.do`는 **실행되지 않았다.** 두 파일은 **코드 정합성(독립 스택 1:1 대응)** 검토용이며, 실행 검증은 Python으로 수행했다. R/Stata가 설치된 환경에서 다음으로 재현 대조할 수 있다.

```bash
Rscript Analysis_Demo/verify/verify.R     # plm/lme4/sandwich/lmtest -> verify/models_R.csv, tests_R.csv
stata -b do Analysis_Demo/verify/verify.do # xtreg/xttest0/hausman -> logs/verify_stata.log
```

Python(`04_analyze.py`) ↔ R(`plm`) ↔ Stata(`xtreg`) 대응:

| 항목 | Python (linearmodels) | R (plm) | Stata |
|---|---|---|---|
| Pooled OLS | `PooledOLS(...).fit(clustered, cluster_entity)` | `plm(model="pooling")` | `regress ... i.year, vce(cluster byid)` |
| RE | `RandomEffects(...)` | `plm(model="random")` | `xtreg ..., re vce(cluster byid)` |
| FE | `PanelOLS(..., entity_effects=True)` | `plm(model="within")` | `xtreg ..., fe vce(cluster byid)` |
| Mundlak/CRE | `RandomEffects(core+yr+yr_bar)` | `plm(random + xbar_i)` | `xtreg ... yr*_bar, re vce(cluster byid)` |
| F (Pooled vs FE) | `PanelOLS.f_pooled` | `pFtest()` | `F test that all u_i=0` |
| BP-LM (Pooled vs RE) | 수동 Baltagi–Li(1990) 불균형 LM | `plmtest(type="bp")` | `xttest0` |
| Hausman (FE vs RE) | 수동(공통 year더미, pinv) | `phtest()` | `hausman` |

> 주의: linearmodels의 entity-clustered SE와 R `vcovHC(method="arellano")`, Stata `vce(cluster byid)`는 유한표본 자유도 보정 차이로 소수점 하위 자릿수가 다를 수 있으나 **부호·유의성 결론은 동일**하다.

---

## 5. 실행 환경 및 재현성 설정

- **난수 시드:** 모든 스크립트 `np.random.seed(20260604)` 고정(V1 표본 추출 등 재현).
- **언어/패키지 버전(`pip show`로 확인):**

  | 패키지 | 버전 |
  |---|---|
  | Python | 3.9.6 |
  | pandas | 2.3.3 |
  | numpy | 2.0.2 |
  | statsmodels | 0.14.6 |
  | linearmodels | 6.1 |
  | **pyreadstat** | **1.1.9** (핀 고정) |
  | scipy | 1.13.1 |
  | matplotlib | 3.9.4 |
  | openpyxl | 3.1.5 |

- **데이터 읽기 규칙 (중요):** `.SAV`는 `pyreadstat.read_sav()`를 **인코딩 인자 없이** 호출한다(`encoding=` 사용 금지). 현재 환경에서 인코딩 인자를 주면 한글 라벨이 깨지므로, 인자 없이 호출해야 정상 디코딩된다. CSV는 BOM 포함 `utf-8-sig`로 저장(R `read.csv(fileEncoding="UTF-8-BOM")`, pandas 기본 읽기 모두 호환).
- **그래프:** matplotlib `Agg` 백엔드, **영문 라벨**(한글 글리프 깨짐 회피), dpi≥120.
- **경로:** 모든 스크립트는 절대경로 사용·작업디렉터리 이동 금지.

---

## 6. 원자료 의존성 (01·02 단계)

- `01_load.py`·`02_build.py`는 KEEP I 원자료(`KEEPI_Data_Codebook_1_to_13/` 하위 `.SAV`·xlsx)를 입력으로 한다. 원자료는 용량·재배포 사유로 버전관리에서 제외될 수 있다(상위 저장소 `.gitignore` 참조).
- 원자료가 없으면 `01`·`02`는 실패하지만, **이미 빌드된 `data/keep_analysis_*.csv`로 `03`·`04`(표·그림·검정 전체)는 그대로 재현**된다. 검증자는 본 번들의 분석셋만으로 모든 계량 결과를 확인할 수 있다.

---

> 산출물 무결성: 본 README의 보고 수치는 `logs/04_analyze_summary.json`, `tables/*.csv`에서 직접 산출한 값이다. 재실행 시 동일 시드·동일 분석셋이면 동일 결과가 재생산된다.
