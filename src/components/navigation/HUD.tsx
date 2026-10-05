import { Compass, Monitor } from 'lucide-react';
import { useOcean } from '../../store/oceanStore';
import { useCameraNavigation } from '../../hooks/useCameraNavigation';
import { SoundToggle } from '../ui/SoundToggle';
import { NavRail } from './NavRail';
import { BottomNav } from './BottomNav';
import { DepthCompass } from './DepthCompass';

/** The marine HUD: brand, depth rail, compass/depth gauge, tools — no conventional navbar. */
export function HUD() {
  const entered = useOcean((s) => s.entered);
  const setQuick = useOcean((s) => s.setQuickNav);
  const setMode = useOcean((s) => s.setMode);
  const { goTo } = useCameraNavigation();

  return (
    <>
      <header className="hud-top">
        <button type="button" className="brand" onClick={() => goTo('hero')} aria-label="SEEMA Digital Ocean — return to the surface">
          <strong>SEEMA</strong>
          <small>DIGITAL OCEAN</small>
        </button>
        <div className="hud-tools">
          <button type="button" className="hud-btn" onClick={() => setQuick(true)} aria-label="Open quick navigation (shortcut: slash)">
            <Compass size={14} /><span>QUICK NAV</span><kbd>/</kbd>
          </button>
          <button type="button" className="hud-btn" onClick={() => setMode('classic')} aria-label="Switch to the classic 2D portfolio">
            <Monitor size={14} /><span>2D VIEW</span>
          </button>
          <SoundToggle />
        </div>
      </header>
      {entered && (
        <>
          <NavRail />
          <DepthCompass />
          <BottomNav />
        </>
      )}
    </>
  );
}
