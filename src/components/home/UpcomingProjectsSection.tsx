import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { UpcomingProject } from '../../types';
import dataService from '../../services/dataService';

// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (iconName: string | undefined): LucideIcon => {
  if (!iconName) return Icons.Settings;
  return (Icons as any)[iconName] || Icons.Settings;
};

// ─── Upcoming Project Detail Modal ───────────────────────────────────────────
function UpcomingProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: UpcomingProject | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  const IconComponent = getIcon(project.icon);

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
            style={{ background: COLORS.modalBackdrop }}
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

                  {/* Title Area */}
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
                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      {
                        icon: Icons.MapPin,
                        label: 'Location',
                        value: project.location,
                      },
                      {
                        icon: Icons.Clock,
                        label: 'Duration',
                        value: project.estimatedDuration,
                      },
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
                        <div
                          className="text-[10px] sm:text-xs"
                          style={{ color: COLORS.textHalf }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-sm font-semibold truncate"
                          style={{ color: COLORS.white }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-6 sm:mb-8">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div
                        className="w-6 h-[2px]"
                        style={{ background: COLORS.accent }}
                      />
                      Project Overview
                    </h3>
                    <p
                      className="text-sm xl:text-base leading-relaxed"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6 sm:mb-8">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div
                        className="w-6 h-[2px]"
                        style={{ background: COLORS.accent }}
                      />
                      Key Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.highlights?.map((highlight, idx) => (
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

                  {/* Client */}
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
                    <div
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: COLORS.white }}
                    >
                      {project.client}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="btn-gold w-full py-3.5 sm:py-4 rounded-xl flex items-center
                               justify-center gap-2 text-sm sm:text-base font-bold"
                  >
                    <span>Express Interest in This Project</span>
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

// ─── Main Section ─────────────────────────────────────────────────────────────
export function UpcomingProjectsSection() {
  // ── API state ──
  const [projects, setProjects] = useState<UpcomingProject[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Modal state ──
  const [selectedProject, setSelectedProject] = useState<UpcomingProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await dataService.getUpcomingProjects();

        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setProjects(sorted);
        }
      } catch (err) {
        console.error('Upcoming projects API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ── Prevent render until loaded or empty ──
  if (loading || projects.length === 0) return null;

  const openModal = (project: UpcomingProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <UpcomingProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: COLORS.primary }}
      >
        {/* Background elements */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${COLORS.gridGold} 1px, transparent 1px),
                              linear-gradient(90deg, ${COLORS.gridGold} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
            transform: 'translate(50%, -50%)',
          }}
        />

        {/* ── Full-width responsive container ── */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Heading */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Icons.Rocket className="w-4 h-4" />
                Coming Soon
              </div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
                style={{ color: COLORS.white }}
              >
                Upcoming <span className="grad-gold">Projects</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: COLORS.textHalf }}
              >
                A glimpse into our future endeavors. Major projects in the
                pipeline across India and UAE.
              </p>
            </div>
          </AnimatedSection>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
            {projects.map((project, idx) => {
              const IconComponent = getIcon(project.icon);

              return (
                <AnimatedSection key={project._id} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => openModal(project)}
                    className="group cursor-pointer rounded-2xl overflow-hidden h-full flex flex-col relative"
                    style={{
                      background: COLORS.cardBgMedium,
                      border: `1px solid ${COLORS.borderLight}`,
                      boxShadow: COLORS.cardShadow,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = COLORS.goldBorderMedium;
                      el.style.boxShadow = COLORS.cardShadowHoverAlt;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = COLORS.borderLight;
                      el.style.boxShadow = COLORS.cardShadow;
                    }}
                  >
                    {/* "Coming Soon" Ribbon */}
                    <div
                      className="absolute top-4 -right-8 z-20 px-10 py-1 rotate-45"
                      style={{
                        background: COLORS.goldGradientDark,
                        boxShadow: COLORS.ribbonShadow,
                      }}
                    >
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: COLORS.white }}
                      >
                        Soon
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative h-40 xl:h-44 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.overlayMid}, transparent)`,
                        }}
                      />

                      {/* Icon Badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: COLORS.blackOverlay,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${COLORS.goldBorderStrong}`,
                          }}
                        >
                          <IconComponent
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            style={{ color: COLORS.accent }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <h3
                        className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl mb-1
                                   group-hover:text-yellow-300 transition-colors duration-300 line-clamp-2"
                        style={{ color: COLORS.white }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="text-xs mb-3"
                        style={{ color: COLORS.aboutGoldSoft }}
                      >
                        {project.client}
                      </p>

                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Icons.MapPin
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: COLORS.whiteMuted }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: COLORS.textHalf }}
                          >
                            {project.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icons.Clock
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: COLORS.whiteMuted }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: COLORS.textHalf }}
                          >
                            {project.estimatedDuration}
                          </span>
                        </div>
                      </div>

                      {/* CTA pushed to bottom */}
                      <div
                        className="mt-auto flex items-center gap-2 text-xs font-semibold"
                        style={{ color: COLORS.accent }}
                      >
                        <span>Learn More</span>
                        <Icons.ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Bottom Glow */}
                    <div
                      className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: COLORS.goldBlueGradient }}
                    />
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Bottom CTA banner */}
          <AnimatedSection>
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
    </>
  );
}