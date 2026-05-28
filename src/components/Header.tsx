import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';
import logo from '../images/Logo1.png';
import { COLORS } from '../theme';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Careers', path: '/careers' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Policies', path: '/policies' },
  { label: 'Dubai Office', path: '/dubai', icon: MapPin },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        background: scrolled ? COLORS.headerScrolledBg : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? `1px solid ${COLORS.highlightBorder}`
          : '1px solid transparent',
        boxShadow: scrolled ? COLORS.headerScrolledShadow : 'none',
      }}
    >
      {/* Top accent bar */}
      {!scrolled && (
        <div
          className="h-[2px] w-full"
          style={{ background: COLORS.topAccentGradient }}
        />
      )}

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <motion.div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  width: scrolled ? '170px' : '210px',
                  height: scrolled ? '38px' : '44px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: `2px solid ${COLORS.goldSoftBorder}`,
                  boxShadow: COLORS.logoShadow,
                  transition: 'width 0.3s, height 0.3s',
                  padding: '4px 10px',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <img
                  src={logo}
                  alt="CVS Multi Services Logo"
                  className="object-contain transition-all duration-300"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                    borderRadius: '8px',
                  }}
                />
              </motion.div>

              {/* Ping & glow ring */}
              <div
                className="absolute inset-0 animate-ping opacity-20 pointer-events-none"
                style={{
                  border: `2px solid ${COLORS.accent}`,
                  borderRadius: '10px',
                  animationDuration: '3s',
                }}
              />
              <div
                className="absolute -inset-1 opacity-15 pointer-events-none"
                style={{
                  border: `1px solid ${COLORS.accent}`,
                  borderRadius: '12px',
                }}
              />
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium
                           transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  color: isActive(item.path)
                    ? COLORS.accent
                    : COLORS.navTextDefault,
                  background: isActive(item.path)
                    ? COLORS.cardGoldSoft
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    (e.currentTarget as HTMLElement).style.color = COLORS.white;
                    (e.currentTarget as HTMLElement).style.background =
                      COLORS.whiteFaint;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    (e.currentTarget as HTMLElement).style.color =
                      COLORS.navTextDefault;
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent';
                  }
                }}
              >
                {item.icon && (
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: COLORS.accent }}
                  />
                )}
              </Link>
            ))}

            <Link
              to="/contact"
              className="ml-3 xl:ml-5 px-5 xl:px-6 py-2.5 rounded-xl text-sm font-bold
                         btn-gold tracking-wide whitespace-nowrap flex-shrink-0"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}
            >
              Contact Us
            </Link>
          </nav>

          {/* ── Mobile Toggle ─────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl
                       transition-all duration-300 flex-shrink-0"
            style={{
              background: mobileOpen ? COLORS.dividerGold : COLORS.whiteFaint,
              border: `1px solid ${COLORS.goldSoftBg}`,
              color: COLORS.accent,
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: COLORS.mobileMenuBg,
              borderTop: `1px solid ${COLORS.border}`,
              borderBottom: `1px solid ${COLORS.dividerGold}`,
            }}
          >
            <div className="px-4 sm:px-8 py-5 space-y-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm
                               font-medium transition-all duration-200"
                    style={{
                      color: isActive(item.path)
                        ? COLORS.accent
                        : COLORS.navTextDefault,
                      background: isActive(item.path)
                        ? COLORS.cardGoldSoft
                        : COLORS.whiteUltraFaint,
                    }}
                  >
                    {item.icon && (
                      <item.icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: COLORS.accent }}
                      />
                    )}
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="block px-4 py-3 rounded-xl text-center text-sm font-bold btn-gold"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}