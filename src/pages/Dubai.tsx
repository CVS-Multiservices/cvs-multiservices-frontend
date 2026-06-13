import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  Droplets,
  Wrench,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { WhatsAppButton } from '@/components/ui';
import SEOMeta from '../components/SEOMeta';
import dataService from '../services/dataService';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Branch {
  id?: string;
  label?: string;
  city?: string;
  country?: string;
  flag?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapSrc?: string;
  mapUrl?: string;
  color?: string;
}

// ─── Static Data (unchanged) ─────────────────────────────────────────────────
const capabilities = [
  { icon: Droplets,    title: 'Water Treatment',     desc: 'Advanced effluent treatment and desalination systems serving UAE industrial sector.' },
  { icon: Wrench,      title: 'Maintenance Services', desc: 'Comprehensive mechanical and electrical maintenance for oil & gas facilities.' },
  { icon: ShieldCheck, title: 'HSE Compliance',       desc: 'Strict adherence to Dubai Municipality and ADNOC HSE standards.' },
  { icon: Building2,   title: 'Facility Management',  desc: 'End-to-end industrial facility operations and infrastructure management.' },
];

const certifications = [
  'ISO 9001:2015 Quality Management',
  'ISO 14001:2015 Environmental Management',
  'ISO 45001:2018 Occupational Health & Safety',
  'Dubai Chamber of Commerce Registered',
];

