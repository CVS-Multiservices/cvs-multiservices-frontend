import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../images/Logo1.png';
import { COLORS } from '../theme';
import dataService from '../services/dataService';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Careers', path: '/careers' },
  { label: 'Policies', path: '/policies' },
  { label: 'Dubai', path: '/dubai' },
  { label: 'Contact', path: '/contact' },
];

const stripBrackets = (value: string): string =>
  value
    .replace(/\(.*?\)/g, '')   
    .replace(/\[.*?\]/g, '')   
    .replace(/\{.*?\}/g, '')   

const FacebookSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ── Social link config ────────────────────────────────────────────────────────
const socialConfig: {
  key: string;
  label: string;
  icon: React.FC<{ className?: string; style?: CSSProperties }>;
  color: string;
}[] = [
  { key: 'facebook', label: 'Facebook', icon: FacebookSVG, color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: InstagramSVG, color: '#E4405F' },
  { key: 'youtube', label: 'YouTube', icon: YoutubeSVG, color: '#FF0000' },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinSVG, color: '#0A66C2' },
  { key: 'x', label: 'X', icon: XSVG, color: '#FFFFFF' },
];

// ── Decorative helpers ────────────────────────────────────────────────────────
const FloatingParticle = ({
  delay,
  duration,
  size,
  left,
  color,
}: {
  delay: number;
  duration: number;
  size: number;
  left: string;
  color: string;
}) => (
  <div
    className="absolute rounded-full opacity-20 animate-float-up pointer-events-none"
    style={{
      width: size,
      height: size,
      left,
      bottom: '-20px',
      background: color,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

const FloatingGear = ({
  size,
  top,
  left,
  duration,
  direction,
}: {
  size: number;
  top: string;
  left: string;
  duration: number;
  direction: number;
}) => (
  <div
    className="absolute opacity-5 pointer-events-none"
    style={{
      top,
      left,
      animation: `spin ${duration}s linear infinite ${
        direction === 1 ? '' : 'reverse'
      }`,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 10 L55 25 L65 20 L60 35 L75 35 L65 45 L80 50 L65 55 L75 65 L60 65 L65 80 L55 75 L50 90 L45 75 L35 80 L40 65 L25 65 L35 55 L20 50 L35 45 L25 35 L40 35 L35 20 L45 25 Z"
        fill={COLORS.accent}
      />
      <circle cx="50" cy="50" r="15" fill={COLORS.primary} />
    </svg>
  </div>
);

const DataFlowDot = ({ delay, top }: { delay: number; top: string }) => (
  <div
    className="absolute w-2 h-2 rounded-full opacity-30 animate-data-flow pointer-events-none"
    style={{
      top,
      left: '-10px',
      background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.blueAccent})`,
      animationDelay: `${delay}s`,
    }}
  />
);

const HexagonPattern = ({
  top,
  left,
  size,
  delay,
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
}) => (
  <div
    className="absolute opacity-5 animate-pulse-slow pointer-events-none"
    style={{ top, left, animationDelay: `${delay}s` }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <polygon
        points="50,5 90,25 90,75 50,95 10,75 10,25"
        stroke={COLORS.accent}
        strokeWidth="2"
        fill="none"
      />
      <polygon
        points="50,20 75,35 75,65 50,80 25,65 25,35"
        stroke={COLORS.blueAccent}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  </div>
);

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  // ── API state ──
  const [addressLines, setAddressLines] = useState<string[]>([
    '20, Bhagwati Nagar, Mehsana – 384002',
  ]);

  // Defaults also pass through stripBrackets for consistency
  const [emailAddress, setEmailAddress] = useState(
    stripBrackets('info@cvsmultiservices.com')
  );
  const [phoneNumber, setPhoneNumber] = useState(
    stripBrackets('+91 97235 51751')
  );

  const topAddress = addressLines.slice(0, 2).join(', ');
  const bottomAddress = addressLines.slice(2).join(', ');

  const [activeSocials, setActiveSocials] = useState<
    {
      key: string;
      label: string;
      icon: React.FC<{ className?: string; style?: CSSProperties }>;
      color: string;
      url: string;
    }[]
  >([]);

  // ── Fetch links + contact on mount ──
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [linksRes, contactRes] = await Promise.all([
          dataService.getLinks(),
          dataService.getContact(),
        ]);

        // ── Process Links ──
        if (linksRes.success && linksRes.data && linksRes.data.length > 0) {
          const linksData = linksRes.data[0] as any;

          const active = socialConfig
            .filter((s) => {
              const url = linksData[s.key];
              return url && typeof url === 'string' && url.trim() !== '';
            })
            .map((s) => ({
              ...s,
              url: linksData[s.key] as string,
            }));

          setActiveSocials(active);
        }

        // ── Process Contact ──
        if (
          contactRes.success &&
          contactRes.data &&
          contactRes.data.length > 0
        ) {
          const contactData = contactRes.data[0] as any;
          const contactInfo = contactData?.contactInfo;

          if (Array.isArray(contactInfo)) {
            // Address
            const addressEntry = contactInfo.find(
              (c: any) =>
                c.icon === 'MapPin' ||
                c.title?.toLowerCase().includes('address')
            );
            if (addressEntry?.lines && Array.isArray(addressEntry.lines)) {
              setAddressLines(addressEntry.lines);
            }

            // Phone — strip brackets before storing
            const phoneEntry = contactInfo.find(
              (c: any) =>
                c.icon === 'Phone' ||
                c.title?.toLowerCase().includes('phone')
            );
            if (phoneEntry?.lines && phoneEntry.lines.length > 0) {
              setPhoneNumber(stripBrackets(phoneEntry.lines[0]));
            }

            // Email — strip brackets before storing
            const emailEntry = contactInfo.find(
              (c: any) =>
                c.icon === 'Mail' ||
                c.title?.toLowerCase().includes('email')
            );
            if (emailEntry?.lines && emailEntry.lines.length > 0) {
              setEmailAddress(stripBrackets(emailEntry.lines[0]));
            }
          }
        }
      } catch (err) {
        console.error('Footer data fetch error:', err);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: COLORS.primary,
        borderTop: `1px solid ${COLORS.dividerGold}`,
      }}
    >
      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.2; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-400px) rotate(360deg); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes data-flow {
          0%   { transform: translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateX(calc(100vw + 20px)); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50%      { transform: scale(1.1); opacity: 0.10; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes ripple {
          0%   { transform: scale(0); opacity: 0.3; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes float-diagonal {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 0; }
          20%  { opacity: 0.1; }
          80%  { opacity: 0.1; }
          100% { transform: translate(200px,-300px) rotate(180deg); opacity: 0; }
        }
        .animate-float-up       { animation: float-up 8s ease-in-out infinite; }
        .animate-data-flow      { animation: data-flow 12s linear infinite; }
        .animate-pulse-slow     { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
        .animate-ripple         { animation: ripple 4s ease-out infinite; }
        .animate-float-diagonal { animation: float-diagonal 15s ease-in-out infinite; }
      `}</style>

      {/* ── Background decoration ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-30 animate-gradient-shift"
          style={{
            background: COLORS.gradientOverlayFooter,
            backgroundSize: '200% 200%',
          }}
        />

        <FloatingParticle delay={0} duration={8} size={6} left="10%" color={COLORS.accent} />
        <FloatingParticle delay={2} duration={10} size={4} left="25%" color={COLORS.blueAccent} />
        <FloatingParticle delay={4} duration={9} size={8} left="40%" color={COLORS.accent} />
        <FloatingParticle delay={1} duration={11} size={5} left="55%" color={COLORS.blueAccent} />
        <FloatingParticle delay={3} duration={8} size={7} left="70%" color={COLORS.accent} />
        <FloatingParticle delay={5} duration={10} size={4} left="85%" color={COLORS.blueAccent} />
        <FloatingParticle delay={2.5} duration={9} size={6} left="95%" color={COLORS.accent} />

        <FloatingGear size={80} top="5%" left="5%" duration={20} direction={1} />
        <FloatingGear size={60} top="60%" left="90%" duration={15} direction={-1} />
        <FloatingGear size={100} top="30%" left="50%" duration={25} direction={1} />

        <DataFlowDot delay={0} top="20%" />
        <DataFlowDot delay={3} top="50%" />
        <DataFlowDot delay={6} top="80%" />

        <HexagonPattern top="15%" left="80%" size={60} delay={0} />
        <HexagonPattern top="50%" left="10%" size={80} delay={1} />
        <HexagonPattern top="75%" left="60%" size={50} delay={2} />

        {['top-1/4 left-1/4', 'top-3/4 right-1/4'].map((pos, pi) => (
          <div key={pi} className={`absolute ${pos}`}>
            {[0, 1, 2].map((ri) => (
              <div
                key={ri}
                className={`${ri > 0 ? 'absolute top-0 left-0' : ''} w-4 h-4 rounded-full animate-ripple`}
                style={{
                  background: pi === 0 ? COLORS.accent : COLORS.blueAccent,
                  animationDelay: `${pi * 0.5 + ri}s`,
                }}
              />
            ))}
          </div>
        ))}

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(${COLORS.gridLineGold} 1px, transparent 1px),
                              linear-gradient(90deg, ${COLORS.gridLineGold} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Top accent line */}
      <div
        className="h-[2px] relative z-10"
        style={{ background: COLORS.footerTopAccentGradient }}
      />

      {/* ── Main content ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 2xl:gap-12">

          {/* ── Logo + description + contact ── */}
          <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="relative group w-full max-w-[360px] sm:max-w-[420px]">
                <div
                  className="relative overflow-hidden rounded-2xl flex items-center justify-center
                             px-4 sm:px-5 py-3 sm:py-4 transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${COLORS.goldSoftBorder}`,
                    boxShadow: COLORS.footerLogoContainerShadow,
                  }}
                >
                  <img
                    src={logo}
                    alt="CVS Multi Services Pvt. Ltd. Logo"
                    className="w-full h-auto object-contain"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.18), transparent)',
                    }}
                  />
                </div>

                <div
                  className="absolute inset-0 animate-ping opacity-10 pointer-events-none"
                  style={{
                    border: `2px solid ${COLORS.accent}`,
                    borderRadius: '1rem',
                    animationDuration: '3s',
                  }}
                />
                <div
                  className="absolute -inset-1 opacity-10 pointer-events-none"
                  style={{
                    border: `1px solid ${COLORS.accent}`,
                    borderRadius: '1.1rem',
                  }}
                />
              </div>
            </div>

            <p
              className="text-sm xl:text-base leading-relaxed mb-6 text-center lg:text-left"
              style={{ color: COLORS.textHalf }}
            >
              India's leading industrial services company specialising in
              Effluent Treatment and Waste Management since 2017.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2.5 group cursor-pointer transition-all duration-300 hover:translate-x-1">
                <MapPin
                  className="w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.accent }}
                />
                <div
                  className="text-xs xl:text-sm leading-relaxed transition-colors duration-300 group-hover:text-white"
                  style={{ color: COLORS.textHalf }}
                >
                  <span className="block">{topAddress}</span>
                  {bottomAddress && (
                    <span className="block">{bottomAddress}</span>
                  )}
                </div>
              </div>

              {/* Email — brackets already stripped via stripBrackets() */}
              <div className="flex items-start gap-2.5 group cursor-pointer transition-all duration-300 hover:translate-x-1">
                <Mail
                  className="w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.accent }}
                />
                <a
                  href={`mailto:${emailAddress}`}
                  className="text-xs xl:text-sm leading-relaxed transition-colors duration-300 group-hover:text-white"
                  style={{ color: COLORS.textHalf }}
                >
                  {emailAddress}
                </a>
              </div>

              {/* Phone — brackets already stripped via stripBrackets() */}
              <div className="flex items-start gap-2.5 group cursor-pointer transition-all duration-300 hover:translate-x-1">
                <Phone
                  className="w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.accent }}
                />
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="text-xs xl:text-sm leading-relaxed transition-colors duration-300 group-hover:text-white"
                  style={{ color: COLORS.textHalf }}
                >
                  {phoneNumber}
                </a>
              </div>
            </div>
          </div>

          {/* ── Quick links ── */}
          <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
            <h4
              className="font-semibold mb-4 text-xs xl:text-sm uppercase tracking-wider"
              style={{ color: COLORS.white }}
            >
              <span style={{ color: COLORS.accent }}>Quick</span> Links
            </h4>
            <div
              className="h-[1px] mb-4"
              style={{ background: COLORS.bottomLineGradient }}
            />

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center gap-2 text-xs xl:text-sm
                             transition-all duration-300 group hover:translate-x-1"
                  style={{ color: COLORS.textHalf }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = COLORS.accent;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      COLORS.textHalf;
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0
                               transition-all duration-300 group-hover:scale-150"
                    style={{ background: COLORS.aboutGoldSoft }}
                  />
                  <span className="truncate">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Social media ── */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4">
            <h4
              className="font-semibold mb-4 text-xs xl:text-sm uppercase tracking-wider"
              style={{ color: COLORS.white }}
            >
              <span style={{ color: COLORS.accent }}>Connect</span> With Us
            </h4>
            <div
              className="h-[1px] mb-4"
              style={{ background: COLORS.bottomLineGradient }}
            />

            {activeSocials.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 2xl:gap-y-4">
                {activeSocials.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs xl:text-sm
                                 transition-all duration-300 group hover:translate-x-1"
                      style={{ color: COLORS.textHalf }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          social.color;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          COLORS.textHalf;
                      }}
                    >
                      <IconComponent
                        className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0
                                   transition-all duration-300 group-hover:scale-125"
                        style={{ color: social.color }}
                      />
                      <span>{social.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p
                className="text-xs xl:text-sm"
                style={{ color: COLORS.textHalf }}
              >
                Social links coming soon...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="relative z-10"
        style={{ borderTop: `1px solid ${COLORS.dividerGold}` }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-xs xl:text-sm flex items-center gap-2"
              style={{ color: COLORS.textVeryMuted }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                style={{ background: COLORS.accent }}
              />
              © 2026 CVS Multi Services Pvt. Ltd. All Rights Reserved.
            </p>

            <div
              className="flex items-center gap-2 text-xs xl:text-sm group cursor-pointer"
              style={{ color: COLORS.whiteMuted }}
            >
              <span className="transition-colors duration-300">Designed by</span>
              <span
                className="font-medium transition-colors duration-300 group-hover:text-white"
                style={{ color: COLORS.whiteMuted }}
              >
                Shubh Gandhi
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150"
                style={{ background: COLORS.blueAccent }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}