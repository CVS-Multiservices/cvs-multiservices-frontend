import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const resumePoints = [
  'Reviewed by our HR team within 48 hours',
  'Matched against future openings automatically',
  'No commitment required to apply',
];

export function CareersCTASection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #050d1a 0%, #0a2447 50%, #050d1a 100%)',
      }}
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 w-full h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #d4a017, transparent)' }}
      />

      {/* ── Full-width responsive container ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <AnimatedSection>
            <div
              className="rounded-3xl p-6 sm:p-10 lg:p-14 xl:p-16 2xl:p-20
                         relative overflow-hidden"
              style={{
                background: 'rgba(10,36,71,0.5)',
                border: '1px solid rgba(212,160,23,0.15)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              }}
            >
              {/* Corner accents */}
              <div
                className="absolute top-0 left-0 w-40 h-40 xl:w-56 xl:h-56
                           opacity-[0.08] pointer-events-none"
                style={{ background: 'radial-gradient(circle at top left, #d4a017, transparent)' }}
              />
              <div
                className="absolute bottom-0 right-0 w-40 h-40 xl:w-56 xl:h-56
                           opacity-[0.08] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at bottom right, #1a5fb4, transparent)',
                }}
              />
              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, #d4a017, transparent)' }}
              />

              {/* ── Two-col on xl+, stacked below ── */}
              <div className="relative z-10 flex flex-col xl:flex-row
                              items-center xl:items-start gap-8 xl:gap-14 2xl:gap-20">

                {/* Left: text content */}
                <div className="flex-1 text-center xl:text-left">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20
                               rounded-2xl flex items-center justify-center
                               mb-5 sm:mb-6 mx-auto xl:mx-0"
                    style={{
                      background: 'rgba(212,160,23,0.15)',
                      border: '1px solid rgba(212,160,23,0.3)',
                    }}
                  >
                    <FileText
                      className="w-7 h-7 sm:w-8 sm:h-8 xl:w-10 xl:h-10"
                      style={{ color: '#d4a017' }}
                    />
                  </div>

                  <h2
                    className="font-playfair text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl
                               font-bold text-white mb-4 leading-tight"
                  >
                    Can't Find the Right{' '}
                    <span className="grad-gold">Position?</span>
                  </h2>

                  <div className="divider-gold w-20 mx-auto xl:mx-0 mb-6" />

                  <p
                    className="text-sm sm:text-base xl:text-lg 2xl:text-xl
                               mb-7 max-w-xl xl:max-w-none mx-auto xl:mx-0 leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    We're always looking for talented individuals. Send us your resume and we'll reach
                    out when a suitable position opens up.
                  </p>

                  {/* Trust points */}
                  <div className="flex flex-col items-center xl:items-start gap-2.5 xl:gap-3">
                    {resumePoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs sm:text-sm xl:text-base"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: '#d4a017' }}
                        />
                        {point}
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
                    border: '1px solid rgba(212,160,23,0.2)',
                  }}
                >
                  <h3
                    className="font-rajdhani text-lg sm:text-xl xl:text-2xl font-bold mb-2
                               text-center xl:text-left text-white"
                  >
                    Submit Your Resume
                  </h3>
                  <p
                    className="text-xs sm:text-sm xl:text-base mb-6 text-center xl:text-left"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    Our team reviews every application personally.
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* Primary CTA */}
                    <Link
                      to="/contact"
                      className="btn-gold w-full inline-flex items-center justify-center
                                 gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                      to="/"
                      className="w-full inline-flex items-center justify-center
                                 px-8 py-4 rounded-xl text-sm sm:text-base font-semibold
                                 transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(212,160,23,0.4)',
                        color: '#d4a017',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'rgba(212,160,23,0.1)';
                        el.style.borderColor = '#d4a017';
                        el.style.boxShadow = '0 0 20px rgba(212,160,23,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'transparent';
                        el.style.borderColor = 'rgba(212,160,23,0.4)';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      Back to Home
                    </Link>
                  </div>

                  <p
                    className="text-[11px] text-center mt-4"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    No commitment required · Free to apply
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}