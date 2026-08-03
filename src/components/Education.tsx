import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { EDUCATION_DATA } from '../data/portfolioData';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          EDUCATION
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          My academic journey
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          A strong academic foundation combined with continuous technical learning and hands-on experience.
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Vertical Connecting Line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2 hidden sm:block" />

        <div className="space-y-12">
          {EDUCATION_DATA.map((edu, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={edu.institution}
                className="relative flex flex-col md:flex-row items-start"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Timeline Node Icon (Desktop Center) */}
                <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#202124] border-2 border-[#4285F4] flex items-center justify-center text-[#4285F4] z-10 shadow-xs hidden sm:flex">
                  <GraduationCap size={14} />
                </div>

                {/* Content Card */}
                <div
                  className={`w-full md:w-[46%] ${
                    isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                >
                  <div className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#4285F4]">
                        <Calendar size={12} />
                        <span>{edu.duration}</span>
                      </span>

                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#34A853] bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full">
                        <Award size={12} />
                        <span>{edu.score}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#202124] dark:text-gray-100">
                      {edu.institution}
                    </h3>

                    <p className="text-sm font-medium text-[#4285F4] mt-1">
                      {edu.qualification}
                      {edu.affiliation ? ` (${edu.affiliation})` : ''}
                    </p>

                    <p className="text-sm text-[#5F6368] dark:text-gray-400 mt-3 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
