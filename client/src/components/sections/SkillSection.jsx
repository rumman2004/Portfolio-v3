import React, { useRef, useEffect, useState } from 'react';
import BentoSkills from '../animations/BentoSkills';
import { useFetch } from '../../hooks/useFetch';
import { resolveIcon } from '../../utils/iconMap';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Short overview items (5, one line each) ── */
const OVERVIEW_ITEMS = [
  'Modern, animated web apps — front to back.',
  'AI workflows: LangChain, LangGraph, Agents.',
  'DevOps, AWS, Google Cloud & CI/CD pipelines.',
  'Project & event planning, team coordination.',
  'Quick thinker — always finds an alternative.',
];

/* ── Static notification-style skill cards ── */
const NOTIF_SKILLS = [
  {
    name: 'AWS',
    desc: 'Cloud infra, S3, EC2, Lambda & more.',
    cat: 'DevOps',
    catColor: { bg: '#FFF0F0', text: '#C92A2A' },
  },
  {
    name: 'Supabase',
    desc: 'Open-source Firebase alternative.',
    cat: 'Database',
    catColor: { bg: '#F0FFF9', text: '#0E7256' },
  },
  {
    name: 'Google Cloud',
    desc: 'GCP services, OAuth.',
    cat: 'DevOps',
    catColor: { bg: '#EEF3FF', text: '#3B5BDB' },
  },
  {
    name: 'Antigravity',
    desc: 'AI coding IDE — daily driver.',
    cat: 'AI',
    catColor: { bg: '#F5F0FF', text: '#6741D9' },
  },
  {
    name: 'Codex',
    desc: 'Integrate OpenAI APIs & assistants.',
    cat: 'AI',
    catColor: { bg: '#F0FFF4', text: '#2D6A4F' },
  },
  {
    name: 'Python',
    desc: 'Automation, AI/ML & scripting.',
    cat: 'Language',
    catColor: { bg: '#EEF3FF', text: '#3B5BDB' },
  },
  {
    name: 'Vercel',
    desc: 'Zero-config deployments at the edge.',
    cat: 'DevOps',
    catColor: { bg: '#F5F5F5', text: '#374151' },
  },
  {
    name: 'React',
    desc: 'Component-based UI for the web.',
    cat: 'Frontend',
    catColor: { bg: '#EEF9FF', text: '#0284C7' },
  },
  {
    name: 'Java',
    desc: 'Backend services & Android apps.',
    cat: 'Language',
    catColor: { bg: '#FFF5EB', text: '#B85C00' },
  },
];

