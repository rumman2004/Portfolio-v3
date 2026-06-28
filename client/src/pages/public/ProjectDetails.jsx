import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { ArrowLeft, ExternalLink, ArrowUpRight } from 'lucide-react';
import TechnologiesUsed from '../../components/common/TechnologiesUsed';
import ProjectObjective from '../../components/common/ProjectObjective';
import ProjectCaseStudy from '../../components/common/projectCaseStudy';

/* ─────────────────────────────────────────────────────────────
   FONTS
──────────────────────────────────────────────────────────────*/
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@600;700&display=swap');
    .pd-font-headline { font-family: 'Archivo Black', sans-serif; }
    .pd-font-inter    { font-family: 'Inter', sans-serif; }
    .pd-font-script   { font-family: 'Caveat', cursive; }

    .pd-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 12px;
      background: white;
      color: #333;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      transition: all 0.3s ease;
    }
    .pd-tag:hover {
      transform: translateY(-2px);
      border-color: #0448a8;
      color: #0448a8;
      box-shadow: 0 4px 12px rgba(4,72,168,0.1);
    }

    .pd-meta-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    .pd-meta-label {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #888;
    }
    .pd-meta-value {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #111;
    }

    .pd-section-title {
      font-family: 'Archivo Black', sans-serif;
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #111;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .pd-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #888;
      transition: color 0.2s, gap 0.2s;
      text-decoration: none;
    }
    .pd-back-btn:hover { color: #111; gap: 12px; }
    .pd-back-btn:hover .pd-back-arrow { transform: translateX(-3px); }
    .pd-back-arrow { transition: transform 0.2s ease; }

    .pd-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0448a8;
      color: white;
      padding: 16px 32px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(4,72,168,0.25);
      transition: all 0.3s ease;
    }
    .pd-cta-primary:hover { background: #03367d; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(4,72,168,0.3); }

    .pd-cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: white;
      color: #111;
      border: 1.5px solid rgba(0,0,0,0.12);
      padding: 16px 32px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .pd-cta-secondary:hover { border-color: #111; background: #F8F8F8; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.05); }

    .pd-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 20px;
      background: white;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      color: #444;
      line-height: 1.6;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pd-feature-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      border-color: rgba(4,72,168,0.1);
    }

    .pd-case-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 10px 40px rgba(0,0,0,0.02);
      margin-bottom: 32px;
    }

    /* Related card */
    .pd-related-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pd-related-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }
  `}</style>
);

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
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=85'
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
  <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#0448a8]/20 border-t-[#0448a8] animate-spin" />
      <p style={{ fontFamily: 'Inter, sans-serif' }} className="text-[#888] text-sm tracking-widest uppercase text-xs font-bold">
        Loading project
      </p>
    </div>
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
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center gap-5 px-6">
        <FontStyles />
        <h2 className="pd-font-headline text-3xl text-[#111] uppercase tracking-tight">Project not found</h2>
        <p className="pd-font-inter text-[#888] text-base">This project doesn't exist or has been removed.</p>
        <Link to="/works" className="pd-cta-primary">Back to Works</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] selection:bg-[#0448a8] selection:text-white">
      <FontStyles />

      {/* ── HERO ── */}
      <section className="relative bg-white border-b border-black/[0.05] pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
          
          {/* Back nav */}
          <div className="mb-10">
            <button onClick={() => navigate(-1)} className="pd-back-btn">
              <ArrowLeft size={14} className="pd-back-arrow" />
              All Projects
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Eyebrow */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="pd-font-inter text-[11px] font-bold tracking-[0.25em] uppercase text-[#0448a8] bg-[#0448a8]/10 px-3 py-1.5 rounded-md">
                  {project.category}
                </span>
                {project.year && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[#ccc]" />
                    <span className="pd-font-inter text-[11px] font-bold tracking-[0.2em] uppercase text-[#888]">
                      {project.year}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="pd-font-headline text-5xl md:text-6xl lg:text-7xl text-[#111] tracking-tighter uppercase leading-[0.9] mb-6">
                {project.title}<span className="text-[#0448a8]">.</span>
              </h1>

              {/* Short description */}
              <p className="pd-font-inter text-[#555] text-lg md:text-xl leading-relaxed max-w-xl mb-10">
                {project.shortDescription}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pd-cta-primary">
                    View Live Site <ExternalLink size={16} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="pd-cta-secondary">
                    Source Code <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-black/[0.04]">
                {heroImg ? (
                  <img src={heroImg} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#E8E8E8] flex items-center justify-center">
                    <span className="pd-font-headline text-5xl text-[#ccc]">{project.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24">
        
        {/* Left: Sidebar Meta & Tech Stack */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="sticky top-28 space-y-8">
            
            <div className="bg-white rounded-3xl border border-black/[0.05] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <h3 className="pd-font-headline text-xl uppercase tracking-wider mb-6 text-[#111]">Project Info</h3>
              
              {project.role && (
                <div className="pd-meta-row" style={{ paddingTop: 0 }}>
                  <span className="pd-meta-label">Role</span>
                  <span className="pd-meta-value">{project.role}</span>
                </div>
              )}
              {project.timeline && (
                <div className="pd-meta-row">
                  <span className="pd-meta-label">Timeline</span>
                  <span className="pd-meta-value">{project.timeline}</span>
                </div>
              )}
              {project.category && (
                <div className="pd-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span className="pd-meta-label">Category</span>
                  <span className="pd-meta-value">{project.category}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-black/[0.05] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <TechnologiesUsed technologies={project.techStack} />
            </div>

          </div>
        </div>

        {/* Right: Case Study Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-10">

          {/* Project Objective */}
          <ProjectObjective objective={project.problem || project.objective} />

          {/* Case Study: Solution, Results, Features */}
          <ProjectCaseStudy
            solution={project.solution || project.description || project.fullDescription}
            results={project.results}
            features={project.features}
          />

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="pt-8">
              <h2 className="pd-font-headline text-2xl uppercase tracking-wider text-[#111] mb-8">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gallery.map((src, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${i === 0 && gallery.length % 2 !== 0 ? 'sm:col-span-2' : ''}`}>
                    <img src={src?.url || src} alt={`Gallery ${i + 1}`} className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── RELATED PROJECTS ── */}
      {related.length > 0 && (
        <div className="pd-related bg-white border-t border-black/[0.05] py-20 md:py-28">
          <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="pd-font-inter text-[11px] font-bold tracking-[0.3em] uppercase text-[#888] mb-3">
                  Keep Exploring
                </p>
                <h2 className="pd-font-headline text-3xl md:text-5xl text-[#111] tracking-tighter uppercase">
                  Related Projects<span className="text-[#0448a8]">.</span>
                </h2>
              </div>
              <Link to="/works"
                    className="pd-cta-secondary hidden md:flex">
                View All Work
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rp, i) => {
                const rSlug = rp.slug || rp._id;
                const rImg  = rp.image?.url || rp.heroImage;
                return (
                  <Link key={rp._id || i} to={`/works/${rSlug}`} className="block">
                    <div className="pd-related-card bg-[#F9FAFB] rounded-[24px] border border-black/[0.05] overflow-hidden">
                      <div className="w-full aspect-[4/3] bg-[#E0E0E0] overflow-hidden">
                        {rImg
                          ? <img src={rImg} alt={rp.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <span className="pd-font-headline text-4xl text-[#ccc]">{rp.title.charAt(0)}</span>
                            </div>
                        }
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="pd-font-inter text-xs font-bold uppercase tracking-wider text-[#0448a8]">{rp.category}</p>
                          <ArrowUpRight size={18} className="text-[#888]" />
                        </div>
                        <h3 className="pd-font-headline text-xl text-[#111]">{rp.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center md:hidden">
              <Link to="/works" className="pd-cta-secondary w-full justify-center">
                All Projects
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      <div className="bg-[#111] py-20 md:py-28 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0448a8]/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-24 text-center relative z-10">
          <p className="pd-font-inter text-[12px] font-bold tracking-[0.3em] uppercase text-white/50 mb-6">
            Next step
          </p>
          <h2 className="pd-font-headline text-4xl md:text-6xl text-white tracking-tighter uppercase leading-[1.1] mb-10">
            Have an idea?<br/>Let's build it together<span className="text-[#0448a8]">.</span>
          </h2>
          <a href="/contact" className="pd-cta-primary text-base px-10 py-5">
            Get In Touch <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );

};

export default ProjectDetails;