import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { iconMap } from '../../utils/iconMap';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  
  const images = [project.heroImage || project.image?.url, ...(project.gallery || [])].filter(Boolean);
  const currentImage = images.length > 0 ? images[imageIndex % images.length] : 'https://via.placeholder.com/800x600/e5e5e5/1a1a1a?text=Project';

  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setImageIndex(prev => prev + 1);
      }, 1000);
    } else {
      setImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <Link 
      to={`/works/${project.slug || project._id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#232323]/10 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-[#F4F4F4] p-6 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full overflow-hidden rounded-xl shadow-lg border border-[#232323]/5 group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500">
          <img 
            src={currentImage} 
            alt={project.title}
            className="w-full h-full object-cover object-top transition-opacity duration-300"
          />
        </div>
        
        {/* Floating Category Label inside Image */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#232323]">
          {project.category || 'Web App'}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0448a8]"></span>
          <span className="text-[10px] md:text-xs font-bold text-[#8A8A8A] tracking-[0.15em] uppercase">
            {project.category || 'Portfolio'}
          </span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-[#232323] mb-2 group-hover:text-[#0448a8] transition-colors">
          {project.title}
        </h3>
        
        <p className="text-[#8A8A8A] text-sm leading-relaxed mb-6 line-clamp-2">
          {project.shortDescription || project.description || 'A modern digital experience showcasing clean code and meaningful design.'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(() => {
              const rawTechs = project.techStack || project.technologies || [];
              const techs = rawTechs.flatMap(t => {
                const val = typeof t === 'string' ? t : t.name;
                return val.includes(',') ? val.split(',').map(s => s.trim()).filter(Boolean) : [val];
              });
              return techs.slice(0, 4).map((techName, i) => {
                const normalizedName = techName.toLowerCase().replace(/[-_ ]+/g, '');
                const iconSrc = iconMap[normalizedName];
              
                if (iconSrc) {
                  return (
                    <div key={i} className="w-8 h-8 rounded-full bg-transparent border border-[#232323]/5 flex items-center justify-center shadow-sm" title={techName}>
                      <img src={iconSrc} alt={techName} className="w-4 h-4 object-contain" />
                    </div>
                  );
                }

                return (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-transparent text-[#232323] text-[10px] md:text-xs font-semibold rounded-md border border-[#232323]/5"
                  >
                    {techName}
                  </span>
                );
              });
            })()}
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#0448a8] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const BentoProject = ({ projects = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const categories = ['All Projects', 'Web Apps', 'Mobile Apps', 'UI / UX', 'Branding'];

  const displayProjects = projects && projects.length > 0 ? projects : [
    { _id: 1, title: 'Dr. Crop', category: 'Agriculture', shortDescription: 'AI-powered web app that detects crop diseases and suggests effective treatments.', technologies: ['React', 'Node.js', 'MongoDB', 'Gemini API'], image: { url: 'https://via.placeholder.com/800x600/e5e5e5/1a1a1a?text=Web+App' }, filterCategory: 'Web Apps' },
    { _id: 2, title: 'Neumorphic Calculator', category: 'Productivity', shortDescription: 'A modern scientific calculator with adaptive neumorphic UI and history log.', technologies: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage'], image: { url: 'https://via.placeholder.com/800x600/cccccc/1a1a1a?text=Mobile+App' }, filterCategory: 'Mobile Apps' },
    { _id: 3, title: 'BookHaven', category: 'E-Commerce', shortDescription: 'A clean and fast book store web application with modern UI and smooth UX.', technologies: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Stripe'], image: { url: 'https://via.placeholder.com/800x600/b3b3b3/1a1a1a?text=E-Commerce' }, filterCategory: 'Web Apps' }
  ];

  const filteredProjects = activeCategory === 'All Projects' 
    ? displayProjects 
    : displayProjects.filter(p => p.filterCategory === activeCategory || p.category === activeCategory);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-20">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm border ${
              activeCategory === cat 
                ? 'bg-[#0448a8] text-white border-[#0448a8]' 
                : 'bg-transparent text-[#232323] border-[#232323]/20 hover:border-[#0448a8] hover:text-[#0448a8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl relative z-20">
        {filteredProjects.map((project, idx) => (
          <ProjectCard key={project._id || idx} project={project} />
        ))}
      </div>

      {/* Empty State Fallback */}
      {filteredProjects.length === 0 && (
        <div className="w-full py-20 text-center flex flex-col items-center">
          <span className="text-[#8A8A8A] text-lg font-medium">No projects found in this category.</span>
        </div>
      )}

      {/* View All Button */}
      <div className="mt-16 flex justify-center relative z-20">
        <Link 
          to="/works"
          className="group flex min-h-11 items-center justify-center gap-2 bg-[#0448a8] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-[#0448a8]/20 hover:bg-[#03367d] hover:-translate-y-0.5 transition-all duration-200"
        >
          View All Projects
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>

    </div>
  );
};

export default BentoProject;
