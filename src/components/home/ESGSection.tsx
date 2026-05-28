import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Users,
  Shield,
  TrendingUp,
  ChevronRight,
  X,
  ArrowRight,
  Award,
  Globe,
  Zap,
  Droplets,
  Wind,
  Sun,
  TreePine,
  HeartHandshake,
  Scale,
  Building,
  CheckCircle2,
  BarChart3,
  Target,
} from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';

// ─── ESG Data ────────────────────────────────────────────────────────────────
const esgPillars = [
  {
    id: 'environmental',
    label: 'Environmental',
    icon: Leaf,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    gradientFrom: '#14532d',
    gradientTo: '#052e16',
    description:
      'We are committed to reducing our environmental footprint through sustainable operations, waste reduction, and renewable energy adoption across all our project sites.',
    metrics: [
      { label: 'Carbon Reduction', value: '35%', suffix: '', icon: Wind },
      { label: 'Renewable Energy', value: '40%', suffix: '+', icon: Sun },
      { label: 'Water Recycled', value: '60%', suffix: '', icon: Droplets },
      { label: 'Trees Planted', value: '5000', suffix: '+', icon: TreePine },
    ],
    initiatives: [
      'Zero-waste-to-landfill policy across all major project sites',
      'Solar panel installation at headquarters & field camps',
      'Rainwater harvesting systems deployed at 12 locations',
      'Emission-monitored fleet management with GPS tracking',
      'ISO 14001 certified environmental management system',
      'Green procurement policy for all material sourcing',
    ],
    highlight: 'ISO 14001 Certified',
  },
  {
    id: 'social',
    label: 'Social',
    icon: Users,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    gradientFrom: '#1e3a5f',
    gradientTo: '#0c1a2e',
    description:
      'Our people are our greatest asset. We invest in skill development, promote diversity, and create safe, inclusive workplaces while positively impacting the communities we operate in.',
    metrics: [
      { label: 'Employees', value: '2500', suffix: '+', icon: Users },
      { label: 'Training Hours', value: '18K', suffix: '+', icon: Award },
      { label: 'Communities', value: '40', suffix: '+', icon: HeartHandshake },
      { label: 'Women in Workforce', value: '28', suffix: '%', icon: Globe },
    ],
    initiatives: [
      'Zero-accident target with OHSAS 18001 certified safety systems',
      'Annual skill development programs for 500+ employees',
      'Local hiring policy — 70%+ workforce from project regions',
      'Equal pay certification & gender diversity programs',
      'Employee wellness & mental health support programs',
      'Grievance redressal mechanism with 48-hr resolution SLA',
    ],
    highlight: 'OHSAS 18001 Safety',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Shield,
    color: '#d4a017',
    bg: 'rgba(212,160,23,0.08)',
    border: 'rgba(212,160,23,0.2)',
    gradientFrom: '#3d2a00',
    gradientTo: '#1a1000',
    description:
      'Strong governance is the backbone of our operations. We uphold the highest standards of transparency, accountability, and ethical business conduct across all levels of the organization.',
    metrics: [
      { label: 'Compliance Rate', value: '100', suffix: '%', icon: Scale },
      { label: 'Audits/Year', value: '24', suffix: '+', icon: BarChart3 },
      { label: 'Years of Trust', value: '27', suffix: '+', icon: Building },
      { label: 'SAP Integrated', value: '100', suffix: '%', icon: Target },
    ],
    initiatives: [
      '1st Indian company to implement SAP for full business operations',
      'Board-level ESG committee with quarterly review cadence',
      'Anti-bribery & corruption (ABC) policy with annual training',
      'Whistleblower protection policy & anonymous reporting portal',
      'Robust vendor due-diligence & supply chain ethics program',
      'Transparent financial disclosures aligned with SEBI norms',
    ],
    highlight: 'SAP ERP — 1st in India',
  },
];

