import { EDUCATION_DATA, RESEARCH_DATA } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock, ListButton } from '../components/ui/Dock';
import { Chips, GlassPanel, Reveal } from '../components/ui/GlassPanel';

export function EducationDock() {
  const open = useOcean((s) => s.openDetail);
  const hoverItem = useOcean((s) => s.hoverItem);
  const setItem = useOcean((s) => s.setHoverItem);
  return (
    <Dock code="05" eyebrow="EDUCATION" title="THE OBSERVATORY">
      <p className="body">Academic record as holographic plates, with the research project at the telescope.</p>
      <div className="list">
        {EDUCATION_DATA.map((e, i) => (
          <ListButton key={e.institution} index={i} title={e.institution} meta={`${e.qualification} · ${e.duration}`} active={hoverItem === `edu-${i}`} onHover={(on) => setItem(on ? `edu-${i}` : null)} onClick={() => open({ kind: 'education', id: i })} />
        ))}
        <ListButton index={EDUCATION_DATA.length} title="Research" meta={`${RESEARCH_DATA.status} · ${RESEARCH_DATA.expectedPublication}`} active={hoverItem === 'research'} onHover={(on) => setItem(on ? 'research' : null)} onClick={() => open({ kind: 'research' })} />
      </div>
    </Dock>
  );
}

export function EducationPanel({ id }: { id: number }) {
  const open = useOcean((s) => s.openDetail);
  const e = EDUCATION_DATA[id];
  if (!e) return null;
  return (
    <GlassPanel title={e.institution} eyebrow={`EDUCATION — ${e.duration}`} onClose={() => open(null)}>
      <Reveal><p className="role">{e.qualification}</p>{e.affiliation && <p className="meta">Affiliation: {e.affiliation}</p>}</Reveal>
      <Reveal i={1}>
        <dl className="facts">
          <div><dt>Duration</dt><dd>{e.duration}</dd></div>
          <div><dt>Score</dt><dd>{e.score}</dd></div>
        </dl>
      </Reveal>
      <Reveal i={2}><p className="body">{e.description}</p></Reveal>
    </GlassPanel>
  );
}

export function ResearchPanel() {
  const open = useOcean((s) => s.openDetail);
  return (
    <GlassPanel title="Research" eyebrow={`${RESEARCH_DATA.status.toUpperCase()}`} onClose={() => open(null)}>
      <Reveal><p className="role">{RESEARCH_DATA.title}</p><p className="meta">{RESEARCH_DATA.expectedPublication}</p></Reveal>
      <Reveal i={1}><p className="body">{RESEARCH_DATA.description}</p></Reveal>
      <Reveal i={2}><h3 className="sub">Technologies</h3><Chips items={RESEARCH_DATA.technologies} /></Reveal>
    </GlassPanel>
  );
}
