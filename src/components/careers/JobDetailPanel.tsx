import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Job } from '../../types';

interface JobDetailPanelProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatSalary(
  salary: { min: number; max: number; currency: string } | undefined
): string {
  if (!salary) return 'Salary not disclosed';
  const formatNum = (num: number) => {
    if (salary.currency === 'INR') {
      if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakhs`;
      return `${(num / 1000).toFixed(0)}K`;
    }
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };
  const symbol =
    salary.currency === 'INR'
      ? '₹'
      : salary.currency === 'AED'
      ? 'AED '
      : '$';
  return `${symbol}${formatNum(salary.min)} - ${symbol}${formatNum(salary.max)} per annum`;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysUntilClosing(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  return Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  );
}

function getDaysAgo(dateStr: string | undefined): string {
  if (!dateStr) return 'Recently';
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

function getPositionUrgencyLabel(count: number) {
  if (count >= 100)
    return {
      label: 'Mass Hiring',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.1)',
      border: 'rgba(168,85,247,0.25)',
    };
  if (count >= 50)
    return {
      label: 'Multiple Vacancies',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.25)',
    };
  if (count >= 20)
    return {
      label: 'Several Openings',
      color: '#25d366',
      bg: 'rgba(37,211,102,0.1)',
      border: 'rgba(37,211,102,0.25)',
    };
  if (count >= 5)
    return {
      label: 'Few Positions',
      color: '#d4a017',
      bg: 'rgba(212,160,23,0.1)',
      border: 'rgba(212,160,23,0.25)',
    };
  return {
    label: 'Limited Seats',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
  };
}

export function JobDetailPanel({ job, isOpen, onClose }: JobDetailPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!job) return null;

  // ── Resolve nested fields directly from DB object ──
  const companyName   = job.company?.name     ?? 'CVS Multi Services Pvt. Ltd.';
  const companyLogo   = job.company?.logo     ?? '';
  const locationName  = job.location?.name    ?? '';
  const typeName      = job.type?.name        ?? '';
  const experienceName = job.experience?.name ?? '';
  const departmentName = job.department?.name ?? '';

  const daysUntilClosing = getDaysUntilClosing(job.closingDate);
  const positionCount    = job.positionCount ?? 0;
  const positionMeta     = getPositionUrgencyLabel(positionCount);

  const contactUrl = `/contact?job=${encodeURIComponent(job.title)}&id=${job._id}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999]"
            style={{
              background: 'rgba(5,10,20,0.85)',
              backdropFilter: 'blur(12px)',
            }}
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
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 2xl:p-12">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #0a1628 0%, #080f1e 100%)',
                  border: '1px solid rgba(212,160,23,0.2)',
                  boxShadow:
                    '0 50px 100px rgba(0,0,0,0.7), 0 0 60px rgba(212,160,23,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* ── HERO ── */}
                <div className="relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, #0a2447 0%, #050d1a 100%)',
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
                      backgroundSize: '30px 30px',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,1) 100%)',
                    }}
                  />

                  {/* Top bar */}
                  <div className="relative z-10 flex items-start justify-between gap-2 p-4 sm:p-6">
                    <div className="flex items-center flex-wrap gap-2">
                      {job.isUrgent && (
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="px-2 py-1 sm:px-2.5 rounded-full text-[10px] sm:text-[11px]
                                     font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{
                            background: 'rgba(239,68,68,0.2)',
                            border: '1px solid rgba(239,68,68,0.4)',
                            color: '#ef4444',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Icons.Zap className="w-3 h-3 flex-shrink-0" />
                          <span>Urgent</span>
                        </motion.span>
                      )}
                      {job.isFeatured && (
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="px-2 py-1 sm:px-2.5 rounded-full text-[10px] sm:text-[11px]
                                     font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{
                            background: 'rgba(212,160,23,0.2)',
                            border: '1px solid rgba(212,160,23,0.4)',
                            color: '#d4a017',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Icons.Star className="w-3 h-3 flex-shrink-0" />
                          <span>Featured</span>
                        </motion.span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Job ID */}
                      <span
                        className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {job._id.slice(-6).toUpperCase()}
                      </span>
                      <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                                   transition-all duration-300 hover:scale-110 hover:rotate-90"
                        style={{
                          background: 'rgba(5,13,26,0.8)',
                          border: '1px solid rgba(212,160,23,0.3)',
                          color: '#d4a017',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Job ID */}
                  <div className="relative z-10 px-4 pb-2 sm:hidden">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {job._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Logo + Title */}
                  <div className="relative z-10 px-4 pb-6 pt-2 sm:px-8 sm:pb-8 xl:px-10 xl:pb-10 sm:pt-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center
                                   justify-center overflow-hidden flex-shrink-0"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '2px solid rgba(212,160,23,0.3)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        }}
                      >
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                          />
                        ) : (
                          <Icons.Building2
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            style={{ color: '#d4a017' }}
                          />
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs sm:text-sm xl:text-base font-medium mb-1 truncate"
                          style={{ color: 'rgba(212,160,23,0.8)' }}
                        >
                          {companyName}
                        </p>
                        <h2
                          className="font-playfair text-xl sm:text-3xl xl:text-4xl 2xl:text-5xl
                                     font-bold text-white leading-tight mb-2 break-words"
                        >
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {[
                            { icon: Icons.MapPin,    text: locationName  },
                            { icon: Icons.Briefcase, text: typeName      },
                            { icon: Icons.Clock,     text: getDaysAgo(job.postedDate) },
                          ]
                            .filter((item) => item.text)
                            .map(({ icon: Icon, text }, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 text-xs sm:text-sm xl:text-base"
                                style={{ color: 'rgba(255,255,255,0.5)' }}
                              >
                                <Icon
                                  className="w-3.5 h-3.5 flex-shrink-0"
                                  style={{ color: '#d4a017' }}
                                />
                                {text}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="p-4 sm:p-6 xl:p-10 2xl:p-12">
                  <div
                    className="h-[1px] mb-6 xl:mb-8"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(212,160,23,0.5), rgba(212,160,23,0.1), transparent)',
                    }}
                  />

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 xl:gap-5 mb-6 xl:mb-8">
                    {[
                      {
                        icon: Icons.GraduationCap,
                        label: 'Experience',
                        value: experienceName,
                        color: '#d4a017',
                        bg: 'rgba(10,36,71,0.4)',
                        border: 'rgba(212,160,23,0.1)',
                      },
                      {
                        icon: Icons.DollarSign,
                        label: 'Salary',
                        value: formatSalary(job.salary).split(' per')[0],
                        color: '#25d366',
                        bg: 'rgba(37,211,102,0.08)',
                        border: 'rgba(37,211,102,0.2)',
                      },
                    ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="p-3 sm:p-4 xl:p-5 rounded-xl text-center"
                        style={{ background: bg, border: `1px solid ${border}` }}
                      >
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                          style={{ color }}
                        />
                        <div
                          className="text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-xs sm:text-sm xl:text-base font-semibold"
                          style={{ color: label === 'Salary' ? color : 'white' }}
                        >
                          {value}
                        </div>
                      </motion.div>
                    ))}

                    {/* Positions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-3 sm:p-4 xl:p-5 rounded-xl text-center relative overflow-hidden"
                      style={{
                        background: positionMeta.bg,
                        border: `1px solid ${positionMeta.border}`,
                      }}
                    >
                      {positionCount >= 50 && (
                        <span
                          className="absolute top-2 right-2 w-2 h-2 rounded-full animate-ping"
                          style={{ background: positionMeta.color, opacity: 0.6 }}
                        />
                      )}
                      <Icons.Users
                        className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                        style={{ color: positionMeta.color }}
                      />
                      <div
                        className="text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider mb-1"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        Positions
                      </div>
                      <div
                        className="text-lg sm:text-xl xl:text-2xl font-extrabold leading-none mb-1"
                        style={{ color: positionMeta.color }}
                      >
                        {positionCount}
                      </div>
                      <div
                        className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider
                                   px-2 py-0.5 rounded-full inline-block"
                        style={{
                          background: `${positionMeta.color}20`,
                          color: positionMeta.color,
                        }}
                      >
                        {positionMeta.label}
                      </div>
                    </motion.div>

                    {/* Deadline */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="p-3 sm:p-4 xl:p-5 rounded-xl text-center"
                      style={{
                        background:
                          daysUntilClosing <= 7
                            ? 'rgba(239,68,68,0.1)'
                            : 'rgba(10,36,71,0.4)',
                        border: `1px solid ${
                          daysUntilClosing <= 7
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(212,160,23,0.1)'
                        }`,
                      }}
                    >
                      <Icons.Calendar
                        className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                        style={{
                          color: daysUntilClosing <= 7 ? '#ef4444' : '#d4a017',
                        }}
                      />
                      <div
                        className="text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider mb-1"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {daysUntilClosing <= 7 ? 'Closing Soon' : 'Deadline'}
                      </div>
                      <div
                        className="text-xs sm:text-sm xl:text-base font-semibold"
                        style={{
                          color: daysUntilClosing <= 7 ? '#ef4444' : 'white',
                        }}
                      >
                        {daysUntilClosing === 0
                          ? 'Today!'
                          : `${daysUntilClosing} days`}
                      </div>
                    </motion.div>
                  </div>

                  {/* Positions Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="flex items-center gap-3 sm:gap-4 p-4 xl:p-5 rounded-2xl mb-6 xl:mb-8"
                    style={{
                      background: `linear-gradient(135deg, ${positionMeta.bg}, rgba(10,22,40,0.6))`,
                      border: `1px solid ${positionMeta.border}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${positionMeta.color}20`,
                        border: `1px solid ${positionMeta.border}`,
                      }}
                    >
                      <Icons.UserCheck
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: positionMeta.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-white font-bold text-sm sm:text-base xl:text-lg">
                          {positionCount}{' '}
                          {positionCount === 1 ? 'Position' : 'Positions'} Available
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider
                                     px-2 py-0.5 rounded-full"
                          style={{
                            background: positionMeta.bg,
                            color: positionMeta.color,
                            border: `1px solid ${positionMeta.border}`,
                          }}
                        >
                          {positionMeta.label}
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm xl:text-base"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        We are actively looking to fill{' '}
                        <span
                          style={{ color: positionMeta.color, fontWeight: 600 }}
                        >
                          {positionCount}{' '}
                          {positionCount === 1 ? 'vacancy' : 'vacancies'}
                        </span>{' '}
                        for{' '}
                        <span className="text-white font-medium">{job.title}</span>.{' '}
                        {positionCount >= 50
                          ? 'Apply now — multiple candidates will be selected.'
                          : positionCount <= 5
                          ? 'Limited seats — apply at the earliest!'
                          : 'Apply before the deadline.'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  {job.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6 xl:mb-8"
                    >
                      <h3
                        className="font-rajdhani font-bold text-lg xl:text-xl text-white
                                   mb-3 xl:mb-4 flex items-center gap-2"
                      >
                        <div className="w-8 h-[2px]" style={{ background: '#d4a017' }} />
                        About This Role
                      </h3>
                      <p
                        className="text-sm sm:text-base xl:text-lg leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.65)' }}
                      >
                        {job.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Responsibilities & Requirements */}
                  <div className="grid lg:grid-cols-2 gap-6 xl:gap-8 mb-6 xl:mb-8">
                    {[
                      {
                        title: 'Key Responsibilities',
                        icon: Icons.Target,
                        color: '#d4a017',
                        items: job.responsibilities ?? [],
                        bgColor: 'rgba(212,160,23,0.04)',
                        borderColor: 'rgba(212,160,23,0.08)',
                        itemIcon: Icons.CheckCircle2,
                      },
                      {
                        title: 'Requirements',
                        icon: Icons.GraduationCap,
                        color: '#3b82f6',
                        items: job.requirements ?? [],
                        bgColor: 'rgba(59,130,246,0.04)',
                        borderColor: 'rgba(59,130,246,0.08)',
                        itemIcon: Icons.BookOpen,
                      },
                    ].map(
                      (
                        {
                          title,
                          icon: SectionIcon,
                          color,
                          items,
                          bgColor,
                          borderColor,
                          itemIcon: ItemIcon,
                        },
                        si
                      ) =>
                        items.length > 0 ? (
                          <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 + si * 0.05 }}
                          >
                            <h3
                              className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl
                                         text-white mb-3 xl:mb-4 flex items-center gap-2"
                            >
                              <SectionIcon
                                className="w-5 h-5"
                                style={{ color }}
                              />
                              {title}
                            </h3>
                            <div className="space-y-2 xl:space-y-2.5">
                              {items.map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.4 + si * 0.05 + idx * 0.03,
                                  }}
                                  className="flex items-start gap-3 p-3 xl:p-4 rounded-xl"
                                  style={{
                                    background: bgColor,
                                    border: `1px solid ${borderColor}`,
                                  }}
                                >
                                  <ItemIcon
                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                    style={{ color }}
                                  />
                                  <span
                                    className="text-sm xl:text-base"
                                    style={{ color: 'rgba(255,255,255,0.7)' }}
                                  >
                                    {item}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : null
                    )}
                  </div>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6 xl:mb-8"
                    >
                      <h3
                        className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl
                                   text-white mb-3 xl:mb-4 flex items-center gap-2"
                      >
                        <Icons.Award
                          className="w-5 h-5"
                          style={{ color: '#d4a017' }}
                        />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2 xl:gap-2.5">
                        {job.skills.map((skill, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.55 + idx * 0.03 }}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                                       text-xs sm:text-sm xl:text-base font-medium"
                            style={{
                              background: 'rgba(212,160,23,0.1)',
                              border: '1px solid rgba(212,160,23,0.2)',
                              color: '#d4a017',
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mb-6 xl:mb-8"
                    >
                      <h3
                        className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl
                                   text-white mb-3 xl:mb-4 flex items-center gap-2"
                      >
                        <Icons.Heart
                          className="w-5 h-5"
                          style={{ color: '#25d366' }}
                        />
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 xl:gap-3">
                        {job.benefits.map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 + idx * 0.03 }}
                            className="flex items-center gap-3 p-3 xl:p-4 rounded-xl"
                            style={{
                              background: 'rgba(37,211,102,0.04)',
                              border: '1px solid rgba(37,211,102,0.08)',
                            }}
                          >
                            <Icons.CheckCircle2
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: '#25d366' }}
                            />
                            <span
                              className="text-sm xl:text-base"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {benefit}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Job Meta */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="p-4 sm:p-5 xl:p-6 rounded-2xl mb-6 xl:mb-8"
                    style={{
                      background: 'rgba(10,36,71,0.4)',
                      border: '1px solid rgba(212,160,23,0.1)',
                    }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xl:gap-5">
                      {[
                        {
                          label: 'Posted On',
                          value: formatDate(job.postedDate),
                          color: undefined,
                        },
                        {
                          label: 'Deadline',
                          value: formatDate(job.closingDate),
                          color: undefined,
                        },
                        {
                          label: 'Department',
                          value: departmentName,
                          color: undefined,
                        },
                        {
                          label: 'Total Vacancies',
                          value: `${positionCount} ${
                            positionCount === 1 ? 'Position' : 'Positions'
                          }`,
                          color: positionMeta.color,
                        },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <div
                            className="text-[9px] sm:text-[10px] xl:text-xs uppercase tracking-wider mb-1"
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                          >
                            {label}
                          </div>
                          <div
                            className={`text-xs sm:text-sm xl:text-base font-medium ${
                              label === 'Department' ? 'capitalize' : ''
                            }`}
                            style={{
                              color: color ?? 'white',
                              fontWeight: color ? 700 : 500,
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div
                    className="h-[1px] mb-5 xl:mb-6"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(212,160,23,0.2), transparent)',
                    }}
                  />

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl
                                 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Icons.ChevronLeft className="w-4 h-4" />
                      Back to Jobs
                    </button>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Save */}
                      <button
                        onClick={() => setIsSaved(!isSaved)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                                   transition-all duration-300 hover:scale-110"
                        style={{
                          background: isSaved
                            ? 'rgba(239,68,68,0.15)'
                            : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${
                            isSaved
                              ? 'rgba(239,68,68,0.3)'
                              : 'rgba(255,255,255,0.1)'
                          }`,
                          color: isSaved ? '#ef4444' : 'rgba(255,255,255,0.5)',
                        }}
                        title={isSaved ? 'Remove from saved' : 'Save job'}
                      >
                        <Icons.Heart
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill={isSaved ? '#ef4444' : 'transparent'}
                        />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: job.title,
                              text: `Check out: ${job.title} at ${companyName}`,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied!');
                          }
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                                   transition-all duration-300 hover:scale-110"
                        style={{
                          background: 'rgba(212,160,23,0.1)',
                          border: '1px solid rgba(212,160,23,0.2)',
                          color: '#d4a017',
                        }}
                        title="Share job"
                      >
                        <Icons.Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {/* Apply */}
                      <Link
                        to={contactUrl}
                        onClick={onClose}
                        className="btn-gold px-5 py-2.5 sm:px-8 sm:py-3 rounded-xl
                                   flex items-center gap-2 text-sm sm:text-base font-bold"
                      >
                        <Icons.Send className="w-4 h-4" />
                        <span>Apply Now</span>
                      </Link>
                    </div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 text-center text-xs xl:text-sm"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    You'll be redirected to our contact page to submit your
                    application
                  </motion.p>
                </div>

                <div
                  className="h-[2px]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #d4a017, transparent)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}