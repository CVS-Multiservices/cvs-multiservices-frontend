import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';

const products = [
  { title: 'Mobile Effluent Treatment Plant', desc: 'Portable and efficient water treatment solutions for any site' },
  { title: 'All Type of Seismic Survey 2D/3D', desc: 'Complete seismic survey capabilities with modern equipment' },
  { title: 'Waste Management Services', desc: 'End-to-end waste processing and compliant disposal' },
];

export function ProductsSection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#050d1a' }}>
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <AnimatedSection direction="left">
            <div className="section-label">Our Specialization</div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Products — <span className="grad-gold">Our Pride</span>
            </h2>
            <div className="divider-gold w-24 mb-6" />
            <p className="mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We specialize in delivering cutting-edge industrial solutions across the oil & gas sector with unmatched
              expertise.
            </p>
            <div className="space-y-4">
              {products.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="flex gap-5 p-5 rounded-2xl group cursor-pointer transition-all duration-300"
                  style={{
                    background: 'rgba(212,160,23,0.04)',
                    border: '1px solid rgba(212,160,23,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.1)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.04)';
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-rajdhani font-bold text-lg"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '1px solid rgba(212,160,23,0.2)',
                      color: '#d4a017',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 text-sm">{item.title}</h4>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="relative">
              <div
                className="relative rounded-3xl overflow-hidden animate-float"
                style={{
                  border: '1px solid rgba(212,160,23,0.2)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&h=560&fit=crop"
                  alt="Industrial"
                  className="w-full object-cover"
                  style={{ height: '460px' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(5,13,26,0.8) 100%)' }}
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #d4a017, #a07810)',
                  boxShadow: '0 20px 60px rgba(212,160,23,0.3)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-3xl font-bold text-white font-rajdhani">25+</div>
                <div className="text-xs text-white/80 uppercase tracking-wider">Years of Excellence</div>
              </motion.div>
              <motion.div
                className="absolute -top-4 -right-4 p-4 rounded-2xl"
                style={{
                  background: 'rgba(10,36,71,0.9)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <TrendingUp className="w-6 h-6 mb-1" style={{ color: '#d4a017' }} />
                <div className="text-xs font-semibold text-white">Industry Leader</div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}