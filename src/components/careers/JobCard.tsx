import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

function formatSalary(
  salary: { min: number; max: number; currency: string } | undefined
): string {
  if (!salary) return 'Salary not disclosed';

  const formatNum = (num: number) => {
    if (salary.currency === 'INR') {
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
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
  return `${symbol}${formatNum(salary.min)} - ${symbol}${formatNum(salary.max)}`;
}

function getDaysAgo(dateStr: string | undefined): string {
  if (!dateStr) return 'Recently';
  const posted = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden h-full flex flex-col relative"
      style={{
        background: job.isFeatured
          ? 'linear-gradient(135deg, rgba(212,160,23,0.08) 0%, rgba(10,36,71,0.6) 100%)'
          : 'rgba(10,36,71,0.4)',
        border: `1px solid ${
          job.isFeatured ? 'rgba(212,160,23,0.25)' : 'rgba(212,160,23,0.08)'
        }`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(212,160,23,0.4)';
        el.style.boxShadow =
          '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(212,160,23,0.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = job.isFeatured
          ? 'rgba(212,160,23,0.25)'
          : 'rgba(212,160,23,0.08)';
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      }}
    >
      <div className="p-4 sm:p-5 xl:p-6 flex-1 flex flex-col">

        {/* ── Badges ── */}
        {(job.isUrgent || job.isFeatured) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.isUrgent && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px]
                           font-bold uppercase tracking-wider flex items-center gap-1"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
              >
                <Icons.Zap className="w-3 h-3 flex-shrink-0" />
                Urgent
              </span>
            )}
            {job.isFeatured && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px]
                           font-bold uppercase tracking-wider flex items-center gap-1"
                style={{
                  background: 'rgba(212,160,23,0.15)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  color: '#d4a017',
                }}
              >
                <Icons.Star className="w-3 h-3 flex-shrink-0" />
                Featured
              </span>
            )}
          </div>
        )}

        {/* ── Company Logo & Info ── */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center
                       justify-center overflow-hidden flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,160,23,0.15)',
            }}
          >
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              />
            ) : (
              <Icons.Building2
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: '#d4a017' }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] sm:text-xs xl:text-sm font-medium truncate"
              style={{ color: 'rgba(212,160,23,0.7)' }}
            >
              {job.company?.name ?? 'CVS Multi Services'}
            </p>
            <p
              className="text-[10px] sm:text-[11px] truncate"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {job.company?.industry ?? 'Industrial Services'}
            </p>
          </div>
        </div>

        {/* ── Job Title ── */}
        <h3
          className="font-rajdhani font-bold text-lg sm:text-xl xl:text-2xl text-white mb-3
                     group-hover:text-yellow-300 transition-colors duration-300 line-clamp-2
                     leading-tight"
        >
          {job.title}
        </h3>

        {/* ── Location + Type ── */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          {job.location?.name && (
            <span
              className="flex items-center gap-1.5 text-[11px] sm:text-xs xl:text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Icons.MapPin
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                style={{ color: '#d4a017' }}
              />
              {job.location.name}
            </span>
          )}
          {job.type?.name && (
            <span
              className="flex items-center gap-1.5 text-[11px] sm:text-xs xl:text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Icons.Briefcase
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                style={{ color: '#d4a017' }}
              />
              {job.type.name}
            </span>
          )}
        </div>

        {/* ── Experience & Salary pills ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.experience?.name && (
            <span
              className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] xl:text-xs font-medium"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#3b82f6',
              }}
            >
              {job.experience.name}
            </span>
          )}
          <span
            className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] xl:text-xs font-semibold"
            style={{
              background: 'rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.2)',
              color: '#25d366',
            }}
          >
            {formatSalary(job.salary)}/yr
          </span>
        </div>

        {/* ── Description preview ── */}
        {job.description && (
          <p
            className="text-xs sm:text-sm xl:text-base leading-relaxed mb-4 flex-1 line-clamp-2"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {job.description}
          </p>
        )}

        {/* ── Skills ── */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] xl:text-xs font-medium"
                style={{
                  background: 'rgba(212,160,23,0.06)',
                  color: 'rgba(212,160,23,0.7)',
                  border: '1px solid rgba(212,160,23,0.12)',
                }}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] xl:text-xs font-medium"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between pt-3 sm:pt-4"
          style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span
              className="flex items-center gap-1 text-[10px] sm:text-[11px] xl:text-xs"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <Icons.Clock className="w-3 h-3 flex-shrink-0" />
              {getDaysAgo(job.postedDate)}
            </span>

            {job.positionCount !== undefined && (
              <span
                className="flex items-center gap-1 text-[10px] sm:text-[11px] xl:text-xs"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <Icons.Users className="w-3 h-3 flex-shrink-0" />
                {job.positionCount}{' '}
                {job.positionCount === 1 ? 'Position' : 'Positions'}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold flex-shrink-0"
            style={{ color: '#d4a017' }}
          >
            <span>View</span>
            <Icons.ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div
        className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          background: job.isUrgent
            ? 'linear-gradient(90deg, #ef4444, #d4a017, transparent)'
            : 'linear-gradient(90deg, #d4a017, transparent)',
        }}
      />
    </motion.div>
  );
}