import { useMemo } from 'react';
import { FallbackView, FilterButton, SearchField, Table } from '@hs2190.an/iris-react';
import { useStore } from '../store/store';
import type { Process, Report } from '../domain/types';
import { OutcomeBadge, PayoutBadge, ProcessBadge, fmt } from './bits';

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

      <div className="workspace">
        <div className="list">
          {rows.length === 0 ? (
            <FallbackView icon="search" title="조건에 맞는 건이 없습니다"
              description="필터나 검색어를 지우면 전체가 보입니다." />
          ) : (
            <Table interactive
              columns={[
                { key: 'id', header: 'ID' }, { key: 'at', header: '접수' },
                { key: 'cu', header: '고객' }, { key: 'df', header: '결함 유형' },
                { key: 'pr', header: '처리' },
              ]}
              data={rows.map((r) => ({
                id: <button className={`row-id${s.selected === r.id ? ' on' : ''}`}
                  onClick={() => d({ t: 'select', id: r.id })}>{r.id}</button>,
                at: fmt(r.submittedAt), cu: r.customer, df: r.defectType,
                pr: <ProcessBadge v={r.process} />,
              }))} />
          )}
        </div>
        <div className="preview">{children}</div>
      </div>
    </div>
  );
}

export function QueueEmptyPreview() {
  return (
    <div className="preview-empty">
      <b>왼쪽에서 건을 선택하세요</b>
      <p className="muted">선택하면 접수 근거 · 산정 · 판정이 이 자리에 열립니다</p>
    </div>
  );
}

export function RowStates({ r }: { r: Report }) {
  return (
    <div className="badges">
      <ProcessBadge v={r.process} /><OutcomeBadge v={r.outcome} dupOf={r.duplicateOf} /><PayoutBadge r={r} />
    </div>
  );
}
