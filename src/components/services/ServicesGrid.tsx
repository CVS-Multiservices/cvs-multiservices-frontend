// components/services/ServicesGrid.tsx

import { useState, useMemo } from 'react';
import AnimatedSection from '../AnimatedSection';
import { ServiceCard } from './ServiceCard';
import { ServiceSubservicesModal } from './ServiceSubservicesModal';
import { SubserviceDetailModal } from './SubserviceDetailModal';
import { Feature, SubService } from '../../types';
import { useAppData } from '../../App';

export function ServicesGrid() {
  // ── Data from global context (already fetched by Loader) ──
  const appData = useAppData();

  // ── Sort features by index ──
  const services = useMemo<Feature[]>(() => {
    if (!appData?.features?.length) return [];

    return [...appData.features].sort((a, b) => {
      if (a.index !== undefined && b.index !== undefined) {
        return a.index - b.index;
      }
      return (
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime()
      );
    });
  }, [appData?.features]);

  // ── Modal state ──
  const [selectedService, setSelectedService] = useState<Feature | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<SubService | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSubserviceModalOpen, setIsSubserviceModalOpen] = useState(false);

  // ── Nothing to show ──
  if (!services.length) return null;

  // ── Modal handlers ──
  const openServiceModal = (service: Feature) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const openSubserviceModal = (subservice: SubService) => {
    setSelectedSubservice(subservice);
    setIsSubserviceModalOpen(true);
  };

  const closeSubserviceModal = () => {
    setIsSubserviceModalOpen(false);
    setTimeout(() => setSelectedSubservice(null), 300);
  };

  const backToSubservices = () => {
    setIsSubserviceModalOpen(false);
  };

  return (
    <>
      <ServiceSubservicesModal
        service={selectedService}
        isOpen={isServiceModalOpen}
        onClose={closeServiceModal}
        onSelectSubservice={openSubserviceModal}
      />

      <SubserviceDetailModal
        subservice={selectedSubservice}
        serviceTitle={selectedService?.title}
        serviceColor={selectedService?.color}
        isOpen={isSubserviceModalOpen}
        onClose={() => {
          closeSubserviceModal();
          closeServiceModal();
        }}
        onBack={backToSubservices}
      />

      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: '#080f1e' }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            {services.map((service, idx) => (
              <AnimatedSection key={service._id} delay={idx * 0.08}>
                <ServiceCard
                  service={service}
                  onClick={() => openServiceModal(service)}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}