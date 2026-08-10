import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { TeamMember } from '../../types';
import dataService from '../../services/dataService';

interface RoleGroup {
  key: string;
  title: string;
  role: string;
  members: TeamMember[];
}

// ─── Executive role detection ─────────────────────────────────
const EXECUTIVE_KEYWORDS = [
  'ceo',
  'chief executive',
  'managing director',
  'director',
  'cfo',
  'chief financial',
  'coo',
  'chief operating',
  'chairman',
  'founder',
  'president',
];

const isExecutiveRole = (role: string) => {
  const r = role.toLowerCase();
  return EXECUTIVE_KEYWORDS.some((kw) => r.includes(kw));
};

const executiveRank = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('chairman') || r.includes('founder')) return 1;
  if (r.includes('president')) return 2;
  if (r.includes('director')) return 3;
  if (r.includes('ceo') || r.includes('chief executive')) return 4;
  if (r.includes('cfo') || r.includes('chief financial')) return 5;
  if (r.includes('coo') || r.includes('chief operating')) return 6;
  if (r.includes('managing director')) return 7;
  return 99;
};

const pluralize = (role: string) => {
  const r = role.trim();
  if (r.toLowerCase().endsWith('s')) return r;
  if (r.toLowerCase().endsWith('y')) return r.slice(0, -1) + 'ies';
  return r + 's';
};

const buildGroupTitle = (role: string, count: number) => {
  if (count === 1) return role;
  if (
    /(head|manager|executive|lead|officer|specialist|associate|coordinator)$/i.test(
      role
    )
  ) {
    return pluralize(role);
  }
  return `${role} Team`;
};

// ─── BDA detection (for sorting BDA group to top) ─────────────
const isBDARole = (role: string) => {
  const r = role.toLowerCase();
  return (
    r.includes('bda') ||
    r.includes('business development') ||
    r.includes('business dev')
  );
};

// ─── Role merging groups ──────────────────────────────────────
const ROLE_MERGE_GROUPS: {
  key: string;
  label: string;
  keywords: string[];
}[] = [
  {
    key: 'accountants',
    label: 'Finance & Accounts Executive',
    keywords: ['accountant'],
  },
  {
    key: 'purchase',
    label: 'Purchase Department',
    keywords: ['purchase'],
  },
  {
    key: 'hr',
    label: 'HR Department',
    keywords: ['human resource', 'hr '],
  },
  {
    key: 'it',
    label: 'IT Department',
    keywords: [
      'it ',
      'information technology',
      'software',
      'developer',
      'engineer',
    ],
  },
  {
    key: 'sales',
    label: 'Sales Team',
    keywords: ['sales'],
  },
  {
    key: 'marketing',
    label: 'Marketing Team',
    keywords: ['marketing'],
  },
  {
    key: 'logistics',
    label: 'Logistics Team',
    keywords: ['logistics', 'supply chain', 'warehouse'],
  },
  {
    key: 'admin',
    label: 'Administration',
    keywords: ['admin', 'administration'],
  },
  {
    key: 'finance',
    label: 'Finance Department',
    keywords: ['finance', 'financial'],
  },
  {
    key: 'operations',
    label: 'Operations Team',
    keywords: ['operation'],
  },
];

