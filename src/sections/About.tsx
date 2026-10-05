import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react';
import { ABOUT_DATA, PERSONAL_INFO } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock } from '../components/ui/Dock';
import { GlassPanel, Reveal } from '../components/ui/GlassPanel';

export function AboutDock() {
  const open = useOcean((s) => s.openDetail);
  return (
    <Dock code="01" eyebrow="ABOUT" title="ABOUT THE EXPLORER">
      <p className="body">{ABOUT_DATA.paragraphs[0]}</p>
      <dl className="facts">
        {ABOUT_DATA.facts.map((f) => (
          <div key={f.title}><dt>{f.title}</dt><dd>{f.value}</dd></div>
        ))}
      </dl>
      <button type="button" className="cta cta--sm" onClick={() => open({ kind: 'about' })}>OPEN FULL PROFILE <ArrowRight size={14} /></button>
      <p className="hint">Or hover and click the island</p>
    </Dock>
  );
}

export function AboutPanel() {
  const close = () => useOcean.getState().openDetail(null);
  return (
    <GlassPanel title="ABOUT THE EXPLORER" eyebrow="01 — ABOUT" onClose={close}>
      <Reveal>
        <div className="profile">
          <img src={PERSONAL_INFO.profileImage} alt={`Portrait of ${PERSONAL_INFO.name}`} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div>
            <strong>{PERSONAL_INFO.name}</strong>
            <small>{PERSONAL_INFO.title}</small>
          </div>
        </div>
      </Reveal>
      <Reveal i={1}><p className="body">{PERSONAL_INFO.intro}</p></Reveal>
      {ABOUT_DATA.paragraphs.map((p, i) => (
        <Reveal key={p} i={2 + i}><p className="body">{p}</p></Reveal>
      ))}
      <Reveal i={4}>
        <dl className="facts">
          {ABOUT_DATA.facts.map((f) => (
            <div key={f.title}><dt>{f.title}</dt><dd>{f.value}</dd></div>
          ))}
          <div><dt>GPA</dt><dd>{PERSONAL_INFO.gpa}</dd></div>
        </dl>
      </Reveal>
      <Reveal i={5}>
        <h3 className="sub">Engineering philosophy</h3>
        <ul className="bullets">{ABOUT_DATA.principles.map((p) => <li key={p}>{p}</li>)}</ul>
      </Reveal>
      <Reveal i={6}>
        <div className="link-row">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer"><Github size={15} /> GitHub</a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> LinkedIn</a>
          <a href="/seema-sultana-resume.pdf" download><FileText size={15} /> Resume</a>
        </div>
      </Reveal>
    </GlassPanel>
  );
}
