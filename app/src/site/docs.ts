export interface DocMeta { slug: string; no: string; title: string; blurb: string }

/** 읽는 문서 여섯 편 — 과제가 요구한 세 답변과 필수 항목을 담는다. */
export const DOCS: DocMeta[] = [
  { slug: '01-track', no: '01', title: '트랙 선택과 범위', blurb: '왜 관리자 화면인가, 고객 화면 접점 3개' },
  { slug: '02-problem', no: '02', title: '문제와 근거', blurb: '기준과 수단의 불일치, 숨은 문제 3, 공개 사례 5' },
  { slug: '03-rules', no: '03', title: '규칙과 버린 대안', blurb: '단일 원칙, 판정 순서 5단계, 버린 대안 3' },
  { slug: '04-states', no: '04', title: '상태 모델과 정책 적용', blurb: '3축 상태, 전이, 정책 변경이 각 상태에 미치는 영향' },
  { slug: '05-screens', no: '05', title: '화면 결정', blurb: '의미 제약 5의 번역, 하지 않은 것' },
  { slug: '06-review', no: '06', title: '검수 기록', blurb: '잡힌 결함 4, 받아들이지 않은 지적' },
];

/** 부록 — 작업 원문. 읽을 문서가 아니라 확인할 문서다. */
export const APPENDIX: DocMeta[] = [
  { slug: 'prd', no: '', title: 'PRD 전문', blurb: '결정 10개와 요구사항 25개' },
  { slug: 'feature-spec', no: '', title: '기능 명세', blurb: '상태 23개와 전이 전수' },
  { slug: 'screen-plan', no: '', title: '화면 기획', blurb: '화면별 목적과 구성' },
  { slug: 'user-flow', no: '', title: '플로우', blurb: '심사와 정책 변경의 경로' },
  { slug: 'wireframes', no: '', title: '와이어프레임', blurb: '배치 가설과 검증' },
  { slug: 'design-spec', no: '', title: '디자인 스펙', blurb: '레이아웃 문법과 레드라인' },
  { slug: 'component-spec', no: '', title: '컴포넌트 스펙', blurb: '상태·속성·접근성 이름' },
  { slug: 'writing-guide', no: '', title: '라이팅 가이드', blurb: '상태 값 고정표와 금지 표현' },
  { slug: 'copy-sheet', no: '', title: '문구 시트', blurb: '화면별 원문·수정안·이유 161행' },
  { slug: 'research-synthesis', no: '', title: '리서치 종합', blurb: '근거 원문과 출처' },
  { slug: 'research-digest', no: '', title: '리서치 다이제스트', blurb: '핵심 요약' },
  { slug: 'competitor-analysis', no: '', title: '경쟁 분석', blurb: '유사 서비스의 처리 방식' },
];

export const ALL_DOCS = [...DOCS, ...APPENDIX];

const loaders: Record<string, () => Promise<string>> = {
  '01-track': () => import('../../../docs/01-track.md?raw').then((m) => m.default),
  '02-problem': () => import('../../../docs/02-problem.md?raw').then((m) => m.default),
  '03-rules': () => import('../../../docs/03-rules.md?raw').then((m) => m.default),
  '04-states': () => import('../../../docs/04-states.md?raw').then((m) => m.default),
  '05-screens': () => import('../../../docs/05-screens.md?raw').then((m) => m.default),
  '06-review': () => import('../../../docs/06-review.md?raw').then((m) => m.default),
  'prd': () => import('../../../docs/appendix/prd.md?raw').then((m) => m.default),
  'feature-spec': () => import('../../../docs/appendix/feature-spec.md?raw').then((m) => m.default),
  'screen-plan': () => import('../../../docs/appendix/screen-plan.md?raw').then((m) => m.default),
  'user-flow': () => import('../../../docs/appendix/user-flow.md?raw').then((m) => m.default),
  'wireframes': () => import('../../../docs/appendix/wireframes.md?raw').then((m) => m.default),
  'design-spec': () => import('../../../docs/appendix/design-spec.md?raw').then((m) => m.default),
  'component-spec': () => import('../../../docs/appendix/component-spec.md?raw').then((m) => m.default),
  'writing-guide': () => import('../../../docs/appendix/writing-guide.md?raw').then((m) => m.default),
  'copy-sheet': () => import('../../../docs/appendix/copy-sheet.md?raw').then((m) => m.default),
  'research-synthesis': () => import('../../../docs/appendix/research-synthesis.md?raw').then((m) => m.default),
  'research-digest': () => import('../../../docs/appendix/research-digest.md?raw').then((m) => m.default),
  'competitor-analysis': () => import('../../../docs/appendix/competitor-analysis.md?raw').then((m) => m.default),
};

export const loadDoc = (slug: string) => loaders[slug]?.() ?? Promise.resolve('');

export const SHOTS = [
  { file: '01-queue-a.png', label: '심사 큐', cap: '처리·결과·지급 세 축을 열로 분리했다. 색만으로 구분하지 않도록 열 머리가 축 이름을 대신한다.' },
  { file: '02-detail-002A-b.png', label: '심사 상세', cap: '첫 시선이 적용 정책에 닿는다. 금액보다 "어느 시점 기준인가"가 먼저다.' },
  { file: '03-detail-002A-c-confirmable.png', label: '확정 가능 상태', cap: '조건이 갖춰지면 주 버튼 하나만 선다. 확정은 되돌릴 수 없으므로 자물쇠와 금액을 라벨에 넣었다.' },
  { file: '04-detail-blocked-002C.png', label: '확정 차단', cap: '이유 없는 비활성을 두지 않는다. 막힌 이유와 갈 곳을 함께 준다.' },
  { file: '05-detail-done-002H.png', label: '완료', cap: '확정 후에는 금액과 한도가 잠긴다. 자동 재계산이 없다는 사실을 화면이 말한다.' },
  { file: '06-compare-sheet-1188.png', label: '중복 비교', cap: '판단 질문을 맨 위에 두고 여섯 축으로 나란히 놓는다. 조치 기록이 별건 판단의 근거다.' },
  { file: '08-policy-status-v2.png', label: '정책 현황', cap: '발효 중 버전과 이력을 한 화면에. 지금 무엇이 적용되는지가 기준점이다.' },
  { file: '09-policy-impact.png', label: '영향 확인', cap: '발행 전 마지막 게이트. 이미 접수된 건이 몇 건이고 얼마가 줄지 않는지를 먼저 보여준다.' },
  { file: '12-queue-empty.png', label: '빈 상태', cap: '왜 비었는지와 다음에 할 수 있는 일을 함께 적는다.' },
  { file: '13-detail-002F-valid-0won.png', label: '유효 · 0원', cap: '결과는 유효로 남고 지급만 해당 없음이 된다. 반려로 읽히면 이 설계가 무너진다.' },
];
