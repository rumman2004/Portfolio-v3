import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

import IconPicker from '../../common/IconPicker';

const SocialLinkForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleIconSelect = (iconName) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Platform Name" name="platform" value={formData.platform} onChange={handleChange} required placeholder="e.g. GitHub" />
      <Input label="URL" type="url" name="url" value={formData.url} onChange={handleChange} required placeholder="https://github.com/..." />
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 ml-1 tracking-wide">Social Icon</label>
        <IconPicker onSelect={handleIconSelect} selectedImage={formData.icon} category="social" />
        <Input name="icon" value={formData.icon} onChange={handleChange} placeholder="Icon key name" className="mt-2" />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Link' : 'Add Link'}
        </Button>
      </div>
    </form>
  );
};

export default SocialLinkForm;
