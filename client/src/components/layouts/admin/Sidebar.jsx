import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Code2, 
  GraduationCap, 
  Award, 
  MessageSquare, 
  Settings,
  Trophy,
  Share2,
  X,
  User
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
  { path: '/admin/projects', label: 'Projects', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/admin/skills', label: 'Skills', icon: <Code2 className="w-5 h-5" /> },
  { path: '/admin/education', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/admin/experience', label: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/admin/hackathon', label: 'Hackathons', icon: <Trophy className="w-5 h-5" /> },
  { path: '/admin/certificates', label: 'Certificates', icon: <Award className="w-5 h-5" /> },
  { path: '/admin/social-media', label: 'Social Links', icon: <Share2 className="w-5 h-5" /> },
  { path: '/admin/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/admin/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const isCollapsed = !isSidebarOpen;

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`h-screen bg-white border-r border-[#E5E7EB] flex flex-col fixed lg:relative left-0 top-0 z-50 transition-[width,transform] duration-300 ease-out shadow-[4px_0_24px_rgba(15,23,42,0.04)] overflow-hidden shrink-0
          ${isSidebarOpen ? 'w-72 sm:w-64 translate-x-0' : 'w-72 -translate-x-full lg:w-20 lg:translate-x-0'}
        `}
        aria-label="Admin navigation"
      >
        <div className={`h-20 flex items-center border-b border-gray-200/70 shrink-0 ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5 sm:px-6'}`}>
          <div className="min-w-0 text-xl font-extrabold text-[#1A1A1A]">
            {isCollapsed ? (
              <span aria-hidden="true">R<span className="text-[#0448a8]">.</span></span>
            ) : (
              <span>RUMMAN<span className="text-[#0448a8]">.</span>CMS</span>
            )}
            <span className="sr-only">Rumman CMS</span>
          </div>
          <button 
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-[#F3F4F6]"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              title={isCollapsed ? item.label : undefined}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              className={({ isActive }) =>
                `group flex min-h-11 items-center rounded-xl transition-all duration-200 font-medium ${
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                } ${
                  isActive 
                    ? 'bg-[#0448a8]/10 text-[#0448a8]' 
                    : 'text-[#4b5563] hover:text-[#1A1A1A] hover:bg-[#F6F8FB]'
                }`
              }
            >
              {item.icon}
              <span className={`${isCollapsed ? 'sr-only' : 'truncate'}`}>{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className={`border-t border-gray-200/70 shrink-0 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer"
            title={isCollapsed ? 'View live site' : undefined}
            className={`flex min-h-11 items-center justify-center gap-2 w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] text-[#1A1A1A] rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm font-bold ${
              isCollapsed ? 'px-0' : ''
            }`}
          >
            <span className={isCollapsed ? 'sr-only' : ''}>View Live Site</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
