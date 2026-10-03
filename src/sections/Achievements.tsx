import { ACHIEVEMENTS_DATA } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock, ListButton } from '../components/ui/Dock';
import { GlassPanel, Reveal } from '../components/ui/GlassPanel';

export function AchievementsDock() {
  const open = useOcean((s) => s.openDetail);
  const hoverItem = useOcean((s) => s.hoverItem);
  const setItem = useOcean((s) => s.setHoverItem);
  return (
    <Dock code="06" eyebrow="ACHIEVEMENTS" title="THE LIVING REEF">
      <p className="body">Every pearl on the reef is a recognition. Hover one in the scene, or pick it here.</p>
      <div className="list">
        {ACHIEVEMENTS_DATA.map((a, i) => (
          <ListButton key={a.title} index={i} title={a.title} meta={`${a.badge} · ${a.date}`} active={hoverItem === `ach-${i}`} onHover={(on) => setItem(on ? `ach-${i}` : null)} onClick={() => open({ kind: 'achievement', id: i })} />
        ))}
      </div>
    </Dock>
  );
}

export function AchievementPanel({ id }: { id: number }) {
  const open = useOcean((s) => s.openDetail);
  const a = ACHIEVEMENTS_DATA[id];
  if (!a) return null;
  return (
    <GlassPanel title={a.title} eyebrow={`${a.badge.toUpperCase()} — ${a.date}`} onClose={() => open(null)}>
      <Reveal><span className="badge">{a.badge}</span></Reveal>
      <Reveal i={1}><p className="body lead">{a.description}</p></Reveal>
      <Reveal i={2}><p className="meta">{a.date}</p></Reveal>
    </GlassPanel>
  );
}
