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
  // Optimize Cloudinary URL by injecting responsive transform params
  const optimizeCloudinary = (url) => {
    if (url && url.includes('cloudinary.com') && !url.includes('w_600')) {
      return url.replace('/upload/', '/upload/w_600,f_auto,q_auto/');
    }
    return url;
  };
  const heroImage = optimizeCloudinary(profile?.heroImage || "https://res.cloudinary.com/dtbytfxzs/image/upload/v1782067324/ChatGPT_Image_Jun_21_2026_11_33_04_PM_qdmy6z.png");

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
            fetchPriority="high"
            crossOrigin="anonymous"
            className="w-full h-full object-contain object-bottom drop-shadow-2xl relative z-20"
            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%)', maskImage: 'linear-gradient(to top, transparent 0%, black 35%)' }}
            onError={(e) => {
              // Fallback to a placeholder if the image fails to load
              e.target.src = `https://ui-avatars.com/api/?name=${firstName}&size=600&background=F4F4F4&color=1A1A1A&font-size=0.33`;
              e.target.className = "w-[300px] h-[300px] rounded-full object-cover mb-20 drop-shadow-xl relative z-20";
              e.target.style.maskImage = 'none';
              e.target.style.WebkitMaskImage = 'none';
            }}
          />
        </div>
      </div>


      {/* Layer 4: CTAs (Floating Dock) */}
      <div className="hero-info absolute right-24 sm:right-32 md:right-48 lg:right-[12%] bottom-4 sm:bottom-12 z-40 hidden lg:flex pointer-events-none">
        <div className="flex items-center p-1.5 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80 pointer-events-auto">
          <a
            href="#work"
            className="flex items-center justify-center px-8 h-[46px] bg-[#0448a8] !text-white font-inter text-[15px] font-semibold rounded-full shadow-[0_4px_12px_rgba(4,72,168,0.25)] hover:bg-[#033b8a] transition-colors duration-300"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="flex items-center justify-center px-8 h-[46px] bg-transparent text-[#1A1A1A] font-inter text-[15px] font-medium rounded-full hover:bg-white/60 transition-colors duration-300"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
