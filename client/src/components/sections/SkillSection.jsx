import React, { useRef } from 'react';
import BentoSkills from '../animations/BentoSkills';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SkillSection = () => {
  const { data: skills, loading } = useFetch('/skills');
  const containerRef = useRef();

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(['.skill-bg-text', '.skill-headline', '.skill-desc'], {
        opacity: 1,
        y: 0,
        scale: 1
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    tl.from('.skill-bg-text', { opacity: 0, scale: 1.01, duration: 0.45, ease: 'power2.out' })
      .from('.skill-headline', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .from('.skill-desc', { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out' }, '-=0.25');
  }, { scope: containerRef });

  return (
    <section id="skills" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">
          
          {/* Background Script Typography */}
          <div className="skill-bg-text absolute -top-[1%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-10">
            <span className="font-script text-[22vw] sm:text-[22vw] md:text-[220px] lg:text-9xl text-[#232323] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
              Capabilities
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="skill-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Core
            </span>
            <span className="relative z-10 flex items-baseline">
              SKILLS
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          <p className="skill-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            A diverse set of skills that help me turn ideas into impactful digital experiences.
          </p>

        </div>

        {/* Grid */}
        {loading ? (
          <SkillsSkeleton />
        ) : (
          <BentoSkills skills={skills || []} />
        )}
      </div>
    </section>
  );
};

const SkillsSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading skills"
    className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#EEF0F4] p-px shadow-sm"
  >
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-px">
    {[...Array(24)].map((_, i) => (
      <div
        key={i}
        className="aspect-square min-h-[112px] bg-white p-4 flex flex-col items-center justify-center animate-pulse"
      >
        <div className="h-10 w-10 rounded-xl bg-gray-200 mb-3" />
        <div className="h-2.5 w-16 rounded bg-gray-200" />
        <div className="mt-2 h-2 w-12 rounded bg-gray-100" />
      </div>
    ))}
    </div>
  </div>
);

export default SkillSection;
