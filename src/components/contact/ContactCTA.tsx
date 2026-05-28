import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Headphones,
  FileText,
  Clock3,
  ShieldCheck,
  MapPinned,
} from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Requirement Review',
    desc: 'We carefully review your enquiry, project scope, location, and timeline to understand exactly what you need.',
  },
  {
    icon: Headphones,
    title: 'Right Team Connect',
    desc: 'Your message is routed to the relevant specialists so you receive practical guidance, not a generic reply.',
  },
  {
    icon: FileText,
    title: 'Clear Next Step',
    desc: 'Depending on your need, we respond with consultation, quotation, technical discussion, or site-visit planning.',
  },
];

const highlights = [
  {
    icon: Clock3,
    label: 'Fast Response',
  },
  {
    icon: ShieldCheck,
    label: 'Professional Guidance',
  },
  {
    icon: MapPinned,
    label: 'India + UAE Support',
  },
];

export default function ContactCTA() {
  return (
    <section
      className="py-14 lg:py-20 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #050d1a 0%, #0a2447 50%, #050d1a 100%)',
        borderTop: '1px solid rgba(212,160,23,0.08)',
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)',
        }}
      />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-10 lg:mb-12">
              <div className="section-label mx-auto w-fit mb-3">
                What Happens Next
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-4">
                Once You <span className="grad-gold">Reach Out</span>
              </h2>
              <div className="divider-gold w-20 mx-auto mb-5" />
              <p
                className="text-xs sm:text-sm xl:text-base max-w-2xl xl:max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                We keep the process simple, professional, and transparent
                so your enquiry quickly turns into the right next step.
              </p>
            </div>
          </AnimatedSection>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;

              return (
                <AnimatedSection key={step.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="h-full p-6 xl:p-7 rounded-2xl relative overflow-hidden group"
                    style={{
                      background: 'rgba(10,36,71,0.45)',
                      border: '1px solid rgba(212,160,23,0.12)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    }}
                  >
                    {/* Card top glow line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px]"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)',
                      }}
                    />

                    <div
                      className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(212,160,23,0.08)',
                        border: '1px solid rgba(212,160,23,0.22)',
                      }}
                    >
                      <Icon
                        className="w-5 h-5 xl:w-6 xl:h-6"
                        style={{ color: '#d4a017' }}
                      />
                    </div>

                    <div
                      className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2"
                      style={{ color: 'rgba(212,160,23,0.75)' }}
                    >
                      Step {i + 1}
                    </div>

                    <h3 className="text-white font-semibold text-base xl:text-lg mb-3">
                      {step.title}
                    </h3>

                    <p
                      className="text-xs sm:text-sm xl:text-base leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {step.desc}
                    </p>

                    <div
                      className="mt-5 h-[2px] w-12 group-hover:w-full transition-all duration-500"
                      style={{
                        background:
                          'linear-gradient(90deg, #d4a017, transparent)',
                      }}
                    />
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Bottom reassurance panel */}
          <AnimatedSection>
            <div
              className="mt-8 xl:mt-10 p-6 sm:p-7 xl:p-8 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,160,23,0.08), rgba(10,36,71,0.35))',
                border: '1px solid rgba(212,160,23,0.14)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              }}
            >
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 xl:gap-8 items-center">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold text-white mb-3">
                    No Noise. Just the{' '}
                    <span className="grad-gold">Right Response.</span>
                  </h3>
                  <p
                    className="text-xs sm:text-sm xl:text-base leading-relaxed max-w-2xl"
                    style={{ color: 'rgba(255,255,255,0.58)' }}
                  >
                    Once you submit your enquiry above, our team reviews it
                    carefully and connects you with the right department.
                    Ensuring you receive a meaningful response tailored to your
                    project, service need, or business requirement.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(212,160,23,0.08)',
                            border: '1px solid rgba(212,160,23,0.2)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: '#d4a017' }}
                          />
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,160,23,0.18), transparent)',
        }}
      />
    </section>
  );
}