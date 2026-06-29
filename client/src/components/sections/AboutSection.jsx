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
  
  const role = profile?.role || profile?.headline || 'Creative Developer';
  const roleParts = role.split(' ');
  const roleFirst = roleParts[0] || 'Creative';
  const roleLast = roleParts.slice(1).join(' ') || 'Developer';
  const heroImage = profile?.heroImage || "https://res.cloudinary.com/dtbytfxzs/image/upload/v1782067324/ChatGPT_Image_Jun_21_2026_11_33_04_PM_qdmy6z.png";

  return (
    <section 
      id="about" 
      ref={containerRef} 
      className="relative w-full min-h-[100svh] bg-transparent flex items-center justify-center overflow-x-hidden py-20 lg:py-0 selection:bg-[#3D4BFF] selection:text-white"
    >
      <style>
        {`
          .font-headline { font-family: 'Archivo Black', sans-serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-script { font-family: 'Caveat', cursive; }
          .liquid-glass {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
          }
          .text-glass {
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(26, 26, 26, 0.1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          .glass-stroke {
            -webkit-text-stroke: 1px rgba(26, 26, 26, 0.15);
          }
        `}
      </style>

      {/* Decorative blurred blobs for the glass effect */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#0448a8]/10 rounded-full blur-[80px] sm:blur-[120px] -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-purple-400/10 rounded-full blur-[80px] sm:blur-[100px] -z-10 mix-blend-multiply pointer-events-none"></div>

      <div className="relative z-10 max-w-[90rem] mx-auto w-full px-6 sm:px-12 md:px-20 lg:px-[15%] flex flex-col justify-center items-center lg:items-start lg:pl-[20%]">
        
        <div className="w-full max-w-5xl relative z-20 flex flex-col items-start pt-16 sm:pt-20">
          
          <div className="about-intro flex flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-14 liquid-glass p-2 sm:p-3 rounded-full pr-6 sm:pr-8 w-max">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-[2px] border-white/60 shadow-sm shrink-0 relative group">
              <div className="absolute inset-0 bg-[#0448a8]/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img 
                src={heroImage} 
                alt={firstName} 
                className="w-full h-full object-cover relative z-0"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${firstName}&size=100&background=F4F4F4&color=1A1A1A`;
                }}
              />
            </div>
            <div className="flex items-center">
              <p className="font-inter text-xs sm:text-sm text-[#4B5563] font-semibold tracking-widest uppercase flex items-center gap-2 m-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                I'm a freelancer
              </p>
            </div>
          </div>
          
          <div className="relative inline-block w-full mb-20 sm:mb-28 lg:mb-36">
            {/* Main Headline (Glass Text) */}
            <h2 className="about-headline font-headline text-[3.8rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[9rem] tracking-tighter leading-[0.9] uppercase select-none text-glass glass-stroke relative z-10 break-words">
              {roleFirst}
            </h2>
            
            {/* Handwriting */}
            <div 
              ref={scriptRef}
              className="absolute top-[25%] sm:top-[30%] md:top-[35%] lg:top-[40%] left-[15%] sm:left-[30%] md:left-[40%] lg:left-[45%] xl:left-[55%] z-30 pointer-events-none"
            >
              <span className="about-script inline-block font-script text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[10rem] text-[#0448a8] -rotate-[6deg] drop-shadow-[0_10px_20px_rgba(4,72,168,0.15)] leading-none select-none py-10 pr-10">
                {roleLast}
              </span>
            </div>
          </div>
          
          {/* About Me Paragraph - Liquid Glass Card */}
          <div className="about-body relative z-40 w-full max-w-[100%] sm:max-w-xl lg:max-w-2xl liquid-glass rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 overflow-hidden">
            {/* Inner glow for glass card */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/50 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10"></div>
            
            <div className="flex items-center gap-4 mb-6 sm:mb-8 relative z-10">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#0448a8] to-transparent"></div>
              <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">About Me</h4>
            </div>
            
            <div className="space-y-4 sm:space-y-5 relative z-10">
              <div className="font-inter text-[#374151] leading-[1.8] text-[0.95rem] md:text-[1.05rem] font-light whitespace-pre-wrap">
                {profile?.about ? profile.about : (
                  <>Hi there! I'm a passionate freelancer focused on building immersive and engaging digital experiences. I thrive on bringing creative ideas to life through modern web technologies.{"\n\n"}With a keen eye for aesthetics and a strong foundation in frontend architecture, I strive to create visually stunning applications that are both intuitive and highly functional. I love working on challenging projects that push the boundaries of what's possible on the web.</>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
