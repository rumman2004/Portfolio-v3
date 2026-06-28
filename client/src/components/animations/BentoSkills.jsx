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
      className="skill-tile group relative aspect-square min-h-[112px] bg-white border border-black/[0.05] p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#0448a8]/25 hover:shadow-[0_14px_36px_rgba(4,72,168,0.09)]"
      title={`${displayName} - ${categoryName}`}
    >
      <span
        className="absolute left-3 top-3 h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F8FA] border border-black/[0.04] sm:h-12 sm:w-12">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            className="h-6 w-6 object-contain sm:h-7 sm:w-7 transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <span className="text-sm font-extrabold text-[#98A2B3]">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <span className="w-full truncate px-1 text-[10px] font-bold uppercase leading-tight text-[#667085] sm:text-[11px]">
        {displayName}
      </span>
      <span className="mt-1 w-full truncate px-1 text-[10px] font-medium text-[#98A2B3]">
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
    <div ref={containerRef} className="w-full max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#EEF0F4] p-px shadow-sm">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-px">
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
