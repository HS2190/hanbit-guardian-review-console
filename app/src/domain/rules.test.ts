import { describe, expect, it } from 'vitest';
import { policies, reports } from '../data/seed';
import type { Policy } from './types';
import { appliedPolicy, currentPolicy, impact, nextVersion } from './policy';
import { blockingPredecessor, duplicateCandidates, judge } from './rules';
import { confirm, setEvidence } from './apply';

const byId = (id: string) => reports.find((r) => r.id === id)!;
const NOW = '2026-09-18T11:00:00+09:00';

describe('적용 정책은 접수 시각으로 정해진다', () => {
  it('v2 발효 뒤에 심사해도 v1 접수 건은 v1이 적용된다', () => {
    const r = byId('#1042');                       // 9/15 09:47 접수, v2 발효는 10:23
    expect(appliedPolicy(policies, r.submittedAt).version).toBe('v1');
    expect(appliedPolicy(policies, r.submittedAt).amounts['유통기한 경과']).toBe(30000);
    expect(currentPolicy(policies, NOW).version).toBe('v2');
  });

  it('발효 36분 뒤 접수 건은 v2가 적용된다', () => {
    expect(appliedPolicy(policies, byId('#1051').submittedAt).version).toBe('v2');
    expect(appliedPolicy(policies, byId('#1051').submittedAt).amounts['유통기한 경과']).toBe(10000);
  });
});

describe('판정 순서 5단계', () => {
  it('① 범위 밖이면 유효성을 보지 않는다', () => {
    const j = judge(byId('#1121'), reports, policies);   // 비식품 = 대상 카테고리 아님
    expect(j.step).toBe(1);
    expect(j.outcome).toBe('범위 외');
    expect(j.amount).toBe(0);
  });

  it('② 증빙이 불충분하면 중복을 보지 않는다', () => {
    const j = judge(byId('#1039'), reports, policies);
    expect(j.step).toBe(2);
    expect(j.outcome).toBe('증빙 불충분');
  });

  it('③ 같은 SKU·같은 개체·같은 결함이면 중복, 원본은 먼저 접수된 유효 건', () => {
    const cands = duplicateCandidates(byId('#1107'), reports);
    expect(cands.map((r) => r.id)).toContain('#1103');
    const j = judge(byId('#1107'), reports, policies);
    expect(j.outcome).toBe('중복');
    expect(j.amount).toBe(0);
  });

  it('③ 다른 개체면 중복이 아니다', () => {
    expect(duplicateCandidates(byId('#1110'), reports).map((r) => r.id)).not.toContain('#1103');
  });

  it('③ 조치 완료 이후의 재발은 별건이다', () => {
    // #1103은 9/17 09:00 조치 완료, #1188은 그 이후인 9/17 14:20 접수
    expect(duplicateCandidates(byId('#1188'), reports).map((r) => r.id)).not.toContain('#1103');
  });

  it('⑤ 한도는 기소비를 빼고 음수는 0으로 자른다', () => {
    const j = judge(byId('#1188'), reports, policies);   // 정우진: #1103에서 30,000 사용
    expect(j.outcome).toBe('유효·최초');
    expect(j.amount).toBe(20000);                        // 50,000 − 30,000
  });
});

describe('접수순 배정 — 선행 건이 미판정이면 확정을 막는다', () => {
  it('#1063은 같은 고객의 선행 건 #1042 때문에 막힌다', () => {
    expect(blockingPredecessor(byId('#1063'), reports)?.id).toBe('#1042');
    const j = judge(byId('#1063'), reports, policies);
    expect(j.blocked?.targetId).toBe('#1042');
    expect(j.amount).toBe(0);
  });

  it('#1042가 30,000으로 확정되면 #1063은 잔여 20,000으로 열린다', () => {
    const fixed = setEvidence(byId('#1042'), true, NOW, '최민아');
    const j1 = judge(fixed, reports.map((r) => (r.id === '#1042' ? fixed : r)), policies);
    expect(j1.amount).toBe(30000);                       // v1 기준액
    const after = reports.map((r) => (r.id === '#1042' ? confirm(fixed, j1, NOW, '최민아') : r));
    const j2 = judge(byId('#1063'), after, policies);
    expect(j2.blocked).toBeUndefined();
    expect(j2.amount).toBe(20000);
  });

  it('#1042가 무효가 되면 #1063은 30,000을 받는다', () => {
    const invalid = setEvidence(byId('#1042'), false, NOW, '최민아');
    const j1 = judge(invalid, reports, policies);
    const after = reports.map((r) => (r.id === '#1042' ? confirm(invalid, j1, NOW, '최민아') : r));
    const j2 = judge(byId('#1063'), after, policies);
    expect(j2.amount).toBe(30000);
  });
});

describe('유효 · 0원은 반려가 아니다', () => {
  it('한도가 소진돼도 결과는 유효·최초로 남는다', () => {
    // 정우진이 한도 50,000을 모두 쓴 뒤, 겹치지 않는 새 사건을 제보한 경우
    const extra = {
      ...byId('#1188'), id: '#1199', sku: 'SKU-Z01', unit: 'z1',
      defectType: '파손·오염' as const, submittedAt: '2026-09-24T09:00:00+09:00',
    };
    const base = reports
      .filter((r) => r.id !== '#1188')
      .map((r) => (r.id === '#1103' ? { ...r, payout: { ...r.payout, amount: 50000 } } : r));
    const j = judge(extra, [...base, extra], policies);
    expect(j.outcome).toBe('유효·최초');
    expect(j.amount).toBe(0);
    expect(j.payoutReason).toBe('한도 소진');
  });
});

describe('정책 변경의 영향 — 발행 전 게이트', () => {
  it('이미 확정된 금액은 영향 범위에 들어가지 않는다', () => {
    const draft = { ...policies[1], version: 'v3', amounts: { ...policies[1].amounts, '유통기한 경과': 5000 } };
    const i = impact(reports, policies, draft, NOW);
    expect(i.changedFields).toEqual(['유통기한 경과']);
    expect(i.affected.count).toBeGreaterThan(0);
    expect(i.paid.amount).toBe(60000);                   // #1003 + #1015
  });

  it('값이 그대로면 변경 항목이 없다 — 발행을 막는 근거', () => {
    const current = policies.find((p) => p.status === '발효')!;
    const draft = { ...current, version: 'v3' };
    expect(impact(reports, policies, draft, NOW).changedFields).toEqual([]);
  });

  // 발행 직후 기준이 한 버전 밀리면 「변경된 항목 없음」이 뚫린다.
  // 벽시계가 아니라 앱의 현재 시각으로 비교해야 갓 발행된 버전이 기준이 된다.
  it('방금 발행해 발효 시각이 미래인 버전도 비교 기준이 된다', () => {
    const v3: Policy = {
      ...policies.find((p) => p.status === '발효')!,
      version: 'v3', status: '발효',
      effectiveFrom: NOW, publishedAt: NOW,
      amounts: { ...policies[1].amounts, '유통기한 경과': 5000 },
    };
    const after = [...policies.map((p) => ({ ...p, status: '종료' as const })), v3];
    const draft = { ...v3, version: 'v4', status: '초안' as const };
    expect(impact(reports, after, draft, NOW).changedFields).toEqual([]);
  });

  it('초안 버전은 이력 끝에서 이어진다', () => {
    expect(nextVersion(policies)).toBe('v3');
    expect(nextVersion([...policies, { ...policies[1], version: 'v3' }])).toBe('v4');
  });
});
