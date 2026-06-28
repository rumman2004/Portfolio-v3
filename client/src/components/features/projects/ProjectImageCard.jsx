import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../UI/Button';

// A specialized layout card, often used for alternating left/right list views
const ProjectImageCard = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center group`}>
      
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl bg-neutral-800 aspect-[4/3]">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 font-bold text-4xl bg-neutral-900 border border-neutral-800">
            {project.title}
          </div>
        )}
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {project.title}
          </h2>
          <p className="text-lg text-neutral-400 leading-relaxed">
            {project.shortDescription || project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(project.techStack || project.technologies)?.map((tech, idx) => (
            <span key={idx} className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="pt-4">
          <Link to={`/works/${project.slug || project._id || project.id}`}>
            <Button variant="secondary">View Full Project</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProjectImageCard;
