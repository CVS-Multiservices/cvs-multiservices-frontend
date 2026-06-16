import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import {
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Search,
  Camera,
  Sparkles,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { WhatsAppButton } from '@/components/ui';
import SEOMeta from '../components/SEOMeta';
import { Gallery as GalleryType } from '../types';
import dataService from '../services/dataService';

// ─── Helper: get lightbox image URL ──────────────────────────────────────────
// For Cloudinary images — request a larger version
function getLightboxUrl(url: string): string {
  // If Cloudinary URL, bump upload quality/size
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_1400,q_auto/');
  }
  // Fallback for Unsplash-style URLs
  return url.replace('w=800', 'w=1400').replace('h=600', 'h=788');
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
function GalleryCard({
  item,
  index,
  onClick,
}: {
  item: GalleryType;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 60, rotateX: 15 }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative group cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,160,23,0.3), rgba(240,192,64,0.1))',
        }}
      />

      <motion.div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          border: '1px solid rgba(212,160,23,0.08)',
          background: 'rgba(10,20,40,0.5)',
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          borderColor: 'rgba(212,160,23,0.4)',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.1)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(10,20,40,0.8)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <Camera
                  className="w-6 h-6"
                  style={{ color: 'rgba(212,160,23,0.3)' }}
                />
              </motion.div>
            </div>
          )}

          <motion.img
            src={item.image}
            alt={item.title ?? `Gallery ${index + 1}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.12 : 1,
              filter: isHovered
                ? 'brightness(0.7) saturate(1.2)'
                : 'brightness(0.9) saturate(1)',
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.div
            className="absolute inset-0"
            animate={{
              background: isHovered
                ? 'linear-gradient(180deg, rgba(5,13,26,0) 0%, rgba(5,13,26,0.4) 40%, rgba(5,13,26,0.95) 100%)'
                : 'linear-gradient(180deg, rgba(5,13,26,0) 50%, rgba(5,13,26,0.6) 100%)',
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Zoom icon */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <motion.div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{
                background: 'rgba(212,160,23,0.15)',
                border: '1px solid rgba(212,160,23,0.25)',
              }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                background: isHovered
                  ? 'rgba(212,160,23,0.3)'
                  : 'rgba(212,160,23,0.15)',
              }}
              transition={{ duration: 0.3 }}
            >
              <ZoomIn
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                style={{ color: '#d4a017' }}
              />
            </motion.div>
          </div>

          {/* Index number */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <motion.span
              className="text-[10px] sm:text-xs font-mono font-bold"
              style={{ color: 'rgba(212,160,23,0.4)' }}
              animate={{
                color: isHovered
                  ? 'rgba(212,160,23,0.8)'
                  : 'rgba(212,160,23,0.4)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.span>
          </div>

          {/* Title + underline */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 xl:p-5">
            <motion.div
              animate={{ y: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white font-semibold text-xs sm:text-sm xl:text-base leading-tight line-clamp-2">
                {item.title ?? `Photo ${index + 1}`}
              </h3>
            </motion.div>

            <motion.div
              className="mt-2 h-[2px] rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #d4a017, #f0c040, transparent)',
              }}
              animate={{ width: isHovered ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Sparkles on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(3)].map((_, sparkleIdx) => (
                  <motion.div
                    key={sparkleIdx}
                    className="absolute"
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: 30 + sparkleIdx * 60,
                      y: 20 + sparkleIdx * 30,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [20 + sparkleIdx * 30, -10 + sparkleIdx * 20],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.2,
                      delay: sparkleIdx * 0.2,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  >
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: '#d4a017' }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `rgba(212,160,23,${Math.random() * 0.15 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Lightbox Image with loader ───────────────────────────────────────────────
function LightboxImage({
  src,
  alt,
  swipeDirection,
  slideVariants,
  uniqueKey,
}: {
  src: string;
  alt: string;
  swipeDirection: 'left' | 'right' | null;
  slideVariants: Variants;
  uniqueKey: string;
}) {
  const [_loaded, setLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setShowImage(false);

    const img = new Image();
    img.src = src;

    if (img.complete) {
      setLoaded(true);
      setShowImage(true);
    } else {
      img.onload = () => {
        setLoaded(true);
        requestAnimationFrame(() => setShowImage(true));
      };
    }

    return () => {
      img.onload = null;
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Loader */}
      <AnimatePresence>
        {!showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(5,13,26,0.95)' }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(212,160,23,0.08)',
                  border: '2px solid rgba(212,160,23,0.15)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(212,160,23,0)',
                    '0 0 0 12px rgba(212,160,23,0.08)',
                    '0 0 0 0 rgba(212,160,23,0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'linear',
                  }}
                >
                  <Loader2
                    className="w-7 h-7 sm:w-8 sm:h-8"
                    style={{ color: '#d4a017' }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#d4a017',
                  top: '50%',
                  left: '50%',
                  marginTop: -4,
                  marginLeft: -4,
                }}
                animate={{
                  x: [0, 30, 0, -30, 0],
                  y: [-30, 0, 30, 0, -30],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <motion.p
              className="text-xs sm:text-sm font-medium"
              style={{ color: 'rgba(212,160,23,0.5)' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading image...
            </motion.p>

            <div
              className="w-32 sm:w-40 h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(212,160,23,0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #d4a017, transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      <AnimatePresence mode="wait" custom={swipeDirection}>
        <motion.img
          key={uniqueKey}
          src={src}
          alt={alt}
          className="w-full h-full object-contain sm:object-cover"
          style={{
            maxHeight: 'calc(90vh - 80px)',
            minHeight: '200px',
            opacity: showImage ? 1 : 0,
          }}
          custom={swipeDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          draggable={false}
        />
      </AnimatePresence>
    </div>
  );
}

// ─── Main Gallery Page ────────────────────────────────────────────────────────
export default function Gallery() {
  // ── API state ──
  const [galleryItems, setGalleryItems] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryType | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const preloadedUrls = useRef<Set<string>>(new Set());

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await dataService.getGallery();

        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setGalleryItems(sorted);
        }
      } catch (err) {
        console.error('Gallery API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ── Filter by title search ──
  const filtered = galleryItems.filter((item) =>
    (item.title ?? '').toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // ── Preload adjacent images ──
  const preloadImage = useCallback((url: string) => {
    if (preloadedUrls.current.has(url)) return;
    const img = new Image();
    img.src = url;
    preloadedUrls.current.add(url);
  }, []);

  useEffect(() => {
    if (!lightbox || filtered.length <= 1) return;
    const prevIdx = (lightboxIdx - 1 + filtered.length) % filtered.length;
    const nextIdx = (lightboxIdx + 1) % filtered.length;
    const nextNextIdx = (lightboxIdx + 2) % filtered.length;
    preloadImage(getLightboxUrl(filtered[prevIdx].image));
    preloadImage(getLightboxUrl(filtered[nextIdx].image));
    preloadImage(getLightboxUrl(filtered[nextNextIdx].image));
  }, [lightboxIdx, lightbox, filtered, preloadImage]);

  const openLightbox = (item: GalleryType) => {
    const idx = filtered.findIndex((f) => f._id === item._id);
    setLightboxIdx(idx);
    setLightbox(item);
    setSwipeDirection(null);

    preloadImage(getLightboxUrl(item.image));
    if (filtered.length > 1) {
      const prevIdx = (idx - 1 + filtered.length) % filtered.length;
      const nextIdx = (idx + 1) % filtered.length;
      preloadImage(getLightboxUrl(filtered[prevIdx].image));
      preloadImage(getLightboxUrl(filtered[nextIdx].image));
    }
  };

  const goPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSwipeDirection('right');
      const newIdx = (lightboxIdx - 1 + filtered.length) % filtered.length;
      setLightboxIdx(newIdx);
      setLightbox(filtered[newIdx]);
    },
    [lightboxIdx, filtered]
  );

  const goNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSwipeDirection('left');
      const newIdx = (lightboxIdx + 1) % filtered.length;
      setLightboxIdx(newIdx);
      setLightbox(filtered[newIdx]);
    },
    [lightboxIdx, filtered]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const slideVariants: Variants = {
    enter: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? 120 : direction === 'right' ? -120 : 0,
      opacity: 0,
      scale: 0.9,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? -120 : direction === 'right' ? 120 : 0,
      opacity: 0,
      scale: 0.9,
    }),
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#080f1e' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10" style={{ color: '#d4a017' }} />
        </motion.div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${origin}/gallery#webpage`,
    "url": `${origin}/gallery`,
    "name": "CVS Multi Services Project Gallery",
    "description": "Visual showcase of CVS Multi Services operations including effluent treatment plants, seismic surveys, waste management, and safety standards.",
    "publisher": {
      "@type": "Organization",
      "name": "CVS Multi Services Private Limited",
      "url": `${origin}/`
    }
  };

  return (
    <div style={{ background: '#080f1e' }}>
      <SEOMeta
        title="Media Gallery & Project Showcases | CVS Multi Services"
        description="Browse photos and videos from our field operations, including active ETP sites, seismic survey camps, waste management projects, and client testimonials."
        keywords="CVS project gallery, seismic survey photos, mobile ETP images, field operations, project visual showcase"
        schema={gallerySchema}
      />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="relative pt-32 sm:pt-36 lg:pt-40 xl:pt-44 pb-20 sm:pb-24 lg:pb-28 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #050d1a 0%, #0a2447 50%, #071530 100%)',
        }}
      >
        <FloatingParticles />

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,160,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, #d4a017, transparent)',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: 'rgba(212,160,23,0.08)',
                border: '1px solid rgba(212,160,23,0.2)',
              }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(212,160,23,0)',
                  '0 0 0 15px rgba(212,160,23,0.05)',
                  '0 0 0 0 rgba(212,160,23,0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Camera
                  className="w-7 h-7 sm:w-9 sm:h-9"
                  style={{ color: '#d4a017' }}
                />
              </motion.div>
            </motion.div>

            <div className="section-label mx-auto w-fit mb-4">
              Visual Showcase
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-5">
              Our{' '}
              <span className="relative inline-block">
                <span className="grad-gold">Gallery</span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-[3px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #d4a017, #f0c040, transparent)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </h1>

            <motion.p
              className="max-w-2xl mx-auto text-sm sm:text-base xl:text-lg"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              A glimpse into our operations, projects, team events, and the
              work that defines who we are.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section
        className="relative py-12 sm:py-16 lg:py-24 2xl:py-28"
        style={{ background: '#080f1e' }}
      >
        <FloatingParticles />

        <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Search Bar */}
          <AnimatedSection>
            <div className="max-w-xl mx-auto mb-12 lg:mb-16">
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(10,20,40,0.6)',
                  backdropFilter: 'blur(20px)',
                }}
                animate={{
                  border: isSearchFocused
                    ? '1px solid rgba(212,160,23,0.5)'
                    : '1px solid rgba(212,160,23,0.12)',
                  boxShadow: isSearchFocused
                    ? '0 0 40px rgba(212,160,23,0.1), 0 20px 60px rgba(0,0,0,0.3)'
                    : '0 10px 40px rgba(0,0,0,0.2)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-[2px]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #d4a017, #f0c040, transparent)',
                  }}
                  animate={{ width: isSearchFocused ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />

                <motion.div
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  animate={{
                    scale: isSearchFocused ? 1.15 : 1,
                    color: isSearchFocused
                      ? '#d4a017'
                      : 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search our gallery..."
                  className="w-full bg-transparent py-3.5 sm:py-4 pl-11 sm:pl-13 pr-12
                             text-sm sm:text-base xl:text-lg text-white placeholder-white/25
                             outline-none font-medium"
                />

                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8
                               rounded-full flex items-center justify-center
                               transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'rgba(212,160,23,0.15)',
                      color: '#d4a017',
                      border: '1px solid rgba(212,160,23,0.25)',
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center gap-6 sm:gap-10 mb-10 lg:mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" style={{ color: '#d4a017' }} />
              <span
                className="text-xs sm:text-sm"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <span style={{ color: '#d4a017', fontWeight: 700 }}>
                  {filtered.length}
                </span>{' '}
                of {galleryItems.length} photos
              </span>
            </div>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <Search
                  className="w-3.5 h-3.5"
                  style={{ color: 'rgba(212,160,23,0.5)' }}
                />
                <span
                  className="text-xs sm:text-sm"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Searching: "
                  <span style={{ color: '#d4a017' }}>{searchQuery}</span>"
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* No results */}
          <AnimatePresence>
            {filtered.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <motion.div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: 'rgba(212,160,23,0.06)',
                    border: '1px solid rgba(212,160,23,0.12)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(212,160,23,0)',
                      '0 0 0 20px rgba(212,160,23,0.03)',
                      '0 0 0 0 rgba(212,160,23,0)',
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Search
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    style={{ color: 'rgba(212,160,23,0.3)' }}
                  />
                </motion.div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 font-playfair">
                  No photos found
                </h3>
                <p
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  className="text-sm sm:text-base mb-8"
                >
                  We couldn't find anything matching your search
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery('')}
                  className="px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #d4a017, #f0c040)',
                    color: '#050d1a',
                    boxShadow: '0 10px 30px rgba(212,160,23,0.3)',
                  }}
                >
                  Clear Search
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5
                       gap-3 sm:gap-4 lg:gap-5 xl:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item._id}
                  item={item}
                  index={i}
                  onClick={() => openLightbox(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 lg:p-10"
            style={{
              background: 'rgba(3,8,18,0.97)',
              backdropFilter: 'blur(30px)',
            }}
            onClick={() => setLightbox(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)',
              }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="relative w-full max-w-[92vw] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl
                         max-h-[90vh] sm:max-h-[88vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLightbox(null)}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20
                           w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d4a017, #f0c040)',
                  color: '#050d1a',
                  boxShadow: '0 5px 20px rgba(212,160,23,0.4)',
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* Nav arrows */}
              {filtered.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.15, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => goPrev(e)}
                    className="hidden sm:flex absolute left-3 lg:left-4 top-[40%] -translate-y-1/2
                               w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-full items-center justify-center z-20"
                    style={{
                      background: 'rgba(5,13,26,0.7)',
                      border: '1px solid rgba(212,160,23,0.3)',
                      color: '#d4a017',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => goNext(e)}
                    className="hidden sm:flex absolute right-3 lg:right-4 top-[40%] -translate-y-1/2
                               w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-full items-center justify-center z-20"
                    style={{
                      background: 'rgba(5,13,26,0.7)',
                      border: '1px solid rgba(212,160,23,0.3)',
                      color: '#d4a017',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </motion.button>
                </>
              )}

              {/* Lightbox card */}
              <div
                className="rounded-xl sm:rounded-2xl overflow-hidden flex flex-col max-h-full"
                style={{
                  border: '1px solid rgba(212,160,23,0.25)',
                  boxShadow:
                    '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,160,23,0.05)',
                }}
              >
                {/* Image area */}
                <div className="relative flex-1 min-h-0 overflow-hidden bg-black/50">
                  <LightboxImage
                    src={getLightboxUrl(lightbox.image)}
                    alt={lightbox.title ?? 'Gallery Image'}
                    swipeDirection={swipeDirection}
                    slideVariants={slideVariants}
                    uniqueKey={lightbox._id + lightboxIdx}
                  />
                </div>

                {/* Caption */}
                <div
                  className="flex-shrink-0 px-3 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,36,71,0.95) 0%, rgba(5,13,26,0.98) 100%)',
                    borderTop: '1px solid rgba(212,160,23,0.1)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <motion.div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(212,160,23,0.1)',
                          border: '1px solid rgba(212,160,23,0.2)',
                        }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Camera
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                          style={{ color: '#d4a017' }}
                        />
                      </motion.div>
                      <h3 className="font-playfair text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-white truncate">
                        {lightbox.title ?? `Photo ${lightboxIdx + 1}`}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2">
                        <div
                          className="w-16 lg:w-20 xl:w-24 h-1 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.08)' }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background:
                                'linear-gradient(90deg, #d4a017, #f0c040)',
                            }}
                            animate={{
                              width: `${
                                ((lightboxIdx + 1) / filtered.length) * 100
                              }%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <span
                        className="text-[10px] sm:text-xs font-mono font-bold"
                        style={{ color: 'rgba(212,160,23,0.6)' }}
                      >
                        {String(lightboxIdx + 1).padStart(2, '0')}/
                        {String(filtered.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Mobile swipe hint */}
                  <div className="sm:hidden mt-2 flex items-center justify-between">
                    <p
                      className="text-[9px]"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                      ← Swipe to navigate →
                    </p>
                    <div className="flex gap-[3px]">
                      {filtered.length <= 16 &&
                        filtered.map((_, dotIdx) => (
                          <motion.div
                            key={dotIdx}
                            className="rounded-full"
                            animate={{
                              width: dotIdx === lightboxIdx ? 10 : 3,
                              background:
                                dotIdx === lightboxIdx
                                  ? '#d4a017'
                                  : 'rgba(255,255,255,0.12)',
                            }}
                            transition={{ duration: 0.3 }}
                            style={{ height: 3 }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}