import { PageHero } from '../components/shared';
import { ServicesGrid, ServicesCTASection, ServicesOrientedProjects } from '../components/services';
import { WhatsAppButton } from '@/components/ui';

export default function Services() {
  return (
    <div style={{ background: '#080f1e' }}>
      <WhatsAppButton />
      <PageHero
        title="Our Services"
        subtitle="What We Do"
        description="Comprehensive industrial solutions spanning environmental management, geophysical surveys, equipment rentals, and industrial support across India and UAE."
      />
      <ServicesGrid />
      <ServicesOrientedProjects />
      <ServicesCTASection />
    </div>
  );
}