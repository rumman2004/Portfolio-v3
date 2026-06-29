import React, { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FALLBACK_CATEGORIES } from '../../utils/skillsData';
import { resolveIcon } from '../../utils/iconMap';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CATEGORY_COLORS = [
  '#0448a8',
  '#4f46e5',
  '#0f766e',
  '#b45309',
  '#7c3aed',
  '#be123c',
  '#0369a1',
  '#15803d',
];

const normalizeSkill = (skill, fallbackCategory = 'Tools') => {
  const name = typeof skill === 'string' ? skill : skill?.name;
  return {
    ...((typeof skill === 'object' && skill) || {}),
    name: name || 'Skill',
    category: skill?.category || fallbackCategory,
  };
};

const flattenFallbackSkills = () =>
  FALLBACK_CATEGORIES.flatMap((category) =>
    (category.tools || []).map((tool) => normalizeSkill(tool, category.category || category.name || 'Tools'))
  );

const SkillTile = ({ skill, index }) => {
  const iconSrc = resolveIcon(skill);
  const displayName = skill.name?.replace(/[-_]/g, ' ') || 'Skill';
  const categoryName = skill.category || 'Tools';
  const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

  return (
    <div
      className="skill-tile group relative aspect-square min-h-[112px] bg-white/60 hover:bg-white/80 p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all duration-300"
      title={`${displayName} - ${categoryName}`}
    >
      <span
        className="absolute left-4 top-4 h-2 w-2 rounded-full shadow-sm"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/80 border border-white shadow-sm sm:h-14 sm:w-14">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            className="h-7 w-7 object-contain sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <span className="text-sm font-headline text-[#6B7280]">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <span className="w-full truncate px-1 text-[11px] font-bold font-inter uppercase tracking-widest text-[#1A1A1A] sm:text-xs">
        {displayName}
      </span>
      <span className="mt-1.5 w-full truncate px-1 text-[10px] font-medium font-inter tracking-wider uppercase text-[#6B7280]">
        {categoryName}
      </span>
    </div>
  );
};

const BentoSkills = ({ skills = [] }) => {
  const containerRef = useRef(null);

  const displaySkills = useMemo(() => {
    const source = skills.length ? skills.map((skill) => normalizeSkill(skill)) : flattenFallbackSkills();
    const seen = new Set();

    return source.filter((skill) => {
      const key = `${skill.name || ''}`.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [skills]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tiles = gsap.utils.toArray('.skill-tile');

      if (prefersReducedMotion) {
        gsap.set(tiles, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        tiles,
        { opacity: 0, y: 14, scale: 0.98, willChange: 'transform, opacity' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: 'power2.out',
          stagger: { amount: 0.36, from: 'start' },
          clearProps: 'willChange,transform',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [displaySkills.length] }
  );

  return (
    <div ref={containerRef} className="w-full max-w-[1400px] mx-auto px-4 md:px-0">
      <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-[1px] bg-black/5">
          {displaySkills.map((skill, index) => (
            <SkillTile
              key={`${skill.name}-${skill.category}-${index}`}
              skill={skill}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BentoSkills;
