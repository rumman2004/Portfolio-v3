import React, { useEffect, useState, useRef } from 'react';
import { JellyBlobMascot } from 'feral-blob';
import 'feral-blob/blob.css';
import { useMascot } from '../../../context/MascotContext';
import { useLocation } from 'react-router-dom';

const MascotCompanion = () => {
  const { mood, setMood, message, notifyMascot, isVisible } = useMascot();
  const location = useLocation();
  const [scrollDepth, setScrollDepth] = useState(0);

  const shouldHide = location.pathname.startsWith('/admin') || !isVisible;

  const moodRef = useRef(mood);
  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  // Scroll listener for sweet messages
  useEffect(() => {
    if (shouldHide) return;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;
      
      // Only trigger if we've moved a decent amount to avoid spam
      if (Math.abs(scrollY - lastScrollY) > 200) {
        if (scrollPercent > 80 && scrollDepth !== 80) {
          notifyMascot("Wow, you're exploring deep!", "happy", 4000);
          setScrollDepth(80);
        } else if (scrollY > lastScrollY && scrollPercent > 20 && scrollDepth !== 20) {
          notifyMascot("Ah, I see you scrolling... enjoying the view?", "hmm", 4000);
          setScrollDepth(20);
        } else if (scrollY < lastScrollY && scrollPercent < 10 && scrollDepth !== 0) {
          notifyMascot("Heading back up!", "happy", 3000);
          setScrollDepth(0);
        }
        lastScrollY = scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [notifyMascot, scrollDepth, shouldHide]);

  // Idle timer and Random Greetings
  useEffect(() => {
    if (shouldHide) return;
    let idleTimer;
    let greetingTimer;
    let intervalTimer;

    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (moodRef.current !== 'sad') notifyMascot("Zzz... still there?", "sad", 5000);
      }, 20000); // 20 seconds of idle
    };

    const fetchRandomGreeting = async () => {
      try {
        // Assume api is imported from services
        const { default: api } = await import('../../../services/api');
        const response = await api.get('/notifications/random');
        if (response.data && response.data.success) {
          const text = `${response.data.greeting?.text} ${response.data.message?.text}`;
          notifyMascot(text, "happy", 6000);
        }
      } catch (err) {
        console.error('Failed to fetch greeting:', err);
      }
    };

    // Initial greeting after 2s
    greetingTimer = setTimeout(() => {
      fetchRandomGreeting();
    }, 2000);

    // Repeat every 60 seconds
    intervalTimer = setInterval(() => {
      fetchRandomGreeting();
    }, 60000);

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('scroll', resetIdle);
    
    resetIdle();
    
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('scroll', resetIdle);
      clearTimeout(idleTimer);
      clearTimeout(greetingTimer);
      clearInterval(intervalTimer);
    };
  }, [notifyMascot, shouldHide]);

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <style>
        {`
          @keyframes float-companion {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .companion-float {
            animation: float-companion 5s ease-in-out infinite;
          }
          @keyframes companion-pop {
            0% { transform: scale(0.8) translateY(10px); opacity: 0; }
            60% { transform: scale(1.05) translateY(-2px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .companion-animate-pop {
            animation: companion-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
      </style>

      <div className="companion-float relative flex flex-col items-end">
        {/* Speech Bubble */}
        {message && (
          <div 
            key={message}
            className="companion-animate-pop relative z-20 mb-3 transform origin-bottom-right pointer-events-auto"
          >
            <div className="bg-white/70 backdrop-blur-md text-[#1f2937] text-[14px] font-semibold py-3 px-5 rounded-[1.25rem] shadow-xl border border-white/60 tracking-tight max-w-[260px] text-left font-['Inter'] leading-snug">
              {message}
            </div>
            <div className="absolute -bottom-[6px] right-8 transform w-4 h-4 bg-white/70 backdrop-blur-md border-r border-b border-white/60 rotate-45 z-0"></div>
          </div>
        )}

        {/* Mascot */}
        <div className="w-32 h-32 md:w-40 md:h-40 relative pointer-events-auto cursor-pointer drop-shadow-2xl">
          <div className="absolute inset-0 bg-[#4F46E5]/20 rounded-full blur-[40px] pointer-events-none -z-10" />
          <JellyBlobMascot
            mood={mood}
            gaze={{ x: -10, y: -5 }}
            onOverpoke={() => { notifyMascot("Ouch! That tickles!", "angry", 3000); }}
          />
        </div>
      </div>
    </div>
  );
};

export default MascotCompanion;
