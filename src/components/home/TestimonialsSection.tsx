import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { Testimonial } from '../../types';
import dataService from '../../services/dataService';

// ─── Format date helper ───────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Icons.Star
          key={i}
          className="w-4 h-4"
          style={{
            color: i < rating ? COLORS.accent : COLORS.starEmpty,
            fill: i < rating ? COLORS.accent : 'transparent',
          }}
        />
      ))}
    </div>
  );
}



function TestimonialListCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const text = testimonial.text ?? '';                    // ← safe fallback
  const isLong = text.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl p-5 sm:p-6 relative overflow-hidden"
      style={{
        background: testimonial.featured
          ? COLORS.featuredCardBg
          : COLORS.cardBgMedium,
        border: `1px solid ${testimonial.featured ? COLORS.goldSoftBg : COLORS.cardGoldSoft
          }`,
        boxShadow: COLORS.cardShadow,
      }}
    >
      {/* Background Quote */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-[0.06]">
        <Icons.Quote
          className="w-16 h-16 sm:w-20 sm:h-20"
          style={{ color: COLORS.accent }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-[1]">
        {/* Author column */}
        <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:min-w-[120px] md:min-w-[140px] sm:pt-1">
          <div className="relative flex-shrink-0">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              style={{ border: `2px solid ${COLORS.goldBorderStrong}` }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: COLORS.goldGradientDark,
                border: `2px solid ${COLORS.primary}`,
              }}
            >
              <Icons.ThumbsUp className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="sm:text-center">
            <h4
              className="font-semibold text-sm sm:text-base"
              style={{ color: COLORS.white }}
            >
              {testimonial.name}
            </h4>
            <p className="text-xs sm:text-sm" style={{ color: COLORS.aboutGoldSoft }}>
              {testimonial.role}
            </p>
            <p className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
              {testimonial.company}
            </p>
          </div>
        </div>

        {/* Vertical divider (desktop) */}
        <div
          className="hidden sm:block w-[1px] self-stretch flex-shrink-0"
          style={{ background: COLORS.goldDividerGradient }}
        />

        {/* Horizontal divider (mobile) */}
        <div
          className="sm:hidden h-[1px] w-full"
          style={{ background: COLORS.goldDividerGradient }}
        />

        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Top row: rating + badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StarRating rating={testimonial.rating} />
            <span className="text-xs" style={{ color: COLORS.textMuted }}>
              {testimonial.rating}.0
            </span>
            {testimonial.featured && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: COLORS.border,
                  border: `1px solid ${COLORS.goldBorderStrong}`,
                  color: COLORS.accent,
                }}
              >
                Featured
              </span>
            )}
            {testimonial.date && (
              <span className="text-xs ml-auto" style={{ color: COLORS.textMuted }}>
                {formatDate(testimonial.date)}
              </span>
            )}
          </div>

          {/* Quote text */}
          {text && (                                       // ← only render if text exists
            <p
              className="text-sm sm:text-base leading-relaxed mb-3"
              style={{ color: COLORS.textSecondary }}
            >
              "{expanded || !isLong ? text : text.slice(0, 200) + '...'}"
            </p>
          )}

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold flex items-center gap-1 transition-colors duration-200 hover:underline mb-3"
              style={{ color: COLORS.accent }}
            >
              {expanded ? (
                <>Show less <Icons.ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <Icons.ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}

          {/* Project badge */}
          {testimonial.project && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: COLORS.cardGoldSoft,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <Icons.Building2
                className="w-3 h-3"
                style={{ color: COLORS.accent }}
              />
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                {testimonial.project}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: COLORS.bottomLineGradient }}
      />
    </motion.div>
  );
}

