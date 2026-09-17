import { useEffect, useState } from 'react';
import { Button, Popup, Scrim, Tabs, TextField, Toast, TopNavigation } from '@hs2190.an/iris-react';
import { Store, useStore } from './store/store';
import { Queue, QueueEmptyPreview } from './ui/Queue';
import { Detail } from './ui/Detail';
import { Policy } from './ui/Policy';
import { judge } from './domain/rules';
import { won } from './ui/bits';
import './app.css';
import './site/theme.css';
import { Docs, Footer, Nav, Overview, Rails, Screens, type Route } from './site/Site';

type Tab = '심사 큐' | '정책';

function readHash(): { route: Route; slug: string; query: URLSearchParams } {
  const raw = typeof location === 'undefined' ? '' : location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const [head, tail] = path.split('/');
  const search = typeof location === 'undefined' ? '' : location.search;
  // 해시가 없고 질의만 있는 옛 링크(?id=1063)도 프로토타입으로 보낸다
  const legacyApp = !raw && /[?&](id|tab)=/.test(search);
  const route: Route = (['overview', 'screens', 'docs', 'app'] as const).includes(head as Route)
    ? (head as Route) : legacyApp ? 'app' : 'overview';
  return { route, slug: tail ?? '', query: new URLSearchParams(qs ?? search) };
}

const params = readHash().query;

function Console() {
  const { s, d } = useStore();
  const [tab, setTab] = useState<Tab>(params.get('tab') === 'policy' ? '정책' : '심사 큐');
  const [dialog, setDialog] = useState<null | 'confirm' | 'supplement'>(null);
  const [supReason, setSupReason] = useState('라벨 판독이 어려워 재촬영이 필요합니다');
  const selected = s.reports.find((r) => r.id === s.selected) ?? null;
  const j = selected ? judge(selected, s.reports, s.policies) : null;

  // 토스트는 3초 뒤 스스로 사라진다 — 확인을 요구하지 않는 알림이라 손을 뺏지 않는다
  const toastText = s.toast?.text ?? null;
  useEffect(() => {
    if (!toastText) return;
    const id = setTimeout(() => d({ t: 'toast', text: null }), 3000);
    return () => clearTimeout(id);
  }, [toastText, d]);

  // 깜빡임은 600ms 한 번. 상태를 비워야 같은 행이 또 바뀔 때 다시 실행된다
  useEffect(() => {
    if (!s.flash) return;
    const id = setTimeout(() => d({ t: 'flash', id: null }), 600);
    return () => clearTimeout(id);
  }, [s.flash, d]);

  return (
    <div className="shell">
      <TopNavigation
        title="한빛마트 지킴이"
        trailing={<span className="user">최민아 · 본사 심사</span>}
      />
      <div className="tabbar">
        <Tabs items={['심사 큐', '정책'] as const} value={tab}
          onChange={(v) => setTab(v as Tab)} />
        <span className="ctx">성수점 · 2026 가을 매장 지킴이</span>
      </div>

      {/* 열두 열짜리 표는 1280 미만에서 컨테이너 밖으로 넘친다. 조용히 넘치게 두지 않고
          지금 무슨 일이 일어나는지 말한다 — 폭이 넓어지면 CSS가 알아서 걷어낸다. */}
      <p className="narrow-note" role="status">1280px 이상 화면 전용 — 현재 폭에서는 가로 스크롤</p>

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
        <div className="scrim" onClick={() => setDialog(null)}><Scrim />
          <div className="dialog-layer" onClick={(e) => e.stopPropagation()}>
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
        <div className="scrim" onClick={() => setDialog(null)}><Scrim />
          <div className="dialog-layer" onClick={(e) => e.stopPropagation()}>
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

function Site() {
  const [{ route, slug }, setNav] = useState(readHash);

  useEffect(() => {
    const on = () => { setNav(readHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = (r: Route, s?: string) => { location.hash = `#/${r}${s ? `/${s}` : ''}`; };

  if (route === 'app') {
    // 갤러리 캡처용 — 제품 화면만 남긴다
    const bare = params.get('bare') === '1';
    return (
      <div className="app-shell">
        {!bare && <Nav route={route} go={go} />}
          {!bare && <div className="doc-world app-frame">
            <div className="app-note">
              <b>프로토타입 · 규칙이 실제로 계산됩니다</b>
              <span>목 데이터로 브라우저 안에서만 동작하고 새로고침하면 처음 상태로 돌아갑니다.</span>
            </div>
          </div>}
        <Store><Console /></Store>
      </div>
    );
  }

  return (
    <>
      <Nav route={route} go={go} />
      {(
        <div className="doc-world">
          <Rails />
          {route === 'overview' && <Overview go={go} />}
          {route === 'screens' && <Screens />}
          {route === 'docs' && <Docs slug={slug || '00-assignment'} go={go} />}
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return <Site />;
}
