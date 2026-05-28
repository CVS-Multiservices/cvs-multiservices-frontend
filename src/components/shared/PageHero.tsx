import { motion } from 'framer-motion';
import { COLORS } from '../../theme';

interface PageHeroProps {
  title: string;
  subtitle: string;
  description?: string;
}

export function PageHero({ title, subtitle, description }: PageHeroProps) {
  return (
    <section
      className="relative pt-32 sm:pt-36 lg:pt-40 xl:pt-44 pb-16 sm:pb-20 lg:pb-24 xl:pb-28
                 overflow-hidden"
      style={{ background: COLORS.pageHeroBgGradient }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${COLORS.gridGold} 1px, transparent 1px),
                            linear-gradient(90deg, ${COLORS.gridGold} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: COLORS.topAccentGradient }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full
                   opacity-[0.05] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[250px] h-[250px] rounded-full
                   opacity-[0.05] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
          transform: 'translate(50%, -50%)',
        }}
      />

      {/* ── Full-width responsive container ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Subtitle label */}
            <div className="section-label mx-auto w-fit mb-4 sm:mb-5">
              {subtitle}
            </div>

            {/* Main heading */}
            <h1
              className="font-playfair text-3xl sm:text-5xl lg:text-6xl
                         xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-5 leading-tight"
              style={{ color: COLORS.white }}
            >
              {title}
            </h1>

            {/* Gold divider */}
            <div className="divider-gold w-24 xl:w-32 mx-auto" />

            {/* Optional description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-5 sm:mt-6 xl:mt-8
                           text-sm sm:text-base xl:text-lg 2xl:text-xl
                           max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto
                           leading-relaxed"
                style={{ color: COLORS.textHalf }}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}