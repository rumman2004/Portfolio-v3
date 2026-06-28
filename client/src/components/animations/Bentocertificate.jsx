import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


// Removed ScrollTrigger per user request

/**
 * Bentocertificate
 *
 * Renders a 4-column horizontal grid of certificate cards that match the
 * reference design:
 *   - Top: thumbnail preview of the actual certificate (image or branded placeholder)
 *   - Bottom: blue dot + title, issuer • year, arrow-link button
 *
 * Props:
 *   certificates  Array<{
 *     _id?:       string
 *     title:      string          — certificate name
 *     issuer?:    string          — e.g. "Coursera", "Adobe"
 *     year?:      string | number — e.g. "2024"
 *     imageUrl?:  string          — URL to certificate image/thumbnail
 *     link?:      string          — external URL for the ↗ button
 *     color?:     string — retained for API compatibility; placeholders render in the light theme
 *   }>
 */
const Bentocertificate = ({ certificates = [] }) => {
  const containerRef = useRef();

  /* ── Fallback demo data ────────────────────────────────────────────── */
  const fallback = [
    {
      id: 'f1',
      title: 'Google UX Design Professional Certificate',
      issuer: 'Coursera',
      year: '2024',
      color: 'light',
      brand: 'Google',
    },
    {
      id: 'f2',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera',
      year: '2024',
      color: 'light',
      brand: 'Meta',
    },
    {
      id: 'f3',
      title: 'Adobe Certified Professional Visual Design',
      issuer: 'Adobe',
      year: '2023',
      color: 'light',
      brand: 'Adobe',
    },
    {
      id: 'f4',
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      year: '2023',
      color: 'light',
      brand: 'freeCodeCamp',
    },
  ];

  const items = certificates.length ? certificates : fallback;

  /* ── No entrance animation per user request ─────────────────────────────── */
  useGSAP(() => {
    gsap.set('.cert-grid-card', { opacity: 1, y: 0 });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {items.map((cert, i) => {
        const isDark = false;

        const key = cert._id ?? cert.id ?? i;
        const title   = cert.title ?? cert.name ?? 'Certificate';
        const issuer  = cert.issuer ?? cert.platform ?? '';
        const year    = cert.year ?? (cert.issuedAt ? new Date(cert.issuedAt).getFullYear() : '');
        const link    = cert.link ?? cert.credentialUrl ?? cert.url ?? '#';
        const image   = cert.imageUrl ?? cert.image;

        return (
          <article
            key={key}
            className="cert-grid-card group bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E8E8] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {/* ── Thumbnail ───────────────────────────────────────── */}
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              {image ? (
                <img
                  src={image}
                  alt={`${title} certificate preview`}
                  className="w-full h-full object-cover"
                  loading="lazy"
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

            {/* ── Body ────────────────────────────────────────────── */}
            <div className="flex flex-col justify-between flex-1 p-4 gap-3">

              {/* Title row */}
              <div className="flex items-start gap-2">
                <span
                  className="mt-[5px] flex-shrink-0 w-2 h-2 rounded-full bg-[#3B4FFF]"
                  aria-hidden="true"
                />
                <p className="font-inter text-[13px] font-bold leading-snug text-[#111]">
                  {title}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#ECECEC] pt-3">
                <span className="font-inter text-[12px] text-[#888]">
                  {[issuer, year].filter(Boolean).join(' • ')}
                </span>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${title}`}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-[#DDD] flex items-center justify-center text-[#333] transition-all duration-150 group-hover:bg-[#3B4FFF] group-hover:border-[#3B4FFF] group-hover:text-white"
                >
                  {/* Arrow icon — inline svg for zero dependency */}
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
      })}
    </div>
  );
};

/* ── Branded placeholder thumbnail ─────────────────────────────────────── */
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
      {/* Brand logo */}
      {cfg ? (
        <div>{cfg.logo}</div>
      ) : (
        <div style={{ color: sub, fontSize: 12, fontWeight: 600 }}>{issuer}</div>
      )}

      {/* Certificate title */}
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

      {/* Decorative accent badge (bottom-right) */}
      <BadgeSeal isDark={isDark} brand={brand} />

      {/* Subtle decorative swirl for Adobe */}
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

export default Bentocertificate;
