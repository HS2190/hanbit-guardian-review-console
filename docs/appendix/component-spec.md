# 컴포넌트 스펙 — 한빛마트 심사 정책 관리 백오피스 (트랙 B) v1.1

| 항목 | 내용 |
|---|---|
| 작성 | 디자이너, 2026-09-14 · `design-spec.md` §1(의미 색 체계)·§2(토큰)와 한 몸 · **v1.1 revise 1회차**: §1 지급 ledger shell·compact 실측 폭, §16 큐 열 폭, §22 스트립 176, §24 조립 요소 신설, mono 한글 규칙(design-spec §2.3) 적용 |
| 형식 | 목적 → 사용 조건 → 상태(화면에서 실제 쓰이는 것만) → Props → 사용 예시. 토큰명은 `02 Semantic`/`03 Component` 참조, 레드라인은 px |
| 원칙 | **화면 27프레임에 등장하지 않는 상태는 베리언트로 만들지 않는다.** 정의만 필요한 것은 "정의만"으로 표기하고 Figma에는 만들지 않는다 |
| Figma 대응 | 세트 1 = 컴포넌트 세트 1(Variant 속성 = Props 표의 variant/state 열). 네이밍 `set/variant` 예 `badge/process/hold` |

## 0. 목록·계수 (자가 점검)

핵심 22 세트 · **101 베리언트** + 기초 컨트롤 7 세트 · 12 베리언트 = 29 세트 · 113 베리언트. **+ 조립 요소 2**(§24 EvidenceTimeline · ResultSummary — 컴포넌트 세트로 세지 않음, 프레임 안 조립). "mono-13" 등 표기는 전부 design-spec §2.3 규칙(숫자·영문 런 mono, 한글 런 같은 크기 sans 분리 노드)으로 읽는다.

| # | 세트 | 베리언트 | 쓰이는 화면 |
|---|---|---|---|
| 1 | StatusBadge | 30 (default 17 · compact 13) | 상세 헤더·큐 |
| 2 | Button | 16 | 전체 |
| 3 | HoldReasonChip | 3 | 큐 |
| 4 | PolicyDiffMarker | 2 | 큐 |
| 5 | DeadlineBadge | 2 | 큐·002-B |
| 6 | PolicyVersionBadge | 4 | 정책·상단바 |
| 7 | CompareAxisRow | 4 | 002-E/E′/D |
| 8 | PolicyBasisTable | 2 | 상세 ① |
| 9 | FormulaBlock | 5 | 상세 ④ |
| 10 | BlockCard | 3 | 002-C/D/G |
| 11 | InfoBanner | 1 | T1-05ⓑ·T2-06 |
| 12 | RereviewBanner | 2 | 002-G·T3 |
| 13 | ErrorBanner | 2 | 프레임 없음 — DS 페이지에서 차단/정보와 나란히(제약 ④ 증명) |
| 14 | CandidateCard | 2 | 상세 ③ |
| 15 | ComparePanel | 2 | 002-E/E′/D |
| 16 | QueueRow | 3 | 큐 |
| 17 | PolicyDiffTable | 2 | POL impact |
| 18 | ImpactPanel(AmountTriplet) | 2 | POL impact |
| 19 | ConfirmDialog | 3 | T1-03·T1-07·T3-02 |
| 20 | NoticePreview | 2 | 상세 ⑤ |
| 21 | Stepper | 4 | 정책 |
| 22 | SummaryStrip | 5 | 상세 |
| 기초 | Input 3 · Radio 2 · Checkbox 2 · Tab 2 · Toast 1 · Dropdown 1 · Skeleton 1 | 12 | |

---

## 1. StatusBadge

**목적** 3축(처리·결과·지급)을 서로 다른 축으로 읽히게 한다 — 형태 3종 + 접두 라벨 + 색(PRD 제약 2·NFR-04).
**사용 조건** 상세 헤더(default, 접두 라벨 포함) · 큐 처리/결과/지급 열(compact, 접두 생략 — 열 머리가 접두). 세 축을 한 배지에 합치지 않는다. 지급 "해당 없음"은 사유 괄호 필수.

**형태·토큰**

| axis | 형태 | 높이 | 패딩 | 폰트 | radius |
|---|---|---|---|---|---|
| process | outline pill: stroke 1 `badge/process/stroke-*`, fill 없음 | 24 (compact 22) | 좌우 8, 접두-값 gap 4 | 접두 `sans/label-12` text/muted · 값 `sans/label-12` 500 축 색 | `radius/pill` |
| result | filled rect: fill `badge/result/bg-*`, stroke 없음 | 24 (22) | 좌우 8 | 값 `sans/label-12` 500 `badge/result/fg-*` | `radius/control` |
| payout | **ledger shell**: 좌측 3px `badge/payout/bar-*` + 하단 1px `line/strong`(장부 행 밑줄 — sunken hover 위에서도 남는 grey/200), fill 없음, 그 외 stroke 없음. default·compact 동일 | 24 (22) | 좌 8(바 포함 11) 우 8 | 숫자 `mono/rail-12` · 한글 `sans/label-12` 500 분리 노드 gap 4, text/primary(none·not_applicable은 text/muted) | `radius/0` |

**상태(베리언트, 쓰이는 값만)**

