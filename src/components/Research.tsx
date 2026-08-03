import React from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, Award } from 'lucide-react';
import { RESEARCH_DATA } from '../data/portfolioData';

export const Research: React.FC = () => {
  return (
    <section id="research" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          RESEARCH
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          Research & Publications
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          Exploring privacy-preserving AI and distributed machine learning systems.
        </p>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            <Clock size={12} />
            <span>{RESEARCH_DATA.status}</span>
          </span>

          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
            <Award size={12} className="text-[#4285F4]" />
            <span>{RESEARCH_DATA.expectedPublication}</span>
          </span>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#4285F4] shrink-0 hidden sm:block">
            <FileText size={28} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-gray-100 leading-snug">
              {RESEARCH_DATA.title}
            </h3>

            <p className="text-sm sm:text-base text-[#5F6368] dark:text-gray-300 leading-relaxed">
              {RESEARCH_DATA.description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Research Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {RESEARCH_DATA.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
