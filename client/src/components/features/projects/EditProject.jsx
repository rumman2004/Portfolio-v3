import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import { projectServices } from '../../../services/projectServices';
import { toast } from 'react-hot-toast';

const EditProject = ({ project, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      await projectServices.update(project._id || project.id, formData);
      toast.success('Project updated successfully!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProjectForm initialData={project} onSubmit={handleUpdate} loading={loading} onCancel={onClose} />
    </div>
  );
};

export default EditProject;
