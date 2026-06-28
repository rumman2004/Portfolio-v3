import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import MessagesInbox from '../../components/features/contact/MessagesInbox';

const MessagesPage = () => {
  return (
    <AdminLayout>
      <MessagesInbox />
    </AdminLayout>
  );
};

export default MessagesPage;
