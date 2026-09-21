import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * 계측은 GA 로 실제 이벤트를 보내야 확인되는 코드라 회귀가 조용히 일어난다.
 * (참여시간이 0 으로 남던 것도 배포 3일 뒤 GA 를 들여다봐야 알았다.)
 * 그래서 gtag 를 가로채 무엇을 어떤 이름으로 보내는지 여기서 못박아 둔다.
 * jsdom 을 얹지 않고 필요한 전역만 세운다 — 이 모듈이 만지는 건 location·document·window 셋뿐이다.
 */

type Call = [cmd: string, name: string, params?: Record<string, unknown>];

let calls: Call[];
let listeners: Record<string, () => void>;

function setup(hash = '') {
  calls = [];
  listeners = {};
  const on = (type: string, fn: () => void) => { listeners[type] = fn; };
  const off = (type: string) => { delete listeners[type]; };

  vi.stubGlobal('location', {
    origin: 'https://hs2190.github.io',
    pathname: '/hanbit-guardian-review-console/',
    hash,
    search: '',
  });
  vi.stubGlobal('document', {
    visibilityState: 'visible',
    addEventListener: on,
    removeEventListener: off,
  });
  vi.stubGlobal('window', {
    gtag: (...args: Call) => { calls.push(args); },
    addEventListener: on,
    removeEventListener: off,
  });
}

/** 매 테스트가 모듈의 누적 상태(문턱·참여시간)를 새로 시작하게 한다 */
async function freshModule() {
  vi.resetModules();
  return import('./analytics');
}

function events(name: string) {
  return calls.filter((c) => c[1] === name);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-21T10:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('page_view', () => {
  it('해시 라우트를 질의 문자열로 옮겨 보고한다', async () => {
    setup('#/docs/03-rules');
    const { trackPageView } = await freshModule();

    trackPageView('docs', '03-rules');

    const [view] = events('page_view');
    expect(view).toBeDefined();
    // GA4 는 pagePath 계열에서 프래그먼트를 버린다 — 질의로 옮겨야 화면별로 갈린다
    expect(view[2]?.page_location).toBe(
      'https://hs2190.github.io/hanbit-guardian-review-console/?route=docs&slug=03-rules#/docs/03-rules',
    );
    expect(view[2]?.page_title).toBe('한빛마트 지킴이 · docs/03-rules');
  });

  it('slug 이 없으면 route 만 싣는다', async () => {
    setup('#/screens');
    const { trackPageView } = await freshModule();

    trackPageView('screens', '');

    expect(events('page_view')[0][2]?.page_location).toBe(
      'https://hs2190.github.io/hanbit-guardian-review-console/?route=screens#/screens',
    );
  });

  it('진입 보고는 StrictMode 가 effect 를 두 번 돌려도 한 건이다', async () => {
    setup('#/overview');
    const { trackFirstPageView } = await freshModule();

    trackFirstPageView('overview', '');
    trackFirstPageView('overview', '');

    expect(events('page_view')).toHaveLength(1);
  });
});

describe('참여시간', () => {
  it('문턱을 넘을 때마다 이벤트 이름에 문턱을 담아 보낸다', async () => {
    setup('#/overview');
    const { trackFirstPageView, startEngagementTracking } = await freshModule();
    trackFirstPageView('overview', '');
    const stop = startEngagementTracking();

    vi.advanceTimersByTime(11_000);
    // 파라미터가 아니라 이름으로 구분해야 맞춤 측정기준 등록 없이 Data API 에서 읽힌다
    expect(events('read_10s')).toHaveLength(1);
    expect(events('read_30s')).toHaveLength(0);

    vi.advanceTimersByTime(20_000);
    expect(events('read_30s')).toHaveLength(1);

    vi.advanceTimersByTime(600_000);
    expect(events('read_60s')).toHaveLength(1);
    expect(events('read_180s')).toHaveLength(1);
    expect(events('read_600s')).toHaveLength(1);

    stop();
  });

  it('참여시간은 델타만 보낸다 — GA4 가 합산하므로 중복은 이중 계산이다', async () => {
    setup('#/overview');
    const { trackFirstPageView, startEngagementTracking } = await freshModule();
    trackFirstPageView('overview', '');
    const stop = startEngagementTracking();

    vi.advanceTimersByTime(11_000);
    vi.advanceTimersByTime(20_000);

    const sent = [...events('read_10s'), ...events('read_30s')]
      .map((c) => c[2]?.engagement_time_msec as number);
    // 10초·30초 지점에서 각각 10초·20초씩 나뉘어 나가고 합이 경과시간을 넘지 않는다
    expect(sent).toHaveLength(2);
    expect(sent[0]).toBeGreaterThanOrEqual(10_000);
    expect(sent[1]).toBeGreaterThanOrEqual(19_000);
    expect(sent.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(32_000);

    stop();
  });

  it('탭이 숨으면 남은 시간을 그 자리에서 정산한다', async () => {
    setup('#/overview');
    const { trackFirstPageView, startEngagementTracking } = await freshModule();
    trackFirstPageView('overview', '');
    const stop = startEngagementTracking();

    vi.advanceTimersByTime(45_000);
    (document as unknown as { visibilityState: string }).visibilityState = 'hidden';
    listeners.visibilitychange();

    const [flush] = events('read_flush');
    expect(flush).toBeDefined();
    // 30초 문턱 이후의 15초가 유실되지 않고 따라 나온다
    expect(flush[2]?.engagement_time_msec as number).toBeGreaterThanOrEqual(14_000);

    stop();
  });

  it('숨어 있는 동안은 시간이 흐르지 않는다', async () => {
    setup('#/overview');
    const { trackFirstPageView, startEngagementTracking } = await freshModule();
    trackFirstPageView('overview', '');
    const stop = startEngagementTracking();

    (document as unknown as { visibilityState: string }).visibilityState = 'hidden';
    listeners.visibilitychange();
    vi.advanceTimersByTime(600_000);

    // 배경 탭으로 열어둔 10분은 읽은 시간이 아니다
    expect(events('read_10s')).toHaveLength(0);

    stop();
  });

  it('화면이 바뀌면 이전 화면의 남은 시간을 정산하고 문턱을 다시 센다', async () => {
    setup('#/overview');
    const { trackFirstPageView, trackPageView, startEngagementTracking } = await freshModule();
    trackFirstPageView('overview', '');
    const stop = startEngagementTracking();

    vi.advanceTimersByTime(45_000);
    trackPageView('docs', '03-rules');

    expect(events('read_flush')).toHaveLength(1);
    expect(events('read_10s')).toHaveLength(1);

    vi.advanceTimersByTime(11_000);
    // 새 화면에서 문턱이 다시 열려 화면별 체류가 갈린다
    expect(events('read_10s')).toHaveLength(2);

    stop();
  });
});
