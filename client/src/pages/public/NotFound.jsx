import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMascot } from '../../context/MascotContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { JellyBlobMascot } from 'feral-blob';
import 'feral-blob/blob.css';

gsap.registerPlugin(useGSAP);

const NotFound = () => {
  const { hideMascot, showMascot } = useMascot();
  const containerRef = useRef(null);

  useEffect(() => {
    // Hide the global floating mascot so we can use a custom one integrated into the page
    hideMascot();
    return () => showMascot();
  }, [hideMascot, showMascot]);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.notfound-mascot', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, '-=0.6')
    .from('.notfound-speech', {
      scale: 0.8,
      y: 10,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .from('.notfound-title', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'bounce.out',
      stagger: 0.1
    })
    .from('.notfound-btn', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.2');

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8F9FA] relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Mascot & Speech Bubble */}
        <div className="relative flex flex-col items-center mb-6">
          <div className="notfound-speech relative z-20 mb-3 transform">
            <div className="bg-white text-[#1A1A1A] text-sm md:text-[15px] font-medium py-2.5 px-5 rounded-2xl shadow-lg border border-[#E5E7EB] tracking-tight text-center font-inter max-w-[220px]">
              Uh oh, looks like you're lost. Let me help you back!
            </div>
            {/* Tail pointing down */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#E5E7EB] rotate-45 z-0"></div>
          </div>
          
          <div className="notfound-mascot w-28 h-28 md:w-32 md:h-32 relative">
            <JellyBlobMascot mood="sad" gaze={{ x: 0, y: 10 }} />
          </div>
        </div>

        {/* Minimal 404 Text */}
        <div className="flex items-center gap-4 text-[#1A1A1A] font-inter mb-8">
          <h1 className="notfound-title text-3xl md:text-4xl font-semibold tracking-tight">
            404
          </h1>
          <div className="w-[1px] h-10 md:h-12 bg-[#E5E7EB]"></div>
          <h2 className="notfound-title text-sm md:text-base font-normal tracking-tight text-[#595959]">
            This page could not be found.
          </h2>
        </div>
        
        {/* Return Home Button */}
        <div className="notfound-btn mt-2">
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#1A1A1A] !text-white font-inter text-[15px] font-medium rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg"
          >
            Return Home
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;
