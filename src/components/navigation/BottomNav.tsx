import { useEffect, useRef } from 'react';
import { Anchor, User, Layers, FlaskConical, Briefcase, GraduationCap, Award, Radio } from 'lucide-react';
import { SECTIONS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { useCameraNavigation } from '../../hooks/useCameraNavigation';

const ICONS = [Anchor, User, Layers, FlaskConical, Briefcase, GraduationCap, Award, Radio];

/** Phone navigation: a bottom dock with every section one tap away. */
export function BottomNav() {
  const active = useOcean((s) => s.active);
  const { goTo } = useCameraNavigation();
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="dock" aria-label="Ocean sections">
      <ul ref={ref}>
        {SECTIONS.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <li key={s.id}>
              <button type="button" onClick={() => goTo(s.id)} aria-current={active === s.id ? 'true' : undefined} className={active === s.id ? 'is-active' : ''}>
                <Icon size={18} />
                <span>{s.id === 'achievements' ? 'AWARDS' : s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
