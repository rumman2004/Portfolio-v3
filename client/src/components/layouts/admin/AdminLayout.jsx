import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Nav from './Nav';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      setIsSidebarOpen(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FB] text-[#111827] relative font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full min-w-0 transition-all duration-300">
        <Nav
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
