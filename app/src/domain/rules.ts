import type { Judgement, Policy, Report } from './types';
import { appliedPolicy } from './policy';

/** 같은 사건인가 — 중복 후보를 고르는 기준. 조치 이후 재발은 별건이다. */
export function duplicateCandidates(target: Report, all: Report[]): Report[] {
  return all.filter((r) => {
    if (r.id === target.id) return false;
    if (r.store !== target.store) return false;
    if (r.sku !== target.sku) return false;
    if (r.defectType !== target.defectType) return false;
    if (r.unit !== target.unit) return false;              // 다른 개체면 별건
    if (r.remediatedAt && Date.parse(target.submittedAt) > Date.parse(r.remediatedAt))
      return false;                                        // 조치 후 재발이면 별건
    return true;
  });
}

/** 같은 고객이 이미 확정·완료로 쓴 금액 */
export function consumed(customerKey: string, all: Report[], exceptId?: string): number {
  return all
    .filter((r) => r.customerKey === customerKey && r.id !== exceptId)
    .filter((r) => r.payout.state === '확정' || r.payout.state === '지급 중' || r.payout.state === '완료')
    .reduce((a, r) => a + (r.payout.amount ?? 0), 0);
}

/** 같은 고객의 더 이른 접수 건 중 아직 판정되지 않은 것 */
export function blockingPredecessor(target: Report, all: Report[]): Report | undefined {
  return all
    .filter((r) => r.customerKey === target.customerKey && r.id !== target.id)
    .filter((r) => Date.parse(r.submittedAt) < Date.parse(target.submittedAt))
    .filter((r) => r.outcome === null || r.payout.amount === null)
    .sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt))[0];
}

/**
 * 판정 순서 5단계. 순서가 결과를 정하므로 고정한다.
 * ① 범위 → ② 유효성 → ③ 중복 → ④ 최초 여부 → ⑤ 한도
 */
export function judge(target: Report, all: Report[], policies: Policy[]): Judgement {
  const p = appliedPolicy(policies, target.submittedAt);
  const trace: string[] = [`적용 정책 ${p.version} (${fmt(p.effectiveFrom)} 발효) — 접수 ${fmt(target.submittedAt)}`];

  // ① 범위
  if (!p.categories.includes(target.category) || !p.defectTypes.includes(target.defectType)) {
    trace.push(`① 범위 — ${target.category} · ${target.defectType}는 접수 당시 대상이 아님`);
    return { step: 1, outcome: '범위 외', amount: 0, payoutReason: '범위 외', trace };
  }
  trace.push(`① 범위 — 대상 (${target.category} · ${target.defectType})`);

  // ② 유효성
  if (!target.evidenceOk) {
    trace.push('② 유효성 — 증빙 불충분');
    return { step: 2, outcome: '증빙 불충분', amount: 0, payoutReason: '증빙 불충분', trace };
  }
  trace.push('② 유효성 — 통과');

  // ③ 중복
  const cands = duplicateCandidates(target, all);
  const earlier = cands
    .filter((r) => Date.parse(r.submittedAt) < Date.parse(target.submittedAt))
    .sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt));
  const firstValid = earlier.find((r) => r.outcome === '유효·최초');
  if (firstValid) {
    trace.push(`③ 중복 — 원본 ${firstValid.id} (${fmt(firstValid.submittedAt)} 접수)`);
    return { step: 3, outcome: '중복', amount: 0, payoutReason: '중복', trace };
  }
  const undecidedEarlier = earlier.find((r) => r.outcome === null);
  if (undecidedEarlier) {
    trace.push(`③ 중복 — 더 이른 미판정 건 ${undecidedEarlier.id}`);
    return {
      step: 3, outcome: null, amount: 0, trace,
      blocked: { reason: `같은 사건의 선행 건 ${undecidedEarlier.id} 판정 필요`, targetId: undecidedEarlier.id },
    };
  }
  trace.push(cands.length ? `③ 중복 — 후보 ${cands.length}건, 최초 유효 없음` : '③ 중복 — 후보 없음');

  // ④ 최초 여부 + 같은 고객 선행 건
  const pred = blockingPredecessor(target, all);
  if (pred) {
    trace.push(`④ 최초 — 같은 고객 선행 건 ${pred.id} 미판정`);
    return {
      step: 4, outcome: '유효·최초', amount: 0, trace,
      blocked: { reason: `같은 고객의 선행 건 ${pred.id} 판정 필요`, targetId: pred.id },
    };
  }
  trace.push('④ 최초 — 최초 유효 제보');

  // ⑤ 한도
  const basis = p.amounts[target.defectType];
  const used = consumed(target.customerKey, all, target.id);
  const remain = Math.max(0, p.perPersonCap - used);
  const final = Math.max(0, Math.min(basis, remain));
  trace.push(`⑤ 한도 — 기준액 ${won(basis)} · 한도 ${won(p.perPersonCap)} − 기소비 ${won(used)} = 잔여 ${won(remain)} → 최종 ${won(final)}`);
  return {
    step: 5,
    outcome: '유효·최초',
    amount: final,
    payoutReason: final === 0 ? '한도 소진' : undefined,
    trace,
  };
}

export const won = (n: number) => `${n.toLocaleString('ko-KR')}`;
export const fmt = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
