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
        className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply z-[0]"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")', backgroundRepeat: 'repeat' }}
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
