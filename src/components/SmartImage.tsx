import React, { useState, useEffect } from 'react';

interface SmartImageProps {
  baseName: string; // e.g., "profile", "cognitive_compass", "customer_churn", "portfolio"
  alt: string;
  className?: string;
  fallbackSrc?: string;
  defaultSrc?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  baseName,
  alt,
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  defaultSrc,
}) => {
  // Normalize baseName variations (e.g., cognitive-compass vs cognitive_compass)
  const underscoreBase = baseName.replace(/-/g, '_');
  const hyphenBase = baseName.replace(/_/g, '-');

  // Candidate extensions and paths to check in order
  const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG'];
  const generatedCandidates: string[] = [];

  [baseName, underscoreBase, hyphenBase].forEach(name => {
    extensions.forEach(ext => {
      generatedCandidates.push(`/images/${name}${ext}`);
    });
    generatedCandidates.push(`/images/${name}`);
  });

  const candidates = Array.from(
    new Set([defaultSrc, ...generatedCandidates].filter(Boolean))
  ) as string[];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>(candidates[0]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentSrc(candidates[0]);
    setIsError(false);
  }, [baseName, defaultSrc]);

  const handleError = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < candidates.length) {
      setCurrentIndex(nextIndex);
      setCurrentSrc(candidates[nextIndex]);
    } else if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsError(true);
    } else {
      setIsError(true);
    }
  };

  if (isError && !fallbackSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
