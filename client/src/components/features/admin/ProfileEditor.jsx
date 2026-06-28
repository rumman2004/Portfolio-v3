import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Textarea from '../../UI/Textarea';
import Button from '../../UI/Button';
import Card from '../../UI/Card';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api'; 

const ProfileEditor = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/admin/profile', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl p-6 md:p-8">
      <h2 className="text-2xl font-headline text-gray-800 tracking-tight mb-6">Edit Profile Info</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-xl border font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Professional Title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
        
        <Textarea label="Biography" name="bio" rows={5} value={formData.bio} onChange={handleChange} required />

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileEditor;
