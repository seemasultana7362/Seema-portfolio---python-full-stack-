import { SECTIONS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { useCameraNavigation } from '../../hooks/useCameraNavigation';

const DEPTH_LABEL = ['0 m', '0 m', '0 m', '26 m', '52 m', '80 m', '108 m', '138 m'];

/** Desktop marine navigation: a vertical depth rail. Every item is a real button. */
export function NavRail() {
  const active = useOcean((s) => s.active);
  const { goTo } = useCameraNavigation();
  return (
    <nav className="rail" aria-label="Ocean sections">
      <ol>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => goTo(s.id)} aria-current={active === s.id ? 'true' : undefined} className={active === s.id ? 'is-active' : ''}>
              <span className="rail__dot" />
              <span className="rail__code">{s.code}</span>
              <span className="rail__label">{s.label}</span>
              <span className="rail__depth">{DEPTH_LABEL[i]}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
