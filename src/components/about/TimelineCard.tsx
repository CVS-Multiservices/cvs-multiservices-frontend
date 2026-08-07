import { motion } from 'framer-motion';
import { timelineEvents } from '../Data';
import { COLORS } from '../../theme';

interface TimelineCardProps {
  event: (typeof timelineEvents)[number];
  align: 'left' | 'right';
}

export function TimelineCard({ event, align }: TimelineCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-5 sm:p-6 xl:p-8 2xl:p-10 rounded-2xl xl:rounded-3xl group
                 transition-all duration-300 relative overflow-hidden h-full"
      style={{
        background: event.featured ? COLORS.featuredCardBg : COLORS.cardBgMedium,
        border: `1px solid ${event.featured ? COLORS.goldBorder25 : COLORS.dividerGold}`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.goldSoftBorder;
        el.style.boxShadow = COLORS.timelineCardShadowHover;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = event.featured ? COLORS.goldBorder25 : COLORS.dividerGold;
        el.style.boxShadow = 'none';
      }}
    >
      {/* Subtitle badge */}
      <div
        className={`text-[10px] xl:text-[11px] font-semibold uppercase tracking-widest
                    px-3 py-1 rounded-full w-fit mb-3 xl:mb-4
                    ${align === 'right' ? 'lg:ml-auto' : ''}`}
        style={{
          background: COLORS.dividerGold,
          border: `1px solid ${COLORS.goldSoftBg}`,
          color: COLORS.accent,
        }}
      >
        {event.subtitle}
      </div>

      {/* Title */}
      <h3
        className={`font-playfair text-lg sm:text-xl xl:text-2xl 2xl:text-3xl
                    font-bold mb-3 xl:mb-4 leading-tight
                    ${align === 'right' ? 'lg:text-right' : ''}`}
        style={{ color: COLORS.white }}
      >
        {event.title}
      </h3>

      {/* Divider */}
      <div
        className="h-[1px] mb-4 xl:mb-5"
        style={{
          background:
            align === 'right'
              ? `linear-gradient(90deg, transparent, ${COLORS.goldBorderStrong})`
              : `linear-gradient(90deg, ${COLORS.goldBorderStrong}, transparent)`,
        }}
      />

      {/* Description — always justified */}
      <p
        className="text-sm xl:text-base 2xl:text-lg leading-relaxed mb-4 xl:mb-6 text-justify"
        style={{ color: COLORS.textHalf }}
      >
        {event.description}
      </p>

      {/* Highlights */}
      <div
        className={`flex flex-wrap gap-2 xl:gap-2.5
                    ${align === 'right' ? 'lg:justify-end' : ''}`}
      >
        {event.highlights.map((h, i) => (
          <span
            key={i}
            className="text-[11px] xl:text-xs px-2.5 xl:px-3 py-1 rounded-full"
            style={{
              background: event.featured ? COLORS.dividerGold : COLORS.blueBg12,
              color: event.featured ? COLORS.goldTextMedium : COLORS.textMuted45,
              border: `1px solid ${event.featured ? COLORS.goldSoftBg : COLORS.blueBorder20}`,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Corner accent for featured */}
      {event.featured && (
        <div
          className={`absolute top-0 ${align === 'right' ? 'left-0' : 'right-0'}
                      w-28 h-28 xl:w-40 xl:h-40 opacity-[0.06] pointer-events-none`}
          style={{
            background: `radial-gradient(circle at ${
              align === 'right' ? 'top left' : 'top right'
            }, ${COLORS.accent}, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}