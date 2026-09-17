import { useMemo } from 'react';
import { Card, ContentBadge, FallbackView, FilterButton, ListCell, SearchField, Table, TextButton } from '@hs2190.an/iris-react';
import { useStore } from '../store/store';
import { appliedPolicy, currentPolicy } from '../domain/policy';
import { blockingPredecessor } from '../domain/rules';
import type { Process, Report } from '../domain/types';
import { OutcomeBadge, PayoutBadge, ProcessBadge, fmt, won } from './bits';

const ORDER: Process[] = ['접수', '심사 중', '보완 대기', '선행 판정 대기', '재심 대상', '재심 중', '심사 완료'];

export function Queue({ children }: { children: React.ReactNode }) {
  const { s, d } = useStore();

  const rows = useMemo(() => {
    const q = s.query.trim();
    return s.reports
      .filter((r) => (s.filter ? r.process === s.filter : true))
      .filter((r) => (q ? r.id.includes(q) || r.customer.includes(q) : true))
      .sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt));
  }, [s.reports, s.filter, s.query]);

  const counts = useMemo(() => {
    const m = new Map<Process, number>();
    ORDER.forEach((p) => m.set(p, 0));
    s.reports.forEach((r) => m.set(r.process, (m.get(r.process) ?? 0) + 1));
    return m;
  }, [s.reports]);

  const selected = s.selected && rows.some((r) => r.id === s.selected) ? s.selected : s.selected;

  return (
    <div className="queue-page">
      <div className="page-head">
        <div>
          <h1>심사 큐</h1>
          <p className="muted">성수점 · 2026 가을 매장 지킴이 · 기준 {fmt(s.now)}</p>
        </div>
        <SearchField placeholder="#1042 또는 고객명" value={s.query}
          onChange={(e) => d({ t: 'query', v: e.target.value })}
          onClear={() => d({ t: 'query', v: '' })} />
      </div>

      <div className="counters">
        {ORDER.map((p) => (
          <FilterButton key={p} active={s.filter === p} count={counts.get(p) ?? 0}
            onClick={() => d({ t: 'filter', v: s.filter === p ? null : p })}>{p}</FilterButton>
        ))}
        <span className="muted small">사유 합계는 건수와 다를 수 있음</span>
      </div>

      {rows.length === 0 ? (
        <div className="list full">
          <FallbackView icon="search" title="조건에 맞는 건이 없습니다"
            description="필터나 검색어를 지우면 전체가 보입니다." />
        </div>
      ) : selected ? (
        <div className="workspace">
          <Card variant="outlined" className="queue-rail">
            <div className="queue-rail-head">
              <b>심사 큐 · {rows.length}건</b>
              <TextButton size="s" trailingIcon="chevron-right"
                onClick={() => d({ t: 'select', id: null })}>목록 펼치기</TextButton>
            </div>
            {rows.map((r) => (
              <ListCell key={r.id} interactive
                className={[r.id === selected && 'on', r.id === s.flash && 'flash']
                  .filter(Boolean).join(' ') || undefined}
                onClick={() => d({ t: 'select', id: r.id })}
                title={r.id}
                description={fmt(r.submittedAt)}
                trailing={<ProcessBadge v={r.process} />} />
            ))}
          </Card>
          <div className="preview">{children}</div>
        </div>
      ) : (
        <div className="list full">
          <FullTable rows={rows} />
        </div>
      )}
    </div>
  );
}

/** 선택 전 큐 — 훑으면서 무엇을 먼저 열지 정하는 화면이라 열을 줄이지 않는다. */
function FullTable({ rows }: { rows: Report[] }) {
  const { s, d } = useStore();
  const current = currentPolicy(s.policies, s.now);
  const days = (iso: string) => Math.max(0, Math.floor((Date.parse(s.now) - Date.parse(iso)) / 864e5));

  return (
    <Table interactive
      onClick={(e) => {
        const tr = (e.target as HTMLElement).closest('tbody tr');
        if (!tr?.parentElement) return;
        const i = Array.prototype.indexOf.call(tr.parentElement.children, tr);
        const row = rows[i];
        if (row) d({ t: 'select', id: row.id });
      }}
      columns={[
        { key: 'id', header: 'ID' }, { key: 'at', header: '접수' }, { key: 'cu', header: '고객' },
        { key: 'df', header: '결함 유형' }, { key: 'am', header: '기준액 (적용)', align: 'right' },
        { key: 'po', header: '정책' }, { key: 'pr', header: '처리' }, { key: 'hd', header: '보류 사유' },
        { key: 'rs', header: '결과' }, { key: 'py', header: '지급' },
        { key: 'as', header: '담당' }, { key: 'dw', header: '체류', align: 'right' },
      ]}
      data={rows.map((r) => {
        const p = appliedPolicy(s.policies, r.submittedAt);
        const differs = p.version !== current.version && p.amounts[r.defectType] !== current.amounts[r.defectType];
        return {
          id: <TextButton size="s" className={s.selected === r.id ? 'row-id on' : 'row-id'}>{r.id}</TextButton>,
          at: fmt(r.submittedAt), cu: r.customer, df: r.defectType,
          am: won(p.amounts[r.defectType]),
          po: <span className="pol">{p.version}{differs && <ContentBadge tone="cautionary" variant="subtle">적용 ≠ 현재</ContentBadge>}</span>,
          pr: <ProcessBadge v={r.process} />,
          hd: <HoldReason r={r} />,
          rs: <OutcomeBadge v={r.outcome} dupOf={r.duplicateOf} />,
          py: <PayoutBadge r={r} />,
          as: r.assignee ?? '—',
          dw: `${days(r.submittedAt)}일`,
        };
      })} />
  );
}

function HoldReason({ r }: { r: Report }) {
  const { s } = useStore();
  if (r.process === '보완 대기' && r.supplement) {
    const left = Math.ceil((Date.parse(r.supplement.dueAt) - Date.parse(s.now)) / 864e5);
    return <span className="hold">기한 {fmt(r.supplement.dueAt)} D{left >= 0 ? '-' : '+'}{Math.abs(left)}<br />
      <em>{r.supplement.submitted ? '제출 있음' : '제출 없음'}</em></span>;
  }
  if (r.process === '선행 판정 대기') {
    const pred = blockingPredecessor(r, s.reports);
    return <span className="hold">금액 · {pred?.id ?? '—'}</span>;
  }
  return <span className="muted">—</span>;
}

export function QueueEmptyPreview() {
  return <FallbackView icon="search" title="목록에서 건을 선택하세요"
    description="선택하면 접수 근거와 산정과 판정이 이 자리에 열립니다." />;
}
