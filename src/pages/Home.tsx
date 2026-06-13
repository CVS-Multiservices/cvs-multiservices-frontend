import SEOMeta from '../components/SEOMeta';
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
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvsmultiservices.com';

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      "name": "CVS Multi Services Private Limited",
      "url": `${origin}/`,
      "logo": `${origin}/apple-touch-icon.png`,
      "description": "CVS Multi Services Pvt. Ltd. is India's leading industrial services company specializing in Effluent Treatment, Waste Management, and Seismic Surveys.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "20 Bhagwati Nagar Society, Dharam Cinema Rd",
        "addressLocality": "Mehsana",
        "addressRegion": "Gujarat",
        "postalCode": "384002",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-81466-51251",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["en", "hi", "gu"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/cvs-multi-services-pvt-ltd"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      "name": "CVS Multi Services",
      "url": `${origin}/`,
      "publisher": {
        "@id": `${origin}/#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "CVS Multi Services Navigation",
      "description": "Main navigation links of CVS Multi Services",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Home",
          "url": `${origin}/`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "About Us",
          "url": `${origin}/about`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Services",
          "url": `${origin}/services`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Careers",
          "url": `${origin}/careers`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Gallery",
          "url": `${origin}/gallery`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Policies",
          "url": `${origin}/policies`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 7,
          "name": "Dubai Office",
          "url": `${origin}/dubai`
        },
        {
          "@type": "SiteNavigationElement",
          "position": 8,
          "name": "Contact Us",
          "url": `${origin}/contact`
        }
      ]
    }
  ];

  return (
    <div className="section-navy">
      <SEOMeta
        title="CVS Multi Services Pvt. Ltd. | India's Leading Industrial Services Provider"
        description="The group had the humble beginnings in the year 1997, as the suppliers of cotton waste. From there they diversified into the supply of Industrial safety goods."
        keywords="CVS Multi Services, seismic survey, ETP, effluent treatment plant, waste management, oil & gas, industrial safety, industrial services India"
        schema={homeSchema}
      />
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