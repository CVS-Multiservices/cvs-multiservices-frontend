import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { CSR } from '../../types';
import dataService from '../../services/dataService';

// ─── Icon resolver ────────────────────────────────────────────────────────────
const getIcon = (iconName: string | undefined): LucideIcon => {
  if (!iconName) return Icons.Settings;
  return (Icons as any)[iconName] || Icons.Settings;
};

// ─── Placeholder Image ────────────────────────────────────────────────────────
function PlaceholderImage({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
      }}
    >
      <Icon className="w-16 h-16 mb-3 opacity-30" style={{ color: COLORS.accent }} />
      <span
        className="text-xs text-center px-4 opacity-40"
        style={{ color: COLORS.white }}
      >
        {title}
      </span>
    </div>
  );
}

// ─── CSR Card ─────────────────────────────────────────────────────────────────
function CSRCard({
  initiative,
  onClick,
}: {
  initiative: CSR;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const IconComponent = getIcon(initiative.icon);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer rounded-3xl overflow-hidden h-full flex flex-col relative"
      style={{
        background: COLORS.cardBgMedium,
        border: `1px solid ${initiative.featured ? COLORS.goldBorderStrong : COLORS.dividerGold}`,
        boxShadow: COLORS.cardShadow,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.goldBorderStrong;
        el.style.boxShadow = COLORS.cardShadowHover;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = initiative.featured
          ? COLORS.goldBorderStrong
          : COLORS.dividerGold;
        el.style.boxShadow = COLORS.cardShadow;
      }}
    >
      {/* Featured Badge */}
      {initiative.featured && (
        <div
          className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold
                     uppercase tracking-wider flex items-center gap-1.5"
          style={{
            background: COLORS.progressGradient,
            color: COLORS.white,
            boxShadow: '0 4px 15px rgba(212,160,23,0.3)',
          }}
        >
          <Icons.Sparkles className="w-3 h-3" />
          Featured
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 xl:h-56 overflow-hidden">
        {!imageError ? (
          <img
            src={initiative.image}
            alt={initiative.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage title={initiative.title} icon={IconComponent} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.overlayMid}, transparent)`,
          }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0
                     group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: COLORS.projectOverlay }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: COLORS.goldSoftBg,
              border: `2px solid ${COLORS.accent}`,
            }}
          >
            <Icons.Eye className="w-6 h-6" style={{ color: COLORS.accent }} />
          </motion.div>
        </div>

        {/* Icon badge */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: COLORS.blackOverlay,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${COLORS.goldBorderStrong}`,
            }}
          >
            <IconComponent className="w-5 h-5" style={{ color: COLORS.accent }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 xl:p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: COLORS.dividerGold,
              border: `1px solid ${COLORS.goldSoftBg}`,
              color: COLORS.accent,
            }}
          >
            {initiative.category}
          </span>
        </div>

        <h3
          className="font-playfair font-bold text-lg xl:text-xl mb-2 transition-colors duration-300"
          style={{ color: COLORS.white }}
        >
          {initiative.title}
        </h3>

        <p
          className="text-sm xl:text-base leading-relaxed mb-4 flex-1 line-clamp-3"
          style={{ color: COLORS.textHalf }}
        >
          {initiative.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: COLORS.textMuted }}
          >
            <Icons.MapPin className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
            {initiative.location}
          </span>
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: COLORS.textMuted }}
          >
            <Icons.Calendar className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
            {initiative.year}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {initiative.highlights?.slice(0, 3).map((h, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: COLORS.highlightBg,
                color: COLORS.goldTextSoft,
                border: `1px solid ${COLORS.highlightBorder}`,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        <div
          className="mt-auto flex items-center gap-2 text-sm font-semibold"
          style={{ color: COLORS.accent }}
        >
          <span>Learn More</span>
          <Icons.ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div
        className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: COLORS.bottomLineGradient }}
      />
    </motion.div>
  );
}

