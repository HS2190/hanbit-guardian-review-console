import { useState } from 'react';
import { ContentBadge } from '@hs2190.an/iris-react';
import type { Outcome, PayoutState, Process, Report } from '../domain/types';

export const won = (n: number) => n.toLocaleString('ko-KR');
export const fmt = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
export const day = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const processTone: Record<Process, 'neutral' | 'info' | 'cautionary'> = {
  '접수': 'neutral', '심사 중': 'info', '보완 대기': 'cautionary',
  '선행 판정 대기': 'cautionary', '재심 대상': 'cautionary', '재심 중': 'info', '심사 완료': 'neutral',
};

export function ProcessBadge({ v, prefix }: { v: Process; prefix?: boolean }) {
  return <ContentBadge tone={processTone[v]} variant="subtle">{prefix ? `처리 · ${v}` : v}</ContentBadge>;
}

export function OutcomeBadge({ v, dupOf, prefix }: { v: Outcome; dupOf?: string; prefix?: boolean }) {
  if (!v) return <ContentBadge tone="neutral" variant="subtle">{prefix ? '결과 · —' : '—'}</ContentBadge>;
  const label = v === '중복' && dupOf ? `중복(${dupOf})` : v;
  const tone = v === '유효·최초' ? 'positive' : 'neutral';
  return <ContentBadge tone={tone} variant="subtle">{prefix ? `결과 · ${label}` : label}</ContentBadge>;
}

/** 지급 축은 결과와 섞이지 않는다. 유효·0원이 반려로 읽히지 않게 하는 자리. */
export function PayoutBadge({ r, prefix }: { r: Report; prefix?: boolean }) {
  const { state, amount, reason } = r.payout;
  const tone: Record<PayoutState, 'neutral' | 'info' | 'positive' | 'cautionary' | 'negative'> = {
    '미정': 'neutral', '확정 대기': 'neutral', '확정': 'info', '지급 중': 'info',
    '완료': 'positive', '실패': 'negative', '조정 중': 'cautionary', '해당 없음': 'neutral',
  };
  const label =
    state === '확정' || state === '완료' ? `${state} ${won(amount ?? 0)}`
      : state === '해당 없음' ? `해당 없음(${reason ?? '사유'})`
        : state === '조정 중' ? `조정 중(${reason ?? '환수'})` : state;
  return <ContentBadge tone={tone[state]} variant="subtle">{prefix ? `지급 · ${label}` : label}</ContentBadge>;
}

/**
 * 판정에 쓰는 절은 펼친 채로, 확인용 절은 접은 채로 둔다.
 * 접힌 절은 제목 옆 한 줄 요약으로 무엇이 들었는지 알린다.
 */
export function Rail({ label, children, summary, tone = 'primary', defaultOpen }: {
  label: string; children: React.ReactNode;
  summary?: React.ReactNode; tone?: 'primary' | 'secondary'; defaultOpen?: boolean;
}) {
  const collapsible = tone === 'secondary';
  const [open, setOpen] = useState(defaultOpen ?? !collapsible);
  if (!collapsible) {
    return (
      <section className="rail">
        <h3 className="rail-label">{label}</h3>
        <div className="rail-body">{children}</div>
      </section>
    );
  }
  return (
    <section className={`rail secondary${open ? ' open' : ''}`}>
      <button className="rail-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <h3 className="rail-label">{label}</h3>
        {!open && summary && <span className="rail-summary">{summary}</span>}
        <span className="rail-chev">{open ? '접기' : '펼치기'}</span>
      </button>
      {open && <div className="rail-body">{children}</div>}
    </section>
  );
}

export function KV({ k, v, muted }: { k: string; v: React.ReactNode; muted?: boolean }) {
  return (
    <div className="kv">
      <span className="kv-k">{k}</span>
      <span className={muted ? 'kv-v muted' : 'kv-v'}>{v}</span>
    </div>
  );
}
