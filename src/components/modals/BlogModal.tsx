import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { COLORS } from '../../theme';
import { Blog } from '../../types';

interface BlogModalProps {
  post: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogModal({ post, isOpen, onClose }: BlogModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999]"
            style={{
              background: COLORS.modalOverlay,
              backdropFilter: 'blur(12px)',
            }}
            onClick={onClose}
          />

          {/* Scroll wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10000] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 2xl:p-12">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.darkAlt} 100%)`,
                  border: `1px solid ${COLORS.goldBorderSoft}`,
                  boxShadow: `0 50px 100px rgba(0,0,0,0.7), 0 0 60px ${COLORS.goldGlow}, inset 0 1px 0 ${COLORS.whiteFaint}`,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full
                             flex items-center justify-center transition-all duration-300
                             hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.blueOverlay,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* ── Hero image ── */}
                <div className="relative h-[240px] sm:h-[320px] xl:h-[400px] 2xl:h-[460px] overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${COLORS.overlayLight} 0%, ${COLORS.overlayMid} 50%, ${COLORS.overlayDark} 100%)`,
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                    <span
                      className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs
                                 font-bold uppercase tracking-widest"
                      style={{
                        background: COLORS.goldSoftBg,
                        color: COLORS.accent,
                        border: `1px solid ${COLORS.goldSoftBorder}`,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title + meta overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 xl:p-8 z-10 pr-12 sm:pr-14">
                    <h2
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl
                                 font-bold text-white leading-tight mb-3 sm:mb-4"
                    >
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      {/* Date */}
                      {post.date && (
                        <span
                          className="flex items-center gap-1.5 text-xs sm:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <Icons.Calendar
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                            style={{ color: COLORS.accent }}
                          />
                          {formatDate(post.date)}
                        </span>
                      )}

                      {/* Read time */}
                      {post.readTime && (
                        <span
                          className="flex items-center gap-1.5 text-xs sm:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <Icons.Clock
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                            style={{ color: COLORS.accent }}
                          />
                          {post.readTime} read
                        </span>
                      )}

                      {/* Author */}
                      {post.author && (
                        <span
                          className="flex items-center gap-1.5 text-xs sm:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <Icons.BookOpen
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                            style={{ color: COLORS.accent }}
                          />
                          {post.author}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-4 sm:p-6 xl:p-10 2xl:p-12">
                  {/* Top divider */}
                  <div
                    className="h-[1px] mb-6 sm:mb-8"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.goldBorderStrong}, ${COLORS.borderLight}, transparent)`,
                    }}
                  />

                  {/* Body text */}
                  {post.fullContent && (
                    <div
                      className="prose prose-invert max-w-none mb-6 sm:mb-8"
                      style={{ color: COLORS.textLightStrong }}
                    >
                      {post.fullContent.split('\n\n').map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                          className="mb-4 sm:mb-5 text-sm sm:text-base xl:text-lg 2xl:text-xl leading-relaxed"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {paragraph.startsWith('•') ||
                          paragraph.startsWith('1.') ? (
                            <span
                              className="block pl-4"
                              style={{
                                borderLeft: `2px solid ${COLORS.goldBorderStrong}`,
                                paddingTop: '4px',
                                paddingBottom: '4px',
                              }}
                            >
                              {paragraph.split('\n').map((line, li) => (
                                <span key={li} className="block mb-1">
                                  {line.startsWith('•') ? (
                                    <span className="flex items-start gap-2">
                                      <Icons.CheckCircle2
                                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                                        style={{ color: COLORS.accent }}
                                      />
                                      <span>{line.replace('• ', '')}</span>
                                    </span>
                                  ) : (
                                    line
                                  )}
                                </span>
                              ))}
                            </span>
                          ) : (
                            paragraph
                          )}
                        </motion.p>
                      ))}
                    </div>
                  )}

                  {/* Mid divider */}
                  <div
                    className="h-[1px] mb-5 sm:mb-6"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
                    }}
                  />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
                      <Icons.Tag
                        className="w-4 h-4 mr-1 flex-shrink-0"
                        style={{ color: COLORS.goldIconSoft }}
                      />
                      {post.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium cursor-default"
                          style={{
                            background: COLORS.cardHover,
                            color: COLORS.goldTextSoft,
                            border: `1px solid ${COLORS.border}`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl
                                 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: COLORS.whiteFaint,
                        border: `1px solid ${COLORS.whiteBorder}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <Icons.ChevronLeft className="w-4 h-4" />
                      Back to Updates
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Share */}
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: post.title,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center
                                   transition-all duration-300 hover:scale-110"
                        style={{
                          background: COLORS.cardHover,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.accent,
                        }}
                        title="Share post"
                      >
                        <Icons.Share2 className="w-4 h-4" />
                      </button>

                      {/* Contact CTA */}
                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="btn-gold flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base"
                      >
                        <span>Contact Us</span>
                        <Icons.ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}