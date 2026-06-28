import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import ExperienceList from '../../components/features/experience/ExperienceList';

const ExperiencePage = () => {
  return (
    <AdminLayout>
      <ExperienceList />
    </AdminLayout>
  );
};

export default ExperiencePage;
