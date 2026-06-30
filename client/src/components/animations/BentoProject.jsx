import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { iconMap } from '../../utils/iconMap';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// ---- Tunables ---------------------------------------------------------
const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 50; // px of horizontal travel that counts as a swipe
const DRAG_THRESHOLD = 8; // px of travel before a touch is treated as a drag, not a tap
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x600/e5e5e5/1a1a1a?text=Project';

const FALLBACK_PROJECTS = [
  { _id: 1, title: 'Dr. Crop', category: 'Agriculture', shortDescription: 'AI-powered web app that detects crop diseases and suggests effective treatments.', technologies: ['React', 'Node.js', 'MongoDB', 'Gemini API'], image: { url: 'https://via.placeholder.com/800x600/e5e5e5/1a1a1a?text=Web+App' } },
  { _id: 2, title: 'Neumorphic Calculator', category: 'Productivity', shortDescription: 'A modern scientific calculator with adaptive neumorphic UI and history log.', technologies: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage'], image: { url: 'https://via.placeholder.com/800x600/cccccc/1a1a1a?text=Mobile+App' } },
  { _id: 3, title: 'BookHaven', category: 'E-Commerce', shortDescription: 'A clean and fast book store web application with modern UI and smooth UX.', technologies: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Stripe'], image: { url: 'https://via.placeholder.com/800x600/b3b3b3/1a1a1a?text=E-Commerce' } },
  { _id: 4, title: 'Crypto Dashboard', category: 'Finance', shortDescription: 'Real-time cryptocurrency tracking dashboard with interactive charts.', technologies: ['React', 'Chart.js', 'Firebase'], image: { url: 'https://via.placeholder.com/800x600/a3a3a3/1a1a1a?text=Finance' } },
  { _id: 5, title: 'Travel Buddy', category: 'Travel', shortDescription: 'Plan your trips efficiently with an AI-powered travel assistant.', technologies: ['Next.js', 'OpenAI', 'Prisma'], image: { url: 'https://via.placeholder.com/800x600/8c8c8c/1a1a1a?text=Travel' } },
];

/** Shortest signed circular distance from `current` to `idx` among `total` slides. */
const getCircularOffset = (idx, current, total) => {
  let raw = (idx - current) % total;
  if (raw < 0) raw += total;
  return raw > Math.floor(total / 2) ? raw - total : raw;
};

/** Normalizes a project's tech list (handles string/object entries and comma-separated values). */
const getTechList = (project) => {
  const raw = project.techStack || project.technologies || [];
  return raw.flatMap((t) => {
    const val = typeof t === 'string' ? t : t.name;
    return val.includes(',') ? val.split(',').map((s) => s.trim()).filter(Boolean) : [val];
  });
};

const ProjectCard = ({ project, isActive, onActivate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const hoverCapableRef = useRef(false);

  useEffect(() => {
    hoverCapableRef.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  const images = useMemo(
    () => [project.heroImage || project.image?.url, ...(project.gallery || [])].filter(Boolean),
    [project]
  );
  const currentImage = images.length > 0 ? images[imageIndex % images.length] : PLACEHOLDER_IMAGE;

  // Cycle through gallery images on hover -- fine-pointer devices only, since
  // "hover" on touchscreens is a confusing first-tap/second-tap simulation.
  useEffect(() => {
    if (!isHovered || images.length <= 1 || !hoverCapableRef.current) {
      setImageIndex(0);
      return undefined;
    }
    const interval = setInterval(() => setImageIndex((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const techs = getTechList(project);

  // Coverflow UX: clicking a side card brings it to the front instead of
  // navigating away immediately. Only the active, centered card navigates.
  const handleClick = (e) => {
    if (!isActive) {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <Link
      to={`/works/${project.slug || project._id}`}
      onClick={handleClick}
      onMouseEnter={() => hoverCapableRef.current && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={false}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
      aria-label={isActive ? `Open project: ${project.title}` : `Show project: ${project.title}`}
      className="group flex h-full w-full select-none flex-col overflow-hidden rounded-2xl border border-[#232323]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F4F4F4] p-3 sm:p-4">
        <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#232323]/5 shadow-md transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
          <img
            src={currentImage}
            alt={project.title}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover object-top transition-opacity duration-300"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#232323] shadow-sm backdrop-blur-sm sm:bottom-3 sm:right-3">
          {project.category || 'Web App'}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col bg-white p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0448a8]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8A8A]">
            {project.category || 'Portfolio'}
          </span>
        </div>

        <h3 className="mb-1.5 text-lg font-bold text-[#232323] transition-colors group-hover:text-[#0448a8] sm:text-xl">
          {project.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#8A8A8A] sm:text-sm">
          {project.shortDescription || project.description || 'A modern digital experience showcasing clean code and meaningful design.'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {techs.slice(0, 4).map((techName, i) => {
              const normalized = techName.toLowerCase().replace(/[-_ ]+/g, '');
              const iconSrc = iconMap[normalized];
              return iconSrc ? (
                <div key={i} title={techName} className="flex h-6 w-6 items-center justify-center rounded-full border border-[#232323]/5 sm:h-7 sm:w-7">
                  <img src={iconSrc} alt={techName} className="h-3.5 w-3.5 object-contain" />
                </div>
              ) : (
                <span key={i} className="rounded-md border border-[#232323]/5 px-1.5 py-0.5 text-[9px] font-semibold text-[#232323] sm:text-[10px]">
                  {techName}
                </span>
              );
            })}
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0448a8] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-5 sm:w-5" />
        </div>
      </div>
    </Link>
  );
};

const BentoProject = ({ projects = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const indexRef = useRef(0);
  const didMountRef = useRef(false);
  const configRef = useRef({ spacing: 104, reduceMotion: false });
  const layoutRef = useRef(() => {});
  const prevOffsets = useRef(new Map());
  const dotFillRefs = useRef([]);
  const interactionRef = useRef({ hover: false, touch: false, focus: false });
  const dragRef = useRef({ startX: 0, startY: 0, dragging: false });
  const touchResumeTimer = useRef(null);

  // Memoized so the fallback array doesn't get recreated (and re-trigger
  // every GSAP/effect dependency) on every autoplay tick.
  const displayProjects = useMemo(
    () => (projects && projects.length > 0 ? projects : FALLBACK_PROJECTS),
    [projects]
  );

  const goToIndex = (idx) => {
    const total = displayProjects.length;
    setCurrentIndex(((idx % total) + total) % total);
  };
  const handleNext = () => goToIndex(currentIndex + 1);
  const handlePrev = () => goToIndex(currentIndex - 1);

  const syncPaused = () => {
    const { hover, touch, focus } = interactionRef.current;
    setIsPaused(hover || touch || focus);
  };

  // --- Coverflow layout: GSAP setup, responsive breakpoints, entrance ----
  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.coverflow-card', containerRef.current);
      if (!cards.length) return undefined;

      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
      });

      const applyLayout = (immediate = false) => {
        const total = displayProjects.length;
        const { spacing, reduceMotion } = configRef.current;

        cards.forEach((card, idx) => {
          const offset = getCircularOffset(idx, indexRef.current, total);
          const absOffset = Math.abs(offset);
          const beyond = absOffset > 1;

          const vars = {
            x: offset * spacing,
            scale: beyond ? 0.5 : 1 - absOffset * 0.12,
            opacity: beyond ? 0 : 1 - absOffset * 0.4,
            rotationY: reduceMotion || offset === 0 ? 0 : offset > 0 ? -22 : 22,
            zIndex: 50 - absOffset,
            filter: reduceMotion ? 'none' : `blur(${Math.min(absOffset, 1) * 2.5}px)`,
          };

          const prevOffset = prevOffsets.current.get(card);
          const wrapped = prevOffset !== undefined && Math.abs(offset - prevOffset) > 1;

          if (immediate || wrapped || reduceMotion) {
            gsap.set(card, vars);
          } else {
            gsap.to(card, { ...vars, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          }

          prevOffsets.current.set(card, offset);
          // Fully hidden cards shouldn't intercept clicks or be tab-reachable.
          card.style.pointerEvents = beyond ? 'none' : 'auto';
        });
      };

      layoutRef.current = applyLayout;

      // Responsive spacing via matchMedia (mirrors Tailwind's own min-width,
      // mobile-first breakpoints) instead of a one-time innerWidth check, so
      // the coverflow re-lays itself out correctly on resize/rotate too.
      const mm = gsap.matchMedia();
      mm.add(
        {
          isSm: '(min-width: 640px)',
          isMd: '(min-width: 768px)',
          isLg: '(min-width: 1024px)',
          isXl: '(min-width: 1280px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { isSm, isMd, isLg, isXl, reduceMotion } = ctx.conditions;
          configRef.current = {
            spacing: isXl ? 210 : isLg ? 180 : isMd ? 150 : isSm ? 125 : 100,
            reduceMotion,
          };
          applyLayout(true);
        }
      );

      if (!configRef.current.reduceMotion) {
        gsap.from(cards, { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, ease: 'power2.out', delay: 0.1 });
      }

      return undefined;
    },
    { scope: containerRef, dependencies: [displayProjects] }
  );

  // Re-run the (tweened) layout whenever the active slide changes.
  useEffect(() => {
    indexRef.current = currentIndex;
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    layoutRef.current();
  }, [currentIndex]);

  // Autoplay -- paused while hovered, touched, or focused.
  useEffect(() => {
    if (displayProjects.length <= 1 || isPaused) return undefined;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [currentIndex, displayProjects.length, isPaused]);

  // Autoplay progress fill on the active pagination dot.
  useGSAP(
    () => {
      const el = dotFillRefs.current[currentIndex];
      if (!el || displayProjects.length <= 1) return undefined;
      gsap.set(el, { scaleX: 0 });
      if (isPaused) return undefined;
      const tween = gsap.to(el, { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'linear' });
      return () => tween.kill();
    },
    { dependencies: [currentIndex, isPaused, displayProjects.length], scope: containerRef }
  );

  useEffect(() => () => clearTimeout(touchResumeTimer.current), []);

  // --- Interaction handlers ----------------------------------------------
  const handleMouseEnter = () => { interactionRef.current.hover = true; syncPaused(); };
  const handleMouseLeave = () => { interactionRef.current.hover = false; syncPaused(); };
  const handleFocus = () => { interactionRef.current.focus = true; syncPaused(); };
  const handleBlur = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      interactionRef.current.focus = false;
      syncPaused();
    }
  };

  const onTouchStart = (e) => {
    clearTimeout(touchResumeTimer.current);
    interactionRef.current.touch = true;
    syncPaused();
    const t = e.targetTouches[0];
    dragRef.current = { startX: t.clientX, startY: t.clientY, dragging: false };
  };

  const onTouchMove = (e) => {
    const t = e.targetTouches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    // Only commit to "dragging" once horizontal intent is clear, so a
    // vertical page-scroll started over the carousel isn't hijacked.
    if (!dragRef.current.dragging && Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      dragRef.current.dragging = true;
    }
  };

  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const distance = dragRef.current.startX - t.clientX;
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance > 0) handleNext();
      else handlePrev();
    }
    touchResumeTimer.current = setTimeout(() => {
      interactionRef.current.touch = false;
      syncPaused();
    }, 2000);
  };

  // Prevents a swipe gesture from also firing a click/navigation on the card
  // it ends on -- a common carousel bug when a Link sits under the swipe area.
  const onClickCapture = (e) => {
    if (dragRef.current.dragging) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.dragging = false;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* 3D Coverflow */}
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        className="relative h-[420px] w-full max-w-6xl rounded-3xl mask-x-from-75% focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-4 sm:h-[480px] md:h-[530px] lg:h-[580px] xl:h-[620px]"
        style={{ perspective: '1400px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        {displayProjects.length > 0 ? (
          displayProjects.map((project, idx) => (
            <div
              key={project._id || idx}
              className="coverflow-card absolute left-1/2 top-1/2 h-auto w-[75%] min-h-[340px] max-w-[260px] sm:min-h-[380px] sm:max-w-[300px] md:min-h-[430px] md:max-w-[340px] lg:min-h-[480px] lg:max-w-[380px] xl:min-h-[520px] xl:max-w-[420px]"
            >
              <ProjectCard
                project={project}
                isActive={idx === currentIndex}
                onActivate={() => goToIndex(idx)}
              />
            </div>
          ))
        ) : (
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-lg font-medium text-[#8A8A8A]">No projects found.</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {displayProjects.length > 0 && (
        <div className="z-20 mt-6 flex items-center gap-4 pointer-coarse:gap-5 sm:mt-8 md:mt-10">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#232323]/20 text-[#232323] shadow-sm transition-all duration-300 hover:border-[#0448a8] hover:bg-[#0448a8] hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Pagination, each active dot doubles as an autoplay progress bar */}
          <div className="flex items-center gap-2 pointer-coarse:gap-3">
            {displayProjects.map((project, idx) => (
              <button
                key={project._id || idx}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Go to project ${idx + 1} of ${displayProjects.length}: ${project.title}`}
                aria-current={idx === currentIndex}
                className={`relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2 ${
                  idx === currentIndex ? 'w-7 bg-[#0448a8]/20' : 'w-1.5 bg-[#232323]/20 hover:bg-[#232323]/40'
                }`}
              >
                {idx === currentIndex && (
                  <span
                    ref={(el) => { dotFillRefs.current[idx] = el; }}
                    className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-[#0448a8]"
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#232323]/20 text-[#232323] shadow-sm transition-all duration-300 hover:border-[#0448a8] hover:bg-[#0448a8] hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* View All */}
      <div className="relative z-20 mt-10 flex justify-center md:mt-14">
        <Link
          to="/works"
          className="group flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0448a8] px-7 py-3 text-sm font-semibold !text-white shadow-lg shadow-[#0448a8]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#03367d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2 sm:px-8 sm:py-3.5"
        >
          View All Projects
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default BentoProject;