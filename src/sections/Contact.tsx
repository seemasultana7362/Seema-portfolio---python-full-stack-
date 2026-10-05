import { CheckCircle2, AlertCircle, FileText, Github, Linkedin, Loader2, Mail, Phone, Send } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useOcean } from '../store/oceanStore';
import { Dock } from '../components/ui/Dock';
import { GlassPanel, Reveal } from '../components/ui/GlassPanel';
import { useContactForm } from '../hooks/useContactForm';

const LINKS = [
  { label: 'Email', value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}`, icon: Mail },
  { label: 'Phone', value: PERSONAL_INFO.phone, href: `tel:${PERSONAL_INFO.phone}`, icon: Phone },
  { label: 'GitHub', value: 'github.com/seemasultana7362', href: PERSONAL_INFO.github, icon: Github },
  { label: 'LinkedIn', value: 'linkedin.com/in/seemasultana385', href: PERSONAL_INFO.linkedin, icon: Linkedin },
];

export function ContactDock() {
  const open = useOcean((s) => s.openDetail);
  return (
    <Dock code="07" eyebrow="CONTACT" title="LET'S CONNECT FROM THE DEEP">
      <p className="body">Whether it's an opportunity, collaboration, research discussion, or simply a conversation about technology, I'd be happy to connect.</p>
      <ul className="contact-links">
        {LINKS.map(({ label, value, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <Icon size={15} /><span><small>{label}</small>{value}</span>
            </a>
          </li>
        ))}
        <li>
          <a href="/seema-sultana-resume.pdf" download><FileText size={15} /><span><small>Resume</small>Download PDF</span></a>
        </li>
      </ul>
      <button type="button" className="cta" onClick={() => open({ kind: 'contact' })} data-cursor="OPEN">SEND TRANSMISSION <span aria-hidden="true">→</span></button>
    </Dock>
  );
}

export function ContactPanel() {
  const close = () => useOcean.getState().openDetail(null);
  const fire = useOcean((s) => s.fireTransmission);
  const { formData, loading, success, error, handleChange, handleSubmit } = useContactForm(fire);

  return (
    <GlassPanel title="SEND TRANSMISSION" eyebrow="07 — DEEP-SEA COMMUNICATION STATION" onClose={close}>
      <Reveal>
        <p className="body">Messages go straight to Seema's inbox. Replies typically arrive within 24 hours.</p>
      </Reveal>
      {success && (
        <div className="notice notice--ok" role="status"><CheckCircle2 size={18} /><span><b>TRANSMISSION RECEIVED</b><br />{success}</span><i className="notice__pulse" aria-hidden="true" /></div>
      )}
      {error && (
        <div className="notice notice--err" role="alert"><AlertCircle size={18} /><span>{error}</span></div>
      )}
      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form__row">
          <label>Your name<input name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" required autoComplete="name" /></label>
          <label>Your email<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required autoComplete="email" /></label>
        </div>
        <label>Subject<input name="subject" value={formData.subject} onChange={handleChange} placeholder="Apprenticeship / Collaboration Inquiry" required /></label>
        <label>Message<textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Write your message here..." required /></label>
        <button type="submit" className="cta" disabled={loading}>
          {loading ? (<><Loader2 size={15} className="spin" /> TRANSMITTING…</>) : (<>TRANSMIT <Send size={15} /></>)}
        </button>
      </form>
      <ul className="contact-links contact-links--inline">
        {LINKS.slice(0, 4).map(({ label, value, href, icon: Icon }) => (
          <li key={label}><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}><Icon size={14} /> {label}: {value}</a></li>
        ))}
      </ul>
    </GlassPanel>
  );
}
