import { PageHero } from '../components/shared';
import { WhatsAppButton } from '@/components/ui';
import {
  JobsGrid,
  BenefitsSection,
  WhyJoinUsSection,
  CareersCTASection,
} from '../components/careers';

export default function Careers() {
  return (
    <div style={{ background: '#080f1e' }}>
      <WhatsAppButton />
      <PageHero
        title="Join Our Team"
        subtitle="Careers"
        description="Build your career with India's leading industrial services company. Explore exciting opportunities across engineering, operations, and more."
      />
      <WhyJoinUsSection />
      <JobsGrid />
      <CareersCTASection />
    </div>
  );
}