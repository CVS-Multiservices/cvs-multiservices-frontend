import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';

const trustPoints = [
  '27+ years of industrial expertise',
  'Pan-India project execution',
  '100% regulatory compliance',
];

export function AboutCTASection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.primary }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full
                   opacity-[0.05] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full
                   opacity-[0.05] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
          transform: 'translate(50%, -50%)',
        }}
      />

      {/* ── Full-width responsive container ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <AnimatedSection>
          <div
            className="rounded-3xl p-6 sm:p-10 lg:p-14 xl:p-16 2xl:p-20
                       relative overflow-hidden"
            style={{
              background: COLORS.cardBgMedium,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* Corner accents */}
            <div
              className="absolute top-0 left-0 w-40 h-40 xl:w-56 xl:h-56 opacity-[0.08] pointer-events-none"
              style={{
                background: `radial-gradient(circle at top left, ${COLORS.accent}, transparent)`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-40 h-40 xl:w-56 xl:h-56 opacity-[0.08] pointer-events-none"
              style={{
                background: `radial-gradient(circle at bottom right, ${COLORS.blueAccent}, transparent)`,
              }}
            />

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
              }}
            />

            {/* Content — stacked on mobile, two-col on xl */}
            <div className="relative z-10 flex flex-col xl:flex-row
                            items-center xl:items-start gap-8 xl:gap-14 2xl:gap-20">

              {/* Left: text block */}
              <div className="flex-1 text-center xl:text-left">
                <h2
                  className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                             font-bold mb-4 leading-tight"
                  style={{ color: COLORS.white }}
                >
                  Ready to{' '}
                  <span className="grad-gold">Partner</span> With Us?
                </h2>

                <div className="divider-gold w-20 mx-auto xl:mx-0 mb-6" />

                <p
                  className="text-sm sm:text-base xl:text-lg 2xl:text-xl
                             max-w-xl xl:max-w-none mb-6 mx-auto xl:mx-0 leading-relaxed"
                  style={{ color: COLORS.textHalf }}
                >
                  Join hundreds of satisfied clients who trust CVS Multi Services
                  for their industrial needs. Let's discuss how we can help your
                  business grow.
                </p>

                {/* Trust pills */}
                <div className="flex flex-wrap justify-center xl:justify-start gap-3">
                  {trustPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                 text-xs sm:text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${COLORS.borderLight}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: COLORS.accent }} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA card */}
              <div
                className="w-full xl:w-auto xl:min-w-[300px] 2xl:min-w-[360px]
                           rounded-2xl p-5 sm:p-6 xl:p-8 flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${COLORS.goldBorderSoft}`,
                }}
              >
                <h3
                  className="font-rajdhani text-lg sm:text-xl xl:text-2xl font-bold mb-2
                             text-center xl:text-left"
                  style={{ color: COLORS.white }}
                >
                  Start a Conversation
                </h3>
                <p
                  className="text-xs sm:text-sm xl:text-base mb-6 text-center xl:text-left"
                  style={{ color: COLORS.textHalf }}
                >
                  Our team typically responds within 24 hours.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/contact"
                    className="btn-gold w-full inline-flex items-center justify-center
                               gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold"
                  >
                    <span>Get In Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/services"
                    className="btn-outline-gold w-full inline-flex items-center justify-center
                               gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base"
                  >
                    <span>View Services</span>
                  </Link>
                </div>

                <p
                  className="text-[11px] text-center mt-4"
                  style={{ color: COLORS.textMuted }}
                >
                  No commitment required · Free consultation
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}