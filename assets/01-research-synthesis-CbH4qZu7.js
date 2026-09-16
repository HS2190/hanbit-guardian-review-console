var e=`# Research Synthesis: 한빛마트 매장 지킴이 리워드 — 심사 정책 관리·적용 솔루션 (트랙 B)

**Version:** v1.2 (revise 2회, 2026-09-14 — 검수 \`_review/research-review-2026-09-14.md\` 2차 반영. 재조사 없음. v1.1: 정밀도 교정 12건. v1.2: 부존재 단정 3곳(§1-4·Theme 3·I1)과 "확정순이 더 가까운 관행" 표현 교정. PM 최우선 독해본은 \`research-digest-v1.1.md\`(본문 v1.2))
**Method:** 유사 시스템 데스크 리서치 (버그바운티 플랫폼 · 공공 신고포상 규정 · 리테일 자율 보상제 · 정책 버저닝/시뮬레이션 도구 · 공정성 연구) | **Participants:** 0 (인터뷰·설문·티켓 없음 — 사용자 제공 자료 없음)
**Date:** 2026-09-14 (모든 URL 확인 시점 동일) | **Researcher:** Researcher agent (CREW)
**읽는 시간 목표:** 15분. 근거는 §2 테마와 §9 출처표에, 결정용 요약은 §1·§3·§4에.

> 이 리서치는 과제(채용 사전 과제, 5일)의 판단에 필요한 만큼만 다룬다. 과제 세계관(한빛마트)은 유지하되 레퍼런스는 같은 구조의 제보·보상 시스템에서 가져왔다. 관찰(출처가 있는 사실)과 해석(우리의 읽기)을 분리했고, 확인 못 한 문장은 "확인 필요", 추론은 "추정", 다른 맥락의 연구를 옮긴 것은 "유추"로 표시했다. "확인하지 못했다"는 공개 문서에서 못 찾았다는 뜻이지 부존재의 증명이 아니다. **우선순위·범위는 정하지 않는다(PM 몫).**

---

## 1. Executive Summary

1. **"접수 당시 정책 적용"은 우리의 발명이 아니라 명문 관행이다.** HackerOne 운영 가이드는 "bounty table이 바뀌면 그 날짜 이전 제출 리포트는 이전 테이블로 지급하라"고 명시하고, GitHub는 2026-07-27 하향 개편 때 "이전 제출분과 백로그는 이전 구조로 존중(grandfathering)"을 공식 선언했다. 한국 공공 포상 규정도 부칙 경과조치로 "시행 전 신고분은 종전 규정"을 쓴다(요약 확인, 원문 미확인). 반대로 소급 하향이 실제로 일어난 사례(HackerOne IBB 2026-05, Uber 2016)는 모두 "bait and switch", "trust issue"라는 언어로 언론화됐다.
2. **정책은 '수정'이 아니라 '새 버전 발행 + 구버전 보관'이 데이터 모델 관행이다.** Stripe Price는 금액 등 핵심 가격 조건의 변경을 새 Price 생성으로 관리하며, 옛 Price는 archive하고 기존 구독은 옛 Price를 유지한다. 변경 전 영향 확인은 AWS IAM Policy Simulator·GitHub Rulesets "Evaluate"처럼 "강제 적용과 평가를 분리하고, 결과를 만든 규칙을 보여주는" 패턴이 있다. 단 전자는 입력한 요청 맥락을 평가하고 후자는 실제 활동을 비강제로 관찰하는 것이라, 둘 다 이미 접수된 건에 대한 정책 변경의 영향을 보여주는 도구는 아니다.
3. **중복의 업계 정의는 "같은 조치(fix)로 해소되는가"이지 "같은 대상인가"가 아니다.** Bugcrowd: "Similar != same", "Many != systemic", "부모 발견을 고치면 자식을 고칠 필요가 없어질 때만 중복". 리테일 쪽은 캐나다 Scanner Price Accuracy Code가 "같은 UPC 여러 개면 첫 1개만 무료"로 *한 거래 안의* 보상 단위를 정하고, 이마트·롯데마트가 "한 번 방문에 여러 불량품 신고해도 1건"으로 *방문* 단위를 쓴다. 즉 "동일 SKU ≠ 동일 결함"의 좁은 명제는 뒷받침되지만, 어느 사례도 결함의 *경계*를 정해 주지 않으므로 우리 정의는 우리가 만들어야 한다.
4. **한도는 개인 누적 금액·횟수를 깎는 규정만 확인됐고, 지위 이전 규정은 확인하지 못했다.** 식약처(1인 연 100만원, 동일 업소 복수 위반은 최고액 1건), 연수구(월 10건, 같은 날 같은 장소 2건), 이마트(월 10회), SPAC(첫 1개만) 어디에서도 "한도 초과분이 차순위 신고자에게 넘어간다"는 규정은 확인하지 못했다(부존재 증명은 아님). 권익위의 다수 신고 기여도 배분(시행령 §80)은 과제의 "최초 유효자 1명 지급" 조건과 다른 모델이라 설계 범위에서 제외한다.
5. **행동경제학은 왜 하향 소급이 분쟁이 되는지 설명한다.** 같은 크기의 손실을 "약속된 것의 삭감"으로 제시하면 불공정 응답 61%, "얻지 못한 이득"으로 제시하면 20%(KKT 1986, 응답자 비율, 2차 출처). 기존 세입자 인상은 불공정하나 신규 세입자 고가는 공정 — "새 접수분부터 새 조건"이 심리적으로도 수용되는 구조다. 임금·보너스·임대 맥락을 제보 리워드로 옮기는 것은 유추다. 불리한 결과라도 근거 설명이 있으면 수용도가 오른다(Bies & Shapiro 1987/88, 수치 미확인).

**정본 §3 가정 4개 판정 요약:** (a) 접수 당시 정책 적용 — **강하게 뒷받침**(단 "심사자 선택 불가"는 직접 사례 없음 — 설계 선택). (b) 접수순 한도 배정 — **직접 사례 없음 — 설계 선택.** 개인 한도 배정 *시점·순서*를 명시한 시스템은 확인하지 못했다. 가장 가까운 유사물(버그바운티의 프로그램 예산 풀)은 지급 시점 차감(단 개인 한도 없음). 개인 연·월 한도를 둔 공공 제도는 지급 순 누적으로 보임(요약 확인). 지급(확정 이후) 시점 차감 유사 사례는 있으나 개인 한도 배정 *순서*는 확인하지 못했다 — 확정순은 운영 단순성을 비교할 설계 대안이다. (c) 개인 한도는 최초 유효자 지위를 바꾸지 않음 — **직접 근거 없음 — 설계 선택**(반증 0은 지지 근거가 아님). (d) 동일 SKU ≠ 동일 결함 — **좁은 명제만 뒷받침**("같은 SKU라도 다른 결함일 수 있다"까지. 사건 경계는 사례로 정해야). 상세는 §4.

---

## 2. Key Themes

### Theme 1 — 정책 버전과 발효: "접수 시점 고정"은 관행, "예약 발효"는 부가 (Q1)

**Prevalence:** "변경은 앞으로의 건부터" **명시**: HackerOne 가이드[S1]·GitHub[S2]·Stripe[S3]·복지부정수급(요약 확인)[S4]·권익위(요약 확인)[S5] / **미언급**: Bugcrowd·Stripe Radar / **위반 사례**: HackerOne IBB[S6]·Uber[S7]. HackerOne은 가이드(명시)와 IBB(위반) 양쪽에 있다.

**관찰**
- HackerOne 운영 가이드(Industry Best Practices): *"If a bounty table states a number for a certain severity level and then changes, any reports submitted before that date should be awarded to the previous bounty table."* / *"Always honor the commitments published at the time of the report."* / 보안 페이지는 changelog가 해커에게 보인다("Hackers will be able to see your security page changelog"). [S1]
- GitHub 버그바운티 개편(발효 2026-07-27, 공개 티어 상한 하향·고정액 전환): *"Reports submitted before these changes take effect will be honored under the previous bounty structure. We're grandfathering the backlog so that only reports made on or after July 27, 2026 will be assessed with the new structure."* 고정액 전환 이유: *"Ranges sound flexible, but in practice they create uncertainty for researchers and overhead for our team. Static payouts set clear expectations on both sides."* [S2]
- Stripe Price 객체: 금액 등 핵심 가격 조건의 변경은 새 Price 생성으로 관리하며, 기존 구독은 옛 Price를 유지한다. *"you can't change a price's amount in the API. Instead, we recommend creating a new price for the new amount, switch to the new price's ID, then update the old price to be inactive."* archive 시 *"any existing subscriptions that use the price remain active until they're canceled."* [S3]
- 복지부정수급 신고포상금 규정(보건복지부 훈령): 부칙에 "시행 전 신고분은 종전 규정에 따른다"는 경과조치 존재(요약 확인, 원문 문구 **확인 필요**). 탈세제보포상금 지급규정·부패신고 운영지침도 부칙에 적용례·경과조치를 둔다(원문 **확인 필요**). [S4][S5]
- 반례 1 — HackerOne IBB(2026-05-21): Critical $9,250→$2,257 등 75~89% 하향이 *이미 수정·크레딧까지 끝난* 리포트에 적용됐다는 것이 연구자 측 주장. 연구자(J. Ciolek): *"The trust issue here is that the change was effectively applied long after the work was already done, fixed, and publicly credited under a different expectation."* HackerOne이 인정한 사실: *"bounty levels automatically adjust based on the contributions from active participating sponsors."* (자동 조정은 인정, 소급 적용 여부에 대한 직접 답변은 기사에 없음) [S6]
- 반례 2 — Uber(2016-03, 런칭 1주 내): 첫 리포트 승인 후 범위 문구를 조용히 좁혀 이미 제출된 유사 리포트 무효화. 연구자(S. Melia): *"it was kind of like a bait and switch"* — 변경 자체보다 "알리지 않고 문구를 바꾼 것"을 문제 삼음. Uber: *"we have been reacting to the types of issues sent in and learning how to better define what we are looking for."* [S7]
- 변경 전 영향 확인 도구: AWS IAM Policy Simulator는 *입력한 요청 맥락*(주체·행동·리소스)에 대해 allow/deny를 평가하고 *"which policy produced that outcome"*을 표시(Custom 모드는 저장 없이 검증). GitHub Rulesets "Evaluate" 상태는 *실제 활동*에 대해 *"will not be enforced, but you will be able to monitor which actions would or would not violate rules on the Rule Insights page"*. [S8][S9]

**해석**
- 접수 시점 정책 고정은 업계·공공 모두에서 "정직한 운영"의 정의로 쓰인다. 소급 사례 둘의 공통점은 *금액의 크기*가 아니라 *"이미 한 일에 대한 약속이 사후에 바뀌었다"* + *"알리지 않았다"*이다.
- IBB의 "스폰서 기여금에 따라 자동 조정"은 과제 원문의 "지점 예산 압박 → 정책 하향"과 가장 가까운 실사례다 — 예산 사정으로 금액이 내려가는 것 자체는 정당할 수 있지만, 그것이 *이미 접수된 건*에 닿는 순간 분쟁이 된다는 점이 과제의 문제 상황과 정확히 겹친다.
- IAM Simulator와 Rulesets Evaluate는 대상이 다르다(입력한 가상 요청 vs 실제 활동). 공통점은 **"강제 적용과 평가를 분리하고, 결과를 만든 규칙을 보여준다"**까지다. 둘 다 이미 접수된 건에 정책 변경이 미치는 영향을 보여주는 도구가 아니므로, 우리 '영향 확인'에 그대로 옮기면 "대기 8건이 범위 밖이 된다"는 잘못된 메시지가 된다. 이전할 것은 *패턴*(강제 전에 결과와 원인을 보여준다)이지 *대상*이 아니다.
- GitHub가 '범위 금액'을 '고정 금액'으로 바꾼 이유("불확실성")는 트랙 A·B 모두에 시사점: 심사자에게 재량 범위를 주는 것보다 정책이 금액을 확정하는 쪽이 분쟁을 줄인다.

**Implication:** 정본 단일 원칙 중 "접수 당시 정책 적용"은 관행 채택으로 서술 가능. "심사자는 정책 선택 불가"는 직접 사례가 없는 설계 선택으로 따로 표기. '영향 확인' 화면은 "강제 전 결과+원인 규칙 표시" 패턴만 빌리고 대상은 "향후 접수분 / 기존 접수분 부담 유지"로. changelog 가시성(HackerOne)은 트랙 A 접점 근거.

### Theme 2 — 중복 판정: 기준은 "같은 조치로 해소되는가", 절차는 "선순위 링크 + 상태 연동" (Q2, Q3)

**Prevalence:** "같은 조치(fix)로 해소되는가" 기준 **명시**: Bugcrowd[S10]·HackerOne 분석가[S13]. "같은 사건 = 1건" 규칙 **보유**: 식약처(동일 업소)[S17]·부평구(동일 건)[S18]·이마트(방문)[S22]·롯데마트(방문)[S24]·SPAC(거래 내 UPC)[S21] — '사건'의 단위는 다섯 제도가 각각 다르다.

**관찰**
- Bugcrowd 3원칙: *"Touch the code (or make a change), pay the bug"*, *"Similar != same"*, *"Many != systemic"*. 진짜 중복은 *"fixing the parent finding removes the need to fix the duplicate finding"*일 때뿐. 같은 취약점 유형이 여러 곳에 흩어져 각각 수정이 필요하면 각각 보상. 시스템적(systemic) 이슈는 첫 리포트만 보상하고 이후는 중복. [S10]
- Bugcrowd 상태 규칙: *"If you mark a submission as a duplicate, you must specify the submission that it duplicates."* 중복자의 포인트는 *"when the original bug is accepted by the Program Owner"*에 지급. [S11][S12]
- HackerOne 트리아지 분석가: 중복은 *"either the program is already aware of the bug ... or based on their internal analysis the bug shares the same root cause as another bug already reported, hence can be remediated with the same fix."* 순서: 정보성/중복/해당없음 선별 → 재현 → 프로그램 전달 → 심각도. [S13]
- HackerOne 중복 UI: 원본 리포트 번호를 검색해 연결. 중복 제출자에게는 원본의 *"Report ID with a link, Report state, Report title, Submission date, Severity and score"*만 보여줄 수 있음(전문 공개는 선택). 평판: 중복은 *"Only applied if reported before the original was closed"* 조건부 +2. 원본이 무효화될 때 차순위가 자동 유효화되는지는 공개 문서에서 확인하지 못함. [S14][S15]
- HackerOne 상태: *Needs More Info — "Reports in this state for more than 30 days automatically close as informative."* 종결 상태는 Resolved / Informative / Duplicate / Not Applicable / Spam로 분리. [S16]
- 공공: 부평구 무단투기 포상 — 동일 건 2인 이상 신고 시 *먼저 신고한 자*에게만 지급, 서로 다른 위반은 각각 지급. 연수구 — 동일인 월 10건, *같은 날 같은 장소* 위반은 2건까지. 식약처 부정불량식품 — 신고 내용별 최대 1천만원, 1인 연 100만원(기관별 한도 별도), *동일 업소 복수 위반은 최고 금액 1건 기준*, 타 법령으로 이미 포상된 동일 사항·이미 진행 중인 사항은 미지급. "먼저 신고한 자" 조항은 요약으로만 확인(원문 **확인 필요**). [S17][S18][S19]
- 공공의 다른 모델: 부패방지권익위법 시행령 §80 — *"동일한 부패행위에 대하여 2명 이상이 각각 신고한 경우 ... 이를 하나의 신고로 본다"*, 위원회가 *"기여한 정도 등을 종합적으로 고려하여 각각의 신고자에게 배분"*. [S20]
- 리테일 사건 단위: 캐나다 Scanner Price Accuracy Code — 스캔가 > 표시가면 $10 미만은 무료, 이상은 $10 할인. *"If more than one of the same item is being purchased, the customer receives the first one for free, and subsequent items with the same UPC should be priced according to the display."* 유사품(같은 브랜드 다른 맛)은 1개만. 선반 태그와 상품 UPC가 불일치하면 코드 미적용. [S21]
- 이마트 품질불량상품 보상: 유효기간 경과·규격미달·이물질·파손 등, *1회당 5천원 상품권*, "동시 접수 시에도 1건", 구매 후 1개월, 영수증 필수, *1인 월 10건*. 이마트 계산착오 보상: 매장 표시가와 영수증 불일치 시 *차액 + 5천원 상품권*, 1일 1회, 셀프계산대 제외. 롯데마트 품질보증제: 유통기한 경과(구입일 기준)·파손·표시와 다른 경우 등 5천원 상품권, 1회 방문 여러 불량품도 1건, 구입 후 30일(신선 2일), 월 10회. 홈플러스 신선 A/S: 맛·신선도 불만족 시 100% 교환·환불(리워드 없음). [S22][S23][S24][S25]
- 국내 대형마트에 *비구매 고객의 매장 결함 제보에 리워드를 주는* 실존 제도는 이번 조사에서 찾지 못함. 실존 제도는 모두 **구매 기반 사후 보상**이다(관찰).

**해석**
- 업계의 중복 기준을 마트 언어로 옮기면 "**같은 원인·같은 시정 대상인가**"라는 *판단 질문*이 된다. 이것은 확정 기준이 아니다 — "한 번의 매장 조치"를 기준으로 삼으면 직원의 작업 묶음이 사건 수를 결정하는 반례가 생긴다(같은 SKU 파손품 2개를 직원이 한 번에 폐기했는지 두 번에 나눠 폐기했는지에 따라 보상 대상 수가 달라져서는 안 된다). 대표 사례 대입: 같은 SKU 파손품 2개는 원인(각 개체의 손상)과 시정 대상이 다르므로 별건, 한 가격표 오류를 여러 고객이 찍은 것은 원인·시정 대상이 하나이므로 같은 건, 수정 후 재발은 새 원인이므로 새 건. **개별 상품/로트 경계**(같은 로트 불량 N개는 1건인가 N건인가)는 이 질문만으로 정해지지 않으며 대표 사례로 정해야 한다. SPAC "같은 UPC 첫 1개만"은 한 거래 안의 보상 단위 규칙이고, 이마트·롯데 "방문당 1건"은 운영 편의 단위다 — 둘 다 결함 경계의 근거는 아니다.
- Bugcrowd "중복자 포인트는 원본 승인 시 지급"과 HackerOne "원본이 닫히기 전 제출" 조건은 *포인트·평판 지급*이 선순위 상태에 종속된다는 것이지, 차순위의 *판정*이 확정 불가라는 뜻은 아니다. 우리 과제에서 차순위가 선행 판정을 기다리는 이유는 별개다 — "최초 유효자" 조건은 더 이른 후보의 유효성이 정해져야 충족 여부가 결정되기 때문이다. 정본의 "선행 판정 대기"는 이 조건 종속을 상태로 드러낸 우리의 설계다.
- 선순위 무효 시 차순위 자동 유효화 규정은 **공개 문서에서 확인하지 못했다**. 공백이지 반증이 아니다. 정본 계획("자동 재검토, 자동 승인 아님")은 공백을 메우는 설계 선언으로 두는 것이 정직하다.
- 권익위의 기여도 배분은 다수 제보자에게 나누는 모델이라 과제의 "최초 유효자 1명 지급" 조건과 다르다 — 설계 범위에서 제외한다.

**Implication:** 중복 후보 비교 패널의 비교 축은 SKU가 아니라 **원인·시정 대상**(지점·상품 개체·결함 종류·시점·증빙)이어야 한다. 중복 판정에는 원본 링크 필수(Bugcrowd) + 원본 상태 표시(HackerOne 제한 공개 세트가 참고 스펙: ID·상태·제목·접수시각·등급). 보완 대기에는 만료 규칙이 있어야 큐가 막히지 않는다(HackerOne 30일은 참고 사례이지 우리 적정치가 아님).

### Theme 3 — 한도: 개인 누적 금액·횟수 감액만 확인, 지위 이전 규정은 미확인 / 개인 한도 배정 시점·순서도 미확인 (Q2 ③, 가정 b·c)

**관찰**
- 한도의 형태: 식약처 1인 연 100만원 + 기관별 한도, 대구 북구 월 20건·연 30만원, 연수구 월 10건, 원주 월 25만원, 부평구 연 100만원, 이마트 월 10회, 이마트 계산착오 1일 1회, SPAC 같은 UPC 첫 1개. 모두 *신고자 개인의 누적*을 깎는 규정이며, 초과분을 다른 신고자에게 넘긴다는 규정은 확인하지 못함. [S17][S18][S19][S22][S21]
- 금액 결정 시점(버그바운티, **프로그램 예산 풀** — 개인 한도 아님): Bugcrowd — *"can reward a researcher at any point in the submission process"*, 추천은 Triaged→Unresolved 전환 시. 추천액은 우선순위(P1~P5)+VRT로 산출되며 범위를 벗어나면 *연구자에게 보낼 설명 메모가 필수*. *"You cannot change the reward after you click Pay"*, 지급 시 풀에서 차감. HackerOne — 리포트 뷰의 bounty calculator가 *asset × severity*로 제안액 표시, 커스텀 가능, 최소 $50, *"bounties can't be removed once awarded. Award values are cumulative"* (증액만). [S12][S26]
- 접수 시각 기준 우선권: 부평구 "먼저 신고한 자", HackerOne 중복 평판 "원본이 닫히기 전 제출". 개인 한도를 *접수 시각순*으로 배정하는 규칙은 공개 문서에서 확인하지 못함. [S18][S15]

**해석**
- (c) "한도는 지위를 바꾸지 않는다" — 모든 제도가 개인 누적을 깎는 구조라는 점은 일치하나, 어느 제도도 "한도 소진자가 최초 유효자일 때 차순위에게 넘기지 않는다"고 명시하지 않고 반증도 없다. 반증 0은 지지 근거가 아니므로 **직접 근거 없음 — 설계 선택**으로 둔다. 문제 자체가 제기된 적 없는 것으로 보인다(추정). 과제에서 이 공백을 드러내는 것 자체가 '숨은 문제'의 가치다.
- (b) 개인 한도 배정 *시점·순서*를 명시한 시스템은 확인하지 못했다. 가장 가까운 유사물은 버그바운티의 *프로그램 예산 풀*로, 지급 시점에 차감된다(Bugcrowd 풀 차감, HackerOne 누적 증액) — 단 이는 프로그램 예산이지 개인 한도가 아니다(두 플랫폼 모두 개인 한도 없음). 개인 연·월 한도를 둔 공공 제도(식약처·지자체)는 지급 순 누적으로 보인다(요약 확인). 따라서 **접수순은 우리의 설계 선택**이다. 지급(확정 이후) 시점 차감 유사 사례는 있으나 개인 한도 배정 *순서*는 확인하지 못했고, 확정순은 운영 단순성을 비교할 설계 대안이다. 접수순은 고객에게 항상 더 주는 방식이 아니라 처리 순서가 결과를 바꾸지 않게 하는 방식이며, 그 대가는 같은 고객의 선행 건이 미판정일 때 후속 건 확정 지연이다(반례 손계산은 digest §3 R2′; 중복 선행 대기 R2는 배정 방식과 무관).
- "확정 후 취소 불가·증액만"(HackerOne)은 정본의 "확정 시 잠금 + 지급 후 번복은 별도 조정"과 정합.

**Implication:** 산식 패널의 표준 위계는 *정책 기준액(접수 정책 × 결함 유형) → 한도 조정 → 최종액*. 결함 유형 등 *사실 판단*을 수정할 때 사유를 기록하고 금액은 정책에서 재계산한다(Bugcrowd의 "범위 이탈 시 사유"를 우리 원칙에 맞게 옮긴 것 — 금액을 손으로 바꾸는 재량은 두지 않음). 접수순 배정은 "우리가 고른 이유"를 대안 비교로 써야지 관행이라 주장하면 안 된다.

### Theme 4 — 심사 화면: 결과보다 "왜"가 먼저 보이는 위계 (Q4)

**관찰**
- Stripe Radar 리뷰 큐: 목록 뷰(세부 없이 훑기)와 상세 뷰(맞춤 결제 컨텍스트) 분리. 리뷰 객체의 \`reason\` 필드가 왜 큐에 들어왔는지(rule / manual / …)를 구조화해 담는다. 규칙 매칭 시 결제는 정상 처리하고 큐에만 추가(차단과 검토 분리). 행동은 approve / refund / refund as fraud 3종. [S27]
- AWS IAM Policy Simulator: 결과(allow/deny)와 함께 *어느 정책이 그 결과를 만들었는지* 표시. GitHub Rule Insights: 어떤 규칙이 pass/fail했는지, 누가, 어느 브랜치에서. [S8][S9]
- HackerOne 리포트 뷰: asset·weakness·severity 필드 + CVSS 계산기, 제안액은 bounty table에서 자동. 자산 식별이 *scope 여부*와 *어느 bounty tier 대상인지*를 결정. 트리아지 순서: 선별(정보성/중복/해당없음) → 재현 → 심각도 → 금액. [S26][S28][S13]
- Bugcrowd: 추천 범위 이탈 시 설명 강제. HackerOne 가이드: *"clearly communicate to hackers your reasons for awarding or declining a bounty."* [S12][S26]

**해석**
- 좋은 심사 화면의 공통 위계: **① 왜 여기 있나(진입 사유·적용 규칙) → ② 사실(증빙·재현) → ③ 판정 → ④ 결과(금액)와 그 산식 → ⑤ 행동(소수, 비가역 표시)**. 실패 패턴은 결과(금액 입력)가 먼저 보이고 규칙이 뒤에 숨는 것 — Uber·IBB 분쟁의 공통점은 심사자가 아니라 *제보자가 규칙을 못 봤다*는 점이므로, 심사 화면의 근거 패널은 곧 고객 안내 문구의 원천이어야 한다.
- 차단된 행동의 이유 표시는 IAM simulator("어느 정책이 deny를 만들었나")가 직접 참고 — "선행 후보 검토 필요 → 열기"가 비활성 버튼보다 이 패턴에 가깝다.

**Implication:** 심사 상세의 첫 화면 정보는 "접수 시각 + 접수 당시 조건"이며, 금액 입력이 아니라 금액 *산식*이 보여야 한다. 큐는 Stripe처럼 진입 사유(보류 이유)를 구조화 필드로.

### Theme 5 — 공정성 심리: "약속된 것의 삭감"은 "얻지 못한 이득"보다 불공정하게 읽힌다 (Q5)

**관찰**
- Kahneman·Knetsch·Thaler(1986) 전화 설문: *"Only 20% of respondents consider it unfair for a company to eliminate a ten-percent annual bonus, whereas 61% consider it unfair to reduce wages by ten percent."* / 인플레 0%에 7% 삭감은 인플레 12%에 5% 인상보다 훨씬 불공정(실질 동일). / *"People consider it unfair for a landlord to raise rents on existing tenants, yet fair to charge a new tenant a higher price when the old tenant leaves."* / 눈보라 후 눈삽 $15→$20: 82% 불공정. 이론: 거래 당사자는 *reference transaction*(기준 거래)에 대한 권리를 가지며(dual entitlement), 기준 대비 손실을 부과하는 것은 불공정, 이익을 유지하는 것은 허용. 수치는 응답자 비율이며 2차 출처에서 확인. [S29][S30]
- Bies & Shapiro(1987, 1988): 불리한 결정에 관리자의 정당화(설명)가 있으면 공정성 인식과 결과 수용이 높아짐(interactional justice). 수치는 2차 자료에서 확인 못 함(**확인 필요**). [S31]
- 실사례 언어: IBB 연구자 *"applied long after the work was already done ... under a different expectation"*; Uber *"bait and switch"*; Ciolek(2026-01) *"Bug bounty programs run on trust and clarity. If a program is paused, defunded, or otherwise inactive ... it needs to be communicated."* [S6][S7][S32]

**해석**
- 과제의 "30,000→10,000원 하향 지급" 분쟁은 KKT의 '기준 거래 대비 손실'에 해당한다(유추 — 원 연구는 임금·보너스·임대 맥락). 제출 시점에 본 30,000원이 기준 거래가 되고, 이를 깎는 것은 같은 20,000원을 '주지 않는 것'보다 불공정하게 읽힌다(61% vs 20%).
- "신규 세입자 고가는 공정"은 곧 "새 접수분부터 새 조건"이 심리적으로도 수용된다는 뜻이다(유추). 단일 원칙은 예산 논리뿐 아니라 공정성 인식 논리로도 설명된다.
- 인용된 실사례들은 금액보다 *커뮤니케이션 부재*를 불신의 원인으로 지목한다. 결과 안내에 근거(접수 당시 조건·산식)를 붙이는 것은 장식이 아니라 수용도 장치다.

**Implication:** 문제 정의의 "공정성 분쟁"에 KKT 수치를 "응답자 비율, 유추"로 표기해 인용하면 "왜 문제인가"가 정량 근거를 갖는다. 상향 소급을 안 해도 불공정으로 읽히지 않는다(이득 유지는 허용) — "유리한 상향 선택 적용" 삭제 결정과 정합.

---

## 3. Insights → Opportunities

| # | Insight (관찰 기반) | 출처 | Opportunity | PM이 내릴 수 있는 결정 | Impact | Effort |
|---|---|---|---|---|---|---|
| I1 | "접수 시점 정책 적용"은 HackerOne 가이드·GitHub 2026 개편·공공 경과조치(요약 확인)가 공유하는 명문 관행이다 | S1 S2 S4 | 단일 원칙을 "관행 채택"으로 서술. 대안 "이벤트 중 변경 금지"는 채택 사례를 확인하지 못함 — 기각 근거로는 약함. 기각 논거는 '이벤트 중 예산 압박이 변경 동기(과제 원문)라 변경 금지는 문제 회피'가 되어야 함(PM 판단) | 원칙 (a) 확정, 버린 대안 1의 기각 사유 확보 | High | Low |
| I2 | 소급 하향 실사례 2건(IBB 2026-05, Uber 2016)의 분쟁 언어는 금액이 아니라 "이미 한 일에 대한 사후 변경 + 미통지"다. IBB의 "스폰서 기여금에 따른 자동 조정"은 과제의 "예산 압박 → 하향"과 가장 가까운 실사례 | S6 S7 | 문제 정의에 실사례 인용(연구자 주장과 플랫폼 인정 사실 구분), 변경 changelog/통지를 트랙 A 접점으로 | "왜 문제인가"의 근거 확정 | High | Low |
| I3 | 정책 객체는 새 버전 발행 + 구버전 archive가 관행(Stripe Price), 기존 계약은 옛 버전으로 지속 | S3 | 정책 버전 불변화·초안/발행 분리 근거 | 정책 편집 화면의 발행 모델 확정 | High | Low |
| I4 | IAM Simulator·Rulesets Evaluate는 "강제 적용과 평가를 분리하고 결과를 만든 규칙을 보여주는" 패턴. 대상은 각각 입력한 요청 맥락 / 실제 활동이며, 이미 접수된 건의 소급 영향은 다루지 않는다 | S8 S9 | 영향 확인 화면: 패턴은 차용, 메시지는 "향후 접수분부터 / 기존 접수분 부담은 유지" | 영향 확인의 정보 구조·문구 방향 확정 | High | Med |
| I5 | 중복의 업계 정의는 "같은 조치로 해소되는가"(Bugcrowd·HackerOne). 마트 언어로는 "같은 원인·같은 시정 대상인가"라는 판단 질문. 개별 상품/로트 경계는 사례로 정해야 | S10 S13 | 중복 비교 축 = 원인·시정 대상(지점·상품 개체·결함·시점·증빙), SKU 일치는 후보군 생성 조건일 뿐 | 숨은 문제 1(동일 SKU≠동일 결함)의 판단 질문 확정 + 로트 경계 사례 결정 | High | Med |
| I6 | 중복 판정에는 원본 링크 필수(Bugcrowd)·원본 상태 제한 공개(HackerOne). 선순위 무효 시 차순위 처리는 공개 문서에서 확인 못 함. 우리의 "선행 판정 대기"는 최초 유효자 조건에서 나온 설계 | S11 S14 S15 | "선행 판정 대기" 상태 + 원본 상태 카드(ID·상태·제목·접수시각·등급) | 숨은 문제 2의 처리 규칙을 '설계 선언'으로 두기 | High | Med |
| I7 | 한도는 개인 누적 금액·횟수를 깎으며 지위 이전 규정은 확인 못 함. 개인 한도 배정 시점·순서를 명시한 시스템도 확인 못 함 — 가장 가까운 유사물(프로그램 예산 풀)은 지급 시점 차감, 공공 개인 한도는 지급 순 누적으로 보임(요약 확인). 확정 후 취소 불가·증액만 | S12 S17 S18 S26 | 접수순 배정은 "처리 순서 독립성을 위해 확정 지연을 감수하는 선택"으로 대안 비교; 확정 시 잠금 | 가정 (b)(c)의 서술 톤 결정, 버린 대안 3 근거 | Med | Low |
| I8 | 기준액 이탈 시 사유 메모 강제(Bugcrowd), 제안액은 테이블×등급 자동(HackerOne) | S12 S26 | 산식 패널: 기준액→한도→최종. 결함 유형 등 사실 판단 수정 시 사유 기록, 금액은 정책에서 재계산 | 심사자 재량 범위와 기록 규칙 확정 | Med | Low |
| I9 | Needs More Info 30일 자동 종료(HackerOne) — 참고 사례, 적정치 아님 | S16 | 보완 대기 만료 규칙 | 상태 모델의 보완 대기 정의·기간 | Med | Low |
| I10 | 같은 손실을 "약속된 것의 삭감"으로 제시하면 불공정 응답 61%, "얻지 못한 이득"으로 제시하면 20%(KKT 1986, 응답자 비율, 2차 출처, 임금·보너스 맥락 → 유추); 설명은 불리한 결과 수용을 높인다 | S29 S30 S31 | 결과 안내에 접수 당시 조건·산식 근거 카드; 상향 소급 미적용을 정당화 | 문제 정의 정량 근거, 트랙 A 근거 카드 범위 | High | Low |
| I11 | 국내 마트 실존 제도는 구매 기반 5천원 상품권·월 10회·방문당 1건 (이마트·롯데) | S22 S24 | 세계관의 금액·한도 스케일 참고, "방문당 1건"은 결함 경계와 다름을 명시 | 대표 사례 3개의 금액·한도 수치 현실화 여부 | Low | Low |
| I12 | 권익위는 다수 신고를 "하나의 신고로 보고 기여도 배분"(시행령 §80) — 과제의 "최초 유효자 1명 지급" 조건과 다른 모델 | S20 | 설계 범위 밖 한 줄로만 명시 | (결정 없음 — 범위 밖) | Low | Low |

---

## 4. 정본 §3 가정 4개 — 뒷받침 / 반증

| 가정 | 유사 시스템의 실제 관행 | 판정 | 비고 |
|---|---|---|---|
| (a) 접수 당시 정책 적용, 새 정책은 발효 후 접수분부터, 심사자는 정책 선택 불가 | HackerOne 가이드 명문화[S1], GitHub 2026-07-27 grandfathering[S2], 복지부정수급 규정 경과조치[S4](요약 확인, 원문 미확인), Stripe 기존 구독 유지[S3]. 반례(IBB·Uber)는 분쟁화[S6][S7] | **강하게 뒷받침** (접수 당시 정책 적용에 한해) | **"심사자 선택 불가"는 직접 사례 없음 — 설계 선택.** HackerOne은 커스텀 금액을 허용하되 사유 소통 권고, Bugcrowd는 범위 이탈 시 사유 강제[S12] — '선택 불가'는 그보다 강한 선택 |
| (b) 개인 한도는 접수순 배정 + 확정 시 잠금 | 개인 한도 배정 *시점·순서*를 명시한 시스템 확인 못 함. 가장 가까운 유사물(프로그램 예산 풀)은 지급 시점 차감(Bugcrowd 풀 차감, HackerOne 누적 증액)[S12][S26] — 단 개인 한도 없음. 개인 연·월 한도를 둔 공공 제도는 지급 순 누적으로 보임(요약 확인)[S17][S18]. 외부의 award/Pay 이후 변경 제한과 우리 지급 확정 잠금은 유사하나 동일 단계는 아님 | **직접 근거 없음 — 설계 선택** | 지급(확정 이후) 시점 차감 유사 사례는 있으나 개인 한도 배정 *순서*는 확인 못 함. 확정순(버린 대안 3)은 운영 단순성을 비교할 설계 대안. 접수순의 논거는 관행이 아니라 *처리 순서 독립성*이며 대가는 같은 고객 선행 건 미판정 시 후속 건 확정 지연 — 반례 손계산은 digest §3 R2′. 반증은 아님 |
| (c) 개인 한도는 금액만 제한, 최초 유효자 지위를 바꾸지 않음(차순위 이전 없음), 부분 지급 허용 | 식약처·지자체·이마트 모두 개인 누적/횟수 제한이며 초과분의 타인 이전 규정 확인 못 함[S17~S19][S22]. 명시적 "이전 안 함" 조항도 확인 못 함 | **직접 근거 없음 — 설계 선택** (반증 0은 지지 근거가 아님) | 문제 자체가 제기된 적 없는 공백(추정). 과제에서 이를 '숨은 문제'로 드러내는 것이 가치. 부분 지급(잔여 20,000 → 20,000)의 외부 유사 사례는 확인 못 함 — SPAC "첫 1개 무료"는 거래 내 보상 단위 규칙이라 부분 지급 근거로 쓰지 않음 |
| (d) 동일 SKU ≠ 동일 결함 (후보군은 지점·상품·결함·시점·사진 비교, SKU 일치만으로 자동 확정 금지) | Bugcrowd "Similar != same / Many != systemic / 같은 fix로 해소될 때만 중복"[S10], HackerOne "same root cause, same fix"[S13] | **좁은 명제만 뒷받침** — "같은 SKU라도 다른 결함일 수 있다"까지 | 판단 질문은 "같은 원인·같은 시정 대상인가". "한 번의 매장 조치"를 확정 기준으로 쓰면 직원의 작업 묶음이 사건 수를 결정하는 반례 발생. 개별 상품/로트 경계는 대표 사례로 정해야 함. 이마트·롯데 "방문당 1건"[S22][S24]·SPAC "거래 내 첫 1개"[S21]는 결함 경계 근거 아님 |

**추가로 뒷받침되는 정본 항목:** 보완 대기 상태(HackerOne NMI + 30일 만료 — 참고 사례)[S16], 심사 결과 축 분리(Resolved/Informative/Duplicate/N-A/Spam)[S16], 확정 후 잠금·번복은 별도 조정(HackerOne "can't be removed", Bugcrowd "cannot change after Pay")[S26][S12], 원본 링크 필수(Bugcrowd)[S11], 변경 이력의 제보자 가시성(HackerOne changelog)[S1].

**설계 범위 밖:** 다수 제보자 기여도 배분(권익위 시행령 §80)[S20]은 과제의 "최초 유효자 1명 지급" 조건과 다른 모델이라 설계 범위에서 제외한다.

---

## 5. User Segments (페르소나 기초 자료)

> 인터뷰 0건. 아래는 유사 역할(버그바운티 프로그램 오너·트리아지 분석가, 마트 고객만족센터 운영 규정, 지자체 포상 담당)의 공개 자료에서 **유추한 추정**이다. "실수 유형"은 리서치 출처가 있는 것과 계획(§3)에서 역산한 것을 구분했다. PM이 페르소나로 쓸 때 "추정" 표기를 유지할 것.

| 세그먼트 | 특성(추정) | 목표 | 두려움 | 실수 유형 | 정보 요구 |
|---|---|---|---|---|---|
| **지점 담당자** (자기 지점 이벤트·정책 관리, 심사 완료 건 매장 조치) | 매장 운영 겸직, 백오피스 체류 시간 짧음, 예산 압박이 정책 변경의 동기(과제 원문). Uber 사례의 프로그램 오너처럼 "들어오는 제보 유형을 보며 범위를 배워가는" 중[S7] | 예산 안에서 이벤트 유지, 결함이 실제로 고쳐지는 것, 고객 항의 안 받기 | "정책을 낮췄는데 이미 들어온 건 때문에 예산이 초과된다", "내가 바꾼 게 본사 심사를 꼬이게 한다", 고객 반발이 지점으로 옴 | *리서치에서*: 변경이 기존 건에 어떻게 작용하는지 모른 채 발행(IBB·Uber형)[S6][S7]. *계획에서 역산*: 예약 발효를 잊음, 범위 축소를 '이미 접수된 건 무효화'로 오해, 미지급액을 쓸 수 있는 예산으로 착각 | 발행 전: 기존 접수분 부담(지급 완료/확정 미지급/최대 노출액)과 향후 변경분의 *경계*. 발행 후: 어떤 버전이 언제부터 누구에게 적용됐는지 changelog. 조치 대기 목록 |
| **본사 심사 담당자** (제보 검토·심사·중복 판정·리워드 확정) | 다지점 큐를 처리하는 트리아지 역할. HackerOne 분석가처럼 "선별→재현→등급→금액" 순서로 일하고, 리포트 품질(사진·위치·시각)이 처리 속도를 좌우[S13]. 다수 심사자 간 일관성 압박(범위 밖 리스크) | 빠르고 일관된 처리, 분쟁 안 만들기, 기록이 남아 나중에 설명 가능 | "어떤 정책일 때 접수됐는지 몰라 잘못 적용"(과제 원문), 선순위 미확정인데 차순위를 먼저 확정, 개인 한도 계산 순서가 사람마다 다름, 확정 후 번복 요구 | *리서치에서*: 현재 정책을 접수 정책으로 착각(HackerOne calculator는 접수 시점 테이블 자동 적용을 공개 문서에서 확인 못 함)[S26], 보완 대기 무한 방치(HackerOne 30일 만료의 존재 이유)[S16]. *계획에서 역산*: SKU만 보고 중복 확정, 같은 SKU 다른 파손품을 중복으로 뭉침, 한도 0원을 반려로 표시 | 접수 시각 + 접수 당시 조건(버전보다 조건이 먼저), 증빙, 중복 후보의 원본 상태 카드(ID·상태·접수시각·등급), 산식(기준액→한도→최종), 차단된 행동의 이유, 고객 안내 문구의 원천 데이터 |

**세그먼트 간 접합부(문제가 생기는 곳):** 지점이 바꾸는 시점과 본사가 적용하는 시점이 다르고(수일~수주), 둘 다 상대의 화면을 보지 않는다. 트랙 B는 이 접합부를 한 데이터(접수 시 고정된 버전)로 묶는 화면이다 — 정본의 트랙 B 선택 이유와 일치.

---

## 6. Recommendations (PM에게 — 근거 기반 제안, 결정은 PM)

1. **[High] "접수 당시 정책 적용"을 "관행 채택"으로 서술하고, 문제 정의에 실사례·수치를 붙인다.** — I1·I2·I10. HackerOne 가이드 문장, GitHub grandfathering 문장, KKT "61% vs 20%(응답자 비율)"를 그대로 인용하면 "왜 문제인가"와 "왜 이 원칙인가"가 각각 외부 근거를 갖는다. KKT는 유추임을, IBB는 연구자 주장과 플랫폼 인정 사실을 구분해 쓴다. 리스크: 인용을 나열하면 심사관에게 리서치 과시로 읽힘 — 각 1문장씩만.
2. **[High] 중복 판단 질문을 "같은 원인·같은 시정 대상인가"로 두고, 개별 상품/로트 경계는 대표 사례로 정한다.** — I5·I6. 대표 사례 3개(같은 SKU 다른 파손품 / 한 가격표 오류 다수 제보 / 수정 후 재발)를 이 질문에 대입하면 각각 별건·같은 건·새 건으로 갈린다. "한 번의 매장 조치"는 확정 기준으로 쓰지 않는다(작업 묶음이 사건 수를 결정하는 반례). 비교 패널의 축을 여기서 도출.
3. **[High] 영향 확인 메시지의 대상을 "향후 접수분"으로 고정하고 "강제 전 결과+원인 규칙 표시" 패턴만 빌린다.** — I4. 화면 항목: 기존 접수분 = 지급 완료 / 확정 미지급 / 최대 노출액(변경 무관, 유지) vs 향후 접수분 = 새 조건. IAM simulator처럼 "어느 조건이 이 결과를 만드는지"를 붙인다.
4. **[Med] 접수순 한도 배정은 '관행'이 아니라 '선택'으로 쓴다.** — I7. 확정순(버린 대안 3)은 관행이 아니라 운영 단순성을 비교할 설계 대안으로 제시하고, 접수순의 논거는 "처리 순서가 결과를 바꾸지 않음"(digest §3 반례 손계산)이며 대가는 같은 고객 선행 건 미판정 시 후속 건 확정 지연(R2′)임을 명시. 접수순이 고객에게 항상 더 주는 방식이라고 쓰지 않는다.
5. **[Med] 심사자 재량의 기록 규칙을 정한다.** — I8. 정본은 "심사자는 정책을 선택할 수 없다"인데, 결함 유형 재분류 등 *사실 판단*은 가능하다. 사실 판단 수정 시 사유 기록 + 금액은 정책에서 재계산(Bugcrowd 패턴의 변형)을 스펙에 넣을지 결정.
6. **[Low] 기여도 배분(권익위 모델)은 범위 밖으로 한 줄만 명시한다.** — I12. 과제의 "최초 유효자 1명 지급" 조건과 다른 모델이므로 대안 목록에 넣지 않는다.
7. **[Low] 세계관 금액 스케일.** — I11. 실존 마트 제도는 5천원·월 10회다. 과제 원문 30,000원을 유지하되, 한도 예시(예: 1인 월 5만원)는 실존 스케일을 참고해 잡으면 현실감이 생긴다.

---

## 7. Questions for Further Research (5일 안에는 못 함 — 한계로 명시)

- 선순위 무효 시 차순위 자동 재평가를 실제로 어떻게 처리하는지(HackerOne·Bugcrowd 내부 관행) — 공개 문서에서 확인 못 함. 파인더갭 자체 제품의 처리도 미확인.
- 국내 마트 고객만족센터 담당자의 실제 판단 순서·소요 시간 — 인터뷰 필요.
- 식약처 규정 "먼저 신고한 자" 조항, 탈세제보 2인 이상 제보 조항, 복지부정수급 부칙 경과조치의 **원문 문구** — law.go.kr 조문 직접 확인 필요(요약 도구 결과만 확보).
- 공공 개인 한도의 배정 시점(지급 순 누적인지)의 원문 근거 — 요약 확인만.
- Bies & Shapiro의 정량 수치 — 원논문 확인 필요.

---

## 8. Methodology Notes & 한계

- **방법:** 웹 검색 + 페이지 페치(요약 도구 경유) 데스크 리서치. 2026-09-14 하루. 인터뷰·설문·티켓·분석 데이터 없음. 페르소나 없음(이 문서의 §5가 기초 자료). v1.1·v1.2는 재조사·재페치 없이 문구 정밀도만 교정.
- **범위 선택:** 과제 구조(제보→심사→지급, 정책 수시 변경, 중복 1인, 개인 한도)와 동형인 시스템만 골랐다: 버그바운티(HackerOne·Bugcrowd·GitHub), 공공 신고포상(권익위·식약처·지자체·복지부·국세청), 리테일 자율 보상(이마트·롯데마트·홈플러스·캐나다 SPAC), 정책 객체/시뮬레이션(Stripe Price·Stripe Radar·AWS IAM·GitHub Rulesets), 공정성 연구(KKT 1986, Bies & Shapiro).
- **편향·한계:**
  - 버그바운티 사례 비중이 큼(과제 출제사 도메인과 동형이라 의도적). 마트 도메인의 *제3자 결함 제보 리워드* 실존 제도는 못 찾았고, 실존 제도는 모두 구매 기반 보상이라 직접 비교가 아니다.
  - 버그바운티에는 개인 한도가 없고, 개인 한도가 있는 공공·리테일 제도에는 정교한 중복 규정이 없다. 둘이 만나는 지점(과제의 핵심)을 다룬 시스템은 확인하지 못했다 — 가정 (b)(c)가 설계 선택인 이유.
  - 페치 도구가 요약을 돌려준 항목(식약처 규정, 복지부정수급 부칙, 탈세제보 규정, 권익위 acrc 페이지)은 원문 인용이 아니다. 해당 항목은 본문에 "요약 확인"/"확인 필요"로 표시했다. 원문을 인용한 항목은 따옴표로 구분했다.
  - KKT 수치 중 61%/20%·7%/12%·세입자 예시는 2차 자료(NIH PMC 논문의 인용)에서, 눈삽 82%는 검색 스니펫에서 확인. 원논문 PDF는 이미지라 텍스트 추출 실패. 임금·보너스·임대 맥락을 제보 리워드로 옮긴 것은 유추다.
  - "확인하지 못했다"는 *공개 문서에서 못 찾음*이지 *규정이 없음*의 증명이 아니다.
  - 롯데마트 정책 페이지 1개는 리다이렉트로 원문 미확인, 다른 URL(quality.asp)로 대체 확인.
- **관찰/해석 구분:** 각 테마의 "관찰"은 출처가 있는 사실, "해석"은 우리의 읽기다. §5 세그먼트는 전체가 추정이다.

---

## 9. 출처 (확인 시점: 2026-09-14)

| ID | 출처 | URL | 확인 |
|---|---|---|---|
| S1 | HackerOne Help — Industry Best Practices ("Honor Your Commitments") | https://docs.hackerone.com/en/articles/8369777-industry-best-practices | 원문 인용 |
| S2 | GitHub Blog — Next chapter: Restructuring GitHub's bug bounty program (발효 2026-07-27) | https://github.blog/security/next-chapter-restructuring-githubs-bug-bounty-program/ | 원문 인용 |
| S3 | Stripe Docs — Manage products and prices (Edit/Archive a price) | https://docs.stripe.com/products-prices/manage-prices | 원문 인용 |
| S4 | 복지부정수급 신고포상금 지급 등에 관한 규정(보건복지부 훈령, 2016-12-08 시행) 부칙 | https://www.law.go.kr/admRulLsInfoP.do?admRulSeq=2100000069215 | 요약 확인·원문 확인 필요 |
| S5 | 탈세제보포상금 지급규정(국세청 훈령 제2283호) / 부패행위 신고자 포상 및 보상 사무 운영지침(권익위 예규 제314호) | https://law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000177292 / https://www.law.go.kr/LSW//admRulInfoP.do?admRulSeq=2100000239604&chrClsCd=010201 | 요약 확인·원문 확인 필요 |
| S6 | The Register — HackerOne takes an axe to its bug bounty rewards (2026-05-21) | https://www.theregister.com/security/2026/05/21/hackerone-takes-an-axe-to-its-bug-bounty-rewards/5244458 | 원문 인용 (연구자 주장 / 플랫폼 인정 사실 구분) |
| S7 | The Register — Uber bug bounty complaint (2016-03-24) | https://www.theregister.com/2016/03/24/uber_bug_bounty_complaint/ | 원문 인용 |
| S8 | AWS Docs — IAM policy simulator | https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html | 검색 요약 |
| S9 | GitHub Docs — About rulesets (Evaluate) / Troubleshooting rules (Rule insights) | https://docs.github.com/en/enterprise-server@3.16/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets / https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules | 원문 인용(검색) |
| S10 | Bugcrowd Blog — The Three Principles of Bug Bounty Duplicates | https://www.bugcrowd.com/blog/the-three-principles-of-bug-bounty-duplicates/ | 원문 인용 |
| S11 | Bugcrowd Docs — Assigning Submission Statuses | https://docs.bugcrowd.com/customers/submission-management/submission-status/ | 원문 인용(검색) |
| S12 | Bugcrowd Docs — Rewarding / Getting Rewarded | https://docs.bugcrowd.com/customers/submission-management/rewarding/ / https://docs.bugcrowd.com/researchers/receiving-rewards/getting-rewarded/ | 원문 인용 |
| S13 | HackerOne Blog — The View from the Other Side: A Security Analyst's Perspective on Bug Bounty Triage | https://www.hackerone.com/blog/view-other-side-security-analysts-perspective-bug-bounty-triage | 원문 인용 |
| S14 | HackerOne Help — Duplicate Reports | https://docs.hackerone.com/en/articles/8514410-duplicate-reports | 원문 인용 |
| S15 | HackerOne Help — Reputation | https://docs.hackerone.com/en/articles/8369865-reputation | 원문 인용(검색) |
| S16 | HackerOne Help — Report States | https://docs.hackerone.com/en/articles/8475030-report-states | 원문 인용 |
| S17 | 부정·불량식품 신고포상금 — 찾기쉬운 생활법령 / 식약처 고시 제2025-26호 | https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1007&ccfNo=4&cciNo=1&cnpClsNo=1 / https://www.law.go.kr/LSW//admRulInfoP.do?admRulSeq=2100000258002&chrClsCd=010201 | 한도·제외사유 확인, "먼저 신고한 자" 원문 확인 필요 |
| S18 | 부평구 무단투기 신고포상제 / 연수구 무단투기 과태료·포상 | https://www.icbp.go.kr/main/life/clean/garbage_abandon.jsp / https://www.yeonsu.go.kr/main/part/clean/fine.asp | 요약 확인 |
| S19 | 대구 북구·원주시 무단투기 포상 한도 | https://www.buk.daegu.kr/index.do?menu_id=00002952 / https://www.wonju.go.kr/www/contents.do?key=546 | 검색 요약 |
| S20 | 부패방지 및 국민권익위원회의 설치와 운영에 관한 법률 시행령 §77·§80 (위키문헌) | https://ko.wikisource.org/wiki/부패방지_및_국민권익위원회의_설치와_운영에_관한_법률_시행령 | 원문 인용 |
| S21 | Retail Council of Canada — Scanner Price Accuracy Code FAQ / Competition Bureau | https://www.retailcouncil.org/scanner-price-accuracy-code/scanner-price-accuracy-code-frequently-asked-questions-by-consumers/ / https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/scanner-price-accuracy | 원문 인용 |
| S22 | 이마트 품질불량상품 보상제도 | https://store.emart.com/service/service02.do | 원문 인용 |
| S23 | 이마트 계산착오 보상제도 | https://store.emart.com/service/service04.do | 원문 인용 |
| S24 | 롯데마트 품질보증제 | https://company.lottemart.com/service/quality.asp | 요약 확인 |
| S25 | 홈플러스 신선 A/S센터 (뉴데일리 2018-03-04) | https://biz.newdaily.co.kr/site/data/html/2018/03/04/2018030410001.html | 검색 요약 |
| S26 | HackerOne Help — Awarding Bounties / Bounty Tables | https://docs.hackerone.com/en/articles/8524543-awarding-bounties / https://docs.hackerone.com/organizations/bounty-tables.html | 원문 인용 |
| S27 | Stripe Docs — Reviews / Radar reviews API (\`reason\`) | https://docs.stripe.com/radar/reviews / https://docs.stripe.com/api/radar/reviews | 검색 요약 |
| S28 | HackerOne Help — Agentic Validation / Severity | https://docs.hackerone.com/en/articles/13603896-agentic-validation / https://docs.hackerone.com/en/articles/8475343-severity | 검색 요약 |
| S29 | Kahneman, Knetsch & Thaler (1986) Fairness as a Constraint on Profit Seeking, AER 76(4) 728–741 | https://econpapers.repec.org/RePEc:aea:aecrev:v:76:y:1986:i:4:p:728-41 | 원문 PDF 텍스트 추출 실패 |
| S30 | KKT 수치 2차 출처 — A Theory of Fairness in Labour Markets (PMC6473791) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6473791/ | 원문 인용(2차) |
| S31 | Bies & Shapiro 1987/1988 — Procedural Justice review (Waterloo) | https://uwaterloo.ca/fairness-at-work-lab/sites/default/files/uploads/files/procedural_justice_an_historical_review_and_critical_analysis.pdf | 검색 요약, 수치 확인 필요 |
| S32 | The Register — HackerOne 'ghosted' me for months over $8,500 bug bounty (2026-01-07) | https://www.theregister.com/2026/01/07/hackerone_ghosted_researcher/ | 원문 인용 |
| S33 | 서울고등법원 2018누66458 신고포상금 부지급결정 취소 | https://www.law.go.kr/precInfoP.do?precSeq=406082 | 요약 확인 — 신고 경로 다툼이지 소급 하향 사례 아님(참고만) |
`;export{e as default};