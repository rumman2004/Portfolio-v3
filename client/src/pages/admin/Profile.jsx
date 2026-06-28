import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import ProfileEditor from '../../components/features/admin/ProfileEditor';

const Profile = () => {
  return (
    <AdminLayout>
      <ProfileEditor />
    </AdminLayout>
  );
};

export default Profile;
