import { useState } from 'react';
import { Alert, Button, Divider, Radio, Select, TextField } from '@hs2190.an/iris-react';
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
        <div className="alert-wrap">
          <Alert title="확정 차단 — 같은 고객의 선행 건 판정 필요">
            {j.blocked.reason}. 선행 건이 확정되거나 무효가 되어야 이 건의 금액이 정해집니다.
          </Alert>
        </div>
      )}

      <section className="summary">
        <div>
          <div className="overline">적용 정책 · {applied.version} ({fmt(applied.effectiveFrom)} 발효) · 잠김</div>
          <div className="amount">{r.defectType} {won(basis)}원</div>
          <div className="sub">{r.category} (대상) · 1인 한도 {won(applied.perPersonCap)}</div>
          {applied.version !== current.version && (
            <div className="sub muted">
              현재 {current.version}는 {won(current.amounts[r.defectType])} — 비교용이며 이 건에 적용되지 않습니다
            </div>
          )}
          <div className="sub muted">적용 정책은 접수 시각의 발효 버전으로 정해집니다 — 변경 불가</div>
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
      </section>

      <div className="detail-body">
        <div className="detail-main">
      <Rail label="① 접수 근거">
        <table className="basis">
          <thead>
            <tr><th>항목</th><th>적용 {applied.version} ({day(applied.effectiveFrom)})</th><th>현재 {current.version} · 비교</th></tr>
          </thead>
          <tbody>
            {DEFECTS.map((k) => (
              <tr key={k} className={k === r.defectType ? 'emph' : undefined}>
                <td>{k}</td>
                <td>{won(applied.amounts[k])}</td>
                <td className="muted">{applied.amounts[k] === current.amounts[k] ? '—' : won(current.amounts[k])}</td>
              </tr>
            ))}
            <tr><td>대상 카테고리</td><td>{applied.categories.join(' · ')}</td><td className="muted">—</td></tr>
            <tr><td>1인 한도</td><td>{won(applied.perPersonCap)}</td><td className="muted">—</td></tr>
          </tbody>
        </table>
      </Rail>

      <Rail label="② 증빙 · 유효성 평가">
        <div className="evidence">{r.evidenceNote ?? '사진 2장 · 라벨 판독 가능'}</div>
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
            <ul className="cands">
              {cands.map((c) => (
                <li key={c.id}>
                  <span>{c.id} · {fmt(c.submittedAt)} 접수 · {c.customer} · {c.outcome ?? '미판정'}</span>
                  {!done && (
                    <Button size="s" variant="outlined" color="assistive"
                      onClick={() => d({ t: 'duplicate', id: r.id, originId: c.id, reason: '같은 개체·같은 결함' })}>
                      {c.id}를 원본으로 중복 판정
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
      </Rail>

      <Rail label="④ 산정 과정">
        <ol className="trace">{j.trace.map((t, i) => <li key={i}>{t}</li>)}</ol>
      </Rail>

      <Rail label="⑤ 고객 안내 근거">
        <pre className="notice">
{`${fmt(r.submittedAt)} 접수 · 접수 당시 조건 ${r.defectType} ${won(basis)}원 (1인 한도 ${won(applied.perPersonCap)})
${noticeOutcome(r, j.outcome)}
${noticePayout(r, done)}
이의 제기 기한 ${day(new Date(Date.parse(s.now) + 14 * 864e5).toISOString())} (안내일 + 14일)`}
        </pre>
      </Rail>

      <Rail label="⑥ 활동 이력">
        <ul className="history">
          {r.history.map((h, i) => (
            <li key={i}><b>{fmt(h.at)}</b> {h.action}{h.after ? ` · ${h.after}` : ''}{h.actor ? ` · ${h.actor}` : ''}</li>
          ))}
        </ul>
      </Rail>

        </div>
      <div className="panel-col">
      <aside className="panel">
        <h3>판정</h3>
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
              <div className="block-card">
                <b>확정 불가 — {j.blocked.reason}</b>
                <p>선행 건을 먼저 판정하면 이 건의 금액이 정해집니다.</p>
                {j.blocked.targetId && (
                  <Button size="m" variant="outlined" color="assistive"
                    onClick={() => d({ t: 'select', id: j.blocked!.targetId! })}>
                    선행 건 {j.blocked.targetId} 열기
                  </Button>
                )}
              </div>
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
      </aside>
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
