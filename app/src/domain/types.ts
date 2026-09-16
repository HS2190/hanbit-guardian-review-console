/** 처리 축 — 건이 지금 어느 단계에 있는가 */
export type Process =
  | '접수' | '심사 중' | '보완 대기' | '선행 판정 대기'
  | '재심 대상' | '재심 중' | '심사 완료';

/** 결과 축 — 심사가 내린 판단 */
export type Outcome =
  | null | '유효·최초' | '중복' | '범위 외' | '증빙 불충분' | '반려';

/** 지급 축 — 돈이 어디까지 갔는가 */
export type PayoutState =
  | '미정' | '확정 대기' | '확정' | '지급 중' | '완료' | '실패'
  | '조정 중' | '해당 없음';

export type DefectType =
  | '유통기한 경과' | '가격표 오류' | '파손·오염' | '통로 적재물' | 'POP 오정보';

export type Category = '신선식품' | '가공식품' | '생활용품' | '비식품';

export interface Policy {
  version: string;            // v1, v2, v3
  effectiveFrom: string;      // ISO. 이 시각부터 발효
  publishedAt: string;
  amounts: Record<DefectType, number>;
  categories: Category[];     // 제보 대상 카테고리
  defectTypes: DefectType[];  // 인정 결함 유형
  perPersonCap: number;       // 1인 최대 지급 한도
  status: '초안' | '예약' | '발효' | '종료';
}

export interface Payout {
  state: PayoutState;
  amount: number | null;      // 확정/완료 금액
  reason?: string;            // 해당 없음·조정 중의 사유
  lockedAt?: string;
}

export interface Report {
  id: string;                 // #1042
  store: string;
  customer: string;           // 김서연
  customerKey: string;        // 한도 계산 단위
  category: Category;
  sku: string;                // 상품 개체 식별
  unit: string;               // 같은 SKU의 다른 개체 구분
  defectType: DefectType;
  submittedAt: string;        // 접수 시각 — 적용 정책을 정하는 유일한 기준
  evidenceOk: boolean;        // 증빙 판독 가능 여부(심사자 입력)
  evidenceNote?: string;
  process: Process;
  outcome: Outcome;
  duplicateOf?: string;       // 중복일 때 원본 ID
  payout: Payout;
  assignee?: string;
  supplement?: { requestedAt: string; dueAt: string; submitted: boolean; count: number };
  remediatedAt?: string;      // 조치 완료 시각 — 이후 재발은 별건
  history: HistoryEntry[];
}

export interface HistoryEntry {
  at: string;
  actor: string;
  action: string;
  before?: string;
  after?: string;
  reason?: string;
}

/** 판정 순서 5단계의 결과 */
export interface Judgement {
  step: 1 | 2 | 3 | 4 | 5;
  outcome: Outcome;
  amount: number;
  payoutReason?: string;
  blocked?: { reason: string; targetId?: string };
  trace: string[];
}
