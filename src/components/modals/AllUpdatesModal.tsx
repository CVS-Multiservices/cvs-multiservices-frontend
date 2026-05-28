import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { COLORS } from '../../theme';
import { Blog } from '../../types';

interface AllUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadPost: (index: number) => void;
  blogs: Blog[];           // ← receive live data as prop
}

export function AllUpdatesModal({
  isOpen,
  onClose,
  onReadPost,
  blogs,
}: AllUpdatesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ── Derive categories from live data ──
  const categories = [
    'All',
    ...Array.from(new Set(blogs.map((p) => p.category).filter(Boolean) as string[])),
  ];

  // ── Filter live data ──
  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveCategory('All');
    }
  }, [isOpen]);

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
            className="fixed inset-0 z-[9998]"
            style={{
              background: COLORS.allUpdatesModalBackdrop,
              backdropFilter: 'blur(16px)',
            }}
            onClick={onClose}
          />

          {/* Scroll wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 2xl:p-12">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.darkAlt} 100%)`,
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: COLORS.allUpdatesModalShadow,
                }}
              >
                {/* Top accent line */}
                <div
                  className="h-[2px]"
                  style={{ background: COLORS.topAccentGradient }}
                />

                {/* ── Sticky Header ── */}
                <div
                  className="sticky top-0 z-20 px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6"
                  style={{
                    background: COLORS.stickyHeaderBg,
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${COLORS.dividerGold}`,
                  }}
                >
                  {/* Title row */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: COLORS.dividerGold,
                          border: `1px solid ${COLORS.goldSoftBg}`,
                        }}
                      >
                        <Icons.Newspaper
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: COLORS.accent }}
                        />
                      </div>
                      <div>
                        <h2
                          className="font-playfair text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold"
                          style={{ color: COLORS.white }}
                        >
                          All <span className="grad-gold">Updates</span>
                        </h2>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          {filteredPosts.length}{' '}
                          {filteredPosts.length === 1 ? 'article' : 'articles'} found
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Grid / List toggle */}
                      <div
                        className="hidden sm:flex items-center rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${COLORS.border}` }}
                      >
                        <button
                          onClick={() => setViewMode('grid')}
                          className="p-2 transition-all duration-200"
                          style={{
                            background:
                              viewMode === 'grid' ? COLORS.border : 'transparent',
                            color:
                              viewMode === 'grid' ? COLORS.accent : COLORS.whiteMuted,
                          }}
                        >
                          <Icons.Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className="p-2 transition-all duration-200"
                          style={{
                            background:
                              viewMode === 'list' ? COLORS.border : 'transparent',
                            color:
                              viewMode === 'list' ? COLORS.accent : COLORS.whiteMuted,
                          }}
                        >
                          <Icons.List className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Close */}
                      <button
                        onClick={onClose}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                   transition-all duration-300 hover:scale-110 hover:rotate-90"
                        style={{
                          background: COLORS.whiteFaint,
                          border: `1px solid ${COLORS.goldBorderStrong}`,
                          color: COLORS.accent,
                        }}
                      >
                        <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Search + category filters */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Icons.Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: COLORS.goldSoftBorder }}
                      />
                      <input
                        type="text"
                        placeholder="Search updates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                                   placeholder:text-white/30 outline-none transition-all duration-300"
                        style={{
                          background: COLORS.whiteFaint04,
                          border: `1px solid ${COLORS.dividerGold}`,
                          color: COLORS.white,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = COLORS.goldBorderStrong;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = COLORS.dividerGold;
                        }}
                      />
                    </div>

                    {/* Category pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <Icons.Filter
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: COLORS.goldSoftBorder }}
                      />
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
                          style={{
                            background:
                              activeCategory === cat
                                ? COLORS.goldSoftBg
                                : COLORS.whiteFaint04,
                            color:
                              activeCategory === cat
                                ? COLORS.accent
                                : COLORS.textMuted,
                            border:
                              activeCategory === cat
                                ? `1px solid ${COLORS.goldSoftBorder}`
                                : `1px solid ${COLORS.whiteFaint06}`,
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-4 sm:p-6 xl:p-8">

                  {/* Empty state */}
                  {filteredPosts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20"
                    >
                      <Icons.Search
                        className="w-12 h-12 mx-auto mb-4"
                        style={{ color: COLORS.goldSoftBg }}
                      />
                      <p
                        className="text-lg font-semibold mb-2"
                        style={{ color: COLORS.white }}
                      >
                        No updates found
                      </p>
                      <p className="text-sm" style={{ color: COLORS.textMuted }}>
                        Try adjusting your search or filter criteria
                      </p>
                    </motion.div>

                  ) : viewMode === 'grid' ? (
                    /* ── Grid view ── */
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
                      {filteredPosts.map((post, i) => {
                        // Find original index in the full blogs array for modal navigation
                        const originalIndex = blogs.findIndex(
                          (bp) => bp._id === post._id
                        );
                        return (
                          <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => onReadPost(originalIndex)}
                            className="relative rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
                            style={{
                              background: COLORS.cardBgMedium,
                              border: `1px solid ${COLORS.borderLight}`,
                              boxShadow: COLORS.updateCardShadow,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.goldBorderStrong;
                              el.style.boxShadow = COLORS.updateCardShadowHover;
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.borderLight;
                              el.style.boxShadow = COLORS.updateCardShadow;
                            }}
                          >
                            {/* Thumbnail */}
                            <div className="relative h-[150px] xl:h-[170px] overflow-hidden">
                              <img
                                src={post.img}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div
                                className="absolute inset-0"
                                style={{ background: COLORS.updateImageOverlay }}
                              />
                              <span
                                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{
                                  background: COLORS.goldSoftBg,
                                  color: COLORS.accent,
                                  border: `1px solid ${COLORS.goldBorderStrong}`,
                                  backdropFilter: 'blur(8px)',
                                }}
                              >
                                {post.category}
                              </span>
                            </div>

                            {/* Text */}
                            <div className="p-4 xl:p-5 flex flex-col flex-1">
                              <h4
                                className="font-semibold text-sm xl:text-base leading-snug mb-2
                                           line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300"
                                style={{ color: COLORS.white }}
                              >
                                {post.title}
                              </h4>
                              <p
                                className="text-xs xl:text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
                                style={{ color: COLORS.textMuted }}
                              >
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  {post.date && (
                                    <span
                                      className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                                      style={{ color: COLORS.whiteMuted }}
                                    >
                                      <Icons.Calendar className="w-3 h-3" />
                                      {formatDate(post.date)}
                                    </span>
                                  )}
                                  {post.readTime && (
                                    <span
                                      className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                                      style={{ color: COLORS.whiteMuted }}
                                    >
                                      <Icons.Clock className="w-3 h-3" />
                                      {post.readTime}
                                    </span>
                                  )}
                                </div>
                                <Icons.ArrowUpRight
                                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  style={{ color: COLORS.accent }}
                                />
                              </div>
                            </div>

                            {/* Bottom glow */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                              style={{ background: COLORS.bottomLineGradient }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>

                  ) : (
                    /* ── List view ── */
                    <div className="space-y-3 xl:space-y-4">
                      {filteredPosts.map((post, i) => {
                        const originalIndex = blogs.findIndex(
                          (bp) => bp._id === post._id
                        );
                        return (
                          <motion.div
                            key={post._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            whileHover={{ x: 6 }}
                            onClick={() => onReadPost(originalIndex)}
                            className="flex gap-3 sm:gap-4 p-3 sm:p-4 xl:p-5 rounded-2xl cursor-pointer group transition-all duration-300"
                            style={{
                              background: COLORS.cardBgLight30,
                              border: `1px solid ${COLORS.whiteFaint04}`,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.goldBorder25;
                              el.style.background = COLORS.highlightBgSoft;
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.whiteFaint04;
                              el.style.background = COLORS.cardBgLight30;
                            }}
                          >
                            {/* Thumbnail */}
                            <div
                              className="w-24 h-20 sm:w-32 sm:h-24 xl:w-40 xl:h-28 rounded-xl overflow-hidden flex-shrink-0"
                              style={{ border: `1px solid ${COLORS.dividerGold}` }}
                            >
                              <img
                                src={post.img}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                                  style={{
                                    color: COLORS.accent,
                                    background: COLORS.dividerGold,
                                  }}
                                >
                                  {post.category}
                                </span>
                              </div>
                              <h4
                                className="text-sm xl:text-base font-semibold leading-snug mb-1
                                           line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300"
                                style={{ color: COLORS.white }}
                              >
                                {post.title}
                              </h4>
                              <p
                                className="text-xs xl:text-sm leading-relaxed mb-2 line-clamp-1 hidden sm:block"
                                style={{ color: COLORS.textLight35 }}
                              >
                                {post.excerpt}
                              </p>
                              <div className="flex items-center gap-2 sm:gap-3">
                                {post.date && (
                                  <span
                                    className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                                    style={{ color: COLORS.whiteMuted }}
                                  >
                                    <Icons.Calendar className="w-3 h-3" />
                                    {formatDate(post.date)}
                                  </span>
                                )}
                                {post.readTime && (
                                  <span
                                    className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                                    style={{ color: COLORS.whiteMuted }}
                                  >
                                    <Icons.Clock className="w-3 h-3" />
                                    {post.readTime}
                                  </span>
                                )}
                                <span
                                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold ml-auto"
                                  style={{ color: COLORS.accent }}
                                >
                                  Read More
                                  <Icons.ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Footer ── */}
                <div
                  className="px-4 sm:px-6 xl:px-8 py-4 sm:py-5 flex items-center justify-between"
                  style={{ borderTop: `1px solid ${COLORS.borderLight}` }}
                >
                  <p className="text-xs sm:text-sm" style={{ color: COLORS.whiteMuted }}>
                    Showing {filteredPosts.length} of {blogs.length} updates
                  </p>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl
                               text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: COLORS.whiteFaint,
                      border: `1px solid ${COLORS.whiteSoft}`,
                      color: COLORS.textHalf,
                    }}
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}