// ==================== ALL TYPES MATCHING MONGODB MODELS ====================

// ==================== SLIDE ====================
export interface Slide {
  id: string;
  _id: string;
  title: string;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== STATS ====================
export interface Stat {
  id: string;
  _id: string;
  value: number;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface SubService {
  id?: string;
  title?: string;
  icon?: string;
  image?: string;
  shortDesc?: string;
  fullDesc?: string;
  features?: string[];
}

export interface Feature {
  _id: string;
  title?: string;
  shortDesc?: string;
  img?: string;
  icon?: string;
  color?: string;
  index?: number;
  subServices?: SubService[];
  createdAt?: string;
  updatedAt?: string;
}
// ==================== PARTNER ====================
export interface Partner {
  id: string;
  _id: string;
  name: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== BLOG ====================
export interface Blog {
  id: string;
  _id: string;
  date?: string;
  category?: string;
  title: string;
  excerpt?: string;
  fullContent?: string;
  img?: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ==================== ACHIEVEMENT ====================
export interface Achievement {
  id: string;
  _id: string;
  icon?: string;
  title: string;
  desc?: string;
  year?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== TEAM ====================
export interface TeamMember {
  id: string;
  _id: string;
  name: string;
  role: string;
  displayorder: string;
  img?: string;
  desc?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== TIMELINE ====================
export interface Timeline {
  id: string;
  _id: string;
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  icon?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== ONGOING PROJECT ====================
export interface OngoingProject {
  _id: string;           // MongoDB ID — primary identifier
  title: string;         // required
  client?: string;
  location?: string;
  category?: string;
  icon?: string;         // string from DB e.g. "Droplets" → resolved via getIcon()
  image?: string;
  description?: string;
  highlights: string[]; // array of strings
  teamSize?: number;
  createdAt: string;    // used for sorting
  updatedAt: string;
}

// ==================== UPCOMING PROJECT ====================
export interface UpcomingProject {
  id: string;
  _id: string;
  title: string;
  client?: string;
  location?: string;
  category?: string;
  icon?: string;
  image?: string;
  estimatedDuration?: string;
  description?: string;
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ==================== TESTIMONIAL ====================
export interface Testimonial {
  id: string;
  _id: string;
  name: string;
  role?: string;
  company?: string;
  image?: string;
  rating: number;
  text?: string;
  project?: string;
  date?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== JOB ====================
export interface JobCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  isHiring: boolean;
}

export interface JobDepartment {
  id: string;
  name: string;
}

export interface JobLocation {
  id: string;
  name: string;
}

export interface JobType {
  id: string;
  name: string;
}

export interface JobExperience {
  id: string;
  name: string;
}

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  id: string;
  _id: string;
  title: string;
  company?: JobCompany;
  department?: JobDepartment;
  location?: JobLocation;
  type?: JobType;
  experience?: JobExperience;
  salary?: JobSalary;
  postedDate?: string;
  closingDate?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  positionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== CSR ====================
export interface CSR {
  id: string;
  _id: string;
  title: string;
  category?: string;
  description?: string;
  longDescription?: string;
  image?: string;
  icon?: string;
  impact?: string;
  year?: string;
  location?: string;
  highlights?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== GALLERY ====================
export interface Gallery {
  id: string;
  _id: string;
  title?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== CONTACT ====================
export interface ContactInfo {
  icon: string;
  title: string;
  lines: string[];
  actionLabel: string;
  actionUrl: string;
}

export interface Branch {
  id: string;
  label: string;
  city: string;
  country: string;
  flag: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapSrc: string;
  mapUrl: string;
  color: string;
}

export interface Contact {
  id: string;
  _id: string;
  contactInfo?: ContactInfo[];
  branches?: Branch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Links {
  id: string;
  _id: string;
  whatsappChat: string | null;  
  linkedin:     string | null;  
  instagram:    string | null;  
  youtube:      string | null;  
  facebook:     string | null;  
  x:            string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface FetchResult<T> {
  success: boolean;
  data: T | null;
  message?: string;
}



// ==================== ALL DATA TYPE ====================
export interface AllData {
  slides: Slide[];
  stats: Stat[];
  features: Feature[];
  partners: Partner[];
  blogs: Blog[];
  team: TeamMember[];
  ongoingProjects: OngoingProject[];
  upcomingProjects: UpcomingProject[];
  achievements: Achievement[];
  timeline: Timeline[];
  testimonials: Testimonial[];
  jobs: Job[];
  csr: CSR[];
  gallery: Gallery[];
  contact: Contact[];
  links:  Links[];
}