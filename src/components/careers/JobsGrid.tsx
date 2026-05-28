import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import { JobCard } from './JobCard';
import { JobDetailPanel } from './JobDetailPanel';
import { JobFilters } from './JobFilters';
import { Job } from '../../types';
import dataService from '../../services/dataService';

export function JobsGrid() {
  // ── API state ──
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await dataService.getJobs();

        if (res.success && res.data) {
          const sorted = res.data.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
          setJobs(sorted);
        }
      } catch (err) {
        console.error('Jobs API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ── Filter logic ──
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === '' ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'all' || job.department?.id === selectedCategory;
      const matchesType =
        selectedType === 'all' || job.type?.id === selectedType;
      const matchesExperience =
        selectedExperience === 'all' || job.experience?.id === selectedExperience;
      const matchesLocation =
        selectedLocation === 'all' || job.location?.id === selectedLocation;
      const matchesCompany =
        selectedCompany === 'all' || job.company?.id === selectedCompany;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesExperience &&
        matchesLocation &&
        matchesCompany
      );
    });
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedExperience,
    selectedLocation,
    selectedCompany,
  ]);

  // ── Sort: featured first, then urgent, then newest ──
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return (
        new Date(b.postedDate ?? 0).getTime() -
        new Date(a.postedDate ?? 0).getTime()
      );
    });
  }, [filteredJobs]);

  const openDetail = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  // ── Prevent render until loaded or empty ──
  if (loading || jobs.length === 0) return null;

  return (
    <>
      <JobDetailPanel
        job={selectedJob}
        isOpen={isDetailOpen}
        onClose={closeDetail}
      />

      <section
        className="py-16 lg:py-24 relative overflow-hidden"
        style={{ background: '#080f1e' }}
      >
        {/* Background dot grid */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ── Full-width responsive container ── */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-10 lg:mb-12 2xl:mb-16">
              <div className="section-label mx-auto w-fit flex items-center gap-2">
                <Icons.Briefcase className="w-4 h-4" />
                Open Positions
              </div>
              <h2
                className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold text-white mb-4"
              >
                Current <span className="grad-gold">Opportunities</span>
              </h2>
              <div className="divider-gold w-24 mx-auto mb-6" />
              <p
                className="text-sm sm:text-base xl:text-lg max-w-2xl xl:max-w-3xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Find your perfect role across our operations in India and UAE.
                We're always looking for talented individuals to join our growing
                team.
              </p>
            </div>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection>
            <JobFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedExperience={selectedExperience}
              setSelectedExperience={setSelectedExperience}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              totalJobs={jobs.length}
              filteredCount={sortedJobs.length}
              jobs={jobs}                    // ← pass live data for dynamic filter options
            />
          </AnimatedSection>

          {/* Jobs Grid or Empty State */}
          {sortedJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
                {sortedJobs.map((job, idx) => (
                  <AnimatedSection key={job._id} delay={idx * 0.04}>
                    <JobCard job={job} onClick={() => openDetail(job)} />
                  </AnimatedSection>
                ))}
              </div>

              {/* Results count */}
              <p
                className="text-center text-xs sm:text-sm mt-8 xl:mt-10"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Showing {sortedJobs.length} of {jobs.length} positions
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 xl:py-28"
            >
              <Icons.Search
                className="w-14 h-14 xl:w-16 xl:h-16 mx-auto mb-4"
                style={{ color: 'rgba(212,160,23,0.2)' }}
              />
              <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold text-white mb-2">
                No jobs found
              </h3>
              <p
                className="text-sm xl:text-base"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}