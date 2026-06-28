import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import Textarea from '../../UI/Textarea';
import { Upload, X } from 'lucide-react';
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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
        projectId: initialData.projectId || '',
        isFeatured: initialData.isFeatured || false,
        date: initialData.date ? initialData.date.substring(0, 7) : ''
      });
      if (initialData.image) setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'technologies') {
        const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
        techArray.forEach(t => data.append('technologies[]', t));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.append('image', imageFile);
    }
    
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
        <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1 tracking-wide">Tech Stack Icons</label>
        <div className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto p-4 bg-[#f8fafc] rounded-xl border border-gray-200 shadow-inner">
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
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  isSelected 
                    ? 'bg-blue-500 shadow-inner ring-2 ring-blue-500 scale-95' 
                    : 'bg-white border border-gray-200 hover:border-gray-400 shadow-sm'
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
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 ml-1 tracking-wide">Linked Project</label>
        <select 
          name="projectId" 
          value={formData.projectId} 
          onChange={handleChange} 
          className="w-full bg-[#e6edf5] rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#c8d0da,inset_-4px_-4px_8px_#ffffff] border-none font-inter"
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
          className="w-5 h-5 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-white shadow-sm" 
        />
        <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-600 cursor-pointer">
          Featured Hackathon
        </label>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 ml-1 tracking-wide">Hackathon Image</label>
        <div className="bg-[#f8fafc] border border-gray-200 shadow-inner rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {imagePreview ? (
            <div className="relative w-full h-40 group">
              <img src={imagePreview} alt="preview" className="w-full h-full object-contain rounded-lg" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center text-gray-400">
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-medium">Click to upload image</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
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
