import React from 'react';
import { iconMap } from '../../utils/iconMap';

const TechnologiesUsed = ({ technologies = [] }) => {
  // Normalize: handle legacy data where techStack was stored as a single comma-separated string
  const normalizedTechs = (technologies || []).flatMap(t => {
    const val = typeof t === 'string' ? t : t.name;
    // If a single entry contains commas, split it
    return val.includes(',') ? val.split(',').map(s => s.trim()).filter(Boolean) : [val];
  });

  if (normalizedTechs.length === 0) return null;

  return (
    <section>
      <h3 style={{ fontFamily: "'Archivo Black', sans-serif" }}
          className="text-xl uppercase tracking-wider mb-6 text-[#111]">
        Technologies Used
      </h3>
      <div className="flex flex-wrap gap-3">
        {normalizedTechs.map((techName, idx) => {
          const normalizedName = techName.toLowerCase().replace(/[-_ ]+/g, '');
          const iconSrc = iconMap[normalizedName];

          if (iconSrc) {
            return (
              <div
                key={idx}
                className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-black/[0.05] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(4,72,168,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-default"
                title={techName}
              >
                <img src={iconSrc} alt={techName} className="w-7 h-7 object-contain" />
              </div>
            );
          }

          return (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#333] text-sm font-semibold border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:border-[#0448a8] hover:text-[#0448a8] transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {techName}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default TechnologiesUsed;
