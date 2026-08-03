import React from 'react';
import { motion } from 'motion/react';
import { Code, Layout, Server, Database, Brain, Wrench, MessageSquare } from 'lucide-react';
import { SKILLS_DATA } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const categoryIcons: Record<string, React.ElementType> = {
    Languages: Code,
    Frontend: Layout,
    Backend: Server,
    Databases: Database,
    'AI / Machine Learning': Brain,
    'DevOps & Tools': Wrench,
    'Soft Skills': MessageSquare,
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          SKILLS
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          Technologies I work with
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          A growing toolkit built through academic learning, internships, projects, hackathons, and continuous exploration.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILLS_DATA.map((cat, idx) => {
          const Icon = categoryIcons[cat.category] || Code;
          return (
            <motion.div
              key={cat.category}
              className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-[#4285F4] dark:hover:border-[#4285F4] transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#4285F4] group-hover:scale-105 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#202124] dark:text-gray-100">
                  {cat.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 hover:border-[#4285F4] dark:hover:border-[#4285F4] hover:text-[#4285F4] dark:hover:text-[#4285F4] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
