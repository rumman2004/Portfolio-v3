import React, { useState } from 'react';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { Upload, X } from 'lucide-react';
import { toMonthInputValue } from '../../../utils/payload';

const CertificateForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    issuer: initialData?.issuer || '',
    issuedAt: toMonthInputValue(initialData?.issuedAt),
    credentialId: initialData?.credentialId || '',
    credentialUrl: initialData?.credentialUrl || '',
    isFeatured: initialData?.isFeatured || false,
  }));

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => initialData?.image || null);
  const [removeImage, setRemoveImage] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    } else if (initialData && removeImage) {
      // Certificate updates accept an empty image value to clear an existing
      // URL when no replacement file is uploaded.
      data.append('image', '');
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Certificate Name" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. AWS Certified Solutions Architect" />
      <Input label="Issuing Organization" name="issuer" value={formData.issuer} onChange={handleChange} required placeholder="e.g. Amazon Web Services" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Issue Date" type="month" name="issuedAt" value={formData.issuedAt} onChange={handleChange} required />
        <Input label="Credential ID" name="credentialId" value={formData.credentialId} onChange={handleChange} placeholder="Optional" />
      </div>

      <Input label="Credential URL" type="url" name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} placeholder="https://..." />
      
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
          Featured Certificate
        </label>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-md-on-surface-variant mb-1.5 ml-1 tracking-wide">Certificate Image</label>
        <div className="bg-[#f8fafc] border border-gray-200 shadow-inner rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {imagePreview ? (
            <div className="relative w-full h-40 group">
              <img src={imagePreview} alt="Certificate preview" className="w-full h-full object-contain rounded-lg" />
               <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setRemoveImage(Boolean(initialData)); }} className="absolute top-2 right-2 z-20 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity" aria-label="Remove certificate image" title="Remove certificate image">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center text-gray-400">
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-medium">Click to upload image</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${imagePreview ? 'pointer-events-none' : ''}`} />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" isLoading={loading}>
          {initialData ? 'Update Certificate' : 'Add Certificate'}
        </Button>
      </div>
    </form>
  );
};

export default CertificateForm;