// ─── Main Carousel Card ───────────────────────────────────────────────────────
function MainTestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: Testimonial;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.9 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden w-full"
      style={{
        background: COLORS.mainTestimonialBg,
        border: `1px solid ${COLORS.goldSoftBg}`,
        boxShadow: COLORS.mainTestimonialShadow,
      }}
    >
      {/* Background Quote */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 opacity-[0.03]">
        <Icons.Quote
          className="w-36 h-36 sm:w-48 sm:h-48"
          style={{ color: COLORS.accent }}
        />
      </div>

      <div className="p-6 sm:p-8 xl:p-10 lg:p-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Author Info */}
          <div className="lg:col-span-4">
            <div className="text-center lg:text-left">
              {/* Photo */}
              <div className="relative inline-block mb-5 sm:mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-6px] sm:inset-[-8px] rounded-full"
                  style={{ background: COLORS.rotatingBorderGradient }}
                />
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover"
                  style={{ border: `4px solid ${COLORS.primary}` }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: COLORS.goldGradientDark,
                    border: `2px solid ${COLORS.primary}`,
                    boxShadow: COLORS.quoteIconShadow,
                  }}
                >
                  <Icons.Quote className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              {/* Name & Role */}
              <h3
                className="font-playfair text-lg sm:text-xl md:text-2xl font-bold mb-2"
                style={{ color: COLORS.white }}
              >
                {testimonial.name}
              </h3>
              <p
                className="text-sm sm:text-base font-semibold mb-1"
                style={{ color: COLORS.accent }}
              >
                {testimonial.role}
              </p>
              <p
                className="text-sm sm:text-base mb-4"
                style={{ color: COLORS.textHalf }}
              >
                {testimonial.company}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <StarRating rating={testimonial.rating} />
                <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Project Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: COLORS.cardGoldSoft,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <Icons.Building2
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  style={{ color: COLORS.accent }}
                />
                <span className="text-xs sm:text-sm" style={{ color: COLORS.textSecondary }}>
                  {testimonial.project}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quote */}
          <div className="lg:col-span-8">
            <div className="relative">
              <Icons.Quote
                className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 opacity-60"
                style={{ color: COLORS.accent }}
              />
              <blockquote
                className="font-playfair text-base sm:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6"
                style={{ color: COLORS.textAlmostWhite }}
              >
                {testimonial.text}
              </blockquote>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-[1px] sm:w-8"
                  style={{ background: COLORS.goldBorderStrong }}
                />
                <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>
                  {testimonial.date ? formatDate(testimonial.date) : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  suffix = '',
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="text-center p-5 sm:p-6 rounded-2xl transition-all duration-300"
      style={{
        background: COLORS.cardBgMedium,
        border: `1px solid ${COLORS.dividerGold}`,
      }}
    >
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
        style={{
          background: COLORS.dividerGold,
          border: `1px solid ${COLORS.goldSoftBg}`,
        }}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.accent }} />
      </div>
      <div
        className="text-xl sm:text-2xl lg:text-3xl font-bold font-rajdhani mb-1"
        style={{ color: COLORS.accent }}
      >
        {value}{suffix}
      </div>
      <div
        className="text-xs sm:text-sm uppercase tracking-wider"
        style={{ color: COLORS.textMuted }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── All Reviews Modal (LIST VIEW) ───────────────────────────────────────────
function AllReviewsModal({
  isOpen,
  onClose,
  testimonials,
}: {
  isOpen: boolean;
  onClose: () => void;
  testimonials: Testimonial[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] backdrop-blur-md"
            style={{ background: COLORS.modalBackdrop }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start justify-center p-3 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl xl:max-w-4xl rounded-3xl overflow-hidden my-4 sm:my-8"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.primary} 100%)`,
                  border: `1px solid ${COLORS.goldSoftBg}`,
                  boxShadow: COLORS.modalShadow,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.primaryOverlay80,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Modal Header */}
                <div
                  className="sticky top-0 z-[5] p-4 sm:p-6 xl:p-8 pb-4"
                  style={{
                    background: COLORS.modalBgStart,
                    borderBottom: `1px solid ${COLORS.cardGoldSoft}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: COLORS.goldSoftBg,
                        border: `1px solid ${COLORS.goldSoftBorder}`,
                      }}
                    >
                      <Icons.MessageSquare
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: COLORS.accent }}
                      />
                    </div>
                    <div>
                      <h2
                        className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold"
                        style={{ color: COLORS.white }}
                      >
                        All Client{' '}
                        <span style={{ color: COLORS.accent }}>Reviews</span>
                      </h2>
                      <p className="text-sm" style={{ color: COLORS.textHalf }}>
                        {testimonials.length} reviews from our valued clients
                      </p>
                    </div>
                  </div>
                </div>

                {/* List View */}
                <div className="p-4 sm:p-6 xl:p-8 pt-4 flex flex-col gap-4">
                  {testimonials.map((testimonial, idx) => (
                    <TestimonialListCard
                      key={testimonial._id || idx}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await dataService.getTestimonials();
        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setTestimonials(sorted);
        }
      } catch (err) {
        console.error('Testimonials API error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const featuredTestimonials = testimonials.filter((t) => t.featured);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      featuredTestimonials.length > 0
        ? (prev + 1) % featuredTestimonials.length
        : 0
    );
  }, [featuredTestimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      featuredTestimonials.length > 0
        ? (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length
        : 0
    );
  };

  useEffect(() => {
    if (!isPlaying || featuredTestimonials.length === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, featuredTestimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const testimonialStats = {
    totalClients: 500,
    satisfactionRate: 98,
    yearsOfTrust: 25,
    repeatClients: 85,
  };

  return (
    <>
      <AllReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonials={testimonials}
      />

      <section
        id="testimonials"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: COLORS.primary }}
      >
        {/* Background Elements */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
            transform: 'translate(-50%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
            transform: 'translate(50%, 30%)',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Icons.Heart className="w-4 h-4" />
                Client Love
              </div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
                style={{ color: COLORS.white }}
              >
                What Our <span className="grad-gold">Clients Say</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: COLORS.textHalf }}
              >
                Trusted by India's leading corporations for over 25 years.
                Here's what our partners have to say about working with us.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats Row */}
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 lg:mb-16">
              <StatCard
                icon={Icons.Users}
                value={testimonialStats.totalClients}
                label="Happy Clients"
                suffix="+"
              />
              <StatCard
                icon={Icons.ThumbsUp}
                value={testimonialStats.satisfactionRate}
                label="Satisfaction Rate"
                suffix="%"
              />
              <StatCard
                icon={Icons.Award}
                value={testimonialStats.yearsOfTrust}
                label="Years of Trust"
                suffix="+"
              />
              <StatCard
                icon={Icons.Heart}
                value={testimonialStats.repeatClients}
                label="Repeat Clients"
                suffix="%"
              />
            </div>
          </AnimatedSection>

          {/* Featured Carousel */}
          {featuredTestimonials.length > 0 && (
            <AnimatedSection>
              <div className="mb-10 lg:mb-12">
                {/* Carousel Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h3
                    className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl uppercase tracking-wider flex items-center gap-2"
                    style={{ color: COLORS.white }}
                  >
                    <Icons.Star
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: COLORS.accent }}
                    />
                    Featured Reviews
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                 transition-all duration-300 hover:scale-110"
                      style={{
                        background: COLORS.dividerGold,
                        border: `1px solid ${COLORS.goldSoftBg}`,
                        color: COLORS.accent,
                      }}
                    >
                      {isPlaying ? (
                        <Icons.Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Icons.Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={prevSlide}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                 transition-all duration-300 hover:scale-110"
                      style={{
                        background: COLORS.whiteFaint,
                        border: `1px solid ${COLORS.whiteSoft}`,
                        color: COLORS.white,
                      }}
                    >
                      <Icons.ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                 transition-all duration-300 hover:scale-110"
                      style={{
                        background: COLORS.whiteFaint,
                        border: `1px solid ${COLORS.whiteSoft}`,
                        color: COLORS.white,
                      }}
                    >
                      <Icons.ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Main Carousel */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <MainTestimonialCard
                      key={currentIndex}
                      testimonial={featuredTestimonials[currentIndex]}
                      isActive={true}
                    />
                  </AnimatePresence>

                  {/* Dots */}
                  <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
                    {featuredTestimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: idx === currentIndex ? '32px' : '8px',
                          height: '8px',
                          background:
                            idx === currentIndex
                              ? COLORS.accent
                              : COLORS.whiteLow,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* View All Button */}
          <AnimatedSection>
            <div className="text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 sm:gap-3 px-7 py-3.5 sm:px-8 sm:py-4
                           rounded-2xl text-sm sm:text-base font-semibold
                           transition-all duration-300 hover:scale-105"
                style={{
                  background: COLORS.highlightBg,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.accent,
                }}
              >
                <Icons.Quote className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View All {testimonials.length} Reviews</span>
                <Icons.ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}