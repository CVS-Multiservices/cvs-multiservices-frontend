import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEOMeta from '../components/SEOMeta';
import { PageHero } from '../components/shared';
import { WhatsAppButton } from '@/components/ui';
import {
  IntroSection,
  TimelineSection,
  TeamSection,
  AboutCTASection,
  CSRSection,
} from '../components/about';

export default function About() {
  const location = useLocation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const aboutSchema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${origin}/about#webpage`,
      "url": `${origin}/about`,
      "name": "About CVS Multi Services",
      "description": "Learn about the history, timeline, leadership team, and corporate social responsibility (CSR) of CVS Multi Services Private Limited.",
      "publisher": {
        "@type": "Organization",
        "name": "CVS Multi Services Private Limited",
        "url": `${origin}/`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "CVS Multi Services Leadership",
      "description": "Board of Directors and Executive Officers of CVS Multi Services",
      "itemListElement": [
        {
          "@type": "Person",
          "name": "Chetankumar Shah",
          "jobTitle": "Director",
          "description": "Mr. Chetan Shah oversees the performance of the company as a whole and maintains overall performance, particularly departments within. He also produces and plans strategic operating plans and objectives for the long-term future."
        },
        {
          "@type": "Person",
          "name": "Arunaben Shah",
          "jobTitle": "Director",
          "description": "Aruna Shah has started her career from the bottom stage of marketing and after many efforts and experience she built well relations in Oil and Gas industry."
        },
        {
          "@type": "Person",
          "name": "Swapnil Shah",
          "jobTitle": "Chief Executive Officer",
          "description": "Swapnil Shah developed his own business to serve with Seismic Survey 2D and 3D Services in 2017. He achieved his vision through strong leadership and engineering expertise."
        },
        {
          "@type": "Person",
          "name": "Kushali Shah",
          "jobTitle": "Chief Financial Officer",
          "description": "Joined CVS Oil & Gas to support finance and IT operations, performing duties with exceptional dedication."
        }
      ]
    }
  ];

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="about-page">
      <SEOMeta
        title="About Us | CVS Multi Services Pvt. Ltd."
        description="Established in 1997, CVS Multi Services has grown from a cotton waste supplier to a leading provider of industrial, environmental, and safety services. Meet our leadership team."
        keywords="CVS history, about CVS, Chetan Shah, Chetankumar Shah, Swapnil Shah, industrial services team, company timeline, foundations"
        schema={aboutSchema}
      />
      <WhatsAppButton />
      <PageHero
        title="About CVS Multi Services"
        subtitle="Who We Are"
      />
      <IntroSection />
      <TimelineSection />
      <TeamSection />
      <CSRSection />
      <AboutCTASection />
    </div>
  );
}