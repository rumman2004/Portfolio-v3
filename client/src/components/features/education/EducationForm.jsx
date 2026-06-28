import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

const EducationForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 7) : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 7) : '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Degree / Certificate" name="degree" value={formData.degree} onChange={handleChange} required placeholder="e.g. B.Sc. Computer Science" />
      <Input label="Institution" name="institution" value={formData.institution} onChange={handleChange} required placeholder="e.g. XYZ University" />
      <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. City, Country" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Start Date" type="month" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <Input label="End Date" type="month" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Leave blank if currently studying" />
      </div>

      <div className="w-full">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-600 mb-2 ml-1 tracking-wide">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Briefly describe what you studied..."
          className="w-full bg-[#e6edf5] rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#c8d0da,inset_-4px_-4px_8px_#ffffff] border-none resize-y"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Education' : 'Add Education'}
        </Button>
      </div>
    </form>
  );
};

export default EducationForm;
