import { useState, useEffect, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme';

// ─────────────────────────────────────────────
//  LOCAL SERVICE IMAGES
//  (Place these files in: src/images/)
// ─────────────────────────────────────────────
import etpImage from '../../../src/images/etp.jpg';
import wasteImage from '../../../src/images/waste.jpg';
import ifmsImage from '../../../src/images/ifms.jpg';
import oilImage from '../../../src/images/oil.jpg';
import chemImage from '../../../src/images/chem.jpg';
import waterImage from '../../../src/images/water.jpg';

const HERO_COLORS = {
  cvs: '#0776D1',
  msl: '#0776D1',
};

const latoStyle: CSSProperties = {
  fontFamily: '"Lato", sans-serif',
};


const SERVICES = [
  {
    id: 'etp',
    label: 'Effluent Treatment',
    short: 'ETP',
    icon: 'droplet',
    color: '#0ea5e9',
    image: etpImage,
    description:
      'We provide complete effluent treatment solutions for industrial wastewater and produced water, helping industries meet environmental standards safely and efficiently.',
  },
  {
    id: 'waste',
    label: 'Waste Management',
    short: 'WM',
    icon: 'trash',
    color: '#22c55e',
    image: wasteImage,
    description:
      'Our team manages the collection, transportation, and safe disposal of hazardous and non-hazardous waste while ensuring compliance with environmental regulations.',
  },
  {
    id: 'ifms',
    label: 'Integrated Facility Mgmt',
    short: 'IFMS',
    icon: 'building',
    color: '#8b5cf6',
    image: ifmsImage,
    description:
      'We offer complete facility management services including housekeeping, security, technical support, and skilled manpower to keep your operations running smoothly.',
  },
  {
    id: 'oil',
    label: 'Oil & Gas Services',
    short: 'O&G',
    icon: 'fuel',
    color: '#f59e0b',
    image: oilImage,
    description:
      'We support oil and gas operations with reliable manpower, equipment, logistics, and on-site services to ensure safe and efficient project execution.',
  },
  {
    id: 'chem',
    label: 'Chemical Supply',
    short: 'CHEM',
    icon: 'flask',
    color: '#ec4899',
    image: chemImage,
    description:
      'We supply high-quality industrial chemicals and specialty products that support water treatment, oil and gas operations, and various industrial processes.',
  },
  {
    id: 'water',
    label: 'Water Treatment',
    short: 'H₂O',
    icon: 'wave',
    color: '#06b6d4',
    image: waterImage,
    description:
      'We provide complete water treatment solutions for industrial and commercial needs, delivering clean and safe water for process, reuse, and daily operations.',
  },
];

type IconType = 'droplet' | 'trash' | 'building' | 'fuel' | 'flask' | 'wave' | 'gear' | 'cog';

const ICON_TYPES: IconType[] = ['droplet', 'trash', 'building', 'fuel', 'flask', 'wave', 'gear', 'cog'];
const ICON_COLORS = ['#0776D1', '#0ea5e9', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

/**
 * Draws a service or industrial icon on the canvas at position (x, y)
 * Base viewBox is 24×24, scaled by (size / 24).
 */
function drawServiceIcon(
  ctx: CanvasRenderingContext2D,
  type: IconType,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  const scale = size / 24;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();

  switch (type) {
    case 'droplet':
      ctx.moveTo(12, 2.69);
      ctx.lineTo(17.66, 8.35);
      ctx.arc(12, 14, 8, -Math.PI / 4, Math.PI + Math.PI / 4, false);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'trash':
      ctx.moveTo(3, 6); ctx.lineTo(21, 6);
      ctx.moveTo(19, 6);
      ctx.lineTo(18, 20);
      ctx.quadraticCurveTo(18, 22, 16, 22);
      ctx.lineTo(8, 22);
      ctx.quadraticCurveTo(6, 22, 6, 20);
      ctx.lineTo(5, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 11); ctx.lineTo(10, 17);
      ctx.moveTo(14, 11); ctx.lineTo(14, 17);
      ctx.stroke();
      break;

    case 'building':
      ctx.moveTo(6, 2);
      ctx.lineTo(18, 2);
      ctx.quadraticCurveTo(20, 2, 20, 4);
      ctx.lineTo(20, 20);
      ctx.quadraticCurveTo(20, 22, 18, 22);
      ctx.lineTo(6, 22);
      ctx.quadraticCurveTo(4, 22, 4, 20);
      ctx.lineTo(4, 4);
      ctx.quadraticCurveTo(4, 2, 6, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(9, 22);
      ctx.lineTo(9, 18);
      ctx.lineTo(15, 18);
      ctx.lineTo(15, 22);
      ctx.stroke();
      const windows = [
        [8, 6], [12, 6], [16, 6],
        [8, 10], [12, 10], [16, 10],
        [8, 14], [12, 14], [16, 14],
      ];
      windows.forEach(([wx, wy]) => {
        ctx.beginPath();
        ctx.arc(wx, wy, 0.4, 0, Math.PI * 2);
        ctx.stroke();
      });
      break;

    case 'fuel':
      ctx.moveTo(3, 22); ctx.lineTo(15, 22);
      ctx.moveTo(4, 9); ctx.lineTo(14, 9);
      ctx.moveTo(14, 22);
      ctx.lineTo(14, 4);
      ctx.quadraticCurveTo(14, 2, 12, 2);
      ctx.lineTo(6, 2);
      ctx.quadraticCurveTo(4, 2, 4, 4);
      ctx.lineTo(4, 22);
      ctx.moveTo(14, 13);
      ctx.lineTo(16, 13);
      ctx.quadraticCurveTo(18, 13, 18, 15);
      ctx.lineTo(18, 17);
      ctx.quadraticCurveTo(18, 19, 20, 19);
      ctx.quadraticCurveTo(22, 19, 22, 17);
      ctx.lineTo(22, 9.83);
      ctx.lineTo(18, 5);
      ctx.stroke();
      break;

    case 'flask':
      ctx.moveTo(9, 3); ctx.lineTo(15, 3);
      ctx.moveTo(10, 3);
      ctx.lineTo(10, 9);
      ctx.lineTo(4.5, 19);
      ctx.quadraticCurveTo(4, 22, 6.25, 22);
      ctx.lineTo(17.75, 22);
      ctx.quadraticCurveTo(20, 22, 19.5, 19);
      ctx.lineTo(14, 9);
      ctx.lineTo(14, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(7, 15); ctx.lineTo(17, 15);
      ctx.stroke();
      break;

    case 'wave':
      [7, 12, 17].forEach((yPos) => {
        ctx.beginPath();
        ctx.moveTo(2, yPos);
        ctx.quadraticCurveTo(5, yPos - 3, 8, yPos);
        ctx.quadraticCurveTo(11, yPos + 3, 14, yPos);
        ctx.quadraticCurveTo(17, yPos - 3, 20, yPos);
        ctx.quadraticCurveTo(22, yPos + 1.5, 22, yPos);
        ctx.stroke();
      });
      break;

    case 'gear': {
      // Industrial gear with 8 teeth
      const teeth = 8;
      const outerR = 10;
      const innerR = 7.5;
      const toothH = 2;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;
        const toothWidth = (nextAngle - angle) * 0.35;

        const cx = 12, cy = 12;
        ctx.lineTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(midAngle - toothWidth) * (outerR + toothH), cy + Math.sin(midAngle - toothWidth) * (outerR + toothH));
        ctx.lineTo(cx + Math.cos(midAngle + toothWidth) * (outerR + toothH), cy + Math.sin(midAngle + toothWidth) * (outerR + toothH));
        ctx.lineTo(cx + Math.cos(nextAngle) * innerR, cy + Math.sin(nextAngle) * innerR);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 12, 3.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 12, 1, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'cog': {
      // More detailed cog with 10 teeth and mechanical spokes
      const teeth = 10;
      const outerR = 9;
      const innerR = 7;
      const toothH = 2.5;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;
        const toothWidth = (nextAngle - angle) * 0.25;

        const cx = 12, cy = 12;
        ctx.lineTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(midAngle - toothWidth) * (outerR + toothH), cy + Math.sin(midAngle - toothWidth) * (outerR + toothH));
        ctx.lineTo(cx + Math.cos(midAngle + toothWidth) * (outerR + toothH), cy + Math.sin(midAngle + toothWidth) * (outerR + toothH));
        ctx.lineTo(cx + Math.cos(nextAngle) * innerR, cy + Math.sin(nextAngle) * innerR);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 12, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, 12); ctx.lineTo(16, 12);
      ctx.moveTo(12, 8); ctx.lineTo(12, 16);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

// ─────────────────────────────────────────────
//  ANIMATED BACKGROUND CANVAS
// ─────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface FloatingIcon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: IconType;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface EnergyOrb {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  speed: number;
  trail: { x: number; y: number }[];
}

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const iconsRef = useRef<FloatingIcon[]>([]);
  const orbsRef = useRef<EnergyOrb[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const initEntities = useCallback((w: number, h: number) => {
    // Small ambient dot particles
    const particleCount = Math.floor((w * h) / 15000);
    particlesRef.current = Array.from({ length: Math.min(particleCount, 100) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '#0776D1' : Math.random() > 0.5 ? '#0ea5e9' : '#60a5fa',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Floating service icons + industrial gears — SLOW & AMBIENT
    iconsRef.current = Array.from({ length: 18 }, () => {
      // 30% chance to be a gear/cog for industrial machinery vibe
      const isGear = Math.random() < 0.3;
      const type: IconType = isGear
        ? (Math.random() > 0.5 ? 'gear' : 'cog')
        : ICON_TYPES[Math.floor(Math.random() * 6)]; // pick from service icons only (first 6)

      // Gears use steel-gray, service icons use brand colors
      const color = isGear
        ? '#94a3b8'
        : ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)];

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        // Much slower drift
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        // Gears slightly smaller, service icons medium
        size: isGear
          ? Math.random() * 20 + 35    // 35–55px for gears
          : Math.random() * 25 + 30,   // 30–55px for service icons
        rotation: (Math.random() - 0.5) * 0.4,
        // Gears rotate visibly like real machinery; service icons barely rotate
        rotationSpeed: isGear
          ? (Math.random() - 0.5) * 0.008
          : (Math.random() - 0.5) * 0.001,
        type,
        // Gears slightly more visible for industrial presence
        opacity: isGear
          ? Math.random() * 0.08 + 0.06
          : Math.random() * 0.07 + 0.04,
        color,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.002,
      };
    });

    // Energy orbs (moving glow trails)
    orbsRef.current = Array.from({ length: 3 }, () => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return {
        x,
        y,
        targetX: Math.random() * w,
        targetY: Math.random() * h,
        radius: 3 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#0776D1' : '#38bdf8',
        speed: 0.005 + Math.random() * 0.008,
        trail: Array.from({ length: 20 }, () => ({ x, y })),
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { w, h };
      if (iconsRef.current.length === 0) initEntities(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const { w, h } = dimensionsRef.current;
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.8);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.4, '#070e1a');
      bgGrad.addColorStop(1, '#040810');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ambient glow
      const glowX = w * 0.5 + Math.sin(t * 0.005) * 40;
      const glowY = h * 0.38 + Math.cos(t * 0.007) * 20;
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, w * 0.45);
      glow.addColorStop(0, 'rgba(7, 118, 209, 0.08)');
      glow.addColorStop(0.5, 'rgba(7, 118, 209, 0.03)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Faint grid
      ctx.strokeStyle = 'rgba(7, 118, 209, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // ── Floating Service Icons & Gears ──
      iconsRef.current.forEach((icon) => {
        icon.x += icon.vx;
        icon.y += icon.vy;
        icon.rotation += icon.rotationSpeed;
        icon.pulse += icon.pulseSpeed;

        // Cursor interaction — very gentle repulsion
        const dx = mouseRef.current.x - icon.x;
        const dy = mouseRef.current.y - icon.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180 * 0.04;
          icon.vx -= (dx / dist) * force;
          icon.vy -= (dy / dist) * force;
        }
        // Stronger damping — quickly returns to slow drift
        icon.vx *= 0.985;
        icon.vy *= 0.985;

        // Wrap around edges
        if (icon.x < -icon.size * 2) icon.x = w + icon.size;
        if (icon.x > w + icon.size * 2) icon.x = -icon.size;
        if (icon.y < -icon.size * 2) icon.y = h + icon.size;
        if (icon.y > h + icon.size * 2) icon.y = -icon.size;

        // Subtle opacity pulse for gentle breathing
        const pulseOpacity = icon.opacity + Math.sin(icon.pulse) * 0.02;

        // Draw the icon/gear
        ctx.strokeStyle = icon.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, pulseOpacity);
        drawServiceIcon(ctx, icon.type, icon.x, icon.y, icon.size, icon.rotation);
        ctx.globalAlpha = 1;
      });

      // ── Particles ──
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          p.vx += (dx / dist) * 0.01;
          p.vy += (dy / dist) * 0.01;
        }
        p.vx *= 0.998;
        p.vy *= 0.998;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
        const r = p.radius + Math.sin(p.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, pulseOpacity));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── Connection lines between particles ──
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = '#0776D1';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // ── Energy orbs ──
      orbsRef.current.forEach((orb) => {
        const dx = orb.targetX - orb.x;
        const dy = orb.targetY - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          orb.targetX = Math.random() * w;
          orb.targetY = Math.random() * h;
        }
        orb.x += (dx / dist) * orb.speed * 60;
        orb.y += (dy / dist) * orb.speed * 60;
        orb.trail.pop();
        orb.trail.unshift({ x: orb.x, y: orb.y });

        ctx.beginPath();
        orb.trail.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.15;
        ctx.stroke();

        const orbGlow = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 3);
        orbGlow.addColorStop(0, orb.color);
        orbGlow.addColorStop(0.5, orb.color + '40');
        orbGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGlow;
        ctx.globalAlpha = 0.3 + Math.sin(t * 0.03) * 0.1;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = orb.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── Scanning line ──
      const scanY = (t * 0.5) % (h + 100) - 50;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(7, 118, 209, 0.03)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, w, 80);

      // ── Vignette ──
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initEntities]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
}

