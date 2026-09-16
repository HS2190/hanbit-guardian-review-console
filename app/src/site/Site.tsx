import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { ALL_DOCS, APPENDIX, DOCS, SHOTS, loadDoc } from './docs';
import { Reveal } from './motion';
import { HeroTimeline } from './HeroTimeline';
import { ScrollSteps, type Step } from './ScrollSteps';

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

const STEPS: Step[] = [
  { key: '01 / 접수 시각', title: '적용 정책은 접수 시각에 잠긴다',
    body: '#1042는 9/15 09:47 접수라 v1의 30,000원이 적용됩니다. 36분 뒤 v2가 발효해 같은 결함이 10,000원이 됐지만 이 건은 바뀌지 않습니다. 심사자는 이 값을 고를 수 없습니다.',
    shot: '02-detail.png', tags: ['심사 상세', '#1042 · 성수점 · 김서연', '적용 v1 · 잠김'] },
  { key: '02 / 세 축', title: '처리 · 결과 · 지급을 섞지 않는다',
    body: '한 배지에 섞으면 "유효한데 한도 때문에 0원"이 반려로 읽힙니다. 열을 분리하고 접두어를 붙여 색 말고도 단서를 남겼습니다.',
    shot: '01-queue.png', tags: ['심사 큐', '12열 · 14건', '처리 · 결과 · 지급 분리'] },
  { key: '03 / 순서', title: '판정 순서를 고정한다',
    body: '범위 → 유효성 → 중복 → 최초 → 한도. 앞에서 걸리면 뒤는 계산하지 않습니다. 순서가 흔들리면 같은 사건이 다른 결과를 냅니다.',
    shot: '02-detail.png', tags: ['심사 상세', '④ 산정 과정', '5단계까지 진행'] },
  { key: '04 / 대기', title: '선행 건이 있으면 확정을 막는다',
    body: '처리 순서가 총액을 바꾸지 않도록 접수순으로 한도를 배정합니다. 그 대가인 대기를 숨기지 않고 화면에 드러냈습니다.',
    shot: '01-queue.png', tags: ['심사 큐', '#1063 · 선행 판정 대기', '금액 · #1042'] },
  { key: '05 / 발행', title: '바꾸기 전에 영향을 본다',
    body: '이미 접수된 건이 몇 건이고 얼마가 줄지 않는지를 보여준 다음에야 발행 버튼이 열립니다.',
    shot: '08-impact.png', tags: ['영향 확인 · v3', '완료 2 · 확정 4 · 미확정 7', '발행 전 마지막 게이트'] },
];

export function Overview({ go }: { go: (r: Route, slug?: string) => void }) {
  return (
    <>
      <section className="band hero-band">
        <div className="grid">
          <div className="col-7 hero-txt">
            <div className="kick fu" style={{ animationDelay: '40ms' }}>프로덕트 디자이너 사전 과제 · 트랙 B · 2026.09.14 — 09.18</div>
            <h1 className="fu" style={{ animationDelay: '110ms' }}>심사하는 동안 규칙이 바뀌어도,<br />고객이 본 조건 그대로</h1>
            <p className="lede fu" style={{ animationDelay: '220ms' }}>
              제보를 받아 리워드를 주는 이벤트에서 정책은 도중에 바뀌고, 제출과 지급 사이에는 수일이 걸립니다.
              그 사이를 고객이 부담하지 않도록 관리자 백오피스를 다시 설계했습니다.
            </p>
            <div className="hero-facts fu" style={{ animationDelay: '300ms' }}>
              <span><b>닷새</b> · 혼자</span>
              <span><b>관리자 백오피스</b> · 고객 화면은 접점 3개 정의</span>
              <span><b>동작하는 프로토타입</b> · 규칙이 실제로 계산됩니다</span>
            </div>
          </div>
          <div className="col-5 hero-graphic"><HeroTimeline /></div>
        </div>
      </section>

      {/* 읽는 자리에 맞춰 화면이 따라온다 */}
      <section className="band steps-band">
        <div className="grid">
          <div className="col-12">
            <ScrollSteps steps={STEPS} base={import.meta.env.BASE_URL} />
          </div>
        </div>
      </section>

      <section className="band close-band">
        <div className="grid">
          <Reveal className="col-12">
            <h3>검증하지 못한 것</h3>
            <dl className="limits">
              <div><dt>사용자 검증 0회</dt><dd>적용 정책을 고를 수 없게 만든 것이 심사자에게 방해가 아니라 안심으로 느껴지는지가 첫 검증 항목이다.</dd></div>
              <div><dt>보완 1회 · 기한 7일은 가설</dt><dd>운영 데이터로 정할 값이다.</dd></div>
              <div><dt>동시 편집 잠금 없음</dt><dd>먼저 확정한 쪽이 이기고 뒤늦은 저장은 실패 안내를 받는다.</dd></div>
            </dl>
            <p className="tail">과정과 근거는 <a href="#/docs" onClick={(e) => { e.preventDefault(); go('docs'); }}>문서 여섯 편</a>에 정리했습니다. 작업 원문은 부록으로 접어 두었습니다.</p>
            <div className="cta-row">
              <a className="cta" href="#/app" onClick={(e) => { e.preventDefault(); go('app'); }}>프로토타입 열기</a>
              <a className="cta ghost" href="#/screens" onClick={(e) => { e.preventDefault(); go('screens'); }}>화면 아홉 장</a>
            </div>
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
