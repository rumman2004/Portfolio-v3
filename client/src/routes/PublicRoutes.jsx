import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layouts/public/PublicLayout';

// Lazy-loaded pages
const Home          = lazy(() => import('../pages/public/Home'));
const About         = lazy(() => import('../pages/public/About'));
const Works         = lazy(() => import('../pages/public/Works'));
const ProjectDetails = lazy(() => import('../pages/public/ProjectDetails'));
const Contact       = lazy(() => import('../pages/public/Contact'));

/* ─────────────────────────────────────────────────────────────
   FALLBACK LOADER
   Matches the portfolio's light #F7F7F7 bg so there's no
   flash-of-dark-background on lazy load.
──────────────────────────────────────────────────────────────*/
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#F7F7F7',
      gap: 16,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '2px solid rgba(4,72,168,0.15)',
        borderTopColor: '#0448a8',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const PublicRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/about"      element={<About />} />
        <Route path="/works"      element={<Works />} />
        <Route path="/works/:id"  element={<ProjectDetails />} />
        <Route path="/contact"    element={<Contact />} />
      </Route>
    </Routes>
  </Suspense>
);

export default PublicRoutes;