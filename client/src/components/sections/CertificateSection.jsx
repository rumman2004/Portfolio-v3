import React, { useRef } from 'react';
import Bentocertificate from '../animations/Bentocertificate';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CertificateSection = () => {
  const { data: certificates, loading, error } = useFetch('/certificates');
  const containerRef = useRef();

  const certCount = certificates?.length ?? 0;

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(['.cert-bg-text', '.cert-headline', '.cert-desc'], {
        opacity: 1, y: 0, x: 0, scale: 1
      });
      return;
    }

    gsap.fromTo(
      ['.cert-bg-text', '.cert-headline', '.cert-desc'],
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
    <section id="certificates" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">
          
          {/* Background Script Typography */}
          <div className="cert-bg-text absolute -top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-10">
            <span className="font-script text-[22vw] sm:text-[22vw] md:text-[220px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
              Credentials
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="cert-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Verified
            </span>
            <span className="relative z-10 flex items-baseline">
              CERTIFICATES
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          <p className="cert-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            {!loading && !error && certCount > 0
              ? `${certCount} verified credential${certCount !== 1 ? 's' : ''} — a record of continuous learning, professional growth, and staying current with industry standards.`
              : 'A collection of certifications that represent my commitment to continuous learning, professional growth, and staying up-to-date with industry standards.'}
          </p>

        </div>

        {/* Cards */}
        <div className="w-full">
        {loading ? (
          <CertificatesSkeleton />
        ) : error ? (
          <div className="h-[220px] w-full bg-white rounded-xl border border-[#E5E5E5] flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="font-inter text-[#111] text-sm font-semibold">
              The credentials couldn't be loaded
            </span>
            <span className="font-inter text-[#888] text-xs">
              Refresh the page, or check back shortly.
            </span>
          </div>
        ) : certCount === 0 ? (
          <div className="h-[220px] w-full bg-white rounded-xl border border-[#E5E5E5] flex items-center justify-center">
            <span className="font-inter text-[#888] text-sm">
              No certifications listed yet — check back soon.
            </span>
          </div>
        ) : (
          <Bentocertificate certificates={certificates} />
        )}
        </div>

        {/* View all button */}
        {!loading && !error && certCount > 0 && (
          <div className="flex justify-center mt-16 relative z-20 w-full">
            <a
              href="/about"
              className="group flex items-center justify-center gap-2 bg-[#0448a8] text-white px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-[#0448a8]/20 hover:bg-[#03367d] hover:-translate-y-1 transition-all duration-300"
            >
              View All Certificates
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        )}

      </div>
    </section>
  );
};

const CertificatesSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading certificates"
    className="grid grid-cols-2 md:grid-cols-4 gap-4"
  >
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-[#E5E5E5] animate-pulse"
        style={{ height: '320px' }}
      />
    ))}
  </div>
);

export default CertificateSection;
