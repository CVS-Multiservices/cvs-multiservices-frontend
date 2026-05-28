// src/components/Data/contactData.ts
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Wrench,
  Package,
  Building2 as Building2Icon,
  Briefcase,
  Users,
} from 'lucide-react';

// ─── Contact Info Cards ────────────────────────────────────────────────────────
export const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Address',
    lines: ['20, Bhagwati Nagar Society', 'Near Gayatri Mandir', 'Mehsana – 384002, Gujarat'],
    action: {
      label: 'Get Directions',
      url: 'https://maps.google.com/?q=20+Bhagwati+Nagar+Society+Mehsana+Gujarat',
    },
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    lines: ['+91 72020 21251', '+91 81466 51251', '+91 97235 51751'],
    action: {
      label: 'Call Now',
      url: 'tel:+917202021251',
    },
  },
  {
    icon: Mail,
    title: 'Email Addresses',
    lines: ['info@cvsmultiservices.com', 'cvsmultiservices@gmail.com'],
    action: {
      label: 'Send Email',
      url: 'mailto:info@cvsmultiservices.com',
    },
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Monday – Saturday', '9:00 AM – 6:00 PM', 'Sunday: Closed'],
    action: {
      label: 'Schedule Call',
      url: 'tel:+917202021251',
    },
  },
];

// ─── Branch Offices ────────────────────────────────────────────────────────────
export const branches = [
  {
    id: 'hq',
    label: 'Headquarters',
    city: 'Mehsana',
    country: 'India',
    flag: '🇮🇳',
    address: '20, Bhagwati Nagar Society, Near Gayatri Mandir, Mehsana – 384002, Gujarat, India',
    phone: '+91 72020 21251',
    email: 'info@cvsmultiservices.com',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.041898804786!2d72.36778!3d23.58728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c4b76c5726d73%3A0xc1c97f63e7c08d60!2sMehsana%2C%20Gujarat%20384002!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin',
    mapUrl: 'https://maps.google.com/?q=20+Bhagwati+Nagar+Society+Mehsana+Gujarat',
    color: '#d4a017',
  },
  {
    id: 'ahmedabad',
    label: 'Regional Office',
    city: 'Ahmedabad',
    country: 'India',
    flag: '🇮🇳',
    address: 'Ahmedabad, Gujarat, India',
    phone: '+91 81466 51251',
    email: 'cvsmultiservices@gmail.com',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.6608093959!2d72.41494474999999!3d23.020490499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1640000000001!5m2!1sen!2sin',
    mapUrl: 'https://maps.google.com/?q=Ahmedabad,Gujarat,India',
    color: '#3b82f6',
  },
  {
    id: 'dubai',
    label: 'International Office',
    city: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    address: 'Dubai, United Arab Emirates',
    phone: '+971 XX XXX XXXX',
    email: 'info@cvsmultiservices.com',
    hours: 'Sun – Thu: 9:00 AM – 6:00 PM',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6868781767!2d54.89782545!3d25.07575255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1640000000002!5m2!1sen!2sin',
    mapUrl: 'https://maps.google.com/?q=Dubai,UAE',
    color: '#8b5cf6',
  },
];


// ─── Service Options ───────────────────────────────────────────────────────────
export const serviceOptions = [
  { value: '', label: 'Select a service...' },
  { value: 'metp', label: 'Mobile Effluent Treatment Plant (METP)' },
  { value: 'waste-hazardous', label: 'Hazardous Waste Management' },
  { value: 'waste-nonhazardous', label: 'Non-Hazardous Waste Management' },
  { value: 'equipment-rental', label: 'Industrial Equipment Rental' },
  { value: 'safety-materials', label: 'Safety Materials Supply' },
  { value: 'manpower', label: 'Manpower Supply' },
  { value: 'transport', label: 'Transportation & Logistics' },
  { value: 'other', label: 'Other Services' },
];

// ─── Product Options ───────────────────────────────────────────────────────────
export const productOptions = [
  { value: '', label: 'Select a product category...' },
  { value: 'safety-equipment', label: 'Safety Equipment & PPE' },
  { value: 'industrial-chemicals', label: 'Industrial Chemicals' },
  { value: 'pipes-fittings', label: 'Pipes & Fittings' },
  { value: 'electrical-materials', label: 'Electrical Materials' },
  { value: 'construction-materials', label: 'Construction Materials' },
  { value: 'tools-hardware', label: 'Tools & Hardware' },
  { value: 'fire-safety', label: 'Fire Safety Equipment' },
  { value: 'environmental-products', label: 'Environmental Products' },
  { value: 'spare-parts', label: 'Spare Parts & Components' },
  { value: 'other', label: 'Other Products' },
];

// ─── Department Options ────────────────────────────────────────────────────────
export const departmentOptions = [
  { value: '', label: 'Select department...' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'operations', label: 'Operations' },
  { value: 'technical', label: 'Technical' },
  { value: 'it', label: 'IT & Software' },
  { value: 'sales', label: 'Sales & Marketing' },
  { value: 'finance', label: 'Finance & Accounts' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'hse', label: 'Health & Safety' },
  { value: 'other', label: 'Other' },
];

export const inquiryTypes = [
  {
    id: 'general',
    icon: HelpCircle,
    title: 'General Inquiry',
    description: 'Questions about our company or services',
    color: '#d4a017',
    formTitle: 'General Inquiry',
    formSubtitle: 'How Can We Help?',
  },
  {
    id: 'service',
    icon: Wrench,
    title: 'Service Request',
    description: 'Request a quote for our services',
    color: '#3b82f6',
    formTitle: 'Service Request',
    formSubtitle: 'Request a Service Quote',
  },
  {
    id: 'product',
    icon: Package,
    title: 'Product Request',
    description: 'Request a quote for products or materials',
    color: '#ec4899',
    formTitle: 'Product Request',
    formSubtitle: 'Request a Product Quote',
  },
  {
    id: 'project',
    icon: Building2Icon,
    title: 'Project Discussion',
    description: 'Discuss a new or ongoing project',
    color: '#8b5cf6',
    formTitle: 'Project Discussion',
    formSubtitle: 'Discuss Your Project',
  },
  {
    id: 'career',
    icon: Briefcase,
    title: 'Job Application',
    description: 'Apply for a position or send resume',
    color: '#25d366',
    formTitle: 'Job Application',
    formSubtitle: 'Apply for a Position',
  },
  {
    id: 'partnership',
    icon: Users,
    title: 'Partnership',
    description: 'Explore business partnerships',
    color: '#f97316',
    formTitle: 'Partnership Inquiry',
    formSubtitle: 'Explore a Partnership',
  },
];

// ─── EmailJS Config ────────────────────────────────────────────────────────────
// src/components/ContactData.ts

export const EMAILJS_CONFIG = {
  SERVICE_ID:  (import.meta as any).env.VITE_EMAILJS_SERVICE_ID  as string,
  TEMPLATE_ID: (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID as string,
  PUBLIC_KEY:  (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY  as string,
  TO_EMAIL: 'info@cvsmultiservices.com',
  HR_EMAIL: 'hr.ho@cvsmultiservices.com',
};

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME:    (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME    as string,
  UPLOAD_PRESET: (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET as string,
};