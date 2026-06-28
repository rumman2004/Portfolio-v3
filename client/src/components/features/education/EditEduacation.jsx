import React, { useState } from 'react';
import EducationForm from './EducationForm';
import { educationServices } from '../../../services/educationServices';

const EditEduacation = ({ education, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await educationServices.update(education._id || education.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update education record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <EducationForm initialData={education} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
};

export default EditEduacation;
