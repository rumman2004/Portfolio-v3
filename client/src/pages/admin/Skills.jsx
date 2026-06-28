import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import SkillsList from '../../components/features/skills/SkillsList';

const SkillsPage = () => {
  return (
    <AdminLayout>
      <SkillsList />
    </AdminLayout>
  );
};

export default SkillsPage;
