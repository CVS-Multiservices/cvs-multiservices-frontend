import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dataService from '../services/dataService';
import { AllData } from '../types';

interface LoaderProps {
  onComplete: () => void;
  onDataReady: (data: AllData) => void;
}

export default function Loader({ onComplete, onDataReady }: LoaderProps) {
  const [progress, setProgress]     = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase]           = useState(0);
  const [apiReady, setApiReady]     = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  const onCompleteCb  = useRef(onComplete);
  const onDataReadyCb = useRef(onDataReady);
  onCompleteCb.current  = onComplete;
  onDataReadyCb.current = onDataReady;

  const fetchedData = useRef<AllData | null>(null);

  // ─────────────────────────────────────────────
  //  PHASE TIMERS
  // ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 3800),
    ];

    const minTimer = setTimeout(() => setMinTimeDone(true), 4500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(minTimer);
    };
  }, []);

  // ─────────────────────────────────────────────
  //  API FETCH
  // ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const data = await dataService.getAll();
        if (!cancelled) {
          fetchedData.current = data;
          setApiReady(true);
        }
      } catch (err) {
        console.error('[Loader] API fetch failed:', err);
        if (!cancelled) {
          fetchedData.current = null;
          setApiReady(true);
        }
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // ─────────────────────────────────────────────
  //  PROGRESS 0 → 85  (auto, starts at phase 5)
  // ─────────────────────────────────────────────
  const progressStarted = useRef(false);

  useEffect(() => {
    if (phase < 5 || progressStarted.current) return;
    progressStarted.current = true;

    const steps = [
      { target: 30, delay: 0,    duration: 500 },
      { target: 60, delay: 500,  duration: 600 },
      { target: 85, delay: 1100, duration: 500 },
    ];

    const timers: NodeJS.Timeout[] = [];

    steps.forEach(({ target, delay, duration }, index) => {
      const startVal = index === 0 ? 0 : steps[index - 1].target;
      const timer = setTimeout(() => {
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const t       = Math.min(elapsed / duration, 1);
          const eased   = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          setProgress(Math.floor(startVal + (target - startVal) * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ─────────────────────────────────────────────
  //  COMPLETION LOGIC
  //  Runs ONLY when all 3 gates are open
  // ─────────────────────────────────────────────
  const completionStarted = useRef(false);

  const runCompletion = useCallback(() => {
    if (completionStarted.current) return;
    completionStarted.current = true;

    // ── Hand off data immediately when we start completing
    if (fetchedData.current) {
      onDataReadyCb.current(fetchedData.current);
    }

    // ── Animate progress 85 → 100
    const startVal = 85;
    const target   = 100;
    const duration = 600; // slightly slower so user sees 100%

    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t       = Math.min(elapsed / duration, 1);
      const eased   = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const current = Math.floor(startVal + (target - startVal) * eased);

      setProgress(current);

      if (t < 1) {
        requestAnimationFrame(tick);
      }
      // ★ t === 1 means bar is visually at 100% — now exit
    };

    requestAnimationFrame(tick);

    // ── Exit sequence AFTER bar finishes (600ms) + brief pause at 100% (500ms)
    //    Total: 600 (bar) + 500 (pause at 100%) = 1100ms before fade
    const fadeTimer = setTimeout(() => setIsComplete(true), 1100);

    // ── Notify App AFTER exit animation finishes (exit takes 600ms)
    const doneTimer = setTimeout(() => onCompleteCb.current(), 1100 + 700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  // ─────────────────────────────────────────────
  //  GATE — all 3 must be true
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (apiReady && minTimeDone && phase >= 5) {
      runCompletion();
    }
  }, [apiReady, minTimeDone, phase, runCompletion]);

  // ─────────────────────────────────────────────
  //  HARD TIMEOUT — 15s failsafe
  // ─────────────────────────────────────────────
  useEffect(() => {
    const hardTimeout = setTimeout(() => {
      console.warn('[Loader] Hard timeout — forcing completion');
      setApiReady(true);
      setMinTimeDone(true);
    }, 15000);

    return () => clearTimeout(hardTimeout);
  }, []);

  // ─────────────────────────────────────────────
  //  STATUS LABEL
  // ─────────────────────────────────────────────
  const getStatusLabel = () => {
    if (progress === 100) return 'Launching...';
    if (progress >= 85)   return apiReady ? 'Finalizing...' : 'Connecting to server...';
    if (progress >= 60)   return 'Loading Assets...';
    if (progress >= 30)   return 'Initializing Systems...';
    return 'Starting...';
  };

  // ─────────────────────────────────────────────
  //  JSX
  // ─────────────────────────────────────────────
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#F0F4F8' }}
          exit={{
            scale: 1.2,
            opacity: 0,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* ═══════════════════════════════════════════
              BACKGROUND — Gears
          ═══════════════════════════════════════════ */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-20 -left-20 w-64 h-64 opacity-[0.06]"
              style={{ filter: 'blur(2px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,10 L110,30 L130,20 L125,45 L150,40 L140,65 L165,65 L150,85 L170,95 L150,110 L165,130 L140,125 L145,150 L120,140 L115,165 L95,150 L75,165 L80,140 L55,145 L65,120 L40,125 L55,105 L35,95 L55,80 L40,60 L65,65 L60,40 L85,50 L90,25 Z"
                  fill="none" stroke="#0776D1" strokeWidth="3"/>
                <circle cx="100" cy="100" r="30" fill="none" stroke="#0776D1" strokeWidth="3"/>
              </svg>
            </motion.div>

            <motion.div
              className="absolute -bottom-20 -right-20 w-72 h-72 opacity-[0.06]"
              style={{ filter: 'blur(2px)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,10 L110,30 L130,20 L125,45 L150,40 L140,65 L165,65 L150,85 L170,95 L150,110 L165,130 L140,125 L145,150 L120,140 L115,165 L95,150 L75,165 L80,140 L55,145 L65,120 L40,125 L55,105 L35,95 L55,80 L40,60 L65,65 L60,40 L85,50 L90,25 Z"
                  fill="none" stroke="#3B82F6" strokeWidth="3"/>
                <circle cx="100" cy="100" r="35" fill="none" stroke="#3B82F6" strokeWidth="3"/>
              </svg>
            </motion.div>

            <motion.div
              className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.05]"
              style={{ filter: 'blur(1.5px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,10 L110,30 L130,20 L125,45 L150,40 L140,65 L165,65 L150,85 L170,95 L150,110 L165,130 L140,125 L145,150 L120,140 L115,165 L95,150 L75,165 L80,140 L55,145 L65,120 L40,125 L55,105 L35,95 L55,80 L40,60 L65,65 L60,40 L85,50 L90,25 Z"
                  fill="none" stroke="#0776D1" strokeWidth="2.5"/>
                <circle cx="100" cy="100" r="25" fill="none" stroke="#0776D1" strokeWidth="2.5"/>
              </svg>
            </motion.div>

            <motion.div
              className="absolute -bottom-10 -left-10 w-56 h-56 opacity-[0.05]"
              style={{ filter: 'blur(1.5px)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,10 L110,30 L130,20 L125,45 L150,40 L140,65 L165,65 L150,85 L170,95 L150,110 L165,130 L140,125 L145,150 L120,140 L115,165 L95,150 L75,165 L80,140 L55,145 L65,120 L40,125 L55,105 L35,95 L55,80 L40,60 L65,65 L60,40 L85,50 L90,25 Z"
                  fill="none" stroke="#3B82F6" strokeWidth="2.5"/>
                <circle cx="100" cy="100" r="28" fill="none" stroke="#3B82F6" strokeWidth="2.5"/>
              </svg>
            </motion.div>
          </div>

          {/* BACKGROUND — Pipes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute top-1/4 left-0 w-full h-24 opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pipe1" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="40" height="20" fill="none" stroke="#0776D1" strokeWidth="2"/>
                  <circle cx="20" cy="10" r="3" fill="#0776D1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pipe1)"/>
              {[...Array(8)].map((_, i) => (
                <motion.circle key={`p1-${i}`} r="2" fill="#3B82F6"
                  initial={{ cx: -20, cy: 10 }}
                  animate={{ cx: ['0%', '100%'] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.6, ease: 'linear' }}
                />
              ))}
            </svg>

            <svg className="absolute top-0 right-1/4 w-24 h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pipe2" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="20" height="40" fill="none" stroke="#3B82F6" strokeWidth="2"/>
                  <circle cx="10" cy="20" r="3" fill="#3B82F6"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pipe2)"/>
              {[...Array(6)].map((_, i) => (
                <motion.circle key={`p2-${i}`} r="2" fill="#0776D1"
                  initial={{ cx: 10, cy: -20 }}
                  animate={{ cy: ['0%', '100%'] }}
                  transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.7, ease: 'linear' }}
                />
              ))}
            </svg>
          </div>

          {/* BACKGROUND — Sparks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => {
              const size     = 1 + Math.random() * 2;
              const startX   = Math.random() * 100;
              const startY   = Math.random() * 100;
              const duration = 2 + Math.random() * 3;
              const delay    = Math.random() * 5;
              return (
                <motion.div key={`spark-${i}`} className="absolute rounded-full"
                  style={{
                    width: size, height: size,
                    left: `${startX}%`, top: `${startY}%`,
                    background:  i % 2 === 0 ? '#0776D1' : '#FCD34D',
                    boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? '#0776D1' : '#FCD34D'}`,
                  }}
                  animate={{
                    y: [0, -30 - Math.random() * 40],
                    x: [0, (Math.random() - 0.5) * 60],
                    opacity: [0, 1, 0],
                    scale:   [0, 1.5, 0],
                  }}
                  transition={{ duration, repeat: Infinity, delay, ease: 'easeOut' }}
                />
              );
            })}
          </div>

          {/* BACKGROUND — Conveyor Belt */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20"
              style={{ top: '40%' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-15"
              style={{ top: '60%' }}
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* BACKGROUND — Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0776D1" strokeWidth="0.5"/>
                  <circle cx="20" cy="20" r="1" fill="#0776D1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mesh)"/>
            </svg>
          </div>

          {/* BACKGROUND — Glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(7,118,209,0.08), transparent 60%)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ═══════════════════════════════════════════
              MAIN CARD
          ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 bg-white rounded-2xl shadow-[0_20px_50px_rgba(7,118,209,0.12)] p-8 sm:p-12 mx-4 max-w-6xl w-full"
          >
            <div className="relative flex flex-col items-center">

              {/* ── Desktop layout ── */}
              <div className="hidden lg:flex items-center whitespace-nowrap">
                <div className="whitespace-nowrap">
                  {'CVS'.split('').map((char, i) => (
                    <motion.span key={`cvs-d-${i}`}
                      className="font-lato font-bold text-5xl xl:text-6xl 2xl:text-7xl tracking-tighter inline-block"
                      style={{ color: '#0776D1' }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.15, duration: 0.2, ease: 'easeOut' }}
                    >{char}</motion.span>
                  ))}
                </div>

                <div className="relative mx-3 xl:mx-5 flex items-center justify-center">
                  <motion.div className="rounded-full"
                    initial={{ opacity: 0, height: 0, width: 0 }}
                    animate={phase >= 2 ? { opacity: 1, height: 70, width: 3 } : { opacity: 0, height: 0, width: 0 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      height:  { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                      width:   { duration: 0.2, delay: 0.1 },
                    }}
                    style={{ background: 'linear-gradient(180deg, transparent, #0776D1, transparent)' }}
                  />
                </div>

                <div className="overflow-hidden whitespace-nowrap">
                  <motion.div className="flex items-center whitespace-nowrap"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={phase >= 3 ? { x: '0%', opacity: 1 } : { x: '-100%', opacity: 0 }}
                    transition={{ x: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
                  >
                    {'Multi Services Pvt. Ltd.'.split('').map((char, i) => (
                      <motion.span key={`ms-d-${i}`}
                        className="font-lato font-bold text-4xl xl:text-5xl 2xl:text-6xl tracking-tight inline-block"
                        style={{ color: '#0776D1' }}
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

              {/* ── Mobile layout ── */}
              <div className="flex lg:hidden flex-col items-center">
                <div className="whitespace-nowrap">
                  {'CVS'.split('').map((char, i) => (
                    <motion.span key={`cvs-m-${i}`}
                      className="font-lato font-bold text-5xl sm:text-6xl tracking-tighter inline-block"
                      style={{ color: '#0776D1' }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.15, duration: 0.2, ease: 'easeOut' }}
                    >{char}</motion.span>
                  ))}
                </div>

                <div className="my-3 sm:my-4 flex items-center justify-center">
                  <motion.div className="h-[2px]"
                    initial={{ width: 0, opacity: 0 }}
                    animate={phase >= 2 ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
                    transition={{
                      width:   { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                      opacity: { duration: 0.3 },
                    }}
                    style={{ background: 'linear-gradient(90deg, transparent, #0776D1, transparent)' }}
                  />
                </div>

                <div className="overflow-hidden">
                  <motion.div className="text-center"
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={phase >= 3 ? { y: '0%', opacity: 1 } : { y: '-100%', opacity: 0 }}
                    transition={{ y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
                  >
                    {'Multi Services Pvt. Ltd.'.split('').map((char, i) => (
                      <motion.span key={`ms-m-${i}`}
                        className="font-lato font-bold text-3xl sm:text-4xl tracking-tight inline-block"
                        style={{ color: '#0776D1' }}
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

              {/* Underline */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={phase >= 4 ? { width: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-[2px] mt-4 sm:mt-6 w-full max-w-md"
                style={{ background: 'linear-gradient(90deg, transparent, #0776D1, transparent)' }}
              />

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-[11px] sm:text-xs tracking-[4px] uppercase font-medium"
                style={{ color: '#64748B' }}
              >
                Industrial Excellence Since 2017
              </motion.p>

              {/* ── Progress Bar ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md mt-8"
              >
                <div className="flex justify-between mb-2.5">
                  <span
                    className="text-[10px] sm:text-xs tracking-widest uppercase font-bold"
                    style={{ color: '#94A3B8' }}
                  >
                    {getStatusLabel()}
                  </span>
                  <span
                    className="text-sm sm:text-base font-mono font-bold"
                    style={{ color: '#0776D1' }}
                  >
                    {progress}%
                  </span>
                </div>

                {/* Bar track */}
                <div
                  className="h-2.5 sm:h-3 rounded-full overflow-hidden relative"
                  style={{ background: '#E2E8F0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  {/* ★ Bar fill — width driven by progress state */}
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #0776D1 0%, #3B82F6 100%)',
                      boxShadow:  '0 0 15px rgba(7,118,209,0.4)',
                      // smooth CSS transition so jumps look fluid
                      transition: 'width 0.1s linear',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)',
                      }}
                      animate={{ x: [-20, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
                  {['Init', 'Load', 'Process', 'Ready'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                        style={{
                          background: progress >= (i + 1) * 25 ? '#0776D1' : '#CBD5E1',
                          boxShadow:  progress >= (i + 1) * 25 ? '0 0 10px rgba(7,118,209,0.5)' : 'none',
                          transition: 'background 0.3s, box-shadow 0.3s',
                        }}
                        animate={progress >= (i + 1) * 25 ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      />
                      <span
                        className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold"
                        style={{
                          color:      progress >= (i + 1) * 25 ? '#0776D1' : '#94A3B8',
                          transition: 'color 0.3s',
                        }}
                      >
                        {step}
                      </span>
                      {i < 3 && <div className="w-3 h-[1px] bg-slate-200" />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-2.5 mt-8"
              >
                {['Reliable', 'Efficient', 'Sustainable'].map((word, i) => (
                  <motion.span
                    key={word}
                    className="text-[8px] sm:text-[9px] tracking-wider px-2.5 py-1 rounded-md font-semibold"
                    style={{
                      color:      '#0776D1',
                      background: 'rgba(7,118,209,0.08)',
                      border:     '1px solid rgba(7,118,209,0.15)',
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}