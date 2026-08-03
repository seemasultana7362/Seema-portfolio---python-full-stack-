import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { EXPERIENCE_DATA } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          EXPERIENCE
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          Learning by building and contributing
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          Hands-on experience through internships, technical communities, and continuous learning.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {EXPERIENCE_DATA.map((exp, idx) => (
          <motion.div
            key={exp.id}
            className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              <div>
                <div className="flex items-center space-x-2 text-[#4285F4] font-semibold text-sm">
                  <Briefcase size={16} />
                  <span>{exp.organization}</span>
                </div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-gray-100 mt-1">
                  {exp.role}
                </h3>
              </div>

              <div className="flex flex-col sm:items-end space-y-1 text-xs text-[#5F6368] dark:text-gray-400">
                <span className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
                  <Calendar size={12} className="text-[#4285F4]" />
                  <span>{exp.duration}</span>
                </span>
                <span className="inline-flex items-center space-x-1 pt-1">
                  <MapPin size={12} />
                  <span>{exp.location}</span>
                </span>
              </div>
            </div>

            {/* Description Points */}
            <div className="space-y-2.5 mb-6">
              {exp.description.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <CheckCircle size={16} className="text-[#34A853] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
