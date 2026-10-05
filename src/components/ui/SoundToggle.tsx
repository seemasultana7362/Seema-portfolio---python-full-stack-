import { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useOcean } from '../../store/oceanStore';
import { runtime } from '../../store/runtime';
import { setAmbienceDepth, startAmbience, stopAmbience, disposeAmbience } from '../../audio/ambience';

/** AMBIENCE OFF / ON. Off by default; audio only ever starts from this click. */
export function SoundToggle() {
  const on = useOcean((s) => s.sound);
  const toggle = useOcean((s) => s.toggleSound);

  const click = () => {
    // start audio synchronously inside the user gesture
    if (!on) startAmbience(); else stopAmbience();
    toggle();
  };

  useEffect(() => {
    if (!on) return;
    const iv = window.setInterval(() => setAmbienceDepth(Math.min(1, Math.max(0, -runtime.camPos.y / 140))), 400);
    return () => clearInterval(iv);
  }, [on]);
  useEffect(() => () => disposeAmbience(), []);

  return (
    <button type="button" className="hud-btn" onClick={click} aria-pressed={on} aria-label={`Ambient ocean sound ${on ? 'on' : 'off'}`}>
      {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span>AMBIENCE {on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