const esgStats = [
  { value: '27+', label: 'Years of ESG Practice', icon: TrendingUp, color: '#d4a017' },
  { value: 'A+', label: 'ESG Rating', icon: Award, color: '#22c55e' },
  { value: '100%', label: 'Regulatory Compliance', icon: Shield, color: '#3b82f6' },
  { value: '3', label: 'ESG Pillars Integrated', icon: Globe, color: '#a855f7' },
];

// ─── Pillar Detail Modal ─────────────────────────────────────────────────────
function ESGPillarModal({
  pillar,
  isOpen,
  onClose,
}: {
  pillar: (typeof esgPillars)[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!pillar) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] backdrop-blur-md"
            style={{ background: COLORS.modalBackdrop }}
            onClick={onClose}
          />

          {/* Scroll wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.primary} 100%)`,
                  border: `1px solid ${pillar.border}`,
                  boxShadow: `0 50px 100px rgba(0,0,0,0.7), 0 0 60px ${pillar.bg}`,
                }}
              >
                {/* Top accent */}
                <div
                  className="h-[3px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                  }}
                />

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.primaryOverlay80,
                    border: `1px solid ${pillar.border}`,
                    color: pillar.color,
                  }}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Hero */}
                <div
                  className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 xl:px-12"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.gradientFrom} 0%, ${pillar.gradientTo} 100%)`,
                  }}
                >
                  {/* Subtle dot grid */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, ${pillar.color} 1px, transparent 0)`,
                      backgroundSize: '28px 28px',
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-4 sm:gap-6 pr-10">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: pillar.bg, border: `1px solid ${pillar.border}` }}
                    >
                      <pillar.icon
                        className="w-7 h-7 sm:w-8 sm:h-8 xl:w-10 xl:h-10"
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-[3px] font-semibold mb-2 block"
                        style={{ color: pillar.color }}
                      >
                        ESG Pillar
                      </span>
                      <h2
                        className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold leading-tight mb-3"
                        style={{ color: COLORS.white }}
                      >
                        {pillar.label}
                      </h2>
                      <p
                        className="text-sm sm:text-base xl:text-lg leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.65)' }}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="px-5 sm:px-8 xl:px-10 py-6 sm:py-8">
                  <h3
                    className="font-rajdhani font-bold text-base sm:text-lg mb-4 flex items-center gap-2 uppercase tracking-wider"
                    style={{ color: COLORS.white }}
                  >
                    <div className="w-6 h-[2px]" style={{ background: pillar.color }} />
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {pillar.metrics.map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-4 rounded-xl text-center"
                        style={{
                          background: pillar.bg,
                          border: `1px solid ${pillar.border}`,
                        }}
                      >
                        <metric.icon
                          className="w-5 h-5 mx-auto mb-2"
                          style={{ color: pillar.color }}
                        />
                        <div
                          className="text-xl sm:text-2xl font-extrabold font-rajdhani leading-none mb-1"
                          style={{ color: pillar.color }}
                        >
                          {metric.value}
                          {metric.suffix}
                        </div>
                        <div
                          className="text-[10px] uppercase tracking-wider"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Initiatives */}
                  <h3
                    className="font-rajdhani font-bold text-base sm:text-lg mb-4 flex items-center gap-2 uppercase tracking-wider"
                    style={{ color: COLORS.white }}
                  >
                    <div className="w-6 h-[2px]" style={{ background: pillar.color }} />
                    Our Initiatives
                  </h3>
                  <div className="space-y-2.5 mb-8">
                    {pillar.initiatives.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{
                          background: pillar.bg,
                          border: `1px solid ${pillar.border}`,
                        }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: pillar.color }}
                        />
                        <span
                          className="text-sm xl:text-base"
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="h-[1px] mb-6"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pillar.border}, transparent)`,
                    }}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                                 transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      ← Back to ESG
                    </button>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Pillar Card ─────────────────────────────────────────────────────────────
