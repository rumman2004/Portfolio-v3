import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useFetch } from '../../hooks/useFetch';
import {
  GraduationCap, Landmark, School, BookOpen, FileText,
  Award, MapPin, Trophy, Medal, Users, Box
} from 'lucide-react';
import { resolveIcon } from '../../utils/iconMap';

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

/* ─────────────────────────────────────────────────────────────
   FONTS — injected once at the page level
──────────────────────────────────────────────────────────────*/
const FontStyles = () => (
  <style>{`
    .font-headline { font-family: 'Archivo Black', sans-serif; }
    .font-inter    { font-family: 'Inter', sans-serif; }
    .font-script   { font-family: 'Caveat', cursive; }

    /* Hairline section divider label */
    .section-rule {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 80px;
    }
    .section-rule::before {
      content: '';
      flex: 1;
      height: 1px;
      background: currentColor;
      opacity: 0.15;
    }
    .section-rule-label {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      opacity: 0.4;
    }

    /* Skill pill */
    .skill-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 999px;
      padding: 10px 18px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.75);
      transition: border-color 0.2s, color 0.2s, background 0.2s;
      cursor: default;
    }
    .skill-pill:hover {
      border-color: rgba(255,255,255,0.5);
      color: #fff;
      background: rgba(255,255,255,0.05);
    }
    .skill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3D6FFF;
      flex-shrink: 0;
    }

    /* Edu timeline connector */
    .edu-connector {
      position: absolute;
      left: 23px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #E0E0E0;
      transform-origin: top;
    }

    /* Hackathon stat */
    .hack-stat {
      border-left: 1px solid rgba(255,255,255,0.15);
      padding: 0 40px;
    }
    .hack-stat:first-child { border-left: none; padding-left: 0; }

    /* Certificate card hover */
    .cert-card {
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .cert-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.10);
    }

    /* Scrollbar hide for skill row */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Exp year tag */
    .exp-year-tag {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      font-size: 10px;
      letter-spacing: 0.2em;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0.35;
      font-family: 'Inter', sans-serif;
    }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   SHARED: Section rule divider
──────────────────────────────────────────────────────────────*/
const SectionRule = ({ index, label, light = false }) => (
  <div className="section-rule" style={{ color: light ? '#fff' : '#111' }}>
    <span className="section-rule-label">§ {String(index).padStart(2, '0')} — {label}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   § 01 — ABOUT (hero)
──────────────────────────────────────────────────────────────*/
const AboutHero = () => {
  const { data: profile } = useFetch('/public/profile');
  const ref = useRef();
  const scriptRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 60%', toggleActions: 'play none none none', once: true }
    });
    tl.from('.ah-intro',    { y: 18, opacity: 0, duration: 0.45, ease: 'power2.out' })
      .from('.ah-headline', { scale: 0.96, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25')
      .fromTo('.ah-script',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.25')
      .from('.ah-body', { y: 14, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
      .from('.ah-tags a', { y: 10, opacity: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out' }, '-=0.2');

    if (window.matchMedia('(min-width: 768px)').matches) {
      const move = (e) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(scriptRef.current, { x, y, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
      };
      window.addEventListener('mousemove', move);
      return () => window.removeEventListener('mousemove', move);
    }
  }, { scope: ref });

  const role = profile?.role || 'Freelancer';
  const nameParts = (profile?.name || 'Rumman Ahmed').split(' ');
  const firstName = nameParts[0] || 'Rumman';
  const lastName = nameParts.slice(1).join(' ') || 'Ahmed.';
  const aboutText = profile?.about || profile?.shortBio || 'I build fast, reliable web applications from the ground up — with a focus on clean code, scalable architecture, and experiences that grow with the business.';
  
  return (
    <section
      ref={ref}
      id="about"
      className="relative w-full min-h-[100svh] bg-transparent flex items-center justify-center overflow-hidden py-24
                 selection:bg-[#0448a8] selection:text-white"
    >

      <div className="relative z-10 max-w-[90rem] mx-auto w-full px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left */}
        <div className="w-full md:w-[56%] flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-5">
            {profile?.profileImage && (
              <img src={profile.profileImage} alt={profile?.name || 'Admin'} className="ah-intro w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-sm" />
            )}
            <p className="ah-intro font-inter text-base md:text-lg text-[#6B7280] font-medium tracking-wide">
              I'm a <span className="text-[#0448a8] font-bold">— {role}</span> 
            </p>
          </div>

          <div className="relative">
            <h1 className="ah-headline font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#2B2B2B] leading-[0.92] uppercase select-none">
              {firstName}
            </h1>
            <div className="block md:hidden absolute top-[75%] left-[45%] sm:left-[50%] z-30 pointer-events-none">
              <span className="ah-script font-script text-6xl sm:text-7xl text-[#0448a8] -rotate-6 block pr-6">{lastName}</span>
            </div>
          </div>

          <div className="ah-body mt-14 md:mt-20 max-w-lg">
            <p className="font-inter text-[#6B7280] leading-[1.85] text-base md:text-lg font-light">
              {aboutText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="ah-tags flex flex-wrap items-center gap-4 mt-8">
            <a href={profile?.resumeUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-[#0448a8] text-[#ffffff] font-inter text-sm font-semibold rounded-full hover:bg-[#03367c] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_20px_rgba(4,72,168,0.25)] hover:shadow-[0_12px_25px_rgba(4,72,168,0.4)]">
              <FileText size={16} className="text-[#ffffff]" />
              View Resume
            </a>
            <a href="/contact" className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#111] font-inter text-sm font-semibold rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Contact Me
            </a>
          </div>
        </div>

        {/* Right — oversized script */}
        <div className="hidden md:block w-[44%] relative h-[400px] pointer-events-none z-30">
          <div ref={scriptRef} className="absolute top-[30%] left-[-25%] lg:left-[-30%] -translate-y-[60%]">
            <span className="ah-script inline-block font-script text-7xl lg:text-8xl xl:text-9xl text-[#0448a8] -rotate-[8deg] leading-none select-none py-10 pr-10">
              {lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
        <span className="font-inter text-[9px] uppercase tracking-[0.35em] text-[#6B7280] font-bold">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-[#6B7280] to-transparent" />
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   § 02 — SKILLS  (dark panel)
──────────────────────────────────────────────────────────────*/
const SkillsPanel = () => {
  const { data: skills } = useFetch('/skills');
  const ref = useRef();
  const display = skills || [];
  
  // Remove duplicates based on name and shuffle them once on load
  const [randomizedSkills, setRandomizedSkills] = React.useState([]);

  React.useEffect(() => {
    const unique = display.filter((v, i, a) => 
      a.findIndex(t => (t.name || t).toLowerCase() === (v.name || v).toLowerCase()) === i
    );
    // Shuffle the unique skills array once
    const shuffled = [...unique].sort(() => Math.random() - 0.5);
    setRandomizedSkills(shuffled);
  }, [display]);

  useGSAP(() => {
    if (randomizedSkills.length === 0) return;
    
    // Initial entrance animation
    gsap.fromTo('.sp-grid-item', 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, 
        scale: 1,
        stagger: 0.03, 
        duration: 0.6, 
        ease: 'back.out(1.5)',
        scrollTrigger: { 
          trigger: ref.current, 
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
      }
    );
  }, { scope: ref, dependencies: [randomizedSkills] });

  return (
    <section ref={ref} id="skills" className="bg-transparent py-[120px] md:py-[160px] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionRule index={2} label="Core Skills" />

        <div className="mb-16">
          <h2 className="font-headline text-5xl md:text-7xl text-[#111] tracking-tighter uppercase leading-none mb-6">
            Technologies<span className="text-[#0448a8]">.</span>
          </h2>
          <p className="font-inter text-[#888] text-base md:text-lg max-w-xl leading-relaxed">
            A diverse toolkit built through freelance projects, late-night builds, and a genuine
            obsession with making things work well.
          </p>
        </div>

        {/* The Grid (matches the reference image style) */}
        <div className="bg-[#EEF0F4] p-[1px] rounded-2xl overflow-hidden border border-[#EEF0F4] shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-[1px]">
            {randomizedSkills.map((s, i) => {
              const skillName = s.name || s;
              const iconSrc = resolveIcon({ name: skillName });
              
              return (
                <div 
                  key={skillName} 
                  className="sp-grid-item bg-white aspect-square flex flex-col items-center justify-center p-4 group hover:z-10 relative transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                >
                  {iconSrc ? (
                    <img 
                      src={iconSrc} 
                      alt={skillName} 
                      className="w-8 h-8 md:w-10 md:h-10 object-contain mb-3 group-hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg font-bold text-[#D0D5DD] mb-3">
                      {skillName.slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <span className="font-inter text-[9px] md:text-[10px] text-[#98A2B3] font-semibold tracking-widest uppercase text-center truncate w-full px-2">
                    {skillName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   § 03 — EXPERIENCE  (light, tall left-border year markers)
──────────────────────────────────────────────────────────────*/
const formatRange = (exp) => {
  const fmt = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date) ? '' : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const start = fmt(exp.startDate) || 'Present';
  const end = exp.current ? 'Present' : (fmt(exp.endDate) || 'Present');
  return `${start} – ${end}`;
};

const ExperienceItem = ({ exp, index, isLast }) => {
  const bullets = exp.description 
    ? exp.description.split('\n').map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean).slice(0, 3)
    : (exp.bullets ?? []).slice(0, 3);

  return (
    <div className="ex-item grid gap-6" style={{ gridTemplateColumns: '40px 1fr' }}>
      {/* Year column */}
      <div className="flex flex-col items-center relative">
        <div className="w-3 h-3 rounded-full bg-[#0448a8] flex-shrink-0 mt-1"
             style={{ boxShadow: '0 0 0 3px #F4F4F4, 0 0 0 4.5px #d0d0d0' }} />
        {!isLast && (
          <div className="flex-1 w-px bg-[#E0E0E0] mt-2 mb-[-24px]" />
        )}
      </div>

      {/* Card */}
      <div className="pb-10">
        <p className="font-inter text-[11px] font-bold tracking-[0.2em] text-[#0448a8] uppercase mb-1">
          {formatRange(exp)}
        </p>
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-black/[0.06] p-6">
          {/* Left */}
          <div className="md:w-[45%] flex-shrink-0">
            <h3 className="font-headline text-xl md:text-2xl text-[#111] leading-snug">
              {exp.position ?? exp.title}
            </h3>
            <p className="font-inter text-[#888] text-sm mt-1">{exp.company}</p>
            <div className="flex items-center gap-1.5 mt-3 text-[#555] text-xs font-inter">
              <MapPin size={11} className="text-[#0448a8]" />
              {exp.location ?? 'Remote'}
            </div>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-[#F0F0F0]" />
          {/* Bullets */}
          <div className="flex flex-col gap-3 flex-1">
            {bullets.map((b, bi) => (
              <div key={bi} className="flex items-start gap-3 text-[13px] font-inter text-[#444] leading-snug">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0448a8] flex-shrink-0 mt-[5px]" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const { data: experiences, loading } = useFetch('/experience');
  const ref = useRef();
  const list = experiences || [];

  useGSAP(() => {
    gsap.from('.ex-item', {
      opacity: 0, x: -24, stagger: 0.15, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref, dependencies: [loading] });

  return (
    <section ref={ref} id="experience" className="bg-transparent py-[120px] md:py-[160px]">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionRule index={3} label="Work Experience" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="font-headline text-5xl md:text-7xl text-[#111] tracking-tighter uppercase leading-none">
            Experience<span className="text-[#0448a8]">.</span>
          </h2>
          <p className="font-inter text-[#888] text-base max-w-xs leading-relaxed">
            A journey of collaboration, creativity, and continuous growth.
          </p>
        </div>

        <div className="relative">
          {loading
            ? <div className="space-y-4">{[0,1,2].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-black/[0.05] animate-pulse" />)}</div>
            : list.map((exp, i) => (
                <ExperienceItem key={exp._id ?? i} exp={exp} index={i} isLast={i === list.length - 1} />
              ))
          }
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   § 04 — EDUCATION  (white bg, horizontal step on desktop)
──────────────────────────────────────────────────────────────*/
const EDU_ICONS = { cap: GraduationCap, institute: Landmark, school: School, book: BookOpen, file: FileText, award: Award };

const EducationSection = () => {
  const { data: educationData, loading } = useFetch('/education');
  const ref = useRef();
  
  const education = educationData?.length ? educationData.map((e, i) => ({
    id: e._id || i,
    year: `${new Date(e.startDate).getFullYear()} – ${e.current ? 'Present' : (e.endDate ? new Date(e.endDate).getFullYear() : 'Present')}`,
    degree: e.degree,
    field: e.fieldOfStudy || e.field, 
    institution: e.institution,
    location: e.location,
    description: e.description,
    icon: e.icon || 'cap',
    descIcon: e.descIcon || 'book',
  })) : [];

  useGSAP(() => {
    gsap.from('.edu-step', {
      opacity: 0, y: 32, stagger: 0.15, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
    gsap.fromTo('.edu-progress', { scaleX: 0 }, {
      scaleX: 1, duration: 1.4, ease: 'power2.inOut', transformOrigin: 'left',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref, dependencies: [loading] });

  return (
    <section ref={ref} id="education" className="bg-transparent py-[120px] md:py-[160px]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionRule index={4} label="Education" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-script text-3xl md:text-4xl text-[#0448a8] -rotate-3 inline-block mb-2">Formal</span>
            <h2 className="font-headline text-5xl md:text-7xl text-[#111] tracking-tighter uppercase leading-none">
              Education<span className="text-[#0448a8]">.</span>
            </h2>
          </div>
          <p className="font-inter text-[#888] text-base max-w-xs leading-relaxed">
            The academic foundation behind my skills, creativity, and problem-solving.
          </p>
        </div>

        {/* Horizontal progress bar (desktop) */}
        <div className="hidden md:flex items-center gap-0 mb-12 relative">
          <div className="edu-progress absolute left-0 top-[11px] h-px bg-[#0448a8]/30 w-full z-0" />
          {education.map((item, i) => (
            <div key={item.id} className="flex-1 flex flex-col items-center gap-3 relative z-10 px-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#0448a8] bg-white flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#0448a8]" />
              </div>
              <span className="font-inter text-[10px] font-bold text-[#0448a8] tracking-widest uppercase text-center">
                {item.year}
              </span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-5">
          {loading ? (
             <div className="space-y-4">
               {[0,1,2].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-black/[0.05] animate-pulse" />)}
             </div>
          ) : (
            education.map((item) => {
              const MainIcon = EDU_ICONS[item.icon] || GraduationCap;
              const DescIcon = EDU_ICONS[item.descIcon] || BookOpen;
              return (
                <div key={item.id} className="edu-step bg-[#FAFAFA] border border-black/[0.06] rounded-2xl px-6 md:px-8 py-6 flex flex-col md:flex-row items-start gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
                      <MainIcon size={20} className="text-[#0448a8]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-inter text-xs font-bold text-[#0448a8] tracking-widest uppercase">{item.year}</span>
                      <h3 className="font-headline text-lg md:text-xl text-[#111] mt-1">{item.degree}</h3>
                      
                      <div className="flex items-center gap-1.5 mt-1.5 text-[13px] font-inter text-[#555] font-medium">
                        <Landmark size={14} className="text-[#0448a8]" />
                        {item.institution}
                      </div>

                      <p className="font-inter text-[#888] text-sm mt-1">{item.field}</p>
                      
                      {item.location && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-inter text-[#777]">
                          <MapPin size={11} className="text-[#0448a8]" />
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block w-px self-stretch bg-[#EBEBEB]" />
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DescIcon size={17} className="text-[#0448a8]" strokeWidth={1.8} />
                    </div>
                    <p className="font-inter text-[#555] text-sm leading-relaxed pt-1">{item.description}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   § 05 — CERTIFICATES (light, masonry-style 3-col)
──────────────────────────────────────────────────────────────*/
const CertCard = ({ cert, i }) => (
  <div className="cert-card bg-white rounded-2xl border border-black/[0.06] p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
           style={{ background: `${cert.color}18` }}>
        <Award size={18} style={{ color: cert.color }} />
      </div>
      <span className="font-inter text-xs font-bold text-[#bbb] tracking-widest">{cert.year}</span>
    </div>
    <div>
      <h3 className="font-headline text-base text-[#111] leading-snug">{cert.title}</h3>
      <p className="font-inter text-xs text-[#999] mt-1">{cert.issuer}</p>
    </div>
    <div className="mt-auto pt-3 border-t border-[#F0F0F0]">
      <span className="font-inter text-[10px] font-bold tracking-widest uppercase"
            style={{ color: cert.color }}>
        Verified ✓
      </span>
    </div>
  </div>
);

const CertificatesSection = () => {
  const { data: certificates, loading } = useFetch('/certificates');
  const ref = useRef();
  const list = certificates || [];

  useGSAP(() => {
    gsap.from('.cert-card', {
      opacity: 0, y: 24, stagger: 0.08, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref, dependencies: [loading] });

  return (
    <section ref={ref} id="certificates" className="bg-transparent py-[120px] md:py-[160px]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionRule index={5} label="Certificates" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-script text-3xl md:text-4xl text-[#0448a8] -rotate-3 inline-block mb-2">Verified</span>
            <h2 className="font-headline text-5xl md:text-7xl text-[#111] tracking-tighter uppercase leading-none">
              Credentials<span className="text-[#0448a8]">.</span>
            </h2>
          </div>
          <p className="font-inter text-[#888] text-base max-w-xs leading-relaxed">
            {list.length} verified credentials — a record of continuous learning.
          </p>
        </div>

        {loading
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0,1,2,3,4,5].map(i => <div key={i} className="h-44 bg-white rounded-2xl border border-black/[0.05] animate-pulse" />)}
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((c, i) => <CertCard key={c._id ?? i} cert={{ ...c, color: c.color ?? '#0448a8' }} i={i} />)}
            </div>
        }

      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   § 06 — HACKATHONS  (deep blue closing panel)
──────────────────────────────────────────────────────────────*/
const HackathonsSection = () => {
  const { data: hackathons, loading } = useFetch('/hackathon');
  const { data: statsData, loading: statsLoading } = useFetch('/hackathon/stats');
  const ref = useRef();
  const stats = statsData?.length ? statsData.map((s) => ({ ...s, icon: Trophy })) : [];
  const list  = hackathons || [];

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (loading || statsLoading || prefersReducedMotion) {
      if (prefersReducedMotion) {
        gsap.set(['.hs-stat', '.hs-card'], { opacity: 1, y: 0, x: 0 });
        gsap.utils.toArray('.hs-val').forEach((el) => { el.textContent = el.dataset.val; });
      }
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 75%',
        once: true
      }
    });

    if (stats.length > 0) {
      tl.fromTo('.hs-stat', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    }
    
    if (list.length > 0) {
      tl.fromTo('.hs-card', 
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.65, ease: 'power2.out' },
        '-=0.2'
      );
    }

    // Count-up
    gsap.utils.toArray('.hs-val').forEach((el) => {
      const raw = el.dataset.val || '0';
      const sfx = raw.replace(/[\d.]/g, '');
      const num = parseFloat(raw) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: num, duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => { el.textContent = `${Math.round(obj.v)}${sfx}`; },
      });
    });
  }, { scope: ref, dependencies: [loading, statsLoading, statsData, hackathons] });

  return (
    <section ref={ref} id="hackathons" className="bg-[#0448a8] py-[120px] md:py-[160px] overflow-hidden relative">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <SectionRule index={6} label="Hackathon Awards" light />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-script text-3xl md:text-4xl text-white/60 -rotate-3 inline-block mb-2">Hackathon</span>
            <h2 className="font-headline text-5xl md:text-7xl text-white tracking-tighter uppercase leading-none">
              Awards<span className="text-white/30">.</span>
            </h2>
          </div>
          <p className="font-inter text-white/50 text-base max-w-xs leading-relaxed">
            Milestones from intense weekends of innovation and rapid-fire problem solving.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-0 mb-16 border border-white/10 rounded-2xl overflow-hidden">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="hs-stat flex-1 min-w-[140px] flex flex-col items-center text-center gap-2 py-8 px-4
                                    border-r border-white/10 last:border-r-0">
              <Icon size={20} className="text-white/40" />
              <span className="hs-val font-headline text-4xl md:text-5xl text-white" data-val={value}>0</span>
              <span className="font-inter text-xs text-white/40 leading-snug">{label}</span>
            </div>
          ))}
        </div>

        {/* Featured hackathon cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading ? (
            <>
              {[0, 1, 2].map(i => (
                <div key={i} className="h-44 bg-white/[0.07] border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </>
          ) : list.map((h, i) => (
            <div key={h._id ?? i} className="hs-card bg-white/[0.07] border border-white/10 rounded-2xl p-6 flex flex-col gap-4
                                             hover:bg-white/[0.11] transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="font-inter text-[10px] font-bold tracking-widest uppercase text-white/40">
                  {h.date ? new Date(h.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : (h.year || '')}
                </span>
                <span className="font-inter text-[11px] font-semibold text-white/70 bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Trophy size={11} className="text-white/40" />
                  {h.achievement ?? h.position ?? h.rank ?? 'Top Finish'}
                </span>
              </div>
              
              <div>
                <h3 className="font-headline text-lg text-white leading-snug mb-3">{h.title ?? h.name}</h3>
                
                <div className="flex flex-col gap-2">
                  {h.organization && (
                    <p className="font-inter text-white/60 text-xs flex items-center gap-2">
                      <MapPin size={13} className="text-white/40" />
                      {h.organization}
                    </p>
                  )}
                  {(h.projectTitle || h.projectId) && (
                    <p className="font-inter text-white/60 text-xs flex items-center gap-2">
                      <Box size={13} className="text-white/40" />
                      {h.projectTitle || h.projectId?.title}
                    </p>
                  )}
                </div>
              </div>

              <p className="font-inter text-white/50 text-xs leading-relaxed mt-auto pt-4 border-t border-white/5">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE ASSEMBLY
──────────────────────────────────────────────────────────────*/
const About = () => (
  <div className="pt-24">
    <FontStyles />
    <AboutHero />
    <SkillsPanel />
    <ExperienceSection />
    <EducationSection />
    <CertificatesSection />
    <HackathonsSection />
  </div>
);

export default About;
