import React, { useCallback, useEffect, useState } from 'react';
import Input from '../../UI/Input';
import Textarea from '../../UI/Textarea';
import Button from '../../UI/Button';
import Card from '../../UI/Card';
import PageHeader from '../../common/PageHeader';
import { publicServices } from '../../../services/publicServices';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    shortBio: '',
    about: '',
    profileImage: '',
    heroImage: '',
    resumeUrl: '',
    isAvailable: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await publicServices.getProfile();
      if (data) {
        setFormData({
          name: data.name || '',
          role: data.role || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          headline: data.headline || '',
          shortBio: data.shortBio || '',
          about: data.about || '',
          profileImage: data.profileImage || '',
          heroImage: data.heroImage || '',
          resumeUrl: data.resumeUrl || '',
          isAvailable: data.isAvailable ?? true,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await publicServices.updateProfile(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <PageHeader 
        title="Settings & Profile" 
        description="Manage your portfolio's public profile information and display settings."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Settings Form */}
        <div className="xl:col-span-2 space-y-8">
          
          {message && (
            <div className={`p-4 rounded-xl border font-medium flex items-center shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Info */}
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Role / Job Title" name="role" value={formData.role} onChange={handleChange} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                <div className="md:col-span-2">
                  <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                </div>
              </div>
            </Card>

            {/* Content & Bio */}
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Content & Bio</h3>
              <div className="space-y-6">
                <Textarea label="Headline (Hero Section)" name="headline" rows={2} value={formData.headline} onChange={handleChange} required />
                <Textarea label="Short Bio (Footer / Brief)" name="shortBio" rows={3} value={formData.shortBio} onChange={handleChange} />
                <Textarea label="Full About Text" name="about" rows={6} value={formData.about} onChange={handleChange} />
              </div>
            </Card>

            {/* Media & URLs */}
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Media & Documents</h3>
              <div className="space-y-6">
                <Input label="Avatar Image URL (Optional)" name="profileImage" placeholder="https://..." value={formData.profileImage} onChange={handleChange} />
                <Input label="Hero Image URL (Optional)" name="heroImage" placeholder="https://..." value={formData.heroImage} onChange={handleChange} />
                <Input label="Resume Document URL (PDF Link)" type="url" name="resumeUrl" placeholder="https://..." value={formData.resumeUrl} onChange={handleChange} />
              </div>
            </Card>
          </form>
        </div>

        {/* Sidebar / Actions */}
        <div className="xl:col-span-1 space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Publish & Status</h3>
            
            <div className="mb-6 flex items-center gap-3 p-4 bg-[#f8fafc] rounded-xl border border-gray-200 shadow-sm">
              <input 
                type="checkbox" 
                id="isAvailable" 
                name="isAvailable" 
                checked={formData.isAvailable} 
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-white shadow-sm" 
              />
              <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Available for Hire
              </label>
            </div>

            <Button type="submit" form="settings-form" variant="primary" className="w-full" isLoading={saving}>
              Save All Changes
            </Button>
          </Card>

          {/* Preview Image Card (Optional visual helper) */}
          {(formData.profileImage || formData.heroImage) && (
            <Card className="p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Image Previews</h3>
              <div className="space-y-4">
                {formData.profileImage && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">Avatar</p>
                    <img src={formData.profileImage} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                  </div>
                )}
                {formData.heroImage && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">Hero Image</p>
                    <img src={formData.heroImage} alt="Hero Preview" className="w-full h-32 rounded-lg object-cover border border-gray-200" />
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;
