import { useEffect, useRef, useState } from 'react';
import { useOcean } from '../../store/oceanStore';

/** Desktop-only custom cursor: glowing dot -> ring (interactive) -> EXPLORE / OPEN labels. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const world = useOcean((s) => s.cursor);
  const [dom, setDom] = useState<{ interactive: boolean; label: string | null }>({ interactive: false, label: null });
  const pos = useRef({ x: -100, y: -100, rx: -100, ry: -100 });

  useEffect(() => {
    document.documentElement.classList.add('custom-cursor');
    let raf = 0;
    const move = (e: PointerEvent) => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.('a,button,[role="button"],[data-cursor],input,textarea,select,label') as HTMLElement | null;
      if (!el) return setDom({ interactive: false, label: null });
      const tag = el.tagName;
      const label = el.dataset.cursor ?? (tag === 'A' && (el as HTMLAnchorElement).href.startsWith('http') ? 'OPEN' : null);
      setDom({ interactive: tag !== 'INPUT' && tag !== 'TEXTAREA', label });
    };
    const loop = () => {
      const p = pos.current;
      p.rx += (p.x - p.rx) * 0.2;
      p.ry += (p.y - p.ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${p.rx}px,${p.ry}px,0)`;
      document.documentElement.style.setProperty('--mx', `${p.rx}px`);
      document.documentElement.style.setProperty('--my', `${p.ry}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
    };
  }, []);

  const label = world ?? dom.label;
  const expanded = !!world || dom.interactive;
  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dot} className="cursor__dot" />
      <div ref={ring} className="cursor__ring">
        <span className={`cursor__ring-inner ${expanded ? 'is-open' : ''} ${label ? 'has-label' : ''}`}>
          {label && <b>{label}</b>}
        </span>
      </div>
    </div>
  );
}
