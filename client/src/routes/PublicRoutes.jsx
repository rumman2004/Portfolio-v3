import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layouts/public/PublicLayout';

// Helper to artificially delay the import so the loader animation has time to play
const lazyWithDelay = (importFunc, delay = 300) => {
  return lazy(async () => {
    const [module] = await Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, delay))
    ]);
    return module;
  });
};

// Lazy-loaded pages with a guaranteed minimum loading time
const Home           = lazyWithDelay(() => import('../pages/public/Home'));
const About          = lazyWithDelay(() => import('../pages/public/About'));
const Works          = lazyWithDelay(() => import('../pages/public/Works'));
const ProjectDetails = lazyWithDelay(() => import('../pages/public/ProjectDetails'));
const Contact        = lazyWithDelay(() => import('../pages/public/Contact'));

/* ─────────────────────────────────────────────────────────────
   FALLBACK LOADER
   Matches the portfolio's light #F4F4F4 bg so there's no
   flash-of-dark-background on lazy load.
──────────────────────────────────────────────────────────────*/
import Loader from '../components/UI/Loader';

const PublicRoutes = () => (
  <Suspense fallback={<Loader fullScreen={true} />}>
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