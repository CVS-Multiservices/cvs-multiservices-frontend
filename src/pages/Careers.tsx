import SEOMeta from '../components/SEOMeta';
import { PageHero } from '../components/shared';
import { WhatsAppButton } from '@/components/ui';
import {
  JobsGrid,
  BenefitsSection,
  WhyJoinUsSection,
  CareersCTASection,
} from '../components/careers';

export default function Careers() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const careersSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${origin}/careers#webpage`,
    "url": `${origin}/careers`,
    "name": "Careers at CVS Multi Services",
    "description": "Build your career with CVS Multi Services. Explore current job openings in process engineering, operations, safety, HSE, and technical services.",
    "publisher": {
      "@type": "Organization",
      "name": "CVS Multi Services Private Limited",
      "url": `${origin}/`
    }
  };

  return (
    <div style={{ background: '#080f1e' }}>
      <SEOMeta
        title="Careers & Job Openings | Join Our Expert Team | CVS"
        description="Build your career at CVS Multi Services. Explore current job openings in process engineering, operations, safety, HSE, and technical services. Join India's leading provider."
        keywords="CVS careers, job openings, join CVS, process engineer jobs, industrial services careers, oil & gas jobs"
        schema={careersSchema}
      />
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