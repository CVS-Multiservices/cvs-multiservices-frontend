import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { TeamMember } from '../../types';
import dataService from '../../services/dataService';

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [activeExecutive, setActiveExecutive] = useState<string | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await dataService.getTeam();
        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  useEffect(() => {
    if (!loading && team.length > 0 && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [loading, team, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEmployee(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (selectedEmployee) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEmployee]);

  const organized = useMemo(() => {
    const find = (name: string) => team.find((m) => m.name === name);
    const findCFO = team.find(
      (m) =>
        m.name === 'Kusali Shah' ||
        m.role.toLowerCase().includes('chief financial') ||
        m.role.toLowerCase() === 'cfo'
    );

    const kusaliFallback: TeamMember = {
      _id: 'kusali-shah-cfo',
      name: 'Kusali Shah',
      role: 'Chief Financial Officer (CFO)',
      img: `https://ui-avatars.com/api/?name=Kusali+Shah&background=C5A065&color=101010&size=512&bold=true`,
      desc: 'Leading financial strategy, corporate finance, risk management and long-term fiscal planning for sustainable growth.',
      level: 1,
    } as any;

    return {
      chetan: find('Chetankumar Shah'),
      aruna: find('Arunaben Shah'),
      swapnil: find('Swapnil Shah'),
      kusali: findCFO || kusaliFallback,
      accounts: team.filter((m) => m.role === 'Accountant'),
      hr: team.filter((m) => ['HR Head', 'HR Executive'].includes(m.role)),
      purchase: team.filter((m) => m.role === 'Purchase Manager'),
      logistics: team.filter((m) => m.role === 'Logistics Head'),
      projectMgmt: team.filter((m) => m.role === 'Project Manager'),
      businessDev: team.filter((m) => ['Business Development Associate', 'BDA'].includes(m.role)),
      tenderMgmt: team.filter((m) => m.role === 'Tender Executive'),
    };
  }, [team]);

  const execDeptMap: Record<string, { key: string; title: string; employees: TeamMember[] }[]> = useMemo(
    () => ({
      chetan: [
        { key: 'accounts', title: 'Accounts', employees: organized.accounts },
        { key: 'hr', title: 'Human Resources (HR)', employees: organized.hr },
      ],
      aruna: [
        { key: 'purchase', title: 'Purchase', employees: organized.purchase },
        { key: 'logistics', title: 'Logistics', employees: organized.logistics },
      ],
      swapnil: [
        { key: 'project', title: 'Project Management', employees: organized.projectMgmt },
        { key: 'business', title: 'Business Development', employees: organized.businessDev },
        { key: 'tender', title: 'Tender Management', employees: organized.tenderMgmt },
      ],
      kusali: [],
    }),
    [organized]
  );

  const activeDeptData = useMemo(() => {
    if (!activeExecutive || !activeDepartment) return null;
    return execDeptMap[activeExecutive]?.find((d) => d.key === activeDepartment) || null;
  }, [activeExecutive, activeDepartment, execDeptMap]);

  if (loading || team.length === 0) return null;

  const toggleExecutive = (key: string) => {
    if (activeExecutive === key) {
      setActiveExecutive(null);
      setActiveDepartment(null);
    } else {
      setActiveExecutive(key);
      setActiveDepartment(null);
    }
  };

  const toggleDepartment = (key: string) => {
    setActiveDepartment((prev) => (prev === key ? null : key));
  };

  const Chevron = ({ open }: { open: boolean }) => (
    <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </motion.div>
  );

  const EmployeeCard = ({
    member,
    isExecutive = false,
    isActive = false,
    onClick,
  }: {
    member: TeamMember;
    isExecutive?: boolean;
    isActive?: boolean;
    onClick?: () => void;
  }) => (
    <motion.div
      id={member.name.toLowerCase().replace(/\s+/g, '-')}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[1.5rem] group aspect-[3/4] border transition-all duration-300 ${isExecutive ? 'shadow-2xl border-2' : 'shadow-xl'}`}
      style={{
        borderColor: isActive ? COLORS.accent : isExecutive ? COLORS.goldBorderStrong : COLORS.dividerGold,
        boxShadow: isActive
          ? `0 16px 50px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS.accent}40`
          : `0 12px 40px rgba(0,0,0,0.35)`,
        cursor: 'pointer',
      }}
    >
      <img
        src={member.img}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0 pointer-events-none" />
      {isExecutive && (
        <div
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center"
          style={{ color: COLORS.accent }}
        >
          <Chevron open={isActive} />
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-5 py-4 backdrop-blur-xl border-t transition-all duration-500 group-hover:backdrop-blur-2xl"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cardBgMedium}CC, ${COLORS.darkAlt}E6)`,
          borderColor: COLORS.dividerGold,
        }}
      >
        <h3 className="font-playfair font-bold text-left leading-tight text-white text-[15px] sm:text-[17px] lg:text-[18px]">{member.name}</h3>
        <span className="block text-left font-semibold uppercase tracking-[0.16em] text-[9px] sm:text-[10px] mt-1.5" style={{ color: COLORS.accent }}>
          {member.role}
        </span>
      </div>
    </motion.div>
  );

  const DepartmentCard = ({
    title,
    count,
    isActive,
    onClick,
  }: {
    title: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full rounded-2xl border backdrop-blur-xl p-5 sm:p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300"
      style={{
        background: isActive ? `${COLORS.cardBgMedium}FF` : `${COLORS.cardBgMedium}B8`,
        borderColor: isActive ? COLORS.accent : COLORS.dividerGold,
        boxShadow: isActive
          ? `0 12px 36px rgba(0,0,0,0.4), 0 0 0 1px ${COLORS.accent}30`
          : `0 8px 24px rgba(0,0,0,0.25)`,
      }}
    >
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: isActive ? COLORS.accent : COLORS.dividerGold }} />
      <div
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/30 border border-white/10 flex items-center justify-center"
        style={{ color: COLORS.accent }}
      >
        <Chevron open={isActive} />
      </div>
      <h4 className="font-playfair font-bold text-base sm:text-lg leading-tight" style={{ color: COLORS.white }}>
        {title}
      </h4>
      <span className="mt-2 text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-full border" style={{ color: COLORS.textHalf, borderColor: COLORS.dividerGold, background: `${COLORS.darkAlt}88` }}>
        {count} {count === 1 ? 'Member' : 'Members'}
      </span>
    </motion.div>
  );

  const executives = [
    { key: 'chetan', member: organized.chetan },
    { key: 'aruna', member: organized.aruna },
    { key: 'swapnil', member: organized.swapnil },
    { key: 'kusali', member: organized.kusali },
  ].filter((e) => e.member);

  return (
    <section id="team" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: COLORS.darkAlt }}>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`, transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle, ${COLORS.accent}, transparent)`, transform: 'translate(-30%, 30%)' }} />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12 lg:mb-16">
            <div className="section-label mx-auto w-fit mb-4">Leadership</div>
            <h2 className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4" style={{ color: COLORS.white }}>
              Meet Our <span className="grad-gold">Team</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mb-6" />
            <p className="text-base sm:text-lg xl:text-xl max-w-3xl mx-auto" style={{ color: COLORS.textHalf }}>
              Navigate from Executive → Department → Team Members → Details. Click an executive to explore their organization.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 items-start">
            {executives.map(({ key, member }) => (
              <EmployeeCard key={key} member={member!} isExecutive isActive={activeExecutive === key} onClick={() => toggleExecutive(key)} />
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto mt-10">
          <AnimatePresence mode="wait">
            {activeExecutive && (
              <motion.div
                key={`exec-${activeExecutive}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-px h-12" style={{ background: COLORS.dividerGold }} />
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: COLORS.accent }} />
                </div>

                {execDeptMap[activeExecutive]?.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 w-full max-w-xl mx-auto rounded-2xl border backdrop-blur-xl p-8 sm:p-10 text-center" style={{ background: `${COLORS.cardBgMedium}CC`, borderColor: COLORS.dividerGold }}>
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center border" style={{ borderColor: COLORS.goldBorderStrong, background: `${COLORS.darkAlt}AA` }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                    </div>
                    <h3 className="font-playfair text-xl font-bold mb-2" style={{ color: COLORS.white }}>No departments assigned yet</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textHalf }}>The CFO office currently has no reporting departments. Departments will appear here once assigned.</p>
                  </motion.div>
                ) : (
                  <>
                    {execDeptMap[activeExecutive].length > 1 && (
                      <div className="hidden md:flex w-full justify-center mt-1 mb-8 relative">
                        <div className="h-px w-[60%]" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.dividerGold}, transparent)` }} />
                      </div>
                    )}
                    <div className={`grid w-full gap-5 sm:gap-6 ${execDeptMap[activeExecutive].length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
                      {execDeptMap[activeExecutive].map((dept) => (
                        <div key={dept.key} className="relative flex flex-col items-center">
                          <div className="hidden md:block w-px h-6 mb-3" style={{ background: COLORS.dividerGold }} />
                          <DepartmentCard title={dept.title} count={dept.employees.length} isActive={activeDepartment === dept.key} onClick={() => toggleDepartment(dept.key)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeExecutive && activeDepartment && activeDeptData && (
              <motion.div
                key={`${activeExecutive}-${activeDepartment}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
                className="w-full flex flex-col items-center mt-10"
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="w-px h-10" style={{ background: COLORS.dividerGold }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.accent }} />
                </div>

                {activeDeptData.employees.length === 0 ? (
                  <div className="rounded-xl border px-6 py-4 text-sm" style={{ borderColor: COLORS.dividerGold, color: COLORS.textHalf, background: `${COLORS.darkAlt}88` }}>
                    No team members in {activeDeptData.title} yet.
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-5 sm:gap-6 w-full max-w-6xl mx-auto">
                    {activeDeptData.employees.map((emp) => (
                      <div key={emp._id} className="w-[calc(50%-10px)] sm:w-[200px] lg:w-[220px]">
                        <EmployeeCard member={emp} onClick={() => setSelectedEmployee(emp)} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm" style={{ background: `${COLORS.darkAlt}AA`, borderColor: COLORS.dividerGold, color: COLORS.textMuted45 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A065] animate-pulse" />
            Executive → Department → Members → Details
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-[16px]" style={{ background: 'rgba(0,0,0,0.72)' }} onClick={() => setSelectedEmployee(null)} />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[380px] rounded-[2rem] overflow-hidden border shadow-2xl flex flex-col"
              style={{ background: `${COLORS.cardBgMedium}F2`, borderColor: COLORS.goldBorderStrong, boxShadow: `0 24px 80px rgba(0,0,0,0.6)` }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedEmployee(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img src={selectedEmployee.img} alt={selectedEmployee.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pt-16">
                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight">{selectedEmployee.name}</h3>
                  <p className="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] border" style={{ color: COLORS.accent, borderColor: COLORS.goldBorderStrong, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                    {selectedEmployee.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}