// ─── CSR Detail Modal ──────────────────────────────────────────────────────────
function CSRDetailModal({
  initiative,
  isOpen,
  onClose,
}: {
  initiative: CSR | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  if (!initiative) return null;

  const IconComponent = getIcon(initiative.icon);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] backdrop-blur-md"
            style={{ background: COLORS.modalBackdrop }}
            onClick={onClose}
          />

          {/* Scroll wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
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
                  border: `1px solid ${COLORS.goldSoftBg}`,
                  boxShadow: COLORS.modalShadow,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.primaryOverlay80,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Hero Image */}
                <div className="relative h-56 sm:h-72 xl:h-80 2xl:h-96">
                  {!imageError ? (
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <PlaceholderImage title={initiative.title} icon={IconComponent} />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, transparent, ${COLORS.projectOverlay}, ${COLORS.primary})`,
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs
                                 font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2"
                      style={{ background: COLORS.progressGradient, color: COLORS.white }}
                    >
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {initiative.category}
                    </span>
                  </div>

                  {/* Title area */}
                  <div className="absolute bottom-4 left-4 right-12 sm:bottom-6 sm:left-6 sm:right-16">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: COLORS.goldSoftBg,
                          border: `1px solid ${COLORS.goldSoftBorder}`,
                        }}
                      >
                        <IconComponent
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color: COLORS.accent }}
                        />
                      </div>
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: COLORS.dividerGold,
                          color: COLORS.accent,
                          border: `1px solid ${COLORS.goldBorderStrong}`,
                        }}
                      >
                        {initiative.impact}
                      </span>
                    </div>
                    <h2
                      className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold leading-tight"
                      style={{ color: COLORS.white }}
                    >
                      {initiative.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 xl:p-8">
                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      {
                        icon: Icons.MapPin,
                        label: 'Location',
                        value: initiative.location,
                      },
                      {
                        icon: Icons.Calendar,
                        label: 'Duration',
                        value: initiative.year,
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="p-3 sm:p-4 rounded-xl text-center"
                        style={{
                          background: COLORS.cardBgMedium,
                          border: `1px solid ${COLORS.dividerGold}`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2"
                          style={{ color: COLORS.accent }}
                        />
                        <div
                          className="text-[10px] sm:text-xs"
                          style={{ color: COLORS.textHalf }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-sm font-semibold truncate"
                          style={{ color: COLORS.white }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-6 sm:mb-8">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div
                        className="w-6 h-[2px]"
                        style={{ background: COLORS.accent }}
                      />
                      About This Initiative
                    </h3>
                    <p
                      className="text-sm xl:text-base leading-relaxed"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {initiative.longDescription}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mb-2">
                    <h3
                      className="font-rajdhani font-bold text-base sm:text-lg mb-3 flex items-center gap-2"
                      style={{ color: COLORS.white }}
                    >
                      <div
                        className="w-6 h-[2px]"
                        style={{ background: COLORS.accent }}
                      />
                      Key Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {initiative.highlights?.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            background: COLORS.dividerGold,
                            border: `1px solid ${COLORS.goldSoftBg}`,
                            color: COLORS.accent,
                          }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── All Modal Card ────────────────────────────────────────────────────────────
function AllModalCard({
  initiative,
  onClick,
  imageError,
  onImageError,
}: {
  initiative: CSR;
  onClick: () => void;
  imageError: boolean;
  onImageError: () => void;
}) {
  const IconComponent = getIcon(initiative.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col"
      style={{
        background: COLORS.cardBgMedium,
        border: `1px solid ${COLORS.dividerGold}`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.goldBorderStrong;
        el.style.boxShadow = COLORS.cardShadowHover;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = COLORS.dividerGold;
        el.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div className="relative h-40 xl:h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={initiative.image}
            alt={initiative.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={onImageError}
          />
        ) : (
          <PlaceholderImage title={initiative.title} icon={IconComponent} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${COLORS.primary}, transparent)`,
          }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0
                     group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: COLORS.projectOverlay }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
            style={{
              background: COLORS.goldSoftBg,
              border: `2px solid ${COLORS.accent}`,
            }}
          >
            <Icons.Eye
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: COLORS.accent }}
            />
          </motion.div>
        </div>

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: COLORS.progressGradient, color: COLORS.white }}
          >
            {initiative.category}
          </span>
        </div>

        {/* Featured */}
        {initiative.featured && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              style={{
                background: COLORS.goldSoftBg,
                border: `1px solid ${COLORS.goldBorderStrong}`,
                color: COLORS.accent,
              }}
            >
              <Icons.Sparkles className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 xl:p-5 flex-1 flex flex-col">
        <h3
          className="font-playfair font-bold text-base xl:text-lg mb-2 group-hover:text-[#d4a017] transition-colors duration-300"
          style={{ color: COLORS.white }}
        >
          {initiative.title}
        </h3>
        <p
          className="text-xs xl:text-sm leading-relaxed mb-3 line-clamp-2 flex-1"
          style={{ color: COLORS.textHalf }}
        >
          {initiative.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Icons.Target className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
          <span className="text-xs font-semibold" style={{ color: COLORS.accent }}>
            {initiative.impact}
          </span>
        </div>

        <div
          className="flex items-center gap-3 text-xs mb-3"
          style={{ color: COLORS.textMuted }}
        >
          <span className="flex items-center gap-1">
            <Icons.MapPin className="w-3 h-3" style={{ color: COLORS.accent }} />
            {initiative.location}
          </span>
          <span className="flex items-center gap-1">
            <Icons.Calendar className="w-3 h-3" style={{ color: COLORS.accent }} />
            {initiative.year}
          </span>
        </div>

        <div
          className="mt-auto flex items-center gap-2 text-xs font-semibold"
          style={{ color: COLORS.accent }}
        >
          <span>View Details</span>
          <Icons.ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div
        className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: COLORS.bottomLineGradient }}
      />
    </motion.div>
  );
}

