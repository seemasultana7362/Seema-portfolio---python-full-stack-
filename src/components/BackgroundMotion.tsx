import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  colorType: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
  alpha: number;
  pulseOffset: number;
  ox: number; // original relative offset
  oy: number;
}

interface BackgroundMotionProps {
  theme: 'light' | 'dark';
}

export const BackgroundMotion: React.FC<BackgroundMotionProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let scrollY = window.scrollY;
    let isTabActive = !document.hidden;

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    // Calculate initial count based on screen width
    const getParticleCount = (w: number) => {
      if (w < 640) return 32;
      if (w < 1024) return 50;
      return 75;
    };

    let particleCount = getParticleCount(width);
    let particles: Particle[] = [];

    const initParticles = () => {
      particleCount = getParticleCount(width);
      particles = [];

      for (let i = 0; i < particleCount; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;

        // Color distribution: ~60% gray, ~22% Google blue, ~18% Google green/yellow/red accents
        const randColor = Math.random();
        let colorType: Particle['colorType'] = 'gray';
        if (randColor > 0.82) {
          const accentRand = Math.random();
          if (accentRand < 0.35) colorType = 'green';
          else if (accentRand < 0.70) colorType = 'yellow';
          else colorType = 'red';
        } else if (randColor > 0.60) {
          colorType = 'blue';
        }

        const isColoredNode = colorType !== 'gray';

        // Very slow organic movement speed (0.15 - 0.35 px/frame)
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.22;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
          x: rx,
          y: ry,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: isColoredNode ? 2.2 + Math.random() * 1.8 : 1.4 + Math.random() * 1.2,
          colorType,
          alpha: isColoredNode ? 0.45 + Math.random() * 0.4 : 0.15 + Math.random() * 0.25,
          pulseOffset: Math.random() * Math.PI * 2,
          ox: rx,
          oy: ry,
        });
      }
    };

    initParticles();

    // Resize handling
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    // Scroll handling for hero density & scroll factor
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    // Mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Color definitions based on theme
    const getColor = (p: Particle, isDark: boolean, alphaMultiplier: number) => {
      const a = Math.min(0.95, p.alpha * alphaMultiplier).toFixed(3);
      if (p.colorType === 'blue') return `rgba(66, 133, 244, ${Math.max(0.4, parseFloat(a) * 1.2)})`;
      if (p.colorType === 'green') return `rgba(52, 168, 83, ${Math.max(0.4, parseFloat(a) * 1.2)})`;
      if (p.colorType === 'yellow') return `rgba(251, 188, 5, ${Math.max(0.45, parseFloat(a) * 1.2)})`;
      if (p.colorType === 'red') return `rgba(234, 67, 53, ${Math.max(0.4, parseFloat(a) * 1.2)})`;

      return isDark ? `rgba(220, 225, 235, ${a})` : `rgba(90, 100, 115, ${a})`;
    };

    const getLineColor = (p1: Particle, p2: Particle, isDark: boolean, rawOpacity: number) => {
      // If either node has a color accent, render a vibrant colored line
      const accentNode = p1.colorType !== 'gray' ? p1 : (p2.colorType !== 'gray' ? p2 : null);

      if (accentNode) {
        // Boost opacity for colored lines so they are clearly visible
        const a = Math.min(0.55, Math.max(0.18, rawOpacity * 4.0)).toFixed(3);
        if (accentNode.colorType === 'blue') return `rgba(66, 133, 244, ${a})`;
        if (accentNode.colorType === 'green') return `rgba(52, 168, 83, ${a})`;
        if (accentNode.colorType === 'yellow') return `rgba(251, 188, 5, ${a})`;
        if (accentNode.colorType === 'red') return `rgba(234, 67, 53, ${a})`;
      }

      return isDark
        ? `rgba(255, 255, 255, ${Math.min(0.2, rawOpacity * 1.5).toFixed(3)})`
        : `rgba(60, 64, 67, ${Math.min(0.2, rawOpacity * 1.5).toFixed(3)})`;
    };

    let time = 0;

    // Render loop
    const render = () => {
      if (!isTabActive) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Hero scroll dampening factor (motion slows slightly and line distance reduces as user scrolls past hero)
      const maxScrollHero = Math.max(1, height);
      const scrollRatio = Math.min(1, scrollY / maxScrollHero);
      const motionDampener = 1.0 - scrollRatio * 0.35; // 30% slower on scroll
      const lineDistanceMax = 130 - scrollRatio * 30; // 130px near top, 100px lower down

      // Global alpha modifier (Hero section slightly higher density/opacity, fading down)
      const sectionAlphaMult = 1.0 - scrollRatio * 0.3;

      // Render static frame if reduced motion preferred
      if (prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = getColor(p, isDark, 0.25);
          ctx.fill();
        }
        return;
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic Perlin-like slight sine-wave movement variation
        const sineDx = Math.sin(time + p.pulseOffset) * 0.08;
        const sineDy = Math.cos(time * 0.8 + p.pulseOffset) * 0.08;

        p.vx = p.baseVx * motionDampener + sineDx;
        p.vy = p.baseVy * motionDampener + sineDy;

        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrapping smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Gentle cursor interaction (max displacement 20-30px, smooth repulse)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 110;
          if (distSq < maxDist * maxDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 18; // max ~18px displacement
            p.x += (dx / dist) * force * 0.15;
            p.y += (dy / dist) * force * 0.15;
          }
        }

        // Pulse alpha slightly
        const pulse = Math.sin(time * 1.2 + p.pulseOffset) * 0.15;
        const finalAlphaMult = Math.max(0.1, (p.alpha + pulse) * sectionAlphaMult);

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = getColor(p, isDark, finalAlphaMult);
        ctx.fill();

        // Connect nearby particles with faint lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < lineDistanceMax * lineDistanceMax) {
            const dist = Math.sqrt(distSq);
            // Smooth line fading
            const opacity = (1 - dist / lineDistanceMax) * 0.12 * sectionAlphaMult;

            const isColored = p.colorType !== 'gray' || p2.colorType !== 'gray';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = getLineColor(p, p2, isDark, opacity);
            ctx.lineWidth = isColored ? 1.4 : 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full opacity-90" />
      {/* Subtle depth gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 dark:to-[#202124]/40 pointer-events-none" />
    </div>
  );
};