const findMergeGroup = (role: string) => {
  const r = role.toLowerCase();
  return (
    ROLE_MERGE_GROUPS.find((g) => g.keywords.some((kw) => r.includes(kw))) ??
    null
  );
};

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // ─── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await dataService.getTeam();
        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setTeam(sorted);
        }
      } catch (err) {
        console.error('Team API error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // ─── Deep link ─────────────────────────────────────────────
  useEffect(() => {
    if (!loading && team.length > 0 && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [loading, team, location.hash]);

  // ─── Modal: Escape key + body scroll lock ─────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  // ─── Dynamic role-based grouping with merging ─────────────
  const { executives, groups } = useMemo(() => {
    const execs: TeamMember[] = [];
    const nonExecs: TeamMember[] = [];

    team.forEach((m) => {
      if (isExecutiveRole(m.role)) execs.push(m);
      else nonExecs.push(m);
    });

    execs.sort((a, b) => executiveRank(a.role) - executiveRank(b.role));

    // ── Two maps: merged groups and exact-role groups ──────
    const mergedMap = new Map<
      string,
      { key: string; label: string; members: TeamMember[] }
    >();
    const exactMap = new Map<string, TeamMember[]>();

    nonExecs.forEach((m) => {
      const merge = findMergeGroup(m.role);
      if (merge) {
        if (!mergedMap.has(merge.key)) {
          mergedMap.set(merge.key, {
            key: merge.key,
            label: merge.label,
            members: [],
          });
        }
        mergedMap.get(merge.key)!.members.push(m);
      } else {
        const key = m.role.trim();
        if (!exactMap.has(key)) exactMap.set(key, []);
        exactMap.get(key)!.push(m);
      }
    });

    // ── Build RoleGroup[] from merged map ─────────────────
    const mergedGroups: RoleGroup[] = Array.from(mergedMap.values()).map(
      ({ key, label, members }) => ({
        key,
        role: label,
        title: label,
        members,
      })
    );

    // ── Build RoleGroup[] from exact-role map ─────────────
    const exactGroups: RoleGroup[] = Array.from(exactMap.entries()).map(
      ([role, members]) => ({
        key: role.toLowerCase().replace(/\s+/g, '-'),
        role,
        title: buildGroupTitle(role, members.length),
        members,
      })
    );

    // ── Combine and sort (BDA first, then alphabetical) ───
    const built: RoleGroup[] = [...mergedGroups, ...exactGroups].sort(
      (a, b) => {
        const aIsBDA = isBDARole(a.role);
        const bIsBDA = isBDARole(b.role);
        if (aIsBDA && !bIsBDA) return -1;
        if (!aIsBDA && bIsBDA) return 1;
        return a.role.localeCompare(b.role);
      }
    );

    return { executives: execs, groups: built };
  }, [team]);

  if (loading || team.length === 0) return null;

  // ─── Zoom icon overlay (shown on hover) ───────────────────
  const ZoomBadge = () => (
    <div
      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
      style={{
        background: 'rgba(0,0,0,0.55)',
        borderColor: COLORS.goldBorderStrong,
        color: COLORS.accent,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </div>
  );

  // ─── EXECUTIVE CARD ───────────────────────────────────────
  const ExecutiveCard = ({
    member,
    index,
  }: {
    member: TeamMember;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      id={member.name.toLowerCase().replace(/\s+/g, '-')}
      className="group relative cursor-pointer"
      onClick={() => setSelectedMember(member)}
    >
      <div
        className="relative rounded-md overflow-hidden border transition-all duration-500 group-hover:shadow-2xl"
        style={{
          borderColor: COLORS.goldBorderStrong,
          background: COLORS.cardBgMedium,
          boxShadow: '0 16px 44px rgba(0,0,0,0.45)',
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%)`,
            }}
          />
          <ZoomBadge />
        </div>

        <div
          className="relative px-5 sm:px-6 py-6 text-center border-t"
          style={{
            borderColor: COLORS.goldBorderStrong,
            background: COLORS.darkAlt,
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px]"
            style={{ background: COLORS.accent }}
          />
          <h3
            className="font-playfair font-bold text-lg sm:text-xl lg:text-[22px] leading-tight tracking-wide"
            style={{ color: COLORS.white }}
          >
            {member.name}
          </h3>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span
              className="h-px w-5"
              style={{ background: COLORS.goldBorderStrong }}
            />
            <p
              className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] whitespace-nowrap"
              style={{ color: COLORS.accent }}
            >
              {member.role}
            </p>
            <span
              className="h-px w-5"
              style={{ background: COLORS.goldBorderStrong }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ─── LIST ITEM ROW ────────────────────────────────────────
  const MemberListItem = ({
    member,
    index,
  }: {
    member: TeamMember;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: Math.min(index * 0.03, 0.3),
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      id={member.name.toLowerCase().replace(/\s+/g, '-')}
      onClick={() => setSelectedMember(member)}
      className="group flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3
                 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = `${COLORS.accent}08`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'transparent';
      }}
    >
      {/* Small avatar */}
      <div
        className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        style={{
          borderColor: COLORS.dividerGold,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = COLORS.accent;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            COLORS.dividerGold;
        }}
      >
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <h5
          className="font-rajdhani font-bold text-sm sm:text-base leading-tight truncate transition-colors duration-200"
          style={{ color: COLORS.white }}
          title={member.name}
        >
          {member.name}
        </h5>
        <p
          className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] mt-0.5 truncate"
          style={{ color: COLORS.textHalf }}
          title={member.role}
        >
          {member.role}
        </p>
      </div>

      {/* View arrow */}
      <div
        className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5"
        style={{
          background: `${COLORS.accent}15`,
          border: `1px solid ${COLORS.accent}30`,
          color: COLORS.accent,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </motion.div>
  );

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <section
      id="team"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.darkAlt }}
    >
      {/* Background decorations */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        {/* ── Section Heading ── */}
        <AnimatedSection>
          <div className="text-center mb-14 lg:mb-20">
            <div className="section-label mx-auto w-fit mb-4">
              Our Organization
            </div>
            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
              style={{ color: COLORS.white }}
            >
              Meet Our <span className="grad-gold">Team</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mb-6" />
            <p
              className="text-base sm:text-lg xl:text-xl max-w-3xl mx-auto"
              style={{ color: COLORS.textHalf }}
            >
              Led by visionary executives and supported by dedicated
              professionals across every function.
            </p>
          </div>
        </AnimatedSection>

        {/* ── Executive Board ── */}
        {executives.length > 0 && (
          <div className="max-w-7xl mx-auto mb-20 lg:mb-28">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-10 lg:mb-14">
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${COLORS.goldBorderStrong})`,
                  }}
                />
                <h3
                  className="font-playfair font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-[0.28em] px-4 whitespace-nowrap"
                  style={{ color: COLORS.white }}
                >
                  Executive Board
                </h3>
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.goldBorderStrong}, transparent)`,
                  }}
                />
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {executives.map((exec, i) => (
                <ExecutiveCard key={exec._id} member={exec} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Departments & Teams ── */}
        {groups.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-10 lg:mb-14">
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${COLORS.dividerGold})`,
                  }}
                />
                <h3
                  className="font-playfair font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-[0.28em] px-4 whitespace-nowrap"
                  style={{ color: COLORS.white }}
                >
                  Departments &amp; Teams
                </h3>
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.dividerGold}, transparent)`,
                  }}
                />
              </div>
            </AnimatedSection>

            {/* ── Role groups ── */}
            <div className="space-y-8 sm:space-y-10">
              {groups.map((group, gIdx) => (
                <AnimatedSection key={group.key} delay={gIdx * 0.05}>
                  <div
                    className="rounded-2xl overflow-hidden border"
                    style={{
                      borderColor: COLORS.dividerGold,
                      background: `${COLORS.cardBgMedium}88`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Group header */}
                    <div
                      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5"
                      style={{
                        background: `linear-gradient(90deg, ${COLORS.cardBgMedium}, transparent)`,
                        borderBottom: `1px solid ${COLORS.dividerGold}`,
                      }}
                    >
                      {/* Index badge */}
                      <div
                        className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                   font-mono text-xs sm:text-sm font-bold border-2"
                        style={{
                          borderColor: COLORS.accent,
                          color: COLORS.accent,
                          background: `${COLORS.accent}12`,
                        }}
                      >
                        {String(gIdx + 1).padStart(2, '0')}
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-playfair font-bold text-base sm:text-lg lg:text-xl leading-tight truncate"
                          style={{ color: COLORS.white }}
                        >
                          {group.title}
                        </h4>
                      </div>

                      {/* Member count badge */}
                      <div
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border
                                   font-semibold text-[10px] sm:text-xs uppercase tracking-widest"
                        style={{
                          borderColor: COLORS.dividerGold,
                          color: COLORS.textHalf,
                          background: `${COLORS.darkAlt}88`,
                        }}
                      >
                        <span
                          className="font-mono text-xs sm:text-sm"
                          style={{ color: COLORS.accent }}
                        >
                          {group.members.length}
                        </span>
                        <span className="hidden sm:inline">
                          {group.members.length === 1 ? 'Member' : 'Members'}
                        </span>
                      </div>
                    </div>

                    {/* Members list */}
                    <div className="py-2 sm:py-3">
                      {group.members.map((member, mIdx) => (
                        <div key={member._id}>
                          <MemberListItem member={member} index={mIdx} />
                          {mIdx < group.members.length - 1 && (
                            <div
                              className="mx-4 sm:mx-6 h-px"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${COLORS.dividerGold}40, transparent)`,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════ IMAGE ZOOM MODAL ═══════ */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 backdrop-blur-[20px]"
              style={{ background: 'rgba(0,0,0,0.85)' }}
              onClick={() => setSelectedMember(null)}
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[520px] rounded-lg overflow-hidden border"
              style={{
                background: COLORS.darkAlt,
                borderColor: COLORS.goldBorderStrong,
                boxShadow: `0 30px 90px rgba(0,0,0,0.75), 0 0 0 1px ${COLORS.accent}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  borderColor: COLORS.goldBorderStrong,
                  color: COLORS.accent,
                }}
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Zoomed portrait */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                <motion.img
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  src={selectedMember.img}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5) 100%)`,
                  }}
                />
              </div>

              {/* Info footer */}
              <div
                className="relative px-6 sm:px-8 py-7 sm:py-8 text-center border-t"
                style={{
                  borderColor: COLORS.goldBorderStrong,
                  background: COLORS.cardBgMedium,
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-[2px]"
                  style={{ background: COLORS.accent }}
                />

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="font-playfair font-bold text-2xl sm:text-3xl leading-tight tracking-wide"
                  style={{ color: COLORS.white }}
                >
                  {selectedMember.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="flex items-center justify-center gap-3 mt-4"
                >
                  <span
                    className="h-px w-8"
                    style={{ background: COLORS.goldBorderStrong }}
                  />
                  <p
                    className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: COLORS.accent }}
                  >
                    {selectedMember.role}
                  </p>
                  <span
                    className="h-px w-8"
                    style={{ background: COLORS.goldBorderStrong }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}