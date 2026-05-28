// ==================== DATA SERVICE ====================

import { apiFetch } from '../config/api';
import {
  Slide,
  Stat,
  Feature,
  Partner,
  Blog,
  TeamMember,
  OngoingProject,
  UpcomingProject,
  Achievement,
  Timeline,
  Testimonial,
  Job,
  CSR,
  Gallery,
  Contact,
  Links,        // ✅ added
  AllData,
  FetchResult,
} from '../types';

const dataService = {

  // ==================== SLIDES ====================
  getSlides: (): Promise<FetchResult<Slide[]>> =>
    apiFetch<Slide[]>('slides'),

  // ==================== STATS ====================
  getStats: (): Promise<FetchResult<Stat[]>> =>
    apiFetch<Stat[]>('stats'),

  // ==================== FEATURES ====================
  getFeatures: (): Promise<FetchResult<Feature[]>> =>
    apiFetch<Feature[]>('features'),

  // ==================== PARTNERS ====================
  getPartners: (): Promise<FetchResult<Partner[]>> =>
    apiFetch<Partner[]>('partners'),

  // ==================== BLOGS ====================
  getBlogs: (): Promise<FetchResult<Blog[]>> =>
    apiFetch<Blog[]>('blog'),

  getBlogById: (id: string): Promise<FetchResult<Blog>> =>
    apiFetch<Blog>(`blog/${id}`),

  // ==================== TEAM ====================
  getTeam: (): Promise<FetchResult<TeamMember[]>> =>
    apiFetch<TeamMember[]>('team'),

  // ==================== PROJECTS ====================
  getOngoingProjects: (): Promise<FetchResult<OngoingProject[]>> =>
    apiFetch<OngoingProject[]>('ongoing-projects'),

  getUpcomingProjects: (): Promise<FetchResult<UpcomingProject[]>> =>
    apiFetch<UpcomingProject[]>('upcoming-projects'),

  // ==================== ACHIEVEMENTS ====================
  getAchievements: (): Promise<FetchResult<Achievement[]>> =>
    apiFetch<Achievement[]>('achievements'),

  // ==================== TIMELINE ====================
  getTimeline: (): Promise<FetchResult<Timeline[]>> =>
    apiFetch<Timeline[]>('timeline'),

  // ==================== TESTIMONIALS ====================
  getTestimonials: (): Promise<FetchResult<Testimonial[]>> =>
    apiFetch<Testimonial[]>('testimonials'),

  // ==================== JOBS ====================
  getJobs: (): Promise<FetchResult<Job[]>> =>
    apiFetch<Job[]>('jobs'),

  getJobById: (id: string): Promise<FetchResult<Job>> =>
    apiFetch<Job>(`jobs/${id}`),

  // ==================== CSR ====================
  getCSR: (): Promise<FetchResult<CSR[]>> =>
    apiFetch<CSR[]>('csr'),

  // ==================== GALLERY ====================
  getGallery: (): Promise<FetchResult<Gallery[]>> =>
    apiFetch<Gallery[]>('gallery'),

  // ==================== CONTACT ====================
  getContact: (): Promise<FetchResult<Contact[]>> =>
    apiFetch<Contact[]>('contact'),

  // ==================== LINKS ====================
  getLinks: (): Promise<FetchResult<Links[]>> =>
    apiFetch<Links[]>('links'),

  // ==================== FETCH ALL AT ONCE ====================
  getAll: async (): Promise<AllData> => {
    const [
      slidesRes,
      statsRes,
      featuresRes,
      partnersRes,
      blogsRes,
      teamRes,
      ongoingRes,
      upcomingRes,
      achievementsRes,
      timelineRes,
      testimonialsRes,
      jobsRes,
      csrRes,
      galleryRes,
      contactRes,
      linksRes,       // ✅ added
    ] = await Promise.allSettled([
      apiFetch<Slide[]>('slides'),
      apiFetch<Stat[]>('stats'),
      apiFetch<Feature[]>('features'),
      apiFetch<Partner[]>('partners'),
      apiFetch<Blog[]>('blog'),
      apiFetch<TeamMember[]>('team'),
      apiFetch<OngoingProject[]>('ongoing-projects'),
      apiFetch<UpcomingProject[]>('upcoming-projects'),
      apiFetch<Achievement[]>('achievements'),
      apiFetch<Timeline[]>('timeline'),
      apiFetch<Testimonial[]>('testimonials'),
      apiFetch<Job[]>('jobs'),
      apiFetch<CSR[]>('csr'),
      apiFetch<Gallery[]>('gallery'),
      apiFetch<Contact[]>('contact'),
      apiFetch<Links[]>('links'),   // ✅ added
    ]);

    // Safely extract array data or fallback to []
    const extract = <T>(
      result: PromiseSettledResult<FetchResult<T[]>>
    ): T[] => {
      if (
        result.status === 'fulfilled' &&
        result.value.success &&
        result.value.data
      ) {
        return result.value.data;
      }
      return [];
    };

    return {
      slides:           extract<Slide>(slidesRes),
      stats:            extract<Stat>(statsRes),
      features:         extract<Feature>(featuresRes),
      partners:         extract<Partner>(partnersRes),
      blogs:            extract<Blog>(blogsRes),
      team:             extract<TeamMember>(teamRes),
      ongoingProjects:  extract<OngoingProject>(ongoingRes),
      upcomingProjects: extract<UpcomingProject>(upcomingRes),
      achievements:     extract<Achievement>(achievementsRes),
      timeline:         extract<Timeline>(timelineRes),
      testimonials:     extract<Testimonial>(testimonialsRes),
      jobs:             extract<Job>(jobsRes),
      csr:              extract<CSR>(csrRes),
      gallery:          extract<Gallery>(galleryRes),
      contact:          extract<Contact>(contactRes),
      links:            extract<Links>(linksRes),
    };
  },
};

export default dataService;