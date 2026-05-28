import { useState, useRef, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  Send,
  CheckCircle2,
  Briefcase,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import AnimatedSection from '../AnimatedSection';
import {
  inquiryTypes,
  serviceOptions,
  productOptions,
  departmentOptions,
  EMAILJS_CONFIG,
} from '../ContactData';

/* ─── Decorative SVG Components ─────────────────────────────────────────── */
function LeftDecoration() {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 lg:w-56 xl:w-64 pointer-events-none overflow-hidden"
      style={{ opacity: 0.6 }}
    >
      <svg viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <motion.path d="M80 0 Q60 100 90 200 Q120 300 70 400 Q20 500 80 600 Q140 700 60 800"
          stroke="url(#leftGrad1)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeInOut' }} />
        <motion.path d="M120 0 Q100 120 130 240 Q160 360 110 480 Q60 600 120 720 Q180 840 100 800"
          stroke="url(#leftGrad2)" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 4, delay: 0.5, ease: 'easeInOut' }} />
        <motion.circle cx="80" cy="150" r="4" fill="rgba(212,160,23,0.3)"
          animate={{ cy: [150, 140, 150], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle cx="50" cy="350" r="3" fill="rgba(59,130,246,0.3)"
          animate={{ cy: [350, 340, 350], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        <motion.circle cx="100" cy="550" r="5" fill="rgba(212,160,23,0.2)"
          animate={{ cy: [550, 535, 550], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
        <defs>
          <linearGradient id="leftGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,160,23,0)" />
            <stop offset="20%" stopColor="rgba(212,160,23,0.4)" />
            <stop offset="50%" stopColor="rgba(212,160,23,0.2)" />
            <stop offset="80%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
          <linearGradient id="leftGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="30%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="70%" stopColor="rgba(212,160,23,0.2)" />
            <stop offset="100%" stopColor="rgba(212,160,23,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function RightDecoration() {
  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 lg:w-56 xl:w-64 pointer-events-none overflow-hidden"
      style={{ opacity: 0.6 }}
    >
      <svg viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <motion.path d="M120 0 Q140 100 110 200 Q80 300 130 400 Q180 500 120 600 Q60 700 140 800"
          stroke="url(#rightGrad1)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeInOut', delay: 0.3 }} />
        <motion.path d="M80 0 Q100 120 70 240 Q40 360 90 480 Q140 600 80 720 Q20 840 100 800"
          stroke="url(#rightGrad2)" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 4, delay: 0.8, ease: 'easeInOut' }} />
        <motion.circle cx="130" cy="180" r="4" fill="rgba(59,130,246,0.3)"
          animate={{ cy: [180, 170, 180], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
        <motion.circle cx="160" cy="380" r="3" fill="rgba(212,160,23,0.3)"
          animate={{ cy: [380, 370, 380], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
        <defs>
          <linearGradient id="rightGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="20%" stopColor="rgba(59,130,246,0.4)" />
            <stop offset="50%" stopColor="rgba(212,160,23,0.2)" />
            <stop offset="80%" stopColor="rgba(212,160,23,0.3)" />
            <stop offset="100%" stopColor="rgba(212,160,23,0)" />
          </linearGradient>
          <linearGradient id="rightGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,160,23,0)" />
            <stop offset="30%" stopColor="rgba(212,160,23,0.3)" />
            <stop offset="70%" stopColor="rgba(59,130,246,0.2)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function FloatingParticles() {
  const particles = [
    { x: '5%', y: '15%', size: 3, delay: 0, duration: 6, color: 'rgba(212,160,23,0.3)' },
    { x: '92%', y: '25%', size: 2, delay: 1, duration: 5, color: 'rgba(59,130,246,0.3)' },
    { x: '8%', y: '45%', size: 4, delay: 2, duration: 7, color: 'rgba(212,160,23,0.2)' },
    { x: '95%', y: '55%', size: 2, delay: 0.5, duration: 4, color: 'rgba(139,92,246,0.3)' },
    { x: '3%', y: '70%', size: 3, delay: 1.5, duration: 5.5, color: 'rgba(59,130,246,0.25)' },
    { x: '90%', y: '80%', size: 3, delay: 3, duration: 6, color: 'rgba(212,160,23,0.25)' },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface ContactFormProps {
  jobTitle: string | null;
  jobId: string | null;
}

const ContactForm = forwardRef<HTMLDivElement, ContactFormProps>(
  ({ jobTitle, jobId }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const isJobApplication = !!(jobTitle && jobId);

    const [selectedInquiry, setSelectedInquiry] = useState(
      jobTitle ? 'career' : 'general'
    );

    // ── Derive recipient email based on inquiry type ──
    const recipientEmail =
      selectedInquiry === 'career'
        ? EMAILJS_CONFIG.HR_EMAIL
        : EMAILJS_CONFIG.TO_EMAIL;

    const [form, setForm] = useState({
      // ── Common ──
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      designation: '',
      service: '',
      product: '',
      howHeard: '',
      message: '',
      // ── Project ──
      projectLocation: '',
      budget: '',
      timeline: '',
      // ── Product ──
      quantity: '',
      deliveryLocation: '',
      // ── Career (HR fields — no file upload) ──
      department: jobTitle ? 'engineering' : '',
      jobTitle: jobTitle || '',
      jobId: jobId || '',
      currentRole: '',
      totalExperience: '',
      currentLocation: '',
      noticePeriod: '',
      currentSalary: '',
      expectedSalary: '',
      keySkills: '',
      linkedinUrl: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (jobTitle && jobId) {
        setSelectedInquiry('career');
        setForm((prev) => ({
          ...prev,
          jobTitle,
          jobId,
          message: `I am interested in applying for the position: ${jobTitle} (${jobId}).\n\nPlease find my details below.`,
        }));
      }
    }, [jobTitle, jobId]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    // ── Build email content ──
    const buildHtmlEmail = (): string => {
      const inquiryLabel =
        inquiryTypes.find((t) => t.id === selectedInquiry)?.title || 'General';

      // ── Derive recipient email inside builder too ──
      const emailRecipient =
        selectedInquiry === 'career'
          ? EMAILJS_CONFIG.HR_EMAIL
          : EMAILJS_CONFIG.TO_EMAIL;

      const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      const row = (label: string, value: string, highlight = false) => {
        if (!value || value === 'N/A' || value.trim() === '') return '';
        return `
      <tr>
        <td style="padding:8px 12px; background:#f9fafb; font-weight:600;
                   color:#374151; font-size:12px; width:38%;
                   border-bottom:1px solid #e5e7eb;">
          ${label}
        </td>
        <td style="padding:8px 12px; font-size:12px;
                   border-bottom:1px solid #e5e7eb;
                   color:${highlight ? '#d4a017' : '#111827'};
                   font-weight:${highlight ? '700' : 'normal'};">
          ${value}
        </td>
      </tr>
    `;
      };

      const linkRow = (label: string, href: string, text: string) => {
        if (!href || href === 'N/A' || href.trim() === '') return '';
        return `
      <tr>
        <td style="padding:8px 12px; background:#f9fafb; font-weight:600;
                   color:#374151; font-size:12px; width:38%;
                   border-bottom:1px solid #e5e7eb;">
          ${label}
        </td>
        <td style="padding:8px 12px; font-size:12px; border-bottom:1px solid #e5e7eb;">
          <a href="${href}" style="color:#d4a017;">${text}</a>
        </td>
      </tr>
    `;
      };

      const section = (title: string, bgColor: string, rows: string): string => {
        const cleanRows = rows.replace(/\n\s*\n/g, '').trim();
        if (!cleanRows) return '';
        return `
      <div style="margin-bottom:22px;">
        <div style="background:${bgColor}; color:#ffffff; padding:9px 14px;
                    font-weight:700; font-size:13px; border-radius:6px 6px 0 0;">
          ${title}
        </div>
        <table role="presentation" style="width:100%; border-collapse:collapse;
               border:1px solid #e5e7eb; border-top:none;">
          ${cleanRows}
        </table>
      </div>
    `;
      };

      const contactSection = section('👤 Contact Details', '#d4a017', `
    ${row('Full Name', `${form.firstName} ${form.lastName}`)}
    ${linkRow('Email', `mailto:${form.email}`, form.email)}
    ${linkRow('Phone', `tel:${form.phone}`, form.phone)}
    ${row('Company', form.company)}
    ${row('Designation', form.designation)}
    ${row('How Heard', form.howHeard)}
  `);

      const serviceSection =
        selectedInquiry === 'service'
          ? section('🔧 Service Details', '#0a2447', `
          ${row('Service Required', form.service)}
        `)
          : '';

      const productSection =
        selectedInquiry === 'product'
          ? section('📦 Product Details', '#0a2447', `
          ${row('Product Category', form.product)}
          ${row('Quantity / Specs', form.quantity)}
          ${row('Delivery Location', form.deliveryLocation)}
        `)
          : '';

      const projectSection =
        selectedInquiry === 'project'
          ? section('🏗️ Project Details', '#0a2447', `
          ${row('Service Required', form.service)}
          ${row('Project Location', form.projectLocation)}
          ${row('Estimated Budget', form.budget)}
          ${row('Timeline', form.timeline)}
        `)
          : '';

      const partnershipSection =
        selectedInquiry === 'partnership'
          ? section('🤝 Partnership Details', '#0a2447', `
          ${row('Company', form.company)}
          ${row('Designation', form.designation)}
        `)
          : '';

      const careerSection =
        selectedInquiry === 'career'
          ? section('💼 Job Application', '#0a2447', `
          ${row('Position Applied', form.jobTitle)}
          ${row('Job ID', form.jobId)}
          ${row('Department', form.department)}
        `) +
          section('👔 Professional Profile', '#1e3a5f', `
          ${row('Current Role', form.currentRole)}
          ${row('Total Experience', form.totalExperience)}
          ${row('Current Location', form.currentLocation)}
          ${row('Notice Period', form.noticePeriod)}
          ${row('Current Salary', form.currentSalary)}
          ${row('Expected Salary', form.expectedSalary, true)}
          ${row('Key Skills', form.keySkills)}
          ${linkRow('LinkedIn / Portfolio', form.linkedinUrl, form.linkedinUrl)}
        `)
          : '';

      const generalSection =
        selectedInquiry === 'general'
          ? section('📋 Inquiry Details', '#0a2447', `
          ${row('Inquiry Type', inquiryLabel)}
        `)
          : '';

      return `
    <div style="max-width:640px; margin:0 auto; background:#ffffff;
                border-radius:12px; overflow:hidden;
                box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#050d1a,#0a2447);
                  padding:28px 32px; text-align:center;">
        <div style="color:#d4a017; font-size:11px; font-weight:700;
                    letter-spacing:3px; text-transform:uppercase; margin-bottom:6px;">
          CVS Multi Services
        </div>
        <h1 style="color:#ffffff; margin:0; font-size:20px; font-weight:700;">
          New ${inquiryLabel} Enquiry
        </h1>
        <div style="color:rgba(255,255,255,0.5); font-size:11px; margin-top:6px;">
          ${timestamp}
        </div>
      </div>

      <!-- Intro badge -->
      <div style="padding:16px 32px; background:#fffbeb; border-bottom:2px solid #d4a017;">
        <span style="background:#d4a017; color:#ffffff; padding:4px 14px;
                     border-radius:20px; font-size:11px; font-weight:700;">
          ${inquiryLabel}
        </span>
        <span style="margin-left:10px; color:#374151; font-size:13px;">
          A new message from <strong>${form.firstName} ${form.lastName}</strong>
          has been received. Kindly respond at your earliest convenience.
        </span>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">
        ${contactSection}
        ${generalSection}
        ${serviceSection}
        ${productSection}
        ${projectSection}
        ${careerSection}
        ${partnershipSection}

        <!-- Message -->
        <div style="margin-bottom:10px;">
          <div style="background:#d4a017; color:#ffffff; padding:9px 14px;
                      font-weight:700; font-size:13px; border-radius:6px 6px 0 0;">
            💬 ${selectedInquiry === 'career' ? 'Cover Letter / Message' : 'Message'}
          </div>
          <div style="border:1px solid #e5e7eb; border-top:none; padding:16px;
                      border-radius:0 0 6px 6px; color:#374151; font-size:13px;
                      line-height:1.7; white-space:pre-wrap; background:#fafafa;">
            ${form.message}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:16px 32px;
                  border-top:1px solid #e5e7eb; text-align:center;">
        <p style="margin:0; color:#6b7280; font-size:11px;">
          This email was sent automatically from the
          <strong>CVS Multi Services Website</strong>.
          Reply directly to
          <a href="mailto:${form.email}" style="color:#d4a017;">${form.email}</a>
          &nbsp;|&nbsp; Delivered to:
          <a href="mailto:${emailRecipient}" style="color:#d4a017;">${emailRecipient}</a>
        </p>
      </div>

    </div>
  `;
    };

    // ── Submit handler ──
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      const inquiryLabel =
        inquiryTypes.find((t) => t.id === selectedInquiry)?.title || 'General Inquiry';

      // ── Select recipient based on inquiry type ──
      const emailRecipient =
        selectedInquiry === 'career'
          ? EMAILJS_CONFIG.HR_EMAIL
          : EMAILJS_CONFIG.TO_EMAIL;

      const htmlEmail = buildHtmlEmail();

      const templateParams = {
        subject: `[CVS Website] New ${inquiryLabel} from ${form.firstName} ${form.lastName}`,
        from_name: `${form.firstName} ${form.lastName}`,
        reply_to: form.email,
        to_email: emailRecipient, // ← Dynamic recipient
        message_html: htmlEmail,
      };

      try {
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );

        if (response.status === 200) {
          setLoading(false);
          setSubmitted(true);
        } else {
          throw new Error('Unexpected status: ' + response.status);
        }
      } catch (err) {
        console.error('❌ EmailJS error:', err);
        setLoading(false);
        setError(
          `Could not send your message. Please try again or contact us directly at ${emailRecipient}`
        );
      }
    };

    const resetForm = () => {
      setSubmitted(false);
      setSelectedInquiry('general');
      setError('');
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', designation: '', service: '', product: '',
        howHeard: '', message: '', projectLocation: '', budget: '',
        timeline: '', quantity: '', deliveryLocation: '',
        department: '', jobTitle: '', jobId: '',
        currentRole: '', totalExperience: '', currentLocation: '',
        noticePeriod: '', currentSalary: '', expectedSalary: '',
        keySkills: '', linkedinUrl: '',
      });
    };

    const activeInquiry = inquiryTypes.find((t) => t.id === selectedInquiry);
    const formTitle = selectedInquiry === 'career' && jobTitle ? jobTitle : activeInquiry?.formSubtitle ?? 'How Can We Help?';
    const formLabel = selectedInquiry === 'career' && jobTitle ? 'Job Application' : activeInquiry?.formTitle ?? 'Send Message';
    const formTitleHighlight = selectedInquiry === 'career' && jobTitle ? 'Apply for' : undefined;

    const inputClasses = 'w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300';
    const inputStyle = { background: 'rgba(10,36,71,0.5)', border: '1px solid rgba(212,160,23,0.12)' };
    const labelClasses = 'block text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2';
    const labelStyle = { color: 'rgba(212,160,23,0.7)' };

    const onFocusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.target.style.borderColor = 'rgba(212,160,23,0.5)');
    const onBlurGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.target.style.borderColor = 'rgba(212,160,23,0.12)');

    return (
      <section
        ref={ref}
        id="contact-form"
        className="py-14 lg:py-20 relative overflow-hidden scroll-mt-20"
        style={{ background: '#050d1a', borderTop: '1px solid rgba(212,160,23,0.08)' }}
      >
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <LeftDecoration />
        <RightDecoration />
        <FloatingParticles />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">

            {/* ── Heading ── */}
            <AnimatedSection>
              <div className="text-center mb-8 lg:mb-10">
                <div className="section-label mx-auto w-fit mb-3">
                  {isJobApplication ? 'Job Application Form' : 'Send a Message'}
                </div>
                <h2 className="font-playfair text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-4">
                  {isJobApplication ? (
                    <>Apply for <span className="grad-gold">{jobTitle}</span></>
                  ) : (
                    <>Get In <span className="grad-gold">Touch With Us</span></>
                  )}
                </h2>
                <div className="divider-gold w-20 mx-auto" />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="p-5 sm:p-8 xl:p-10 rounded-3xl relative overflow-hidden"
                style={{
                  background: isJobApplication
                    ? 'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(10,36,71,0.4))'
                    : 'rgba(10,36,71,0.4)',
                  border: `1px solid ${isJobApplication ? 'rgba(212,160,23,0.2)' : 'rgba(212,160,23,0.12)'}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #0f3d7a, #d4a017, #0f3d7a)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.2), transparent)' }} />

                {/* ════ SUCCESS STATE ════ */}
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6"
                      style={{ background: 'rgba(37,211,102,0.1)', border: '3px solid #25d366' }}>
                      <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: '#25d366' }} />
                    </div>
                    <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                      {isJobApplication ? 'Application Submitted!' : 'Message Sent Successfully!'}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {isJobApplication
                        ? `Your application for "${jobTitle}" has been received.`
                        : 'Thank you for reaching out to CVS Multi Services.'}
                    </p>
                    <p className="text-xs sm:text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Your inquiry has been sent to{' '}
                      <span style={{ color: '#d4a017' }}>
                        {/* ── Dynamic email shown in success state ── */}
                        {isJobApplication
                          ? EMAILJS_CONFIG.HR_EMAIL
                          : EMAILJS_CONFIG.TO_EMAIL}
                      </span>.
                      We'll get back to you within 24 hours.
                    </p>
                    <div className="w-full max-w-md p-4 sm:p-5 rounded-2xl mb-8"
                      style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)' }}>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Sparkles className="w-4 h-4" style={{ color: '#d4a017' }} />
                        What happens next?
                      </h4>
                      <ul className="space-y-2">
                        {(isJobApplication
                          ? [
                            'Your application has been delivered to our HR team',
                            "You'll receive a confirmation at your email",
                            'Our team will review your profile within 48 hours',
                            'Shortlisted candidates will be contacted for an interview',
                          ]
                          : [
                            'Your message has been delivered to our team',
                            "You'll receive a confirmation at your email",
                            'A representative will contact you within 24 hours',
                          ]
                        ).map((step, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm"
                            style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#25d366' }} />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                      <button onClick={resetForm} className="btn-outline-gold px-5 py-3 rounded-xl text-sm">
                        Send Another Message
                      </button>
                      {isJobApplication ? (
                        <Link to="/careers" className="btn-gold px-5 py-3 rounded-xl text-sm flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Browse More Jobs</span>
                        </Link>
                      ) : (
                        <Link to="/" className="btn-gold px-5 py-3 rounded-xl text-sm flex items-center gap-2">
                          <span>Back to Home</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>

                ) : (
                  /* ════ FORM STATE ════ */
                  <>
                    <div className="mb-6 xl:mb-8">
                      <div className="section-label mb-2" style={{ fontSize: '10px' }}>{formLabel}</div>
                      <h2 className="font-playfair text-xl sm:text-2xl xl:text-3xl font-bold text-white mb-2">
                        {formTitleHighlight ? (
                          <>{formTitleHighlight} <span className="grad-gold">{formTitle}</span></>
                        ) : (
                          <>{formTitle.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="grad-gold">{formTitle.split(' ').at(-1)}</span>
                          </>
                        )}
                      </h2>
                      {jobId && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}>
                            <Briefcase className="w-3 h-3" />
                            Job ID: {jobId}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] sm:text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Your inquiry will be sent directly to{' '}
                        {/* ── Dynamic email shown below form title ── */}
                        <span style={{ color: '#d4a017' }}>{recipientEmail}</span>
                      </p>
                    </div>

                    {error && (
                      <div className="mb-6 p-3 sm:p-4 rounded-xl flex items-start gap-3"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <X className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
                        <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{error}</p>
                      </div>
                    )}

                    {/* Inquiry type selector */}
                    {!jobTitle && (
                      <div className="mb-6 xl:mb-8">
                        <label className={labelClasses} style={labelStyle}>
                          What would you like to discuss? *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {inquiryTypes.map((type) => (
                            <motion.button key={type.id} type="button"
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedInquiry(type.id)}
                              className="p-3 sm:p-4 rounded-xl text-left transition-all duration-300"
                              style={{
                                background: selectedInquiry === type.id ? `${type.color}15` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${selectedInquiry === type.id ? `${type.color}50` : 'rgba(255,255,255,0.06)'}`,
                                boxShadow: selectedInquiry === type.id ? `0 0 0 2px ${type.color}40` : 'none',
                              }}
                            >
                              <type.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2"
                                style={{ color: selectedInquiry === type.id ? type.color : 'rgba(255,255,255,0.4)' }} />
                              <div className="text-xs sm:text-sm font-semibold mb-0.5"
                                style={{ color: selectedInquiry === type.id ? 'white' : 'rgba(255,255,255,0.7)' }}>
                                {type.title}
                              </div>
                              <div className="text-[9px] sm:text-[10px] hidden sm:block"
                                style={{ color: 'rgba(255,255,255,0.4)' }}>
                                {type.description}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {selectedInquiry && (
                        <motion.form
                          ref={formRef}
                          key={selectedInquiry}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleSubmit}
                          className="space-y-4 sm:space-y-5"
                        >
                          {/* ── Name ── */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className={labelClasses} style={labelStyle}>First Name *</label>
                              <input type="text" name="firstName" value={form.firstName}
                                onChange={handleChange} required placeholder="John"
                                className={inputClasses} style={inputStyle}
                                onFocus={onFocusGold} onBlur={onBlurGold} />
                            </div>
                            <div>
                              <label className={labelClasses} style={labelStyle}>Last Name *</label>
                              <input type="text" name="lastName" value={form.lastName}
                                onChange={handleChange} required placeholder="Doe"
                                className={inputClasses} style={inputStyle}
                                onFocus={onFocusGold} onBlur={onBlurGold} />
                            </div>
                          </div>

                          {/* ── Email + Phone ── */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className={labelClasses} style={labelStyle}>Email Address *</label>
                              <input type="email" name="email" value={form.email}
                                onChange={handleChange} required placeholder="john@example.com"
                                className={inputClasses} style={inputStyle}
                                onFocus={onFocusGold} onBlur={onBlurGold} />
                            </div>
                            <div>
                              <label className={labelClasses} style={labelStyle}>Phone Number *</label>
                              <input type="tel" name="phone" value={form.phone}
                                onChange={handleChange} required placeholder="+91 98765 43210"
                                className={inputClasses} style={inputStyle}
                                onFocus={onFocusGold} onBlur={onBlurGold} />
                            </div>
                          </div>

                          {/* ── Company + Designation (non-career) ── */}
                          {(selectedInquiry === 'service' ||
                            selectedInquiry === 'project' ||
                            selectedInquiry === 'product') && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Company Name</label>
                                  <input type="text" name="company" value={form.company}
                                    onChange={handleChange} placeholder="Your Company"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Your Designation</label>
                                  <input type="text" name="designation" value={form.designation}
                                    onChange={handleChange} placeholder="Your Role"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                              </div>
                            )}

                          {/* ── Service ── */}
                          {selectedInquiry === 'service' && (
                            <div>
                              <label className={labelClasses} style={labelStyle}>Service Required *</label>
                              <select name="service" value={form.service} onChange={handleChange} required
                                className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                onFocus={onFocusGold} onBlur={onBlurGold}>
                                {serviceOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value} style={{ background: '#050d1a' }}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* ── Product ── */}
                          {selectedInquiry === 'product' && (
                            <>
                              <div>
                                <label className={labelClasses} style={labelStyle}>Product Category *</label>
                                <select name="product" value={form.product} onChange={handleChange} required
                                  className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                  onFocus={onFocusGold} onBlur={onBlurGold}>
                                  {productOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} style={{ background: '#050d1a' }}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Quantity / Specs</label>
                                  <input type="text" name="quantity" value={form.quantity}
                                    onChange={handleChange} placeholder="e.g., 100 units"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Delivery Location</label>
                                  <input type="text" name="deliveryLocation" value={form.deliveryLocation}
                                    onChange={handleChange} placeholder="City, State"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                              </div>
                            </>
                          )}

                          {/* ── Project ── */}
                          {selectedInquiry === 'project' && (
                            <>
                              <div>
                                <label className={labelClasses} style={labelStyle}>Service Required *</label>
                                <select name="service" value={form.service} onChange={handleChange} required
                                  className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                  onFocus={onFocusGold} onBlur={onBlurGold}>
                                  {serviceOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} style={{ background: '#050d1a' }}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Project Location</label>
                                  <input type="text" name="projectLocation" value={form.projectLocation}
                                    onChange={handleChange} placeholder="City, State"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Est. Budget</label>
                                  <select name="budget" value={form.budget} onChange={handleChange}
                                    className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={onFocusGold} onBlur={onBlurGold}>
                                    <option value="" style={{ background: '#050d1a' }}>Select...</option>
                                    <option value="<10L" style={{ background: '#050d1a' }}>Below ₹10 Lakhs</option>
                                    <option value="10-50L" style={{ background: '#050d1a' }}>₹10 – 50 Lakhs</option>
                                    <option value="50L-1Cr" style={{ background: '#050d1a' }}>₹50 Lakhs – 1 Cr</option>
                                    <option value="1-5Cr" style={{ background: '#050d1a' }}>₹1 – 5 Crores</option>
                                    <option value=">5Cr" style={{ background: '#050d1a' }}>Above ₹5 Crores</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>Timeline</label>
                                  <select name="timeline" value={form.timeline} onChange={handleChange}
                                    className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={onFocusGold} onBlur={onBlurGold}>
                                    <option value="" style={{ background: '#050d1a' }}>Select...</option>
                                    <option value="immediate" style={{ background: '#050d1a' }}>Immediate</option>
                                    <option value="1-3months" style={{ background: '#050d1a' }}>1 – 3 Months</option>
                                    <option value="3-6months" style={{ background: '#050d1a' }}>3 – 6 Months</option>
                                    <option value="6-12months" style={{ background: '#050d1a' }}>6 – 12 Months</option>
                                    <option value="planning" style={{ background: '#050d1a' }}>Just Planning</option>
                                  </select>
                                </div>
                              </div>
                            </>
                          )}

                          {/* ══════════════════════════════════════
                              ── CAREER — HR FIELDS (no file upload)
                              ══════════════════════════════════════ */}
                          {selectedInquiry === 'career' && (
                            <>
                              {/* Department */}
                              {!jobTitle && (
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Department of Interest *
                                  </label>
                                  <select name="department" value={form.department}
                                    onChange={handleChange} required
                                    className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={onFocusGold} onBlur={onBlurGold}>
                                    {departmentOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value} style={{ background: '#050d1a' }}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* Current Role + Experience */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Current Job Title / Role *
                                  </label>
                                  <input type="text" name="currentRole" value={form.currentRole}
                                    onChange={handleChange} required
                                    placeholder="e.g. Mechanical Engineer"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Total Experience *
                                  </label>
                                  <select name="totalExperience" value={form.totalExperience}
                                    onChange={handleChange} required
                                    className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={onFocusGold} onBlur={onBlurGold}>
                                    <option value="" style={{ background: '#050d1a' }}>Select...</option>
                                    <option value="Fresher" style={{ background: '#050d1a' }}>Fresher (0 years)</option>
                                    <option value="0-1 years" style={{ background: '#050d1a' }}>0 – 1 Year</option>
                                    <option value="1-2 years" style={{ background: '#050d1a' }}>1 – 2 Years</option>
                                    <option value="2-4 years" style={{ background: '#050d1a' }}>2 – 4 Years</option>
                                    <option value="4-7 years" style={{ background: '#050d1a' }}>4 – 7 Years</option>
                                    <option value="7-10 years" style={{ background: '#050d1a' }}>7 – 10 Years</option>
                                    <option value="10+ years" style={{ background: '#050d1a' }}>10+ Years</option>
                                  </select>
                                </div>
                              </div>

                              {/* Location + Notice Period */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Current Location *
                                  </label>
                                  <input type="text" name="currentLocation" value={form.currentLocation}
                                    onChange={handleChange} required
                                    placeholder="e.g. Ahmedabad, Gujarat"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Notice Period *
                                  </label>
                                  <select name="noticePeriod" value={form.noticePeriod}
                                    onChange={handleChange} required
                                    className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={onFocusGold} onBlur={onBlurGold}>
                                    <option value="" style={{ background: '#050d1a' }}>Select...</option>
                                    <option value="Immediate" style={{ background: '#050d1a' }}>Immediate / Available Now</option>
                                    <option value="15 days" style={{ background: '#050d1a' }}>15 Days</option>
                                    <option value="30 days" style={{ background: '#050d1a' }}>30 Days</option>
                                    <option value="45 days" style={{ background: '#050d1a' }}>45 Days</option>
                                    <option value="60 days" style={{ background: '#050d1a' }}>60 Days</option>
                                    <option value="90 days" style={{ background: '#050d1a' }}>90 Days</option>
                                    <option value="More than 90" style={{ background: '#050d1a' }}>More than 90 Days</option>
                                  </select>
                                </div>
                              </div>

                              {/* Current Salary + Expected Salary */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Current Salary
                                    <span className="ml-1 normal-case" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                      (optional)
                                    </span>
                                  </label>
                                  <input type="text" name="currentSalary" value={form.currentSalary}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 LPA"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                                <div>
                                  <label className={labelClasses} style={labelStyle}>
                                    Expected Salary *
                                  </label>
                                  <input type="text" name="expectedSalary" value={form.expectedSalary}
                                    onChange={handleChange} required
                                    placeholder="e.g. 8 LPA"
                                    className={inputClasses} style={inputStyle}
                                    onFocus={onFocusGold} onBlur={onBlurGold} />
                                </div>
                              </div>

                              {/* Key Skills */}
                              <div>
                                <label className={labelClasses} style={labelStyle}>
                                  Key Skills *
                                </label>
                                <input type="text" name="keySkills" value={form.keySkills}
                                  onChange={handleChange} required
                                  placeholder="e.g. AutoCAD, Piping Design, HSE, Project Management"
                                  className={inputClasses} style={inputStyle}
                                  onFocus={onFocusGold} onBlur={onBlurGold} />
                                <p className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                  Separate skills with commas
                                </p>
                              </div>

                              {/* LinkedIn / Portfolio */}
                              <div>
                                <label className={labelClasses} style={labelStyle}>
                                  LinkedIn / Portfolio URL
                                  <span className="ml-1 normal-case" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                    (optional)
                                  </span>
                                </label>
                                <input type="url" name="linkedinUrl" value={form.linkedinUrl}
                                  onChange={handleChange}
                                  placeholder="https://linkedin.com/in/yourname"
                                  className={inputClasses} style={inputStyle}
                                  onFocus={onFocusGold} onBlur={onBlurGold} />
                              </div>
                            </>
                          )}

                          {/* ── Partnership ── */}
                          {selectedInquiry === 'partnership' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <label className={labelClasses} style={labelStyle}>Company Name *</label>
                                <input type="text" name="company" value={form.company}
                                  onChange={handleChange} required placeholder="Your Company"
                                  className={inputClasses} style={inputStyle}
                                  onFocus={onFocusGold} onBlur={onBlurGold} />
                              </div>
                              <div>
                                <label className={labelClasses} style={labelStyle}>Your Designation *</label>
                                <input type="text" name="designation" value={form.designation}
                                  onChange={handleChange} required placeholder="CEO / Director"
                                  className={inputClasses} style={inputStyle}
                                  onFocus={onFocusGold} onBlur={onBlurGold} />
                              </div>
                            </div>
                          )}

                          {/* ── Message ── */}
                          <div>
                            <label className={labelClasses} style={labelStyle}>
                              {selectedInquiry === 'career'
                                ? 'Cover Letter / Why CVS? *'
                                : selectedInquiry === 'product'
                                  ? 'Product Details / Specifications *'
                                  : 'Your Message *'}
                            </label>
                            <textarea
                              name="message" value={form.message}
                              onChange={handleChange} required rows={5}
                              placeholder={
                                selectedInquiry === 'career'
                                  ? 'Tell us why you want to join CVS Multi Services and what value you bring...'
                                  : selectedInquiry === 'service'
                                    ? 'Describe your requirements...'
                                    : selectedInquiry === 'product'
                                      ? 'Describe the products, specifications...'
                                      : selectedInquiry === 'project'
                                        ? 'Tell us about your project...'
                                        : selectedInquiry === 'partnership'
                                          ? 'Describe your partnership proposal...'
                                          : 'How can we help you?'
                              }
                              className={inputClasses}
                              style={{ ...inputStyle, resize: 'none' }}
                              onFocus={onFocusGold} onBlur={onBlurGold}
                            />
                          </div>

                          {/* ── How heard ── */}
                          <div>
                            <label className={labelClasses} style={labelStyle}>
                              How did you hear about us?
                            </label>
                            <select name="howHeard" value={form.howHeard} onChange={handleChange}
                              className={inputClasses} style={{ ...inputStyle, cursor: 'pointer' }}
                              onFocus={onFocusGold} onBlur={onBlurGold}>
                              <option value="" style={{ background: '#050d1a' }}>Select...</option>
                              <option value="google" style={{ background: '#050d1a' }}>Google Search</option>
                              <option value="linkedin" style={{ background: '#050d1a' }}>LinkedIn</option>
                              <option value="referral" style={{ background: '#050d1a' }}>Referral / Word of Mouth</option>
                              <option value="website" style={{ background: '#050d1a' }}>Company Website</option>
                              <option value="social" style={{ background: '#050d1a' }}>Social Media</option>
                              <option value="event" style={{ background: '#050d1a' }}>Event / Conference</option>
                              <option value="other" style={{ background: '#050d1a' }}>Other</option>
                            </select>
                          </div>

                          {/* ── Submit ── */}
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gold px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 font-bold"
                            style={{ opacity: loading ? 0.7 : 1 }}
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                <span>Sending to CVS...</span>
                              </div>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>
                                  {selectedInquiry === 'career' ? 'Submit Application'
                                    : selectedInquiry === 'product' ? 'Submit Product Request'
                                      : 'Send Message'}
                                </span>
                              </>
                            )}
                          </button>

                          <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Your information will be sent securely to CVS Multi Services and handled with strict confidentiality.
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    );
  }
);

ContactForm.displayName = 'ContactForm';
export default ContactForm;