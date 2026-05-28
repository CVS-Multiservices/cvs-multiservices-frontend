import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { BlogModal, AllUpdatesModal } from '../modals';
import { formatDate } from '../../utils/formatDate';
import { COLORS } from '../../theme';
import { Blog } from '../../types';
import dataService from '../../services/dataService';

export function BlogSection() {
  // ── API state ──
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──
  const [activeBlog, setActiveBlog] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState<Blog | null>(null);
  const [allUpdatesOpen, setAllUpdatesOpen] = useState(false);

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await dataService.getBlogs();

        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setBlogs(sorted);
        }
      } catch (err) {
        console.error('Blog API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ── Prevent render until loaded or empty ──
  if (loading || blogs.length === 0) return null;

  // ── Modal handlers ──
  const openBlogModal = (postIndex: number) => {
    setModalPost(blogs[postIndex]);
    setModalOpen(true);
  };

  const closeBlogModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalPost(null), 400);
  };

  const openAllUpdates = () => setAllUpdatesOpen(true);
  const closeAllUpdates = () => setAllUpdatesOpen(false);

  const handleReadFromAllUpdates = (postIndex: number) => {
    closeAllUpdates();
    setTimeout(() => {
      setActiveBlog(postIndex);
      openBlogModal(postIndex);
    }, 350);
  };

  return (
    <>
      <BlogModal post={modalPost} isOpen={modalOpen} onClose={closeBlogModal} />
      <AllUpdatesModal
        isOpen={allUpdatesOpen}
        onClose={closeAllUpdates}
        onReadPost={handleReadFromAllUpdates}
        blogs={blogs}                  // ← pass live data
      />

      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: COLORS.darkAlt }}
      >
        {/* Background glows */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
            transform: 'translate(30%, -40%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
            transform: 'translate(-30%, 40%)',
          }}
        />

        {/* ── Full-width responsive container ── */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <AnimatedSection>
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Icons.Newspaper className="w-4 h-4" />
                Daily Updates
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4">
                Company <span className="grad-gold">Blog & News</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: COLORS.textSecondary }}
              >
                Stay updated with the latest milestones, project highlights, and
                company announcements from CVS Multi Services.
              </p>
            </AnimatedSection>
          </div>

          {/* ── Main grid ── */}
          <div className="grid lg:grid-cols-12 gap-6 xl:gap-10 2xl:gap-14">

            {/* ── Left: Featured card ── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <AnimatedSection direction="left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBlog}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                    }}
                    onClick={() => openBlogModal(activeBlog)}
                  >
                    {/* Image */}
                    <div className="relative h-[380px] sm:h-[460px] xl:h-[540px] 2xl:h-[620px] overflow-hidden">
                      <motion.img
                        src={blogs[activeBlog].img}
                        alt={blogs[activeBlog].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, ${COLORS.overlayLight} 0%, ${COLORS.overlayMid} 50%, ${COLORS.overlayDark} 100%)`,
                        }}
                      />
                    </div>

                    {/* Overlay content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 xl:p-10">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                          style={{
                            background: COLORS.cardHover,
                            color: COLORS.accent,
                            border: `1px solid ${COLORS.goldBorderStrong}`,
                          }}
                        >
                          {blogs[activeBlog].category}
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-xs xl:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <Icons.Calendar className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                          {blogs[activeBlog].date
                            ? formatDate(blogs[activeBlog].date!)
                            : ''}
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-xs xl:text-sm"
                          style={{ color: COLORS.textMuted }}
                        >
                          <Icons.Clock className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                          {blogs[activeBlog].readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-playfair text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl
                                   font-bold text-white mb-3 leading-tight
                                   group-hover:text-yellow-300 transition-colors duration-300"
                      >
                        {blogs[activeBlog].title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="text-sm xl:text-base leading-relaxed mb-5 xl:mb-6
                                   line-clamp-2 xl:line-clamp-3"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {blogs[activeBlog].excerpt}
                      </p>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-2 text-sm xl:text-base font-semibold"
                        style={{ color: COLORS.accent }}
                      >
                        <span>Read Full Update</span>
                        <Icons.ArrowUpRight className="w-4 h-4 xl:w-5 xl:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>

                    {/* Hover ring */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${COLORS.goldBorderStrong}, 0 0 40px ${COLORS.goldGlow}`,
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </AnimatedSection>
            </div>

            {/* ── Right: Sidebar list ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <AnimatedSection direction="right">
                {/* Section header */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h3 className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl text-white uppercase tracking-wider whitespace-nowrap">
                    Recent Updates
                  </h3>
                  <div
                    className="h-[1px] flex-1 ml-4"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.goldBorderStrong}, transparent)`,
                    }}
                  />
                </div>

                {/* Post list */}
                <div className="space-y-3 xl:space-y-4">
                  {blogs.map((post, i) => (
                    <motion.div
                      key={post._id}
                      onClick={() => setActiveBlog(i)}
                      whileHover={{ x: 6 }}
                      className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 group/item ${
                        activeBlog === i ? 'ring-1' : ''
                      }`}
                      style={{
                        background:
                          activeBlog === i ? COLORS.cardHover : COLORS.cardBg,
                        border:
                          activeBlog === i
                            ? `1px solid ${COLORS.goldBorderStrong}`
                            : `1px solid rgba(255,255,255,0.04)`,
                      }}
                      onMouseEnter={(e) => {
                        if (activeBlog !== i) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = COLORS.goldBorderSoft;
                          el.style.background = COLORS.cardHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeBlog !== i) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'rgba(255,255,255,0.04)';
                          el.style.background = COLORS.cardBg;
                        }
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-18 h-18 sm:w-20 sm:h-20 xl:w-24 xl:h-24 rounded-xl overflow-hidden flex-shrink-0 relative"
                        style={{ border: `1px solid ${COLORS.borderLight}` }}
                      >
                        <img
                          src={post.img}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                          style={{ background: COLORS.blueOverlay }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBlog(i);
                            openBlogModal(i);
                          }}
                        >
                          <Icons.BookOpen
                            className="w-4 h-4"
                            style={{ color: COLORS.accent }}
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {/* Category pill */}
                        <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                          <span
                            className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              color: COLORS.accent,
                              background: COLORS.cardHover,
                            }}
                          >
                            {post.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          className="text-sm xl:text-base font-semibold text-white leading-snug mb-1 sm:mb-1.5
                                     line-clamp-2 transition-colors duration-300 group-hover/item:text-yellow-300"
                        >
                          {post.title}
                        </h4>

                        {/* Date / read time / read btn */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span
                            className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                            style={{ color: COLORS.textMuted }}
                          >
                            <Icons.Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {post.date ? formatDate(post.date) : ''}
                          </span>
                          <span
                            className="flex items-center gap-1 text-[10px] sm:text-[11px]"
                            style={{ color: COLORS.textMuted }}
                          >
                            <Icons.Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {post.readTime}
                          </span>
                          <button
                            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold ml-auto
                                       transition-colors duration-300 hover:text-yellow-300"
                            style={{ color: COLORS.accent }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBlog(i);
                              openBlogModal(i);
                            }}
                          >
                            Read
                            <Icons.ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {activeBlog === i && (
                        <motion.div
                          layoutId="blogIndicator"
                          className="w-1 self-stretch rounded-full flex-shrink-0"
                          style={{ background: COLORS.accent }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* View All CTA */}
                <div className="mt-6 xl:mt-8 text-center">
                  <button
                    onClick={openAllUpdates}
                    className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm xl:text-base"
                  >
                    <span>View All Updates</span>
                    <Icons.ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}