const stats = [
  { value: '2018',  label: 'Established in UAE' },
  { value: '50+',   label: 'UAE Workforce' },
  { value: '24/7',  label: 'Operations' },
  { value: '100%',  label: 'Safety Record' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Dubai() {
  const [, setScrolled] = useState(false);

  // ── Dubai branch from API ──
  const [dubaiBranch, setDubaiBranch] = useState<Branch | null>(null);
  const [loadingBranch, setLoadingBranch] = useState(true);

  // ── Scroll listener ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Fetch Dubai branch from contact API ──
  useEffect(() => {
    const fetchDubaiBranch = async () => {
      try {
        const res = await dataService.getContact();

        if (res.success && res.data && res.data.length > 0) {
          const firstEntry = res.data[0] as any;

          if (firstEntry?.branches && Array.isArray(firstEntry.branches)) {
            // Find specifically the Dubai branch by id
            const dubai = firstEntry.branches.find(
              (b: Branch) => b.id === 'dubai'
            );
            if (dubai) {
              setDubaiBranch(dubai);
            }
          }
        }
      } catch (err) {
        console.error('Dubai branch fetch error:', err);
      } finally {
        setLoadingBranch(false);
      }
    };

    fetchDubaiBranch();
  }, []);

  // ── Build contactItems from dubaiBranch (or fallback to null) ──
  const contactItems = dubaiBranch
    ? [
        {
          icon: MapPin,
          title: 'Address',
          lines: [dubaiBranch.address ?? 'Dubai, United Arab Emirates'],
        },
        {
          icon: Phone,
          title: 'Phone',
          lines: [dubaiBranch.phone ?? ''],
        },
        {
          icon: Mail,
          title: 'Email',
          lines: [dubaiBranch.email ?? ''],
        },
      ]
    : [];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const dubaiSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${origin}/dubai#webpage`,
    "url": `${origin}/dubai`,
    "name": "CVS Multi Services Dubai Office",
    "description": "CVS Multi Services Middle East Operations. Specialized industrial, oilfield, water treatment, and facility management services in UAE.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": dubaiBranch?.phone || "",
      "contactType": "international office",
      "areaServed": "AE",
      "availableLanguage": ["en", "ar"]
    }
  };

  return (
    <div className="section-navy min-h-screen">
      <SEOMeta
        title="Dubai Office & Middle East Operations | CVS Multi Services"
        description="CVS Multi Services is expanding in the Middle East. Contact our Abu Dhabi/Dubai representatives for specialized oilfield, ETP, and seismic services in the UAE."
        keywords="CVS Dubai, UAE office, Abu Dhabi operations, Middle East oilfield services, ADNOC partners"
        schema={dubaiSchema}
      />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] xl:min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">

        {/* Background image */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai Skyline"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background:
              'linear-gradient(135deg, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.85) 50%, rgba(10,36,71,0.75) 100%)',
          }}
        />

        {/* Gold top line */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{
            zIndex: 2,
            background: 'linear-gradient(90deg, transparent, #d4a017, transparent)',
          }}
        />

        {/* Main content */}
        <div
          className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 text-center"
          style={{ zIndex: 10 }}
        >
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(212,160,23,0.1)',
                border: '1px solid rgba(212,160,23,0.3)',
              }}
            >
              <MapPin className="w-4 h-4" style={{ color: '#d4a017' }} />
              <span className="text-sm font-medium" style={{ color: '#d4a017' }}>
                {/* ── FROM API: country or fallback ── */}
                {dubaiBranch?.country ?? 'United Arab Emirates'}
              </span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1
              className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl
                         font-bold text-white mb-6 leading-tight"
            >
              {/* ── FROM API: city or fallback ── */}
              CVS {dubaiBranch?.city ?? 'Dubai'}{' '}
              <span style={{ color: '#d4a017' }}>Office</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p
              className="text-base sm:text-lg xl:text-xl 2xl:text-2xl
                         max-w-3xl xl:max-w-4xl mx-auto mb-8"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Expanding our legacy of excellence to the Middle East. State-of-the-art industrial
              services facility serving the UAE's oil, gas, and infrastructure sectors.
            </p>
          </AnimatedSection>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-4 justify-center"
            style={{ position: 'relative', zIndex: 50 }}
          >
            <Link
              to="/contact"
              className="btn-gold px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl
                         flex items-center gap-2 text-sm sm:text-base"
              style={{ position: 'relative', zIndex: 50 }}
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() =>
                document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })
              }
              style={{
                position: 'relative',
                zIndex: 50,
                padding: '14px 28px',
                borderRadius: '12px',
                border: '1px solid #d4a017',
                background: 'transparent',
                color: '#d4a017',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                isolation: 'isolate',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = '#d4a017';
                el.style.color = '#050d1a';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'transparent';
                el.style.color = '#d4a017';
              }}
            >
              View Location
            </button>
          </div>
        </div>

        {/* Floating globe */}
        <motion.div
          className="absolute bottom-8 right-8 xl:bottom-10 xl:right-10 hidden lg:block"
          style={{ zIndex: 10 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div
            className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(212,160,23,0.1)',
              border: '1px solid rgba(212,160,23,0.3)',
            }}
          >
            <Globe className="w-9 h-9 xl:w-10 xl:h-10" style={{ color: '#d4a017' }} />
          </div>
        </motion.div>
      </section>

      {/* ── About Facility (static) ── */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: '#080f1e' }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 2xl:gap-24 items-center">
            <AnimatedSection direction="left">
              <div className="section-label mb-4">Our UAE Facility</div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-6 leading-tight"
              >
                Strategic Hub for{' '}
                <span style={{ color: '#d4a017' }}>Middle East Operations</span>
              </h2>
              <div className="w-24 h-0.5 mb-6 xl:mb-8" style={{ background: '#d4a017' }} />
              <p
                className="text-sm sm:text-base xl:text-lg leading-relaxed mb-5"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Our Dubai office represents CVS Multi Services' commitment to global expansion and
                delivering Indian engineering excellence to international markets.
              </p>
              <p
                className="text-sm sm:text-base xl:text-lg leading-relaxed mb-7 xl:mb-8"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                The facility houses advanced equipment for industrial cleaning, waste management,
                and specialized oilfield services.
              </p>
              <div className="space-y-3 xl:space-y-4">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Award
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      style={{ color: '#d4a017' }}
                    />
                    <span
                      className="text-xs sm:text-sm xl:text-base"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <motion.div
                    className="rounded-2xl overflow-hidden h-52 sm:h-64 xl:h-72 2xl:h-80"
                    whileHover={{ scale: 1.02 }}
                    style={{ border: '1px solid rgba(212,160,23,0.2)' }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=800&fit=crop"
                      alt="Dubai Facility"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="rounded-2xl overflow-hidden h-52 sm:h-64 xl:h-72 2xl:h-80 mt-6 sm:mt-8"
                    whileHover={{ scale: 1.02 }}
                    style={{ border: '1px solid rgba(212,160,23,0.2)' }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop"
                      alt="Industrial Equipment"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Floating card — FROM API */}
                <motion.div
                  className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6
                             p-4 sm:p-5 xl:p-6 rounded-2xl"
                  style={{
                    background: 'rgba(10,36,71,0.95)',
                    border: '1px solid rgba(212,160,23,0.3)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,160,23,0.15)' }}
                    >
                      {/* ── FROM API: flag emoji ── */}
                      <span className="text-lg">
                        {dubaiBranch?.flag ?? '🇦🇪'}
                      </span>
                    </div>
                    <div>
                      {/* ── FROM API: city ── */}
                      <div className="text-white font-bold text-sm sm:text-base">
                        {dubaiBranch?.city ?? 'Dubai'}
                      </div>
                      {/* ── FROM API: label ── */}
                      <div
                        className="text-[10px] sm:text-xs"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {dubaiBranch?.label ?? 'International Office'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Capabilities (static) ── */}
      <section className="py-20 lg:py-28 relative" style={{ background: '#050d1a' }}>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <AnimatedSection>
              <div className="section-label mx-auto w-fit mb-4">Services</div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-4"
              >
                Dubai <span style={{ color: '#d4a017' }}>Capabilities</span>
              </h2>
              <div className="w-24 h-0.5 mx-auto mb-6" style={{ background: '#d4a017' }} />
              <p
                className="text-sm sm:text-base xl:text-lg max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Comprehensive industrial solutions tailored for UAE regulations and standards.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
            {capabilities.map((cap, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="h-full p-6 xl:p-8 rounded-2xl xl:rounded-3xl
                             transition-all duration-300 group flex flex-col"
                  style={{
                    background: 'rgba(10,36,71,0.4)',
                    border: '1px solid rgba(212,160,23,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(212,160,23,0.3)';
                    el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(212,160,23,0.1)';
                    el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                  }}
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-xl xl:rounded-2xl
                               flex items-center justify-center mb-5 xl:mb-6
                               transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '1px solid rgba(212,160,23,0.2)',
                    }}
                  >
                    <cap.icon
                      className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7"
                      style={{ color: '#d4a017' }}
                    />
                  </div>
                  <h3
                    className="font-rajdhani font-bold text-lg xl:text-xl 2xl:text-2xl
                               text-white mb-2 xl:mb-3 group-hover:text-yellow-300 transition-colors"
                  >
                    {cap.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm xl:text-base leading-relaxed flex-1"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {cap.desc}
                  </p>
                  <div
                    className="mt-5 xl:mt-6 h-0.5 w-12 transition-all duration-300 group-hover:w-full"
                    style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }}
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location & Contact ── FROM API ── */}
      <section
        id="location"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: '#080f1e' }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 2xl:gap-20">

            {/* Map — FROM API mapSrc */}
            <AnimatedSection direction="left">
              <div
                className="relative h-[320px] sm:h-[380px] xl:h-[460px] 2xl:h-[520px]
                           rounded-3xl overflow-hidden"
                style={{ border: '1px solid rgba(212,160,23,0.2)' }}
              >
                {!loadingBranch && dubaiBranch?.mapSrc ? (
                  // ── REAL MAP from API ──
                  <iframe
                    src={dubaiBranch.mapSrc}
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter:
                        'invert(90%) hue-rotate(180deg) brightness(0.8) saturate(0.7)',
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${dubaiBranch.city ?? 'Dubai'} Office`}
                  />
                ) : (
                  // ── Placeholder while loading or no mapSrc ──
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(10,36,71,0.6)' }}
                  >
                    <div className="text-center">
                      <MapPin
                        className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 mx-auto mb-4"
                        style={{ color: '#d4a017' }}
                      />
                      <p className="text-white font-semibold text-sm sm:text-base xl:text-lg mb-2">
                        {loadingBranch ? 'Loading Map...' : 'Interactive Map'}
                      </p>
                      <p
                        className="text-xs sm:text-sm xl:text-base"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {dubaiBranch?.address ?? 'Dubai, United Arab Emirates'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(212,160,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>
            </AnimatedSection>

            {/* Contact Info — FROM API */}
            <AnimatedSection direction="right">
              <div className="section-label mb-4">Contact Dubai</div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl font-bold text-white mb-7 xl:mb-8"
              >
                Get in <span style={{ color: '#d4a017' }}>Touch</span>
              </h2>

              <div className="space-y-4 xl:space-y-5">
                {contactItems.map(({ icon: Icon, title, lines }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 xl:p-6 rounded-2xl"
                    style={{
                      background: 'rgba(10,36,71,0.4)',
                      border: '1px solid rgba(212,160,23,0.1)',
                    }}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center
                                 justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,160,23,0.1)' }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#d4a017' }} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base xl:text-lg mb-1">
                        {title}
                      </h4>
                      {lines.map((line, i) => (
                        <p
                          key={i}
                          className="text-xs sm:text-sm xl:text-base"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Get Directions — FROM API mapUrl */}
              {dubaiBranch?.mapUrl && (
                <a
                  href={dubaiBranch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2
                             px-5 py-3.5 rounded-xl text-sm font-semibold
                             transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(212,160,23,0.1)',
                    border: '1px solid rgba(212,160,23,0.3)',
                    color: '#d4a017',
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              )}

              {/* Business hours — FROM API */}
              {dubaiBranch?.hours && (
                <div
                  className="mt-4 p-4 sm:p-5 rounded-2xl flex items-center gap-3"
                  style={{
                    background: 'rgba(212,160,23,0.05)',
                    border: '1px solid rgba(212,160,23,0.15)',
                  }}
                >
                  <CheckCircle2
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    style={{ color: '#d4a017' }}
                  />
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {/* ── FROM API: hours ── */}
                    <span className="font-semibold text-white">Office Hours: </span>
                    {dubaiBranch.hours}
                  </p>
                </div>
              )}

              {/* Compliance note (static) */}
              <div
                className="mt-4 p-4 sm:p-5 xl:p-6 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(212,160,23,0.1), rgba(212,160,23,0.05))',
                  border: '1px solid rgba(212,160,23,0.2)',
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                    style={{ color: '#d4a017' }}
                  />
                  <p
                    className="text-xs sm:text-sm xl:text-base"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Our Dubai facility operates under full compliance with UAE federal regulations
                    and maintains strategic partnerships with local authorities for rapid project
                    deployment.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA (static) ── */}
      <section
        className="py-20 lg:py-28 relative"
        style={{
          background: 'linear-gradient(135deg, #050d1a 0%, #0a2447 50%, #050d1a 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center">
            <AnimatedSection>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-5 xl:mb-6"
              >
                Partner with CVS{' '}
                <span style={{ color: '#d4a017' }}>Dubai</span>
              </h2>
              <p
                className="text-sm sm:text-base xl:text-lg 2xl:text-xl mb-8 xl:mb-10
                           max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Ready to bring Indian engineering excellence to your UAE operations? Contact our
                Dubai team today.
              </p>
              <Link
                to="/contact"
                className="btn-gold px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl
                           inline-flex items-center gap-2 text-sm sm:text-base xl:text-lg font-bold"
              >
                <span>Contact Dubai Office</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}