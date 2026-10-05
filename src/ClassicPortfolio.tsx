import React, { useEffect, useState } from 'react';
import { Waves } from 'lucide-react';
import { BackgroundMotion } from './components/BackgroundMotion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Research } from './components/Research';
import { Leadership } from './components/Leadership';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

/** The original 2D portfolio — the fallback when WebGL is unavailable, and an opt-in "classic view". */
export default function ClassicPortfolio({ onEnterOcean }: { onEnterOcean?: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#202124] text-[#202124] dark:text-gray-100 font-sans selection:bg-[#4285F4]/20 selection:text-[#4285F4] transition-colors duration-300 overflow-x-hidden">
      <BackgroundMotion theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 space-y-12 sm:space-y-16">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Experience />
        <Research />
        <Leadership />
        <Achievements />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />

      {onEnterOcean && (
        <button
          type="button"
          onClick={onEnterOcean}
          className="fixed left-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#061B2E] text-[#F8FAFC] border border-cyan-400/40 px-4 py-2.5 text-xs font-semibold tracking-widest shadow-lg hover:border-cyan-300 hover:shadow-cyan-500/20 transition cursor-pointer"
        >
          <Waves size={14} className="text-cyan-300" /> ENTER THE DIGITAL OCEAN
        </button>
      )}
    </div>
  );
}
