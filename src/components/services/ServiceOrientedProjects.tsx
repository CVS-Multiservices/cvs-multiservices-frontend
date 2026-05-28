// components/services/ServicesOrientedProjects.tsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { Feature, OngoingProject } from '../../types';
import { useAppData } from '../../App';
import {
  ProjectDetailModal,
  AllServiceProjectsModal,
} from './modals';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureWithProjects extends Feature {
  matchedProjects: OngoingProject[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_VISIBLE = 5;

// ─── Stopwords ────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'and', 'or', 'the', 'of', 'for', 'in', 'a', 'an', 'to',
  'with', 'from', 'by', 'on', 'at', 'is', 'are', 'was',
]);

// ─── Text helpers ─────────────────────────────────────────────────────────────
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()\/\\]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      normalize(text)
        .split(' ')
        .filter((w) => w.length > 2)
        .filter((w) => !STOPWORDS.has(w))
    )
  );
}

// ─── Build searchable text ────────────────────────────────────────────────────
function getFeatureSearchText(feature: Feature): string {
  return [
    feature.title,
    feature.shortDesc,
    ...(feature.subServices?.flatMap((sub) => [
      sub.title,
      sub.shortDesc,
      sub.fullDesc,
      ...(sub.features ?? []),
    ]) ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

function getProjectSearchText(project: OngoingProject): string {
  return [
    project.title,
    project.category,
    project.description,
    project.client,
    ...(project.highlights ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

// ─── Score calculator ─────────────────────────────────────────────────────────
function calculateMatchScore(
  project: OngoingProject,
  feature: Feature
): number {
  const projectText = normalize(getProjectSearchText(project));
  const featureText = normalize(getFeatureSearchText(feature));

  if (!projectText || !featureText) return 0;

  let score = 0;

  if (projectText.includes(featureText) || featureText.includes(projectText)) {
    score += 80;
  }

  const projectTokens = tokenize(projectText);
  const featureTokens = tokenize(featureText);

  if (projectTokens.length === 0 || featureTokens.length === 0) return score;

  const projectTokenSet = new Set(projectTokens);
  const exactMatches = featureTokens.filter((t) => projectTokenSet.has(t));
  score += exactMatches.length * 20;

  const exactMatchSet = new Set(exactMatches);
  const partialMatches = featureTokens.filter(
    (ft) =>
      !exactMatchSet.has(ft) &&
      projectTokens.some((pt) => pt.includes(ft) || ft.includes(pt))
  );
  score += partialMatches.length * 12;

  const subserviceTitleMatch =
    feature.subServices?.some((sub) => {
      const subTitle = normalize(sub.title ?? '');
      return subTitle.length > 3 && projectText.includes(subTitle);
    }) ?? false;

  if (subserviceTitleMatch) score += 35;

  const catNorm = normalize(project.category ?? '');
  const titleNorm = normalize(feature.title ?? '');
  if (catNorm && titleNorm) {
    if (catNorm.includes(titleNorm) || titleNorm.includes(catNorm)) {
      score += 50;
    }
    const catTokens = tokenize(project.category ?? '');
    const titleTokens = tokenize(feature.title ?? '');
    const catTitleOverlap = catTokens.filter((ct) =>
      titleTokens.some((tt) => ct.includes(tt) || tt.includes(ct))
    );
    score += catTitleOverlap.length * 15;
  }

  return score;
}

const MATCH_THRESHOLD = 10;

function findBestMatch(
  project: OngoingProject,
  features: Feature[]
): { feature: Feature; score: number } | null {
  let bestMatch: { feature: Feature; score: number } | null = null;

  for (const feature of features) {
    const score = calculateMatchScore(project, feature);
    if (score >= MATCH_THRESHOLD) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { feature, score };
      }
    }
  }

  return bestMatch;
}

// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (name: string | undefined): LucideIcon =>
  ((Icons as Record<string, unknown>)[name ?? ''] as LucideIcon) ??
  Icons.Settings;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
      style={{ background: '#080f1e' }}
    >
      {/* Dot grid — same as real section */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

        {/* ── Heading skeleton ── */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 animate-pulse">
          {/* Label pill */}
          <div
            className="inline-block h-7 w-36 rounded-full mb-4 sm:mb-6"
            style={{ background: 'rgba(212,160,23,0.08)' }}
          />
          {/* Title line 1 */}
          <div
            className="h-8 sm:h-10 xl:h-12 w-72 sm:w-96 xl:w-[480px] rounded-xl mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          {/* Divider */}
          <div
            className="h-[2px] w-16 sm:w-24 mx-auto mb-4 sm:mb-6 rounded"
            style={{ background: 'rgba(212,160,23,0.15)' }}
          />
          {/* Subtitle */}
          <div
            className="h-4 w-64 sm:w-80 rounded-lg mx-auto"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>

        {/* ── Feature block skeletons ── */}
        <div className="space-y-6 sm:space-y-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl xl:rounded-3xl overflow-hidden animate-pulse"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(212,160,23,0.08)',
              }}
            >
              {/* Header */}
              <div
                className="px-4 sm:px-8 py-3.5 sm:py-5 flex items-center gap-3 sm:gap-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(212,160,23,0.06)',
                }}
              >
                {/* Icon box */}
                <div
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                {/* Title + subtitle */}
                <div className="flex-1 space-y-2">
                  <div
                    className="h-4 sm:h-5 w-40 sm:w-56 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  />
                  <div
                    className="h-3 w-24 sm:w-32 rounded"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
                {/* Count badge */}
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>

              {/* ── Mobile skeleton rows ── */}
              <div className="block md:hidden p-3 space-y-3">
                {[1, 2].map((r) => (
                  <div
                    key={r}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Image placeholder */}
                    <div
                      className="h-36 w-full"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                    {/* Content */}
                    <div className="p-3.5 space-y-2">
                      <div
                        className="h-4 w-3/4 rounded"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      />
                      <div
                        className="h-3 w-1/2 rounded"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      />
                      <div
                        className="h-3 w-2/5 rounded"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop skeleton rows ── */}
              <div className="hidden md:block">
                {/* Table head */}
                <div
                  className="grid grid-cols-5 gap-4 px-5 sm:px-6 py-3"
                  style={{ borderBottom: '1px solid rgba(212,160,23,0.06)' }}
                >
                  {[
                    'w-16', 'w-14', 'w-16', 'w-10', 'w-20',
                  ].map((w, idx) => (
                    <div
                      key={idx}
                      className={`h-3 ${w} rounded`}
                      style={{ background: 'rgba(212,160,23,0.12)' }}
                    />
                  ))}
                </div>

                {/* Table rows */}
                {[1, 2, 3].map((r) => (
                  <div
                    key={r}
                    className="grid grid-cols-5 gap-4 items-center px-5 sm:px-6 py-4 sm:py-5"
                    style={{
                      borderBottom:
                        r < 3
                          ? '1px solid rgba(255,255,255,0.03)'
                          : 'none',
                    }}
                  >
                    {/* Project col — thumbnail + text */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      />
                      <div
                        className="h-4 w-28 rounded"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      />
                    </div>
                    {/* Client */}
                    <div
                      className="h-3 w-24 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                    {/* Location */}
                    <div
                      className="h-3 w-20 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                    {/* Team */}
                    <div
                      className="h-3 w-10 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                    {/* Highlights */}
                    <div className="flex gap-1.5">
                      <div
                        className="h-5 w-14 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      />
                      <div
                        className="h-5 w-14 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA skeleton ── */}
        <div className="mt-10 sm:mt-14 lg:mt-16 flex justify-center animate-pulse">
          <div
            className="h-11 sm:h-14 w-64 sm:w-80 rounded-xl sm:rounded-2xl"
            style={{ background: 'rgba(212,160,23,0.08)' }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Mobile Project Card ──────────────────────────────────────────────────────
function MobileProjectCard({
  project,
  color,
  onClick,
}: {
  project: OngoingProject;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden active:opacity-90"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}18`,
      }}
    >
      {project.image && (
        <div className="relative h-36">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #080f1e, rgba(8,15,30,0.4), transparent)',
            }}
          />
          {project.teamSize && (
            <div className="absolute top-2.5 right-2.5">
              <span
                className="px-2 py-0.5 rounded-full text-[8px] font-bold
                           flex items-center gap-1"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${color}40`,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <Icons.Users className="w-2.5 h-2.5" style={{ color }} />
                {project.teamSize}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-3.5">
        <h4
          className="font-rajdhani font-bold text-sm leading-snug mb-1.5 line-clamp-2"
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
        {project.location && (
          <div
            className="flex items-center gap-1.5 text-[11px] mb-3"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <Icons.MapPin
              className="w-3 h-3 flex-shrink-0"
              style={{ color }}
            />
            <span className="truncate">{project.location}</span>
          </div>
        )}
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
          <Icons.ChevronRight className="w-3 h-3" />
        </div>
      </div>

      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: 0.3,
        }}
      />
    </motion.div>
  );
}

// ─── View More Button ─────────────────────────────────────────────────────────
function ViewMoreButton({
  remaining,
  color,
  onClick,
}: {
  remaining: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full py-3 sm:py-3.5 rounded-xl flex items-center justify-center
                 gap-2.5 text-xs sm:text-sm font-semibold transition-all duration-300"
      style={{
        background: `${color}08`,
        border: `1px dashed ${color}35`,
        color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}15`;
        e.currentTarget.style.borderColor = `${color}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${color}08`;
        e.currentTarget.style.borderColor = `${color}35`;
      }}
    >
      <Icons.LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span>
        View {remaining} More Project{remaining !== 1 ? 's' : ''}
      </span>
      <Icons.ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </motion.button>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ServicesOrientedProjects() {
  const appData = useAppData();

  // ── Derive matched data from global context (zero extra API calls) ──────────
  const featuresWithProjects = useMemo<FeatureWithProjects[]>(() => {
    const features = appData?.features;
    const projects = appData?.ongoingProjects;

    if (!features?.length || !projects?.length) return [];

    const sortedFeatures = [...features].sort(
      (a, b) => (a.index ?? 0) - (b.index ?? 0)
    );

    const featureProjectMap = new Map<string, OngoingProject[]>();
    for (const feature of sortedFeatures) {
      featureProjectMap.set(feature._id, []);
    }

    for (const project of projects) {
      const best = findBestMatch(project, sortedFeatures);
      if (best) {
        const existing = featureProjectMap.get(best.feature._id) ?? [];
        existing.push(project);
        featureProjectMap.set(best.feature._id, existing);
      }
    }

    return sortedFeatures
      .map((feature) => ({
        ...feature,
        matchedProjects: featureProjectMap.get(feature._id) ?? [],
      }))
      .filter((f) => f.matchedProjects.length > 0);
  }, [appData?.features, appData?.ongoingProjects]);

  // ── Project detail modal state ─────────────────────────────────────────────
  const [selectedProject, setSelectedProject] =
    useState<OngoingProject | null>(null);
  const [selectedColor, setSelectedColor] = useState('#d4a017');
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ── All-projects-per-service modal state ───────────────────────────────────
  const [allProjectsData, setAllProjectsData] = useState<{
    projects: OngoingProject[];
    color: string;
    serviceTitle: string;
  } | null>(null);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const openDetailModal = (
    project: OngoingProject,
    color: string,
    serviceTitle: string
  ) => {
    setSelectedProject(project);
    setSelectedColor(color);
    setSelectedServiceTitle(serviceTitle);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
      setSelectedColor('#d4a017');
      setSelectedServiceTitle('');
    }, 300);
  };

  const openAllModal = (
    projects: OngoingProject[],
    color: string,
    serviceTitle: string
  ) => {
    setAllProjectsData({ projects, color, serviceTitle });
    setIsAllModalOpen(true);
  };

  const closeAllModal = () => {
    setIsAllModalOpen(false);
    setTimeout(() => setAllProjectsData(null), 300);
  };

  // ── Show skeleton while appData not yet available ──────────────────────────
  if (!appData) return <Skeleton />;

  // ── No matched features at all — render nothing ────────────────────────────
  if (!featuresWithProjects.length) return null;

  return (
    <>
      {/* ── Modals ── */}
      <ProjectDetailModal
        project={selectedProject}
        serviceColor={selectedColor}
        serviceTitle={selectedServiceTitle}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />

      {allProjectsData && (
        <AllServiceProjectsModal
          isOpen={isAllModalOpen}
          onClose={closeAllModal}
          projects={allProjectsData.projects}
          color={allProjectsData.color}
          serviceTitle={allProjectsData.serviceTitle}
          onSelectProject={(project) => {
            openDetailModal(
              project,
              allProjectsData.color,
              allProjectsData.serviceTitle
            );
          }}
        />
      )}

      <section
        className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
        style={{ background: '#080f1e' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* ── Heading ── */}
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-14 lg:mb-20">
              <div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2
                           rounded-full text-[10px] sm:text-xs font-bold uppercase
                           tracking-widest mb-4 sm:mb-6"
                style={{
                  background: 'rgba(212,160,23,0.08)',
                  border: '1px solid rgba(212,160,23,0.25)',
                  color: '#d4a017',
                }}
              >
                <Icons.FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Project Portfolio
              </div>

              <h2
                className="font-playfair text-2xl sm:text-3xl md:text-4xl xl:text-5xl
                           font-bold mb-3 sm:mb-4"
                style={{ color: COLORS.white }}
              >
                Service Oriented{' '}
                <span className="grad-gold">Project Showcase</span>
              </h2>

              <div
                className="w-16 sm:w-24 h-[2px] mx-auto mb-4 sm:mb-6"
                style={{
                  background:
                    'linear-gradient(to right, transparent, #d4a017, transparent)',
                }}
              />

              <p
                className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
                style={{ color: COLORS.textHalf }}
              >
                Our projects reflect expertise across multiple service
                verticals, providing end-to-end solutions that ensure
                efficiency, safety, and long-term value.
              </p>
            </div>
          </AnimatedSection>

          {/* ── Feature blocks ── */}
          <div className="space-y-6 sm:space-y-10 xl:space-y-12">
            {featuresWithProjects.map((feature, sIdx) => {
              const IconComponent = getIcon(feature.icon);
              const color = feature.color ?? '#d4a017';
              const visibleProjects = feature.matchedProjects.slice(
                0,
                MAX_VISIBLE
              );
              const remaining =
                feature.matchedProjects.length - MAX_VISIBLE;
              const hasMore = remaining > 0;

              return (
                <AnimatedSection key={feature._id} delay={sIdx * 0.1}>
                  <div
                    className="rounded-xl sm:rounded-2xl xl:rounded-3xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(212,160,23,0.12)',
                    }}
                  >
                    {/* ── Service header ── */}
                    <div
                      className="px-4 sm:px-8 py-3.5 sm:py-5 flex items-center gap-3 sm:gap-4"
                      style={{
                        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                        borderBottom: '1px solid rgba(212,160,23,0.1)',
                      }}
                    >
                      <div
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl
                                   flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${color}20`,
                          border: `1px solid ${color}50`,
                        }}
                      >
                        <IconComponent
                          className="w-4 h-4 sm:w-6 sm:h-6"
                          style={{ color }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-rajdhani font-bold text-base sm:text-xl
                                     xl:text-2xl truncate"
                          style={{ color: COLORS.white }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-[11px] sm:text-sm mt-0.5"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {`${feature.matchedProjects.length} project${feature.matchedProjects.length > 1 ? 's' : ''
                            }`}
                        </p>
                      </div>

                      <div
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full
                                   flex items-center justify-center font-bold text-xs sm:text-sm"
                        style={{
                          background: `${color}25`,
                          border: `1px solid ${color}60`,
                          color,
                        }}
                      >
                        {feature.matchedProjects.length}
                      </div>
                    </div>

                    {/* ═══ MOBILE: Card layout (< md) ═══ */}
                    <div className="block md:hidden p-3 space-y-3">
                      {visibleProjects.map((project) => (
                        <MobileProjectCard
                          key={project._id}
                          project={project}
                          color={color}
                          onClick={() =>
                            openDetailModal(
                              project,
                              color,
                              feature.title ?? 'Service'
                            )
                          }
                        />
                      ))}
                      {hasMore && (
                        <div className="pt-1">
                          <ViewMoreButton
                            remaining={remaining}
                            color={color}
                            onClick={() =>
                              openAllModal(
                                feature.matchedProjects,
                                color,
                                feature.title ?? 'Service'
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* ═══ DESKTOP: Table layout (≥ md) ═══ */}
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                          <colgroup>
                            <col style={{ width: '35%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '9%' }} />
                            <col style={{ width: '24%' }} />
                          </colgroup>
                          <thead>
                            <tr
                              style={{
                                borderBottom:
                                  '1px solid rgba(212,160,23,0.08)',
                              }}
                            >
                              {[
                                'Project',
                                'Client',
                                'Location',
                                'Team',
                                'Highlights',
                              ].map((col) => (
                                <th
                                  key={col}
                                  className="px-5 sm:px-6 py-3 text-left text-[11px]
                                             uppercase tracking-widest font-semibold"
                                  style={{ color: 'rgba(212,160,23,0.6)' }}
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {visibleProjects.map((project, pIdx) => (
                              <motion.tr
                                key={project._id}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: pIdx * 0.08 }}
                                className="group cursor-pointer transition-colors duration-200"
                                style={{
                                  borderBottom:
                                    pIdx < visibleProjects.length - 1
                                      ? '1px solid rgba(255,255,255,0.04)'
                                      : 'none',
                                }}
                                onClick={() =>
                                  openDetailModal(
                                    project,
                                    color,
                                    feature.title ?? 'Service'
                                  )
                                }
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${color}08`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    'transparent';
                                }}
                              >
                                {/* Project col */}
                                <td className="px-5 sm:px-6 py-4 sm:py-5">
                                  <div className="flex items-center gap-3">
                                    {project.image && (
                                      <div
                                        className="w-10 h-10 rounded-lg overflow-hidden
                                                   flex-shrink-0 border transition-all
                                                   duration-300 group-hover:scale-110"
                                        style={{
                                          borderColor: `${color}30`,
                                        }}
                                      >
                                        <img
                                          src={project.image}
                                          alt=""
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                    <p
                                      className="font-rajdhani font-bold text-sm sm:text-base
                                                 leading-snug line-clamp-2
                                                 group-hover:underline underline-offset-2
                                                 decoration-1"
                                      style={{
                                        color: COLORS.white,
                                        textDecorationColor: `${color}60`,
                                      }}
                                    >
                                      {project.title}
                                    </p>
                                  </div>
                                </td>

                                {/* Client col */}
                                <td className="px-5 sm:px-6 py-4 sm:py-5">
                                  <p
                                    className="text-xs sm:text-sm line-clamp-2 leading-snug"
                                    style={{ color: 'rgba(212,160,23,0.75)' }}
                                  >
                                    {project.client ?? '—'}
                                  </p>
                                </td>

                                {/* Location col */}
                                <td className="px-5 sm:px-6 py-4 sm:py-5">
                                  <span
                                    className="flex items-center gap-1.5 text-xs sm:text-sm
                                               whitespace-nowrap"
                                    style={{ color: 'rgba(255,255,255,0.5)' }}
                                  >
                                    <Icons.MapPin
                                      className="w-3.5 h-3.5 flex-shrink-0"
                                      style={{ color }}
                                    />
                                    {project.location ?? '—'}
                                  </span>
                                </td>

                                {/* Team col */}
                                <td className="px-5 sm:px-6 py-4 sm:py-5">
                                  <span
                                    className="flex items-center gap-1.5 text-xs sm:text-sm
                                               whitespace-nowrap"
                                    style={{ color: 'rgba(255,255,255,0.5)' }}
                                  >
                                    <Icons.Users
                                      className="w-3.5 h-3.5 flex-shrink-0"
                                      style={{ color }}
                                    />
                                    {project.teamSize ?? '—'}
                                  </span>
                                </td>

                                {/* Highlights col */}
                                <td className="px-5 sm:px-6 py-4 sm:py-5">
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {project.highlights
                                      .slice(0, 2)
                                      .map((h) => (
                                        <span
                                          key={h}
                                          className="px-2 py-0.5 rounded-full
                                                     text-[10px] sm:text-xs font-medium
                                                     truncate max-w-[90px]"
                                          style={{
                                            background: `${color}15`,
                                            border: `1px solid ${color}35`,
                                            color,
                                          }}
                                        >
                                          {h}
                                        </span>
                                      ))}
                                    {project.highlights.length > 2 && (
                                      <span
                                        className="px-2 py-0.5 rounded-full
                                                   text-[10px] sm:text-xs font-medium"
                                        style={{
                                          background: 'rgba(255,255,255,0.05)',
                                          border:
                                            '1px solid rgba(255,255,255,0.1)',
                                          color: 'rgba(255,255,255,0.4)',
                                        }}
                                      >
                                        +{project.highlights.length - 2}
                                      </span>
                                    )}
                                    <Icons.ExternalLink
                                      className="w-3.5 h-3.5 ml-1 opacity-0
                                                 group-hover:opacity-100
                                                 transition-opacity duration-300"
                                      style={{ color }}
                                    />
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Desktop View More */}
                      {hasMore && (
                        <div
                          className="px-5 sm:px-6 py-4"
                          style={{
                            borderTop:
                              '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <ViewMoreButton
                            remaining={remaining}
                            color={color}
                            onClick={() =>
                              openAllModal(
                                feature.matchedProjects,
                                color,
                                feature.title ?? 'Service'
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* ── CTA ── */}
          <AnimatedSection delay={0.4}>
            <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
              <Link
                to="/contact"
                className="btn-gold inline-flex items-center gap-2 sm:gap-3
                           px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl
                           text-xs sm:text-base font-bold"
              >
                <Icons.Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Discuss Your Project Requirements</span>
                <Icons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}