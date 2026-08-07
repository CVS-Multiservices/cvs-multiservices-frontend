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
  if (/(head|manager|executive|lead|officer|specialist|associate|coordinator)$/i.test(role)) {
    return pluralize(role);
  }
  return `${role} Team`;
};

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [openKey, setOpenKey] = useState<string | null>(null);
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

  // ─── Dynamic role-based grouping ──────────────────────────
  const { executives, groups } = useMemo(() => {
    const execs: TeamMember[] = [];
    const nonExecs: TeamMember[] = [];
    team.forEach((m) => {
      if (isExecutiveRole(m.role)) execs.push(m);
      else nonExecs.push(m);
    });

    execs.sort((a, b) => executiveRank(a.role) - executiveRank(b.role));

    const roleMap = new Map<string, TeamMember[]>();
    nonExecs.forEach((m) => {
      const key = m.role.trim();
      if (!roleMap.has(key)) roleMap.set(key, []);
      roleMap.get(key)!.push(m);
    });

    const built: RoleGroup[] = Array.from(roleMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([role, members]) => ({
        key: role.toLowerCase().replace(/\s+/g, '-'),
        role,
        title: buildGroupTitle(role, members.length),
        members,
      }));

    return { executives: execs, groups: built };
  }, [team]);

  if (loading || team.length === 0) return null;

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  // ─── Chevron ──────────────────────────────────────────────
  const Chevron = ({ open }: { open: boolean }) => (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );

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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
            <span className="h-px w-5" style={{ background: COLORS.goldBorderStrong }} />
            <p
              className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] whitespace-nowrap"
              style={{ color: COLORS.accent }}
            >
              {member.role}
            </p>
            <span className="h-px w-5" style={{ background: COLORS.goldBorderStrong }} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ─── MEMBER TILE (accordion) ──────────────────────────────
  const MemberTile = ({ member }: { member: TeamMember }) => (
    <motion.div
      id={member.name.toLowerCase().replace(/\s+/g, '-')}
      whileHover={{ y: -4 }}
      onClick={() => setSelectedMember(member)}
      className="group relative w-full rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer"
      style={{
        borderColor: COLORS.dividerGold,
        background: COLORS.cardBgMedium,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <ZoomBadge />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left">
        <h5
          className="font-playfair font-bold text-sm sm:text-base leading-tight text-white truncate"
          title={member.name}
        >
          {member.name}
        </h5>
        <p
          className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] mt-1.5 truncate"
          style={{ color: COLORS.accent }}
          title={member.role}
        >
          {member.role}
        </p>
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
      {/* Background */}
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
        {/* Heading */}
        <AnimatedSection>
          <div className="text-center mb-14 lg:mb-20">
            <div className="section-label mx-auto w-fit mb-4">Our Organization</div>
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

        {/* Executive Board */}
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

        {/* Accordions */}
        {groups.length > 0 && (
          <div className="max-w-7xl mx-auto">
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

            <div className="space-y-4 sm:space-y-5">
              {groups.map((group, idx) => {
                const isOpen = openKey === group.key;
                return (
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04, duration: 0.4 }}
                    className="rounded-2xl overflow-hidden border backdrop-blur-md transition-all duration-300"
                    style={{
                      borderColor: isOpen ? COLORS.accent : COLORS.dividerGold,
                      background: `${COLORS.cardBgMedium}88`,
                      boxShadow: isOpen
                        ? `0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px ${COLORS.accent}25`
                        : `0 8px 24px rgba(0,0,0,0.3)`,
                    }}
                  >
                    <button
                      onClick={() => toggle(group.key)}
                      className="w-full flex items-center gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-7 lg:p-8 xl:p-10 text-left transition-colors"
                      style={{
                        background: isOpen
                          ? `linear-gradient(90deg, ${COLORS.cardBgMedium}, transparent)`
                          : 'transparent',
                      }}
                    >
                      <div
                        className="hidden sm:flex flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full items-center justify-center font-mono text-sm lg:text-base font-bold border-2 transition-all duration-300"
                        style={{
                          borderColor: isOpen ? COLORS.accent : COLORS.dividerGold,
                          color: isOpen ? COLORS.accent : COLORS.textHalf,
                          background: isOpen ? `${COLORS.accent}12` : `${COLORS.darkAlt}66`,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-playfair font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-tight"
                          style={{ color: COLORS.white }}
                        >
                          {group.title}
                        </h3>
                      </div>

                      <div
                        className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border font-semibold text-xs uppercase tracking-widest"
                        style={{
                          borderColor: isOpen ? COLORS.accent : COLORS.dividerGold,
                          color: isOpen ? COLORS.accent : COLORS.textHalf,
                          background: `${COLORS.darkAlt}88`,
                        }}
                      >
                        <span className="font-mono text-sm">{group.members.length}</span>
                        <span>{group.members.length === 1 ? 'Member' : 'Members'}</span>
                      </div>

                      <div
                        className="md:hidden flex-shrink-0 min-w-[32px] h-8 px-2.5 rounded-full flex items-center justify-center font-mono text-xs font-bold border"
                        style={{
                          borderColor: isOpen ? COLORS.accent : COLORS.dividerGold,
                          color: isOpen ? COLORS.accent : COLORS.textHalf,
                          background: `${COLORS.darkAlt}88`,
                        }}
                      >
                        {group.members.length}
                      </div>

                      <div
                        className="flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center border transition-all duration-300"
                        style={{
                          borderColor: isOpen ? COLORS.accent : COLORS.dividerGold,
                          color: isOpen ? COLORS.accent : COLORS.textHalf,
                          background: isOpen ? `${COLORS.accent}12` : 'transparent',
                        }}
                      >
                        <Chevron open={isOpen} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="border-t px-5 sm:px-7 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10"
                            style={{
                              borderColor: COLORS.dividerGold,
                              background: `linear-gradient(180deg, ${COLORS.darkAlt}44, transparent)`,
                            }}
                          >
                            <div
                              className="grid gap-4 sm:gap-5 lg:gap-6
                                         grid-cols-2
                                         sm:grid-cols-3
                                         md:grid-cols-4
                                         lg:grid-cols-5
                                         xl:grid-cols-6"
                            >
                              {group.members.map((member) => (
                                <MemberTile key={member._id} member={member} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
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

            {/* Modal */}
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

                {/* Subtle bottom gradient */}
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
                {/* Top gold accent */}
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
                  <span className="h-px w-8" style={{ background: COLORS.goldBorderStrong }} />
                  <p
                    className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: COLORS.accent }}
                  >
                    {selectedMember.role}
                  </p>
                  <span className="h-px w-8" style={{ background: COLORS.goldBorderStrong }} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}