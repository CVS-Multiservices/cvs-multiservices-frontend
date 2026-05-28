import { motion } from 'framer-motion';
import AnimatedSection from '../AnimatedSection';
import { companyBenefits } from '../Data';
import { Heart } from 'lucide-react';

export function BenefitsSection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: '#050d1a' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Full-width responsive container ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12 lg:mb-16 2xl:mb-20">
            <div className="section-label mx-auto w-fit flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Employee Benefits
            </div>

            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                         font-bold text-white mb-4"
            >
              Why You'll{' '}
              <span className="grad-gold">Love Working Here</span>
            </h2>

            <div className="divider-gold w-24 mx-auto mb-6" />

            <p
              className="text-sm sm:text-base xl:text-lg 2xl:text-xl
                         max-w-2xl xl:max-w-3xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              We believe in taking care of our team. Here are some of the benefits you'll enjoy as
              part of the CVS family.
            </p>
          </div>
        </AnimatedSection>

        {/* Benefits Grid
            1 col  → mobile
            2 cols → sm
            4 cols → lg
            Then let the cards scale internally on xl+
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
          {companyBenefits.map((benefit, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 sm:p-6 xl:p-7 2xl:p-8 rounded-2xl xl:rounded-3xl
                           h-full transition-all duration-300 group flex flex-col"
                style={{
                  background: 'rgba(10,36,71,0.4)',
                  border: '1px solid rgba(212,160,23,0.08)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(212,160,23,0.3)';
                  el.style.boxShadow =
                    '0 20px 50px rgba(0,0,0,0.4), 0 0 20px rgba(212,160,23,0.06)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(212,160,23,0.08)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16
                             rounded-xl xl:rounded-2xl flex items-center justify-center
                             mb-4 xl:mb-5 transition-all duration-300 group-hover:scale-110
                             flex-shrink-0"
                  style={{
                    background: 'rgba(212,160,23,0.1)',
                    border: '1px solid rgba(212,160,23,0.2)',
                  }}
                >
                  <benefit.icon
                    className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7"
                    style={{ color: '#d4a017' }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-sm sm:text-base xl:text-lg 2xl:text-xl
                             text-white mb-2 xl:mb-3
                             group-hover:text-yellow-300 transition-colors duration-300"
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs sm:text-sm xl:text-base 2xl:text-lg
                             leading-relaxed flex-1"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}