import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import Textarea from '../../UI/Textarea';
import Button from '../../UI/Button';
import Card from '../../UI/Card';
import { toast } from 'react-hot-toast';
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
    try {
      await api.put('/admin/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl p-6 md:p-8">
      <h2 className="text-2xl font-headline text-gray-800 tracking-tight mb-6">Edit Profile Info</h2>
      
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
