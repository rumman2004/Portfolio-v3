import React, { useState } from 'react';
import SkillForm from './SkillForm';
import { skillServices } from '../../../services/skillServices';

const EditSkill = ({ skill, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await skillServices.update(skill._id || skill.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <SkillForm initialData={skill} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
};

export default EditSkill;
