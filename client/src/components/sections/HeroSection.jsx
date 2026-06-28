import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useFetch } from '../../hooks/useFetch';
gsap.registerPlugin(useGSAP);

const HeroSection = () => {
  const containerRef = useRef();
  const { data: profile, loading } = useFetch('/public/profile');

  useGSAP(() => {
    if (loading) return;
    const tl = gsap.timeline();

    // Subtle entrance animations
    tl.from('.hero-portfolio', { y: 28, opacity: 0, duration: 0.55, ease: 'power2.out' })
      .from('.hero-my', { scale: 0.92, opacity: 0, rotation: -8, duration: 0.45, ease: 'power2.out' }, '-=0.3')
      .from('.hero-image', { y: 36, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.3')
      .from('.hero-signature', { x: -24, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
      .from('.hero-info', { y: 18, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3');

  }, { scope: containerRef, dependencies: [loading] });

  const nameParts = profile?.name?.split(' ') || ['Rumman', 'Ahmed'];
  const firstName = nameParts[0] || 'Rumman';
  const lastName = nameParts.slice(1).join(' ') || 'Ahmed';
  const role = profile?.headline || profile?.role || 'Creative Developer';
  const heroImage = profile?.heroImage || "https://res.cloudinary.com/dtbytfxzs/image/upload/v1782067324/ChatGPT_Image_Jun_21_2026_11_33_04_PM_qdmy6z.png";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[100svh] bg-transparent overflow-hidden flex items-center justify-center selection:bg-[#4F46E5] selection:text-white"
    >
      {/* Import required Google Fonts */}
      <style>
        {`
          .font-bebas { font-family: 'Bebas Neue', sans-serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-signature { font-family: 'Mr Dafoe', cursive; }

          .stroke-text {
            -webkit-text-stroke: 1.5px #1A1A1A;
            color: transparent;
          }
          @media (min-width: 768px) {
            .stroke-text {
              -webkit-text-stroke: 2px #1A1A1A;
            }
          }
        `}
      </style>

      {/* Layer 1: Outlined Background Typography */}
      <div className="absolute top-[35%] sm:top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[52%] w-full flex justify-center z-0 pointer-events-none select-none">
        <div className="relative">
          {/* "My" Brush Text */}
          <span className="hero-my absolute -top-15 sm:-top-10 md:-top-[28%] lg:-top-[18%] left-2 sm:left-6 md:-left-[2%] font-signature text-[16vw] sm:text-[9vw] md:text-[12vw] lg:text-[8vw] text-[#1A1A1A] -rotate-[10deg] drop-shadow-md z-10">
            My
          </span>
          {/* "PORTFOLIO" Outlined Text */}
          <h1 className="hero-portfolio font-bebas text-[29vw] sm:text-[15vw] md:text-[22vw] lg:text-[22vw] xl:text-[21vw] leading-none stroke-text opacity-30 md:opacity-40 mix-blend-multiply md:mix-blend-normal whitespace-nowrap tracking-tight md:tracking-normal">
            PORTFOLIO
          </h1>
          {/* First Name Signature */}
          <span className="hero-signature absolute -bottom-16 sm:-bottom-20 md:-bottom-[40%] lg:-bottom-[30%] right-0 sm:right-4 md:right-auto md:left-[20%] font-signature text-[26vw] sm:text-[20vw] md:text-[20vw] lg:text-[18vw] text-[#0448a8] -rotate-[10deg] drop-shadow-sm opacity-100 whitespace-nowrap z-10">
            {firstName}
          </span>
        </div>
      </div>

      {/* Layer 2: Center Image */}
      <div className="hero-image relative z-10 w-full min-h-[100svh] max-w-7xl mx-auto flex items-end justify-center pt-12 md:pt-20">
        <div className="relative w-full max-w-[100%] sm:max-w-[100%] md:max-w-[480px] lg:max-w-[600px] h-[85svh] md:h-[80svh] flex items-end justify-center scale-110 sm:scale-100 origin-bottom">
          {/* Main Hero Image */}
          <img
            src={heroImage}
            alt={profile?.name || "Rumman"}
            className="w-full h-full object-contain object-bottom drop-shadow-2xl relative z-20"
            onError={(e) => {
              // Fallback to a placeholder if the image fails to load
              e.target.src = `https://ui-avatars.com/api/?name=${firstName}&size=600&background=F4F4F4&color=1A1A1A&font-size=0.33`;
              e.target.className = "w-[300px] h-[300px] rounded-full object-cover mb-20 drop-shadow-xl relative z-20";
            }}
          />

          {/* Bottom Gradient Fade for depth */}
          <div className="absolute bottom-0 left-0 w-full h-[35%] md:h-[40%] bg-gradient-to-t from-[#F4F4F4] via-[#F4F4F4]/80 to-transparent z-30 pointer-events-none"></div>
        </div>
      </div>


      {/* Layer 4: Text Content & CTAs */}
      <div className="hero-info absolute inset-x-0 bottom-12 sm:bottom-16 md:bottom-auto md:inset-auto md:right-[6%] lg:right-[8%] md:top-[75%] md:-translate-y-1/2 z-40 hidden lg:flex flex-col items-center md:items-end gap-5 md:gap-6 text-center md:text-right md:w-[360px] px-4 md:px-0">

        <div className="flex w-full max-w-[24rem] md:max-w-full flex-col items-center md:items-end bg-[#F4F4F4]/85 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm border border-white/60">
          <p className="font-inter text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-[#1A1A1A] font-bold leading-tight">
            {firstName} {lastName && <span className="text-[#0448a8]">{lastName}</span>}
          </p>
          <p className="font-inter text-sm sm:text-base text-[#6B7280] font-medium mt-1.5 leading-snug">
            {role}
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center md:justify-end gap-3 w-full max-w-[24rem] md:max-w-full">
          <a
            href="#work"
            className="flex-1 md:flex-none flex justify-center items-center min-h-12 px-6 py-3 bg-[#0448a8] !text-white hover:!text-[#0448a8] font-inter text-sm md:text-base font-semibold rounded-full hover:bg-white/80 hover:shadow-lg hover:shadow-[#0448a8]/20 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="flex-1 md:flex-none flex justify-center items-center min-h-12 px-6 py-3 border border-[#1A1A1A]/15 bg-white/60 text-[#1A1A1A] font-inter text-sm md:text-base font-semibold rounded-full hover:border-[#0448a8] hover:text-[#0448a8] hover:bg-white transition-all duration-300 whitespace-nowrap"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
