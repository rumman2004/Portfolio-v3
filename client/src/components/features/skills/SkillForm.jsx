import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import IconPicker from '../../common/IconPicker';

const SkillForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: '',
    isFeatured: false,
    order: 0
  });

  const categories = ['Programming Language', 'Frontend', 'Server', 'Database', 'Tools', 'AI', 'DevOps', 'Apps'];

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageSelect = (iconUrl) => {
    setFormData({ ...formData, icon: iconUrl });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Skill Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. React" />
      
      <div>
        <label className="block text-sm font-semibold text-md-on-surface-variant mb-2 ml-1 tracking-wide">Category</label>
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          required 
          className="w-full bg-md-surface rounded-3xl px-4 py-3 text-md-on-surface placeholder-gray-400 focus:outline-none transition-all duration-300 border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary font-inter"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-md-on-surface-variant mb-2 ml-1 tracking-wide">Icon / Image</label>
        <IconPicker onSelect={handleImageSelect} selectedImage={formData.icon} category="skill" />
        <Input name="icon" value={formData.icon} onChange={handleChange} placeholder="Or paste image URL here" className="mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Order (Sorting)" type="number" name="order" value={formData.order} onChange={handleChange} placeholder="0" />
        <div className="flex items-center gap-3 pt-8">
          <input 
            type="checkbox" 
            id="isFeatured" 
            name="isFeatured" 
            checked={formData.isFeatured} 
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 bg-md-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-white shadow-sm" 
          />
          <label htmlFor="isFeatured" className="text-sm font-semibold text-md-on-surface-variant cursor-pointer">
            Featured Skill
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Skill' : 'Add Skill'}
        </Button>
      </div>
    </form>
  );
};

export default SkillForm;

