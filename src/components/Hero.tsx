import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SmartImage } from './SmartImage';

export const Hero: React.FC = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: PERSONAL_INFO.github },
    { name: 'LinkedIn', icon: Linkedin, url: PERSONAL_INFO.linkedin },
    { name: 'Email', icon: Mail, url: `mailto:${PERSONAL_INFO.email}` },
    { name: 'Phone', icon: Phone, url: `tel:${PERSONAL_INFO.phone}` },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column (55%) */}
        <motion.div
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants}>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#5F6368] dark:text-gray-400">
              {PERSONAL_INFO.greeting}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-[#202124] dark:text-gray-100"
          >
            {PERSONAL_INFO.name}
          </motion.h1>

          {/* Professional Title */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl font-medium text-[#5F6368] dark:text-gray-300 leading-snug"
          >
            {PERSONAL_INFO.title}
          </motion.p>

          {/* Introduction */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            {PERSONAL_INFO.intro}
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={scrollToProjects}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-medium text-white bg-[#4285F4] hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              View Projects
            </button>

            <a
              href="/seema-sultana-resume.pdf"
              download
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-medium text-[#202124] dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:border-[#4285F4] dark:hover:border-[#4285F4] hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer"
            >
              Download Resume
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start space-x-3 pt-4"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <div key={social.name} className="relative group">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-[#4285F4] dark:hover:text-[#4285F4] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 flex items-center justify-center"
                  >
                    <Icon size={18} />
                  </a>
                  {/* Tooltip */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2.5 py-1 rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium whitespace-nowrap shadow-xs">
                    {social.name}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Column (45%): Professional Portrait Placeholder */}
        <motion.div
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Radial Breathing Glow behind portrait */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -m-6 sm:-m-8 rounded-full bg-gradient-to-tr from-[#4285F4]/15 via-blue-200/10 to-indigo-300/10 dark:from-[#4285F4]/20 dark:via-blue-900/10 dark:to-indigo-900/10 blur-2xl pointer-events-none"
            animate={{
              opacity: [0.25, 0.65, 0.25],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-gray-50/90 dark:bg-[#202124]/90 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center shadow-sm hover:border-[#4285F4]/40 dark:hover:border-[#4285F4]/40 hover:shadow-lg transition-all duration-300 group">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 shadow-inner">
              <SmartImage
                baseName="profile"
                defaultSrc={PERSONAL_INFO.profileImage}
                alt="Seema Sultana - Computer Science Engineer"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-medium text-white tracking-wide">
                  Seema Sultana • B.E. Computer Science
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Seema Sultana
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Roles</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="hidden md:flex justify-center pt-8 cursor-pointer"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="flex flex-col items-center space-y-2 text-[#5F6368] dark:text-gray-400 hover:text-[#4285F4] transition-colors">
          <span className="text-[11px] font-medium tracking-widest uppercase">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 border-2 border-gray-300 dark:border-gray-700 rounded-full flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-[#4285F4] rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
