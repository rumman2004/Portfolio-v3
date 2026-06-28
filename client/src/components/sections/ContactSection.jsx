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
        gsap.set(['.contact-bg-text', '.contact-headline', '.contact-desc', '.contact-detail', '.contact-form-card', '.social-pill'], {
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
      .from('.contact-form-card', { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' }, '-=0.25')
      .from('.social-pill', { y: 10, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }, '-=0.2');

  }, { scope: containerRef, dependencies: [profileLoading, socialLoading] });

  return (
    <section id="contact" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden border-t border-[#1A1A1A]/10">

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* Editorial Header Section */}
        <div className="relative w-full max-w-4xl mb-14 md:mb-20 text-center flex flex-col items-center">
          
          {/* Background Script Typography */}
          <div className="contact-bg-text absolute -top-[6%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-10">
            <span className="font-script text-[22vw] sm:text-[22vw] md:text-[220px] lg:text-9xl text-[#232323] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
              Connect
            </span>
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

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full max-w-6xl justify-center">

          {/* Left Column: direct details */}
          <div className="w-full lg:w-5/12 flex flex-col">

            <div className="flex flex-col gap-6">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="contact-detail flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#3D4BFF]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#3D4BFF]" />
                  </div>
                  <div>
                    <p className="font-inter font-bold text-[#1A1A1A] text-sm">{label}</p>
                    {href ? (
                      <a href={href} className="font-inter text-[#6B7280] text-sm hover:text-[#3D4BFF] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-inter text-[#6B7280] text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full lg:w-7/12">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
