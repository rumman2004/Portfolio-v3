import React, { lazy, Suspense } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Admin Pages
const Login = lazy(() => import('../pages/admin/Login'));
const HomeDashboard = lazy(() => import('../pages/admin/HomeDashboard'));
const Profile = lazy(() => import('../pages/admin/Profile'));
const Certificates = lazy(() => import('../pages/admin/Cerificates')); // NOTE: Spelled Cerificates.jsx
const Education = lazy(() => import('../pages/admin/Eduction')); // NOTE: Spelled Eduction.jsx
const Experience = lazy(() => import('../pages/admin/Experience'));
const Hackathon = lazy(() => import('../pages/admin/Hackathon'));
const ProjectWorks = lazy(() => import('../pages/admin/ProjectWorks'));
const Skills = lazy(() => import('../pages/admin/Skills'));
const SocialMedia = lazy(() => import('../pages/admin/SocialMedia'));
const Messages = lazy(() => import('../pages/admin/Messages'));
const Settings = lazy(() => import('../pages/admin/Settings'));

const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const AdminRouteFallback = () => (
  <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center px-6 py-16">
    <div className="max-w-md text-center liquid-glass rounded-3xl p-8 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-md-primary mb-3">Admin area</p>
      <h1 className="text-3xl font-bold text-md-on-surface mb-3">Page not found</h1>
      <p className="text-md-on-surface-variant mb-6">That admin destination does not exist.</p>
      <Link
        to="/admin"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-md-primary px-6 py-3 text-sm font-bold text-md-on-primary hover:opacity-90"
      >
        Return to dashboard
      </Link>
    </div>
  </div>
);

const AdminRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Admin Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/projects" element={<ProjectWorks />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<AdminRouteFallback />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
