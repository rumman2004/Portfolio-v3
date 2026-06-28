import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import ProjectsList from '../../components/features/projects/ProjectsList';

const ProjectWorksPage = () => {
  return (
    <AdminLayout>
      <ProjectsList />
    </AdminLayout>
  );
};

export default ProjectWorksPage;
