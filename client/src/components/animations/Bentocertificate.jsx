import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// ---- Tunables ---------------------------------------------------------
const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 50; // px of horizontal travel that counts as a swipe
const DRAG_THRESHOLD = 8; // px of travel before a touch is treated as a drag, not a tap

const FALLBACK_CERTIFICATES = [
  { id: 'f1', title: 'Google UX Design Professional Certificate', issuer: 'Coursera', year: '2024', color: 'light', brand: 'Google' },
  { id: 'f2', title: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera', year: '2024', color: 'light', brand: 'Meta' },
  { id: 'f3', title: 'Adobe Certified Professional Visual Design', issuer: 'Adobe', year: '2023', color: 'light', brand: 'Adobe' },
  { id: 'f4', title: 'Responsive Web Design Certification', issuer: 'freeCodeCamp', year: '2023', color: 'light', brand: 'freeCodeCamp' },
];

const getCircularOffset = (idx, current, total) => {
  let raw = (idx - current) % total;
  if (raw < 0) raw += total;
  return raw > Math.floor(total / 2) ? raw - total : raw;
};

/* ── Branded placeholder thumbnail (from original file) ───────────────── */
const brandConfig = {
  Google: {
    logo: (
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 0 }}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </span>
    ),
    accentColor: '#4285F4',
  },
  Meta: {
    logo: <span style={{ color: '#1877F2', fontWeight: 700, fontSize: 13 }}>∞ Meta</span>,
    accentColor: '#1877F2',
  },
  Adobe: {
    logo: <span style={{ color: '#E53935', fontWeight: 800, fontSize: 14 }}>⬡ Adobe</span>,
    accentColor: '#E53935',
  },
  freeCodeCamp: {
    logo: <span style={{ color: '#0A0A23', fontWeight: 700, fontSize: 12 }}>freeCodeCamp(🔥)</span>,
    accentColor: '#0A0A23',
  },
};

const BadgeSeal = ({ isDark, brand }) => {
  const ringColor = isDark ? '#444' : '#CCC';
  const fillColor = isDark ? '#222' : '#F2F2F2';
  const textColor = isDark ? '#AAA' : '#888';

  const shortLabel =
    brand === 'Adobe' ? 'CERTIFIED'
    : brand === 'freeCodeCamp' ? 'CERTIFIED'
    : brand === 'Google' ? 'Coursera'
    : brand === 'Meta' ? '∞ META'
    : 'CERT';

  return (
    <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" stroke={ringColor} strokeWidth="1.2" fill={fillColor} />
        <circle cx="22" cy="22" r="14" stroke={ringColor} strokeWidth="0.7" />
        <text x="22" y="25" textAnchor="middle" fontSize="6" fill={textColor} fontWeight="700">
          {shortLabel}
        </text>
      </svg>
    </div>
  );
};

const BrandedThumbnail = ({ brand, title, issuer, isDark }) => {
  const cfg = brandConfig[brand] ?? null;
  const bg  = isDark ? '#111111' : '#FFFFFF';
  const fg  = isDark ? '#FFFFFF' : '#111111';
  const sub = isDark ? '#999999' : '#666666';
  const bdr = isDark ? 'none' : '0.5px solid #E8E8E8';

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden"
      style={{ background: bg, border: bdr, boxSizing: 'border-box' }}
    >
      {cfg ? (
        <div>{cfg.logo}</div>
      ) : (
        <div style={{ color: sub, fontSize: 12, fontWeight: 600 }}>{issuer}</div>
      )}

      <p
        style={{
          color: fg,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.35,
          margin: '10px 0 0 0',
        }}
      >
        {title}
      </p>

      <BadgeSeal isDark={isDark} brand={brand} />

      {brand === 'Adobe' && (
        <svg
          style={{ position: 'absolute', right: -10, top: 0, bottom: 0, width: '55%', opacity: 0.12 }}
          viewBox="0 0 100 160"
          fill="none"
        >
          <path d="M80 10 Q20 50 70 90 Q120 130 30 160" stroke="#E53935" strokeWidth="1.5" fill="none" />
          <path d="M90 5 Q25 55 75 95 Q125 135 35 165" stroke="#E53935" strokeWidth="1" fill="none" />
          <path d="M70 15 Q15 55 65 85 Q115 125 25 155" stroke="#E53935" strokeWidth="0.8" fill="none" />
        </svg>
      )}
    </div>
  );
};

