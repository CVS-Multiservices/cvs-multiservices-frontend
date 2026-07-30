import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { OngoingProject } from '../../types';
import dataService from '../../services/dataService';
import { createPortal } from 'react-dom';
import { useRef } from 'react';


// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (iconName: string | undefined): LucideIcon => {
  if (!iconName) return Icons.Settings;
  return (Icons as any)[iconName] || Icons.Settings;
};

// ─── Status helpers ──────────────────────────────────────────────────────────
type ProjectStatus = 'ongoing' | 'completed';

const isCompleted = (p: OngoingProject) =>
  (p as any).status?.toLowerCase() === 'completed';

// ─── Project Detail Modal ────────────────────────────────────────────────────
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: OngoingProject | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  const IconComponent = getIcon(project.icon);
  const completed = isCompleted(project);

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
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-3xl overflow-hidden"
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
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-9 h-9 sm:w-10 sm:h-10
                             rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.primaryOverlay80,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Hero Image */}
                <div className="relative h-56 sm:h-72 xl:h-80 2xl:h-96">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, transparent, ${COLORS.projectOverlay}, ${COLORS.primary})`,
                    }}
                  />

                  {/* Status Pill Top-Left */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: completed
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(251, 191, 36, 0.15)',
                        border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
                        color: completed ? '#34d399' : '#fbbf24',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {completed ? (
                        <Icons.CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      ) : (
                        <Icons.Loader className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                      )}
                      {completed ? 'Delivered' : 'In Progress'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-12 sm:bottom-6 sm:left-6 sm:right-16">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: COLORS.goldSoftBg,
                          border: `1px solid ${COLORS.goldSoftBorder}`,
                        }}
                      >
                        <IconComponent
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color: COLORS.accent }}
                        />
                      </div>
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold
                                   px-2.5 py-1 rounded-full"
                        style={{
                          background: COLORS.dividerGold,
                          color: COLORS.accent,
                          border: `1px solid ${COLORS.goldBorderStrong}`,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <h2
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold leading-tight"
                      style={{ color: COLORS.white }}
                    >
                      {project.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 xl:p-8">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      { icon: Icons.MapPin, label: 'Location', value: project.location },
                      { icon: Icons.Users, label: 'Team Size', value: `${project.teamSize} Members` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="p-3 sm:p-4 rounded-xl text-center"
                        style={{
                          background: COLORS.cardBgMedium,
                          border: `1px solid ${COLORS.dividerGold}`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                          style={{ color: COLORS.accent }}
                        />
                        <div className="text-[10px] sm:text-xs" style={{ color: COLORS.textHalf }}>
                          {label}
                        </div>
                        <div className="text-sm font-semibold truncate" style={{ color: COLORS.white }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div className="w-6 h-[2px]" style={{ background: COLORS.accent }} />
                      Project Overview
                    </h3>
                    <p className="text-sm xl:text-base leading-relaxed" style={{ color: COLORS.textSecondary }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div className="w-6 h-[2px]" style={{ background: COLORS.accent }} />
                      Key Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            background: COLORS.dividerGold,
                            border: `1px solid ${COLORS.goldSoftBg}`,
                            color: COLORS.accent,
                          }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8"
                    style={{
                      background: COLORS.cardBgMedium,
                      border: `1px solid ${COLORS.dividerGold}`,
                    }}
                  >
                    <div
                      className="text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2"
                      style={{ color: COLORS.aboutGoldSoft }}
                    >
                      Client
                    </div>
                    <div className="text-base sm:text-lg font-semibold" style={{ color: COLORS.white }}>
                      {project.client}
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="btn-gold w-full py-3.5 sm:py-4 rounded-xl flex items-center
                               justify-center gap-2 text-sm sm:text-base font-bold"
                  >
                    <span>Discuss Similar Project</span>
                    <Icons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryFilterDropdown({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Calculate position when opening
  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-filter-dropdown]') && !target.closest('[data-filter-trigger]')) {
        setOpen(false);
      }
    };
    // Close on scroll or resize
    const closeOnScroll = () => setOpen(false);

    window.addEventListener('click', handler);
    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('resize', closeOnScroll);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('scroll', closeOnScroll, true);
      window.removeEventListener('resize', closeOnScroll);
    };
  }, [open]);

  return (
    <>
      {/* Icon Trigger */}
      <button
        ref={btnRef}
        data-filter-trigger
        onClick={toggleOpen}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 flex-shrink-0"
        style={{
          background: open ? COLORS.goldSoftBg : COLORS.cardBgMedium,
          border: `1px solid ${open ? COLORS.goldBorderStrong : COLORS.dividerGold}`,
          color: COLORS.accent,
        }}
        title="Filter by category"
      >
        <Icons.SlidersHorizontal className="w-4 h-4" />
        {active !== 'All' && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: COLORS.accent, border: `2px solid ${COLORS.primary}` }}
          />
        )}
      </button>

      {/* Portal Dropdown — renders at <body> level to escape overflow-hidden */}
      {open && coords && createPortal(
        <AnimatePresence>
          <motion.div
            data-filter-dropdown
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed w-56 max-h-72 overflow-y-auto rounded-xl py-1.5"
            style={{
              top: coords.top,
              right: coords.right,
              zIndex: 99999,
              background: COLORS.modalBgStart,
              border: `1px solid ${COLORS.goldBorderStrong}`,
              boxShadow: COLORS.modalShadow,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold border-b mb-1 sticky top-0"
              style={{
                color: COLORS.textHalf,
                borderColor: COLORS.dividerGold,
                background: COLORS.modalBgStart,
              }}
            >
              Filter by Category
            </div>
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 transition-colors"
                  style={{
                    color: isActive ? COLORS.accent : COLORS.textSecondary,
                    background: isActive ? COLORS.goldSoftBg : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = COLORS.cardBgMedium;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="truncate">{cat}</span>
                  {isActive && <Icons.Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
// ─── All Projects Modal (with Search + Icon Filter) ───────────────────────────
function AllProjectsModal({
  isOpen,
  onClose,
  onSelectProject,
  projects,
  title,
  status,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: OngoingProject) => void;
  projects: OngoingProject[];
  title: string;
  status: ProjectStatus;
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveCategory('All');
    }
  }, [isOpen]);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(projects.map((p) => p.category).filter(Boolean))
    ) as string[];
    return ['All', ...cats];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.highlights?.some((h) => h.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [projects, search, activeCategory]);

  const completed = status === 'completed';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] backdrop-blur-md"
            style={{ background: COLORS.modalBackdrop }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-3 sm:inset-6 xl:inset-10 z-[9999] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.primary} 100%)`,
              border: `1px solid ${COLORS.goldSoftBg}`,
              boxShadow: COLORS.modalShadow,
            }}
          >
            {/* ── Sticky Header ── */}
            <div
              className="flex-shrink-0 px-4 sm:px-8 py-4 sm:py-5 rounded-t-2xl sm:rounded-t-3xl"
              style={{
                background: COLORS.primaryOverlay80,
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${COLORS.dividerGold}`,
              }}
            >
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="min-w-0">
                  <h2
                    className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold truncate"
                    style={{ color: COLORS.white }}
                  >
                    {title.split(' ')[0]}{' '}
                    <span className="grad-gold">{title.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p className="text-xs sm:text-sm mt-0.5" style={{ color: COLORS.textHalf }}>
                    {filtered.length} of {projects.length} projects
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90 flex-shrink-0"
                  style={{
                    background: COLORS.cardBgMedium,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Search + Filter icon */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Icons.Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: COLORS.accent }}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects…"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl text-sm outline-none
                               placeholder:text-sm transition-all duration-300"
                    style={{
                      background: COLORS.cardBgMedium,
                      border: `1px solid ${COLORS.dividerGold}`,
                      color: COLORS.white,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = COLORS.goldBorderStrong;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.goldSoftBg}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = COLORS.dividerGold;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                                 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: COLORS.goldSoftBg, color: COLORS.accent }}
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Icon-Based Category Filter */}
                {categories.length > 1 && (
                  <CategoryFilterDropdown
                    categories={categories}
                    active={activeCategory}
                    onChange={setActiveCategory}
                  />
                )}
              </div>

              {/* Active filter chip */}
              {activeCategory !== 'All' && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] uppercase tracking-wider" style={{ color: COLORS.textHalf }}>
                    Filter:
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: COLORS.goldSoftBg,
                      color: COLORS.accent,
                      border: `1px solid ${COLORS.goldBorderStrong}`,
                    }}
                  >
                    {activeCategory}
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 xl:p-8">
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: COLORS.cardBgMedium,
                        border: `1px solid ${COLORS.dividerGold}`,
                      }}
                    >
                      <Icons.SearchX className="w-7 h-7" style={{ color: COLORS.accent }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: COLORS.white }}>
                      No projects found
                    </p>
                    <p className="text-sm" style={{ color: COLORS.textHalf }}>
                      Try adjusting your search or clearing the filters.
                    </p>
                    <button
                      onClick={() => { setSearch(''); setActiveCategory('All'); }}
                      className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{
                        background: COLORS.goldSoftBg,
                        border: `1px solid ${COLORS.goldBorderStrong}`,
                        color: COLORS.accent,
                      }}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
                    {filtered.map((project, idx) => {
                      const IconComponent = getIcon(project.icon);

                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          whileHover={{ y: -6 }}
                          onClick={() => {
                            onClose();
                            setTimeout(() => onSelectProject(project), 350);
                          }}
                          className="group cursor-pointer rounded-2xl overflow-hidden"
                          style={{
                            background: COLORS.cardBgMedium,
                            border: `1px solid ${COLORS.dividerGold}`,
                            boxShadow: COLORS.cardShadow,
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = COLORS.goldBorderStrong;
                            el.style.boxShadow = COLORS.cardShadowHover;
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = COLORS.dividerGold;
                            el.style.boxShadow = COLORS.cardShadow;
                          }}
                        >
                          <div className="relative h-36 sm:h-40 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(to top, ${COLORS.primary}, transparent, transparent)`,
                              }}
                            />

                            {/* Status pill */}
                            <div className="absolute top-2 left-2">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
                                style={{
                                  background: completed
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(251, 191, 36, 0.15)',
                                  border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
                                  color: completed ? '#34d399' : '#fbbf24',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {completed ? (
                                  <Icons.CheckCircle2 className="w-2.5 h-2.5" />
                                ) : (
                                  <Icons.Loader className="w-2.5 h-2.5 animate-spin" />
                                )}
                                {completed ? 'Delivered' : 'Live'}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3">
                              <div
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
                                style={{
                                  background: COLORS.blackOverlay,
                                  backdropFilter: 'blur(10px)',
                                  border: `1px solid ${COLORS.goldBorderStrong}`,
                                }}
                              >
                                <IconComponent
                                  className="w-4 h-4"
                                  style={{ color: COLORS.accent }}
                                />
                              </div>
                            </div>
                            <div
                              className="absolute inset-0 flex items-center justify-center opacity-0
                                         group-hover:opacity-100 transition-opacity duration-300"
                              style={{ background: COLORS.projectOverlay }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                                style={{
                                  background: COLORS.goldSoftBg,
                                  border: `2px solid ${COLORS.accent}`,
                                }}
                              >
                                <Icons.Eye
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  style={{ color: COLORS.accent }}
                                />
                              </motion.div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5">
                            <h3
                              className="font-rajdhani font-bold text-base sm:text-lg mb-1
                                         group-hover:text-yellow-300 transition-colors duration-300 line-clamp-1"
                              style={{ color: COLORS.white }}
                            >
                              {project.title}
                            </h3>
                            <p className="text-xs mb-3 line-clamp-1" style={{ color: COLORS.aboutGoldSoft }}>
                              {project.client}
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <span className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.textHalf }}>
                                <Icons.MapPin className="w-3 h-3" style={{ color: COLORS.accent }} />
                                {project.location}
                              </span>
                              <span className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.textHalf }}>
                                <Icons.Users className="w-3 h-3" style={{ color: COLORS.accent }} />
                                {project.teamSize} Team
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.accent }}>
                              <span>View Details</span>
                              <Icons.ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>

                          <div
                            className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                            style={{ background: COLORS.bottomGlowGradient }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Reusable Project Card (main sections) ───────────────────────────────────
function ProjectCard({
  project,
  onClick,
  status,
}: {
  project: OngoingProject;
  onClick: () => void;
  status: ProjectStatus;
}) {
  const IconComponent = getIcon(project.icon);
  const completed = status === 'completed';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl xl:rounded-3xl overflow-hidden h-full flex flex-col"
      style={{
        background: COLORS.cardBgMedium,
        border: `1px solid ${COLORS.dividerGold}`,
        boxShadow: COLORS.cardShadow,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.goldBorderStrong;
        el.style.boxShadow = COLORS.cardShadowHover;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.dividerGold;
        el.style.boxShadow = COLORS.cardShadow;
      }}
    >
      <div className="relative h-56 sm:h-64 xl:h-72 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${COLORS.primary}, transparent, transparent)` }}
        />

        {/* Status pill top-left */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
            style={{
              background: completed
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(251, 191, 36, 0.15)',
              border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
              color: completed ? '#34d399' : '#fbbf24',
              backdropFilter: 'blur(10px)',
            }}
          >
            {completed ? (
              <Icons.CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            ) : (
              <Icons.Loader className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
            )}
            {completed ? 'Delivered' : 'In Progress'}
          </span>
        </div>

        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{
              background: COLORS.blackOverlay,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${COLORS.goldBorderStrong}`,
            }}
          >
            <IconComponent className="w-5 h-5" style={{ color: COLORS.accent }} />
          </div>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center opacity-0
                     group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: COLORS.projectOverlay }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
            style={{
              background: COLORS.goldSoftBg,
              border: `2px solid ${COLORS.accent}`,
            }}
          >
            <Icons.Eye className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: COLORS.accent }} />
          </motion.div>
        </div>
      </div>

      <div className="p-5 sm:p-6 xl:p-8 flex flex-col flex-1">
        <div className="mb-4">
          <h3
            className="font-rajdhani font-bold text-xl xl:text-2xl 2xl:text-3xl mb-1
                       group-hover:text-yellow-300 transition-colors duration-300"
            style={{ color: COLORS.white }}
          >
            {project.title}
          </h3>
          <p className="text-sm xl:text-base" style={{ color: COLORS.aboutGoldSoft }}>
            {project.client}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-5">
          <span className="flex items-center gap-1.5 text-sm" style={{ color: COLORS.textHalf }}>
            <Icons.MapPin className="w-4 h-4" style={{ color: COLORS.accent }} />
            {project.location}
          </span>
          <span className="flex items-center gap-1.5 text-sm" style={{ color: COLORS.textHalf }}>
            <Icons.Users className="w-4 h-4" style={{ color: COLORS.accent }} />
            {project.teamSize} Team
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.highlights.map((h, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              style={{
                background: COLORS.highlightBg,
                color: COLORS.goldTextSoft,
                border: `1px solid ${COLORS.highlightBorder}`,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        <div
          className="mt-auto flex items-center gap-2 text-sm xl:text-base font-semibold"
          style={{ color: COLORS.accent }}
        >
          <span>View Details</span>
          <Icons.ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div
        className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: COLORS.bottomGlowGradient }}
      />
    </motion.div>
  );
}

// ─── Reusable Section Block ──────────────────────────────────────────────────
function ProjectsSectionBlock({
  status,
  projects,
  label,
  labelIcon: LabelIcon,
  headingWord1,
  headingWord2,
  description,
  onOpen,
  onOpenAll,
}: {
  status: ProjectStatus;
  projects: OngoingProject[];
  label: string;
  labelIcon: LucideIcon;
  headingWord1: string;
  headingWord2: string;
  description: string;
  onOpen: (project: OngoingProject) => void;
  onOpenAll: () => void;
}) {
  if (projects.length === 0) return null;

  const visibleProjects = projects.slice(0, 4);
  const hasMore = projects.length > 4;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
      {/* Heading */}
      <AnimatedSection>
        <div className="text-center mb-12 lg:mb-16">
          <div className="section-label mx-auto w-fit flex items-center gap-2">
            <LabelIcon className="w-4 h-4" />
            {label}
          </div>
          <h2
            className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
            style={{ color: COLORS.white }}
          >
            {headingWord1} <span className="grad-gold">{headingWord2}</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6" />
          <p
            className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
            style={{ color: COLORS.textHalf }}
          >
            {description}
          </p>
        </div>
      </AnimatedSection>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
        {visibleProjects.map((project, idx) => (
          <AnimatedSection key={project._id} delay={idx * 0.1}>
            <ProjectCard project={project} onClick={() => onOpen(project)} status={status} />
          </AnimatedSection>
        ))}
      </div>

      {/* View All */}
      {hasMore && (
        <AnimatedSection delay={0.4}>
          <div className="mt-10 lg:mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAll}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300"
              style={{
                background: COLORS.cardBgMedium,
                border: `1px solid ${COLORS.goldBorderStrong}`,
                color: COLORS.accent,
                boxShadow: COLORS.cardShadow,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = COLORS.cardShadowHover;
                el.style.background = COLORS.goldSoftBg;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = COLORS.cardShadow;
                el.style.background = COLORS.cardBgMedium;
              }}
            >
              <Icons.LayoutGrid className="w-5 h-5" />
              <span>View All {projects.length} {status === 'completed' ? 'Delivered' : 'Ongoing'} Projects</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────
export function OngoingProjectsSection() {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState<OngoingProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [allModalStatus, setAllModalStatus] = useState<ProjectStatus | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await dataService.getOngoingProjects();
        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setProjects(sorted);
        }
      } catch (err) {
        console.error('Projects API error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const ongoingList = useMemo(() => projects.filter((p) => !isCompleted(p)), [projects]);
  const completedList = useMemo(() => projects.filter((p) => isCompleted(p)), [projects]);

  if (loading || projects.length === 0) return null;

  const openModal = (project: OngoingProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const modalProjects =
    allModalStatus === 'completed' ? completedList :
    allModalStatus === 'ongoing' ? ongoingList : [];

  return (
    <>
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      <AllProjectsModal
        isOpen={allModalStatus !== null}
        onClose={() => setAllModalStatus(null)}
        onSelectProject={openModal}
        projects={modalProjects}
        title={allModalStatus === 'completed' ? 'Delivered Projects' : 'Ongoing Projects'}
        status={allModalStatus || 'ongoing'}
      />

      {/* ─── ONGOING PROJECTS SECTION ─── */}
      {ongoingList.length > 0 && (
        <section
          className="py-20 lg:py-28 relative overflow-hidden"
          style={{ background: COLORS.primary }}
        >
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
              transform: 'translate(30%, -30%)',
            }}
          />

          <ProjectsSectionBlock
            status="ongoing"
            projects={ongoingList}
            label="Live Operations"
            labelIcon={Icons.Zap}
            headingWord1="Ongoing"
            headingWord2="Projects"
            description="Active engagements currently underway across India, where our teams are delivering value in real-time."
            onOpen={openModal}
            onOpenAll={() => setAllModalStatus('ongoing')}
          />
        </section>
      )}

      {/* ─── DELIVERED / COMPLETED PROJECTS SECTION ─── */}
      {completedList.length > 0 && (
        <section
          className="py-20 lg:py-28 relative overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${COLORS.primary} 0%, ${COLORS.modalBgStart} 100%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
              transform: 'translate(-30%, 30%)',
            }}
          />

          <ProjectsSectionBlock
            status="completed"
            projects={completedList}
            label="Proven Track Record"
            labelIcon={Icons.Award}
            headingWord1="Successfully"
            headingWord2="Delivered"
            description="A legacy of successfully completed engagements — projects delivered on time, within scope, and to client satisfaction."
            onOpen={openModal}
            onOpenAll={() => setAllModalStatus('completed')}
          />

          {/* Career CTA Banner — placed after the last section */}
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
            <AnimatedSection delay={0.5}>
              <div className="mt-12 lg:mt-16 text-center">
                <div
                  className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3
                             px-4 sm:px-6 py-3 rounded-2xl"
                  style={{
                    background: COLORS.highlightBg,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <Icons.Briefcase
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    style={{ color: COLORS.accent }}
                  />
                  <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                    Want to contribute in these projects?
                  </span>
                  <Link
                    to="/careers"
                    className="text-sm font-semibold flex items-center gap-1
                               transition-colors duration-300 hover:text-yellow-300"
                    style={{ color: COLORS.accent }}
                  >
                    Join Us for a Career
                    <Icons.ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}