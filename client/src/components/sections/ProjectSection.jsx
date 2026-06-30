import React, { useRef } from 'react';
import BentoProject from '../animations/BentoProject';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProjectSection = () => {
  // Fetch a subset of featured projects
  const { data: projects, loading, error } = useFetch('/projects/featured');
  const containerRef = useRef();

  const projectCount = projects?.length ?? 0;

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(['.proj-bg-text', '.proj-eyebrow', '.proj-headline', '.proj-desc', '.proj-cta'], {
        opacity: 1,
        y: 0,
        scale: 1
      });
      return;
    }

    gsap.fromTo(
      ['.proj-bg-text', '.proj-headline', '.proj-desc'],
      { opacity: 0, y: 18, scale: 0.99 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section id="work" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">

          {/* Background Script Typography — ambient depth layer behind the heading */}
          <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
            <div className="proj-bg-text opacity-10">
              <span className="font-script text-[23vw] sm:text-[22vw] md:text-[230px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2 block">
                Creations
              </span>
            </div>
          </div>



          {/* Main Heading */}
          <h2 className="proj-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Featured
            </span>
            <span className="relative z-10 flex items-baseline">
              PROJECTS
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          {/* Short introductory paragraph */}
          <p className="proj-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            A curated selection of projects showcasing strategy, design, and development across web, mobile, and branding experiences.
          </p>



        </div>

        {/* Filterable Bento Project Grid */}
        <div className="w-full flex justify-center">
          {loading ? (
            <ProjectsSkeleton />
          ) : error ? (
            <div className="h-[320px] w-full max-w-5xl bg-white border border-[#232323]/10 flex flex-col items-center justify-center gap-2 text-center px-6 rounded-3xl">
              <span className="font-inter text-[#232323] text-base font-semibold">The work couldn't be loaded</span>
              <span className="font-inter text-[#8A8A8A] text-sm">Refresh the page, or check back shortly.</span>
            </div>
          ) : projectCount === 0 ? (
            <div className="h-[320px] w-full max-w-5xl bg-white border border-[#232323]/10 flex items-center justify-center rounded-3xl">
              <span className="font-inter text-[#8A8A8A] text-base">New work is on the way — check back soon.</span>
            </div>
          ) : (
            <div className="w-full">
              <BentoProject projects={projects} />
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

// Echoes the bento grid's actual rhythm instead of one centered placeholder box
const ProjectsSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading featured work"
    className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4 h-[420px] md:h-[500px]"
  >
    <div className="col-span-2 row-span-2 bg-white border border-[#232323]/10 animate-pulse" />
    <div className="col-span-2 bg-white border border-[#232323]/10 animate-pulse" />
    <div className="bg-white border border-[#232323]/10 animate-pulse" />
    <div className="bg-white border border-[#232323]/10 animate-pulse" />
    <div className="col-span-2 bg-white border border-[#232323]/10 animate-pulse hidden md:block" />
  </div>
);

export default ProjectSection;