| axis | value | 표시 문자열 | 색 | 글리프 | 등장 |
|---|---|---|---|---|---|
| process | received | 접수 | stroke·text `text/muted` | — | T1-02ⓐ · 큐 |
| | in_review | 심사 중 | `accent/default` | — | 002-A · 큐 |
| | awaiting_evidence | 보완 대기 | `hold/fg` | 앞 6px 점 `hold/bar` | 002-B · 큐 |
| | awaiting_precedent | 선행 판정 대기 | `hold/fg` | 점 | 002-C/D · 큐 |
| | rereview_pending | 재심 대상 | `hold/fg` | 점 | 002-G |
| | in_rereview | 재심 중 | `hold/fg` | 점 | 002-G ⓑ · T3 |
| | completed | 심사 완료 | stroke·text `text/primary` | 앞 `✓` mono | 002-H · 큐 |
| result | none | — | fg `text/muted` bg `surface/sunken` | | 판정 전 |
| | valid_first | 유효·최초 | `valid/fg` on `valid/tint` | | 002-C/F/H · 큐 |
| | duplicate | 중복(#1103) | `neutral-result/fg` on `neutral-result/tint` | | 큐 #1107 |
| | rejected | 반려 | `reject/fg` on `reject/tint` | | T3-03만 |
| payout | none | 미정 | bar `line/strong` · text/muted | | |
| | pending_confirm | 확정 대기 / 확정 대기 20,000~30,000 | bar `hold/bar` · text/primary | | 002-C · 큐 #1063 |
| | confirmed | 지급 확정 30,000 | bar `accent/default` | | 002-H · 큐 |
| | paid | 완료 30,000 / 완료 20,000 유지 | bar `surface/inverse` | | 큐 #1003 · 002-G |
| | adjusting | 조정 중 | bar `hold/bar` | | T3-03 |
| | not_applicable | 해당 없음(중복) / 해당 없음(한도 소진) | bar `line/strong` · text/muted | | 큐 #1107 · 002-F |

정의만(베리언트 없음): result out_of_scope·insufficient → duplicate와 같은 neutral 스타일 / payout paying·failed → confirmed 바에 라벨만.

**compact 실측 폭**(추정, 글리프 가정 design-spec §3.4 — 큐 열 폭 검산 근거): process `접수` 40 · `심사 중` 56 · `보완 대기` 78(점+gap 포함) · `선행 판정 대기` 105 · `심사 완료` 79(✓ 포함) / result `—` 24 · `유효·최초` 69 · `중복(#1103)` 86 · `반려` 40 / payout `미정` 43 · `확정 대기` 71 · `지급 확정 30,000` 120 · `완료 30,000` 93 · `해당 없음(중복)` 103 · `해당 없음(한도 소진)` 143(default에서만 등장). 처리·결과·지급 열 폭 124·112·140은 이 최대값 + 셀 패딩 16.

**Props**

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| axis | `process` \| `result` \| `payout` | — | 형태를 결정 |
| value | 위 표의 코드 | — | 색·글리프 |
| size | `default` \| `compact` | `default` | compact = 접두 생략, 높이 22 |
| label | string | 값의 기본 문자열 | 금액·사유·원본 ID를 포함한 표시 문자열 |

**예시** 002-F 헤더: `[처리 심사 중] [결과 유효·최초] [지급 해당 없음(한도 소진)]` — 초록 면 + 회색 바, 빨강 없음. 배지 간 gap 8.

---

## 2. Button

**목적** 가역/비가역 행동을 형태로 가른다(PRD 제약 5). **사용 조건** 비가역(확정·발행·재심 확정·반려)은 반드시 `irreversible`/`danger-irreversible` + ConfirmDialog 2단계. 비활성은 사유 텍스트 병기 없이는 금지.

| variant | fill | text | stroke | 글리프 | 쓰임 |
|---|---|---|---|---|---|
| primary | `accent/default` (hover `accent/hover`) | text/inverse | — | — | 심사 착수 · 보완 요청 · 판정 저장 · 발송 · 다음 · 초안 만들기 · 이력 보기 · 재심 착수 |
| secondary | surface/default (hover surface/sunken) | text/primary | 1 `line/strong` | — | 선행 건 열기 · 취소 · 불충분 표시 · 직권 재심 · 완료 건 목록 · 예약 취소 · 필터 지우기 |
| ghost | 없음 (hover surface/sunken) | text/link | — | — | 초안 삭제 · 이전: 편집 · #1042 열기(배너) · 펼치기 |
| irreversible | `button/irreversible-bg` (hover grey/700) | text/inverse | — | 앞 lock 16px | 지급 확정 30,000원 · 확정 — 되돌릴 수 없음 · 지금 발행 — 되돌릴 수 없음 · 발행 — 되돌릴 수 없음 · 유효 · 0원으로 확정(한도 소진) |
| danger-irreversible | `button/danger-bg` (hover red/800) | text/inverse | — | lock | 반려로 확정 — 되돌릴 수 없음 (T3-02만) |

**상태** default · hover · focus(2px `focus/ring` offset 2) — 5 variant × 3 = 15, + primary `disabled`(fill `disabled/bg`, text `disabled/fg`, 우측 인라인 사유 `sans/label-12` text/muted — POL-C·집계 중) = **16**.
**레드라인** 높이 36(md) / 32(sm, 표·카드 안), 좌우 패딩 16(md)/12(sm), radius `radius/control` 4, 라벨 `sans/body-14` 500 / sm `sans/table-13` 500. 글리프-라벨 gap 6. hit area ≥ 40 세로(md는 패딩 2 확장). 눌림 scale 없음(정적).

**Props** variant · size(`md`\|`sm`) · state · disabledReason(string, disabled 시 필수) · icon(`lock`\|none).

---

## 3. HoldReasonChip

**목적** 큐에서 "왜 막혀 있나"를 상세 진입 없이 세고 필터한다(F-REVIEW-001-01). **사용 조건** 0건도 비활성 아님 — "0" 표시, 클릭 시 빈 상태 B.

| state | fill | stroke | text |
|---|---|---|---|
| default | surface/default | 1 `line/default` | 라벨 `sans/label-12` text/secondary · 숫자 `mono/rail-12` text/primary |
| active | `accent/tint` | 1 `accent/default` | 라벨 accent/hover · 숫자 accent/hover |
| focus | default + 2px ring | | |

**레드라인** 높이 32, 패딩 좌우 12, 라벨-숫자 gap 6, radius 4, 칩 gap 8. 하위 괄호(`(제출 있음 0)`, `(유효성 0 · 금액 1 · 조정 0)`)는 같은 칩 안 mono-12 text/muted. hit 40 세로(행 높이 48 안에서 확장).
**Props** label · count(number) · sub(string?) · state. **예시** `보완 대기 2 (제출 있음 0)`.

---

## 4. PolicyDiffMarker

**목적** 적용 ≠ 발효 중 버전을 큐에서 2단계로 식별(F-REVIEW-001-03). 심사 완료 건은 info로 강등(사양).

| variant | 표시 | 스타일 |
|---|---|---|
| info | `v1 · 현재 v2` | `mono/meta-13` text/muted, 글리프 없음 |
| warn | `▲ 접수 30,000 · 현재 10,000` | `mono/meta-13` 500 `hold/fg`(한글 런 `sans/table-13` 500), 앞 `▲` `hold/bar`, 셀 fill 없음. **큐(폭 124)에서는 2줄 고정형**: 1행 `▲ 접수 30,000` / 2행 `현재 10,000`(V 레이아웃, 20×2, `·` 생략) — 두 행 모두 hold/fg라 값 대조가 세로로 남는다 |

동일(`—`)은 셀 텍스트이지 베리언트 아님. 화살표 금지(방향 없음). **Props** variant · applied · current · appliedVersion · currentVersion.

---

## 5. DeadlineBadge

**목적** 보완 기한을 숫자로. | variant | 표시 | 스타일 |
|---|---|---|
| default | `기한 9/25 D-7` | `mono/rail-12` text/secondary, outline 1 `line/strong`, 높이 22, 패딩 6, radius 4 |
| near (D-3 이하) | `기한 9/21 D-3` | text `hold/fg`, stroke `hold/fg` |

정의만: expired `기한 경과 · 검토 필요` fill `hold/tint` text `hold/fg` — 프레임 없음. **Props** deadline · daysLeft.

---

## 6. PolicyVersionBadge

**목적** 버전 상태 4값(feature-spec §2.6 PV). 취소·대체는 이력 행 텍스트.

| variant | 표시 | 스타일 |
|---|---|---|
| active(발효 중) | `발효 중 v2 · 9/15 10:23~` | outline 1 `accent/default`, text accent/hover, `mono/rail-12` |
| scheduled(예약·발효 전) | `예약 v3 · 9/20 09:00 발효 예정` | outline `hold/fg`, text hold/fg |
| draft(초안) | `초안 · 10:21 저장됨` | outline `line/strong`, text/secondary |
| previous(이전) | `v1 · 이전` | 없음, text/muted |

높이 24, 패딩 8, radius 4. 상단바에는 active만 놓는다(현재이지 적용이 아님 — 색 승격 없음). **v1.2 정정(드로잉 QA R7)**: 상단바 인스턴스는 outline `line/strong` + text/secondary(ink)로 오버라이드 — design-spec §3.1이 정본. accent outline은 정책 현황 카드의 배지에만.

---

## 7. CompareAxisRow

**목적** 본건 vs 후보를 축별로 대조, 판단 질문에 답하게(feature-spec §6.1). **사용 조건** ComparePanel 안 6행 고정 순서(지점·이벤트 / 상품 개체 / 결함 유형 / 접수 시각 / 증빙 / 조치 기록) + 7행 처리/결과/지급.

| variant | 마커 | 스타일 |
|---|---|---|
| same | `◀ 동일` | 마커 `mono/rail-12` text/muted |
| different | `◀ 1h 28m 이름` 등 텍스트 | 마커 `hold/fg` |
| neutral | 없음 | 조치 기록 `—(없음)` text/muted |
| different-action(조치 기록 강조) | `◀ 본건 접수 9/23은 조치 이후` | 행 fill `hold/tint`, 후보 셀 `sans/body-14-strong`, 마커 `hold/fg`; 행 앞 `★` |

**레드라인** 행 높이 40(different-action 56, 2줄), 열: 축 라벨 120 `sans/label-12` text/muted / 본건 240 / 후보 240 / 마커 FILL. 행 룰 1 `line/subtle`. 원본 고객 정보 슬롯 없음(FR-13).

---

## 8. PolicyBasisTable

**목적** 접수 당시 정책 전체 항목을 적용 \| 현재 2열로. **컨트롤 없음이 사양**(hover·선택 없음). 적용 열 강, 현재 열 약, 화살표 없음.

| variant | 조건 | 구성 |
|---|---|---|
| expanded-diff | 적용 ≠ 현재 | 머리 `항목 / 적용 v1 (9/1 09:00) / 현재 v2 (비교) / ` + 8행. 본건 항목 행 최상단, fill `basis/diff-row`, 적용 값 `mono/value-14` text/primary, 현재 값 `mono/meta-13` text/muted, 행 끝 outline 태그 `차이`(`sans/label-12`, stroke line/strong). 나머지 현재 셀 `—(동일)` text/muted. 하단 각주 `※ 컨트롤 없음. "현재" 열은 비교용, 선택 불가` `sans/label-12` text/muted |
| collapsed-same | 적용 = 현재 | 1행 `① 접수 근거 · 현재 정책과 동일` + ghost 「펼치기」 |

**레드라인** 폭 FILL(780), 열 항목 200 / 적용 240 / 현재 240 / 태그 FILL. 머리 36 fill `surface/sunken` `sans/label-12`, 행 36, 룰 1 `line/subtle`. 예약 버전 있으면 각주 1줄 추가(텍스트). 로딩 실패 시 이 자리 ErrorBanner.

---

## 9. FormulaBlock

**목적** 기준액 → 한도 조정 → 최종을 세로 3행, 식과 누적 출처까지(PRD 제약 3). **수정 컨트롤 없음이 사양.**

| variant | 행 구성 | 등장 |
|---|---|---|
| default(미확정 —) | `기준액 30,000 (접수 정책 v1 · 유통기한 경과)` / `한도 조정 — (한도 50,000 − 누적 0 = 잔여 50,000)` / `최종 — (유효성 평가 후 계산)` | 002-A ⓐⓑ · 002-E |
| value | 한도 행 식 + 펼침 `└ #1042 9/15 09:47 · 30,000` / 최종 `20,000` | T1-02ⓒ · T1-05ⓑ · 002-H |
| range | 한도 행 `미확정 한도 50,000 − 누적 ?` + 분기 2줄 `├ #1042 유효 시 소비 30,000 → 잔여 20,000` `└ #1042 무효 시 소비 0 → 잔여 30,000` / 최종 `20,000 ~ 30,000` + 각주 `※ 하한 선확정 버튼 없음` | 002-C |
| zero | 한도 행 `max(0, 20,000 − 30,000) = 0` 절삭 표시 / 최종 `0원` | 002-F |
| locked-rereview | 2열: `확정(잠김) 20,000` (lock 글리프, text/primary) \| `재심 산정(참고) 30,000` (text/muted) | 002-G · T3-01 |

**레드라인** 라벨 열 120 `sans/table-13` text/muted / 값 열 120 우측 `mono/value-16` 600 / 식 열 FILL `mono/meta-13` text/muted. 행 높이 32, 분기·펼침 행 28 들여쓰기 16. 최종 행 상단 룰 1 `line/strong`. 값 변화 하이라이트: 값 셀 fill `accent/tint-strong` 1회(600ms).

---

## 10. BlockCard

**목적** 확정 버튼을 **대체**하는 차단 — 이유 + 대상 건 + 다음 행동(PRD 제약 4). 비활성 버튼+툴팁 아님. **사용 조건** 판정 패널의 주 행동 자리. 사유 복수면 사유 행이 늘어남.

| variant(reason) | 제목 | 본문 행 | 등장 |
|---|---|---|---|
| amount | `확정 차단 — 사유: 금액` | `같은 고객 선행 건 #1042` / `보완 대기 · 기한 9/25 10:05` / `접수 9/15 09:47 (본건보다 이름)` / 룰 / `#1042 유효 → 본건 20,000` `#1042 무효 → 본건 30,000` / 「선행 건 #1042 열기」 secondary sm | 002-C |
| validity | `확정 차단 — 사유: 유효성` | `더 이른 후보 #1103 미판정` / `보완 대기 · 기한 9/23` / `접수 9/16 14:02 (1h 28m 이름)` / 「선행 건 #1103 열기」 | 002-D |
| adjusting | `확정 차단 — 사유: 선행 건 조정 중` | `#1042 조정 중(환수)` / `소비 해제 시 재심 확정 가능` / 「#1042 열기」 | 002-G ⓑ(재심 중 건만) |

**스타일** fill `block/bg`, stroke 1 `block/border`, 좌측 3px `block/bar`(ink), radius 0. 제목 `sans/body-14-strong` text/primary, 행 `sans/table-13` text/secondary, 대상 ID `mono/meta-13` text/link. 분기 행 `mono/meta-13`. **레드라인** 폭 368, 패딩 16, 행 gap 8, 버튼 상단 gap 12. 에러(red)·정보(accent)와 색 계열·형태가 다름 — design-spec §1.2.

---

## 11. InfoBanner (T37 · 복귀 배너)

**목적** "되긴 되는데 알아 둘 것". 판정 컨트롤 그대로. **베리언트 1**(내용만 슬롯).
스타일 fill `info/bg`, 좌측 3px `info/bar`, stroke 없음, radius 0, 높이 40(1줄), 패딩 좌 16 우 12. 본문 `sans/body-14` text/secondary, ID `mono/meta-13` text/link, 우측 ghost sm 「#1042 열기」. 닫기 없음(상태 해소까지 유지). 위치: 헤더 아래·스트립 위, 본문 폭 1220.
예시: `같은 고객 #1042 조정 중 — 완료 시 이 건은 재심 대상이 됩니다` / `선행 건 #1042 확정(30,000 소비) → 재검토 필요`.

---

## 12. RereviewBanner

**목적** 재심 진입 사유·대상 건·기존 확정액 유지를 헤더에.

| variant | 표시 |
|---|---|
| pending(재심 대상) | `재심 대상 — 선행 건 #1042 재심 번복 · 기존 확정액 20,000 유지 중` + 「#1042 열기」 ghost |
| in-rereview(재심 중) | `재심 중 — 직권 재심 (9/28 · 사유: 증빙 조작) · 기존 지급 30,000 유지 중` |

스타일 fill `hold/tint`, 좌측 3px `hold/bar`, text `hold/fg` `sans/body-14`, 금액 `mono/value-14`. 높이 40, 위치 InfoBanner와 동일 슬롯(동시 표시 없음 — 재심 중 건은 정보 배너 대신 차단 카드).

---

## 13. ErrorBanner / InlineError (프레임 없음 — DS 페이지 전시용)

| variant | 스타일 | 예시 |
|---|---|---|
| banner | fill `error/bg`, stroke 1 `error/border`, 아이콘 alert 16 `reject/bar`, 제목 `sans/body-14-strong` reject/fg, 본문 text/secondary, 우측 「재시도」 secondary sm. 높이 48+ | `접수 정책을 불러오지 못했습니다 — 판정 저장 차단` |
| inline | 아이콘 + `sans/table-13` reject/fg, 컨트롤 아래 gap 6 | `저장하지 못했습니다 — 금액·한도는 잠기지 않았습니다` |

02 Components 페이지에서 BlockCard·InfoBanner·ErrorBanner 세 개를 한 줄에 배치해 제약 ④ 구별을 보인다. **원칙 예외** — "화면에 등장하지 않는 상태는 만들지 않는다"의 유일한 예외: 제약 ④(차단≠에러≠정보) 증명용으로 DS 페이지에만 제작.

---

## 14. CandidateCard

**목적** 중복 후보를 사실만(ID·시각 차·유형·처리/결과·버전) — **기본 판정값 없음**(사양).

| variant | 구성 |
|---|---|
| default | `#1103` mono-14 600 · `유효·최초` result compact 배지 · `9/16 14:02 · 1h 28m 이름` mono-13 muted · `가격표 오류 · v2` sans-13 · 우측 「비교 열기」 secondary sm |
| action-record | default + 태그 `조치 기록 있음`(outline hold/fg, sans-label-12) — 002-E′ #1103 |

폭 FILL(780 / 비교 열림 시 540), 높이 64, 패딩 12, stroke 1 `line/default`, radius 0, 카드 gap 8. hover fill surface/sunken. 판정 후(중복/별건) 표시는 텍스트 슬롯(`중복(#1103)` 배지)으로 — 별도 베리언트 없음.

---

## 15. ComparePanel

**목적** 본건 \| 후보 2열 대조 + 판정(F-REVIEW-002-10). 우측 패널 자리를 **넓혀** 연다(640). 판단 질문 상시 노출.

| variant | 판정 행 |
|---|---|
| decide | ◉ `중복 — 원본 #1103 지정` / ○ `별건` · 사유 Dropdown(같은 가격표 / 같은 개체 / 같은 로트 / 다른 개체 / 다른 결함 유형 / 조치 후 재발 / 개체 구분 불가) + 서술 Input · 「취소」 secondary 「판정 저장」 primary |
| precedent-pending | 판정 행 대신 `원본 후보 #1103 판정 대기 (보완 대기 · 기한 9/23)` + 「열기」 secondary sm — 002-D |

**구조(위→아래)** 헤더 40: `중복 비교` heading-16 + Tab 목록([#1103][#1110]…) + 닫기 ✕ (hit 40) / 판단 질문 행 32 `판단 질문: 같은 원인이고, 같은 시정 대상인가?` sans-14-strong / 룰 / 열 머리 `축 / 본건 #1107 / 후보 #1103 (원본 후보)` / CompareAxisRow ×7 / 룰 / 판정 행. 패딩 16, stroke 좌측 1 `line/default`, fill surface/default. ESC·뒤로·✕ 닫기.

---

## 16. QueueRow (QueueTable 행)

**목적** 처리·결과·지급 **세 열 분리**(사양). 보류 사유 대상 ID는 링크.

| state | 스타일 |
|---|---|
| default | 높이 40 FIXED, 룰 1 `line/subtle`, 셀 패딩 **좌우 8 · 세로 0**, `sans/table-13` / 숫자 열 `mono/meta-13` 우측 정렬. 정책 차이·보류 사유 2열만 2줄(20×2) 허용 — 나머지 열은 1줄 세로 중앙 |
| hover | fill `surface/sunken` |
| focus | 좌측 2px `accent/default` + fill surface/sunken |

열(폭 합 1172 FIXED, **v1.1 검산 후** — design-spec §3.4 표): ID **56**(정본 `#1042`, mono-13 text/link) · 지점 **44** · 접수 **96**(mono 우측) · 고객 **44** · 결함 유형 **100** · 기준액(적용) **104**(`30,000 (v1)` mono 우측) · 정책 차이 **124**(PolicyDiffMarker — warn은 2줄 `▲ 접수 30,000` / `현재 10,000`, info·`—`는 1줄) · 처리 **124**(process compact) · 보류 사유 **128**(2줄: 1행 `금액 · #1042 열기`(ID 링크) / 2행 `20,000~30,000` mono, 또는 1행 DeadlineBadge `기한 9/25 D-7` / 2행 `제출 없음`) · 결과 **112**(result compact) · 지급 **140**(payout compact, ledger shell) · 담당 **56** · 체류 **44**(mono 우측 `3일`, 완료는 `—`).
**그룹 밴드**(머리 위 20px 행): 8~11열 위(폭 504)에만 `상태 3축` `sans/label-12` text/muted 좌 정렬 + 하단 1px `line/strong`; 나머지 칸 비움. 머리 36 fill surface/sunken `sans/label-12` text/muted, 정렬 가능 열 `▲` mono. 페이지네이션 `‹ 1 ›  50건/페이지` mono-12.

---

## 17. PolicyDiffTable

**목적** 기존 → 변경, 변경 행만 강조. **화살표는 이 표에서만.**

| row variant | 스타일 |
|---|---|
| changed | fill `diff/changed-row`, 기존 `mono/value-14` text/muted, `→` `diff/arrow` mono, 변경 `mono/value-16` 600 text/primary, 행 끝 태그 `변경`(fill accent/tint, stroke accent, sans-label-12 accent/hover) |
| unchanged | 기존·변경 같은 값 `mono/value-14` text/secondary, 화살표 없음 |

머리 `항목 / 기존 v1 / 변경(초안) / ` 36. 열 항목 200 / 기존 160 / 화살표 32 / 변경 160 / 태그 FILL. 행 36. 접기 행 `[변경 없음 8항목 접기 ▴]` ghost sm — Tier 1은 펼친 상태. 폭 600. POL-B 변경 행: `대상 카테고리 신선·가공·생활 → 가공·생활`.

---

## 18. ImpactPanel (AmountTriplet)

**목적** 발행 직전 경계 확인 — ① ② ③ **세로 3행 고정**(0건도 유지, 회색 처리 없음), 각주, 변경 항목 하위 행, 방향 문장, 향후 접수분, 발행 시점. 금지: "최대 노출액"·"예상 지급액"·"예산에 영향 없음".

| variant | 하위 행 |
|---|---|
| default | ③ 아래 `└ 변경 항목(유통기한 경과) 해당 3건 90,000 → 이번 변경으로 줄지 않음` |
| scope-row | default 하위 행 + `└ 대상 제외(신선식품) 해당 3건 (#1031·#1039·#1042) — 접수 당시 범위로 계속 심사 (무효 아님)` — POL-B |

POL-D(0건)는 default에 `0 · 0건` 값 — 베리언트 아님.
**구조** 제목 `발행 직전 영향 확인` heading-16 / 소제목 `이미 접수된 제보 (9/15 10:22 기준 · 7건)` sans-14 secondary / AmountTriplet 3행(라벨 300 sans-14 · 금액 mono-16 600 우측 폭 120 · 건수 mono-13 muted 폭 56, 행 40) / 각주 `현재 분류 유지 가정 · 중복·개인 한도 미반영` label-12 muted 들여쓰기 24 / 하위 행 들여쓰기 24, `→ 이번 변경으로 줄지 않음` 부분 sans-14-strong / 방향 문장 sans-14-strong text/primary, 위아래 gap 16 / 룰 / `발효 이후 접수분` label + `유통기한 경과 10,000원 (기존 30,000)` mono-14 / 룰 / 발행 시점 Radio 2 + 시각 Input(**예약 선택 시에만 표시** — 지금 발행 선택 시 숨김, 비활성 아님) / 「지금 발행 — 되돌릴 수 없음」 우측. 폭 572, 패딩 24. 집계 중: 금액 셀 Skeleton, 버튼 disabled + `집계 중`.

---

## 19. ConfirmDialog

**목적** 가역/비가역을 다이얼로그 형태로 가른다. Enter 단독 실행 금지(비가역).

| variant | 헤더 | 확인 버튼 | 초기 포커스 | Enter |
|---|---|---|---|---|
| reversible | 흰색, 제목 sans-20 | primary | 확인 | 실행 |
| irreversible | 상단 4px `surface/inverse` 띠 + 우상단 태그 `비가역` **`sans/label-12`** outline(전부 한글 — mono 금지) | irreversible | **취소** | 무시(확인은 클릭/Tab 후) |
| danger-irreversible | 띠 `reject/bar` + 태그 `비가역` | danger-irreversible | 취소 | 무시 |

**레드라인** 폭 520, 패딩 24, radius `radius/float` 8, Effect Style `shadow/float`, scrim `overlay/scrim`(grey/900-a40). 제목 아래 gap 12, 본문 `sans/body-14` text/secondary 행 gap 6(각 사실은 별 행 — 문장 접합 금지), 버튼 행 상단 gap 24, 버튼 우측 정렬 gap 8. 내부 버튼 radius 4(concentric: 8 ≥ 4 + 여백).
**슬롯(T1-07)** ⓐ `지급 확정 — 30,000원` · `유효·최초 · 유통기한 경과 30,000원 (v1)` · `확정 후 자동 재계산 없음` · `고객 안내 즉시 발송` · 「확정 — 되돌릴 수 없음」 / ⓑ `지급 확정 — 20,000원` · `한도 50,000 중 30,000 기소비 → 20,000` / ⓒ `v2 발행` · `발행 후 이 버전은 수정할 수 없습니다` · `즉시 발효` · `변경: 유통기한 경과 30,000 → 10,000` · `미확정 4건을 포함해 이미 접수된 7건에는 적용되지 않음` · 「발행 — 되돌릴 수 없음」. T1-03 보완 요청은 reversible(체크리스트 + 기한 행 + 「발송」). T3-02 danger.

---

## 20. NoticePreview

**목적** 고객 안내 근거(TA-2)를 심사 데이터에서 문장화. **편집 불가가 사양.** 결과와 지급은 다른 행.

| variant | 스타일 |
|---|---|
| draft | 본문 위 워터마크 `확정 시 구성 · 확정 시 발송` mono-12 text/placeholder, 본문 text/muted |
| final | 본문 text/primary, 상단 태그 `확정본 · 9/20 09:30` mono-12 |

fill surface/sunken, stroke 없음, 패딩 16, 행 gap 6, `sans/body-14`. 예시(final #1063): `가격표 오류 30,000원 유효` / `한도 50,000 중 30,000 기소비 → 20,000 지급` / `이의 제기 기한 10/4`. 002-F: `유효 — 한도 소진으로 지급 없음`을 두 행(`유효` / `한도 소진으로 지급 없음`).

---

## 21. Stepper

**목적** 편집 → 비교·영향 확인 → 발행 완료 3단계, 영향 확인을 건너뛸 수 없음을 구조로.

| variant | 표시 |
|---|---|
| step1 | ① 편집 활성(accent 원 + 라벨 text/primary), ②③ text/muted |
| step1-blocked | step1 + ② 옆 인라인 `변경된 항목 없음` label-12 muted (POL-C) — 이유 없는 비활성 금지 |
| step2 | ① ✓ ink, ② 활성 |
| step3 | ①② ✓, ③ 활성 ✓ |

원 20(숫자 mono-12), 연결선 1 `line/strong` 길이 80, 라벨 sans-14, 스텝 hit 40. 폭 HUG, 헤더 행 중앙.

---

## 22. SummaryStrip

**목적** NFR-05 — 폴드 위에서 K5 3질문의 요약 답. 3칸 440 FIXED / 380 FILL / 400 FIXED(= 판정 패널 폭), 높이 **176 FIXED**(v1.1 — 산술은 design-spec §3.2). 칸 제목은 heading이 아니라 **레일 라벨**(`sans/label-12` text/muted, 높이 16) — 좌 칸 레일에는 잠금 태그가 고정으로 붙는다.

| variant(우 칸) | 우 칸 1행 | 2행·버튼 | 등장 |
|---|---|---|---|
| pre-decision | `다음: 증빙 확인 → 유효성 평가` | `(판정 전 · 확정 버튼은 평가 후)` · 「보완 요청」 primary sm | 002-A ⓑ |
| hold | `보완 대기 · 기한 9/25 10:05 (D-7)` | `제출 없음` / ⓑ `제출 1건 · 미검토 (9/20 08:12)` · 「보완 확인 · 심사 재개」 | 002-B |
| blocked | `확정 불가 — 같은 고객의 선행 건 #1042 판정 필요` sans-14-strong | `(보완 대기 · 9/25)` · 「선행 건 #1042 열기」 secondary sm | 002-C/D/G |
| confirmable | `확정 가능 · 유효·최초 30,000` | `다음: 지급 확정` · 「지급 확정 30,000원」 irreversible sm | T1-02ⓒ · T1-05ⓑ · 002-F |
| done | `심사 완료 · 확정 9/20 09:30 최민아` | `안내 발송됨 · 이의 제기 기한 10/4` · 「직권 재심」 secondary sm | 002-H |

착수 전(T1-02ⓐ)은 pre-decision에 버튼만 「심사 착수」 — 슬롯.

**좌 칸(고정 구조, 위→아래)**: 레일 행 H(`접수 근거` label-12 muted + **잠금 태그** `🔒 접수 당시 정책 잠김 · v1` = lock 글리프 12 + `접수 당시 정책 잠김` sans/label-12 + `v1` mono/rail-12, outline 1 `line/strong`, 높이 16, 패딩 좌우 4 — 전 상세 프레임 고정 요소, 적용 버전만 슬롯) → 1행 `9/15 09:47 접수` mono-13/sans-13 muted → 2행 `유통기한 경과` sans-18 600 + `30,000` mono-20 600 + `원` sans-20 600(1~2행 좌측 3px `surface/inverse` 바) → 3행 `한도 50,000 · 신선식품(대상)` sans-13 → 4행 `적용 v1 ─ 현재 v2: 10,000 (비교)` mono-13 muted(현재 값 muted 유지) 또는 `적용 v2 ─ 현재 정책과 동일` → 각주 `적용 정책은 접수 시각으로 정해집니다 — 변경 불가` label-12 muted(기획 원문, 태그와 병존 — 태그는 상태, 각주는 규칙).
**중 칸**: 레일 `산정 상태` → `기준액 30,000 → 한도 조정 — → 최종 —` mono-14(최종값만 600, 한글 sans-14) + 이유 1줄 sans-13 muted.
**우 칸**: 레일 `상태 · 다음 행동` → 1행 → 2행 → 버튼. V 레이아웃 `SPACE_BETWEEN`(텍스트 묶음 상단, 버튼 하단 — 아래 판정 패널과 연속).

**레드라인(단일 값)**: 칸 패딩 16, **모든 행 gap 4**(레일 아래도 4), 칸 사이·스트립 위아래 룰 1 `line/default` INSIDE(폭·높이 미가산), fill surface/default. 좌 칸 내용 높이 172 ≤ 176.

## 23. 기초 컨트롤 (7 세트 · 12 베리언트)

| 세트 | 베리언트 | 스펙 |
|---|---|---|
| Input | default / focus / readonly | 높이 36, 패딩 12, stroke 1 `line/input`(focus 2 accent), radius 4, 금액 입력 mono-14 우측 정렬, 인라인 보조 `기존 30,000 →` mono-13 muted 우측. readonly: fill surface/sunken, stroke 없음(발행된 버전 필드) |
| Radio | off / on | 18px, on = accent 링 2 + 점 8. 라벨 sans-14 gap 8. hit 40 |
| Checkbox | off / on | 18px radius 2, on = accent fill + ✓ inverse. hit 40 |
| Tab | default / active | 높이 32, 패딩 12, mono-13 `#1103`, active 하단 2px accent + text/primary, default text/muted. hit 40 |
| Toast | single | 우하단 24/24, 폭 360, fill surface/inverse, text/inverse sans-14, 링크 accent 밝기 `blue/100`, radius 8, shadow/float. `확정됨 · #1063 재검토로 전환` + 「#1063 열기」 |
| Dropdown | default | 높이 32(필터)/36(폼), stroke line/input, 우측 `▾` mono. 열림 상태는 프레임 없음 — 정의만 |
| Skeleton | single | fill skeleton/base, radius 4, 높이 = 대체 행 높이 |

셸(사이드바 220·상단바 56)은 프레임 템플릿 레이어로 두고 컴포넌트로 세지 않는다(변형 없음).

---

## 24. 조립 요소 (컴포넌트 세트 아님 — 프레임 안에서 텍스트·룰로 조립, draw-plan §0-2 예외)

두 요소는 등장 프레임이 2~3장뿐이고 베리언트 축이 없어 세트로 만들지 않는다. 대신 구조·토큰·레드라인을 여기 고정하고, 드로잉은 첫 프레임에서 조립한 뒤 복제한다.

### 24.1 EvidenceTimeline (본문 ② 증빙 — 보완 요청·제출 이력)

**목적** 요청 → 제출 → 검토를 시각순으로, 미검토 제출을 한 행으로 드러낸다(F-REVIEW-002 보완). **등장** T1-04ⓐ(1행) · T1-04ⓑ(2행) · 002-G/T3(재심 이력에 재사용 가능 — 정의만).

| 행 | 구성(H, gap 8) | 스타일 |
|---|---|---|
| request | `9/18 10:05` mono-13 muted(폭 88) · `요청 발송` sans-13 text/primary · `유통기한 판독 가능 사진` sans-13 secondary · `최민아` sans-13 muted(우측) | 높이 32, 하단 룰 1 `line/subtle` |
| submitted-unreviewed | `9/20 08:12` · `제출 1건` · `유통기한 라벨.jpg` text/link · 태그 `미검토`(outline `hold/fg`, sans/label-12) · `고객` muted | 행 fill `accent/tint`, 높이 32 + 썸네일 행(80×60 outline 1 `line/default`, 상단 gap 8) → 총 100 |
| reviewed(정의만) | `9/20 09:20` · `보완 확인 · 심사 재개` · `최민아` | 기본 스타일 |

폭 FILL(780), 위치: ② 요청 체크리스트 아래 gap 12. V 레이아웃, 행 gap 0(룰이 구분).

### 24.2 ResultSummary (판정 패널 주 행동 슬롯 — 확정 후)

**목적** 확정 버튼 자리를 **잠긴 결과**가 점유한다(빈자리 없음). BlockCard(sunken 면 + ink 바 = 막힘)와 달리 흰 면 + lock 글리프 = 끝남. **등장** T1-08 · T1-09 · T3-03.

| 행 | 내용 | 스타일 |
|---|---|---|
| 1 | lock 글리프 16 `text/primary` + `확정 9/20 09:30 · 최민아`(mono-13 + sans-13 text/secondary) | 높이 20 |
| 2 | `최종` sans/label-12 muted + `30,000` mono/value-16 600 text/primary(우측 정렬, 한글 `원` 없음 — 표 안 숫자만 규칙) | 높이 24 |
| 3 | `안내 근거 확정본` sans-13 secondary (T3-03: `재심 확정 9/28 · 최민아 · 반려(증빙 조작)` reject/fg) | 높이 20 |
| 4 | 「직권 재심」 secondary sm(T1-08·T1-09) / T3-03은 버튼 없음 + `조정 중(환수) — 재심 불가` label-12 muted | 32 |

**레드라인** 폭 368(패널 400 − 32), 패딩 16, 행 gap 8(버튼 위 12), fill surface/default, stroke 1 `line/strong`, radius 0, 좌측 바 없음(바 있는 것은 차단·지급·정보 배너뿐). 총 높이 16+20+8+24+8+20+12+32+16 = **156**.

---

## 접근성 이름 — 아이콘 전용 컨트롤 (2026-09-16 추가)

아이리스 Foundations · Writing의 배포 전 확인 10번("아이콘만 있는 버튼에 이름이 있는가")을 반영한다. 이름은 아이콘 모양이 아니라 **누르면 일어나는 일**로 쓴다(Writing의 동사 규칙).

| 컨트롤 | 위치 | 접근성 이름 | 적용 수 |
|---|---|---|---|
| Icon button(닫기 ✕) | 중복 비교 시트 T2-02 · T2-03 | `닫기` | 2 |
| Pagination 이전 | 큐 ⓐⓑⓒ · 1920 확장 | `이전 페이지` | 4 |
| Pagination 다음 | 큐 ⓐⓑⓒ · 1920 확장 | `다음 페이지` | 4 |
| Top navigation trailing(user) | 전 화면 셸 | `내 계정` | 34 |

**Figma 표기** 레이어명 `컴포넌트 · 이름`(예 `Icon button · 닫기`)과 Dev Mode 주석에 같은 문자열을 둔다. 구현 시 `aria-label`이 이 문자열이다.

**이름을 주지 않는 것(장식)** 라벨 있는 부모 안의 글리프 — 필드 꺾쇠, Filter button 아이콘, 브레드크럼 꺾쇠, 자물쇠, Alert·배너 아이콘, 빈 상태 일러스트, 체크 마커. 이들은 인접 텍스트가 이름을 이미 갖고 있어 이름을 중복으로 읽히게 한다.
