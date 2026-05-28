import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { SubService } from '../../types';
import { COLORS } from '../../theme';

interface SubserviceDetailModalProps {
  subservice: SubService | null;
  serviceTitle?: string;
  serviceColor?: string;
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export function SubserviceDetailModal({
  subservice,
  serviceTitle,
  serviceColor,
  isOpen,
  onClose,
  onBack,
}: SubserviceDetailModalProps) {
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

  if (!subservice) return null;

  // Resolve icon from string
  const SubIcon = (Icons as any)[subservice.icon ?? ''] || Icons.Settings;

  // Guard empty string from DB
  const imageSrc =
    subservice.image && subservice.image.trim() !== '' ? subservice.image : '';

  // Guard undefined/empty serviceColor
  const color = serviceColor && serviceColor.trim() !== '' ? serviceColor : COLORS.accent;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000]"
            style={{
              background: COLORS.subserviceDetailBackdrop,
              backdropFilter: 'blur(14px)',
            }}
            onClick={onClose}
          />

          {/* ── Scroll wrapper ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 2xl:p-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 35 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 35 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl
                           rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.darkAlt} 100%)`,
                  border: `1px solid ${COLORS.goldBorder18}`,
                  boxShadow: COLORS.subserviceDetailShadow,
                }}
              >
                {/* Top accent */}
                <div
                  className="h-[2px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.whiteFaint06,
                    border: `1px solid ${COLORS.goldBorder25}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* ── Hero Image ── */}
                {imageSrc && (
                  <div className="relative h-48 sm:h-60 xl:h-72 2xl:h-80 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={subservice.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 30%, ${COLORS.modalBgStart} 100%)`,
                      }}
                    />
                    {/* Service title pill on image */}
                    {serviceTitle && (
                      <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold
                                     uppercase tracking-wider"
                          style={{
                            background: `${color}25`,
                            border: `1px solid ${color}50`,
                            color: color,
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          {serviceTitle}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Header ── */}
                <div
                  className="px-4 sm:px-6 xl:px-8 py-5 sm:py-6 xl:py-8"
                  style={{
                    background: imageSrc
                      ? 'transparent'
                      : COLORS.serviceModalHeaderBg,
                    borderBottom: `1px solid ${COLORS.dividerGold}`,
                    marginTop: imageSrc ? '-2px' : '0',
                  }}
                >
                  {/* Icon + title row */}
                  <div className="flex items-start gap-3 sm:gap-4 pr-10 sm:pr-12">
                    <div
                      className="w-11 h-11 sm:w-14 sm:h-14 xl:w-16 xl:h-16
                                 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <SubIcon
                        className="w-5 h-5 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                        style={{ color: color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {!imageSrc && serviceTitle && (
                        <div
                          className="text-[10px] sm:text-xs uppercase tracking-wider mb-1"
                          style={{ color: COLORS.aboutGoldSoft }}
                        >
                          {serviceTitle}
                        </div>
                      )}
                      <h2
                        className="font-playfair text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl
                                   font-bold leading-tight"
                        style={{ color: COLORS.white }}
                      >
                        {subservice.title}
                      </h2>
                      <p
                        className="text-xs sm:text-sm xl:text-base mt-2 leading-relaxed"
                        style={{ color: COLORS.aboutTextSoft }}
                      >
                        {subservice.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-4 sm:p-6 xl:p-8 2xl:p-10">

                  {/* Description */}
                  {subservice.fullDesc && (
                    <div className="mb-6 sm:mb-8">
                      <h3
                        className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl
                                   mb-3 uppercase tracking-wider flex items-center gap-2"
                        style={{ color: COLORS.white }}
                      >
                        <div
                          className="w-6 h-[2px]"
                          style={{ background: color }}
                        />
                        Description
                      </h3>
                      <p
                        className="text-sm sm:text-base xl:text-lg leading-relaxed"
                        style={{ color: COLORS.textLight62 }}
                      >
                        {subservice.fullDesc}
                      </p>
                    </div>
                  )}

                  {/* Key Features */}
                  {subservice.features && subservice.features.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h3
                        className="font-rajdhani font-bold text-base sm:text-lg xl:text-xl
                                   mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2"
                        style={{ color: COLORS.white }}
                      >
                        <div
                          className="w-6 h-[2px]"
                          style={{ background: color }}
                        />
                        Key Features
                      </h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        {subservice.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl"
                            style={{
                              background: `${color}08`,
                              border: `1px solid ${color}18`,
                            }}
                          >
                            <Icons.CheckCircle2
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: color }}
                            />
                            <span
                              className="text-sm xl:text-base"
                              style={{ color: COLORS.textLight72 }}
                            >
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div
                    className="h-[1px] mb-5 sm:mb-6"
                    style={{ background: COLORS.dividerGoldCenterGradient }}
                  />

                  {/* Action row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <button
                      onClick={onBack}
                      className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl
                                 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: COLORS.whiteFaint,
                        border: `1px solid ${COLORS.whiteSoft}`,
                        color: COLORS.textLightStrong,
                      }}
                    >
                      <Icons.ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <Link
                      to="/contact"
                      onClick={onClose}
                      className="btn-gold flex items-center gap-2
                                 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl
                                 text-sm sm:text-base font-bold"
                    >
                      <span>Request This Service</span>
                      <Icons.ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
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