import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Feature, SubService } from '../../types';
import { COLORS } from '../../theme';

interface ServiceSubservicesModalProps {
  service: Feature | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSubservice: (subservice: SubService) => void;
}

export function ServiceSubservicesModal({
  service,
  isOpen,
  onClose,
  onSelectSubservice,
}: ServiceSubservicesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Reset search on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  if (!service) return null;

  // Resolve service icon
  const ServiceIcon = (Icons as any)[service.icon ?? ''] || Icons.Settings;
  const serviceColor = service.color ?? COLORS.accent;
  const subServices = service.subServices ?? [];

  const filteredSubs = subServices.filter((sub) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.title?.toLowerCase().includes(q) ||
      sub.shortDesc?.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998]"
            style={{
              background: COLORS.serviceModalBackdrop,
              backdropFilter: 'blur(12px)',
            }}
            onClick={onClose}
          />

          {/* ── Scroll wrapper ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 2xl:p-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl
                           rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.darkAlt} 100%)`,
                  border: `1px solid ${COLORS.goldBorder18}`,
                  boxShadow: COLORS.serviceModalShadow,
                }}
              >
                {/* Top accent */}
                <div
                  className="h-[2px] w-full"
                  style={{ background: COLORS.topAccentGradient }}
                />

                {/* ── Sticky Header ── */}
                <div
                  className="sticky top-0 z-20 px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6"
                  style={{
                    background: COLORS.serviceModalHeaderBg,
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${COLORS.dividerGold}`,
                  }}
                >
                  {/* Top row: icon + title + close */}
                  <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl
                                   flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${serviceColor}15`,
                          border: `1px solid ${serviceColor}30`,
                        }}
                      >
                        <ServiceIcon
                          className="w-5 h-5 sm:w-7 sm:h-7"
                          style={{ color: serviceColor }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="section-label mb-1"
                          style={{ fontSize: '10px' }}
                        >
                          Service Category
                        </div>
                        <h2
                          className="font-playfair text-lg sm:text-2xl xl:text-3xl
                                     font-bold leading-tight break-words"
                          style={{ color: COLORS.white }}
                        >
                          {service.title}
                        </h2>
                        <p
                          className="text-xs sm:text-sm mt-1 line-clamp-2 sm:line-clamp-none"
                          style={{ color: COLORS.textHalf }}
                        >
                          {service.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Close */}
                    <button
                      onClick={onClose}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-90"
                      style={{
                        background: COLORS.whiteFaint06,
                        border: `1px solid ${COLORS.goldBorder25}`,
                        color: COLORS.accent,
                      }}
                    >
                      <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Search + count */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="relative flex-1">
                      <Icons.Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: COLORS.goldSoftBorder }}
                      />
                      <input
                        type="text"
                        placeholder="Search sub-services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                                   placeholder:text-white/30 outline-none transition-all duration-300"
                        style={{
                          background: COLORS.whiteFaint04,
                          border: `1px solid ${COLORS.dividerGold}`,
                          color: COLORS.white,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = COLORS.goldBorderStrong;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = COLORS.dividerGold;
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.Filter
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: COLORS.goldSoftBorder }}
                      />
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        {filteredSubs.length} of {subServices.length} sub-services
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Body: Sub-service cards ── */}
                <div className="p-4 sm:p-6 xl:p-8">
                  {filteredSubs.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <Icons.Search
                        className="w-12 h-12 mx-auto mb-4"
                        style={{ color: COLORS.goldSoftBg }}
                      />
                      <p
                        className="text-lg font-semibold mb-2"
                        style={{ color: COLORS.white }}
                      >
                        No sub-services found
                      </p>
                      <p className="text-sm" style={{ color: COLORS.textMuted }}>
                        Try a different search term
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
                      {filteredSubs.map((sub, idx) => {
                        // Resolve sub-service icon
                        const SubIcon =
                          (Icons as any)[sub.icon ?? ''] || Icons.Settings;

                        return (
                          <motion.div
                            key={sub.id ?? idx}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            onClick={() => onSelectSubservice(sub)}
                            className="group cursor-pointer rounded-2xl overflow-hidden
                                       flex flex-col transition-all duration-300"
                            style={{
                              background: COLORS.cardBgMedium,
                              border: `1px solid ${COLORS.borderLight}`,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.goldBorderStrong;
                              el.style.boxShadow =
                                COLORS.subserviceCardShadowHover;
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = COLORS.borderLight;
                              el.style.boxShadow = 'none';
                            }}
                          >
                            {/* ── Image ── */}
                            <div className="relative h-36 sm:h-40 xl:h-44 overflow-hidden">
                              <img
                                src={sub.image || service.img || ''}
                                alt={sub.title}
                                className="w-full h-full object-cover transition-transform duration-700
                                           group-hover:scale-110"
                              />
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: `linear-gradient(to top, ${COLORS.primary}, transparent 60%)`,
                                }}
                              />

                              {/* Hover overlay */}
                              <div
                                className="absolute inset-0 flex items-center justify-center
                                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'rgba(0,0,0,0.45)' }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full
                                             flex items-center justify-center"
                                  style={{
                                    background: `${serviceColor}30`,
                                    border: `2px solid ${serviceColor}`,
                                  }}
                                >
                                  <Icons.Eye
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    style={{ color: serviceColor }}
                                  />
                                </motion.div>
                              </div>

                              {/* Icon badge top-left */}
                              <div className="absolute top-3 left-3">
                                <div
                                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
                                  style={{
                                    background: COLORS.blackOverlay,
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${serviceColor}40`,
                                  }}
                                >
                                  <SubIcon
                                    className="w-4 h-4"
                                    style={{ color: serviceColor }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* ── Content ── */}
                            <div className="p-4 sm:p-5 flex flex-col flex-1">
                              <h4
                                className="font-semibold text-sm sm:text-base xl:text-lg mb-2
                                           group-hover:text-yellow-300 transition-colors duration-300
                                           leading-snug line-clamp-2"
                                style={{ color: COLORS.white }}
                              >
                                {sub.title}
                              </h4>

                              <p
                                className="text-xs sm:text-sm leading-relaxed mb-4 flex-1 line-clamp-3"
                                style={{ color: COLORS.textHalf }}
                              >
                                {sub.shortDesc}
                              </p>

                              <div
                                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold mt-auto"
                                style={{ color: serviceColor }}
                              >
                                <span>Explore Details</span>
                                <Icons.ArrowRight
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform
                                             duration-300 group-hover:translate-x-1"
                                />
                              </div>
                            </div>

                            {/* Bottom glow */}
                            <div
                              className="h-[2px] scale-x-0 group-hover:scale-x-100
                                         transition-transform duration-500 origin-left"
                              style={{
                                background: `linear-gradient(90deg, ${serviceColor}, transparent)`,
                              }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom accent */}
                <div
                  className="h-[2px]"
                  style={{ background: COLORS.topAccentGradient }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}