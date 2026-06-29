import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { ArrowLeft, ExternalLink, ArrowUpRight } from 'lucide-react';
import TechnologiesUsed from '../../components/common/TechnologiesUsed';
import ProjectObjective from '../../components/common/ProjectObjective';
import ProjectCaseStudy from '../../components/common/projectCaseStudy';
import ProjectCard from '../../components/features/projects/ProjectCard';

/* ─────────────────────────────────────────────────────────────
   FALLBACK PROJECT (for demo when API is absent)
──────────────────────────────────────────────────────────────*/
const FALLBACK_PROJECT = {
  title: 'Dr. Crop',
  category: 'Web App',
  year: '2024',
  role: 'Full-Stack Developer',
  timeline: '6 weeks',
  shortDescription: 'AI-powered web app that detects crop diseases and suggests effective treatments in real time.',
  problem: 'Smallholder farmers lack access to agricultural experts, leading to misdiagnosis of crop diseases, chemical waste, and significant yield losses. Existing tools are either too complex or require high-speed internet, which is often unavailable in rural areas.',
  solution: 'Dr. Crop is a mobile-first web application designed specifically for low-bandwidth environments. It utilizes the Gemini Vision API to analyze photos of crop leaves and instantly return a diagnosis. To handle connectivity issues, we implemented a local caching system that stores common regional disease signatures offline, ensuring farmers can get help even without a signal.',
  results: 'The application successfully reduced misdiagnosis in testing by 40% and improved response times for treatment recommendations from days to seconds. It is currently being piloted by over 200 farmers in the region.',
  features: [
    'Camera-based leaf disease detection using AI',
    'Multi-language support for regional farmer accessibility',
    'Treatment recommendation engine with organic and chemical options',
    'Offline mode with cached common disease signatures',
    'Dashboard for tracking field scan history',
  ],
  technologies: ['React', 'Node.js', 'MongoDB', 'Gemini API', 'Tailwind CSS', 'Express'],
  image: { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=85' },
  gallery: [
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0a3835?w=1600&q=85',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=85',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&q=85'
  ],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com',
};

const FALLBACK_RELATED = [
  { _id: 'r1', slug: 'bookhaven', title: 'BookHaven', category: 'E-Commerce', image: { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80' } },
  { _id: 'r2', slug: 'medi-track', title: 'MediTrack', category: 'Health Tech', image: { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80' } },
  { _id: 'r3', slug: 'event-flow', title: 'EventFlow', category: 'SaaS', image: { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' } },
];

/* ─────────────────────────────────────────────────────────────
   LOADER
──────────────────────────────────────────────────────────────*/
const PageLoader = () => (
  <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 rounded-full border-2 border-[#0448a8]/20 border-t-[#0448a8] animate-spin" />
    <p className="font-inter text-[#6B7280] text-sm tracking-widest uppercase font-bold">
      Loading project
    </p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────*/
const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: projectData, loading, error } = useFetch(`/projects/${id}`);
  const { data: allProjects } = useFetch('/projects');

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // Use API data or fallback
  const project = projectData || FALLBACK_PROJECT;
  const heroImg = project.image?.url || project.heroImage;
  const gallery = project.gallery?.length ? project.gallery : (project.screenshots || []);

  // Related: filter out current, take 3
  const related = allProjects
    ? allProjects.filter(p => (p.slug || p._id) !== id).slice(0, 3)
    : FALLBACK_RELATED;

  if (loading) return <PageLoader />;

  if (error && !projectData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-5 px-6">
        <h2 className="font-headline text-4xl text-[#1A1A1A] uppercase tracking-tight">Project not found</h2>
        <p className="font-inter text-[#6B7280] text-lg">This project doesn't exist or has been removed.</p>
        <Link to="/works" className="mt-4 px-8 py-4 bg-[#0448a8] text-white font-inter font-bold uppercase rounded-full hover:bg-[#03367d] transition-colors">
          Back to Works
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] selection:bg-[#0448a8] selection:text-white pb-20 relative">

      {/* ── CLEAN EDITORIAL HERO (LIGHT THEME) ── */}
      <section className="relative w-full bg-[#F9FAFB] pt-32 pb-32 md:pt-48 md:pb-48 overflow-hidden z-10">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0448a8]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
          
          {/* Back nav */}
          <button onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280] hover:text-[#1A1A1A] transition-colors mb-12 md:mb-16">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </button>

          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className="font-inter text-xs font-bold tracking-[0.25em] uppercase text-[#0448a8] bg-[#0448a8]/10 px-4 py-2 rounded-full border border-[#0448a8]/20">
                {project.category}
              </span>
              {project.year && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/20" />
                  <span className="font-inter text-sm font-bold tracking-[0.2em] uppercase text-[#6B7280]">
                    {project.year}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl lg:text-[110px] text-[#1A1A1A] tracking-tighter uppercase leading-[0.9] mb-8 drop-shadow-sm">
              {project.title}<span className="text-[#0448a8]">.</span>
            </h1>

            {/* Short description */}
            <p className="font-inter text-[#6B7280] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mb-12 font-light">
              {project.shortDescription}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-5">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-8 py-4 bg-[#0448a8] !text-white font-inter font-bold uppercase tracking-wider rounded-full hover:bg-[#03367d] hover:shadow-[0_8px_30px_rgba(4,72,168,0.4)] hover:-translate-y-1 transition-all duration-300">
                  View Live Site <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-md text-[#1A1A1A] border border-[#1A1A1A]/10 font-inter font-bold uppercase tracking-wider rounded-full hover:bg-white hover:border-[#1A1A1A]/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  Source Code <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 16:9 HERO IMAGE PRESENTATION ── */}
      <section className="relative w-full z-20 px-4 md:px-12 lg:px-16 xl:px-24 -mt-20 md:-mt-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Liquid Glass Frame */}
          <div className="w-full aspect-video rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] border-[8px] md:border-[16px] border-white/40 backdrop-blur-xl bg-white/50">
            {heroImg ? (
              <img 
                src={heroImg} 
                alt={project.title} 
                className="w-full h-full object-cover rounded-[16px] md:rounded-[24px]" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-[16px] md:rounded-[24px] bg-[#E8E8E8]">
                <span className="font-headline text-8xl text-[#ccc]">{project.title.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left: Sidebar Meta & Tech Stack (Liquid Glass Light) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-32 space-y-8">
            
            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <h3 className="font-headline text-2xl uppercase tracking-wider mb-8 text-[#1A1A1A]">Project Info</h3>
              
              <div className="space-y-6">
                {project.role && (
                  <div className="flex flex-col gap-2 pb-6 border-b border-[#1A1A1A]/10">
                    <span className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280]">Role</span>
                    <span className="font-inter text-base font-semibold text-[#1A1A1A]">{project.role}</span>
                  </div>
                )}
                {project.timeline && (
                  <div className="flex flex-col gap-2 pb-6 border-b border-[#1A1A1A]/10">
                    <span className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280]">Timeline</span>
                    <span className="font-inter text-base font-semibold text-[#1A1A1A]">{project.timeline}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex flex-col gap-2">
                    <span className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280]">Category</span>
                    <span className="font-inter text-base font-semibold text-[#1A1A1A]">{project.category}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <TechnologiesUsed technologies={project.techStack || project.technologies} />
            </div>

          </div>
        </div>

        {/* Right: Case Study Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-16">

          {/* Project Objective */}
          <ProjectObjective objective={project.problem || project.objective} />

          {/* Case Study: Solution, Results, Features */}
          <ProjectCaseStudy
            solution={project.solution || project.description || project.fullDescription}
            results={project.results}
            features={project.features}
          />

          {/* Staggered Gallery */}
          {gallery.length > 0 && (
            <div className="pt-12">
              <h2 className="font-headline text-4xl uppercase tracking-wider text-[#1A1A1A] mb-12 flex items-center gap-4">
                <span className="w-12 h-px bg-[#1A1A1A]/20"></span>
                Gallery
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gallery.map((src, i) => (
                  <div 
                    key={i} 
                    className={`group relative rounded-[12px] overflow-hidden border border-[#1A1A1A]/5 shadow-[0_20px_40px_rgba(0,0,0,0.06)] bg-white/60 backdrop-blur-md p-2 ${
                      i === 0 && gallery.length % 2 !== 0 ? 'md:col-span-2 aspect-video' : 'aspect-video'
                    } ${i % 2 !== 0 && i !== 0 ? 'md:translate-y-12' : ''}`}
                  >
                    <div className="w-full h-full rounded-[10px] overflow-hidden relative">
                      <img 
                        src={src?.url || src} 
                        alt={`Gallery ${i + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── RELATED PROJECTS ── */}
      {related.length > 0 && (
        <div className="relative z-10 bg-white/40 backdrop-blur-3xl border-t border-[#1A1A1A]/5 py-24 md:py-32 mt-24">
          <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="font-inter text-sm font-bold tracking-[0.3em] uppercase text-[#6B7280] mb-4">
                  Keep Exploring
                </p>
                <h2 className="font-headline text-4xl md:text-6xl text-[#1A1A1A] tracking-tighter uppercase">
                  Related Projects<span className="text-[#0448a8]">.</span>
                </h2>
              </div>
              <Link to="/works" className="hidden md:flex px-8 py-4 bg-white/60 backdrop-blur-md text-[#1A1A1A] border border-[#1A1A1A]/10 font-inter font-bold uppercase rounded-full hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                View All Work
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {related.map((rp, i) => (
                <ProjectCard key={rp._id || i} project={rp} />
              ))}
            </div>

            <div className="mt-12 flex justify-center md:hidden">
              <Link to="/works" className="w-full text-center px-8 py-4 bg-white/60 backdrop-blur-md text-[#1A1A1A] border border-[#1A1A1A]/10 font-inter font-bold uppercase rounded-full hover:bg-white hover:shadow-md transition-all duration-300">
                All Projects
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      <div className="bg-[#F9FAFB] py-24 md:py-32 relative overflow-hidden z-10 border-t border-black/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0448a8]/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0448a8]/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24 text-center relative z-10">
          <p className="font-inter text-sm font-bold tracking-[0.3em] uppercase text-[#6B7280] mb-6">
            Next step
          </p>
          <h2 className="font-headline text-5xl md:text-7xl text-[#1A1A1A] tracking-tighter uppercase leading-[1.1] mb-12 drop-shadow-sm">
            Have an idea?<br/>Let's build it together<span className="text-[#0448a8]">.</span>
          </h2>
          <Link to="/#contact" className="inline-flex items-center gap-3 px-10 py-5 bg-[#0448a8] !text-white font-inter font-bold uppercase tracking-wider rounded-full hover:bg-[#03367d] hover:shadow-[0_10px_40px_rgba(4,72,168,0.4)] hover:-translate-y-1 transition-all duration-300">
            Get In Touch <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;