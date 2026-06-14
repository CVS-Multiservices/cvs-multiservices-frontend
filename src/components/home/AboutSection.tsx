import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import aboutImg from '../../images/aboutimage.png';

const industries = [
  'Oilfield',
  'Municipalities',
  'Chemical Industries',
  'Textile Houses',
  'Crucible Industries',
  'Treatment Plants',
];

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: COLORS.primary }}>
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 2xl:gap-28 items-center">
          <AnimatedSection direction="left">
            <div className="section-label">About Us</div>

            <h2 className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4 leading-tight">
              About{' '}
              <span className="grad-gold">CVS Multi Services</span>
            </h2>

            <div className="divider-gold w-24 mb-6 lg:mb-8" />

            <p
              className="mb-6 leading-relaxed text-base xl:text-lg"
              style={{ color: COLORS.aboutTextSoft, textAlign: 'justify' }}
            >
              CVS Multi Services Private Limited started its journey in 2017 with humble beginnings as a supplier of cotton waste. With time and consistent effort, the company expanded into the supply of industrial safety goods, building a strong foundation in the market.
            </p>

            <p
              className="mb-6 leading-relaxed text-base xl:text-lg"
              style={{ color: COLORS.aboutTextSoft, textAlign: 'justify' }}
            >
              After successfully establishing these two ventures, the company identified a new opportunity in the development of Effluent Treatment Plants (ETPs). Recognizing it as a growing and promising industry, the company stepped into this space to expand its reach and move towards larger business opportunities.
            </p>

            {/* Industries */}
            <div className="mb-8 lg:mb-10">
              <p
                className="text-sm uppercase tracking-wider mb-4"
                style={{ color: COLORS.aboutGoldSoft }}
              >
                Industries we serve:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {industries.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: COLORS.accent }}
                    />
                    <span
                      className="text-sm xl:text-base"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          {/* ── Right: Image card ──────────────────────────────────── */}
          <AnimatedSection direction="right">
            <div
              className="relative rounded-3xl overflow-hidden animate-float w-full"
              style={{
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 40px 100px ${COLORS.shadowHeavy}`,
              }}
            >
              {/* Image — height scales with screen */}
              <img
                src={aboutImg}
                alt="Industrial"
                className="w-full object-cover h-[320px] sm:h-[400px] lg:h-[460px] xl:h-[520px] 2xl:h-[580px]"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 50%, ${COLORS.aboutOverlayDark} 100%)`,
                }}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}