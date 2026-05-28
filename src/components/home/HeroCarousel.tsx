import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '../../theme';
import { Slide } from '../../types';
import { useAppData } from '../../App';

const HERO_COLORS = {
  cvs: '#0776D1',
  msl: '#0776D1',
};

const latoStyle: CSSProperties = {
  fontFamily: '"Lato", sans-serif',
};

export function HeroCarousel() {
  const appData = useAppData();

  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [phase, setPhase] = useState(0);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const preloadedIndexes = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!appData?.slides?.length) return;
    const sorted = [...appData.slides].sort(
      (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime()
    );
    setSlides(sorted);
  }, [appData]);

  useEffect(() => {
    if (slides.length === 0) return;
    const firstImg = new Image();
    firstImg.src = slides[0].img;
    const onFirstLoad = () => {
      preloadedIndexes.current.add(0);
      setFirstImageReady(true);
      slides.slice(1).forEach((slide, idx) => {
        const img = new Image();
        img.src = slide.img;
        img.onload = () => preloadedIndexes.current.add(idx + 1);
      });
    };
    if (firstImg.complete) onFirstLoad();
    else {
      firstImg.onload = onFirstLoad;
      firstImg.onerror = onFirstLoad;
    }
  }, [slides]);

  useEffect(() => {
    if (!firstImageReady) return;
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [firstImageReady]);

  useEffect(() => {
    if (phase < 3 || slides.length === 0) return;
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [current, isAnimating, phase, slides.length]);

  const goNext = (): void => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrent((p) => (p + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goPrev = (): void => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const CVS_TEXT = 'CVS';
  const MSL_TEXT = 'Multi Services Pvt. Ltd.';

  if (!firstImageReady) {
    return (
      <section style={styles.section}>
        <div style={styles.skeleton}>
          <motion.div
            style={styles.shimmer}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>

      {/* ═══════════════════════════════════
          BACKGROUND IMAGE — FULLY VISIBLE
      ═══════════════════════════════════ */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          style={styles.absoluteFill}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <img
            src={slides[current].img}
            alt={slides[current].title}
            style={styles.image}
          />
          {/* Ultra-light color grade */}
          <div style={styles.lightGrade} />
          {/* Bottom fade for nav visibility */}
          <div style={styles.bottomFade} />
        </motion.div>
      </AnimatePresence>

      {/* Grid pattern */}
      <div style={styles.gridOverlay} />

      {/* ═══════════════════════════════════
          ★ GLASS STRIP — CONTAINS TEXT
          Text is inside the strip, not above it
      ═══════════════════════════════════ */}
      <motion.div
        style={styles.glassStrip}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={phase >= 1
          ? { opacity: 1, scaleX: 1 }
          : { opacity: 0, scaleX: 0 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated light sweep across the strip */}
        <motion.div
          style={styles.glassSweep}
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
        />

        {/* Top edge highlight */}
        <div style={styles.glassEdgeTop} />
        {/* Bottom edge highlight */}
        <div style={styles.glassEdgeBottom} />

        {/* ═══════════════════════════════════
            TEXT CONTENT — INSIDE GLASS STRIP
        ═══════════════════════════════════ */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >

            {/* ══════════════════════════════
                DESKTOP (lg+)
            ══════════════════════════════ */}
            <div className="hidden lg:flex items-center justify-center">

              {/* CVS — with white outline stroke effect */}
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
                      textShadow: ` 0 0 14px rgba(7,118,209,0.3),
                      0 2px 8px rgba(0,0,0,0.5),
                      0 6px 20px rgba(0,0,0,0.3)`,
                    }}
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={phase >= 1
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {}
                    }
                    transition={{
                      delay: i * 0.12,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Vertical pipe with glow */}
              <div className="relative mx-3 xl:mx-5 flex items-center justify-center">
                <motion.div
                  className="rounded-full"
                  initial={{ opacity: 0, height: 0, width: 0 }}
                  animate={phase >= 2
                    ? { opacity: 1, height: 70, width: 3 }
                    : { opacity: 0, height: 0, width: 0 }
                  }
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

              {/* Multi Services Pvt. Ltd. */}
              <div className="overflow-hidden">
                <motion.div
                  className="flex items-center"
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={phase >= 3
                    ? { x: '0%', opacity: 1 }
                    : { x: '-100%', opacity: 0 }
                  }
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
                      transition={{
                        delay: i * 0.04,
                        duration: 0.2,
                        ease: 'easeOut',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ══════════════════════════════
                MOBILE / TABLET (<lg)
            ══════════════════════════════ */}
            <div className="flex lg:hidden flex-col items-center">

              {/* CVS */}
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
                    animate={phase >= 1
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {}
                    }
                    transition={{
                      delay: i * 0.12,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Horizontal line */}
              <div className="my-3 sm:my-4 flex items-center justify-center">
                <motion.div
                  className="h-[2px]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={phase >= 2
                    ? { width: 80, opacity: 1 }
                    : { width: 0, opacity: 0 }
                  }
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

              {/* Multi Services Pvt. Ltd. */}
              <div className="overflow-hidden">
                <motion.div
                  className="text-center"
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={phase >= 3
                    ? { y: '0%', opacity: 1 }
                    : { y: '-100%', opacity: 0 }
                  }
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
                      transition={{
                        delay: i * 0.04,
                        duration: 0.15,
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ══════════════════════════════
                ANIMATED UNDERLINE
            ══════════════════════════════ */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={phase >= 3
                ? { width: '100%', opacity: 1 }
                : { width: 0, opacity: 0 }
              }
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
              {/* Traveling light */}
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
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 1,
                }}
              />
            </motion.div>

            {/* Tagline */}
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
      </motion.div>

      {/* ═══════════════════════════════════
          SLIDE PROGRESS INDICATORS
      ═══════════════════════════════════ */}
      <div style={styles.progressContainer}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrent(i);
                setTimeout(() => setIsAnimating(false), 800);
              }
            }}
            style={{
              ...styles.progressSegment,
              opacity: i === current ? 1 : 0.35,
            }}
          >
            {i === current && (
              <motion.div
                style={styles.progressFill}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5.5, ease: 'linear' }}
                key={`fill-${current}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Arrow navigation */}
      <div style={styles.arrowContainer}>
        <button onClick={goPrev} style={styles.arrowButton}>
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <button onClick={goNext} style={styles.arrowButton}>
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Slide counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={styles.slideCounter}
      >
        <span style={{
          ...latoStyle,
          color: COLORS.accent,
          fontWeight: 700,
          fontSize: '1.1rem',
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <motion.span
          style={{
            width: '24px',
            height: '2px',
            background: `linear-gradient(90deg, ${COLORS.accent}, rgba(7,118,209,0.3))`,
            display: 'inline-block',
            margin: '0 10px',
            verticalAlign: 'middle',
            borderRadius: '1px',
            boxShadow: '0 0 6px rgba(7,118,209,0.3)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{
          ...latoStyle,
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 400,
          fontSize: '0.85rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </motion.div>

    </section>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const styles: Record<string, CSSProperties> = {
  section: {
    position: 'relative',
    height: '100svh',
    minHeight: '720px',
    overflow: 'hidden',
    background: '#080f1e',
  },
  absoluteFill: {
    position: 'absolute',
    inset: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  /* ═══════════════════════════════════
     ULTRA-LIGHT OVERLAY
  ═══════════════════════════════════ */
  lightGrade: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.12)',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '20%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
  },

  gridOverlay: {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: `linear-gradient(${COLORS.gridGold} 1px, transparent 1px),
                      linear-gradient(90deg, ${COLORS.gridGold} 1px, transparent 1px)`,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
    zIndex: 5,
  },

  /* ═══════════════════════════════════
     ★ GLASS STRIP — CONTAINS TEXT
     Height increased to fit full text content
  ═══════════════════════════════════ */
  glassStrip: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    transform: 'translateY(-50%)',
    height: '220px',
    zIndex: 15,
    background: 'rgba(0, 0, 0, 0.18)',
    backdropFilter: 'blur(8px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(8px) saturate(1.4)',
    overflow: 'hidden',
    transformOrigin: 'center center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassSweep: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
    pointerEvents: 'none',
  },
  glassEdgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
  },
  glassEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.1) 50%, transparent 90%)',
  },

  /* ═══════════════════════════════════
     NAVIGATION
  ═══════════════════════════════════ */
  progressContainer: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  progressSegment: {
    position: 'relative',
    width: '48px',
    height: '3px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.25)',
    border: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    padding: 0,
    transition: 'opacity 0.3s ease',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: '2px',
    background: COLORS.accent,
    boxShadow: '0 0 8px rgba(7,118,209,0.5)',
  },

  arrowContainer: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '2rem',
    zIndex: 30,
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  arrowButton: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(4px)',
  },

  slideCounter: {
    position: 'absolute',
    bottom: '1.8rem',
    left: '2rem',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
  },

  skeleton: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, #0a0f1e 0%, #0d1829 50%, #0a0f1e 100%)',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent 0%, rgba(7,118,209,0.06) 50%, transparent 100%)',
  },
};