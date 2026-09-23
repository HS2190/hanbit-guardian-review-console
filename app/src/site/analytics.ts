/**
 * GA4 계측 — 이 사이트의 두 가지 사정에 맞춰 손으로 짠다.
 *
 * 1) 해시 라우팅. GA4 는 pushState·replaceState 만 감시하고, 게다가 pagePath 계열
 *    측정기준에서 URL 프래그먼트를 버린다. 해시를 그대로 두면 모든 화면이 한 줄로
 *    뭉쳐 보인다 — 그래서 라우트를 질의 문자열로 옮겨 담아 보고한다.
 *
 * 2) 참여시간. GA4 의 체류시간은 탭이 숨는 순간 보내는 user_engagement 한 건에
 *    매달려 있어서, 그 비콘이 유실되면 방문 기록은 남고 체류시간만 0초가 된다.
 *    (2026-09-18 첫 방문이 실제로 그랬다.) 보이는 동안의 시간을 직접 누적해
 *    문턱을 넘을 때마다 나눠 보내면 한 건이 유실돼도 나머지가 남는다.
 *
 * 문턱을 파라미터가 아니라 이벤트 이름(read_30s)에 담는 이유: GA4 는 콘솔에서 맞춤
 * 측정기준으로 등록하지 않은 이벤트 파라미터를 보고서와 Data API 에 노출하지 않는다.
 * 이름에 담으면 등록 없이 eventName 으로 바로 읽힌다.
 * engagement_time_msec 은 GA4 가 직접 해석하는 예약 파라미터라, 이것만은 파라미터로
 * 보내야 참여시간 지표와 참여 세션 수가 채워진다.
 */

type Gtag = (cmd: 'event', name: string, params?: Record<string, unknown>) => void;

/** 체류시간 문턱(초). 이 지점을 넘을 때마다 read_<n>s 이벤트가 한 번씩 나간다 */
const MARKS = [10, 30, 60, 180, 600] as const;

/** 문턱 감시 주기 — 2초면 문턱 판정이 최대 2초 늦는 정도로 충분하다 */
const TICK_MS = 2000;

/** 1초 미만 조각은 보내지 않는다 — 화면 전환·탭 깜빡임에서 나오는 노이즈다 */
const MIN_FLUSH_MS = 1000;

function gtag(): Gtag | null {
  return (window as unknown as { gtag?: Gtag }).gtag ?? null;
}

/** 이 화면을 실제로 보고 있던 누적 시간 (숨어 있던 시간은 빠진다) */
let visibleMs = 0;
/** 마지막으로 보이기 시작한 시각. 숨어 있으면 0 */
let shownAt = 0;
/** GA 로 이미 보낸 참여시간. 델타만 보내야 이중 계산되지 않는다 */
let reportedMs = 0;
/** 이미 보낸 문턱 */
const passed = new Set<number>();
/**
 * 지금 보고 있는 화면의 보고용 URL·제목.
 * read_* 이벤트는 page_location 을 싣지 않으면 gtag config 의 최초 URL(진입 주소)로 뭉뚱그려져
 * "어느 화면을 오래 봤는지"가 사라진다. 그래서 화면이 바뀔 때마다 여기 붙들어 두고 같이 싣는다.
 * (2026-09-23 첫 외부 방문의 read_10s 가 실제로 진입 주소에 붙어 어느 화면인지 읽히지 않았다.)
 */
let currentUrl = '';
let currentTitle = '';

/** read_* 이벤트에 실을 화면 정보. 첫 page_view 전이라면 비워 둔다 — GA4 기본값이 쓰인다 */
function screenParams(): Record<string, string> {
  return currentUrl ? { page_location: currentUrl, page_title: currentTitle } : {};
}

function viewedMs(): number {
  return visibleMs + (shownAt ? Date.now() - shownAt : 0);
}

/** 아직 보내지 않은 참여시간만 떼어 넘긴다 — GA4 가 합산하므로 중복은 곧 이중 계산이다 */
function takeEngagementDelta(): number {
  const total = viewedMs();
  const delta = Math.max(0, Math.round(total - reportedMs));
  reportedMs = total;
  return delta;
}

