import { ABOUT_DATA, ACHIEVEMENTS_DATA, EDUCATION_DATA, LOCATIONS, PERSONAL_INFO, PROJECTS_DATA, RESEARCH_DATA, SKILLS_DATA } from '../../data/portfolioData';

/**
 * Visually hidden, fully semantic copy of the portfolio. Screen readers and
 * search engines get the whole story regardless of what the 3D scene shows.
 */
export function SemanticOutline() {
  return (
    <main className="sr-only" id="main">
      <h1>{PERSONAL_INFO.name} — {PERSONAL_INFO.title}</h1>
      <p>{PERSONAL_INFO.intro}</p>

      <section aria-labelledby="o-about"><h2 id="o-about">About</h2>
        {ABOUT_DATA.paragraphs.map((p) => <p key={p}>{p}</p>)}
        <ul>{ABOUT_DATA.facts.map((f) => <li key={f.title}>{f.title}: {f.value}</li>)}</ul>
      </section>

      <section aria-labelledby="o-projects"><h2 id="o-projects">Projects</h2>
        {PROJECTS_DATA.map((p) => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <p>Technologies: {p.technologies.join(', ')}</p>
            {/^https?:/.test(p.github) && <a href={p.github}>{p.title} on GitHub</a>}
            {/^https?:/.test(p.demo) && <a href={p.demo}>{p.title} live demo</a>}
          </article>
        ))}
      </section>

      <section aria-labelledby="o-skills"><h2 id="o-skills">Skills</h2>
        {SKILLS_DATA.map((c) => <p key={c.category}><strong>{c.category}:</strong> {c.skills.join(', ')}</p>)}
      </section>

      <section aria-labelledby="o-exp"><h2 id="o-exp">Experience and leadership</h2>
        {LOCATIONS.map((l) => (
          <article key={l.id}><h3>{l.organization} — {l.role}</h3><p>{l.duration}, {l.location}</p>
            <ul>{l.description.map((d) => <li key={d}>{d}</li>)}</ul></article>
        ))}
      </section>

      <section aria-labelledby="o-edu"><h2 id="o-edu">Education and research</h2>
        {EDUCATION_DATA.map((e) => <article key={e.institution}><h3>{e.institution}</h3><p>{e.qualification}, {e.duration}, {e.score}</p><p>{e.description}</p></article>)}
        <article><h3>{RESEARCH_DATA.title}</h3><p>{RESEARCH_DATA.status}. {RESEARCH_DATA.description}</p></article>
      </section>

      <section aria-labelledby="o-ach"><h2 id="o-ach">Achievements</h2>
        <ul>{ACHIEVEMENTS_DATA.map((a) => <li key={a.title}>{a.badge}: {a.title} ({a.date}) — {a.description}</li>)}</ul>
      </section>

      <section aria-labelledby="o-contact"><h2 id="o-contact">Contact</h2>
        <ul>
          <li><a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a></li>
          <li><a href={PERSONAL_INFO.github}>GitHub</a></li>
          <li><a href={PERSONAL_INFO.linkedin}>LinkedIn</a></li>
        </ul>
      </section>
    </main>
  );
}
