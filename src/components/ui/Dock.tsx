import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Compact glass card that docks beside the 3D scene for the active section. */
export function Dock({ code, eyebrow, title, children }: { code: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      className="dock-card"
      aria-label={title}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}
    >
      <p className="eyebrow"><span>{code}</span> {eyebrow}</p>
      <h2 className="dock-title">{title}</h2>
      {children}
    </motion.section>
  );
}

export function ListButton({
  index,
  title,
  meta,
  onClick,
  onHover,
  active,
  cursor = 'OPEN',
}: {
  index: number;
  title: string;
  meta?: string;
  onClick: () => void;
  onHover?: (on: boolean) => void;
  active?: boolean;
  cursor?: string;
}) {
  return (
    <button
      type="button"
      className={`list-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      data-cursor={cursor}
    >
      <span className="list-btn__n">{String(index + 1).padStart(2, '0')}</span>
      <span className="list-btn__t">
        <strong>{title}</strong>
        {meta && <small>{meta}</small>}
      </span>
      <span className="list-btn__arrow" aria-hidden="true">→</span>
    </button>
  );
}
