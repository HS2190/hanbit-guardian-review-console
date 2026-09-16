import { Button, Card, Divider, ListCell, SectionHeader, SectionMessage, Table, TextField } from '@hs2190.an/iris-react';
import { useStore } from '../store/store';
import { currentPolicy, impact } from '../domain/policy';
import type { DefectType } from '../domain/types';
import { fmt, won } from './bits';

const DEFECTS: DefectType[] = ['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'];

export function Policy() {
  const { s, d } = useStore();
  const current = currentPolicy(s.policies, s.now);
  const draft = s.draft;

  if (s.step === '현황') return (
    <div className="policy">
      <h1>정책</h1>
      <Card variant="outlined" className="card">
        <div className="overline">발효 중 · {current.version} ({fmt(current.effectiveFrom)}~)</div>
        <Table
          columns={[{ key: 'k', header: '항목' }, { key: 'v', header: '값' }]}
          data={[
            ...DEFECTS.map((k) => ({ k, v: won(current.amounts[k]) })),
            { k: '대상 카테고리', v: current.categories.join(' · ') },
            { k: '1인 한도', v: won(current.perPersonCap) },
          ]} />
      </Card>
      <div className="history-list">
        <SectionHeader title="발행 이력" />
        {s.policies.map((p) => (
          <ListCell key={p.version} title={p.version}
            description={`${fmt(p.effectiveFrom)} 발효`} trailing={p.status} />
        ))}
      </div>
      <Button size="l" onClick={() => { d({ t: 'draft', patch: {} }); d({ t: 'step', v: '편집' }); }}>
        새 버전 초안 만들기
      </Button>
    </div>
  );

  if (s.step === '편집' && draft) return (
    <div className="policy">
      <h1>정책 편집 · {draft.version} 초안</h1>
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
    </div>
  );

  if (s.step === '영향 확인' && draft) {
    const i = impact(s.reports, s.policies, draft);
    const noChange = i.changedFields.length === 0;
    return (
      <div className="policy">
        <h1>영향 확인 · {draft.version}</h1>
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
      </div>
    );
  }

  return (
    <div className="policy">
      <h1>발행 완료</h1>
      <SectionMessage tone="positive" title={`${currentPolicy(s.policies, s.now).version} 발효 중`}>
        새 값은 발효 이후 접수분부터 적용됩니다. 이미 접수된 건의 적용 조건은 바뀌지 않았습니다.
      </SectionMessage>
      <Button onClick={() => d({ t: 'step', v: '현황' })}>정책 현황으로</Button>
    </div>
  );
}
