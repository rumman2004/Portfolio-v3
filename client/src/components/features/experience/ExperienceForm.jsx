import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Textarea from '../../UI/Textarea';
import Button from '../../UI/Button';

const ExperienceForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
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
      <Input label="Job Title" name="position" value={formData.position} onChange={handleChange} required placeholder="e.g. Frontend Developer" />
      <Input label="Company" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Google" />
      <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Start Date" type="month" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <Input label="End Date" type="month" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Leave blank if current" />
      </div>

      <Textarea label="Description / Responsibilities" name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe your key achievements..." />

      <div className="flex justify-end pt-4 border-t border-white">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Experience' : 'Add Experience'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
