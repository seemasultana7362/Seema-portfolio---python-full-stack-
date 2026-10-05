import { useEffect, useRef } from 'react';
import { runtime } from '../../store/runtime';
import { SECTIONS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';

const DEPTHS = [0, 0, 0, 26, 52, 80, 108, 138];

/** Compass (heading) + depth gauge/minimap. Updated imperatively so it never re-renders. */
export function DepthCompass() {
  const needle = useRef<SVGGElement>(null);
  const depth = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const active = useOcean((s) => s.active);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 60) return;
      last = t;
      const d = Math.max(0, -runtime.camPos.y);
      if (depth.current) depth.current.textContent = String(Math.round(d)).padStart(3, '0');
      if (needle.current) needle.current.style.transform = `rotate(${(-runtime.heading * 180) / Math.PI}deg)`;
      if (marker.current) marker.current.style.top = `${Math.min(1, d / 140) * 100}%`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="gauge" aria-hidden="true">
      <div className="gauge__compass">
        <svg viewBox="-32 -32 64 64" width="64" height="64">
          <circle r="28" className="ring" />
          <circle r="21" className="ring ring--dim" />
          <g ref={needle} style={{ transformOrigin: '0 0' }}>
            {['N', 'E', 'S', 'W'].map((c, i) => (
              <text key={c} x={Math.sin((i * Math.PI) / 2) * 24.5} y={-Math.cos((i * Math.PI) / 2) * 24.5 + 2.4} textAnchor="middle" className={c === 'N' ? 'n' : ''}>{c}</text>
            ))}
          </g>
          <path d="M0,-12 L3.2,3 L0,0.5 L-3.2,3 Z" className="needle" />
        </svg>
      </div>
      <div className="gauge__readout">
        <small>DEPTH</small>
        <strong><span ref={depth}>000</span><em>m</em></strong>
      </div>
      <div className="gauge__strip">
        <i />
        {SECTIONS.map((s, k) => (
          <b key={s.id} className={s.id === active ? 'on' : ''} style={{ top: `${(DEPTHS[k] / 140) * 100}%` }} />
        ))}
        <div ref={marker} className="gauge__marker" />
      </div>
    </div>
  );
}