/** 남은 참여시간을 지금 정산해 보낸다 (탭이 숨을 때, 화면이 바뀔 때) */
function flush(): void {
  const g = gtag();
  if (!g) return;
  const delta = takeEngagementDelta();
  if (delta < MIN_FLUSH_MS) return;
  g('event', 'read_flush', { ...screenParams(), engagement_time_msec: delta });
}

function checkMarks(): void {
  const g = gtag();
  if (!g) return;
  const seconds = viewedMs() / 1000;
  for (const m of MARKS) {
    if (seconds < m || passed.has(m)) continue;
    passed.add(m);
    g('event', `read_${m}s`, { ...screenParams(), engagement_time_msec: takeEngagementDelta() });
  }
}

function onVisibilityChange(): void {
  if (document.visibilityState === 'visible') {
    if (!shownAt) shownAt = Date.now();
    return;
  }
  // 숨는 순간 누적을 확정하고 남은 시간을 보낸다 — 여기서 못 보내면 그만큼 사라진다
  if (shownAt) {
    visibleMs += Date.now() - shownAt;
    shownAt = 0;
  }
  flush();
}

/**
 * 라우트를 질의 문자열로 옮긴 보고용 URL.
 * 해시는 뒤에 그대로 붙여 둔다 — page_location 원문에는 남아 있어야 나중에 대조할 수 있다.
 */
function reportUrl(route: string, slug: string): string {
  const q = new URLSearchParams({ route });
  if (slug) q.set('slug', slug);
  return `${location.origin}${location.pathname}?${q.toString()}${location.hash}`;
}

/** 보고용 화면 제목. 정적 문서 제목으로 뭉치지 않도록 page_view·read_* 가 같은 값을 쓴다 */
function reportTitle(route: string, slug: string): string {
  return `한빛마트 지킴이 · ${route}${slug ? `/${slug}` : ''}`;
}

/**
 * 화면 하나의 조회를 보고한다. 진입 시 1회, 해시가 바뀔 때마다 1회.
 * index.html 에서 send_page_view 를 껐으므로 첫 화면도 여기서 보내야 한다.
 */
export function trackPageView(route: string, slug: string): void {
  // 이전 화면의 남은 참여시간을 먼저 정산한다 (카운터와 currentUrl 을 갈아끼우기 전에).
  // 이 시점엔 해시가 이미 새 화면으로 바뀌어 있으므로, 붙들어 둔 이전 URL 로만 올바르게 귀속된다.
  flush();
  visibleMs = 0;
  shownAt = document.visibilityState === 'visible' ? Date.now() : 0;
  reportedMs = 0;
  passed.clear();

  currentUrl = reportUrl(route, slug);
  currentTitle = reportTitle(route, slug);

  const g = gtag();
  if (!g) return;
  g('event', 'page_view', { page_location: currentUrl, page_title: currentTitle });
}

let firstSent = false;

/**
 * 진입 화면의 조회를 1회만 보고한다.
 * StrictMode 는 개발 모드에서 마운트 effect 를 두 번 돌리므로 그대로 두면 진입이 두 건으로 잡힌다.
 */
export function trackFirstPageView(route: string, slug: string): void {
  if (firstSent) return;
  firstSent = true;
  trackPageView(route, slug);
}

/** 문턱 감시와 가시성 추적을 시작한다. 반환값은 정리 함수 (StrictMode 재실행 대비) */
export function startEngagementTracking(): () => void {
  shownAt = document.visibilityState === 'visible' ? Date.now() : 0;
  const timer = setInterval(checkMarks, TICK_MS);
  document.addEventListener('visibilitychange', onVisibilityChange);
  // pagehide 는 탭을 닫거나 뒤로 갈 때 visibilitychange 보다 확실하게 잡힌다
  window.addEventListener('pagehide', flush);
  return () => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', flush);
  };
}
