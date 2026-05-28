import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface Partner {
  name: string;
  logo: string;
  industry: string;
}

interface FlowingSliderProps {
  items: Partner[];
  direction?: 'left' | 'right';
  speed?: number;
}

export function FlowingSlider({ items, direction = 'left', speed = 35 }: FlowingSliderProps) {
  const [isPaused, setIsPaused] = useState(false);

  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #050d1a 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #050d1a 0%, transparent 100%)' }}
      />

      <div
        className="flex gap-5"
        style={{
          animation: `flowing-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {tripled.map((partner, i) => (
          <motion.div
            key={`${partner.name}-${i}`}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-shrink-0 w-[300px] sm:w-[340px] group cursor-pointer"
          >
            <div
              className="relative rounded-2xl overflow-hidden h-full transition-all duration-500"
              style={{
                background: 'rgba(10,36,71,0.5)',
                border: '1px solid rgba(212,160,23,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(212,160,23,0.4)';
                el.style.boxShadow = '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(212,160,23,0.1)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
            >
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 20%, rgba(10,36,71,0.6) 70%, rgba(10,36,71,1) 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(212,160,23,0.08) 50%, transparent 60%)',
                  }}
                />
                <motion.div
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{
                    background: 'rgba(212,160,23,0.15)',
                    border: '1px solid rgba(212,160,23,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                  whileHover={{ rotate: 10 }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: '#d4a017' }} />
                </motion.div>
              </div>

              <div className="p-5 relative">
                <div
                  className="absolute top-0 left-5 right-5 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.25), transparent)' }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-rajdhani font-bold text-lg text-white mb-1 group-hover:text-yellow-300 transition-colors duration-300 truncate">
                      {partner.name}
                    </h4>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'rgba(212,160,23,0.6)' }}>
                      {partner.industry}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left"
                style={{ background: 'linear-gradient(90deg, #d4a017, rgba(212,160,23,0.3), transparent)' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}