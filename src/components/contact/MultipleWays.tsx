import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import dataService from '../../services/dataService';

// ─── Contact Info Item type (from DB) ─────────────────────────────────────────
interface ContactInfoItem {
  icon?: string;
  title?: string;
  lines?: string[];
  actionLabel?: string;
  actionUrl?: string;
}

// ─── WhatsApp SVG Icon ─────────────────────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function MultipleWays() {
  // ── API state ──
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [loading, setLoading]         = useState(true);

  // ── WhatsApp number from Links API ──
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  // ── Fetch contact info ──
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await dataService.getContact();

        if (res.success && res.data && res.data.length > 0) {
          const firstEntry = res.data[0] as any;
          if (firstEntry?.contactInfo && Array.isArray(firstEntry.contactInfo)) {
            setContactInfo(firstEntry.contactInfo);
          }
        }
      } catch (err) {
        console.error('Contact API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // ── Fetch WhatsApp number from Links API ──
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await dataService.getLinks();

        if (res.success && res.data && res.data.length > 0) {
          const linksEntry = res.data[0];

          if (linksEntry.whatsappChat) {
            // Strip "+" and spaces → "919913991169"
            const cleaned = linksEntry.whatsappChat
              .replace(/\+/g, '')
              .replace(/\s/g, '');

            // Build full wa.me URL with default message
            setWhatsappUrl(
              `https://wa.me/${cleaned}?text=${encodeURIComponent(
                'Hello CVS Multi Services!'
              )}`
            );
          }
        }
      } catch (err) {
        console.error('Links API error:', err);
      }
    };

    fetchLinks();
  }, []);

  // ── Prevent render until loaded or empty ──
  if (loading || contactInfo.length === 0) return null;

  return (
    <section className="py-14 lg:py-20" style={{ background: '#080f1e' }}>
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">

        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-4">
              Multiple Ways to{' '}
              <span className="grad-gold">Reach Us</span>
            </h2>
            <div className="divider-gold w-20 mx-auto" />
          </div>
        </AnimatedSection>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
          {contactInfo.map((info, i) => {
            // Resolve icon string → Lucide component
            const IconComponent =
              (Icons as any)[info.icon ?? ''] || Icons.Settings;

            return (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="p-5 xl:p-6 rounded-2xl h-full group transition-all duration-300 relative overflow-hidden flex flex-col"
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
                  {/* Icon */}
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '1px solid rgba(212,160,23,0.2)',
                    }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: '#d4a017' }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white mb-3 text-sm xl:text-base">
                    {info.title}
                  </h3>

                  {/* Divider */}
                  <div
                    className="h-[1px] mb-3"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(212,160,23,0.4), transparent)',
                    }}
                  />

                  {/* Lines */}
                  <div className="flex-1">
                    {info.lines?.map((line, j) => (
                      <p
                        key={j}
                        className="text-xs xl:text-sm mb-1.5 leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Action link */}
                  {info.actionUrl && info.actionLabel && (
                    <a
                      href={info.actionUrl}
                      target={
                        info.actionUrl.startsWith('http') ? '_blank' : undefined
                      }
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs xl:text-sm font-semibold transition-colors duration-300 hover:text-yellow-300"
                      style={{ color: '#d4a017' }}
                    >
                      {info.actionLabel}
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Bottom glow */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{
                      background: 'linear-gradient(90deg, #d4a017, transparent)',
                    }}
                  />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* WhatsApp CTA — FROM API */}
        <AnimatedSection>
          <div className="mt-8 lg:mt-10 text-center">
            {whatsappUrl ? (
              // ── Dynamic URL from API ──
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                style={{
                  background: 'linear-gradient(135deg, #25d366, #128c7e)',
                  boxShadow: '0 10px 30px rgba(37,211,102,0.3)',
                }}
              >
                {/* ── Real WhatsApp SVG icon ── */}
                <WhatsAppIcon className="w-5 h-5" />
                <span className="text-white font-semibold">
                  Chat on WhatsApp for Quick Response
                </span>
              </a>
            ) : (
              // ── Skeleton while URL loading ──
              <div
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl"
                style={{
                  background: 'rgba(37,211,102,0.1)',
                  border: '1px solid rgba(37,211,102,0.2)',
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                <div className="w-48 h-4 rounded bg-white/10 animate-pulse" />
              </div>
            )}
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}