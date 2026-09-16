import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * 문서 세계의 진입 모션. 규칙은 셋뿐이다.
 * - transform과 opacity만 움직인다.
 * - 한 번만 재생하고 관찰을 끊는다.
 * - prefers-reduced-motion이면 처음부터 보인 상태로 둔다.
 */
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !('IntersectionObserver' in window)) { setInView(true); return; }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setInView(true);
          io.unobserve(e.target);
        }
      },
      // 섹션이 20% 보이고 뷰포트 아래쪽을 조금 지나야 시작한다
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView] as const;
}

/** 자식들이 순서대로 올라온다. delay는 이 블록 전체의 시작 시각. */
export function Reveal({ className, children, delay, stagger = true }: {
  className?: string; children: ReactNode; delay?: number; stagger?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const cls = [stagger ? 'rv-stagger' : 'rv', className, inView ? 'in' : ''].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} style={delay ? ({ '--d': `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
