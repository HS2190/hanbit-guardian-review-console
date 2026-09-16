export interface DocMeta { slug: string; no: string; title: string; blurb: string }

export const DOCS: DocMeta[] = [
  { slug: '00-assignment', no: '00', title: '과제 요약과 트랙 선택', blurb: '상황, 요구, 왜 관리자 화면인가' },
  { slug: '01-research-synthesis', no: '01', title: '리서치 종합', blurb: '공개 운영 문서에서 모은 사례' },
  { slug: '02-research-digest', no: '02', title: '리서치 다이제스트', blurb: '핵심만 추린 요약' },
  { slug: '03-competitor-analysis', no: '03', title: '경쟁 분석', blurb: '유사 서비스의 처리 방식' },
  { slug: '04-prd', no: '04', title: 'PRD', blurb: '단일 원칙, 결정 10개, 버린 대안 3개' },
  { slug: '05-screen-plan', no: '05', title: '화면 기획', blurb: '화면별 목적과 구성' },
  { slug: '06-feature-spec', no: '06', title: '기능 명세', blurb: '상태 23개와 전이 규칙' },
  { slug: '07-user-flow', no: '07', title: '플로우', blurb: '심사와 정책 변경의 경로' },
  { slug: '08-wireframes', no: '08', title: '와이어프레임', blurb: '배치 가설과 검증' },
  { slug: '09-design-spec', no: '09', title: '디자인 스펙', blurb: '레이아웃 문법과 토큰' },
  { slug: '10-component-spec', no: '10', title: '컴포넌트 스펙', blurb: '상태·속성·접근성 이름' },
  { slug: '11-writing-guide', no: '11', title: '라이팅 가이드', blurb: '상태 값 고정표와 금지 표현' },
  { slug: '12-copy-sheet', no: '12', title: '문구 시트', blurb: '화면별 원문·수정안·이유 161행' },
  { slug: '13-review', no: '13', title: '검수 기록', blurb: '잡힌 결함과 받아들이지 않은 지적' },
];

const loaders: Record<string, () => Promise<string>> = {
  '00-assignment': () => import('../../../docs/00-assignment.md?raw').then((m) => m.default),
  '01-research-synthesis': () => import('../../../docs/01-research-synthesis.md?raw').then((m) => m.default),
  '02-research-digest': () => import('../../../docs/02-research-digest.md?raw').then((m) => m.default),
  '03-competitor-analysis': () => import('../../../docs/03-competitor-analysis.md?raw').then((m) => m.default),
  '04-prd': () => import('../../../docs/04-prd.md?raw').then((m) => m.default),
  '05-screen-plan': () => import('../../../docs/05-screen-plan.md?raw').then((m) => m.default),
  '06-feature-spec': () => import('../../../docs/06-feature-spec.md?raw').then((m) => m.default),
  '07-user-flow': () => import('../../../docs/07-user-flow.md?raw').then((m) => m.default),
  '08-wireframes': () => import('../../../docs/08-wireframes.md?raw').then((m) => m.default),
  '09-design-spec': () => import('../../../docs/09-design-spec.md?raw').then((m) => m.default),
  '10-component-spec': () => import('../../../docs/10-component-spec.md?raw').then((m) => m.default),
  '11-writing-guide': () => import('../../../docs/11-writing-guide.md?raw').then((m) => m.default),
  '12-copy-sheet': () => import('../../../docs/12-copy-sheet.md?raw').then((m) => m.default),
  '13-review': () => import('../../../docs/13-review.md?raw').then((m) => m.default),
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
