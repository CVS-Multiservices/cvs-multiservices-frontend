import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { features } from '../Data';
import { COLORS } from '../../theme';

export function FoundationsSection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={styles.section}
    >
      {/* Glow circle top-left */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
        style={styles.glowCircleLeft}
      />
      {/* Glow circle bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
        style={styles.glowCircleRight}
      />

      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={styles.gridPattern}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">

        {/* ── Heading ── */}
        <div className="text-center mb-12 lg:mb-16 xl:mb-20">
          <AnimatedSection>
            <div className="section-label mx-auto w-fit">Our Foundation</div>
            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4"
            >
              Our Foundations —{' '}
              <span className="grad-gold">Our Future</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mb-6" />
            <p
              className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
              style={styles.paragraph}
            >
              The people who dream are the people who succeed. Leading India's
              industrial services since 2017.
            </p>
          </AnimatedSection>
        </div>

        {/* ── Cards Grid — full width, no max-w cap ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6 2xl:gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1} direction="up">
              <div
                className="card-premium rounded-2xl xl:rounded-3xl p-5 sm:p-6 xl:p-7 2xl:p-8
                           h-full group cursor-pointer relative overflow-hidden flex flex-col"
              >
                {/* Background number */}
                <div
                  className="absolute top-2 right-4 font-rajdhani font-bold
                             text-6xl xl:text-7xl 2xl:text-8xl opacity-[0.04] select-none
                             leading-none pointer-events-none"
                  style={styles.number}
                >
                  {f.num}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16
                             rounded-xl xl:rounded-2xl flex items-center justify-center
                             mb-4 xl:mb-5 2xl:mb-6 flex-shrink-0
                             transition-all duration-300 group-hover:scale-110"
                  style={styles.iconBox}
                >
                  <f.icon
                    className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7
                               transition-colors duration-300"
                    style={styles.icon}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-white mb-2 xl:mb-3
                             text-sm xl:text-base 2xl:text-lg
                             transition-colors duration-300 group-hover:text-yellow-300"
                >
                  {f.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs xl:text-sm 2xl:text-base leading-relaxed flex-1"
                  style={styles.desc}
                >
                  {f.desc}
                </p>

                {/* Bottom hover line */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0
                             group-hover:w-full transition-all duration-500"
                  style={styles.bottomLine}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="text-center mt-10 lg:mt-12 xl:mt-16">
          <AnimatedSection>
            <Link
              to="/services"
              className="btn-gold inline-flex items-center gap-2
                         px-8 xl:px-10 py-3.5 xl:py-4 rounded-xl xl:rounded-2xl
                         text-sm xl:text-base font-bold"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    background: COLORS.primary,
  },
  glowCircleLeft: {
    background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
    transform: 'translate(-30%, -30%)',
  },
  glowCircleRight: {
    background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
    transform: 'translate(30%, 30%)',
  },
  gridPattern: {
    backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold ?? COLORS.accent} 1px, transparent 0)`,
    backgroundSize: '40px 40px',
  },
  paragraph: {
    color: COLORS.textSecondary,
  },
  number: {
    color: COLORS.accent,
  },
  iconBox: {
    background: COLORS.cardHover,
    border: `1px solid ${COLORS.border}`,
  },
  icon: {
    color: COLORS.accent,
  },
  desc: {
    color: COLORS.textMuted,
  },
  bottomLine: {
    background: `linear-gradient(90deg, ${COLORS.accent}, transparent)`,
  },
};