import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  AlertCircle,
  CheckCircle2,
  Eye,
  Heart,
  Lock,
  Star,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { WhatsAppButton } from '@/components/ui';

const managementDuties = [
  'A safe working environment',
  'Safe systems of work',
  'Facilities for the welfare of workers',
  'Information, instruction, training and supervision',
  'Cooperation with workers in matters relating to health and safety',
  'Continuous improvement through effective safety management',
];

const workerDuties = [
  'Comply with safe work practices',
  'Take reasonable care of the health and safety of themselves and others',
  'Wear personal protective equipment where necessary',
  'Follow management health and safety directions',
  'Not misuse safety equipment',
  'Report all accidents immediately',
];

const commitments = [
  { icon: Shield, title: 'Safety First', desc: 'We prioritize the safety of every worker, contractor, and visitor on our sites.' },
  { icon: Heart, title: 'Worker Welfare', desc: 'Ensuring the welfare and wellbeing of all employees is our fundamental obligation.' },
  { icon: Eye, title: 'Transparency', desc: 'Open communication and transparent reporting of all safety incidents and near misses.' },
  { icon: Lock, title: 'Compliance', desc: 'Full adherence to International Oil & Gas Company Standards and HSE codes.' },
  { icon: Star, title: 'Excellence', desc: 'Continuous improvement through effective safety management systems and training.' },
  { icon: AlertCircle, title: 'Zero Tolerance', desc: 'Zero tolerance policy for unsafe practices, violations, and non-compliance.' },
];

