import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';

const SectionCard = ({ icon: Icon, iconBg, iconColor, title, children }) => (
  <div className="bg-white rounded-3xl p-10 border border-black/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.02)] mb-8">
    <h2
      style={{ fontFamily: "'Archivo Black', sans-serif" }}
      className="text-2xl uppercase tracking-wider text-[#111] mb-6 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      {title}
    </h2>
    {children}
  </div>
);

const ProjectCaseStudy = ({ solution, results, features }) => {
  const hasSolution = !!solution;
  const hasResults = !!results;
  const hasFeatures = features && features.length > 0;

  if (!hasSolution && !hasResults && !hasFeatures) return null;

  return (
    <div className="space-y-0">
      {/* The Solution */}
      {hasSolution && (
        <SectionCard icon={Lightbulb} iconBg="bg-[#0448a8]/10" iconColor="text-[#0448a8]" title="The Solution">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-[#555] text-lg leading-[1.8] whitespace-pre-line"
          >
            {solution}
          </p>
        </SectionCard>
      )}

      {/* Results & Impact */}
      {hasResults && (
        <SectionCard icon={TrendingUp} iconBg="bg-green-500/10" iconColor="text-green-600" title="Results & Impact">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-[#555] text-lg leading-[1.8] whitespace-pre-line"
          >
            {results}
          </p>
        </SectionCard>
      )}

      {/* Key Features */}
      {hasFeatures && (
        <SectionCard icon={CheckCircle2} iconBg="bg-[#111]/5" iconColor="text-[#111]" title="Key Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-5 bg-white border border-black/[0.06] rounded-2xl hover:-translate-y-0.5 hover:shadow-lg hover:border-[#0448a8]/10 transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="w-7 h-7 rounded-full bg-[#0448a8]/10 flex items-center justify-center shrink-0 text-[#0448a8] font-bold text-xs mt-0.5">
                  {i + 1}
                </div>
                <span className="text-[#444] text-[15px] leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ProjectCaseStudy;
