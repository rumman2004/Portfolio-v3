import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';

const PublicLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen relative bg-[#F4F4F4] selection:bg-[#4F46E5] selection:text-white">
      {/* Global Soft Grain Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.4] mix-blend-multiply z-[0]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Nav />
        <main className="flex-grow min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
