import {useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/shared';
import MultipleWays from '../components/contact/MultipleWays';
import ContactForm from '../components/contact/ContactForm';
import BranchLocations from '../components/contact/BranchLocations';
import ContactCTA from '../components/contact/ContactCTA';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('job');
  const jobId = searchParams.get('id');
  const formSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const isJobApplication = !!(jobTitle && jobId);

  useEffect(() => {
    if (jobTitle && jobId && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      const scrollTimeout = setTimeout(() => {
        if (formSectionRef.current) {
          const navbarHeight = 80;
          const elementPosition =
            formSectionRef.current.getBoundingClientRect().top +
            window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: 'smooth',
          });
        }
      }, 500);
      return () => clearTimeout(scrollTimeout);
    }
  }, [jobTitle, jobId]);

  return (
    <div style={{ background: '#080f1e' }}>
      <PageHero
        title="Contact Us"
        subtitle="Get In Touch"
        description="Have a question, project inquiry, or career interest? We'd love to hear from you. Reach out and let's start a conversation."
      />

      {/* Job Application Banner */}
      {isJobApplication && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sticky top-16 z-40"
          style={{
            background:
              'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(10,36,71,0.95))',
            borderBottom: '1px solid rgba(212,160,23,0.25)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(212,160,23,0.2)',
                    border: '1px solid rgba(212,160,23,0.3)',
                  }}
                >
                  <Briefcase
                    className="w-4 h-4"
                    style={{ color: '#d4a017' }}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-medium truncate"
                    style={{ color: 'rgba(212,160,23,0.8)' }}
                  >
                    Applying for:{' '}
                    <span className="text-white font-bold">
                      {jobTitle}
                    </span>
                  </p>
                  <p
                    className="text-[10px] hidden sm:block"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Job ID: {jobId} • Fill the form below to submit your
                    application
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (formSectionRef.current) {
                    const navbarHeight = 80;
                    const elementPosition =
                      formSectionRef.current.getBoundingClientRect()
                        .top + window.pageYOffset;
                    window.scrollTo({
                      top: elementPosition - navbarHeight,
                      behavior: 'smooth',
                    });
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
                           transition-all duration-300 hover:scale-105 flex-shrink-0"
                style={{
                  background: 'rgba(212,160,23,0.2)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  color: '#d4a017',
                }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Go to Form
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <MultipleWays />
      <ContactForm
        ref={formSectionRef}
        jobTitle={jobTitle}
        jobId={jobId}
      />
      <BranchLocations />
      <ContactCTA />
    </div>
  );
}