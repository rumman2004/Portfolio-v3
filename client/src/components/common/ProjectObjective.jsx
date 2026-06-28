import React from 'react';
import { Target } from 'lucide-react';

const ProjectObjective = ({ objective }) => {
  if (!objective) return null;

  return (
    <section className="rounded-3xl bg-[#0448a8] text-white border-none shadow-[0_20px_50px_rgba(4,72,168,0.2)] p-10 mb-8">
      <h2
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
        className="text-2xl uppercase tracking-widest text-white/90 mb-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Target size={24} className="text-white" />
        </div>
        Project Objective
      </h2>
      <p
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="text-white/80 text-lg leading-relaxed font-light whitespace-pre-line"
      >
        {objective}
      </p>
    </section>
  );
};

export default ProjectObjective;
