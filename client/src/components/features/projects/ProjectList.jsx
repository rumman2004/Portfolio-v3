import React from 'react';
import ProjectCard from './ProjectCard';
import ProjectImageCard from './ProjectImageCard';

const ProjectList = ({ projects = [], layout = 'grid' }) => {
  if (!projects || projects.length === 0) {
    return <div className="text-center text-neutral-500 py-12">No projects available at the moment.</div>;
  }

  return (
    <div className={`grid gap-8 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {projects.map((project, idx) => (
        layout === 'grid' 
          ? <ProjectCard key={project._id || idx} project={project} /> 
          : <ProjectImageCard key={project._id || idx} project={project} index={idx} />
      ))}
    </div>
  );
};

export default ProjectList;
