import type { Policy, Report } from '../domain/types';

export const NOW = '2026-09-18T11:00:00+09:00';

export const policies: Policy[] = [
  {
    version: 'v1', effectiveFrom: '2026-09-01T09:00:00+09:00', publishedAt: '2026-08-31T17:20:00+09:00',
    amounts: { '유통기한 경과': 30000, '가격표 오류': 30000, '파손·오염': 15000, '통로 적재물': 10000, 'POP 오정보': 10000 },
    categories: ['신선식품', '가공식품', '생활용품'],
    defectTypes: ['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'],
    perPersonCap: 50000, status: '종료',
  },
  {
    version: 'v2', effectiveFrom: '2026-09-15T10:23:00+09:00', publishedAt: '2026-09-15T10:20:00+09:00',
    amounts: { '유통기한 경과': 10000, '가격표 오류': 30000, '파손·오염': 15000, '통로 적재물': 10000, 'POP 오정보': 10000 },
    categories: ['신선식품', '가공식품', '생활용품'],
    defectTypes: ['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'],
    perPersonCap: 50000, status: '발효',
  },
];

const h = (at: string, actor: string, action: string) => ({ at, actor, action });

type Seed = Omit<Report, 'history'> & { history?: Report['history'] };

const rows: Seed[] = [
  { id: '#1003', store: '성수점', customer: '송지아', customerKey: 'C-송지아', category: '신선식품', sku: 'SKU-A11', unit: 'u1', defectType: '유통기한 경과', submittedAt: '2026-09-02T10:15:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '완료', amount: 30000, lockedAt: '2026-09-04T09:10:00+09:00' }, assignee: '최민아' },
  { id: '#1015', store: '성수점', customer: '박도윤', customerKey: 'C-박도윤', category: '생활용품', sku: 'SKU-B02', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-06T16:40:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '완료', amount: 30000, lockedAt: '2026-09-08T10:00:00+09:00' }, assignee: '최민아' },
  { id: '#1028', store: '성수점', customer: '윤하린', customerKey: 'C-윤하린', category: '가공식품', sku: 'SKU-C31', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-10T11:30:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '확정', amount: 30000, lockedAt: '2026-09-12T09:00:00+09:00' }, assignee: '최민아' },
  { id: '#1031', store: '성수점', customer: '이서준', customerKey: 'C-이서준', category: '신선식품', sku: 'SKU-A42', unit: 'u1', defectType: '유통기한 경과', submittedAt: '2026-09-12T09:05:00+09:00', evidenceOk: true, process: '심사 중', outcome: null, payout: { state: '미정', amount: null }, assignee: '최민아' },
  { id: '#1036', store: '성수점', customer: '강민서', customerKey: 'C-강민서', category: '생활용품', sku: 'SKU-D07', unit: 'u1', defectType: '파손·오염', submittedAt: '2026-09-13T15:50:00+09:00', evidenceOk: true, process: '심사 중', outcome: null, payout: { state: '미정', amount: null }, assignee: '최민아' },
  { id: '#1039', store: '성수점', customer: '조은우', customerKey: 'C-조은우', category: '신선식품', sku: 'SKU-A77', unit: 'u1', defectType: '유통기한 경과', submittedAt: '2026-09-14T12:10:00+09:00', evidenceOk: false, evidenceNote: '라벨 (판독 불가)', process: '보완 대기', outcome: null, payout: { state: '미정', amount: null }, assignee: '최민아', supplement: { requestedAt: '2026-09-14T14:00:00+09:00', dueAt: '2026-09-21T14:00:00+09:00', submitted: false, count: 1 } },
  { id: '#1042', store: '성수점', customer: '김서연', customerKey: 'C-김서연', category: '신선식품', sku: 'SKU-A05', unit: 'u1', defectType: '유통기한 경과', submittedAt: '2026-09-15T09:47:00+09:00', evidenceOk: false, evidenceNote: '라벨 (판독 불가)', process: '보완 대기', outcome: null, payout: { state: '미정', amount: null }, assignee: '최민아', supplement: { requestedAt: '2026-09-18T10:05:00+09:00', dueAt: '2026-09-25T10:05:00+09:00', submitted: false, count: 1 } },
  { id: '#1051', store: '성수점', customer: '이하준', customerKey: 'C-이하준', category: '신선식품', sku: 'SKU-A19', unit: 'u1', defectType: '유통기한 경과', submittedAt: '2026-09-15T11:05:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '확정', amount: 10000, lockedAt: '2026-09-16T09:00:00+09:00' }, assignee: '최민아' },
  { id: '#1063', store: '성수점', customer: '김서연', customerKey: 'C-김서연', category: '생활용품', sku: 'SKU-B55', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-15T13:20:00+09:00', evidenceOk: true, process: '선행 판정 대기', outcome: null, payout: { state: '확정 대기', amount: null }, assignee: '최민아' },
  { id: '#1103', store: '성수점', customer: '정우진', customerKey: 'C-정우진', category: '생활용품', sku: 'SKU-E88', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-16T14:02:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '확정', amount: 30000, lockedAt: '2026-09-16T17:00:00+09:00' }, assignee: '최민아', remediatedAt: '2026-09-17T09:00:00+09:00' },
  { id: '#1107', store: '성수점', customer: '한지호', customerKey: 'C-한지호', category: '생활용품', sku: 'SKU-E88', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-16T15:30:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '중복', duplicateOf: '#1103', payout: { state: '해당 없음', amount: 0, reason: '중복' }, assignee: '최민아' },
  { id: '#1110', store: '성수점', customer: '오유진', customerKey: 'C-오유진', category: '생활용품', sku: 'SKU-E88', unit: 'u2', defectType: '파손·오염', submittedAt: '2026-09-16T16:10:00+09:00', evidenceOk: true, process: '심사 완료', outcome: '유효·최초', payout: { state: '확정', amount: 15000, lockedAt: '2026-09-17T09:00:00+09:00' }, assignee: '최민아' },
  { id: '#1121', store: '성수점', customer: '최유나', customerKey: 'C-최유나', category: '비식품', sku: 'SKU-F01', unit: 'u1', defectType: '통로 적재물', submittedAt: '2026-09-17T10:30:00+09:00', evidenceOk: true, process: '접수', outcome: null, payout: { state: '미정', amount: null } },
  { id: '#1188', store: '성수점', customer: '정우진', customerKey: 'C-정우진', category: '생활용품', sku: 'SKU-E88', unit: 'u1', defectType: '가격표 오류', submittedAt: '2026-09-17T14:20:00+09:00', evidenceOk: true, process: '접수', outcome: null, payout: { state: '미정', amount: null } },
];

export const reports: Report[] = rows.map((r) => ({
  ...r,
  history: r.history ?? [h(r.submittedAt, '시스템', '접수 · 적용 정책 자동 결정')],
}));
