import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Feature } from '../../types';
import { COLORS } from '../../theme';

interface ServiceCardProps {
  service: Feature;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const isEven = (service.index ?? 0) % 2 === 0;

  // Resolve icons from string
  const ServiceIcon = (Icons as any)[service.icon ?? ''] || Icons.Settings;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.005 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl xl:rounded-3xl overflow-hidden
                  flex flex-col md:flex-row
                  ${isEven ? '' : 'md:flex-row-reverse'}
                  relative
                  md:items-stretch`}
      style={{
        background: COLORS.cardBgMedium,
        border: `1px solid ${COLORS.borderLight}`,
        boxShadow: COLORS.serviceCardShadow,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.goldBorderMedium;
        el.style.boxShadow = COLORS.serviceCardShadowHover;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.borderLight;
        el.style.boxShadow = COLORS.serviceCardShadow;
      }}
    >
      {/* ── Image Section (full height on desktop) ── */}
      <div
        className="relative w-full md:w-2/5 xl:w-[38%] 2xl:w-[36%]
                   h-56 sm:h-64
                   md:h-auto md:self-stretch
                   overflow-hidden flex-shrink-0"
      >
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Desktop gradient overlay */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: isEven
              ? `linear-gradient(to right, transparent 40%, ${COLORS.secondary}e6 100%)`
              : `linear-gradient(to left,  transparent 40%, ${COLORS.secondary}e6 100%)`,
          }}
        />

        {/* Mobile gradient overlay */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: `linear-gradient(to top, ${COLORS.primary}, transparent 60%)`,
          }}
        />

        {/* Service Number Badge */}
        <div className={`absolute top-4 ${isEven ? 'left-4' : 'right-4 md:left-4'}`}>
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-xl
                       flex items-center justify-center
                       font-rajdhani font-bold text-lg sm:text-xl xl:text-2xl"
            style={{
              background: COLORS.blackOverlay,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${service.color ?? COLORS.accent}50`,
              color: service.color ?? COLORS.accent,
            }}
          >
            0{(service.index ?? 0)}
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div
        className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14
                   flex flex-col justify-center"
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 xl:mb-5">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-xl
                       flex items-center justify-center flex-shrink-0"
            style={{
              background: `${service.color ?? COLORS.accent}15`,
              border: `1px solid ${service.color ?? COLORS.accent}30`,
            }}
          >
            <ServiceIcon
              className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7"
              style={{ color: service.color ?? COLORS.accent }}
            />
          </div>
          <h4
            className="font-rajdhani font-bold
                       text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl
                       group-hover:text-yellow-300 transition-colors duration-300 leading-tight"
            style={{ color: COLORS.white }}
          >
            {service.title}
          </h4>
        </div>

        {/* Description */}
        <p
          className="text-sm sm:text-base xl:text-lg 2xl:text-xl
             leading-relaxed mb-5 xl:mb-6 max-w-xl xl:max-w-2xl text-justify"
          style={{ color: COLORS.textSecondary }}
        >
          {service.shortDesc}
        </p>

        {/* Sub-service tags */}
        {service.subServices && service.subServices.length > 0 && (
          <div className="flex flex-wrap gap-2 xl:gap-2.5 mb-5 xl:mb-6">
            {service.subServices.map((sub) => {
              const SubIcon = (Icons as any)[sub.icon ?? ''] || Icons.Settings;
              return (
                <span
                  key={sub.id}
                  className="text-[11px] xl:text-xs px-3 py-1.5 rounded-full font-medium
                             flex items-center gap-1.5
                             transition-all duration-300 hover:scale-105"
                  style={{
                    background: COLORS.whiteFaint,
                    color: COLORS.textLight70,
                    border: `1px solid ${COLORS.whiteSoft}`,
                  }}
                >
                  <SubIcon
                    className="w-3 h-3 xl:w-3.5 xl:h-3.5"
                    style={{ color: service.color ?? COLORS.accent }}
                  />
                  {sub.title}
                </span>
              );
            })}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between gap-4">
          <span
            className="text-[11px] xl:text-xs px-2.5 py-1 xl:px-3 xl:py-1.5
                       rounded-full font-medium"
            style={{
              background: COLORS.serviceTagBg,
              color: COLORS.serviceTagText,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {service.subServices?.length ?? 0} Sub-Services
          </span>

          <div
            className="flex items-center gap-2 text-sm xl:text-base font-semibold
                       transition-all duration-300 group-hover:gap-3 whitespace-nowrap"
            style={{ color: COLORS.accent }}
          >
            <span>Explore Service</span>
            <Icons.ChevronRight
              className="w-4 h-4 xl:w-5 xl:h-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px]
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500
                    ${isEven ? 'origin-left' : 'origin-right'}`}
        style={{
          background: isEven
            ? `linear-gradient(90deg,  ${service.color ?? COLORS.accent}, transparent)`
            : `linear-gradient(270deg, ${service.color ?? COLORS.accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}