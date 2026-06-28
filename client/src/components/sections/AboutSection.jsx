import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFetch } from '../../hooks/useFetch';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AboutSection = () => {
  const containerRef = useRef();
  const scriptRef = useRef();
  const { data: profile, loading } = useFetch('/public/profile');

  useGSAP(() => {
    if (loading) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    tl.from('.about-intro', { y: 18, opacity: 0, duration: 0.45, ease: 'power2.out' })
      .from('.about-headline', { scale: 0.96, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25')
      .fromTo('.about-script', 
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, 
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.6, ease: 'power2.out' }, 
        '-=0.25'
      )
      .from('.about-body', { y: 14, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2');

    if (window.matchMedia("(min-width: 768px)").matches) {
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;
        if (scriptRef.current) {
          gsap.to(scriptRef.current, { x, y, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, { scope: containerRef, dependencies: [loading] });

  const nameParts = (profile?.name || 'Rumman Ahmed').split(' ');
  const firstName = nameParts[0] || 'Rumman';
  const lastName = nameParts.slice(1).join(' ') || 'Ahmed';
  const role = profile?.role || profile?.headline || 'Creative Developer';
  const heroImage = profile?.heroImage || "https://res.cloudinary.com/dtbytfxzs/image/upload/v1782067324/ChatGPT_Image_Jun_21_2026_11_33_04_PM_qdmy6z.png";

  return (
    <section 
      id="about" 
      ref={containerRef} 
      className="relative w-full min-h-[100svh] bg-transparent flex items-center justify-center overflow-hidden py-24 lg:py-0 selection:bg-[#3D4BFF] selection:text-white"
    >
      <style>
        {`
          .font-headline { font-family: 'Archivo Black', sans-serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-script { font-family: 'Caveat', cursive; }
        `}
      </style>

      <div className="relative z-10 max-w-[90rem] mx-auto w-full px-8 sm:px-12 md:px-20 lg:px-[15%] flex flex-col justify-center items-center lg:items-start lg:pl-[20%]">
        
        <div className="w-full max-w-5xl relative z-20 flex flex-col items-start pt-20">
          
          <div className="about-intro flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#1A1A1A]/10 shadow-sm shrink-0">
              <img 
                src={heroImage} 
                alt={firstName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${firstName}&size=100&background=F4F4F4&color=1A1A1A`;
                }}
              />
            </div>
            <p className="font-inter text-sm sm:text-base md:text-lg text-[#6B7280] font-medium tracking-wide flex flex-wrap items-center gap-1.5 sm:gap-2">
              I'm a <strong className="text-[#0448a8] font-bold">— {role}</strong>
            </p>
          </div>
          
          <div className="relative inline-block w-full">
            {/* Main Headline */}
            <h2 className="about-headline font-headline text-[3.5rem] sm:text-6xl md:text-[6rem] lg:text-[7rem] xl:text-[8.5rem] tracking-tight text-[#1A1A1A] leading-none uppercase select-none">
              {firstName}
            </h2>
            
            {/* Handwriting */}
            <div 
              ref={scriptRef}
              className="absolute top-[35%] sm:top-[50%] lg:top-[60%] left-[25%] sm:left-[45%] md:left-[55%] lg:left-[60%] xl:left-[70%] z-30 pointer-events-none"
            >
              <span className="about-script inline-block font-script text-[5rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[10rem] text-[#0448a8] -rotate-[8deg] drop-shadow-md leading-none select-none py-10 pr-10">
                {lastName}
              </span>
            </div>
          </div>
          
          {/* About Me Paragraph */}
          <div className="about-body mt-28 sm:mt-32 md:mt-24 lg:mt-12 max-w-sm sm:max-w-md lg:max-w-lg relative z-40">
            <p className="font-inter text-[#6B7280] leading-[1.8] md:leading-[1.9] text-sm md:text-base lg:text-[1.05rem] font-light">
              {profile?.about || 'I combine clean frontend architecture with visual systems that feel intentional: generous spacing, sharp hierarchy, fluid interactions, and sections that guide visitors through the work.'}
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};

export default AboutSection;