// ---- Certificate Card Component ------------------------------------------
const CertificateCard = ({ cert, isActive, onActivate }) => {
  const isDark = false;
  const title   = cert.title ?? cert.name ?? 'Certificate';
  const issuer  = cert.issuer ?? cert.platform ?? '';
  const year    = cert.year ?? (cert.issuedAt ? new Date(cert.issuedAt).getFullYear() : '');
  const link    = cert.link ?? cert.credentialUrl ?? cert.url ?? '#';
  const image   = cert.imageUrl ?? cert.image;

  const handleClick = (e) => {
    if (!isActive) {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <article
      onClick={handleClick}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className="cert-grid-card group bg-white/40 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] h-full w-full select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0448a8] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-white/10 p-3 sm:p-4 border-b border-white/20">
        <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#232323]/5 shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] bg-white flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={`${title} certificate preview`}
              className="w-full h-full object-contain transition-opacity duration-300"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <BrandedThumbnail
              brand={cert.brand}
              title={title}
              issuer={issuer}
              isDark={isDark}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 p-4 gap-3 bg-white/30">
        <div className="flex items-start gap-2">
          <span
            className="mt-[5px] flex-shrink-0 w-2 h-2 rounded-full bg-[#3B4FFF]"
            aria-hidden="true"
          />
          <p className="font-inter text-[13px] sm:text-sm font-bold leading-snug text-[#111] group-hover:text-[#3B4FFF] transition-colors">
            {title}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#ECECEC] pt-3 mt-auto">
          <span className="font-inter text-[12px] text-[#888]">
            {[issuer, year].filter(Boolean).join(' • ')}
          </span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title}`}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              if (!isActive) {
                e.preventDefault();
              }
            }}
            className="flex-shrink-0 w-7 h-7 rounded-full border border-[#DDD] flex items-center justify-center text-[#333] transition-all duration-150 hover:bg-[#3B4FFF] hover:border-[#3B4FFF] hover:text-white group-hover:border-[#3B4FFF]"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

// ---- Bentocertificate Coverflow -----------------------------------------
const Bentocertificate = ({ certificates = [] }) => {
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

  const displayCertificates = useMemo(
    () => (certificates && certificates.length > 0 ? certificates : FALLBACK_CERTIFICATES),
    [certificates]
  );

  const goToIndex = (idx) => {
    const total = displayCertificates.length;
    setCurrentIndex(((idx % total) + total) % total);
  };
  const handleNext = () => goToIndex(currentIndex + 1);
  const handlePrev = () => goToIndex(currentIndex - 1);

  const syncPaused = () => {
    const { hover, touch, focus } = interactionRef.current;
    setIsPaused(hover || touch || focus);
  };

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
        const total = displayCertificates.length;
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
          card.style.pointerEvents = beyond ? 'none' : 'auto';
        });
      };

      layoutRef.current = applyLayout;

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
            spacing: isXl ? 180 : isLg ? 150 : isMd ? 120 : isSm ? 100 : 80,
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
    { scope: containerRef, dependencies: [displayCertificates] }
  );

  useEffect(() => {
    indexRef.current = currentIndex;
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    layoutRef.current();
  }, [currentIndex]);

  useEffect(() => {
    if (displayCertificates.length <= 1 || isPaused) return undefined;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCertificates.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [currentIndex, displayCertificates.length, isPaused]);

  useGSAP(
    () => {
      const el = dotFillRefs.current[currentIndex];
      if (!el || displayCertificates.length <= 1) return undefined;
      gsap.set(el, { scaleX: 0 });
      if (isPaused) return undefined;
      const tween = gsap.to(el, { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'linear' });
      return () => tween.kill();
    },
    { dependencies: [currentIndex, isPaused, displayCertificates.length], scope: containerRef }
  );

  useEffect(() => () => clearTimeout(touchResumeTimer.current), []);

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
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured certificates"
        tabIndex={0}
        className="relative h-[330px] w-full max-w-6xl rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4FFF] focus-visible:ring-offset-4 sm:h-[370px] md:h-[400px] lg:h-[430px] xl:h-[460px]"
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
        {displayCertificates.length > 0 ? (
          displayCertificates.map((cert, idx) => (
            <div
              key={cert._id || cert.id || idx}
              className="coverflow-card absolute left-1/2 top-1/2 h-auto w-[85%] min-h-[250px] max-w-[260px] sm:min-h-[290px] sm:max-w-[300px] md:min-h-[320px] md:max-w-[340px] lg:min-h-[350px] lg:max-w-[380px] xl:min-h-[380px] xl:max-w-[420px]"
            >
              <CertificateCard
                cert={cert}
                isActive={idx === currentIndex}
                onActivate={() => goToIndex(idx)}
              />
            </div>
          ))
        ) : (
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-lg font-medium text-[#8A8A8A]">No certificates found.</span>
          </div>
        )}
      </div>

      {displayCertificates.length > 0 && (
        <div className="z-20 mt-4 flex items-center gap-4 sm:mt-6 md:mt-8">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous certificate"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#333] shadow-sm transition-all duration-300 hover:border-[#3B4FFF] hover:bg-[#3B4FFF] hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4FFF] focus-visible:ring-offset-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {displayCertificates.map((cert, idx) => (
              <button
                key={cert._id || cert.id || idx}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Go to certificate ${idx + 1}`}
                aria-current={idx === currentIndex}
                className={`relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4FFF] focus-visible:ring-offset-2 ${
                  idx === currentIndex ? 'w-7 bg-[#3B4FFF]/20' : 'w-1.5 bg-[#E8E8E8] hover:bg-[#CCC]'
                }`}
              >
                {idx === currentIndex && (
                  <span
                    ref={(el) => { dotFillRefs.current[idx] = el; }}
                    className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-[#3B4FFF]"
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next certificate"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#333] shadow-sm transition-all duration-300 hover:border-[#3B4FFF] hover:bg-[#3B4FFF] hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4FFF] focus-visible:ring-offset-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Bentocertificate;