// ─── All CSR Modal ─────────────────────────────────────────────────────────────
function AllCSRModal({
  isOpen,
  onClose,
  onSelectInitiative,
  initiatives,               // ← receive live data as prop
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectInitiative: (initiative: CSR) => void;
  initiatives: CSR[];
}) {
  // ── image error tracking keyed by _id string ──
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

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
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.modalBgStart} 0%, ${COLORS.primary} 100%)`,
                  border: `1px solid ${COLORS.goldSoftBg}`,
                  boxShadow: COLORS.modalShadow,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10
                             w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             transition-all duration-300 hover:scale-110 hover:rotate-90"
                  style={{
                    background: COLORS.primaryOverlay80,
                    border: `1px solid ${COLORS.goldBorderStrong}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Modal Header */}
                <div
                  className="sticky top-0 z-[5] p-4 sm:p-6 xl:p-8 pb-4"
                  style={{ background: COLORS.modalBgStart }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: COLORS.goldSoftBg,
                        border: `1px solid ${COLORS.goldSoftBorder}`,
                      }}
                    >
                      <Icons.Heart
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: COLORS.accent }}
                      />
                    </div>
                    <div>
                      <h2
                        className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold"
                        style={{ color: COLORS.white }}
                      >
                        All{' '}
                        <span style={{ color: COLORS.accent }}>
                          CSR Initiatives
                        </span>
                      </h2>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: COLORS.textHalf }}
                      >
                        {initiatives.length} initiatives transforming communities · Click to view details
                      </p>
                    </div>
                  </div>
                  <div
                    className="h-[1px] mt-3 sm:mt-4"
                    style={{ background: COLORS.goldDividerGradient }}
                  />
                </div>

                {/* Grid */}
                <div className="p-4 sm:p-6 xl:p-8 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
                    {initiatives.map((initiative) => (
                      <AllModalCard
                        key={initiative._id}
                        initiative={initiative}
                        onClick={() => onSelectInitiative(initiative)}
                        imageError={imageErrors[initiative._id] ?? false}
                        onImageError={() => handleImageError(initiative._id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main CSR Section ──────────────────────────────────────────────────────────
export function CSRSection() {
  // ── API state ──
  const [initiatives, setInitiatives] = useState<CSR[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Modal state ──
  const [selectedInitiative, setSelectedInitiative] = useState<CSR | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchCSR = async () => {
      try {
        const res = await dataService.getCSR();

        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setInitiatives(sorted);
        }
      } catch (err) {
        console.error('CSR API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCSR();
  }, []);

  // ── Prevent render until loaded or empty ──
  if (loading || initiatives.length === 0) return null;

  const openDetailModal = (initiative: CSR) => {
    setSelectedInitiative(initiative);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedInitiative(null), 300);
  };

  const handleSelectFromAllModal = (initiative: CSR) => {
    setSelectedInitiative(initiative);
    setIsDetailModalOpen(true);
  };

  const displayedInitiatives = initiatives.slice(0, 4);

  return (
    <>
      <CSRDetailModal
        initiative={selectedInitiative}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
      <AllCSRModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        onSelectInitiative={handleSelectFromAllModal}
        initiatives={initiatives}        // ← pass live data
      />

      <section
        id="csr"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: COLORS.darkAlt }}
      >
        {/* Background elements */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
            transform: 'translate(-30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
            transform: 'translate(30%, 30%)',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Heading */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Icons.Heart className="w-4 h-4" />
                Giving Back
              </div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
                style={{ color: COLORS.white }}
              >
                Corporate Social{' '}
                <span className="grad-gold">Responsibility</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: COLORS.textHalf }}
              >
                At CVS, we believe in creating lasting positive impact. Our CSR
                initiatives focus on environment, education, healthcare, and
                community development.
              </p>
            </div>
          </AnimatedSection>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6 mb-10 lg:mb-12">
            {displayedInitiatives.map((initiative, idx) => (
              <AnimatedSection key={initiative._id} delay={idx * 0.1}>
                <CSRCard
                  initiative={initiative}
                  onClick={() => openDetailModal(initiative)}
                />
              </AnimatedSection>
            ))}
          </div>

          {/* View All CTA */}
          {initiatives.length > 4 && (
            <AnimatedSection>
              <div className="text-center">
                <button
                  onClick={() => setIsAllModalOpen(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold
                             transition-all duration-300 hover:scale-105"
                  style={{
                    background: COLORS.highlightBg,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.accent,
                  }}
                >
                  <Icons.Heart className="w-5 h-5" />
                  <span>View All {initiatives.length} Initiatives</span>
                  <Icons.ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </>
  );
}