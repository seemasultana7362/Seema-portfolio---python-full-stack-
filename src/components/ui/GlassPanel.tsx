import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

/** Premium glass panel shell used for every detail view: Esc-closable, focus-managed. */
export function GlassPanel({
  title,
  eyebrow,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => { prev?.focus?.({ preventScroll: true }); };
  }, []);

  return (
    <motion.aside
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label={title}
      className={`glass-panel ${wide ? 'glass-panel--wide' : ''}`}
      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}
    >
      <header className="glass-panel__head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="panel-title">{title}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </button>
      </header>
      <div className="glass-panel__body">{children}</div>
      {footer && <footer className="glass-panel__foot">{footer}</footer>}
    </motion.aside>
  );
}

/** Staggered reveal for panel content blocks. */
export function Reveal({ children, i = 0 }: { children: ReactNode; i?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const Chips = ({ items }: { items: string[] }) => (
  <ul className="chips" aria-label="Technologies">
    {items.map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);
