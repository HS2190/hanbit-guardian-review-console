import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { DefectType, Policy, Report } from '../domain/types';
import { policies as seedPolicies, reports as seedReports, NOW } from '../data/seed';
import { confirm, markDuplicate, reclassify, requestSupplement, setEvidence, start } from '../domain/apply';
import { judge } from '../domain/rules';
import { nextVersion } from '../domain/policy';

export interface State {
  reports: Report[];
  policies: Policy[];
  selected: string | null;
  filter: string | null;
  query: string;
  toast: { text: string } | null;
  /** 확정의 하류 효과로 방금 상태가 바뀐 건 — 레일에서 한 번 깜빡인다 */
  flash: string | null;
  draft: Policy | null;
  step: '현황' | '편집' | '영향 확인' | '완료';
  now: string;
}

type Action =
  | { t: 'select'; id: string | null }
  | { t: 'filter'; v: string | null }
  | { t: 'query'; v: string }
  | { t: 'start'; id: string }
  | { t: 'evidence'; id: string; ok: boolean }
  | { t: 'reclassify'; id: string; to: DefectType; reason: string }
  | { t: 'supplement'; id: string; reason: string }
  | { t: 'duplicate'; id: string; originId: string; reason: string }
  | { t: 'confirm'; id: string }
  | { t: 'toast'; text: string | null }
  | { t: 'flash'; id: string | null }
  | { t: 'draft'; patch: Partial<Policy> }
  | { t: 'step'; v: State['step'] }
  | { t: 'publish' }
  | { t: 'reset' };

const ACTOR = '최민아';

/** 링크로 특정 상태를 연다. 해시 라우팅이라 질의는 해시 뒤에 붙는다(#/app?id=1063). */
function param(name: string): string | null {
  if (typeof location === 'undefined') return null;
  const fromHash = location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?') + 1) : '';
  return new URLSearchParams(fromHash).get(name) ?? new URLSearchParams(location.search).get(name);
}
const q = param('id');
const STEP = (['현황', '편집', '영향 확인', '완료'] as const)
  .find((v) => v === param('step')) ?? '현황';

export const initial: State = {
  reports: seedReports, policies: seedPolicies, selected: q ? `#${q.replace('#', '')}` : null,
  filter: null, query: param('q') ?? '', toast: null, flash: null,
  draft: STEP === '현황' ? null : { ...seedPolicies.find((p) => p.status === '발효')!, version: 'v3', status: '초안',
    amounts: { ...seedPolicies.find((p) => p.status === '발효')!.amounts, '유통기한 경과': 5000 } },
  step: STEP, now: NOW,
};

function put(s: State, id: string, f: (r: Report) => Report): Report[] {
  return s.reports.map((r) => (r.id === id ? f(r) : r));
}

export function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'select': return { ...s, selected: a.id };
    case 'filter': return { ...s, filter: a.v };
    case 'query': return { ...s, query: a.v };
    case 'start': return { ...s, reports: put(s, a.id, (r) => start(r, s.now, ACTOR)) };
    case 'evidence': return { ...s, reports: put(s, a.id, (r) => setEvidence(r, a.ok, s.now, ACTOR)) };
    case 'reclassify': return { ...s, reports: put(s, a.id, (r) => reclassify(r, s.now, ACTOR, a.to, a.reason)) };
    case 'supplement':
      return {
        ...s, reports: put(s, a.id, (r) => requestSupplement(r, s.now, ACTOR, a.reason)),
        toast: { text: `보완 요청 발송 · 기한 ${new Date(Date.parse(s.now) + 7 * 864e5).getMonth() + 1}/${new Date(Date.parse(s.now) + 7 * 864e5).getDate()}` },
      };
    case 'duplicate':
      return {
        ...s, reports: put(s, a.id, (r) => markDuplicate(r, a.originId, s.now, ACTOR, a.reason)),
        toast: { text: `중복으로 확정됨 · 원본 ${a.originId}` },
      };
    case 'confirm': {
      const r = s.reports.find((x) => x.id === a.id)!;
      const j = judge(r, s.reports, s.policies);
      const next = put(s, a.id, (x) => confirm(x, j, s.now, ACTOR));
      const sibling = next.find(
        (x) => x.customerKey === r.customerKey && x.id !== r.id && x.process === '선행 판정 대기');
      return {
        ...s, reports: sibling
          ? next.map((x) => (x.id === sibling.id ? { ...x, process: '심사 중' as const } : x))
          : next,
        toast: sibling
          ? { text: `확정됨 · 같은 고객 ${sibling.id} 재검토로 전환` }
          : { text: `확정됨 · ${j.amount.toLocaleString('ko-KR')}원` },
        flash: sibling ? sibling.id : null,
      };
    }
    case 'toast': return { ...s, toast: a.text ? { text: a.text } : null };
    case 'draft': {
      // 초안의 바탕은 "지금 발효 중인" 버전이고, 번호는 이력 끝에서 이어 붙인다.
      const base = s.draft ?? {
        ...s.policies.find((p) => p.status === '발효')!,
        version: nextVersion(s.policies), status: '초안' as const,
      };
      return { ...s, draft: { ...base, ...a.patch } };
    }
    case 'step': return { ...s, step: a.v };
    case 'publish': {
      if (!s.draft) return s;
      const published: Policy = {
        ...s.draft, status: '발효', publishedAt: s.now, effectiveFrom: s.now,
      };
      return {
        ...s,
        policies: s.policies.map((p) => (p.status === '발효' ? { ...p, status: '종료' as const } : p)).concat(published),
        draft: null, step: '완료', toast: { text: `발행됨 · ${published.version} 즉시 발효` },
      };
    }
    case 'flash': return { ...s, flash: a.id };
    case 'reset': return initial;
    default: return s;
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null);

export function Store({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, initial);
  const v = useMemo(() => ({ s, d }), [s]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('Store 안에서 쓰세요');
  return v;
}
