import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { iconMap } from '../../../utils/iconMap';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/works/${project.slug || project._id || project.id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 relative">
        
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Project Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#F9FAFB] p-2 pb-0">
          <div className="w-full h-full rounded-t-[24px] overflow-hidden relative">
            {project.image || project.heroImage ? (
              <img 
                src={project.image?.url || project.heroImage || project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#ccc] font-headline text-5xl bg-[#E8E8E8]">
                {project.title.charAt(0)}
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-grow relative z-10">
          
          {/* Category/Eyebrow */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#0448a8]">
              {project.category || 'Project'}
            </span>
            <ArrowUpRight size={20} className="text-[#6B7280] group-hover:text-[#1A1A1A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>

          <h3 className="font-headline text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#0448a8] transition-colors">
            {project.title}
          </h3>
          
          <p className="font-inter text-[#6B7280] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-light">
            {project.shortDescription || project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.techStack || project.technologies)?.slice(0, 3).map((tech, idx) => {
              const val = typeof tech === 'string' ? tech : tech.name;
              const normalizedName = val.toLowerCase().replace(/[-_ ]+/g, '');
              const iconSrc = iconMap[normalizedName];

              return (
                <span key={idx} className="flex items-center gap-1.5 font-inter text-xs font-medium text-[#6B7280] bg-[#1A1A1A]/5 px-3 py-1.5 rounded-full border border-[#1A1A1A]/5">
                  {iconSrc && <img src={iconSrc} alt={val} className="w-3.5 h-3.5 object-contain" />}
                  <span className="capitalize">{val.replace('light', '').replace('dark', '')}</span>
                </span>
              );
            })}
            {(project.techStack || project.technologies)?.length > 3 && (
              <span className="flex items-center font-inter text-xs font-medium text-[#6B7280] bg-[#1A1A1A]/5 px-3 py-1.5 rounded-full border border-[#1A1A1A]/5">
                +{(project.techStack || project.technologies).length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center text-[#0448a8] font-inter font-bold text-sm tracking-wider uppercase mt-auto">
            View Case Study <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
