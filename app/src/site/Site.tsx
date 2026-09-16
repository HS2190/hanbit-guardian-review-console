import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { ALL_DOCS, APPENDIX, DOCS, SHOTS, loadDoc } from './docs';
import { Reveal, WordReveal } from './motion';

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
          <Reveal className="col-12" stagger={false}>
            <span className="label">프로덕트 디자이너 사전 과제 · 2026.09.14 — 09.18</span>
          </Reveal>
          <div className="col-9">
            <WordReveal lines={['심사하는 동안 규칙이 바뀌어도,', '고객이 본 조건 그대로 심사되게']} />
          </div>
          <Reveal className="col-5 hero-sub" delay={340}>
            <p className="lead">
              심사 대기 중에 정책이 바뀌면 고객은 제출할 때 본 것과 다른 돈을 받습니다.
              관리자 백오피스를 다시 설계해 그 일이 일어나지 않게 만들었습니다.
            </p>
            <div className="cta-row">
              <a className="cta" href="#/app" onClick={(e) => { e.preventDefault(); go('app'); }}>프로토타입 열기</a>
              <a className="cta ghost" href="#/screens" onClick={(e) => { e.preventDefault(); go('screens'); }}>화면 보기</a>
            </div>
          </Reveal>
          <Reveal className="col-5 hero-facts" delay={460}>
            <dl className="facts">
              <div className="fact"><dt>트랙</dt><dd>관리자 백오피스 (고객 화면은 접점 3개 정의)</dd></div>
              <div className="fact"><dt>기간</dt><dd>닷새</dd></div>
              <div className="fact"><dt>산출</dt><dd>Figma 화면 33장 · 문서 10편 · 동작하는 프로토타입</dd></div>
              <div className="fact"><dt>역할</dt><dd>문제 정의부터 화면·문구·구현까지 단독</dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="grid">
          <Reveal className="col-4">
            <span className="label">문제</span>
            <h2>기준이 둘이면<br />누가 성실해도 갈린다</h2>
          </Reveal>
          <Reveal className="col-7" delay={80}>
            <p>정책은 이벤트 도중에 바뀌고, 제출과 지급 사이에는 수일에서 수주가 걸립니다. 그 사이에 금액이 내려가면 고객은 제출할 때 본 것과 다른 돈을 받습니다. 심사자도 이 제보가 어느 시점 기준인지 확인할 방법이 없어 지금 값으로 판단하게 됩니다.</p>
            <p className="pull">겉으로는 금액 분쟁이지만, 실제로는 <strong>하나의 제보에 두 개의 기준이 존재할 수 있다는 것</strong>이 문제입니다.</p>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="grid">
          <Reveal className="col-12">
            <div className="feature">
              <div className="feature-head">
                <span className="label accent">한 수</span>
                <h2>고를 수 있다는 것 자체를 없앴다</h2>
                <q>적용 정책은 접수 시각의 발효 버전으로 정해지고, 심사자는 그것을 선택할 수 없다.</q>
                <p>오류의 원인이 부주의가 아니라 선택지의 존재라고 봤습니다.</p>
              </div>
              <div className="feature-cards stg">
                <div className="mini"><span className="n">01</span><b>상태를 세 축으로 쪼갰다</b><span>처리·결과·지급이 한 배지에 섞이면 "유효한데 한도 때문에 0원"이 반려로 읽힌다.</span></div>
                <div className="mini"><span className="n">02</span><b>판정 순서를 고정했다</b><span>범위 → 유효성 → 중복 → 최초 여부 → 한도. 순서가 흔들리면 같은 사건이 다른 결과를 낸다.</span></div>
                <div className="mini"><span className="n">03</span><b>선행 건이 있으면 확정을 막는다</b><span>처리 순서가 총액을 바꾸지 않도록 접수순으로 배정한다. 대가인 대기를 화면에 드러낸다.</span></div>
                <div className="mini"><span className="n">04</span><b>바꾸기 전에 영향을 본다</b><span>이미 접수된 건이 몇 건이고 얼마가 줄지 않는지를 보여준 다음에 발행 버튼이 열린다.</span></div>
              </div>
            </div>
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
            <p>규칙이 실제로 계산됩니다. 목 데이터로 브라우저 안에서만 돌고, 새로고침하면 처음 상태로 돌아갑니다.</p>
            <div className="try-cards stg">
              <div className="mini light"><b>접수 시각이 기준이라는 것</b><span>#1042는 9/15 09:47 접수라 v1의 30,000원이 적용된다. 36분 뒤 v2가 발효했지만 이 건은 바뀌지 않는다.</span></div>
              <div className="mini light"><b>선행 건이 막는다는 것</b><span>#1063은 같은 고객의 #1042가 미판정이라 확정이 막혀 있다. #1042를 확정하면 잔여 한도로 열린다.</span></div>
              <div className="mini light"><b>유효한데 0원</b><span>한도를 다 쓴 고객의 새 제보는 결과가 유효로 남고 지급만 해당 없음이 된다.</span></div>
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
              <div><dt>동시 편집 잠금 없음</dt><dd>먼저 확정한 쪽이 이기고 뒤늦은 저장은 실패 안내를 받는다.</dd></div>
            </dl>
            <p className="tail">과정과 근거는 <a href="#/docs" onClick={(e) => { e.preventDefault(); go('docs'); }}>문서 여섯 편</a>에 정리했습니다. 작업 원문은 부록으로 접어 두었습니다.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function Screens() {
  return (
    <section className="band">
      <div className="grid">
        <div className="col-4"><span className="label">화면</span><h2>무엇을 보면 되는가</h2>
          <p>아래 아홉 장은 배포된 프로토타입에서 그대로 찍은 것입니다. 전체 화면 서른세 장과 설계 정본은 Figma에 있습니다.</p>
          <a className="cta ghost" href={FIGMA} target="_blank" rel="noreferrer">Figma에서 전체 보기 ↗</a>
        </div>
        <div className="col-7">
          <div className="shots">
            {SHOTS.map((s) => (
              <div className="shot" key={s.file}>
                <figure>
                  <img src={`${import.meta.env.BASE_URL}screens/${s.file}`} alt={s.label} loading="lazy" />
                  <figcaption><span className="cap-label">{s.label}</span>{s.cap}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
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
