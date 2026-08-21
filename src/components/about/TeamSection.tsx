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
  { key: 'accountants', label: 'Accounts Department', keywords: ['accountant'] },
  { key: 'purchase', label: 'Purchase Department', keywords: ['purchase'] },
  { key: 'hr', label: 'HR Department', keywords: ['human resource', 'hr '] },
  {
    key: 'it',
    label: 'Technical Department',
    keywords: ['it ', 'information technology', 'software', 'developer', 'engineer'],
  },
  { key: 'sales', label: 'Sales Team', keywords: ['sales'] },
  { key: 'marketing', label: 'Marketing Team', keywords: ['marketing'] },
  {
    key: 'logistics',
    label: 'Logistics Team',
    keywords: ['logistics', 'supply chain', 'warehouse'],
  },
  { key: 'admin', label: 'Administration', keywords: ['admin', 'administration'] },
  { key: 'operations', label: 'Operations Team', keywords: ['operation'] },
];

const findMergeGroup = (role: string) => {
  const r = role.toLowerCase();
  return (
    ROLE_MERGE_GROUPS.find((g) => g.keywords.some((kw) => r.includes(kw))) ?? null
  );
};

// ═══════════════════════════════════════════════════════════════
//  ANIMATED DECORATION COMPONENTS (all live in side margins)
// ═══════════════════════════════════════════════════════════════

