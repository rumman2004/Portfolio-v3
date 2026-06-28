import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import SettingsFeature from '../../components/features/admin/settings';

const SettingsPage = () => {
  return (
    <AdminLayout>
      <SettingsFeature />
    </AdminLayout>
  );
};

export default SettingsPage;
