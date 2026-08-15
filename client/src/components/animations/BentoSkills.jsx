import React, { useMemo } from 'react';
import { FALLBACK_CATEGORIES } from '../../utils/skillsData';
import { resolveIcon } from '../../utils/iconMap';

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
    (category.tools || []).map((tool) =>
      normalizeSkill(tool, category.category || category.name || 'Tools')
    )
  );

const BentoSkills = ({ skills = [] }) => {
  const allSkills = skills.length ? skills.map(s => normalizeSkill(s)) : flattenFallbackSkills();

  const getSkillsForCategories = (categories) => {
    const seen = new Set();
    const items = [];
    
    for (const skill of allSkills) {
      const cat = skill.category?.toLowerCase() || '';
      if (categories.some(c => cat.includes(c.toLowerCase()))) {
        const url = resolveIcon(skill);
        // Deduplicate by name and URL
        const key = `${skill.name}-${url}`;
        if (url && !seen.has(key)) {
          seen.add(key);
          items.push({ name: skill.name, url });
        }
      }
    }
    
    return items;
  };

  const rings = useMemo(() => {
    let groups = [
      { label: "Database", items: getSkillsForCategories(["database"]) },
      { label: "Server", items: getSkillsForCategories(["server", "programming", "code"]) },
      { label: "Design", items: getSkillsForCategories(["frontend", "design"]) },
      { label: "AI", items: getSkillsForCategories(["ai"]) },
      { label: "DevOps & Tools", items: getSkillsForCategories(["tool", "devops"]) },
      { label: "Apps", items: getSkillsForCategories(["app", "social"]) },
    ];

    // Remove empty groups
    groups = groups.filter(g => g.items.length > 0);

    // Sort by number of items (ascending) so rings with fewest items are closest to the center
    groups.sort((a, b) => a.items.length - b.items.length);

    // Map to dynamic sizes, durations, and stagger attributes
    return groups.map((g, i) => {
      // Linearly interpolate sizes between 30% and 100% depending on how many groups there are
      const size = groups.length === 1 ? 60 : 30 + (70 / (groups.length - 1)) * i;
      const duration = 25 + i * 10;
      
      return {
        ...g,
        size,
        duration,
        reverse: i % 2 !== 0,
        labelPos: i % 2 === 0 ? 'top' : 'bottom'
      };
    });
  }, [allSkills]);

  return (
    <div className="w-full flex justify-center py-12 md:py-20 px-4 md:px-8 overflow-hidden bg-transparent" style={{ perspective: '1200px' }}>
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .ring-group:hover .orbit-anim {
          animation-play-state: paused !important;
        }
      `}</style>

      <div 
        className="relative w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] aspect-square flex items-center justify-center mt-4 md:mt-8"
        style={{ transform: 'rotateX(50deg)', transformStyle: 'preserve-3d' }}
      >
        
        {/* Center Node */}
        <div 
          className="absolute flex flex-col items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-[#ffffff] rounded-full shadow-md border border-gray-200 backdrop-blur-md"
        >
          <span className="font-headline text-lg md:text-2xl font-bold text-[#0448a8] tracking-wider uppercase drop-shadow-sm">Core</span>
        </div>

        {rings.map((ring, i) => (
          <div 
            key={`ring-container-${i}`}
            className="absolute flex items-center justify-center ring-group pointer-events-none"
            style={{ width: `${ring.size}%`, height: `${ring.size}%`, transformStyle: 'preserve-3d' }}
          >
            {/* 1. Static Border */}
            <div className="absolute inset-0 rounded-full border border-gray-300/70" />
            
            {/* Label placed strategically to prevent overlap, lies flat on the ring */}
            <div 
              className={`absolute left-1/2 bg-[#F4F4F4] px-2 md:px-4 py-0.5 md:py-1 text-[9px] md:text-[11px] font-bold text-gray-500 tracking-widest uppercase rounded-full border border-gray-300/80 shadow-sm whitespace-nowrap
                ${ring.labelPos === 'top' ? 'top-0' : 'bottom-0'}`}
              style={{ transform: `translate(-50%, ${ring.labelPos === 'top' ? '-50%' : '50%'}) translateZ(-1px)` }}
            >
              {ring.label}
            </div>

            {/* 2. Rotating Container */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none orbit-anim"
              style={{
                animation: `orbit-spin${ring.reverse ? '-reverse' : ''} ${ring.duration}s linear infinite`,
                transformStyle: 'preserve-3d'
              }}
            >
              {ring.items.map((item, index) => {
                const angle = (index / ring.items.length) * 360;
                return (
                  <div
                    key={`item-${index}`}
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{
                      height: '50%',
                      transformOrigin: 'bottom center',
                      transform: `rotate(${angle}deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Counter-rotating Wrapper */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 pointer-events-auto orbit-anim"
                      style={{
                        animation: `orbit-spin${!ring.reverse ? '-reverse' : ''} ${ring.duration}s linear infinite`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Hover Scale Wrapper (isolated from transform animations) */}
                      <div className="w-full h-full transition-transform hover:scale-125 group/icon relative">
                        {/* Fixed Rotation Correction & Stand-up Tilt */}
                        <div 
                          className="w-full h-full bg-white rounded-full shadow-sm border border-gray-200/80 flex items-center justify-center p-1.5 md:p-2 backdrop-blur-sm relative"
                          style={{ transform: `rotate(-${angle}deg) rotateX(-50deg)` }}
                        >
                          {/* Animated Tooltip */}
                          <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 group-hover/icon:-translate-y-2 transition-all duration-300 pointer-events-none z-50 bg-[#ffffff] px-2.5 py-1 rounded-lg shadow-xl border border-gray-200 whitespace-nowrap">
                            <span className="text-[10px] md:text-xs font-bold text-[#0448a8]">{item.name}</span>
                            {/* Tooltip Tail */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#ffffff] rotate-45 border-b border-r border-gray-200"></div>
                          </div>

                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default BentoSkills;