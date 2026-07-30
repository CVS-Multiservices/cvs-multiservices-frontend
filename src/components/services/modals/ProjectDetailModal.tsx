// components/services/modals/ProjectDetailModal.tsx

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { OngoingProject } from '../../../types';

// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (name: string | undefined): LucideIcon =>
  ((Icons as Record<string, unknown>)[name ?? ''] as LucideIcon) ??
  Icons.Settings;

// ─── Status helper ────────────────────────────────────────────────────────────
const isCompleted = (project: OngoingProject): boolean =>
  ((project as any).status ?? '').toString().toLowerCase() === 'completed';

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProjectDetailModalProps {
  project: OngoingProject | null;
  serviceColor: string;
  serviceTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProjectDetailModal({
  project,
  serviceColor,
  serviceTitle,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
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

  if (!project) return null;

  const IconComponent = getIcon(project.icon);
  const color = serviceColor;

  // ── Dynamic status theming ──
  const completed = isCompleted(project);
  const statusTheme = completed
    ? {
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)',
        color: '#34d399',
        label: 'Delivered',
        icon: Icons.CheckCircle2,
        pulse: false,
      }
    : {
        bg: 'rgba(251, 191, 36, 0.15)',
        border: 'rgba(251, 191, 36, 0.4)',
        color: '#fbbf24',
        label: 'In Progress',
        icon: Icons.Loader,
        pulse: true,
      };

  const StatusIcon = statusTheme.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={onClose}
          />

          {/* Scroll wrapper */}
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
                className="relative w-full max-w-3xl xl:max-w-4xl rounded-3xl overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #0d1528 0%, #080f1e 100%)',
                  border: `1px solid ${color}30`,
                  boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${color}10`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center
                             justify-center transition-all duration-300
                             hover:scale-110 hover:rotate-90"
                  style={{
                    background: 'rgba(8,15,30,0.8)',
                    border: `1px solid ${color}50`,
                    color,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Hero Image */}
                {project.image ? (
                  <div className="relative h-48 sm:h-72 xl:h-80">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom,
                          transparent 0%,
                          rgba(8,15,30,0.3) 40%,
                          rgba(8,15,30,0.8) 70%,
                          #080f1e 100%)`,
                      }}
                    />

                    {/* Service badge (top-left) */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                      <span
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full
                                   text-[9px] sm:text-xs font-bold uppercase tracking-wider
                                   flex items-center gap-1.5"
                        style={{
                          background: `${color}20`,
                          border: `1px solid ${color}50`,
                          color,
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: color }}
                        />
                        {serviceTitle}
                      </span>
                    </div>

                    {/* ── Dynamic Status badge (top-right, before close btn) ── */}
                    <div className="absolute top-4 right-14 sm:top-6 sm:right-20 z-10">
                      <span
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full
                                   text-[9px] sm:text-xs font-bold uppercase tracking-wider
                                   flex items-center gap-1.5"
                        style={{
                          background: statusTheme.bg,
                          border: `1px solid ${statusTheme.border}`,
                          color: statusTheme.color,
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <StatusIcon
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${statusTheme.pulse ? 'animate-spin' : ''}`}
                        />
                        {statusTheme.label}
                      </span>
                    </div>

                    {/* Title over image */}
                    <div className="absolute bottom-3 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center
                                     justify-center flex-shrink-0"
                          style={{
                            background: `${color}20`,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          <IconComponent
                            className="w-4 h-4 sm:w-6 sm:h-6"
                            style={{ color }}
                          />
                        </div>
                        {project.category && (
                          <span
                            className="text-[9px] sm:text-xs uppercase tracking-widest
                                       font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"
                            style={{
                              background: 'rgba(212,160,23,0.1)',
                              color: '#d4a017',
                              border: '1px solid rgba(212,160,23,0.3)',
                            }}
                          >
                            {project.category}
                          </span>
                        )}
                      </div>
                      <h2
                        className="font-playfair text-lg sm:text-2xl xl:text-3xl
                                   font-bold leading-tight"
                        style={{ color: '#fff' }}
                      >
                        {project.title}
                      </h2>
                    </div>
                  </div>
                ) : (
                  /* No image fallback */
                  <div className="px-4 sm:px-8 pt-8 pb-4">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center
                                   justify-center flex-shrink-0"
                        style={{
                          background: `${color}20`,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        <IconComponent
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color }}
                        />
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold
                                   uppercase tracking-wider"
                        style={{
                          background: `${color}20`,
                          border: `1px solid ${color}50`,
                          color,
                        }}
                      >
                        {serviceTitle}
                      </span>

                      {/* Status badge inline (no-image fallback) */}
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold
                                   uppercase tracking-wider flex items-center gap-1.5"
                        style={{
                          background: statusTheme.bg,
                          border: `1px solid ${statusTheme.border}`,
                          color: statusTheme.color,
                        }}
                      >
                        <StatusIcon
                          className={`w-3 h-3 ${statusTheme.pulse ? 'animate-spin' : ''}`}
                        />
                        {statusTheme.label}
                      </span>
                    </div>
                    <h2
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold"
                      style={{ color: '#fff' }}
                    >
                      {project.title}
                    </h2>
                  </div>
                )}

                {/* Body */}
                <div className="px-4 sm:px-8 py-5 sm:py-8">

                  {/* ── Status highlight banner (subtle, full-width) ── */}
                  <div
                    className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${statusTheme.bg}, ${statusTheme.bg.replace('0.15', '0.05')})`,
                      border: `1px solid ${statusTheme.border}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center
                                 justify-center flex-shrink-0"
                      style={{
                        background: statusTheme.bg,
                        border: `1px solid ${statusTheme.border}`,
                      }}
                    >
                      <StatusIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${statusTheme.pulse ? 'animate-spin' : ''}`}
                        style={{ color: statusTheme.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[9px] sm:text-xs uppercase tracking-wider font-semibold mb-0.5"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        Project Status
                      </div>
                      <div
                        className="text-sm sm:text-base font-bold"
                        style={{ color: statusTheme.color }}
                      >
                        {completed
                          ? 'Successfully Delivered'
                          : 'Currently In Progress'}
                      </div>
                    </div>
                  </div>

                  {/* Meta cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      {
                        icon: Icons.Building2,
                        label: 'Client',
                        value: project.client,
                      },
                      {
                        icon: Icons.MapPin,
                        label: 'Location',
                        value: project.location,
                      },
                      {
                        icon: Icons.Users,
                        label: 'Team Size',
                        value: project.teamSize
                          ? `${project.teamSize} Members`
                          : undefined,
                      },
                      {
                        icon: Icons.Tag,
                        label: 'Category',
                        value: project.category,
                      },
                    ]
                      .filter((item) => item.value)
                      .map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="p-2.5 sm:p-4 rounded-xl text-center"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${color}15`,
                          }}
                        >
                          <Icon
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-1.5"
                            style={{ color }}
                          />
                          <div
                            className="text-[9px] sm:text-xs mb-0.5"
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                          >
                            {label}
                          </div>
                          <div
                            className="text-[11px] sm:text-sm font-semibold truncate"
                            style={{ color: '#fff' }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Description */}
                  {project.description && (
                    <div className="mb-6 sm:mb-8">
                      <h3
                        className="font-rajdhani font-bold text-sm sm:text-lg mb-2 sm:mb-3
                                   flex items-center gap-2"
                        style={{ color: '#fff' }}
                      >
                        <div
                          className="w-5 sm:w-6 h-[2px] flex-shrink-0"
                          style={{ background: color }}
                        />
                        Project Overview
                      </h3>
                      <p
                        className="text-xs sm:text-sm xl:text-base leading-relaxed text-justify"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {project.description}
                      </p>
                    </div>
                  )}

                  {/* Highlights */}
                  {project.highlights.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h3
                        className="font-rajdhani font-bold text-sm sm:text-lg mb-3 sm:mb-4
                                   flex items-center gap-2"
                        style={{ color: '#fff' }}
                      >
                        <div
                          className="w-5 sm:w-6 h-[2px] flex-shrink-0"
                          style={{ background: color }}
                        />
                        Key Highlights
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {project.highlights.map((highlight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl"
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${color}12`,
                            }}
                          >
                            <div
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center
                                         justify-center flex-shrink-0 mt-0.5"
                              style={{
                                background: `${color}15`,
                                border: `1px solid ${color}30`,
                              }}
                            >
                              <Icons.Check
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                                style={{ color }}
                              />
                            </div>
                            <span
                              className="text-xs sm:text-sm leading-snug"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {highlight}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Client card */}
                  {project.client && (
                    <div
                      className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8
                                 flex items-center gap-3 sm:gap-4"
                      style={{
                        background: `linear-gradient(135deg, ${color}08, ${color}04)`,
                        border: `1px solid ${color}20`,
                      }}
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center
                                   justify-center flex-shrink-0"
                        style={{
                          background: `${color}15`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        <Icons.Building2
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color }}
                        />
                      </div>
                      <div>
                        <div
                          className="text-[9px] sm:text-xs uppercase tracking-wider mb-0.5"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          Client
                        </div>
                        <div
                          className="text-sm sm:text-lg font-semibold"
                          style={{ color: '#fff' }}
                        >
                          {project.client}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="w-full py-3 sm:py-4 rounded-xl flex items-center
                               justify-center gap-2 text-xs sm:text-base font-bold
                               transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      color: '#fff',
                      boxShadow: `0 8px 30px ${color}30`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 12px 40px ${color}50`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 8px 30px ${color}30`;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>
                      {completed
                        ? 'Discuss Similar Project'
                        : 'Discuss Similar Project'}
                    </span>
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