/* ── Notification panel inner component ── */
const NotifSkillPanel = () => {
  const [visible, setVisible] = useState([]);
  const [idx, setIdx] = useState(0);
  const VISIBLE_MAX = 4;

  useEffect(() => {
    // Seed first card immediately
    setVisible([{ ...NOTIF_SKILLS[0], uid: 0 }]);
    setIdx(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(prev => {
        // Infinite loop via modulo
        const nextSkill = { ...NOTIF_SKILLS[idx % NOTIF_SKILLS.length], uid: idx };
        return [nextSkill, ...prev].slice(0, VISIBLE_MAX);
      });
      setIdx(i => i + 1);
    }, 2200); // Slower interval for a premium feel
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <div 
      className="flex flex-col relative pt-2" 
      style={{ 
        height: '330px',
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
      }}
    >
      {visible.map((skill) => {
        const iconUrl = resolveIcon(skill);
        return (
          <div key={skill.uid} className="notif-item min-w-0 w-full">
            <div style={{ minHeight: 0 }} className="min-w-0 w-full">
              <div className="flex items-center gap-2.5 sm:gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[16px] sm:rounded-[20px] px-3 sm:px-5 py-3 sm:py-4 shadow-[0_12px_35px_rgba(0,0,0,0.06)] mb-3 mx-0 sm:mx-2 transition-transform duration-300 hover:bg-white hover:scale-[1.02] cursor-default">
                <div className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[14px] bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2 sm:p-2.5">
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={skill.name}
                      className="w-full h-full object-contain drop-shadow-sm"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">{skill.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] sm:text-[15px] font-bold text-gray-900 leading-none truncate tracking-tight">{skill.name}</p>
                  <p className="text-[10px] sm:text-[12px] text-gray-500 mt-1 sm:mt-1.5 truncate font-medium">{skill.desc}</p>
                </div>
                <span
                  className="flex-shrink-0 text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full tracking-wider sm:tracking-widest uppercase shadow-sm"
                  style={{ background: skill.catColor.bg, color: skill.catColor.text }}
                >
                  {skill.cat}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SkillSection = () => {
  const { data: skills, loading } = useFetch('/skills');
  const containerRef = useRef();

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(['.skill-bg-text', '.skill-headline', '.skill-desc', '.skill-stat-card'], {
        opacity: 1, y: 0, scale: 1
      });
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
    tl.from('.skill-bg-text', { opacity: 0, scale: 1.01, duration: 0.45, ease: 'power2.out' })
      .from('.skill-headline', { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .from('.skill-desc', { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out' }, '-=0.25')
      .from('.skill-stat-card', { opacity: 0, y: 20, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  }, { scope: containerRef });

  return (
    <section id="skills" ref={containerRef} className="py-20 sm:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      <style>{`
        @keyframes notif-enter {
          0% {
            grid-template-rows: 0fr;
            opacity: 0;
            transform: translateY(-24px) scale(0.9);
            filter: blur(8px);
          }
          100% {
            grid-template-rows: 1fr;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .notif-item {
          display: grid;
          animation: notif-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="relative w-full max-w-4xl mb-10 md:mb-14 text-center flex flex-col items-center mx-auto">
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
            <div className="skill-bg-text">
              <span className="font-script text-[22vw] sm:text-[22vw] md:text-[180px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2 block">
                Capabilities
              </span>
            </div>
          </div>
          <h2 className="skill-headline font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
            <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#0448a8] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">Core</span>
            <span className="relative z-10 flex items-baseline">SKILLS<span className="text-[#0448a8]">.</span></span>
          </h2>
          <p className="skill-desc font-inter text-[#595959] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
            A diverse set of skills that help me turn ideas into impactful digital experiences.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">

          {/* ── Left Panel ── */}
          <div className="w-full lg:w-[36%] flex flex-col gap-8 lg:pr-4">

            {/* ── Skills Overview — Liquid Glass Window ── */}
            <div className="skill-stat-card relative bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden">
              
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              {/* Title bar */}
              <div className="relative flex items-center gap-2.5 px-6 py-4 border-b border-white/50 bg-white/30">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
                </div>
                <span className="text-xs font-bold text-gray-500 tracking-wider ml-1 uppercase">Skills Overview</span>
              </div>

              {/* Overview checklist */}
              <ul className="relative flex flex-col divide-y divide-white/40">
                {OVERVIEW_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-white/40 transition-colors duration-200">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-tr from-[#0448a8] to-blue-400 flex items-center justify-center shadow-sm">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-[13px] text-gray-700 font-medium whitespace-nowrap truncate tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Live Activity Dropdown ── */}
            <div className="skill-stat-card relative bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden p-4">
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
              
              <div className="relative overflow-hidden">
                <NotifSkillPanel />
              </div>
            </div>

          </div>

          {/* ── Right Panel: Orbit ── */}
          <div className="w-full lg:w-[64%] flex justify-center">
            {loading ? (
              <SkillsSkeleton />
            ) : (
              <BentoSkills skills={skills || []} />
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

const SkillsSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading skills"
    className="w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#EEF0F4] p-px shadow-sm"
  >
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-px">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="aspect-square min-h-[80px] bg-white p-3 flex flex-col items-center justify-center animate-pulse"
        >
          <div className="h-8 w-8 rounded-xl bg-gray-200 mb-2" />
          <div className="h-2 w-12 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);

export default SkillSection;
