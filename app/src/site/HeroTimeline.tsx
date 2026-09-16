import type { CSSProperties } from 'react';

/**
 * 히어로 그래픽 — 이 프로젝트의 주장을 그대로 그린 그림.
 * 시간 축 위에 정책 두 버전이 놓이고, 접수 시각이 떨어진 쪽이 금액을 정한다.
 * 제품 화면은 아래에서 전폭으로 나오므로 히어로가 같은 일을 또 하지 않는다.
 *
 * 색은 --g-* 네 변수만 쓴다. 톤을 바꿀 때 이 파일은 건드리지 않는다.
 */

const X0 = 20;    // 축 시작 (9/01)
const X1 = 540;   // 축 끝 (9/20)
const Y = 190;
const EDGE = 366; // v2 발효 경계 (9/15 10:23)
const MARK = 330; // #1042 접수 (9/15 09:47) — 경계보다 37분 앞
const TICKS = [0.12, 0.3, 0.48, 0.78, 0.94];

const dash = (len: number, delay: number) =>
  ({ '--len': len, strokeDasharray: len, animationDelay: `${delay}ms` } as CSSProperties);
const at = (delay: number) => ({ animationDelay: `${delay}ms` } as CSSProperties);

export function HeroTimeline() {
  const dropLen = 83 + (MARK - X0 - 24);
  return (
    <svg className="tl" viewBox="0 0 560 440" role="img"
      aria-label="시간 축 위에 정책 v1과 v2가 놓이고, 9월 15일 09시 47분에 접수된 #1042는 36분 뒤 발효한 v2가 아니라 v1의 30,000원으로 잠긴다는 다이어그램">

      {/* 정책 밴드 */}
      <rect className="band v1 f" x={X0} y={Y - 26} width={EDGE - X0} height={52} rx={4} style={at(260)} />
      <rect className="band f" x={EDGE} y={Y - 26} width={X1 - EDGE} height={52} rx={4} style={at(340)} />

      {/* 축 */}
      <line className="axis d" x1={X0} y1={Y + 26} x2={X1} y2={Y + 26} style={dash(X1 - X0, 60)} />

      {/* 버전 라벨 */}
      <text className="g-label f" x={X0 + 12} y={Y - 40} style={at(420)}>v1 · 30,000</text>
      <text className="g-label f" x={X0 + 12} y={Y + 8} opacity=".55" style={at(420)}>9/1 09:00 발효</text>
      <text className="g-label f" x={EDGE + 12} y={Y - 40} style={at(470)}>v2 · 10,000</text>
      <text className="g-label f" x={EDGE + 12} y={Y + 8} opacity=".55" style={at(470)}>9/15 10:23 발효</text>

      {/* 발효 경계 */}
      <line className="edge d" x1={EDGE} y1={Y - 60} x2={EDGE} y2={Y + 54} style={dash(114, 380)} />

      {/* 접수 마커 */}
      <g className="si" style={at(620)}>
        <circle className="ring" cx={MARK} cy={Y} r={13} />
        <circle className="dot" cx={MARK} cy={Y} r={5} />
      </g>
      <text className="g-label on f" x={MARK - 96} y={Y - 74} style={at(700)}>#1042 접수 9/15 09:47</text>
      <line className="edge d" x1={MARK} y1={Y - 66} x2={MARK} y2={Y - 16} style={dash(50, 700)} />

      {/* 드롭 라인 → 적용 결과 */}
      <path className="drop d" fill="none" d={`M ${MARK} ${Y + 13} L ${MARK} ${Y + 96} L ${X0 + 24} ${Y + 96}`}
        style={dash(dropLen, 840)} />

      <g className="pi" style={at(1180)}>
        <text className="g-val" x={X0 + 24} y={Y + 146} fontSize={40}>30,000원</text>
        <text className="g-label on" x={X0 + 24} y={Y + 172}>적용 v1 · 잠김 · 변경 불가</text>
        <rect className="lock" x={X0 + 232} y={Y + 118} width={20} height={15} rx={2.5} />
        <path className="lock" d={`M ${X0 + 236} ${Y + 118} v -5 a 6 6 0 0 1 12 0 v 5`} />
      </g>

      {/* 눈금 */}
      {TICKS.map((t, i) => {
        const x = X0 + (X1 - X0) * t;
        return <line key={t} className="tick f" x1={x} y1={Y + 26} x2={x} y2={Y + 34}
          opacity=".5" style={at(520 + i * 40)} />;
      })}
      <text className="g-label f" x={X0} y={Y + 52} opacity=".45" style={at(560)}>9/01</text>
      <text className="g-label f" x={X1 - 30} y={Y + 52} opacity=".45" style={at(560)}>9/20</text>
    </svg>
  );
}
