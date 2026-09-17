import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { ALL_DOCS, APPENDIX, DOCS, SHOTS, loadDoc } from './docs';
import { Reveal } from './motion';
import { Lightbox } from './Lightbox';
import { HeroTimeline } from './HeroTimeline';

const FIGMA = 'https://www.figma.com/design/riBWYMkoDYOWaRlTkggqnK/';

export type Route = 'overview' | 'screens' | 'docs' | 'app';

export function Nav({ route, go, doc }: { route: Route; go: (r: Route, slug?: string) => void; doc?: string }) {
  const item = (r: Route, label: string) => (
    <a href={`#/${r}`} className={route === r ? 'on' : ''}
      onClick={(e) => { e.preventDefault(); go(r); }}>{label}</a>
  );
  return (
    <nav className="site-nav">
      <div className="inner">
        <span className="mark">한빛마트 지킴이</span>
        {item('overview', '개요')}{item('docs', '문서')}{item('screens', '화면')}{item('app', '프로토타입')}
        <span className="right">
          <a href={FIGMA} target="_blank" rel="noreferrer">Figma ↗</a>
        </span>
      </div>
      {doc && <span hidden>{doc}</span>}
    </nav>
  );
}

export function Rails() {
  return (
    <div className="rails" aria-hidden>
      <span className="rail l" /><span className="rail r" />
      <span className="mark-sq tl" /><span className="mark-sq tr" />
    </div>
  );
}

