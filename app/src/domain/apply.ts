import type { Judgement, Report } from './types';

/** 확정 — 되돌릴 수 없는 전이. 금액과 한도가 여기서 잠긴다. */
export function confirm(r: Report, j: Judgement, at: string, actor: string): Report {
  const zero = j.amount === 0;
  return {
    ...r,
    process: '심사 완료',
    outcome: j.outcome,
    duplicateOf: j.outcome === '중복' ? j.trace.join(' ').match(/#\d{3,4}/)?.[0] : r.duplicateOf,
    payout: zero
      ? { state: '해당 없음', amount: 0, reason: j.payoutReason ?? '해당 없음', lockedAt: at }
      : { state: '확정', amount: j.amount, lockedAt: at },
    history: [...r.history, { at, actor, action: '지급 확정', after: `${j.outcome} · ${j.amount.toLocaleString('ko-KR')}원` }],
  };
}

export function start(r: Report, at: string, actor: string): Report {
  return { ...r, process: '심사 중', assignee: actor, history: [...r.history, { at, actor, action: '심사 착수' }] };
}

export function requestSupplement(r: Report, at: string, actor: string, reason: string): Report {
  const due = new Date(Date.parse(at) + 7 * 864e5).toISOString();
  return {
    ...r, process: '보완 대기',
    supplement: { requestedAt: at, dueAt: due, submitted: false, count: (r.supplement?.count ?? 0) + 1 },
    history: [...r.history, { at, actor, action: '보완 요청 발송', reason }],
  };
}

export function reclassify(r: Report, at: string, actor: string, to: Report['defectType'], reason: string): Report {
  return {
    ...r, defectType: to,
    history: [...r.history, { at, actor, action: '결함 유형 재분류', before: r.defectType, after: to, reason }],
  };
}

export function setEvidence(r: Report, ok: boolean, at: string, actor: string): Report {
  return { ...r, evidenceOk: ok, history: [...r.history, { at, actor, action: '유효성 평가 저장', after: ok ? '통과' : '증빙 불충분' }] };
}

export function markDuplicate(r: Report, originId: string, at: string, actor: string, reason: string): Report {
  return {
    ...r, process: '심사 완료', outcome: '중복', duplicateOf: originId,
    payout: { state: '해당 없음', amount: 0, reason: '중복', lockedAt: at },
    history: [...r.history, { at, actor, action: '중복 판정', after: `원본 ${originId}`, reason }],
  };
}
