import { LOCATIONS } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock, ListButton } from '../components/ui/Dock';
import { Chips, GlassPanel, Reveal } from '../components/ui/GlassPanel';

export function ExperienceDock() {
  const open = useOcean((s) => s.openDetail);
  const hoverItem = useOcean((s) => s.hoverItem);
  const setItem = useOcean((s) => s.setHoverItem);
  return (
    <Dock code="04" eyebrow="EXPERIENCE" title="THE DEEP TRENCH">
      <p className="body">Each beacon is a role or leadership position. Select one to read the details.</p>
      <div className="list">
        {LOCATIONS.map((l, i) => (
          <ListButton key={l.id} index={i} title={l.organization} meta={`${l.role} · ${l.duration}`} active={hoverItem === l.id} onHover={(on) => setItem(on ? l.id : null)} onClick={() => open({ kind: 'experience', id: l.id })} />
        ))}
      </div>
    </Dock>
  );
}

export function ExperiencePanel({ id }: { id: string }) {
  const open = useOcean((s) => s.openDetail);
  const l = LOCATIONS.find((x) => x.id === id);
  if (!l) return null;
  return (
    <GlassPanel title={l.organization} eyebrow={`${l.kind.toUpperCase()} — ${l.duration}`} onClose={() => open(null)}>
      <Reveal>
        <p className="role">{l.role}</p>
        <p className="meta">{l.duration} · {l.location}</p>
      </Reveal>
      <Reveal i={1}>
        <h3 className="sub">Responsibilities</h3>
        <ul className="bullets">{l.description.map((d) => <li key={d}>{d}</li>)}</ul>
      </Reveal>
      {l.technologies.length > 0 && (
        <Reveal i={2}>
          <h3 className="sub">Technologies</h3>
          <Chips items={l.technologies} />
        </Reveal>
      )}
    </GlassPanel>
  );
}
