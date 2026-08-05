import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Nav from './Nav';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (!mediaQuery.matches) {
        setIsSidebarOpen(false);
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F4F4] text-md-on-background relative font-sans selection:bg-[#4F46E5] selection:text-white">
      {/* Global Soft Grain Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")', backgroundRepeat: 'repeat' }}
      ></div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full min-w-0 transition-all duration-300">
        <Nav
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto min-w-0 liquid-glass rounded-3xl p-6 md:p-8 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
