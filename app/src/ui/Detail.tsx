import { useState } from 'react';
import { Button, Card, Divider, ListCell, Radio, SectionHeader, SectionMessage, Select, Table, TextButton, TextField } from '@hs2190.an/iris-react';
import { useStore } from '../store/store';
import { appliedPolicy, currentPolicy } from '../domain/policy';
import { duplicateCandidates, judge } from '../domain/rules';
import type { DefectType, Report } from '../domain/types';
import { OutcomeBadge, PayoutBadge, ProcessBadge, Rail, day, fmt, won } from './bits';

const DEFECTS: DefectType[] = ['유통기한 경과', '가격표 오류', '파손·오염', '통로 적재물', 'POP 오정보'];

export function Detail({ r, onConfirm, onSupplement }: {
  r: Report; onConfirm: () => void; onSupplement: () => void;
}) {
  const { s, d } = useStore();
  const [reason, setReason] = useState('');
  const [showAll, setShowAll] = useState(false);
  const applied = appliedPolicy(s.policies, r.submittedAt);
  const current = currentPolicy(s.policies, s.now);
  const j = judge(r, s.reports, s.policies);
  const done = r.process === '심사 완료';
  const cands = duplicateCandidates(r, s.reports);
  const basis = applied.amounts[r.defectType];

  return (
    <div className="detail">
      <header className="detail-head">
        <div className="crumb">심사 큐 › {r.id}</div>
        <h2>{r.id} {r.store} · {r.customer}</h2>
        <div className="badges">
          <ProcessBadge v={r.process} prefix />
          <OutcomeBadge v={r.outcome} dupOf={r.duplicateOf} prefix />
          <PayoutBadge r={r} prefix />
        </div>
        <div className="meta">{fmt(r.submittedAt)} 접수 · 담당 {r.assignee ?? '없음'}</div>
      </header>

      {j.blocked && (
        <SectionMessage tone="cautionary" className="alert-wrap"
          title="확정 차단 — 같은 고객의 선행 건 판정 필요">
          {j.blocked.reason}. 선행 건이 확정되거나 무효가 되어야 이 건의 금액이 정해집니다.
        </SectionMessage>
      )}

      <Card variant="outlined" className="summary">
        <div>
          <div className="overline">적용 정책 · {applied.version} ({fmt(applied.effectiveFrom)} 발효) · 잠김</div>
          <div className="amount">{r.defectType} {won(basis)}원</div>
          <div className="sub">{r.category} (대상) · 1인 한도 {won(applied.perPersonCap)}</div>
          <div className="sub muted">
            {applied.version !== current.version
              ? `현재 ${current.version}는 ${won(current.amounts[r.defectType])}이지만 이 건은 접수 시각 기준 ${applied.version}로 잠겨 있습니다`
              : '적용 정책은 접수 시각의 발효 버전으로 정해집니다 — 변경 불가'}
          </div>
        </div>
        <div>
          <div className="overline">산정</div>
          <div className="amount-sm">{done ? `${won(r.payout.amount ?? 0)}원` : '미확정'}</div>
          <div className="sub">기준액 {won(basis)} → 한도 조정 → 최종 {done ? won(r.payout.amount ?? 0) : '—'}</div>
        </div>
        <div>
          <div className="overline">다음 행동</div>
          <div className="amount-sm">{nextAction(r, j.blocked?.reason)}</div>
          <div className="sub">{done ? '확정 후 자동 재계산 없음' : '판정 패널에서 진행합니다'}</div>
        </div>
      </Card>

      <div className="detail-body">
        <div className="detail-main">
      <Rail label="① 접수 근거">
        <Table
          columns={[
            { key: 'k', header: '항목' },
            { key: 'a', header: `적용 ${applied.version} (${day(applied.effectiveFrom)})` },
            { key: 'c', header: `현재 ${current.version} · 비교` },
          ]}
          data={[
            {
              k: <b>{r.defectType}</b>,
              a: <b>{won(basis)}</b>,
              c: <span className="muted">{basis === current.amounts[r.defectType] ? '—' : won(current.amounts[r.defectType])}</span>,
            },
            { k: '대상 카테고리', a: applied.categories.join(' · '), c: <span className="muted">—</span> },
            { k: '1인 한도', a: won(applied.perPersonCap), c: <span className="muted">—</span> },
            ...(showAll ? DEFECTS.filter((k) => k !== r.defectType).map((k) => ({
              k, a: won(applied.amounts[k]),
              c: <span className="muted">{applied.amounts[k] === current.amounts[k] ? '—' : won(current.amounts[k])}</span>,
            })) : []),
          ]} />
        <TextButton size="s" onClick={() => setShowAll(!showAll)}>
          {showAll ? '다른 결함 유형 접기' : `다른 결함 유형 ${DEFECTS.length - 1}항목 펼치기`}
        </TextButton>
      </Rail>

      <Rail label="② 증빙 · 유효성 평가">
        <Card variant="filled" className="evidence">{r.evidenceNote ?? '사진 2장 · 라벨 판독 가능'}</Card>
        <div className="radios">
          <Radio name={`ev-${r.id}`} label="증빙 확인됨 — 유효성 통과" checked={r.evidenceOk}
            disabled={done} onChange={() => d({ t: 'evidence', id: r.id, ok: true })} />
          <Radio name={`ev-${r.id}`} label="증빙 불충분 — 보완 필요" checked={!r.evidenceOk}
            disabled={done} onChange={() => d({ t: 'evidence', id: r.id, ok: false })} />
        </div>
      </Rail>

      <Rail label="③ 중복 후보">
        {cands.length === 0
          ? <p className="muted">후보 없음 — 최초 유효 판정 진행 가능</p>
          : (
            <div className="cands">
              {cands.map((c) => (
                <ListCell key={c.id}
                  title={`${c.id} · ${c.customer}`}
                  description={`${fmt(c.submittedAt)} 접수 · ${c.outcome ?? '미판정'}`}
                  trailing={!done && (
                    <Button size="s" variant="outlined" color="assistive"
                      onClick={() => d({ t: 'duplicate', id: r.id, originId: c.id, reason: '같은 개체·같은 결함' })}>
                      원본으로 지정
                    </Button>
                  )} />
              ))}
            </div>
          )}
      </Rail>

      <Rail label="④ 산정 과정" tone="secondary" defaultOpen={done}
        summary={`판정 순서 ${j.step}단계까지 진행`}>
        <ol className="trace">{j.trace.map((t, i) => <li key={i}>{t}</li>)}</ol>
      </Rail>

      <Rail label="⑤ 고객 안내 근거" tone="secondary" defaultOpen={done}
        summary={done ? '확정본' : '확정 후 이 내용으로 발송'}>
        <pre className="notice">
{`${fmt(r.submittedAt)} 접수 · 접수 당시 조건 ${r.defectType} ${won(basis)}원 (1인 한도 ${won(applied.perPersonCap)})
${noticeOutcome(r, j.outcome)}
${noticePayout(r, done)}
이의 제기 기한 ${day(new Date(Date.parse(s.now) + 14 * 864e5).toISOString())} (안내일 + 14일)`}
        </pre>
      </Rail>

      <Rail label="⑥ 활동 이력" tone="secondary"
        summary={`${r.history.length}건`}>
        <div className="history">
          {r.history.map((h, i) => (
            <ListCell key={i} title={h.action}
              description={`${fmt(h.at)}${h.after ? ` · ${h.after}` : ''}${h.actor ? ` · ${h.actor}` : ''}`} />
          ))}
        </div>
      </Rail>

        </div>
      <div className="panel-col">
      <Card variant="outlined" className="panel">
        <SectionHeader title="판정" />
        {done ? (
          <p className="muted">확정되었습니다. 금액과 한도는 잠겼고 자동 재계산은 없습니다.</p>
        ) : (
          <>
            <Select label="결함 유형" value={r.defectType} disabled={done}
              options={DEFECTS.map((v) => ({ value: v, label: v }))}
              helper="변경 시 사유 필수"
              onChange={(e) => reason.trim()
                ? d({ t: 'reclassify', id: r.id, to: e.target.value as DefectType, reason })
                : d({ t: 'toast', text: '재분류하려면 사유를 먼저 적어 주세요' })} />
            <TextField label="사유" placeholder="재분류·판정 근거" value={reason}
              onChange={(e) => setReason(e.target.value)} />
            <Divider />
            {r.process === '접수' && (
              <Button size="l" onClick={() => d({ t: 'start', id: r.id })}>심사 착수</Button>
            )}
            {r.process !== '접수' && j.blocked && (
              <SectionMessage tone="cautionary" className="block-card"
                title={`확정 불가 — ${j.blocked.reason}`}>
                선행 건을 먼저 판정하면 이 건의 금액이 정해집니다.
                {j.blocked.targetId && (
                  <Button size="m" variant="outlined" color="assistive"
                    onClick={() => d({ t: 'select', id: j.blocked!.targetId! })}>
                    선행 건 {j.blocked.targetId} 열기
                  </Button>
                )}
              </SectionMessage>
            )}
            {r.process !== '접수' && !j.blocked && (
              <Button size="l" leadingIcon="lock" onClick={onConfirm}>
                {j.amount === 0 ? `${j.outcome} · 0원으로 확정` : `지급 확정 ${won(j.amount)}원`}
              </Button>
            )}
            {r.process !== '접수' && (
              <Button size="m" variant="outlined" color="assistive"
                disabled={(r.supplement?.count ?? 0) >= 1} onClick={onSupplement}>
                보완 요청 {(r.supplement?.count ?? 0) >= 1 ? '· 남은 횟수 0' : '· 남은 횟수 1'}
              </Button>
            )}
          </>
        )}
        {r.supplement && (
          <p className="muted small">
            보완 요청 {fmt(r.supplement.requestedAt)} 발송 · 기한 {fmt(r.supplement.dueAt)} · {r.supplement.submitted ? '제출됨' : '제출 없음'}
          </p>
        )}
      </Card>
      </div>
      </div>
    </div>
  );
}

function nextAction(r: Report, blocked?: string) {
  if (r.process === '접수') return '심사 착수';
  if (r.process === '심사 완료') return '완료';
  if (blocked) return '선행 건 판정';
  if (!r.evidenceOk) return '보완 요청';
  return '지급 확정';
}
function noticeOutcome(r: Report, o: Report['outcome']) {
  if (r.outcome === '중복') return `중복 — 원본 ${r.duplicateOf}과 같은 사건`;
  if (o === '범위 외') return '범위 외 — 접수 당시 대상이 아님';
  if (o === '증빙 불충분') return '증빙 불충분 — 기한까지 보완 미제출';
  return `${r.defectType} 유효`;
}
function noticePayout(r: Report, done: boolean) {
  if (!done) return '지급 — 심사 완료 후 확정';
  const a = r.payout.amount ?? 0;
  if (a === 0) return `지급 없음 — ${r.payout.reason ?? '사유'}`;
  return `${won(a)}원 지급`;
}
