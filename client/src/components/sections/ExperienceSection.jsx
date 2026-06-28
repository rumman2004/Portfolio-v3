import React, { useRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────────────── */

/** Format a date range label: "May 2023 – Present" */
const formatRange = (exp) => {
  const fmt = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const start = fmt(exp.startDate) || 'Present';
  const end = exp.current ? 'Present' : (fmt(exp.endDate) || 'Present');
  return `${start} – ${end}`;
};

/* ── Role icons (lavender circle, 3 variants cycling by index) ─────── */
const RoleIcon = ({ index }) => {
  const stroke = '#5B6FFF';
  const sw     = '1.6';
  const common = { fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };

  const icons = [
    /* briefcase */
    <svg key="brief" viewBox="0 0 26 26" {...common} width={28} height={28}>
      <rect x="2" y="9" width="22" height="14" rx="2" />
      <path d="M16 9V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
      <line x1="13" y1="14" x2="13" y2="18" />
      <line x1="9"  y1="16" x2="17" y2="16" />
    </svg>,
    /* building */
    <svg key="build" viewBox="0 0 26 26" {...common} width={28} height={28}>
      <rect x="3" y="4" width="20" height="19" rx="2" />
      <path d="M9 23V11h8v12" />
      <rect x="10"  y="7" width="2.5" height="2.5" rx="0.5" />
      <rect x="13.5" y="7" width="2.5" height="2.5" rx="0.5" />
      <rect x="10"  y="14" width="2" height="2" rx="0.5" />
      <rect x="14"  y="14" width="2" height="2" rx="0.5" />
    </svg>,
    /* graduation cap */
    <svg key="grad" viewBox="0 0 26 26" {...common} width={28} height={28}>
      <path d="M2 10l11-6 11 6-11 6-11-6z" />
      <path d="M6 12.5V18c0 0 2.5 2 7 2s7-2 7-2v-5.5" />
      <line x1="24" y1="10" x2="24" y2="17" />
    </svg>,
  ];

  return icons[index % icons.length];
};

/* ── Bullet icons (3 per row, cycling) ────────────────────────────── */
const BULLET_ICONS = [
  /* pen/design */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <path d="M2 12L7 2l5 10" /><line x1="4" y1="8" x2="10" y2="8" />
    </svg>
  ),
  /* people/collab */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <circle cx="4.5" cy="5" r="2.2" />
      <circle cx="9.5" cy="5" r="2.2" />
      <path d="M1 12c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3" />
      <path d="M7 12c0-1.8 1.6-3 3.5-3" />
    </svg>
  ),
  /* rocket/launch */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <path d="M7 1C5 2.5 3.5 4.5 3.5 6.5a3.5 3.5 0 0 0 7 0C10.5 4.5 9 2.5 7 1z" />
      <circle cx="7" cy="6.5" r="1" />
      <path d="M5 9.5L3 12M9 9.5L11 12" />
    </svg>
  ),
  /* document */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <rect x="1" y="2" width="12" height="10" rx="1.5" />
      <line x1="3" y1="6" x2="11" y2="6" />
      <line x1="3" y1="8.5" x2="8" y2="8.5" />
    </svg>
  ),
  /* checkmark */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <circle cx="7" cy="7" r="5.5" />
      <polyline points="5,7 6.5,8.5 9,5.5" />
    </svg>
  ),
  /* lightbulb */
  (i) => (
    <svg key={i} viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <path d="M5 11h4M5.5 13h3M7 1a4 4 0 0 0-2 7.5V11h4V8.5A4 4 0 0 0 7 1z" />
    </svg>
  ),
];

/* ── Sub-components ─────────────────────────────────────────────────── */

const LocationPin = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="#5B6FFF" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" width={13} height={13}>
    <path d="M7 1C4.8 1 3 2.8 3 5c0 3.3 4 8 4 8s4-4.7 4-8c0-2.2-1.8-4-4-4z" />
    <circle cx="7" cy="5" r="1.2" />
  </svg>
);

