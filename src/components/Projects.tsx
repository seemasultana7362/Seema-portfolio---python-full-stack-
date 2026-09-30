import React from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, CheckCircle2, LayoutGrid, Monitor, Sparkles } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { SmartImage } from './SmartImage';

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#4285F4]">
          PROJECTS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-gray-100 mt-2">
          Featured Engineering & AI Projects
        </h2>
        <p className="text-base text-[#5F6368] dark:text-gray-400 mt-4 leading-relaxed">
          Highlighting full-stack web applications, machine learning models, and system innovations.
        </p>
      </motion.div>

      {/* Projects Showcase */}
      <div className="space-y-24">
        {PROJECTS_DATA.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
            >
              {/* Browser Window Mockup Container */}
              <div
                className={`lg:col-span-6 ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Browser Top Navigation Bar */}
                  <div className="px-4 py-3 bg-gray-200/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700/80 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {project.id}.demo
                    </div>
                    <Monitor size={14} className="text-gray-400" />
                  </div>

                  {/* Visual Container / Image Preview */}
                  {project.isLiveExperience ? (
                    <div className="relative aspect-16/10 bg-gradient-to-br from-blue-900/10 via-slate-900/30 to-indigo-900/20 dark:from-blue-950/40 dark:via-slate-900/60 dark:to-indigo-950/40 border border-blue-500/20 p-6 flex flex-col items-center justify-center text-center overflow-hidden group">
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex flex-col items-center space-y-3">
                        {/* Live Badge */}
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold tracking-wide">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span>YOU ARE EXPERIENCING THIS NOW</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 text-[#4285F4] shadow-md border border-gray-200/50 dark:border-gray-700/50 group-hover:scale-110 transition-transform duration-300">
                          <Sparkles size={28} className="animate-pulse" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Live Interactive Application
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-xs leading-relaxed">
                            You are currently exploring this exact project live! Every feature and section on screen is this application.
                          </p>
                        </div>

                        <div className="flex items-center space-x-1.5 pt-1">
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                            100% Active Session
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/50">
                            Real-time System
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : project.image ? (
                    <div className="relative aspect-16/10 bg-gradient-to-b from-transparent to-gray-200/30 dark:to-gray-900/40 overflow-hidden flex items-center justify-center">
                      <SmartImage
                        baseName={project.id}
                        defaultSrc={project.image}
                        alt={project.title}
                        fallbackSrc=""
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* SVG / Styled Fallback when image is missing or loading */}
                      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center space-y-3 pointer-events-none -z-10">
                        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 text-[#4285F4] shadow-xs group-hover:scale-105 transition-transform duration-300">
                          <LayoutGrid size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {project.imageLabel}
                          </p>
                          <p className="text-xs text-[#5F6368] dark:text-gray-400 mt-1 max-w-xs">
                            {project.imageNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-16/10 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 p-8 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 text-[#4285F4] shadow-xs">
                        <LayoutGrid size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {project.imageLabel}
                        </p>
                        <p className="text-xs text-[#5F6368] dark:text-gray-400 mt-1 max-w-xs">
                          {project.imageNote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Content (Alternate Sides on Desktop) */}
              <div
                className={`lg:col-span-6 space-y-5 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#4285F4] mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-gray-100">
                    {project.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                    {project.summary}
                  </p>
                </div>

                {/* Problem & Solution */}
                <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-gray-400 leading-relaxed border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                  <p>
                    <strong className="text-gray-900 dark:text-gray-200">Problem: </strong>
                    {project.problem}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-gray-200">Solution: </strong>
                    {project.solution}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 hover:border-[#4285F4] dark:hover:border-[#4285F4] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {project.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 size={14} className="text-[#34A853] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  {project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#34A853] hover:bg-green-600 active:bg-green-700 transition-all shadow-2xs hover:shadow-xs"
                    >
                      <ExternalLink size={14} />
                      <span>View Live Demo</span>
                    </a>
                  )}
                  {project.github && project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#4285F4] hover:bg-blue-600 active:bg-blue-700 transition-all shadow-2xs hover:shadow-xs"
                    >
                      <Github size={14} />
                      <span>View GitHub Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* More Projects Coming Soon Footer Note */}
      <motion.div
        className="text-center mt-20 pt-12 border-t border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold text-[#202124] dark:text-gray-100">
          More projects coming soon.
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-gray-400 mt-2 max-w-xl mx-auto">
          I'm continuously building new projects in software engineering, AI, machine learning, and cloud technologies.
        </p>
      </motion.div>
    </section>
  );
};
