import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Sparkles, Calendar } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../data/portfolioData';

export const Achievements: React.FC = () => {
  const badgeIcons: Record<string, React.ElementType> = {
    '1st Place': Trophy,
    'Top 6 Finalist': Award,
    Shortlisted: Sparkles,
  };

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          ACHIEVEMENTS
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          Milestones along the journey
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          Recognition earned through learning, teamwork, and innovation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ACHIEVEMENTS_DATA.map((item, idx) => {
          const Icon = badgeIcons[item.badge] || Trophy;
          return (
            <motion.div
              key={item.title}
              className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-7 shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 flex flex-col justify-between group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#4285F4]">
                    <Icon size={14} />
                    <span>{item.badge}</span>
                  </span>

                  <span className="inline-flex items-center space-x-1 text-xs text-[#5F6368] dark:text-gray-400">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#202124] dark:text-gray-100 mb-2 group-hover:text-[#4285F4] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#5F6368] dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>National & Regional Hackathons</span>
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
