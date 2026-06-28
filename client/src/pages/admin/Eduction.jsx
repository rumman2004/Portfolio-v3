import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import EducationList from '../../components/features/education/EducationList';

const EducationPage = () => {
  return (
    <AdminLayout>
      <EducationList />
    </AdminLayout>
  );
};

export default EducationPage;
