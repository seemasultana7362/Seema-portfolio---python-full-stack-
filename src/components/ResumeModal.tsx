import React from 'react';
import { X, Printer, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_DATA, EXPERIENCE_DATA, SKILLS_DATA, PROJECTS_DATA, ACHIEVEMENTS_DATA } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#202124] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#202124] dark:text-gray-100">
              Resume Preview — {PERSONAL_INFO.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Resume */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-gray-900 dark:text-gray-100 font-sans">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-[#202124] dark:text-gray-100">
              {PERSONAL_INFO.name}
            </h1>
            <p className="text-sm font-medium text-[#4285F4] mt-1">
              {PERSONAL_INFO.title}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Mail size={12} className="text-[#4285F4]" />
                <span>{PERSONAL_INFO.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone size={12} className="text-[#4285F4]" />
                <span>{PERSONAL_INFO.phone}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin size={12} className="text-[#4285F4]" />
                <span>{PERSONAL_INFO.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Github size={12} className="text-[#4285F4]" />
                <span>github.com/seemasultana7362</span>
              </span>
              <span className="flex items-center space-x-1">
                <Linkedin size={12} className="text-[#4285F4]" />
                <span>linkedin.com/in/seemasultana385</span>
              </span>
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4285F4] border-b border-gray-100 dark:border-gray-800 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {EDUCATION_DATA.map((edu) => (
                <div key={edu.institution} className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{edu.institution}</p>
                    <p className="text-gray-600 dark:text-gray-400">{edu.qualification}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#4285F4]">{edu.score}</span>
                    <p className="text-gray-500">{edu.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4285F4] border-b border-gray-100 dark:border-gray-800 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {EXPERIENCE_DATA.map((exp) => (
                <div key={exp.id} className="text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{exp.role} — {exp.organization}</span>
                    <span className="text-gray-500">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                    {exp.description.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4285F4] border-b border-gray-100 dark:border-gray-800 pb-1">
              Key Projects
            </h2>
            <div className="space-y-4">
              {PROJECTS_DATA.map((proj) => (
                <div key={proj.id} className="text-xs space-y-1">
                  <div className="font-bold flex justify-between">
                    <span>{proj.title}</span>
                    <span className="text-gray-500">{proj.category}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{proj.summary}</p>
                  <p className="text-gray-500 italic">Tech: {proj.technologies.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4285F4] border-b border-gray-100 dark:border-gray-800 pb-1">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SKILLS_DATA.map((sk) => (
                <div key={sk.category}>
                  <strong className="text-gray-800 dark:text-gray-200">{sk.category}: </strong>
                  <span className="text-gray-600 dark:text-gray-400">{sk.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4285F4] border-b border-gray-100 dark:border-gray-800 pb-1">
              Achievements
            </h2>
            <div className="space-y-2 text-xs">
              {ACHIEVEMENTS_DATA.map((ach) => (
                <div key={ach.title} className="flex justify-between">
                  <span><strong>{ach.badge}:</strong> {ach.title}</span>
                  <span className="text-gray-500">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
