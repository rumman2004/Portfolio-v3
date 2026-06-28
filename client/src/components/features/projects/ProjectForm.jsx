import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Textarea from '../../UI/Textarea';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { iconMap } from '../../../utils/iconMap';

const ProjectForm = ({ initialData, onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '', category: 'Web App', shortDescription: '', description: '',
    liveUrl: '', githubUrl: '', techStack: '', role: '', timeline: '', 
    problem: '', solution: '', results: '', featured: false
  });

  const categories = ['Web App', 'Mobile App', 'UI / UX', 'Branding', 'Backend', 'Other'];

  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Web App',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        liveUrl: initialData.liveUrl || '',
        githubUrl: initialData.githubUrl || '',
        techStack: initialData.techStack?.join(', ') || '',
        role: initialData.role || '',
        timeline: initialData.timeline || '',
        problem: initialData.problem || '',
        solution: initialData.solution || '',
        results: initialData.results || '',
        featured: initialData.featured || false
      });
      if (initialData.heroImage) setHeroPreview(initialData.heroImage);
      if (initialData.gallery) setExistingGallery(initialData.gallery);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleHeroChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (galleryFiles.length + existingGallery.length + files.length > 3) {
      alert("Maximum 3 images allowed in gallery!");
      return;
    }
    setGalleryFiles([...galleryFiles, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setGalleryPreviews([...galleryPreviews, ...previews]);
  };

  const removeGalleryFile = (index) => {
    const newFiles = [...galleryFiles];
    newFiles.splice(index, 1);
    setGalleryFiles(newFiles);

    const newPreviews = [...galleryPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
  };

  const removeExistingGallery = (index) => {
    const newEx = [...existingGallery];
    newEx.splice(index, 1);
    setExistingGallery(newEx);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (heroFile) data.append('heroImage', heroFile);
    galleryFiles.forEach(file => data.append('gallery', file));
    existingGallery.forEach(url => data.append('existingGallery', url));

    onSubmit(data);
  };

  // Neumorphic Inner classes
  const insetClass = "bg-[#e6edf5] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] rounded-2xl p-4";
  const dropClass = "bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] rounded-2xl p-6";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className={dropClass}>
        <h3 className="font-bold text-gray-700 mb-4 tracking-wide uppercase text-xs">Basic Info</h3>
        <div className="space-y-4">
          <Input label="Project Title" name="title" value={formData.title} onChange={handleChange} required />
          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1 uppercase">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              className="w-full bg-[#f4f7fb] text-gray-800 rounded-xl px-4 py-3 border-none shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="featured" 
              name="featured" 
              checked={formData.featured} 
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" 
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
              Featured Project
            </label>
          </div>

          <Input label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Live URL" type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} />
            <Input label="GitHub URL" type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
          </div>
          
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 uppercase">Tech Stack Icons</label>
            <div className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto p-4 bg-[#f4f7fb] rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff]">
              {Object.keys(iconMap).map(key => {
                const selectedTechs = formData.techStack ? formData.techStack.split(',').map(t => t.trim()).filter(Boolean) : [];
                const isSelected = selectedTechs.includes(key);
                
                const toggleTech = (k) => {
                  let newTechs = [...selectedTechs];
                  if (isSelected) {
                    newTechs = newTechs.filter(t => t !== k);
                  } else {
                    newTechs.push(k);
                  }
                  setFormData({ ...formData, techStack: newTechs.join(', ') });
                };

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleTech(key)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected 
                        ? 'bg-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] scale-95' 
                        : 'bg-[#e6edf5] shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#c8d0da,-2px_-2px_4px_#ffffff]'
                    }`}
                    title={key}
                  >
                    <img src={iconMap[key]} alt={key} className={`w-6 h-6 object-contain ${isSelected ? 'brightness-0 invert' : ''}`} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1 break-words">Selected keys: {formData.techStack}</p>
          </div>
        </div>
      </div>

      <div className={dropClass}>
        <h3 className="font-bold text-gray-700 mb-4 tracking-wide uppercase text-xs">Images</h3>
        
        {/* Hero Image */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Hero Image</label>
          <div className={insetClass + " flex flex-col items-center justify-center relative overflow-hidden"}>
            {heroPreview ? (
              <div className="relative w-full h-40 group">
                <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover rounded-xl" />
                <button type="button" onClick={() => { setHeroFile(null); setHeroPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center text-gray-400">
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-medium">Click to upload hero image</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleHeroChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Gallery (Max 3)</label>
          <div className={insetClass + " relative flex items-center justify-center mb-4 min-h-[100px]"}>
            <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="flex items-center gap-2 text-gray-400">
              <ImageIcon size={20} /> <span className="text-sm font-medium">Add Gallery Images</span>
            </div>
          </div>
          
          {(galleryPreviews.length > 0 || existingGallery.length > 0) && (
            <div className="grid grid-cols-3 gap-3">
              {existingGallery.map((url, i) => (
                <div key={`ex-${i}`} className="relative h-24 rounded-xl overflow-hidden shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff]">
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingGallery(i)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                </div>
              ))}
              {galleryPreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative h-24 rounded-xl overflow-hidden shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff]">
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryFile(i)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={dropClass}>
        <h3 className="font-bold text-gray-700 mb-4 tracking-wide uppercase text-xs">Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Your Role" name="role" value={formData.role} onChange={handleChange} />
            <Input label="Timeline" name="timeline" value={formData.timeline} onChange={handleChange} />
          </div>
          <Textarea label="Problem/Objective" name="problem" rows={3} value={formData.problem} onChange={handleChange} />
          <Textarea label="Solution" name="solution" rows={3} value={formData.solution} onChange={handleChange} />
          <Textarea label="Results/Impact" name="results" rows={3} value={formData.results} onChange={handleChange} />
          <Textarea label="Full Description" name="description" rows={5} value={formData.description} onChange={handleChange} />
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full md:w-[600px] bg-[#e6edf5] p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-white flex justify-end gap-4 z-50">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-500 shadow-[4px_4px_10px_rgba(59,130,246,0.3)] hover:bg-blue-600 active:scale-95 transition-all">
          {loading ? 'Saving...' : (initialData ? 'Update Project' : 'Publish Project')}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
