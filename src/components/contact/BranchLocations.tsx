import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  Globe,
  ArrowRight,
} from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import dataService from '../../services/dataService';

// ─── Branch type (from DB) ────────────────────────────────────────────────────
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

export default function BranchLocations() {
  // ── API state ──
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──
  const [activeBranch, setActiveBranch] = useState(0);

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await dataService.getContact();

        if (res.success && res.data && res.data.length > 0) {
          const firstEntry = res.data[0] as any;
          if (firstEntry?.branches && Array.isArray(firstEntry.branches)) {
            setBranches(firstEntry.branches);
          }
        }
      } catch (err) {
        console.error('Branches API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // ── Prevent render until loaded or empty ──
  if (loading || branches.length === 0) return null;

  const active = branches[activeBranch];
  const activeColor = active?.color ?? '#d4a017';

  return (
    <section
      className="py-14 lg:py-20 relative overflow-hidden"
      style={{
        background: '#080f1e',
        borderTop: '1px solid rgba(212,160,23,0.08)',
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <AnimatedSection>
          <div className="text-center mb-10 lg:mb-12">
            <div className="section-label mx-auto w-fit mb-3">
              Our Offices
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-4">
              Our <span className="grad-gold">Branch Locations</span>
            </h2>
            <div className="divider-gold w-20 mx-auto mb-5" />
            <p
              className="text-xs sm:text-sm max-w-xl xl:max-w-2xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              With offices across India and an international presence in
              Dubai, we are always close to where you need us.
            </p>
          </div>
        </AnimatedSection>

        {/* Branch tab buttons */}
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {branches.map((branch, idx) => (
              <button
                key={branch.id ?? idx}
                onClick={() => setActiveBranch(idx)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300"
                style={{
                  background:
                    activeBranch === idx
                      ? `${branch.color ?? '#d4a017'}18`
                      : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    activeBranch === idx
                      ? `${branch.color ?? '#d4a017'}60`
                      : 'rgba(255,255,255,0.08)'
                  }`,
                  color:
                    activeBranch === idx
                      ? 'white'
                      : 'rgba(255,255,255,0.5)',
                  boxShadow:
                    activeBranch === idx
                      ? `0 0 0 2px ${branch.color ?? '#d4a017'}30`
                      : 'none',
                }}
              >
                <span>{branch.flag}</span>
                <span>{branch.city}</span>
                <span
                  className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full hidden sm:inline"
                  style={{
                    background:
                      activeBranch === idx
                        ? `${branch.color ?? '#d4a017'}25`
                        : 'rgba(255,255,255,0.06)',
                    color:
                      activeBranch === idx
                        ? branch.color ?? '#d4a017'
                        : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${
                      activeBranch === idx
                        ? `${branch.color ?? '#d4a017'}40`
                        : 'transparent'
                    }`,
                  }}
                >
                  {branch.label}
                </span>
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Active branch content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-5 gap-5 xl:gap-6 items-start"
          >
            {/* Map */}
            {active.mapSrc && (
              <div
                className="lg:col-span-3 rounded-2xl overflow-hidden h-[320px] lg:h-[420px]"
                style={{ border: `1px solid ${activeColor}25` }}
              >
                <iframe
                  src={active.mapSrc}
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
                  title={`${active.city} Office`}
                />
              </div>
            )}

            {/* Info panel */}
            <div
              className={`${active.mapSrc ? 'lg:col-span-2' : 'lg:col-span-5'} flex flex-col gap-4`}
            >
              <div
                className="p-5 xl:p-6 rounded-2xl"
                style={{
                  background: 'rgba(10,36,71,0.5)',
                  border: `1px solid ${activeColor}20`,
                }}
              >
                {/* Branch header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl sm:text-3xl">
                    {active.flag}
                  </span>
                  <div>
                    <div
                      className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-0.5"
                      style={{ color: activeColor }}
                    >
                      {active.label}
                    </div>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-white">
                      {active.city}
                      {active.country ? `, ${active.country}` : ''}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {active.address && (
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: activeColor }}
                      />
                      <p
                        className="text-xs xl:text-sm leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {active.address}
                      </p>
                    </div>
                  )}
                  {active.phone && (
                    <div className="flex items-center gap-3">
                      <Phone
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: activeColor }}
                      />
                      <a
                        href={`tel:${active.phone.replace(/\s/g, '')}`}
                        className="text-xs xl:text-sm transition-colors hover:text-yellow-300"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {active.phone}
                      </a>
                    </div>
                  )}
                  {active.email && (
                    <div className="flex items-center gap-3">
                      <Mail
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: activeColor }}
                      />
                      <a
                        href={`mailto:${active.email}`}
                        className="text-xs xl:text-sm transition-colors hover:text-yellow-300"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {active.email}
                      </a>
                    </div>
                  )}
                  {active.hours && (
                    <div className="flex items-center gap-3">
                      <Clock
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: activeColor }}
                      />
                      <p
                        className="text-xs xl:text-sm"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {active.hours}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Get Directions */}
              {active.mapUrl && (
                <a
                  href={active.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `${activeColor}15`,
                    border: `1px solid ${activeColor}40`,
                    color: activeColor,
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Directions
                </a>
              )}

              {/* All offices list */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(212,160,23,0.04)',
                  border: '1px solid rgba(212,160,23,0.1)',
                }}
              >
                <p
                  className="text-[10px] sm:text-xs mb-3 font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(212,160,23,0.7)' }}
                >
                  All Offices
                </p>
                <div className="space-y-2">
                  {branches.map((b, idx) => (
                    <button
                      key={b.id ?? idx}
                      onClick={() => setActiveBranch(idx)}
                      className="w-full flex items-center gap-2 text-left text-xs py-1.5 transition-colors duration-200 hover:text-white"
                      style={{
                        color:
                          activeBranch === idx
                            ? 'white'
                            : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      <span>{b.flag}</span>
                      <span className="font-medium">{b.city}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                        —
                      </span>
                      <span
                        style={{
                          color: b.color ?? '#d4a017',
                          fontSize: '10px',
                        }}
                      >
                        {b.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dubai CTA */}
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-6 xl:mt-8"
          >
            <div
              className="relative rounded-3xl overflow-hidden group"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10,36,71,0.6), rgba(10,36,71,0.3))',
                border: '1px solid rgba(212,160,23,0.12)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)',
                }}
              />
              <div className="relative z-10 p-6 sm:p-8 xl:p-10">
                <div className="flex flex-col lg:flex-row items-center gap-6 xl:gap-8">
                  <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: 'rgba(212,160,23,0.08)',
                          border: '1px solid rgba(212,160,23,0.2)',
                        }}
                      >
                        <span className="text-2xl xl:text-3xl">🇦🇪</span>
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: '#0a2447',
                          border: '1px solid rgba(212,160,23,0.3)',
                        }}
                      >
                        <Globe
                          className="w-3 h-3"
                          style={{ color: '#d4a017' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                        style={{ color: 'rgba(212,160,23,0.7)' }}
                      >
                        International Presence
                      </div>
                      <h3 className="font-playfair text-lg sm:text-xl xl:text-2xl font-bold text-white mb-2">
                        Discover Our{' '}
                        <span className="grad-gold">Dubai Operations</span>
                      </h3>
                      <p
                        className="text-xs sm:text-sm xl:text-base max-w-md leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                      >
                        Explore our growing international footprint services,
                        ongoing projects, and career opportunities in the UAE.
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to="/dubai"
                      className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105 whitespace-nowrap"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.08))',
                        border: '1px solid rgba(212,160,23,0.3)',
                        color: '#d4a017',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background =
                          'linear-gradient(135deg, #d4a017, #b8860b)';
                        el.style.color = '#080f1e';
                        el.style.borderColor = '#d4a017';
                        el.style.boxShadow =
                          '0 10px 30px rgba(212,160,23,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background =
                          'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.08))';
                        el.style.color = '#d4a017';
                        el.style.borderColor = 'rgba(212,160,23,0.3)';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      Explore Dubai Branch
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(212,160,23,0.2), transparent)',
                }}
              />
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}