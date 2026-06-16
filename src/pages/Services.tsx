import SEOMeta from '../components/SEOMeta';
import { PageHero } from '../components/shared';
import { ServicesGrid, ServicesCTASection, ServicesOrientedProjects } from '../components/services';
import { WhatsAppButton } from '@/components/ui';

export default function Services() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const servicesSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "2D/3D Seismic Survey",
      "provider": {
        "@type": "Organization",
        "name": "CVS Multi Services Private Limited",
        "url": `${origin}/`
      },
      "description": "State-of-the-art seismic data acquisition, Vibroseis, and data processing for hydrocarbon reserves identification."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Mobile Effluent Treatment Plants (ETP)",
      "provider": {
        "@type": "Organization",
        "name": "CVS Multi Services Private Limited",
        "url": `${origin}/`
      },
      "description": "Advanced mobile ETP fleet for oilfields and industrial wastewater treatment, meeting CPCB norms."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Industrial Waste Management",
      "provider": {
        "@type": "Organization",
        "name": "CVS Multi Services Private Limited",
        "url": `${origin}/`
      },
      "description": "Comprehensive collection, segregation, transportation, and recycling of hazardous and non-hazardous waste."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Integrated Facility Management Services (IFMS)",
      "provider": {
        "@type": "Organization",
        "name": "CVS Multi Services Private Limited",
        "url": `${origin}/`
      },
      "description": "Professional operations and maintenance services for industrial facilities."
    }
  ];

  return (
    <div style={{ background: '#080f1e' }}>
      <SEOMeta
        title="Our Services | Seismic Survey, ETP & Waste Management | CVS"
        description="Discover our advanced industrial solutions: 2D/3D seismic data acquisition, mobile effluent treatment plants (ETP), hazardous and non-hazardous waste management, and equipment supply."
        keywords="seismic survey services, mobile ETP, effluent treatment plant, hazardous waste disposal, industrial equipment supply, CVS services"
        schema={servicesSchema}
      />
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