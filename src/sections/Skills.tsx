import { SKILLS_DATA } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock } from '../components/ui/Dock';

export function SkillsDock() {
  const hoverCategory = useOcean((s) => s.hoverCategory);
  const hoverItem = useOcean((s) => s.hoverItem);
  const setCat = useOcean((s) => s.setHoverCategory);
  const setItem = useOcean((s) => s.setHoverItem);
  return (
    <Dock code="03" eyebrow="SKILLS" title="UNDERWATER LAB">
      <p className="body">One glass pod per category, one glowing node per skill. Hover a skill to light it up in the lab.</p>
      <div className="skill-groups">
        {SKILLS_DATA.map((c) => (
          <div key={c.category} className={`skill-group ${hoverCategory === c.category ? 'is-hot' : ''}`} onMouseEnter={() => setCat(c.category)} onMouseLeave={() => setCat(null)}>
            <h3>{c.category}</h3>
            <ul className="chips">
              {c.skills.map((s) => {
                const key = `${c.category}|${s}`;
                return (
                  <li key={s} className={hoverItem === key ? 'is-hot' : ''} onMouseEnter={() => setItem(key)} onMouseLeave={() => setItem(null)}>
                    {s}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Dock>
  );
}
