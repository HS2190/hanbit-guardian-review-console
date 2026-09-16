import { useEffect, useRef, useState } from 'react';

/**
 * 읽고 있는 단락에 맞춰 붙박이 화면이 바뀐다.
 * 설명과 화면을 따로 두면 독자가 둘을 머릿속에서 맞춰야 하는데, 여기서는 화면이 알아서 따라온다.
 * 화면이 바뀌지 않으면 이 절은 의미가 없으므로, 관찰이 불가능한 환경에서는 첫 화면을 그대로 둔다.
 */
export interface Step {
  key: string;
  title: string;
  body: string;
  shot: string;
  tags: string[];
}

export function ScrollSteps({ steps, base }: { steps: Step[]; base: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (!els.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (!seen.length) return;
        // 뷰포트 한가운데에 가장 가까운 단락이 이긴다
        const mid = window.innerHeight / 2;
        seen.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - mid) -
            Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - mid),
        );
        const i = els.indexOf(seen[0].target as HTMLElement);
        if (i >= 0) setActive(i);
      },
      { threshold: [0.4, 0.6], rootMargin: '-20% 0px -20% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const cur = steps[active] ?? steps[0];

  return (
    <div className="stack">
      <div className="stack-sticky">
        <figure className="stage">
          {/* key로 갈아끼워 새 화면이 페이드로 들어온다 */}
          <img key={cur.shot} src={`${base}screens/${cur.shot}`} alt={cur.tags[0]} />
          <figcaption>
            {cur.tags.map((t) => <span key={t}>{t}</span>)}
          </figcaption>
        </figure>
      </div>

      <div className="steps">
        {steps.map((s, i) => (
          <div key={s.key}
            ref={(el) => { refs.current[i] = el; }}
            className={i === active ? 'step on' : 'step'}>
            <div className="k">{s.key}</div>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            <div className="line" />
          </div>
        ))}
      </div>
    </div>
  );
}
