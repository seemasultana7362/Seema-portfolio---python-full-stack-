import { createContext, useContext } from 'react';
import type { Quality } from '../hooks/useResponsive3D';

export const QualityContext = createContext<Quality | null>(null);
export const useQuality = (): Quality => {
  const q = useContext(QualityContext);
  if (!q) throw new Error('QualityContext missing');
  return q;
};
