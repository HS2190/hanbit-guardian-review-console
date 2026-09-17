import type { Policy, Report } from './types';

/** 접수 시각에 발효 중이던 버전. 이 함수가 이 제품의 단일 원칙이다. */
export function appliedPolicy(policies: Policy[], submittedAt: string): Policy {
  const t = Date.parse(submittedAt);
  const candidates = policies
    .filter((p) => p.status === '발효' || p.status === '종료')
    .filter((p) => Date.parse(p.effectiveFrom) <= t)
    .sort((a, b) => Date.parse(b.effectiveFrom) - Date.parse(a.effectiveFrom));
  if (!candidates.length) throw new Error('접수 시각 이전에 발효된 정책이 없습니다');
  return candidates[0];
}

/** 지금 발효 중인 버전. 비교용으로만 쓰고 심사에 쓰지 않는다. */
export function currentPolicy(policies: Policy[], now = new Date().toISOString()): Policy {
  return appliedPolicy(policies, now);
}

export function policyDiffers(applied: Policy, current: Policy): boolean {
  return applied.version !== current.version;
}

/** 다음 초안의 버전. 발행이 반복돼도 번호가 겹치지 않아야 이력이 읽힌다. */
export function nextVersion(policies: Policy[]): string {
  const max = policies.reduce((m, p) => Math.max(m, Number(p.version.replace(/\D/g, '')) || 0), 0);
  return `v${max + 1}`;
}

/** 정책 변경이 이미 접수된 건에 미치는 영향 — 발행 전 게이트에서 쓴다. */
export function impact(reports: Report[], policies: Policy[], draft: Policy, now: string) {
  const open = reports.filter((r) => r.process !== '심사 완료');
  const changed: string[] = [];
  // 기준은 호출 시각이 아니라 앱의 현재 시각이다. 벽시계를 쓰면 방금 발행한 버전이
  // "아직 발효 전"으로 빠져 비교 대상이 한 버전 밀리고, 「변경된 항목 없음」이 뚫린다.
  const base = currentPolicy(policies, now);
  (Object.keys(draft.amounts) as (keyof typeof draft.amounts)[]).forEach((k) => {
    if (draft.amounts[k] !== base.amounts[k]) changed.push(k);
  });
  const paid = reports.filter((r) => r.payout.state === '완료');
  const confirmed = reports.filter((r) => r.payout.state === '확정' || r.payout.state === '지급 중');
  const undecided = open.filter((r) => r.payout.amount === null);
  const affected = undecided.filter((r) => changed.includes(r.defectType));
  const sum = (rs: Report[], f: (r: Report) => number) => rs.reduce((a, r) => a + f(r), 0);
  return {
    changedFields: changed,
    paid: { count: paid.length, amount: sum(paid, (r) => r.payout.amount ?? 0) },
    confirmed: { count: confirmed.length, amount: sum(confirmed, (r) => r.payout.amount ?? 0) },
    undecided: {
      count: undecided.length,
      amount: sum(undecided, (r) => appliedPolicy(policies, r.submittedAt).amounts[r.defectType]),
    },
    affected: {
      count: affected.length,
      amount: sum(affected, (r) => appliedPolicy(policies, r.submittedAt).amounts[r.defectType]),
    },
    openCount: open.length,
  };
}