export default function HSEPolicies() {
  return (
    <div style={{ background: '#080f1e' }}>
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="relative pt-32 sm:pt-36 lg:pt-40 xl:pt-44
                   pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0a2447 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,160,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, #d4a017, transparent)' }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label mx-auto w-fit mb-4">Safety & Compliance</div>
            <h1
              className="font-playfair text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl
                         font-bold text-white mb-4"
            >
              Policies
            </h1>
            <div className="divider-gold w-24 mx-auto mb-6" />
            <p
              className="max-w-2xl xl:max-w-3xl mx-auto text-sm sm:text-base xl:text-lg"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Health, Safety, and Environment: Our unwavering commitment to protecting people and the
              planet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Obligations ── */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: '#080f1e' }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #1a5fb4, transparent)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            <AnimatedSection>
              <div
                className="p-6 sm:p-8 xl:p-10 2xl:p-12 rounded-3xl relative overflow-hidden"
                style={{
                  background: 'rgba(10,36,71,0.5)',
                  border: '1px solid rgba(212,160,23,0.15)',
                }}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: 'linear-gradient(90deg, #0f3d7a, #d4a017, #0f3d7a)' }}
                />

                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl
                               flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '1px solid rgba(212,160,23,0.25)',
                    }}
                  >
                    <Shield
                      className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                      style={{ color: '#d4a017' }}
                    />
                  </div>
                  <div>
                    <div className="section-label mb-1" style={{ fontSize: '10px' }}>
                      Core Policy
                    </div>
                    <h2
                      className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold text-white"
                    >
                      Obligations
                    </h2>
                  </div>
                </div>

                <div
                  className="h-[1px] mb-6 xl:mb-8"
                  style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                />

                <p
                  className="text-sm sm:text-base xl:text-lg leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Management is firmly committed to a policy enabling all work activities to be
                  carried out safely and with all possible measures taken to remove or reduce risks to
                  the health, safety and welfare of workers, contractors, authorised visitors and
                  anyone else who may be affected by our operations.
                </p>
                <p
                  className="mt-4 sm:mt-5 text-sm sm:text-base xl:text-lg leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  We are committed to ensuring we comply with the Health Safety and Environment codes
                  of Practice as per{' '}
                  <span style={{ color: '#d4a017' }} className="font-semibold">
                    International Oil & Gas Companies Standards
                  </span>
                  .
                </p>

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-40 h-40 xl:w-56 xl:h-56 opacity-[0.04] pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at bottom right, #d4a017, transparent)',
                  }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Commitments ── */}
      <section className="py-8 pb-20 lg:pb-28" style={{ background: '#080f1e' }}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <AnimatedSection>
            <div className="text-center mb-10 lg:mb-14 2xl:mb-16">
              <div className="section-label mx-auto w-fit mb-4">Our Pledge</div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-4"
              >
                Our <span className="grad-gold">Commitments</span>
              </h2>
              <div className="divider-gold w-24 mx-auto" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
            {commitments.map((c, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="p-5 sm:p-6 xl:p-8 rounded-2xl xl:rounded-3xl group
                             transition-all duration-300 relative overflow-hidden h-full flex flex-col"
                  style={{
                    background: 'rgba(10,36,71,0.4)',
                    border: '1px solid rgba(212,160,23,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(212,160,23,0.3)';
                    el.style.boxShadow =
                      '0 20px 60px rgba(0,0,0,0.4), 0 0 20px rgba(212,160,23,0.07)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(212,160,23,0.1)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl
                               flex items-center justify-center mb-4 xl:mb-5
                               transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(212,160,23,0.08)',
                      border: '1px solid rgba(212,160,23,0.2)',
                    }}
                  >
                    <c.icon
                      className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7"
                      style={{ color: '#d4a017' }}
                    />
                  </div>

                  <h3
                    className="font-semibold text-white text-base sm:text-lg xl:text-xl mb-2 xl:mb-3"
                  >
                    {c.title}
                  </h3>

                  <p
                    className="text-xs sm:text-sm xl:text-base leading-relaxed flex-1"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {c.desc}
                  </p>

                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full
                               transition-all duration-500"
                    style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Responsibilities ── */}
      <section
        className="py-20 lg:py-28 relative"
        style={{ background: '#050d1a' }}
      >
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Heading */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16 2xl:mb-20">
              <div className="section-label mx-auto w-fit mb-4">Accountability</div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-4"
              >
                <span className="grad-gold">Responsibilities</span>
              </h2>
              <div className="divider-gold w-24 mx-auto" />
            </div>
          </AnimatedSection>

          {/* Two-col grid */}
          <div className="grid lg:grid-cols-2 gap-6 xl:gap-8 2xl:gap-10">
            {/* Management */}
            <AnimatedSection direction="left">
              <div
                className="p-5 sm:p-6 xl:p-8 2xl:p-10 rounded-3xl h-full relative overflow-hidden"
                style={{
                  background: 'rgba(10,36,71,0.5)',
                  border: '1px solid rgba(26,95,180,0.2)',
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #1a5fb4, transparent)' }}
                />

                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl
                               flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(26,95,180,0.15)',
                      border: '1px solid rgba(26,95,180,0.3)',
                    }}
                  >
                    <Users
                      className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                      style={{ color: '#1a5fb4' }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold text-white"
                    >
                      Management
                    </h3>
                    <p
                      className="text-[10px] sm:text-xs xl:text-sm"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Management will provide and maintain:
                    </p>
                  </div>
                </div>

                <div
                  className="h-[1px] mb-5 sm:mb-6"
                  style={{ background: 'linear-gradient(90deg, rgba(26,95,180,0.5), transparent)' }}
                />

                <ul className="space-y-3 xl:space-y-4">
                  {managementDuties.map((duty, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-3 xl:p-4 rounded-xl"
                      style={{
                        background: 'rgba(26,95,180,0.04)',
                        border: '1px solid rgba(26,95,180,0.08)',
                      }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: '#1a5fb4' }}
                      />
                      <span
                        className="text-xs sm:text-sm xl:text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        {duty}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Workers */}
            <AnimatedSection direction="right">
              <div
                className="p-5 sm:p-6 xl:p-8 2xl:p-10 rounded-3xl h-full relative overflow-hidden"
                style={{
                  background: 'rgba(10,36,71,0.5)',
                  border: '1px solid rgba(212,160,23,0.2)',
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                />

                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-2xl
                               flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '1px solid rgba(212,160,23,0.25)',
                    }}
                  >
                    <Shield
                      className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                      style={{ color: '#d4a017' }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold text-white"
                    >
                      Workers
                    </h3>
                    <p
                      className="text-[10px] sm:text-xs xl:text-sm"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Each worker has an obligation to:
                    </p>
                  </div>
                </div>

                <div
                  className="h-[1px] mb-5 sm:mb-6"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212,160,23,0.5), transparent)',
                  }}
                />

                <ul className="space-y-3 xl:space-y-4">
                  {workerDuties.map((duty, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-3 xl:p-4 rounded-xl"
                      style={{
                        background: 'rgba(212,160,23,0.04)',
                        border: '1px solid rgba(212,160,23,0.08)',
                      }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: '#d4a017' }}
                      />
                      <span
                        className="text-xs sm:text-sm xl:text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        {duty}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Standards banner */}
          <AnimatedSection>
            <div
              className="mt-8 sm:mt-10 xl:mt-12 p-6 sm:p-8 xl:p-10 rounded-3xl text-center
                         relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10,36,71,0.6), rgba(5,13,26,0.8))',
                border: '1px solid rgba(212,160,23,0.15)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, #d4a017, transparent)',
                }}
              />

              <AlertCircle
                className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 mx-auto mb-4"
                style={{ color: '#d4a017' }}
              />

              <h4
                className="font-playfair text-lg sm:text-xl xl:text-2xl 2xl:text-3xl
                           font-bold text-white mb-3"
              >
                International Standards Compliance
              </h4>

              <p
                className="text-xs sm:text-sm xl:text-base 2xl:text-lg
                           max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                We comply with the Health Safety and Environment codes of Practice as per
                International Oil & Gas Companies Standards, ensuring world-class safety across all
                our operations.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}