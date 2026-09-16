import { useState } from 'react';
import { Button, Popup, TextField, Toast, TopNavigation } from '@hs2190.an/iris-react';
import { Store, useStore } from './store/store';
import { Queue, QueueEmptyPreview } from './ui/Queue';
import { Detail } from './ui/Detail';
import { Policy } from './ui/Policy';
import { judge } from './domain/rules';
import { won } from './ui/bits';
import './app.css';

type Tab = '심사 큐' | '정책';

const params = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);

function Console() {
  const { s, d } = useStore();
  const [tab, setTab] = useState<Tab>(params.get('tab') === 'policy' ? '정책' : '심사 큐');
  const [dialog, setDialog] = useState<null | 'confirm' | 'supplement'>(null);
  const [supReason, setSupReason] = useState('라벨 판독이 어려워 재촬영이 필요합니다');
  const wanted = params.get('id') ? `#${params.get('id')!.replace('#', '')}` : null;
  const selected = s.reports.find((r) => r.id === (s.selected ?? wanted)) ?? null;
  const j = selected ? judge(selected, s.reports, s.policies) : null;

  return (
    <div className="shell">
      <TopNavigation
        title="한빛마트 지킴이"
        trailing={<span className="user">최민아 · 본사 심사</span>}
      />
      <nav className="tabs">
        {(['심사 큐', '정책'] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? 'tab on' : 'tab'} onClick={() => setTab(t)}>{t}</button>
        ))}
        <span className="ctx">성수점 · 2026 가을 매장 지킴이</span>
      </nav>

      <main>
        {tab === '심사 큐' ? (
          <Queue>
            {selected
              ? <Detail r={selected}
                  onConfirm={() => setDialog('confirm')}
                  onSupplement={() => setDialog('supplement')} />
              : <QueueEmptyPreview />}
          </Queue>
        ) : <Policy />}
      </main>

      {dialog === 'confirm' && selected && j && (
        <div className="scrim" onClick={() => setDialog(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Popup
              title={j.amount === 0 ? `${j.outcome} · 0원으로 확정` : `지급 확정 — ${won(j.amount)}원`}
              onClose={() => setDialog(null)}
              footer={
                <>
                  <Button variant="outlined" color="assistive" onClick={() => setDialog(null)}>취소</Button>
                  <Button leadingIcon="lock" onClick={() => { d({ t: 'confirm', id: selected.id }); setDialog(null); }}>
                    확정 — 되돌릴 수 없음
                  </Button>
                </>
              }>
              <p><b>비가역</b> · 확정 후 자동 재계산 없음</p>
              <p>{selected.id} · 적용 정책 기준 {j.outcome} · 최종 {won(j.amount)}원</p>
              <p>고객 안내 즉시 발송</p>
            </Popup>
          </div>
        </div>
      )}

      {dialog === 'supplement' && selected && (
        <div className="scrim" onClick={() => setDialog(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Popup title="보완 요청" onClose={() => setDialog(null)}
              footer={
                <>
                  <Button variant="outlined" color="assistive" onClick={() => setDialog(null)}>취소</Button>
                  <Button onClick={() => { d({ t: 'supplement', id: selected.id, reason: supReason }); setDialog(null); }}>발송</Button>
                </>
              }>
              <p>기한은 발송 시각 + 7일로 고정되며 갱신되지 않습니다. 요청은 1회입니다.</p>
              <TextField label="요청 사유" value={supReason} onChange={(e) => setSupReason(e.target.value)} />
            </Popup>
          </div>
        </div>
      )}

      {s.toast && (
        <div className="toast-slot" onClick={() => d({ t: 'toast', text: null })}>
          <Toast tone="positive">{s.toast.text}</Toast>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <Store><Console /></Store>;
}
