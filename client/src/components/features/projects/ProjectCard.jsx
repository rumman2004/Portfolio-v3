import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../UI/Card';
import Badge from '../../UI/Badge';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/works/${project.slug || project._id || project.id}`}>
      <Card className="h-full flex flex-col group cursor-pointer border border-gray-200 hover:border-gray-300 bg-white" hover glass={false}>
        {/* Project Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl bg-gray-100">
              {project.title.charAt(0)}
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {project.shortDescription || project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {(project.techStack || project.technologies)?.slice(0, 3).map((tech, idx) => (
              <Badge key={idx} variant="neutral" className="bg-gray-100 text-gray-700">
                {tech}
              </Badge>
            ))}
            {(project.techStack || project.technologies)?.length > 3 && (
              <Badge variant="neutral" className="bg-gray-100 text-gray-700">+{(project.techStack || project.technologies).length - 3}</Badge>
            )}
          </div>

          <div className="flex items-center text-blue-400 font-medium text-sm mt-auto">
            View Case Study <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;
