import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Landmark, School, BookOpen, FileText, Award, MapPin } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * EducationSection
 * Light, editorial timeline section matching the reference design:
 * - Oversized faint script "Education" watermark behind a bold condensed title
 * - Intro paragraph with a blue left-rule accent
 * - Vertical connector line with circular dot markers
 * - Stacked cards, each split into [icon | title/meta] | divider | [icon | description]
 */

const ICONS = {
  cap: GraduationCap,
  institute: Landmark,
  school: School,
  book: BookOpen,
  file: FileText,
  award: Award,
};

const formatRange = (start, end, current) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startYear = Number.isNaN(startDate.getFullYear()) ? 'Started' : startDate.getFullYear();
  const endYear = current || !end || Number.isNaN(endDate.getFullYear()) ? 'Present' : endDate.getFullYear();
  return `${startYear} – ${endYear}`;
};

const EducationSection = () => {
  const { data: educationData, loading, error } = useFetch('/education');
  const containerRef = useRef(null);

  useGSAP(
    () => {
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

      tl.from('.edu-bg-text', { opacity: 0, scale: 1.01, duration: 0.45, ease: 'power2.out' })
        .from('.edu-headline', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
        .from('.edu-desc', { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out' }, '-=0.25');

      gsap.fromTo(
        '.edu-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
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

      gsap.fromTo(
        '.edu-dot',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.edu-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.7,
          ease: 'power2.out',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [loading] }
  );

  // Use either the fetched data or an empty array.
  const education = educationData || [];

  if (!loading && education.length === 0 && !error) return null;

  return (
    <section ref={containerRef} id="education" className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">
          
          {/* Background Script Typography */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0 pointer-events-none select-none flex justify-center">
            <div className="edu-bg-text">
              <span className="font-script text-9xl md:text-[220px] lg:text-8xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2 block">
              Learning
            </span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="edu-headline font-headline text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-4xl md:text-6xl lg:text-7xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Formal
            </span>
            <span className="relative z-10 flex items-baseline">
              EDUCATION
              <span className="text-[#0448a8] text-5xl md:text-7xl lg:text-8xl">.</span>
            </span>
          </h2>

          <p className="edu-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            My academic journey that laid the foundation for my skills, creativity, and problem-solving mindset.
          </p>

        </div>

        {/* Timeline */}
        <div className="w-full max-w-5xl relative">
          {loading ? (
            <div className="flex flex-col gap-6 w-full animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-[160px] border border-black/[0.04]"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-black/[0.07] p-8 text-center">
              <p className="text-sm font-semibold text-[#111]">Couldn't load education data.</p>
            </div>
          ) : (
            <>
              {/* Vertical connector line */}
              <div
                className="edu-line absolute left-[19px] top-[28px] bottom-[28px] w-px bg-[#d4d4d8]"
                aria-hidden="true"
              />

              <div className="space-y-6">
                {education.map((item, index) => {
                  const MainIcon = ICONS[item.icon] || GraduationCap;
                  const DescIcon = ICONS[item.descIcon] || BookOpen;

              return (
                <div key={item._id || index} className="edu-card relative flex items-start gap-5">
                  {/* Dot marker */}
                  <div className="relative z-10 flex-shrink-0 pt-7">
                    <div className="edu-dot w-[39px] h-[39px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 md:px-8 py-7 flex flex-col md:flex-row items-start gap-6">
                    {/* Left: icon + main info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-full bg-[#eeeef9] flex items-center justify-center flex-shrink-0">
                        <MainIcon className="w-6 h-6 text-[#4f46e5]" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-[#4f46e5]">{item.year || formatRange(item.startDate, item.endDate, item.current)}</span>
                        <h3 className="text-lg md:text-xl font-bold text-[#18181b] mt-1">
                          {item.degree}
                        </h3>
                        <p className="text-[#71717a] text-sm mt-0.5">{item.fieldOfStudy || item.field}</p>
                        <div className="flex items-center gap-1.5 text-[#71717a] text-sm mt-2">
                          <MapPin className="w-3.5 h-3.5 text-[#4f46e5] flex-shrink-0" />
                          <span>{item.institution || item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px self-stretch bg-[#e4e4e7]" />

                    {/* Right: description icon + text */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-full bg-[#eeeef9] flex items-center justify-center flex-shrink-0">
                        <DescIcon className="w-6 h-6 text-[#4f46e5]" strokeWidth={1.75} />
                      </div>
                      <p className="text-[#52525b] text-sm leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