export function Overview({ go }: { go: (r: Route, slug?: string) => void }) {
  return (
    <>
      <section className="band hero-band">
        <div className="grid">
          <div className="col-7 hero-txt">
            <div className="kick fu" style={{ animationDelay: '40ms' }}>프로덕트 디자이너 사전 과제 · 트랙 B · 2026.09.14 — 09.18</div>
            <h1 className="fu" style={{ animationDelay: '110ms' }}>
              심사하는 동안 규칙이 바뀌어도<span className="h1-line2">고객이 본 조건 그대로</span>
            </h1>
            <p className="lede fu" style={{ animationDelay: '220ms' }}>
              제보를 받아 리워드를 주는 이벤트에서 정책은 도중에 바뀌고, 제출과 지급 사이에는 수일이 걸립니다.
              그 사이를 고객이 부담하지 않도록 관리자 백오피스를 다시 설계했습니다.
            </p>
            <div className="cta-row fu" style={{ animationDelay: '320ms' }}>
              <a className="cta" href="#/app" onClick={(e) => { e.preventDefault(); go('app'); }}>프로토타입 열기</a>
              <a className="cta ghost" href="#/screens" onClick={(e) => { e.preventDefault(); go('screens'); }}>화면 보기</a>
            </div>
          </div>
          <div className="col-5 hero-graphic"><HeroTimeline /></div>
        </div>
      </section>

      <div className="metrics">
        <Reveal className="grid">
          <div className="metric"><b>39</b><span>Figma 화면</span></div>
          <div className="metric"><b>10</b><span>설계 문서</span></div>
          <div className="metric"><b>5일</b><span>작업 기간</span></div>
          <div className="metric"><b>1명</b><span>정의부터 구현까지</span></div>
        </Reveal>
      </div>

      <section className="band">
        <div className="grid">
          <Reveal className="col-12 move gutter">
            <span className="label">한 수</span>
            <div>
              <q>적용 정책은 <em>접수 시각의 발효 버전</em>으로 정해지고, 심사자는 그것을 선택할 수 없다.</q>
              <p>심사자에게 재량을 더 주는 대신 선택지를 없앴습니다. 오류의 원인이 부주의가 아니라 선택지의 존재라고 봤기 때문입니다.</p>
            </div>
          </Reveal>
          <Reveal className="col-12 gutter shot-gap" stagger={false}>
            <span className="label">화면</span>
            <figure className="bigshot">
              <img src={`${import.meta.env.BASE_URL}screens/02-detail.webp`} alt="심사 상세 — 적용 정책이 첫 시선에 닿는 배치" />
              <figcaption><b>심사 상세</b>첫 시선이 금액이 아니라 "어느 시점 기준인가"에 닿는다. #1042는 9/15 09:47 접수라 v1의 30,000원으로 잠겨 있고, 36분 뒤 발효한 v2는 이 건을 바꾸지 못한다.</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="grid">
          <Reveal className="col-12 decisions">
            {[
              ['01', '상태를 세 축으로 쪼갰다', '처리·결과·지급이 한 배지에 섞이면 "유효한데 한도 때문에 0원"이 반려로 읽힌다.'],
              ['02', '판정 순서를 고정했다', '범위 → 유효성 → 중복 → 최초 여부 → 한도. 순서가 흔들리면 같은 사건이 다른 결과를 낸다.'],
              ['03', '선행 건이 있으면 확정을 막는다', '처리 순서가 총액을 바꾸지 않도록 접수순으로 배정한다. 대가인 대기를 화면에 드러낸다.'],
              ['04', '바꾸기 전에 영향을 본다', '이미 접수된 건이 몇 건이고 얼마가 줄지 않는지를 보여준 다음에 발행 버튼이 열린다.'],
            ].map(([n, t, d]) => (
              <div className="dec" key={n}><span className="n">{n}</span><b>{t}</b><span>{d}</span></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="grid">
          <Reveal className="col-4">
            <span className="label">확인</span>
            <h2>말보다 눌러 보는 쪽이 빠릅니다</h2>
          </Reveal>
          <Reveal className="col-7" delay={80}>
            <p>규칙이 실제로 돌아 금액을 계산합니다. 목 데이터로 브라우저 안에서만 돌고, 새로고침하면 처음 상태로 돌아갑니다.</p>
            <div className="try-cards stg">
              <div className="mini"><b>접수 시각이 기준이라는 것</b><span>#1042는 9/15 09:47 접수라 v1의 30,000원이 적용된다. 36분 뒤 v2가 발효했지만 이 건은 바뀌지 않는다.</span></div>
              <div className="mini"><b>선행 건이 막는다는 것</b><span>#1063은 같은 고객의 #1042가 미판정이라 확정이 막혀 있다. #1042를 확정하면 잔여 한도로 열린다.</span></div>
              <div className="mini"><b>판정 순서가 고정이라는 것</b><span>#1121은 접수 당시 대상 밖(비식품)이라 증빙을 보지 않고 범위 외로 끝난다. 심사 착수를 누르면 버튼이 「범위 외 · 0원으로 확정」으로 바뀐다.</span></div>
            </div>
            <div className="cta-row"><a className="cta" href="#/app" onClick={(e) => { e.preventDefault(); go('app'); }}>프로토타입 열기</a></div>
          </Reveal>

          <Reveal className="col-4 limits-head">
            <span className="label">한계</span>
            <h3>검증하지 못한 것</h3>
          </Reveal>
          <Reveal className="col-7 limits-body" delay={80}>
            <dl className="limits">
              <div><dt>사용자 검증 0회</dt><dd>적용 정책을 고를 수 없게 만든 것이 심사자에게 방해가 아니라 안심으로 느껴지는지가 첫 검증 항목이다.</dd></div>
              <div><dt>보완 1회 · 기한 7일은 가설</dt><dd>운영 데이터로 정할 값이다.</dd></div>
              <div><dt>동시 편집 잠금 없음</dt><dd>먼저 확정한 내용이 저장된다. 뒤늦게 저장한 심사자에게는 실패를 알린다.</dd></div>
            </dl>
            <p className="tail">과정과 근거는 <a href="#/docs" onClick={(e) => { e.preventDefault(); go('docs'); }}>문서 여섯 편</a>에 정리했습니다. 작업 원문은 부록으로 접어 두었습니다.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function Screens() {
  const [open, setOpen] = useState<number | null>(null);
  const base = import.meta.env.BASE_URL;

  return (
    <section className="band">
      <div className="grid">
        <div className="col-4"><span className="label">화면</span><h2>무엇을 보면 되는가</h2>
          <p>아래 아홉 장은 배포된 프로토타입에서 그대로 찍은 것입니다. 눌러서 크게 볼 수 있습니다. 전체 화면 서른아홉 장과 설계 정본은 Figma에 있습니다.</p>
          <a className="cta ghost" href={FIGMA} target="_blank" rel="noreferrer">Figma에서 전체 보기 ↗</a>
        </div>
        <div className="col-7">
          <div className="shots">
            {SHOTS.map((s, i) => (
              <div className="shot" key={s.file}>
                <figure>
                  <button type="button" className="shot-open"
                    aria-label={`${s.label} 크게 보기`} onClick={() => setOpen(i)}>
                    <img src={`${base}screens/${s.file}`} alt={s.label} loading="lazy" />
                    <span className="shot-zoom" aria-hidden>크게 보기</span>
                  </button>
                  <figcaption><span className="cap-label">{s.label}</span>{s.cap}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>

      {open !== null && (
        <Lightbox shots={SHOTS} index={open} base={base}
          onClose={() => setOpen(null)} onMove={setOpen} />
      )}
    </section>
  );
}

export function Docs({ slug, go }: { slug: string; go: (r: Route, slug?: string) => void }) {
  const [md, setMd] = useState('');
  const current = useMemo(() => ALL_DOCS.find((d) => d.slug === slug) ?? DOCS[0], [slug]);

  useEffect(() => {
    let live = true;
    setMd('');
    loadDoc(current.slug).then((t) => { if (live) setMd(t); });
    return () => { live = false; };
  }, [current.slug]);

  const html = useMemo(() => (md ? marked.parse(md, { async: false }) as string : ''), [md]);

  return (
    <section className="band">
      <div className="grid">
        <div className="col-12">
          <div className="docs-layout">
            <aside className="toc">
              <span className="label" style={{ padding: '0 10px 8px' }}>읽는 문서 여섯</span>
              {DOCS.map((d) => (
                <a key={d.slug} href={`#/docs/${d.slug}`} className={d.slug === current.slug ? 'on' : ''}
                  onClick={(e) => { e.preventDefault(); go('docs', d.slug); }}>
                  {d.no} {d.title}
                </a>
              ))}
              <span className="label" style={{ padding: '18px 10px 8px' }}>부록 · 작업 원문</span>
              {APPENDIX.map((d) => (
                <a key={d.slug} href={`#/docs/${d.slug}`} className={`sub${d.slug === current.slug ? ' on' : ''}`}
                  onClick={(e) => { e.preventDefault(); go('docs', d.slug); }}>
                  {d.title}
                </a>
              ))}
            </aside>
            <article className="md">
              {html
                ? <div dangerouslySetInnerHTML={{ __html: html }} />
                : <p className="label">불러오는 중입니다</p>}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site">
      <div className="grid">
        <div className="col-6">
          <p style={{ margin: 0 }}>
            설계 정본 <a href={FIGMA} target="_blank" rel="noreferrer">Figma</a>
          </p>
        </div>
        <div className="col-6">
          <p style={{ margin: 0, textAlign: 'right' }}>
            과제 원문의 권리는 출제사에 있어 싣지 않았습니다. 문서와 화면은 직접 작성했습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
