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
                    Join us with the professionals who are shaping the future of industrial services.
                  </p>
                </div>
              </div>

         
              {/* Extra floating badge for xl+ screens */}
             
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}