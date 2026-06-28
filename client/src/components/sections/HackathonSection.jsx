import React, { useRef } from 'react';
import BentoHackathon from '../animations/BentoHackathon';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal, Award, Users } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Fallback icons mapped by label
const STAT_ICONS = {
  'Hackathons Participated': Trophy,
  'Top 10 Finishes': Medal,
  'Winning Positions': Award,
  'Projects Built': Users,
};

const FALLBACK_STATS = [
  { icon: Trophy, value: '0+', label: 'Hackathons Participated' },
  { icon: Medal, value: '0', label: 'Top 10 Finishes' },
  { icon: Award, value: '0', label: 'Winning Positions' },
  { icon: Users, value: '0+', label: 'Projects Built' }
];

const HackathonSection = () => {
  const { data: hackathons, loading, error } = useFetch('/hackathon/featured');
  const { data: statsData, loading: statsLoading } = useFetch('/hackathon/stats');
  const containerRef = useRef();

  const stats = statsData?.length
    ? statsData.map((s) => ({ ...s, icon: STAT_ICONS[s.label] || Trophy }))
    : FALLBACK_STATS;

  useGSAP(() => {
    if (loading || statsLoading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.hack-bg-text, .hack-headline, .hack-desc, .stat-card', { opacity: 1, y: 0, x: 0 });
      gsap.utils.toArray('.stat-value').forEach((el) => { el.textContent = el.dataset.value; });
      return;
    }

    gsap.set(['.hack-bg-text', '.hack-headline', '.hack-desc', '.stat-card'], {
      opacity: 0, y: 14, x: 0, scale: 1
    });

    gsap.to(['.hack-bg-text', '.hack-headline', '.hack-desc', '.stat-card'], {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      }
    });

    // Counts up rather than just fading in — fits "achievements" better than a static number
    gsap.utils.toArray('.stat-value').forEach((el) => {
      const raw = el.dataset.value || '0';
      const suffix = raw.replace(/[\d.]/g, '');
      const target = parseFloat(raw) || 0;
      const counter = { val: 0 };

      gsap.to(counter, {
        val: target,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => { el.textContent = `${Math.round(counter.val)}${suffix}`; }
      });
    });

  }, { scope: containerRef, dependencies: [loading, statsLoading] });

  return (
    <section id="hackathons" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">

          {/* Background Script Typography */}
          <div className="hack-bg-text absolute -top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-10">
            <span className="font-script text-[22vw] sm:text-[22vw] md:text-[220px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
              Compete
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="hack-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Hackathon
            </span>
            <span className="relative z-10 flex items-baseline">
              AWARDS
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          <p className="hack-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            Milestones from intense weekends of innovation, problem-solving, and building impactful solutions.
          </p>

        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-10 mb-16 md:mb-20 w-full max-w-6xl justify-center">
          <div className="w-full max-w-4xl bg-white border border-[#1A1A1A]/10 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {stats.map(({ icon: Icon, value, label }, i) => (
                <div key={i} className="stat-card flex flex-col items-center text-center gap-3">
                  <Icon className="w-7 h-7 text-[#0448a8]" aria-hidden="true" />
                  <span className="stat-value font-headline text-3xl md:text-4xl text-[#1A1A1A]" data-value={value}>
                    0
                  </span>
                  <span className="font-inter text-xs md:text-sm text-[#6B7280] leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl">

          {error ? (
            <div className="h-[280px] bg-[#F8F8F8] border border-[#1A1A1A]/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-center px-6">
              <span className="font-inter text-[#1A1A1A] text-base font-semibold">The achievements couldn't be loaded</span>
              <span className="font-inter text-[#6B7280] text-sm">Refresh the page, or check back shortly.</span>
            </div>
          ) : (
            <BentoHackathon hackathons={hackathons || []} loading={loading} />
          )}

        </div>

        {/* View all button */}
        <div className="flex justify-center mt-16 relative z-20 w-full">
          <a
            href="/about"
            className="group flex min-h-11 items-center justify-center gap-2 bg-[#0448a8] !text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-[#0448a8]/20 hover:bg-[#03367d] hover:-translate-y-0.5 transition-all duration-200"
          >
            View All Hackathon Projects
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default HackathonSection;
