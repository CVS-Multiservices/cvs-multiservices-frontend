import { WhatsAppButton } from '../components/ui';
import {
  HeroCarousel,
  StatsBar,
  FoundationsSection,
  AboutSection,
  AchievementsSection,
  BlogSection,
  ClientsSection,
  CTASection,
  OngoingProjectsSection,
  UpcomingProjectsSection,
  TestimonialsSection,
  ESGSection
} from '../components/home';
import { CSRSection } from '@/components/about';
import '../styles/animations.css';

export default function Home() {
  return (
    <div className="section-navy">
      <WhatsAppButton />
      <HeroCarousel />
      <StatsBar />
      <FoundationsSection />
      <AboutSection />
      <OngoingProjectsSection />
      {/* <UpcomingProjectsSection /> */}
      <AchievementsSection />
      <TestimonialsSection />
      <BlogSection />
      <CSRSection />
      {/* <ESGSection /> */}
      <ClientsSection />
      <CTASection />
  </div>
  );
}