import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 
        All paths starting with /admin/* will be routed to AdminRoutes.
        This includes /admin/login and /admin (which redirects to dashboard)
      */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* All other paths will fall back to PublicRoutes */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
