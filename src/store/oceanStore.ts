import { create } from 'zustand';
import type { SectionId } from '../scene/zones';

export type DetailKind = 'about' | 'experience' | 'education' | 'research' | 'achievement' | 'contact';
export interface Detail {
  kind: DetailKind;
  id?: string | number;
}

export type ViewMode = 'ocean' | 'classic';

interface OceanState {
  mode: ViewMode;
  ready: boolean;
  entered: boolean;
  active: SectionId;
  selectedProject: string | null;
  hoveredProject: string | null;
  detail: Detail | null;
  hoverCategory: string | null;
  hoverItem: string | null;
  cursor: string | null;
  sound: boolean;
  quickNav: boolean;
  transmit: number;

  setMode: (m: ViewMode) => void;
  setReady: () => void;
  enter: () => void;
  setActive: (s: SectionId) => void;
  selectProject: (id: string | null) => void;
  hoverProject: (id: string | null) => void;
  openDetail: (d: Detail | null) => void;
  setHoverCategory: (c: string | null) => void;
  setHoverItem: (c: string | null) => void;
  setCursor: (c: string | null) => void;
  toggleSound: () => void;
  setQuickNav: (b: boolean) => void;
  fireTransmission: () => void;
}

export const useOcean = create<OceanState>((set) => ({
  mode: 'ocean',
  ready: false,
  entered: false,
  active: 'hero',
  selectedProject: null,
  hoveredProject: null,
  detail: null,
  hoverCategory: null,
  hoverItem: null,
  cursor: null,
  sound: false,
  quickNav: false,
  transmit: 0,

  setMode: (mode) => set({ mode }),
  setReady: () => set({ ready: true }),
  enter: () => set({ entered: true }),
  setActive: (active) => set({ active }),
  selectProject: (selectedProject) => set({ selectedProject, detail: null }),
  hoverProject: (hoveredProject) => set({ hoveredProject }),
  openDetail: (detail) => set({ detail, selectedProject: null }),
  setHoverCategory: (hoverCategory) => set({ hoverCategory }),
  setHoverItem: (hoverItem) => set({ hoverItem }),
  setCursor: (cursor) => set({ cursor }),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  setQuickNav: (quickNav) => set({ quickNav }),
  fireTransmission: () => set((s) => ({ transmit: s.transmit + 1 })),
}));
