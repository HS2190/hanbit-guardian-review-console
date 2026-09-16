import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './shadcn.css';
import { Store, useStore } from './store/store';
import { DetailShadcn } from './ui/DetailShadcn';

function Screen() {
  const { s } = useStore();
  const r = s.reports.find((x) => x.id === (s.selected ?? '#1042')) ?? s.reports[0];
  return (
    <div className="min-h-screen bg-background p-5">
      <div className="mb-4 border-b pb-3">
        <div className="text-sm font-semibold">shadcn/ui 실물 비교</div>
        <p className="text-xs text-muted-foreground">
          같은 데이터와 같은 규칙. UI 층만 shadcn 레지스트리에서 받은 컴포넌트로 조립했습니다.
        </p>
      </div>
      <DetailShadcn r={r} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><Store><Screen /></Store></StrictMode>,
);
