import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import Textarea from '../../UI/Textarea';
import { useFetch } from '../../../hooks/useFetch';
import { iconMap } from '../../../utils/iconMap';

const HackathonForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    achievement: '',
    date: '',
    technologies: '',
    description: '',
    link: '',
    projectId: '',
    isFeatured: false
  });
  // Fetch projects for the dropdown
  const { data: projectsData } = useFetch('/projects');
  const projects = Array.isArray(projectsData) ? projectsData : (projectsData?.data || []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        technologies: initialData.technologies?.join(', ') || '',
        organization: initialData.organization || '',
        description: initialData.description || '',
        link: initialData.link || '',
        projectId: initialData.projectId?._id || (typeof initialData.projectId === 'string' ? initialData.projectId : ''),
        isFeatured: initialData.isFeatured || false,
        date: initialData.date ? initialData.date.substring(0, 7) : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const data = {
      ...formData,
      technologies: techArray
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Hackathon Name" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Global AI Hackathon" />
        <Input label="Organization" name="organization" value={formData.organization} onChange={handleChange} placeholder="e.g. Devfolio" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Rank / Placement" name="achievement" value={formData.achievement} onChange={handleChange} required placeholder="e.g. 1st Place, Finalist" />
        <Input label="Date" type="month" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      
      <Input label="External Link" type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />

      <div className="mt-4">
        <label className="block text-sm font-semibold text-md-on-surface-variant mb-2 ml-1 tracking-wide">Tech Stack Icons</label>
        <div className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto p-4 bg-[#f8fafc] rounded-3xl border border-gray-200 shadow-inner">
          {Object.keys(iconMap).map(key => {
            const selectedTechs = formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
            const isSelected = selectedTechs.includes(key);
            
            const toggleTech = (k) => {
              let newTechs = [...selectedTechs];
              if (isSelected) {
                newTechs = newTechs.filter(t => t !== k);
              } else {
                newTechs.push(k);
              }
              setFormData({ ...formData, technologies: newTechs.join(', ') });
            };

            return (
              <button
                type="button"
                key={key}
                onClick={() => toggleTech(key)}
                className={`w-10 h-10 rounded-3xl flex items-center justify-center transition-all flex-shrink-0 ${
                  isSelected 
                    ? 'bg-blue-500 shadow-inner ring-2 ring-blue-500 scale-95' 
                    : 'bg-md-surface border border-gray-200 hover:border-gray-400 shadow-sm'
                }`}
                title={key}
              >
                <img src={iconMap[key]} alt={key} className={`w-6 h-6 object-contain ${isSelected ? 'brightness-0 invert' : ''}`} />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2 ml-1 break-words">Selected: {formData.technologies || 'None'}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-md-on-surface-variant mb-1.5 ml-1 tracking-wide">Linked Project</label>
        <select 
          name="projectId" 
          value={formData.projectId} 
          onChange={handleChange} 
          className="w-full bg-md-surface rounded-3xl px-4 py-3 text-md-on-surface placeholder-gray-400 focus:outline-none transition-all duration-300 border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary font-inter"
        >
          <option value="">-- None --</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      <Textarea label="Description" name="description" rows={3} value={formData.description} onChange={handleChange} />

      <div className="flex items-center gap-3 pt-2">
        <input 
          type="checkbox" 
          id="isFeatured" 
          name="isFeatured" 
          checked={formData.isFeatured} 
          onChange={handleChange}
          className="w-5 h-5 rounded border-gray-300 bg-md-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-white shadow-sm" 
        />
        <label htmlFor="isFeatured" className="text-sm font-semibold text-md-on-surface-variant cursor-pointer">
          Featured Hackathon
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Hackathon' : 'Add Hackathon'}
        </Button>
      </div>
    </form>
  );
};

export default HackathonForm;


