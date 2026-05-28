import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';

const ctaPoints = [
  '27+ years of industrial expertise',
  'Pan-India project execution',
  'Safety-first, compliance-led delivery',
];

export function CTASection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.ctaBgGradient }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Background glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${COLORS.accent}, transparent)` }}
      />

      {/* Full-width responsive container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
          <AnimatedSection>
            <div
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-14 2xl:p-16"
              style={{
                background: 'linear-gradient(135deg, rgba(5,13,26,0.92) 0%, rgba(10,22,40,0.88) 100%)',
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.08] pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
                  transform: 'translate(25%, -25%)',
                }}
              />

              <div className="grid xl:grid-cols-12 gap-8 xl:gap-12 items-center relative z-10">
                {/* Left side */}
                <div className="xl:col-span-8 text-center xl:text-left">
                  <div className="section-label mx-auto xl:mx-0 w-fit mb-6">
                    Get Started
                  </div>

                  <h2
                    className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-6"
                    style={{ color: COLORS.white }}
                  >
                    Ready to Work <span className="grad-gold">With Us?</span>
                  </h2>

                  <div className="divider-gold w-32 mx-auto xl:mx-0 mb-6" />

                  <p
                    className="text-base sm:text-lg xl:text-xl mb-8 max-w-3xl mx-auto xl:mx-0 leading-relaxed"
                    style={{ color: COLORS.textHalf }}
                  >
                    Partner with India's leading industrial service provider for your next project.
                    We deliver excellence, compliance, and long-term reliability in every engagement.
                  </p>

                  {/* Trust points */}
                  <div className="flex flex-wrap justify-center xl:justify-start gap-3">
                    {ctaPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: `1px solid ${COLORS.borderLight}`,
                          color: COLORS.textSecondary,
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.accent }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side CTA box */}
                <div className="xl:col-span-4">
                  <div
                    className="rounded-2xl p-5 sm:p-6 xl:p-7"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${COLORS.goldBorderSoft}`,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    }}
                  >
                    <h3
                      className="font-rajdhani text-xl xl:text-2xl font-bold mb-2 text-center xl:text-left"
                      style={{ color: COLORS.white }}
                    >
                      Start Your Next Project
                    </h3>

                    <p
                      className="text-sm xl:text-base mb-6 text-center xl:text-left"
                      style={{ color: COLORS.textHalf }}
                    >
                      Connect with our team for consultation, proposal, or service planning.
                    </p>

                    <div className="flex flex-col gap-3">
                      <Link
                        to="/contact"
                        className="btn-gold w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold"
                      >
                        <span>Contact Us Today</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>

                      <Link
                        to="/services"
                        className="btn-outline-gold w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base"
                      >
                        <span>View Services</span>
                      </Link>
                    </div>

                    <p
                      className="text-xs text-center xl:text-left mt-4"
                      style={{ color: COLORS.textMuted }}
                    >
                      Response within 24 hours for business inquiries
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                }}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}