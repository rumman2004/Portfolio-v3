import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import { projectServices } from '../../../services/projectServices';

const EditProject = ({ project, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await projectServices.update(project._id || project.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <ProjectForm initialData={project} onSubmit={handleUpdate} loading={loading} onCancel={onClose} />
    </div>
  );
};

export default EditProject;
