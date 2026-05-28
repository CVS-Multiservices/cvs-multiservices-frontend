import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import dataService from '../../services/dataService';

// ✅ Strict type (as per your backend)
type PartnerItem = {
  _id?: string;
  name: string;
  logo: string;
};

function LogoCard({ partner }: { partner: PartnerItem }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl flex-shrink-0 overflow-hidden
                 w-[150px] h-[90px] sm:w-[180px] sm:h-[100px]
                 lg:w-[210px] lg:h-[115px] xl:w-[240px] xl:h-[130px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.borderLight}`,
      }}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <Building2
          className="w-8 h-8 sm:w-10 sm:h-10 opacity-40"
          style={{ color: COLORS.accent }}
        />
      )}
    </div>
  );
}

function LogoMarqueeRow({
  items,
  reverse = false,
  duration = 28,
}: {
  items: PartnerItem[];
  reverse?: boolean;
  duration?: number;
}) {
  const loopItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Left Fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 xl:w-28 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${COLORS.primary} 0%, transparent 100%)`,
        }}
      />

      {/* Right Fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 xl:w-28 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(270deg, ${COLORS.primary} 0%, transparent 100%)`,
        }}
      />

      <motion.div
        className="flex items-center gap-4 sm:gap-5 xl:gap-6 w-max"
        animate={{
          x: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {loopItems.map((partner, index) => (
          <LogoCard
            key={`${partner._id ?? partner.name}-${index}`}
            partner={partner}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function ClientsSection() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await dataService.getPartners();

        if (res.success && res.data) {
          setPartners(res.data);
        }
      } catch (err) {
        console.error('Partner API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Prevent empty animation glitch
  if (loading || partners.length === 0) return null;

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: COLORS.primary,
        borderTop: `1px solid ${COLORS.borderLight}`,
      }}
    >
      {/* Header */}
      <div className="relative z-10 text-center mb-12 lg:mb-16">
        <AnimatedSection>
          <div className="section-label mx-auto w-fit">
            Trusted Partners
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4">
            Our Prestigious <span className="grad-gold">Clients</span>
          </h2>

          <div className="divider-gold w-24 mx-auto mb-6" />

          <p
            className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
            style={{ color: COLORS.textSecondary }}
          >
            Trusted by India's leading corporations for reliable and excellence-driven industrial services.
          </p>
        </AnimatedSection>
      </div>

      {/* Logo Slider */}
      <AnimatedSection>
        <div className="space-y-4 sm:space-y-5 xl:space-y-6">
          <LogoMarqueeRow items={partners} reverse duration={32} />
          <LogoMarqueeRow items={partners} duration={30} />
        </div>
      </AnimatedSection>
    </section>
  );
}