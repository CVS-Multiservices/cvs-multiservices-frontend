import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const infoItems = [
  { label: 'Founded', value: '2002' },
  { label: 'Headquarters', value: 'Mehsana, GJ' },
  { label: 'Certifications', value: 'ISO 9001' },
  { label: 'Coverage', value: 'Pan India' },
];

export function PeopleSection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#080f1e' }}>
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #d4a017, transparent)', transform: 'translate(40%, -50%)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <AnimatedSection direction="left">
            <div className="relative">
              <div
                className="relative rounded-3xl overflow-hidden animate-float-b"
                style={{
                  border: '1px solid rgba(26,95,180,0.3)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&h=560&fit=crop"
                  alt="Team"
                  className="w-full object-cover"
                  style={{ height: '460px' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,13,26,0.9) 100%)' }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div
                    className="h-[1px] mb-4"
                    style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                  />
                  <p className="text-sm text-white/70">
                    Visionary leadership driving excellence across industrial sectors since 2002.
                  </p>
                </div>
              </div>
              <motion.div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-center"
                style={{
                  background: 'linear-gradient(135deg, #1a5fb4, #0a2447)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Users className="w-6 h-6 mb-1" style={{ color: '#d4a017' }} />
                <div className="text-xs text-white/70 leading-tight">Expert<br />Team</div>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="section-label">Leadership</div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
              Our People — <span className="grad-gold">Our Passion</span>
            </h2>
            <div className="divider-gold w-24 mb-8" />
            <p className="leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              The directors Mr. Chetan Shah and Mrs. Aruna Shah look after the operation and financial management of
              the group with dedication that deserves the success the company enjoys.
            </p>
            <p className="leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Their visionary leadership has transformed CVS Multi Services into one of India's premier industrial
              service providers.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.1)' }}
                >
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
                    {item.label}
                  </div>
                  <div className="font-semibold text-white font-rajdhani">{item.value}</div>
                </div>
              ))}
            </div>
            <Link to="/about#team" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm">
              <span>Meet Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}