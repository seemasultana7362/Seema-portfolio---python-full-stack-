import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to Top"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white dark:bg-[#202124] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:border-[#4285F4] dark:hover:border-[#4285F4] hover:text-[#4285F4] dark:hover:text-[#4285F4] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <ArrowUp size={18} />
    </button>
  );
};
