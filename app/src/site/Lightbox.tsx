import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface Shot { file: string; label: string; cap: string }

/**
 * 화면을 크게 보는 겹창.
 * 1440px UI는 갤러리 크기에서 글자가 읽히지 않으므로, 실제 크기에 가깝게 볼 수단이 필요하다.
 * 닫는 길을 셋 둔다 — 사진 클릭 · Esc · 닫기 버튼. 좌우 키로 아홉 장을 넘긴다.
 * 배경은 닫기 대상이 아니다. 넘기다가 빈 곳을 잘못 눌러 창이 닫히는 일이 없다.
 */
export function Lightbox({ shots, index, base, onClose, onMove }: {
  shots: Shot[];
  index: number;
  base: string;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const shot = shots[index];

  // 열고 닫을 때 한 번씩만 — 화살표로 넘길 때 포커스가 끌려다니면 안 된다
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    // 뒤 페이지가 따라 스크롤되지 않게 잠근다. 스크롤바가 사라지며 생기는 밀림은 보정한다.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: document.body.style.overflow, pad: document.body.style.paddingRight };
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.pad;
      // 열었던 자리로 돌려놓는다
      opener?.focus?.();
    };
  }, []);

  // 앞뒤 한 장씩 미리 받아 둔다 — 2배 이미지라 넘길 때 비는 순간이 생기면 안 된다
  useEffect(() => {
    for (const i of [(index + 1) % shots.length, (index - 1 + shots.length) % shots.length]) {
      const im = new window.Image();
      im.src = `${base}screens/${shots[i].file}`;
    }
  }, [index, shots, base]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); onMove((index + 1) % shots.length); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onMove((index - 1 + shots.length) % shots.length); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, shots.length, onClose, onMove]);

  // section.band에 z-index가 걸려 있어 그 안에서는 상단 내비 아래로 깔린다 — body에 직접 띄운다
  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${shot.label} — 크게 보기`}>
      <figure className="lb-body">
        {/* 사진을 누르면 닫힌다. 키보드는 Esc와 닫기 버튼이 맡으므로 탭 순서를 늘리지 않는다. */}
        <img src={`${base}screens/${shot.file}`} alt={shot.label} onClick={onClose} />
        <figcaption>
          <span className="lb-label">{shot.label}</span>
          <span className="lb-cap">{shot.cap}</span>
        </figcaption>
      </figure>

      <div className="lb-bar">
        <button type="button" className="lb-nav" aria-label="이전 화면"
          onClick={() => onMove((index - 1 + shots.length) % shots.length)}>←</button>
        <span className="lb-count" aria-live="polite">{index + 1} / {shots.length}</span>
        <button type="button" className="lb-nav" aria-label="다음 화면"
          onClick={() => onMove((index + 1) % shots.length)}>→</button>
        <button type="button" className="lb-close" ref={closeRef} aria-label="닫기" onClick={onClose}>
          닫기 <kbd>Esc</kbd>
        </button>
      </div>
    </div>,
    document.body,
  );
}