const FloatingOrb = ({
  size,
  x,
  y,
  color,
  duration,
  delay,
}: {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle at 30% 30%, ${color}18, transparent 70%)`,
      border: `1px solid ${color}12`,
      zIndex: 0,
    }}
    animate={{
      y: [0, -18, 0, 10, 0],
      x: [0, 8, -6, 4, 0],
      scale: [1, 1.08, 0.96, 1.04, 1],
      opacity: [0.35, 0.6, 0.4, 0.55, 0.35],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const SpinningRing = ({
  size,
  x,
  y,
  color,
  duration,
  delay,
  reverse,
}: {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
  reverse?: boolean;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      border: `1px solid ${color}18`,
      borderTopColor: `${color}55`,
      zIndex: 0,
    }}
    animate={{ rotate: reverse ? [0, -360] : [0, 360] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  />
);

const PulsingDiamond = ({
  x,
  y,
  color,
  size,
  delay,
}: {
  x: string;
  y: string;
  color: string;
  size: number;
  delay: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, zIndex: 0 }}
    animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.6, 0.25] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `${color}25`,
        border: `1px solid ${color}45`,
        transform: 'rotate(45deg)',
      }}
    />
  </motion.div>
);

const TwinkleDot = ({
  x,
  y,
  color,
  delay,
  size = 3,
}: {
  x: string;
  y: string;
  color: string;
  delay: number;
  size?: number;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}`,
      zIndex: 0,
    }}
    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
    transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const VerticalAccent = ({
  x,
  y,
  height,
  color,
  duration,
  delay,
}: {
  x: string;
  y: string;
  height: number;
  color: string;
  duration: number;
  delay: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: x,
      top: y,
      width: 1,
      height,
      background: `linear-gradient(180deg, transparent, ${color}55, transparent)`,
      zIndex: 0,
    }}
    animate={{ opacity: [0.2, 0.7, 0.2], y: [0, 20, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

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

    const mergedGroups: RoleGroup[] = Array.from(mergedMap.values()).map(
      ({ key, label, members }) => ({
        key,
        role: label,
        title: label,
        members,
      })
    );

    const exactGroups: RoleGroup[] = Array.from(exactMap.entries()).map(
      ([role, members]) => ({
        key: role.toLowerCase().replace(/\s+/g, '-'),
        role,
        title: buildGroupTitle(role, members.length),
        members,
      })
    );

    const built: RoleGroup[] = [...mergedGroups, ...exactGroups].sort((a, b) => {
      const aIsBDA = isBDARole(a.role);
      const bIsBDA = isBDARole(b.role);
      if (aIsBDA && !bIsBDA) return -1;
      if (!aIsBDA && bIsBDA) return 1;
      return a.role.localeCompare(b.role);
    });

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
      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ═════ ALL ANIMATIONS LIVE IN SIDE MARGINS ONLY ═════ */}
      {/* Content columns are capped (max-w-7xl / max-w-5xl) and centered.
          All decor uses viewport % coords in left (0-8%) or right (88-100%)
          margins so they never overlap cards. */}

      {/* ── LEFT MARGIN CLUSTER ── */}
      <FloatingOrb size={280} x="-6%" y="8%"  color={COLORS.accent}     duration={11} delay={0} />
      <FloatingOrb size={140} x="2%"  y="35%" color={COLORS.blueAccent} duration={9}  delay={1.2} />
      <FloatingOrb size={200} x="-4%" y="62%" color={COLORS.accent}     duration={13} delay={2.5} />
      <FloatingOrb size={110} x="3%"  y="85%" color={COLORS.blueAccent} duration={10} delay={0.8} />

      <SpinningRing size={90}  x="1%"  y="20%" color={COLORS.accent}     duration={20} delay={0} />
      <SpinningRing size={70}  x="4%"  y="50%" color={COLORS.blueAccent} duration={16} delay={1} reverse />
      <SpinningRing size={110} x="-2%" y="78%" color={COLORS.accent}     duration={24} delay={0.5} />

      <PulsingDiamond x="5%" y="15%" color={COLORS.accent}     size={9} delay={0} />
      <PulsingDiamond x="2%" y="45%" color={COLORS.blueAccent} size={7} delay={1.5} />
      <PulsingDiamond x="6%" y="72%" color={COLORS.accent}     size={8} delay={0.7} />
      <PulsingDiamond x="3%" y="92%" color={COLORS.blueAccent} size={6} delay={2.2} />

      <VerticalAccent x="7%" y="10%" height={120} color={COLORS.accent}     duration={4} delay={0} />
      <VerticalAccent x="1%" y="55%" height={90}  color={COLORS.blueAccent} duration={5} delay={1.5} />

      <TwinkleDot x="8%" y="25%" color={COLORS.accent}     delay={0}   size={3} />
      <TwinkleDot x="4%" y="40%" color={COLORS.blueAccent} delay={0.8} size={4} />
      <TwinkleDot x="6%" y="68%" color={COLORS.accent}     delay={1.6} size={3} />
      <TwinkleDot x="2%" y="88%" color={COLORS.accent}     delay={2.4} size={4} />

      {/* ── RIGHT MARGIN CLUSTER ── */}
      <FloatingOrb size={260} x="88%" y="6%"  color={COLORS.blueAccent} duration={12} delay={0.5} />
      <FloatingOrb size={150} x="94%" y="30%" color={COLORS.accent}     duration={10} delay={1.8} />
      <FloatingOrb size={220} x="90%" y="58%" color={COLORS.blueAccent} duration={14} delay={0} />
      <FloatingOrb size={120} x="93%" y="82%" color={COLORS.accent}     duration={9}  delay={2.5} />

      <SpinningRing size={100} x="92%" y="18%" color={COLORS.blueAccent} duration={22} delay={0}   reverse />
      <SpinningRing size={75}  x="95%" y="48%" color={COLORS.accent}     duration={17} delay={1.2} />
      <SpinningRing size={120} x="88%" y="75%" color={COLORS.blueAccent} duration={26} delay={0.3} reverse />

      <PulsingDiamond x="94%" y="12%" color={COLORS.blueAccent} size={8} delay={0.4} />
      <PulsingDiamond x="97%" y="40%" color={COLORS.accent}     size={7} delay={1.7} />
      <PulsingDiamond x="93%" y="65%" color={COLORS.blueAccent} size={9} delay={0.9} />
      <PulsingDiamond x="96%" y="88%" color={COLORS.accent}     size={6} delay={2.6} />

      <VerticalAccent x="92%" y="20%" height={100} color={COLORS.blueAccent} duration={4.5} delay={0.5} />
      <VerticalAccent x="98%" y="62%" height={130} color={COLORS.accent}     duration={5.5} delay={1.8} />

      <TwinkleDot x="91%" y="22%" color={COLORS.blueAccent} delay={0.3} size={4} />
      <TwinkleDot x="96%" y="50%" color={COLORS.accent}     delay={1.1} size={3} />
      <TwinkleDot x="93%" y="70%" color={COLORS.blueAccent} delay={1.9} size={4} />
      <TwinkleDot x="97%" y="92%" color={COLORS.accent}     delay={2.7} size={3} />

      {/* ═════ MAIN CONTENT — z-10 so it's always above decor ═════ */}
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

      {/* ═══════ IMAGE ZOOM MODAL — Compact 360px ═══════ */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 backdrop-blur-[16px]"
              style={{ background: 'rgba(0,0,0,0.82)' }}
              onClick={() => setSelectedMember(null)}
            />

            {/* Modal card — compact 360px wide, square 1:1 image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 rounded-2xl overflow-hidden border"
              style={{
                width: '100%',
                maxWidth: 360,
                background: COLORS.darkAlt,
                borderColor: COLORS.goldBorderStrong,
                boxShadow: `0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px ${COLORS.accent}20`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  borderColor: COLORS.goldBorderStrong,
                  color: COLORS.accent,
                }}
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Square 1:1 portrait */}
              <div
                className="relative w-full overflow-hidden bg-black"
                style={{ aspectRatio: '1 / 1' }}
              >
                <motion.img
                  initial={{ scale: 1.06, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  src={selectedMember.img}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)`,
                  }}
                />
                {/* Animated corner accents */}
                <motion.div
                  className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none"
                  style={{
                    borderBottom: `2px solid ${COLORS.accent}60`,
                    borderLeft: `2px solid ${COLORS.accent}60`,
                  }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                  style={{
                    borderTop: `2px solid ${COLORS.accent}60`,
                    borderRight: `2px solid ${COLORS.accent}60`,
                  }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                />
              </div>

              {/* Info footer */}
              <div
                className="relative px-5 py-5 text-center border-t"
                style={{
                  borderColor: COLORS.goldBorderStrong,
                  background: COLORS.cardBgMedium,
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px]"
                  style={{ background: COLORS.accent }}
                />

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.35 }}
                  className="font-playfair font-bold text-xl sm:text-2xl leading-tight tracking-wide"
                  style={{ color: COLORS.white }}
                >
                  {selectedMember.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.35 }}
                  className="flex items-center justify-center gap-3 mt-3"
                >
                  <span
                    className="h-px w-6"
                    style={{ background: COLORS.goldBorderStrong }}
                  />
                  <p
                    className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.26em]"
                    style={{ color: COLORS.accent }}
                  >
                    {selectedMember.role}
                  </p>
                  <span
                    className="h-px w-6"
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