import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { resolveIcon } from '../../utils/iconMap';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   FONTS (same system as About page)
──────────────────────────────────────────────────────────────*/
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@600;700&display=swap');
    .wk-font-headline { font-family: 'Archivo Black', sans-serif; }
    .wk-font-inter    { font-family: 'Inter', sans-serif; }
    .wk-font-script   { font-family: 'Caveat', cursive; }

    /* Floating image follower — desktop only */
    .wk-ghost {
      position: fixed;
      top: 0; left: 0;
      width: 300px;
      height: 220px;
      border-radius: 12px;
      overflow: hidden;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.92) rotate(-2deg);
      transition: opacity 0.2s ease;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    }
    .wk-ghost.active { opacity: 1; }
    .wk-ghost img { width: 100%; height: 100%; object-fit: cover; }

    /* Row hover line */
    .wk-row {
      position: relative;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      transition: background 0.2s ease;
    }
    .wk-row::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 0;
      background: #0448a8;
      transition: width 0.3s ease;
    }
    .wk-row:hover { background: rgba(4,72,168,0.025); }
    .wk-row:hover::before { width: 3px; }
    .wk-row:hover .wk-row-arrow { transform: translate(4px, -4px); opacity: 1; }
    .wk-row:hover .wk-row-index { color: #0448a8; }
    .wk-row:hover .wk-row-title { color: #0448a8; }

    .wk-row-arrow {
      transition: transform 0.25s ease, opacity 0.25s ease;
      opacity: 0.3;
    }

    /* Filter tab */
    .wk-tab {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      color: #888;
    }
    .wk-tab:hover { color: #111; border-color: rgba(0,0,0,0.15); }
    .wk-tab.active {
      background: #0448a8;
      color: #fff;
      border-color: #0448a8;
    }

    /* Mobile card */
    .wk-mobile-card {
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .wk-mobile-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    }

    /* Grain overlay */
    .wk-grain {
      background-image: url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png");
      background-repeat: repeat;
    }

    /* Tech tag */
    .wk-tech {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 6px;
      background: #F0F0F0;
      color: #555;
      white-space: nowrap;
    }

    /* Sticky header on scroll */
    @keyframes wk-fade-down {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .wk-sticky-bar {
      animation: wk-fade-down 0.4s ease forwards;
    }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   WORKS ROW (desktop list view)
──────────────────────────────────────────────────────────────*/
const WorkRow = ({ project, index, onEnter, onLeave }) => {
  const slug = project.slug || project._id;

  return (
    <Link
      to={`/works/${slug}`}
      className="wk-row block pl-6 pr-4 md:pr-8 py-5 md:py-6"
      onMouseEnter={() => onEnter(project.image?.url || project.heroImage)}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center gap-4 md:gap-8">
        {/* Index */}
        <span className="wk-row-index wk-font-inter text-[11px] font-bold tracking-widest text-[#bbb] w-6 flex-shrink-0 transition-colors duration-200">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
          <h2 className="wk-row-title wk-font-headline text-xl md:text-2xl lg:text-3xl text-[#111] tracking-tight leading-none transition-colors duration-200 truncate">
            {project.title}
          </h2>
          <p className="wk-font-inter text-[#999] text-xs md:text-sm leading-snug line-clamp-1 md:max-w-sm lg:max-w-md">
            {project.shortDescription}
          </p>
        </div>

        {/* Year */}
        <span className="wk-font-inter text-[11px] font-bold tracking-widest text-[#bbb] hidden md:block flex-shrink-0">
          {project.year || new Date(project.createdAt || Date.now()).getFullYear()}
        </span>

        {/* Category pill */}
        <span className="hidden lg:block wk-font-inter text-[10px] font-bold tracking-widest uppercase text-[#0448a8] bg-[#0448a8]/10 px-3 py-1.5 rounded-full flex-shrink-0">
          {project.filterCategory || project.category}
        </span>

        {/* Arrow */}
        <ArrowUpRight size={18} className="wk-row-arrow text-[#0448a8] flex-shrink-0" />
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────
   MOBILE CARD VIEW
──────────────────────────────────────────────────────────────*/
const MobileCard = ({ project, index }) => {
  const slug = project.slug || project._id;
  const imgSrc = project.image?.url || project.heroImage;

  return (
    <Link to={`/works/${slug}`} className="block">
      <div className="wk-mobile-card bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {/* Image */}
        <div className="w-full aspect-[16/9] bg-[#E8E8E8] overflow-hidden relative">
          {imgSrc
            ? <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <span className="wk-font-headline text-4xl text-[#ccc]">{project.title.charAt(0)}</span>
              </div>
          }
          <div className="absolute bottom-3 left-3">
            <span className="wk-font-inter text-[10px] font-bold tracking-widest uppercase text-[#0448a8] bg-white/90 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              {project.filterCategory || project.category}
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="wk-font-headline text-xl text-[#111] leading-tight">{project.title}</h2>
            <ArrowUpRight size={16} className="text-[#0448a8] mt-0.5 flex-shrink-0" />
          </div>
          <p className="wk-font-inter text-[#888] text-xs leading-relaxed mb-4 line-clamp-2">
            {project.shortDescription}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(() => {
              let techs = project.techStack || project.technologies || [];
              if (techs.length === 1 && techs[0].includes(',')) {
                techs = techs[0].split(',').map(t => t.trim()).filter(Boolean);
              }
              return techs.slice(0, 4).map((t, i) => {
                 const iconSrc = resolveIcon({ name: t });
                 return (
                   <span key={i} className="wk-tech flex items-center gap-1.5 capitalize">
                     {iconSrc && <img src={iconSrc} alt={t} className="w-3.5 h-3.5 object-contain" />}
                     {t.replace(/light$|icondark$|iconlight$|icon$/i, '')}
                   </span>
                 );
              });
            })()}
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN WORKS PAGE
──────────────────────────────────────────────────────────────*/
const Works = () => {
  const { data: projects, loading, error } = useFetch('/projects');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const containerRef = useRef();
  const ghostRef = useRef();
  const rafRef = useRef();

  const list = projects || [];

  const categories = ['All', ...new Set(list.map(p => p.filterCategory || p.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? list
    : list.filter(p => p.filterCategory === activeCategory || p.category === activeCategory);

  /* Ghost cursor movement */
  const handleMouseMove = useCallback((e) => {
    if (!ghostRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (ghostRef.current) {
        ghostRef.current.style.left = `${e.clientX}px`;
        ghostRef.current.style.top  = `${e.clientY}px`;
      }
    });
  }, []);

  const handleRowEnter = useCallback((imgUrl) => {
    if (!ghostRef.current) return;
    const img = ghostRef.current.querySelector('img');
    if (img && imgUrl) { img.src = imgUrl; }
    ghostRef.current.classList.add('active');
  }, []);

  const handleRowLeave = useCallback(() => {
    if (ghostRef.current) ghostRef.current.classList.remove('active');
  }, []);

  useGSAP(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref || loading || error) return;

    // Hero counter count-up
    gsap.fromTo('.wk-count',
      { textContent: 0 },
      {
        textContent: filtered.length || list.length,
        duration: 1.2, ease: 'power2.out', snap: { textContent: 1 },
        scrollTrigger: { trigger: '.wk-hero', start: 'top 80%' },
      }
    );

    gsap.from('.wk-hero-tag', { opacity: 0, y: 16, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.3 });
    gsap.from('.wk-hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.from('.wk-hero-sub',   { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.4 });

    gsap.from('.wk-filter-bar', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', delay: 0.6 });

    gsap.from('.wk-row', {
      opacity: 0, x: -16, stagger: 0.06, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.wk-list', start: 'top 80%' },
    });

  }, { scope: containerRef, dependencies: [loading] });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F7F7F7] selection:bg-[#0448a8] selection:text-white"
      onMouseMove={handleMouseMove}
    >
      <FontStyles />

      {/* Ghost cursor (desktop only, hidden on touch) */}
      <div ref={ghostRef} className="wk-ghost hidden md:block" aria-hidden="true">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
      </div>

      {/* ── HERO ── */}
      <section className="wk-hero relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Grain */}
        <div className="wk-grain absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" aria-hidden="true" />

        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="wk-hero-tag wk-font-inter text-[10px] font-bold tracking-[0.3em] uppercase text-[#0448a8]">
            Portfolio
          </span>
          <span className="wk-hero-tag w-1 h-1 rounded-full bg-[#ccc]" aria-hidden="true" />
          <span className="wk-hero-tag wk-font-inter text-[10px] font-bold tracking-[0.3em] uppercase text-[#888]">
            {new Date().getFullYear()}
          </span>
        </div>

        {/* Title row */}
        <div className="wk-hero-title flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="wk-font-script text-3xl md:text-4xl text-[#0448a8] -rotate-3 inline-block mb-1">
              Selected
            </span>
            <h1 className="wk-font-headline text-[16vw] sm:text-[12vw] md:text-[9vw] lg:text-[8vw] text-[#111] tracking-tighter uppercase leading-[0.85]">
              Works<span className="text-[#0448a8]">.</span>
            </h1>
          </div>

          {/* Big number */}
          <div className="flex flex-col items-start md:items-end pb-2 md:pb-4">
            <span className="wk-count wk-font-headline text-[80px] md:text-[100px] text-[#111] leading-none">
              {list.length}
            </span>
            <span className="wk-font-inter text-xs font-bold tracking-widest uppercase text-[#bbb]">Projects</span>
          </div>
        </div>

        {/* Sub */}
        <p className="wk-hero-sub wk-font-inter text-[#888] text-base md:text-lg leading-relaxed max-w-xl mt-8">
          A curated index of web, mobile, and design work — each project built from a clear brief and shipped with intention.
        </p>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="wk-filter-bar sticky top-[64px] z-40 bg-[#F7F7F7]/90 backdrop-blur-md border-y border-black/[0.07] px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`wk-tab flex-shrink-0 ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto wk-font-inter text-[11px] text-[#bbb] font-bold tracking-widest flex-shrink-0 hidden sm:block">
            {filtered.length} of {list.length}
          </span>
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-black/[0.1]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-black/5 text-black' : 'text-[#888] hover:text-black hover:bg-black/5'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-black/5 text-black' : 'text-[#888] hover:text-black hover:bg-black/5'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── LIST / GRID ── */}
      <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-12 mt-0">

        {loading ? (
          /* Skeleton */
          <div className="px-6 md:px-0 py-8 space-y-4">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-black/[0.05]" />
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-20 text-center">
            <p className="wk-font-inter text-[#111] font-semibold text-base">Couldn't load projects.</p>
            <p className="wk-font-inter text-[#888] text-sm mt-1">Refresh the page or check back shortly.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="wk-font-inter text-[#888] text-base">No projects in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              {viewMode === 'list' ? (
                <div className="wk-list border-t border-black/[0.07]">
                  {filtered.map((project, i) => (
                    <WorkRow
                      key={project._id || i}
                      project={project}
                      index={i}
                      onEnter={handleRowEnter}
                      onLeave={handleRowLeave}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((project, i) => (
                    <MobileCard key={project._id || i} project={project} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile View (Always Grid) */}
            <div className="md:hidden px-4 py-8 grid grid-cols-1 gap-5">
              {filtered.map((project, i) => (
                <MobileCard key={project._id || i} project={project} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="border-t border-black/[0.08] pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="wk-font-inter text-[10px] font-bold tracking-[0.3em] uppercase text-[#bbb] mb-3">Got a project?</p>
            <h2 className="wk-font-headline text-3xl md:text-5xl text-[#111] tracking-tighter uppercase leading-tight">
              Let's build<br />something great<span className="text-[#0448a8]">.</span>
            </h2>
          </div>
          <a
            href="/contact"
            className="wk-font-inter inline-flex items-center gap-3 bg-[#0448a8] !text-white px-8 py-4 rounded-full
                       font-semibold text-sm tracking-wide shadow-lg shadow-[#0448a8]/20
                       hover:bg-[#03367d] hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
          >
            Start a conversation
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Works;
