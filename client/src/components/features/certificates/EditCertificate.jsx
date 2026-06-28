import React, { useState } from 'react';
import CertificateForm from './CertificateForm';
import { certificateServices } from '../../../services/certificateServices';

const EditCertificate = ({ certificate, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await certificateServices.update(certificate._id || certificate.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      <CertificateForm initialData={certificate} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
};

export default EditCertificate;
