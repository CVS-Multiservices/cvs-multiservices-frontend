import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Award, TrendingUp } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { whyJoinUsStats } from '../Data';

const statIcons = [Award, Users, Globe, TrendingUp];

export function WhyJoinUsSection() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: '#080f1e' }}
    >
      {/* Background accents */}
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full
                   opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #d4a017, transparent)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full
                   opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #1a5fb4, transparent)',
          transform: 'translate(50%, -50%)',
        }}
      />

      {/* ── Full-width responsive container ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 2xl:gap-24 items-center">

          {/* ── Left: Text content ── */}
          <AnimatedSection direction="left">
            <div className="section-label">Why CVS?</div>

            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                         font-bold text-white mb-4 leading-tight"
            >
              Build Your Career With{' '}
              <span className="grad-gold">Industry Leaders</span>
            </h2>

            <div className="divider-gold w-24 mb-6 xl:mb-8" />

            <p
              className="text-sm sm:text-base xl:text-lg leading-relaxed mb-4 xl:mb-5"
              style={{ color: 'rgba(255,255,255,0.55)',  textAlign: 'justify'  }}
            >
              At CVS Multi Services, we don't just offer jobs; we offer careers. For over 25 years,
              we've been at the forefront of industrial services in India, and now we're expanding
              globally.
            </p>
            <p
              className="text-sm sm:text-base xl:text-lg leading-relaxed mb-7 xl:mb-9"
              style={{ color: 'rgba(255,255,255,0.45)',  textAlign: 'justify' }}
            >
              Join a team that values innovation, safety, and professional growth. Whether you're a
              fresh graduate or an experienced professional, there's a place for you in our growing
              family.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 mb-7 xl:mb-9">
              {whyJoinUsStats.map((stat, idx) => {
                const Icon = statIcons[idx];
                return (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 xl:p-5 rounded-xl text-center"
                    style={{
                      background: 'rgba(212,160,23,0.05)',
                      border: '1px solid rgba(212,160,23,0.1)',
                    }}
                  >
                    <Icon
                      className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 mx-auto mb-2"
                      style={{ color: '#d4a017' }}
                    />
                    <div
                      className="text-xl sm:text-2xl xl:text-3xl font-bold font-rajdhani mb-0.5"
                      style={{ color: '#d4a017' }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/about"
              className="btn-outline-gold inline-flex items-center gap-2
                         px-6 py-3 xl:px-8 xl:py-3.5 rounded-xl text-sm xl:text-base"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5" />
            </Link>
          </AnimatedSection>

          {/* ── Right: Image ── */}
          <AnimatedSection direction="right">
            <div className="relative">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: '1px solid rgba(212,160,23,0.2)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop"
                  alt="Team collaboration"
                  className="w-full object-cover
                             h-[300px] sm:h-[380px] lg:h-[420px] xl:h-[500px] 2xl:h-[560px]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 40%, rgba(5,13,26,0.9) 100%)',
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <div
                    className="h-[1px] mb-3 sm:mb-4"
                    style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                  />
                  <p className="text-xs sm:text-sm xl:text-base text-white/70">
                    Join 500+ professionals who are shaping the future of industrial services.
                  </p>
                </div>
              </div>

              {/* Floating satisfaction card */}
              <motion.div
                className="absolute -top-5 -right-4 sm:-top-6 sm:-right-6 p-4 sm:p-5 xl:p-6 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                  boxShadow: '0 20px 50px rgba(212,160,23,0.3)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white font-rajdhani"
                >
                  98%
                </div>
                <div
                  className="text-[10px] sm:text-xs xl:text-sm text-white/80 uppercase tracking-wider"
                >
                  Employee Satisfaction
                </div>
              </motion.div>

              {/* Extra floating badge for xl+ screens */}
              <motion.div
                className="hidden xl:block absolute -bottom-6 -left-6 p-5 rounded-2xl"
                style={{
                  background: 'rgba(10,36,71,0.9)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="text-3xl font-bold font-rajdhani" style={{ color: '#d4a017' }}>
                  25+
                </div>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Years of Excellence
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}