function ESGPillarCard({
  pillar,
  index,
  onClick,
}: {
  pillar: (typeof esgPillars)[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <AnimatedSection delay={index * 0.15} direction="up">
      <motion.div
        whileHover={{ y: -10 }}
        onClick={onClick}
        className="group cursor-pointer rounded-3xl overflow-hidden h-full flex flex-col relative"
        style={{
          background: COLORS.cardBgMedium,
          border: `1px solid ${pillar.border}`,
          boxShadow: COLORS.cardShadow,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = pillar.color;
          el.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 0 0 30px ${pillar.bg}`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = pillar.border;
          el.style.boxShadow = COLORS.cardShadow;
        }}
      >
        {/* Card header gradient */}
        <div
          className="relative px-6 pt-8 pb-6 sm:px-8"
          style={{
            background: `linear-gradient(135deg, ${pillar.gradientFrom} 0%, ${pillar.gradientTo} 100%)`,
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${pillar.color} 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10">
            {/* Icon + label row */}
            <div className="flex items-center justify-between mb-5">
              <div
                className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center
                           transition-transform duration-300 group-hover:scale-110"
                style={{ background: pillar.bg, border: `1px solid ${pillar.border}` }}
              >
                <pillar.icon className="w-7 h-7 xl:w-8 xl:h-8" style={{ color: pillar.color }} />
              </div>
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: pillar.bg,
                  border: `1px solid ${pillar.border}`,
                  color: pillar.color,
                }}
              >
                {pillar.highlight}
              </span>
            </div>

            <h3
              className="font-playfair text-2xl xl:text-3xl font-bold mb-2"
              style={{ color: COLORS.white }}
            >
              {pillar.label}
            </h3>
            <p
              className="text-sm xl:text-base leading-relaxed line-clamp-3"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {pillar.description}
            </p>
          </div>
        </div>

        {/* Metrics mini-grid */}
        <div className="grid grid-cols-2 gap-3 p-5 sm:p-6 xl:p-7">
          {pillar.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl text-center"
              style={{ background: pillar.bg, border: `1px solid ${pillar.border}` }}
            >
              <metric.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: pillar.color }} />
              <div
                className="text-lg xl:text-xl font-extrabold font-rajdhani leading-none"
                style={{ color: pillar.color }}
              >
                {metric.value}{metric.suffix}
              </div>
              <div
                className="text-[9px] xl:text-[10px] uppercase tracking-wider mt-0.5"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          className="mt-auto px-5 pb-5 sm:px-6 sm:pb-6 xl:px-7 xl:pb-7 flex items-center justify-between"
        >
          <span
            className="text-sm font-semibold flex items-center gap-1.5"
            style={{ color: pillar.color }}
          >
            Explore Details
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center
                       transition-all duration-300 group-hover:scale-110"
            style={{ background: pillar.bg, border: `1px solid ${pillar.border}` }}
          >
            <ArrowRight className="w-4 h-4" style={{ color: pillar.color }} />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{
            background: `linear-gradient(90deg, ${pillar.color}, transparent)`,
          }}
        />
      </motion.div>
    </AnimatedSection>
  );
}

// ─── Main ESG Section ────────────────────────────────────────────────────────
export function ESGSection() {
  const [activePillar, setActivePillar] = useState<(typeof esgPillars)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (pillar: (typeof esgPillars)[0]) => {
    setActivePillar(pillar);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setActivePillar(null), 300);
  };

  return (
    <>
      <ESGPillarModal pillar={activePillar} isOpen={isModalOpen} onClose={closeModal} />

      <section
        id="esg"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: COLORS.primary }}
      >
        {/* Background elements */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #22c55e, transparent)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #3b82f6, transparent)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        {/* ── Full-width responsive container ── */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Heading */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Sustainability
              </div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
                style={{ color: COLORS.white }}
              >
                Environmental, Social &{' '}
                <span className="grad-gold">Governance</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                At CVS Multi Services, ESG is not a checkbox — it's a core business philosophy.
                We embed responsible practices into every project, every process, and every decision.
              </p>
            </div>
          </AnimatedSection>

          {/* Pillars grid — 1 col mobile, 3 cols lg+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 mb-14 lg:mb-20">
            {esgPillars.map((pillar, idx) => (
              <ESGPillarCard
                key={pillar.id}
                pillar={pillar}
                index={idx}
                onClick={() => openModal(pillar)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}