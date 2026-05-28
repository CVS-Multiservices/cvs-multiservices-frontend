import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';

export function IntroSection() {
  return (
    <section className="py-16 lg:py-20 2xl:py-24 relative" style={{ background: COLORS.darkAlt }}>
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${COLORS.accent}, transparent)` }}
      />

      {/* Full-width responsive container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-center">
          <AnimatedSection>
            {/* Quote */}
            <p
              className="font-playfair text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl
                         italic font-light leading-relaxed mb-6"
              style={{ color: COLORS.goldTextSoft }}
            >
              "The people who dream are the people who succeed."
            </p>

            <div className="divider-gold w-16 mx-auto mb-6" />

            {/* Body */}
            <p
              className="text-base sm:text-lg xl:text-xl 2xl:text-2xl
                         leading-relaxed max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto"
              style={{ color: COLORS.textHalf }}
            >
              We are one of the leading firms named CVS Multi Services Private
              Limited, striving to become India's leading corporate house
              specialising in industrial services from effluent treatment
              plants and seismic surveys to waste management, industrial
              equipment, and safety materials.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}