import { Accordion, Button, Card, Divider, SectionHeader, SectionMessage, Table, TextField } from '@hs2190.an/iris-react';
import { useStore } from '../store/store';
import { currentPolicy, impact } from '../domain/policy';
import type { DefectType, Policy as PolicyVersion } from '../domain/types';
import { fmt, won } from './bits';

const DEFECTS: DefectType[] = ['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'];

/**
 * 발행 이력 — 모든 단계에서 오른쪽에 머문다.
 * 접힌 줄이 발효 "기간"을 말하는 것이 핵심이다. 어떤 접수가 어느 버전에 걸리는지가
 * 이 제품의 규칙 자체이므로, 시작 시각만으로는 그 규칙을 읽을 수 없다.
 * 펼치면 그 버전의 값이 나온다 — 지금까지 과거 버전의 금액을 볼 수 있는 화면이 없었다.
 */
function PolicyHistory() {
  const { s } = useStore();
  const versions = [...s.policies].sort(
    (a, b) => Date.parse(a.effectiveFrom) - Date.parse(b.effectiveFrom));

  const items = versions.map((p, i) => {
    const until = versions[i + 1]?.effectiveFrom;
    return {
      id: p.version,
      title: (
        <span className="hist-head">
          <b>{p.version}</b>
          <em>{fmt(p.effectiveFrom)} ~ {until ? fmt(until) : ''}</em>
          <span className={p.status === '발효' ? 'hist-state on' : 'hist-state'}>{p.status}</span>
        </span>
      ),
      content: <VersionValues p={p} />,
    };
  });

  return (
    <aside className="policy-history">
      <SectionHeader title="발행 이력" />
      <Accordion className="hist-acc" multiple items={items} />
    </aside>
  );
}

function VersionValues({ p }: { p: PolicyVersion }) {
  const rows: [string, string][] = [
    ...DEFECTS.map((k) => [k, won(p.amounts[k])] as [string, string]),
    ['대상 카테고리', p.categories.join(' · ')],
    ['1인 한도', won(p.perPersonCap)],
  ];
  return (
    <dl className="hist-values">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Policy() {
  const { s, d } = useStore();
  const current = currentPolicy(s.policies, s.now);
  const draft = s.draft;

  const head = (() => {
    if (s.step === '현황') return {
      title: '정책',
      sub: `발효 중 · ${current.version} (${fmt(current.effectiveFrom)}~)`,
      action: (
        <Button size="l" onClick={() => { d({ t: 'draft', patch: {} }); d({ t: 'step', v: '편집' }); }}>
          새 버전 초안 만들기
        </Button>
      ),
    };
    if (s.step === '편집' && draft) return { title: `정책 편집 · ${draft.version} 초안`, sub: null, action: null };
    if (s.step === '영향 확인' && draft) return { title: `영향 확인 · ${draft.version}`, sub: null, action: null };
    return { title: '발행 완료', sub: null, action: null };
  })();

  const body = (() => {
    if (s.step === '현황') return (
      <>
        <Card variant="outlined" className="card">
          <Table
            columns={[{ key: 'k', header: '항목' }, { key: 'v', header: '값' }]}
            data={[
              ...DEFECTS.map((k) => ({ k, v: won(current.amounts[k]) })),
              { k: '대상 카테고리', v: current.categories.join(' · ') },
              { k: '1인 한도', v: won(current.perPersonCap) },
            ]} />
        </Card>
      </>
    );

    if (s.step === '편집' && draft) return (
      <>
        <Card variant="outlined" className="card">
          {DEFECTS.map((k) => (
            <TextField key={k} label={k} value={String(draft.amounts[k])}
              helper={`기존 ${won(current.amounts[k])}`}
              onChange={(e) => d({
                t: 'draft',
                patch: { amounts: { ...draft.amounts, [k]: Number(e.target.value.replace(/\D/g, '') || 0) } },
              })} />
          ))}
          <TextField label="1인 한도" value={String(draft.perPersonCap)}
            helper={`기존 ${won(current.perPersonCap)}`}
            onChange={(e) => d({ t: 'draft', patch: { perPersonCap: Number(e.target.value.replace(/\D/g, '') || 0) } })} />
        </Card>
        <div className="row-actions">
          <Button variant="outlined" color="assistive" onClick={() => d({ t: 'step', v: '현황' })}>← 이전: 현황</Button>
          <Button onClick={() => d({ t: 'step', v: '영향 확인' })}>다음: 영향 확인 →</Button>
        </div>
      </>
    );

    if (s.step === '영향 확인' && draft) {
      const i = impact(s.reports, s.policies, draft);
      const noChange = i.changedFields.length === 0;
      return (
        <>
          <div className="impact">
            <Card variant="outlined"><span className="overline">① 지급 완료</span><b>{won(i.paid.amount)}</b><span>{i.paid.count}건</span></Card>
            <Card variant="outlined"><span className="overline">② 지급 확정 · 미송금</span><b>{won(i.confirmed.amount)}</b><span>{i.confirmed.count}건</span></Card>
            <Card variant="outlined"><span className="overline">③ 미확정 기준액 합계</span><b>{won(i.undecided.amount)}</b><span>{i.undecided.count}건</span></Card>
          </div>
          <p className="muted small">현재 분류 유지 가정 · 중복과 개인 한도 미반영</p>
          <SectionMessage tone="info" title={`이미 접수된 ${i.openCount}건 — 적용 조건 변경 없음`}>
            변경 항목({i.changedFields.join(' · ') || '없음'})에 해당하는 {i.affected.count}건 {won(i.affected.amount)}은
            이번 변경으로 줄지 않습니다. 새 값은 발효 이후 접수분부터 적용됩니다.
          </SectionMessage>
          <Divider />
          <div className="row-actions">
            <Button variant="outlined" color="assistive" onClick={() => d({ t: 'step', v: '편집' })}>← 이전: 편집</Button>
            <Button leadingIcon="lock" disabled={noChange} onClick={() => d({ t: 'publish' })}>
              지금 발행 — 되돌릴 수 없음
            </Button>
          </div>
          {noChange && <p className="muted small">변경된 항목 없음 — 값 변경 또는 초안 삭제 필요</p>}
        </>
      );
    }

    return (
      <>
        <SectionMessage tone="positive" title={`${currentPolicy(s.policies, s.now).version} 발효 중`}>
          새 값은 발효 이후 접수분부터 적용됩니다. 이미 접수된 건의 적용 조건은 바뀌지 않았습니다.
        </SectionMessage>
        <Button onClick={() => d({ t: 'step', v: '현황' })}>정책 현황으로</Button>
      </>
    );
  })();

  return (
    <div className="policy-page">
      <header className="policy-head">
        <div>
          <h1>{head.title}</h1>
          {head.sub && <p className="overline">{head.sub}</p>}
        </div>
        {head.action}
      </header>
      <div className="policy-two">
        <div className="policy">{body}</div>
        <PolicyHistory />
      </div>
    </div>
  );
}
