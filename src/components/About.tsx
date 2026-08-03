import React from 'react';
import { motion } from 'motion/react';
import { Target, Cpu, Lightbulb, Users, GraduationCap, Building2, Compass, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  const quickFacts = [
    {
      title: 'Education',
      value: 'B.E. Computer Science & Engineering',
      icon: GraduationCap,
    },
    {
      title: 'Current Institution',
      value: 'HKBK College of Engineering (VTU)',
      icon: Building2,
    },
    {
      title: 'Primary Interests',
      value: 'Full Stack • AI/ML • Cloud',
      icon: Compass,
    },
    {
      title: 'Location',
      value: 'Bengaluru, India',
      icon: MapPin,
    },
  ];

  const principles = [
    {
      text: 'Build solutions with purpose.',
      icon: Target,
    },
    {
      text: 'Keep learning through practice.',
      icon: Cpu,
    },
    {
      text: 'Simplify complex problems.',
      icon: Lightbulb,
    },
    {
      text: 'Contribute to technical communities.',
      icon: Users,
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (60%) */}
        <motion.div
          className="lg:col-span-7 space-y-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
              ABOUT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-gray-100 mt-2 leading-tight">
              Building technology that is practical, intelligent, and impactful.
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#5F6368] dark:text-gray-300 leading-relaxed">
            <p>
              I am a Computer Science Engineering student at HKBK College of Engineering (VTU) with a strong foundation in computer science principles, software engineering methodologies, artificial intelligence, and modern web development.
            </p>
            <p>
              My technical journey focuses on building robust systems from frontend user interfaces to backend REST APIs and intelligent machine learning models. Through hands-on internships, hackathons, open-source community contributions, and ongoing academic research, I continuously turn theoretical concepts into production-grade solutions.
            </p>
          </div>

          {/* Quick Facts Grid (2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.title}
                  className="bg-gray-50/80 dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#4285F4]">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-gray-400">
                      {fact.title}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#202124] dark:text-gray-100">
                    {fact.value}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column (40%): Engineering Philosophy Card */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-[#202124] dark:text-gray-100 mb-6 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span>Engineering Philosophy</span>
            </h3>

            <div className="space-y-6">
              {principles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-4 group">
                    <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:text-[#4285F4] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
                      <Icon size={20} />
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#202124] dark:group-hover:text-white transition-colors">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
