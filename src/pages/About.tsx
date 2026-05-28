import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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