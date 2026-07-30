// components/services/modals/AllServiceProjectsModal.tsx

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { OngoingProject } from '../../../types';

// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (name: string | undefined): LucideIcon =>
  ((Icons as Record<string, unknown>)[name ?? ''] as LucideIcon) ??
  Icons.Settings;

// ─── Status helpers ───────────────────────────────────────────────────────────
const isCompleted = (project: OngoingProject): boolean =>
  ((project as any).status ?? '').toString().toLowerCase() === 'completed';

type StatusFilter = 'all' | 'ongoing' | 'completed';

// ─── Status Badge (reusable) ──────────────────────────────────────────────────
function StatusBadge({ project }: { project: OngoingProject }) {
  const completed = isCompleted(project);

  const theme = completed
    ? {
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)',
        color: '#34d399',
        label: 'Delivered',
        Icon: Icons.CheckCircle2,
        spin: false,
      }
    : {
        bg: 'rgba(251, 191, 36, 0.15)',
        border: 'rgba(251, 191, 36, 0.4)',
        color: '#fbbf24',
        label: 'Live',
        Icon: Icons.Loader,
        spin: true,
      };

  const IconEl = theme.Icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px]
                 font-bold uppercase tracking-wider whitespace-nowrap"
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        color: theme.color,
        backdropFilter: 'blur(8px)',
      }}
    >
      <IconEl className={`w-2.5 h-2.5 ${theme.spin ? 'animate-spin' : ''}`} />
      {theme.label}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AllServiceProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: OngoingProject[];
  color: string;
  serviceTitle: string;
  onSelectProject: (project: OngoingProject) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AllServiceProjectsModal({
  isOpen,
  onClose,
  projects,
  color,
  serviceTitle,
  onSelectProject,
}: AllServiceProjectsModalProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Lock body scroll
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

  // Reset filter each time modal opens
  useEffect(() => {
    if (isOpen) setStatusFilter('all');
  }, [isOpen]);

  // Count breakdown
  const counts = useMemo(() => {
    const completed = projects.filter(isCompleted).length;
    return {
      all: projects.length,
      ongoing: projects.length - completed,
      completed,
    };
  }, [projects]);

  // Filtered + sorted (ongoing first when 'all')
  const filteredProjects = useMemo(() => {
    let list = projects;
    if (statusFilter === 'ongoing') list = projects.filter((p) => !isCompleted(p));
    else if (statusFilter === 'completed') list = projects.filter(isCompleted);

    return [...list].sort((a, b) => {
      const aDone = isCompleted(a);
      const bDone = isCompleted(b);
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1;
    });
  }, [projects, statusFilter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-3 sm:inset-6 xl:inset-10 z-[9999]
                       overflow-y-auto rounded-2xl sm:rounded-3xl"
            style={{
              background: 'linear-gradient(180deg, #0d1528 0%, #080f1e 100%)',
              border: `1px solid ${color}25`,
              boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${color}08`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div
              className="sticky top-0 z-10 px-4 sm:px-8 py-4 sm:py-5
                         rounded-t-2xl sm:rounded-t-3xl"
              style={{
                background: 'rgba(13,21,40,0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${color}15`,
              }}
            >
              {/* Top row: title + close */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  {/* Service pill */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold
                                 uppercase tracking-widest"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}35`,
                        color,
                      }}
                    >
                      {serviceTitle}
                    </span>
                  </div>
                  <h2
                    className="font-playfair text-lg sm:text-2xl xl:text-3xl font-bold"
                    style={{ color: '#fff' }}
                  >
                    All <span style={{ color }}>Projects</span>
                  </h2>
                  <p
                    className="text-xs sm:text-sm mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Showing {filteredProjects.length} of {projects.length} project
                    {projects.length !== 1 ? 's' : ''} in this vertical
                  </p>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center
                             justify-center transition-all duration-300
                             hover:scale-110 hover:rotate-90 flex-shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${color}40`,
                    color,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* ── Status filter chips ── */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold hidden sm:inline"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Filter:
                </span>

                {[
                  {
                    key: 'all' as StatusFilter,
                    label: 'All',
                    count: counts.all,
                    themeColor: color,
                    Icon: Icons.LayoutGrid,
                    spin: false,
                  },
                  {
                    key: 'ongoing' as StatusFilter,
                    label: 'Live',
                    count: counts.ongoing,
                    themeColor: '#fbbf24',
                    Icon: Icons.Loader,
                    spin: true,
                  },
                  {
                    key: 'completed' as StatusFilter,
                    label: 'Delivered',
                    count: counts.completed,
                    themeColor: '#34d399',
                    Icon: Icons.CheckCircle2,
                    spin: false,
                  },
                ].map(({ key, label, count, themeColor, Icon, spin }) => {
                  const active = statusFilter === key;
                  const disabled = count === 0;

                  return (
                    <button
                      key={key}
                      disabled={disabled}
                      onClick={() => setStatusFilter(key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                  text-[10px] sm:text-xs font-semibold uppercase tracking-wider
                                  transition-all duration-200
                                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                      style={{
                        background: active ? `${themeColor}25` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? themeColor : 'rgba(255,255,255,0.1)'}`,
                        color: active ? themeColor : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Icon
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${spin && active ? 'animate-spin' : ''}`}
                      />
                      {label}
                      <span
                        className="ml-0.5 px-1.5 rounded-full text-[9px] font-bold"
                        style={{
                          background: active
                            ? `${themeColor}30`
                            : 'rgba(255,255,255,0.06)',
                          color: active ? themeColor : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 xl:p-8">
              {filteredProjects.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${color}20`,
                    }}
                  >
                    <Icons.SearchX className="w-6 h-6 sm:w-7 sm:h-7" style={{ color }} />
                  </div>
                  <p className="text-sm sm:text-base font-semibold mb-1" style={{ color: '#fff' }}>
                    No projects match this filter
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Try selecting a different status.
                  </p>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}40`,
                      color,
                    }}
                  >
                    Show All Projects
                  </button>
                </div>
              ) : (
                // Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProjects.map((project, idx) => {
                    const ProjIcon = getIcon(project.icon);

                    return (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                        whileHover={{ y: -6 }}
                        onClick={() => {
                          onClose();
                          setTimeout(() => onSelectProject(project), 350);
                        }}
                        className="group cursor-pointer rounded-2xl overflow-hidden"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${color}18`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${color}45`;
                          e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${color}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${color}18`;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Image */}
                        {project.image && (
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover
                                         transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(to top, #080f1e,
                                  rgba(8,15,30,0.3), transparent)`,
                              }}
                            />

                            {/* ── Dynamic Status badge ── */}
                            <div className="absolute top-2.5 left-2.5">
                              <StatusBadge project={project} />
                            </div>

                            {/* Icon badge */}
                            <div className="absolute top-2.5 right-2.5">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                  background: 'rgba(0,0,0,0.5)',
                                  backdropFilter: 'blur(8px)',
                                  border: `1px solid ${color}40`,
                                }}
                              >
                                <ProjIcon className="w-3.5 h-3.5" style={{ color }} />
                              </div>
                            </div>

                            {/* Hover overlay */}
                            <div
                              className="absolute inset-0 flex items-center justify-center
                                         opacity-0 group-hover:opacity-100
                                         transition-opacity duration-300"
                              style={{ background: 'rgba(0,0,0,0.35)' }}
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `${color}20`,
                                  border: `2px solid ${color}`,
                                }}
                              >
                                <Icons.Eye className="w-4 h-4" style={{ color }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-3.5 sm:p-4">
                          {/* If NO image, show status inline at top of content */}
                          {!project.image && (
                            <div className="mb-2">
                              <StatusBadge project={project} />
                            </div>
                          )}

                          <h4
                            className="font-rajdhani font-bold text-sm sm:text-base
                                       leading-snug mb-1.5 line-clamp-2
                                       group-hover:text-yellow-300
                                       transition-colors duration-300"
                            style={{ color: '#fff' }}
                          >
                            {project.title}
                          </h4>

                          {project.client && (
                            <p
                              className="text-[11px] mb-2.5 line-clamp-1"
                              style={{ color: 'rgba(212,160,23,0.7)' }}
                            >
                              {project.client}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.location && (
                              <span
                                className="flex items-center gap-1 text-[11px]"
                                style={{ color: 'rgba(255,255,255,0.45)' }}
                              >
                                <Icons.MapPin
                                  className="w-3 h-3 flex-shrink-0"
                                  style={{ color }}
                                />
                                <span className="truncate max-w-[100px]">
                                  {project.location}
                                </span>
                              </span>
                            )}
                            {project.teamSize && (
                              <span
                                className="flex items-center gap-1 text-[11px]"
                                style={{ color: 'rgba(255,255,255,0.45)' }}
                              >
                                <Icons.Users
                                  className="w-3 h-3 flex-shrink-0"
                                  style={{ color }}
                                />
                                {project.teamSize} Team
                              </span>
                            )}
                          </div>

                          {project.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.highlights.slice(0, 2).map((h) => (
                                <span
                                  key={h}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                                  style={{
                                    background: `${color}12`,
                                    border: `1px solid ${color}25`,
                                    color,
                                  }}
                                >
                                  {h}
                                </span>
                              ))}
                              {project.highlights.length > 2 && (
                                <span
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                                  style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.35)',
                                  }}
                                >
                                  +{project.highlights.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          <div
                            className="flex items-center gap-1 text-[11px] font-semibold"
                            style={{ color }}
                          >
                            <span>View Details</span>
                            <Icons.ChevronRight
                              className="w-3 h-3 transition-transform
                                         duration-300 group-hover:translate-x-1"
                            />
                          </div>
                        </div>

                        {/* Bottom glow bar */}
                        <div
                          className="h-[2px] scale-x-0 group-hover:scale-x-100
                                     transition-transform duration-500 origin-left"
                          style={{
                            background: `linear-gradient(to right,
                              transparent, ${color}, transparent)`,
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}