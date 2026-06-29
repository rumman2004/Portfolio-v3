import React, { useCallback, useEffect, useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { projectServices } from '../../../services/projectServices';
import { Plus, Edit2, Trash2, LayoutGrid, List, ExternalLink, Loader, X, ImageIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import EditProject from './EditProject';

const ProjectsList = () => {
  const { data: projects, loading, refetch } = useFetch('/projects/admin/all');
  
  const [viewMode, setViewMode] = useState('grid');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' or 'edit'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const openAddDrawer = () => {
    setDrawerMode('add');
    setSelectedProject(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (project) => {
    setDrawerMode('edit');
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => { setSelectedProject(null); setDrawerMode('add'); }, 300);
  }, []);

  // Close drawer on esc
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeDrawer]);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await projectServices.create(formData);
      toast.success('Project added successfully!');
      closeDrawer();
      refetch();
    } catch (err) {
      toast.error('Failed to add project');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectServices.delete(id);
        toast.success('Project deleted successfully!');
        refetch();
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

  const dropClass = "bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] rounded-2xl";
  const insetClass = "bg-[#e6edf5] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] rounded-2xl p-4";
  const btnClass = "flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-500 shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff] transition-all";
  
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#e6edf5] text-gray-700 p-6 md:p-8 font-inter relative overflow-hidden rounded-tl-3xl rounded-bl-3xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline text-gray-800 tracking-tight mb-2">Projects</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your portfolio projects and case studies.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#e6edf5] p-1 rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff]">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#e6edf5] shadow-[2px_2px_5px_#c8d0da,-2px_-2px_5px_#ffffff] text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#e6edf5] shadow-[2px_2px_5px_#c8d0da,-2px_-2px_5px_#ffffff] text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={openAddDrawer}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-500 shadow-[4px_4px_10px_rgba(59,130,246,0.3)] hover:bg-blue-600 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : projects?.length === 0 ? (
        <div className={insetClass + " py-20 flex flex-col items-center text-center max-w-2xl mx-auto"}>
          <div className="w-16 h-16 bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] rounded-2xl flex items-center justify-center mb-4">
            <LayoutGrid size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No projects yet</h3>
          <p className="text-gray-500 text-sm">Click "Add Project" to create your first portfolio case study.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12" : "flex flex-col gap-6 pb-12"}>
          {projects?.map(proj => (
            <div key={proj._id} className={dropClass + ` overflow-hidden ${viewMode === 'list' ? 'flex flex-row items-center p-4' : 'flex flex-col p-5'}`}>
              
              {/* Image Thumbnail */}
              <div className={`${viewMode === 'list' ? 'w-32 h-24 mr-6 shrink-0' : 'w-full h-48 mb-5'} rounded-xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]`}>
                {proj.heroImage ? (
                  <img src={proj.heroImage} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#e6edf5] flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={24} className="opacity-50" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 flex ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col'}`}>
                <div className={viewMode === 'list' ? 'flex-1 pr-6' : ''}>
                  <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{proj.title}</h3>
                  {viewMode === 'grid' && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{proj.shortDescription}</p>
                  )}
                  <div className={`flex flex-wrap gap-2 ${viewMode === 'grid' ? 'mb-4' : ''}`}>
                    {proj.techStack?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs font-semibold px-2 py-1 bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff] rounded-md text-blue-600">
                        {tech}
                      </span>
                    ))}
                    {proj.techStack?.length > 3 && <span className="text-xs font-semibold px-2 py-1 bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff] rounded-md text-gray-500">+{proj.techStack.length - 3}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-3 shrink-0 ${viewMode === 'list' ? '' : 'mt-auto pt-4 border-t border-white/50'}`}>
                  <button onClick={() => openEditDrawer(proj)} className={btnClass} title="Edit Project">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(proj._id)} className={btnClass + " hover:text-red-500"} title="Delete Project">
                    <Trash2 size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={btnClass} title="Live Preview">
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className={btnClass} title="Source Code">
                      <FaGithub size={16} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />

      {/* Side Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#e6edf5] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-headline text-gray-800 tracking-tight">
              {drawerMode === 'add' ? 'Add New Project' : 'Edit Project'}
            </h2>
            <button 
              onClick={closeDrawer}
              className="p-2 bg-[#e6edf5] shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] rounded-full text-gray-500 hover:text-red-500 active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {isDrawerOpen && drawerMode === 'add' && (
            <ProjectForm onSubmit={handleAddSubmit} loading={isAdding} onCancel={closeDrawer} />
          )}

          {isDrawerOpen && drawerMode === 'edit' && selectedProject && (
            <EditProject project={selectedProject} onClose={closeDrawer} onUpdated={refetch} />
          )}
        </div>
      </div>

    </div>
  );
};

export default ProjectsList;
