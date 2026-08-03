import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, MapPin, Globe2 } from 'lucide-react';
import { LEADERSHIP_DATA } from '../data/portfolioData';

export const Leadership: React.FC = () => {
  return (
    <section id="leadership" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          LEADERSHIP
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2">
          Building communities through technology
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-3">
          Contributing to student communities, technical events, and collaborative learning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {LEADERSHIP_DATA.map((item, idx) => (
          <motion.div
            key={item.organization}
            className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-7 shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#4285F4]">
                  <Users size={12} />
                  <span>{item.role}</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-xs text-[#5F6368] dark:text-gray-400">
                  <Calendar size={12} />
                  <span>{item.duration}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#202124] dark:text-gray-100 mb-1">
                {item.organization}
              </h3>

              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <MapPin size={12} />
                <span>{item.location}</span>
              </div>

              <p className="text-sm text-[#5F6368] dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6 flex items-center justify-between text-xs font-semibold text-[#4285F4]">
              <span className="inline-flex items-center space-x-1">
                <Globe2 size={12} />
                <span>Community Leadership</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
