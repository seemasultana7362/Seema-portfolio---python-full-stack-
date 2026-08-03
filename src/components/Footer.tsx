import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: PERSONAL_INFO.github },
    { name: 'LinkedIn', icon: Linkedin, url: PERSONAL_INFO.linkedin },
    { name: 'Email', icon: Mail, url: `mailto:${PERSONAL_INFO.email}` },
    { name: 'Phone', icon: Phone, url: `tel:${PERSONAL_INFO.phone}` },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202124] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-base font-bold text-[#202124] dark:text-gray-100">
            Seema Sultana<span className="text-[#4285F4]">.</span>
          </p>
          <p className="text-xs text-[#5F6368] dark:text-gray-400">
            &copy; {currentYear} Seema Sultana. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
            Designed and developed with attention to detail.
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center space-x-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#4285F4] dark:hover:text-[#4285F4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