// ─────────────────────────────────────────────
//  SERVICE ICON (SVG — for cards & modal)
// ─────────────────────────────────────────────
function ServiceIcon({ type, color, size = 22 }: { type: string; color: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (type) {
    case 'droplet':
      return <svg {...common}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
    case 'trash':
      return <svg {...common}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>;
    case 'building':
      return <svg {...common}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>;
    case 'fuel':
      return <svg {...common}><line x1="3" y1="22" x2="15" y2="22" /><line x1="4" y1="9" x2="14" y2="9" /><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" /><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" /></svg>;
    case 'flask':
      return <svg {...common}><path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.75 3h11.5A2 2 0 0 0 19.5 19L14 9V3" /><path d="M7 15h10" /></svg>;
    case 'wave':
      return <svg {...common}><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg>;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────
//  SERVICE PREVIEW MODAL (Perfectly Centered via Flexbox)
// ─────────────────────────────────────────────
function ServiceModal({
  service,
  isOpen,
  onClose,
}: {
  service: typeof SERVICES[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleExplore = () => {
    onClose();
    setTimeout(() => {
      navigate('/services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(4, 8, 16, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #0a1628 0%, #040810 100%)',
              border: `1px solid ${service.color}50`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6),
                          0 0 40px ${service.color}25`,
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${service.color}60`,
                color: service.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                lineHeight: 1,
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0) scale(1)')}
              aria-label="Close modal"
            >
              ×
            </button>

            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
              <img
                src={service.image}
                alt={service.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 40%, #0a1628 100%)`,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${service.color}40, ${service.color}20)`,
                    border: `1px solid ${service.color}80`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${service.color}50`,
                  }}
                >
                  <ServiceIcon type={service.icon} color={service.color} size={22} />
                </div>
                <span
                  style={{
                    ...latoStyle,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: service.color,
                    textTransform: 'uppercase',
                    textShadow: `0 0 8px ${service.color}80`,
                  }}
                >
                  {service.short}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px 24px 24px' }}>
              <h3
                style={{
                  ...latoStyle,
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '10px',
                  letterSpacing: '0.3px',
                }}
              >
                {service.label}
              </h3>
              <p
                style={{
                  ...latoStyle,
                  fontSize: '0.88rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                }}
              >
                {service.description}
              </p>

              <button
                onClick={handleExplore}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: `0 8px 24px ${service.color}50, 0 0 20px ${service.color}30`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  ...latoStyle,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${service.color}70, 0 0 30px ${service.color}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${service.color}50, 0 0 20px ${service.color}30`;
                }}
              >
                <span>Explore More Services</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
//  FLOATING SERVICE PROPS (Desktop)
// ─────────────────────────────────────────────
type Position = {
  style: CSSProperties;
  delay: number;
  float: number[];
};

function ServiceProps({ onCardClick }: { onCardClick: (service: typeof SERVICES[0]) => void }) {
  const positions: Position[] = [
    { style: { top: '15%', left: '6%' }, delay: 0.2, float: [0, -12, 0] },
    { style: { top: '22%', right: '7%' }, delay: 0.4, float: [0, -14, 0] },
    { style: { top: '62%', left: '5%' }, delay: 0.6, float: [0, -10, 0] },
    { style: { top: '68%', right: '6%' }, delay: 0.8, float: [0, -13, 0] },
    { style: { bottom: '18%', left: '18%' }, delay: 1.0, float: [0, -11, 0] },
    { style: { bottom: '22%', right: '18%' }, delay: 1.2, float: [0, -12, 0] },
  ];

  return (
    <>
      {SERVICES.map((service, i) => {
        const pos = positions[i];
        return (
          <motion.div
            key={service.id}
            style={{
              position: 'absolute',
              zIndex: 8,
              ...pos.style,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: pos.float,
            }}
            transition={{
              opacity: { delay: pos.delay + 1.8, duration: 0.6 },
              scale: { delay: pos.delay + 1.8, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
              y: {
                delay: pos.delay + 2.4,
                duration: 4 + i * 0.3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
          >
            <ServiceCard service={service} index={i} onClick={() => onCardClick(service)} />
          </motion.div>
        );
      })}
    </>
  );
}

function ServiceCard({
  service,
  index,
  onClick,
}: {
  service: typeof SERVICES[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px 10px 12px',
        borderRadius: '14px',
        background: 'rgba(10, 22, 40, 0.55)',
        backdropFilter: 'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
        border: `1px solid ${service.color}40`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.4),
                    0 0 20px ${service.color}25,
                    inset 0 1px 0 rgba(255,255,255,0.08)`,
        cursor: 'pointer',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${service.color}30, transparent)`,
          pointerEvents: 'none',
        }}
        animate={{ x: ['-100%', '400%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 2 + index * 0.5,
        }}
      />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${service.color}30, ${service.color}10)`,
            border: `1px solid ${service.color}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 16px ${service.color}40`,
          }}
          animate={{
            boxShadow: [
              `0 0 12px ${service.color}30`,
              `0 0 22px ${service.color}60`,
              `0 0 12px ${service.color}30`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ServiceIcon type={service.icon} color={service.color} size={18} />
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            ...latoStyle,
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '2px',
            color: service.color,
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${service.color}80`,
          }}
        >
          {service.short}
        </span>
        <span
          style={{
            ...latoStyle,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          {service.label}
        </span>
      </div>

      <div style={{ position: 'relative', marginLeft: '4px' }}>
        <motion.div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: service.color,
            boxShadow: `0 0 8px ${service.color}`,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  MOBILE SERVICE CHIPS
// ─────────────────────────────────────────────
function MobileServiceChips({ onCardClick }: { onCardClick: (service: typeof SERVICES[0]) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      style={{
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
        zIndex: 8,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 16px',
        pointerEvents: 'auto',
      }}
    >
      {SERVICES.map((service, i) => (
        <motion.div
          key={service.id}
          onClick={() => onCardClick(service)}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            delay: 2.4 + i * 0.08,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '20px',
            background: 'rgba(10, 22, 40, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${service.color}50`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 12px ${service.color}25`,
            cursor: 'pointer',
          }}
        >
          <ServiceIcon type={service.icon} color={service.color} size={12} />
          <span
            style={{
              ...latoStyle,
              fontSize: '0.68rem',
              fontWeight: 700,
              color: service.color,
              letterSpacing: '0.5px',
              textShadow: `0 0 6px ${service.color}60`,
            }}
          >
            {service.short}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  MAIN HERO COMPONENT
// ─────────────────────────────────────────────
export function AnimatedCarousel() {
  const [phase, setPhase] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openServiceModal = (service: typeof SERVICES[0]) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const CVS_TEXT = 'CVS';
  const MSL_TEXT = 'Multi Services Pvt. Ltd.';

  return (
    <section style={styles.section}>

      <AnimatedBackground />

      {!isMobile
        ? <ServiceProps onCardClick={openServiceModal} />
        : <MobileServiceChips onCardClick={openServiceModal} />
      }

      <div style={styles.contentContainer}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >

            <div className="hidden lg:flex items-center justify-center">
              <div>
                {CVS_TEXT.split('').map((char, i) => (
                  <motion.span
                    key={`cvs-d-${i}`}
                    className="leading-[0.95] lg:text-6xl xl:text-7xl 2xl:text-8xl tracking-wide inline-block relative"
                    style={{
                      ...latoStyle,
                      color: HERO_COLORS.cvs,
                      fontWeight: 800,
                      WebkitTextStroke: '1.5px rgba(0,0,0,0.7)',
                      paintOrder: 'stroke fill',
                      textShadow: `0 0 14px rgba(7,118,209,0.3),
                      0 2px 8px rgba(0,0,0,0.5),
                      0 6px 20px rgba(0,0,0,0.3)`,
                    }}
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <div className="relative mx-3 xl:mx-5 flex items-center justify-center">
                <motion.div
                  className="rounded-full"
                  initial={{ opacity: 0, height: 0, width: 0 }}
                  animate={phase >= 2 ? { opacity: 1, height: 70, width: 3 } : { opacity: 0, height: 0, width: 0 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    height: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                    width: { duration: 0.2, delay: 0.1 },
                  }}
                  style={{
                    background: `linear-gradient(180deg, transparent, ${COLORS.accent}, transparent)`,
                    boxShadow: `0 0 12px rgba(7,118,209,0.4), 0 0 24px rgba(7,118,209,0.15)`,
                  }}
                />
              </div>

              <div className="overflow-hidden">
                <motion.div
                  className="flex items-center"
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={phase >= 3 ? { x: '0%', opacity: 1 } : { x: '-100%', opacity: 0 }}
                  transition={{
                    x: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3 },
                  }}
                >
                  {MSL_TEXT.split('').map((char, i) => (
                    <motion.span
                      key={`ms-d-${i}`}
                      className="leading-[0.95] lg:text-5xl xl:text-6xl 2xl:text-7xl tracking-normal inline-block"
                      style={{
                        ...latoStyle,
                        color: HERO_COLORS.msl,
                        fontWeight: 600,
                        WebkitTextStroke: '1px rgba(0,0,0,0.65)',
                        paintOrder: 'stroke fill',
                        textShadow: `0 0 10px rgba(7,118,209,0.25),
                        0 2px 6px rgba(0,0,0,0.45),
                         0 4px 14px rgba(0,0,0,0.25)`,
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="flex lg:hidden flex-col items-center">
              <div>
                {CVS_TEXT.split('').map((char, i) => (
                  <motion.span
                    key={`cvs-m-${i}`}
                    className="leading-[0.95] text-3xl sm:text-4xl md:text-5xl tracking-wide inline-block"
                    style={{
                      ...latoStyle,
                      color: HERO_COLORS.cvs,
                      fontWeight: 800,
                      WebkitTextStroke: '1.2px rgba(0,0,0,0.7)',
                      paintOrder: 'stroke fill',
                      textShadow: `0 0 10px rgba(7,118,209,0.28),
                       0 2px 6px rgba(0,0,0,0.5),
                       0 4px 14px rgba(0,0,0,0.28)`,
                    }}
                    initial={{ opacity: 0, y: 12, scale: 0.8 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: i * 0.12, duration: 0.3, ease: 'easeOut' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <div className="my-3 sm:my-4 flex items-center justify-center">
                <motion.div
                  className="h-[2px]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={phase >= 2 ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{
                    width: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                    opacity: { duration: 0.3 },
                  }}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                    boxShadow: '0 0 12px rgba(7,118,209,0.3)',
                  }}
                />
              </div>

              <div className="overflow-hidden">
                <motion.div
                  className="text-center"
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={phase >= 3 ? { y: '0%', opacity: 1 } : { y: '-100%', opacity: 0 }}
                  transition={{
                    y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3 },
                  }}
                >
                  {MSL_TEXT.split('').map((char, i) => (
                    <motion.span
                      key={`ms-m-${i}`}
                      className="leading-[0.95] text-lg sm:text-xl md:text-2xl tracking-normal inline-block"
                      style={{
                        ...latoStyle,
                        color: HERO_COLORS.msl,
                        fontWeight: 600,
                        WebkitTextStroke: '0.8px rgba(0,0,0,0.65)',
                        paintOrder: 'stroke fill',
                        textShadow: `0 0 8px rgba(7,118,209,0.22),
                         0 2px 5px rgba(0,0,0,0.42),
                         0 3px 10px rgba(0,0,0,0.22)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={phase >= 3 ? { opacity: 1 } : {}}
                      transition={{ delay: i * 0.04, duration: 0.15 }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={phase >= 3 ? { width: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              className="mx-auto mt-5 sm:mt-6 h-[2px]
                         max-w-[8rem] sm:max-w-[10rem] md:max-w-[12rem]
                         lg:max-w-[14rem] xl:max-w-[16rem]
                         relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                boxShadow: '0 0 12px rgba(7,118,209,0.3)',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '30%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  borderRadius: '2px',
                }}
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 text-[11px] sm:text-xs tracking-[4px] uppercase font-medium"
              style={{
                color: 'rgba(255,255,255,0.75)',
                textShadow: '0 1px 6px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3)',
                letterSpacing: '0.25em',
              }}
            >
              Industrial Excellence Since 2017
            </motion.p>

          </motion.div>
        </div>
      </div>

      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeServiceModal}
      />

    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  section: {
    position: 'relative',
    height: '100svh',
    minHeight: '720px',
    overflow: 'hidden',
    background: '#040810',
  },
  contentContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
};