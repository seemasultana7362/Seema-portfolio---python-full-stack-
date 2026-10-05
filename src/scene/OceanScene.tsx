import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { Quality } from '../hooks/useResponsive3D';
import { QualityContext } from './QualityContext';
import { Atmosphere } from './Atmosphere';
import { Sky } from './Sky';
import { Ocean } from './Ocean';
import { Lighting } from './Lighting';
import { Particles } from './Particles';
import { LightRays } from './LightRays';
import { Clouds } from './Clouds';
import { DistantIslands } from './DistantIslands';
import { CameraController } from './CameraController';
import { AdaptiveQuality } from './AdaptiveQuality';
import { AboutIsland } from '../components/environment/AboutIsland';
import { ProjectIslands } from '../components/projects/ProjectIslands';
import { SkillsLab } from '../components/environment/SkillsLab';
import { ExperienceDepths } from '../components/environment/ExperienceDepths';
import { EducationObservatory } from '../components/environment/EducationObservatory';
import { AchievementReef } from '../components/environment/AchievementReef';
import { ContactStation } from '../components/environment/ContactStation';
import { useOcean } from '../store/oceanStore';

/** The whole 3D world. Lazy-loaded so the classic 2D portfolio never pays for three.js. */
export default function OceanScene({ quality }: { quality: Quality }) {
  const setReady = useOcean((s) => s.setReady);
  // keep the canvas from ever swallowing the page: it is purely a fixed backdrop
  useEffect(() => { document.documentElement.dataset.ocean = 'on'; return () => { delete document.documentElement.dataset.ocean; }; }, []);

  return (
    <Canvas
      className="ocean-canvas"
      dpr={[1, Math.min(quality.dprMax, 2)]}
      camera={{ fov: 52, near: 0.3, far: 900, position: [0, 26, 112] }}
      gl={{ antialias: quality.antialias, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // wait two frames so shaders are compiled before the loader lifts
        let n = 0;
        const tick = () => { if (++n > 2) setReady(); else requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }}
      aria-hidden="true"
    >
      <QualityContext.Provider value={quality}>
        <CameraController />
        <Atmosphere />
        <Sky />
        <Clouds />
        <Lighting />
        <Ocean />
        <DistantIslands />
        <LightRays />
        <Particles />
        <AboutIsland />
        <ProjectIslands />
        <SkillsLab />
        <ExperienceDepths />
        <EducationObservatory />
        <AchievementReef />
        <ContactStation />
        <AdaptiveQuality />
      </QualityContext.Provider>
    </Canvas>
  );
}
