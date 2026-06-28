import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import HackathonsList from '../../components/features/hackathon/HackathonsList';

const HackathonPage = () => {
  return (
    <AdminLayout>
      <HackathonsList />
    </AdminLayout>
  );
};

export default HackathonPage;
