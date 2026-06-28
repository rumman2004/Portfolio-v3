import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Trophy, Rocket, Code2, Heart, GraduationCap, ShoppingCart,
  Medal, Star, Award, Calendar, MapPin
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ICON_MAP = {
  trophy: Trophy,
  rocket: Rocket,
  code: Code2,
  heart: Heart,
  education: GraduationCap,
  cart: ShoppingCart
};

// Best-effort icon pick when the API doesn't send an explicit `icon` field —
// matches keywords in the title/description, falls back to a trophy.
const KEYWORD_RULES = [
  [/health|wellness|medical/i, 'heart'],
  [/eco|sustain|green|climate/i, 'rocket'],
  [/learn|edu|student|study/i, 'education'],
  [/shop|vendor|kart|commerce|market/i, 'cart'],
  [/dev|connect|platform|api|code/i, 'code']
];

const resolveIcon = (hack) => {
  if (hack.icon && ICON_MAP[hack.icon]) return ICON_MAP[hack.icon];
  const haystack = `${hack.title || ''} ${hack.description || ''}`;
  const match = KEYWORD_RULES.find(([pattern]) => pattern.test(haystack));
  return ICON_MAP[match?.[1]] || Trophy;
};

const getBadgeMeta = (achievement = '') => {
  const a = achievement.toLowerCase();
  if (a.includes('1st')) return { icon: Medal, classes: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (a.includes('2nd')) return { icon: Medal, classes: 'bg-slate-100 text-slate-600 border-slate-200' };
  if (a.includes('3rd')) return { icon: Medal, classes: 'bg-orange-50 text-orange-700 border-orange-200' };
  if (a.includes('top 10')) return { icon: Star, classes: 'bg-[#3D4BFF]/10 text-[#3D4BFF] border-[#3D4BFF]/20' };
  if (a.includes('finalist')) return { icon: Star, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return { icon: Award, classes: 'bg-gray-100 text-gray-600 border-gray-200' };
};

const formatDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date // already a display string like "March 2024"
    : parsed.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const BentoHackathon = ({ hackathons = [], loading = false }) => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.set('.hack-card', { opacity: 1, y: 0 });
  }, { scope: containerRef, dependencies: [loading, hackathons.length] });

  return (
    <div ref={containerRef}>
      {loading ? (
        <HackathonGridSkeleton />
      ) : !hackathons.length ? (
        <div className="h-[220px] bg-[#F8F8F8] border border-[#1A1A1A]/10 rounded-2xl flex items-center justify-center">
          <span className="font-inter text-[#6B7280] text-base">No hackathon projects listed yet — check back soon.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hack) => {
            const Icon = resolveIcon(hack);
            const badge = getBadgeMeta(hack.achievement);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={hack._id || hack.id}
                className="hack-card bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#3D4BFF]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#3D4BFF]" />
                  </div>
                  {hack.achievement && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badge.classes}`}>
                      <BadgeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      {hack.achievement}
                    </span>
                  )}
                </div>

                <h3 className="font-inter font-bold text-[#1A1A1A] text-lg mb-2">{hack.title}</h3>
                <p className="font-inter text-[#6B7280] text-sm leading-relaxed mb-6">{hack.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-[#1A1A1A]/10">
                  {hack.date && (
                    <span className="inline-flex items-center gap-1.5 font-inter text-xs text-[#6B7280]">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> {formatDate(hack.date)}
                    </span>
                  )}
                  {hack.organization && (
                    <span className="inline-flex items-center gap-1.5 font-inter text-xs text-[#6B7280]">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {hack.organization}
                    </span>
                  )}
                </div>
                
                {hack.projectId && (
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10">
                    <a href={`/works/${hack.projectId.slug || hack.projectId._id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0448a8] hover:text-[#03367d] transition-colors">
                      View Project: {hack.projectId.title}
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HackathonGridSkeleton = () => (
  <div role="status" aria-live="polite" aria-label="Loading hackathon achievements" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-[220px] bg-[#F8F8F8] border border-[#1A1A1A]/10 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export default BentoHackathon;
