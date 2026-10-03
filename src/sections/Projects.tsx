import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { ISLAND_THEME, PROJECT_IDS } from '../scene/projectIslands';
import { useOcean } from '../store/oceanStore';
import { Dock, ListButton } from '../components/ui/Dock';
import { Chips, GlassPanel, Reveal } from '../components/ui/GlassPanel';

const isUrl = (u: string) => /^https?:\/\//.test(u);

export function ProjectsDock() {
  const select = useOcean((s) => s.selectProject);
  const hover = useOcean((s) => s.hoverProject);
  const hovered = useOcean((s) => s.hoveredProject);
  return (
    <Dock code="02" eyebrow="PROJECTS" title="PROJECT ISLANDS">
      <p className="body">Each island is one project. Select an island — or a name below — and the camera flies to it.</p>
      <div className="list">
        {PROJECTS_DATA.map((p, i) => (
          <ListButton key={p.id} index={i} title={ISLAND_THEME[p.id].short} meta={p.category} cursor="EXPLORE" active={hovered === p.id} onHover={(on) => hover(on ? p.id : null)} onClick={() => select(p.id)} />
        ))}
      </div>
    </Dock>
  );
}

export function ProjectPanel({ id }: { id: string }) {
  const select = useOcean((s) => s.selectProject);
  const p = PROJECTS_DATA.find((x) => x.id === id);
  if (!p) return null;
  const i = PROJECT_IDS.indexOf(id);
  const step = (d: number) => select(PROJECT_IDS[(i + d + PROJECT_IDS.length) % PROJECT_IDS.length]);

  return (
    <GlassPanel
      key={id}
      title={p.title}
      eyebrow={`PROJECT ${String(i + 1).padStart(2, '0')} / ${String(PROJECT_IDS.length).padStart(2, '0')} — ${p.category}`}
      onClose={() => select(null)}
      wide
      footer={
        <div className="stepper">
          <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous project"><ChevronLeft size={18} /></button>
          <span>{ISLAND_THEME[id].metaphor}</span>
          <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next project"><ChevronRight size={18} /></button>
        </div>
      }
    >
      {p.image && (
        <Reveal>
          <img className="shot" src={p.image} alt={`${p.imageLabel} preview`} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </Reveal>
      )}
      <Reveal i={1}><p className="body lead">{p.summary}</p></Reveal>
      <Reveal i={2}>
        <h3 className="sub">Technologies</h3>
        <Chips items={p.technologies} />
      </Reveal>
      <Reveal i={3}>
        <h3 className="sub">Key features</h3>
        <ul className="bullets">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
      </Reveal>
      <Reveal i={4}>
        <h3 className="sub">Problem</h3>
        <p className="body">{p.problem}</p>
        <h3 className="sub">Solution</h3>
        <p className="body">{p.solution}</p>
      </Reveal>
      <Reveal i={5}>
        <div className="link-row">
          {isUrl(p.github) && <a className="cta cta--sm" href={p.github} target="_blank" rel="noopener noreferrer"><Github size={15} /> GITHUB</a>}
          {isUrl(p.demo) && <a className="cta cta--sm cta--ghost" href={p.demo} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> LIVE DEMO</a>}
        </div>
      </Reveal>
    </GlassPanel>
  );
}
