import React, { useState } from 'react';
import HackathonForm from './HackathonForm';
import { hackathonServices } from '../../../services/hackathonServices';

const EditHackathon = ({ hackathon, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await hackathonServices.update(hackathon._id || hackathon.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <HackathonForm initialData={hackathon} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
};

export default EditHackathon;