const ExperienceRow = ({ exp, index }) => {
  /* Parse bullet points from description: split on ". " or newlines */
  const rawBullets = exp.bullets
    ?? (exp.description
      ? exp.description.split(/\.\s+/).filter(Boolean).slice(0, 3).map((b) => b.replace(/\.$/, '') + '.')
      : ['Contributed to key projects and deliverables.', 'Collaborated with cross-functional teams.', 'Maintained high quality standards throughout.']);

  const bullets = rawBullets.slice(0, 3);

  return (
    <div className="exp-item grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 md:gap-x-5 gap-y-3 mb-4">

      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-7 relative z-10">
        <div
          className="w-3 h-3 rounded-full bg-[#3B4FFF] flex-shrink-0"
          style={{ boxShadow: '0 0 0 3px #EFEFEF, 0 0 0 4.5px #D0D0D0' }}
        />
      </div>

      {/* Left card — role info */}
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5 flex flex-row items-start gap-4 min-w-0">
        {/* Icon circle */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: '#EEEEFF' }}
          aria-hidden="true"
        >
          <RoleIcon index={index} />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          <p className="text-[12px] font-bold text-[#3B4FFF] mb-1 tracking-wide">
            {formatRange(exp)}
          </p>
          <p className="text-base sm:text-lg font-extrabold text-[#111] leading-snug mb-0.5">
            {exp.position ?? exp.title}
          </p>
          <p className="text-[13px] text-[#555] mb-3">
            {exp.company}
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-[#555]">
            <LocationPin />
            {exp.location ?? 'Remote'}
          </div>
        </div>
      </div>

      {/* Right card — bullet points */}
      <div className="col-start-2 md:col-start-auto bg-white rounded-2xl border border-black/[0.07] p-5 flex flex-col justify-center gap-3 min-w-0">
        {bullets.map((point, bi) => {
          const Icon = BULLET_ICONS[(index * 3 + bi) % BULLET_ICONS.length];
          return (
            <div key={bi} className="flex items-start gap-2.5 text-[13px] text-[#333] leading-snug">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#EEEEFF' }}
                aria-hidden="true"
              >
                {Icon(bi)}
              </div>
              <span>{point}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

/* ── Main section ─────────────────────────────────────────────────── */
const ExperienceSection = () => {
  const { data: experiences, loading, error } = useFetch('/experience');
  const containerRef = useRef();

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || loading) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    tl.from('.exp-bg-text', { opacity: 0, scale: 1.01, duration: 0.45, ease: 'power2.out' })
      .from('.exp-headline', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .from('.exp-desc', { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out' }, '-=0.25')
      .from('.exp-item', {
        y: 16, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out',
      }, '-=0.2');
  }, { scope: containerRef, dependencies: [loading] });

  /* Don't render at all if there's nothing to show (keeps original null-return behaviour) */
  if (!loading && (!experiences || experiences.length === 0) && !error) return null;

  return (
    <section id="experience" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden selection:bg-[#3B4FFF] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">
          
          {/* Background Script Typography */}
          <div className="exp-bg-text absolute -top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-10">
            <span className="font-script text-[22vw] sm:text-[18vw] md:text-[220px] lg:text-9xl text-[#232323] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
              Journey
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="exp-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Work
            </span>
            <span className="relative z-10 flex items-baseline">
              EXPERIENCE
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          <p className="exp-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            A journey of collaboration, creativity, and continuous growth through meaningful projects and roles.
          </p>

        </div>

        {/* Timeline */}
        <div className="w-full max-w-6xl">
        {loading ? (
          <ExperienceSkeleton />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-black/[0.07] p-8 text-center">
            <p className="text-sm font-semibold text-[#111]">Couldn't load experience data.</p>
            <p className="text-xs text-[#888] mt-1">Refresh the page or check back shortly.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute z-0"
              style={{ left: 20, top: 28, bottom: 28, width: 1.5, background: '#D0D0D0' }}
              aria-hidden="true"
            />
            {experiences.map((exp, i) => (
              <ExperienceRow key={exp._id ?? i} exp={exp} index={i} />
            ))}
          </div>
        )}
        </div>

        {/* View all button */}
        {!loading && !error && experiences?.length > 0 && (
          <div className="flex justify-center mt-10">
            <a
              href="/about"
              className="inline-flex min-h-11 items-center gap-3 border border-[#C5C5C5] rounded-full px-7 py-3.5 text-xs font-bold uppercase text-[#111] transition-all duration-200 hover:bg-[#0448a8] hover:text-white hover:border-[#0448a8]"
            >
              View all experience <span className="text-base">→</span>
            </a>
          </div>
        )}

      </div>
    </section>
  );
};

const ExperienceSkeleton = () => (
  <div className="flex flex-col gap-3" role="status" aria-label="Loading experience">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 md:gap-x-5 gap-y-3">
        <div className="flex items-start justify-center pt-7">
          <div className="w-3 h-3 rounded-full bg-[#D0D0D0] animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] h-[120px] animate-pulse" />
        <div className="col-start-2 md:col-start-auto bg-white rounded-2xl border border-black/[0.06] h-[120px] animate-pulse" />
      </div>
    ))}
  </div>
);

export default ExperienceSection;
