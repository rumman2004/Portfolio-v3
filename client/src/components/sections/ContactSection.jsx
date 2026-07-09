import React, { useRef } from 'react';
import ContactForm from '../features/contact/ContactForm';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { useFetch } from '../../hooks/useFetch';
import { resolveIcon } from '../../utils/iconMap';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ContactSection = () => {
  const containerRef = useRef();
  const { data: profile, loading: profileLoading } = useFetch('/public/profile');
  const { data: socialMedia, loading: socialLoading } = useFetch('/social-media');

  const contactDetails = [
    { icon: Mail, label: 'Email', value: profile?.email || 'hello@example.com', href: profile?.email ? `mailto:${profile.email}` : '#' },
    { icon: Phone, label: 'Phone', value: profile?.phone || '+1 234 567 890', href: profile?.phone ? `tel:${profile.phone}` : '#' },
    { icon: MapPin, label: 'Location', value: profile?.location || 'Worldwide' },
    { icon: Send, label: 'Availability', value: profile?.isAvailable ? 'Open to freelance & full-time opportunities' : 'Currently not available for new projects' }
  ];

  const socialLinks = socialMedia || [];

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || profileLoading || socialLoading) {
      if (prefersReducedMotion) {
        gsap.set(['.contact-bg-text', '.contact-headline', '.contact-desc', '.contact-detail', '.contact-form-card'], {
          opacity: 1, y: 0, x: 0, scale: 1
        });
      }
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

    tl.from('.contact-bg-text', { opacity: 0, scale: 1.01, duration: 0.45, ease: 'power2.out' })
      .from('.contact-headline', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .from('.contact-desc', { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out' }, '-=0.25')
      .from('.contact-detail', { opacity: 0, y: 12, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, '-=0.2')
      .from('.contact-form-card', { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' }, '-=0.25');

  }, { scope: containerRef, dependencies: [profileLoading, socialLoading] });

  return (
    <section id="contact" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden border-t border-[#1A1A1A]/10">

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">

          {/* Background Script Typography */}
          <div className="absolute -top-[6%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
            <div className="contact-bg-text">
              <span className="font-script text-[22vw] sm:text-[22vw] md:text-[220px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2 block">
              Connect
            </span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="contact-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
              Let's
            </span>
            <span className="relative z-10 flex items-baseline">
              CONNECT
              <span className="text-[#0448a8]">.</span>
            </span>
          </h2>

          <p className="contact-desc font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together.
          </p>

        </div>

        {/* ── Glass Card Wrapper ── */}
        <div className="w-full max-w-6xl relative">
          <div className="rounded-[32px] p-6 md:p-10 lg:p-14 relative transition-all duration-500 bg-white/[0.45] backdrop-blur-[20px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none" />
            <div className="absolute top-0 left-10 w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between">

              {/* Left Column: direct details */}
              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                <h3 className="font-headline text-3xl md:text-4xl text-[#1A1A1A] mb-8">
                  Get in Touch
                </h3>
                <div className="flex flex-col gap-4">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="contact-detail group flex items-center gap-5 p-4 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/60">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/60 shadow-sm border border-white/80 flex items-center justify-center text-[#0448a8] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-inter font-medium text-[#6B7280] text-xs uppercase tracking-wider mb-1">{label}</p>
                        {href ? (
                          <a href={href} className="font-inter font-bold text-[#1A1A1A] text-base hover:text-[#0448a8] transition-colors line-clamp-1">
                            {value}
                          </a>
                        ) : (
                          <p className="font-inter font-bold text-[#1A1A1A] text-base line-clamp-1">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links rendering */}
                {socialLinks.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-[#1A1A1A]/10">
                    <p className="font-inter font-medium text-[#6B7280] text-xs uppercase tracking-wider mb-4">Also find me on</p>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((social) => {
                        const iconSrc = resolveIcon(social);
                        return (
                          <a
                            key={social._id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group social-pill flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.7),0_4px_10px_rgba(0,0,0,0.05)] text-[#1A1A1A] hover:bg-white/50 hover:border-white/70 hover:-translate-y-1 hover:shadow-[inset_0px_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(0,0,0,0.08)] transition-all duration-300"
                            aria-label={social.platform}
                          >
                            {iconSrc ? (
                              <img src={iconSrc} alt={social.platform} className="w-5 h-5 object-contain opacity-100 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <FaGithub className="w-5 h-5 opacity-100" />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Form */}
              <div className="w-full lg:w-6/12 relative z-20">
                <ContactForm />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
