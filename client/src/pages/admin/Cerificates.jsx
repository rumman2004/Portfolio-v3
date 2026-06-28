import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import CertificatesList from '../../components/features/certificates/CertificatesList';

const CertificatesPage = () => {
  return (
    <AdminLayout>
      <CertificatesList />
    </AdminLayout>
  );
};

export default CertificatesPage;
