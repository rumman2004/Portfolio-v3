import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { LogOut, Bell, Menu, Mail } from 'lucide-react';
import { useFetch } from '../../../hooks/useFetch';

const Nav = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data: messagesResponse, loading } = useFetch('/contact/messages');
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const messages = messagesResponse || [];
  const unreadCount = messages.filter(m => m.status === 'unread').length || (messages.length > 0 ? messages.length : 0);

  return (
    <header className="h-20 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="min-h-11 min-w-11 p-2 -ml-2 text-[#1A1A1A] hover:bg-[#F3F4F6] rounded-xl transition-colors"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-[#1A1A1A] font-bold hidden sm:block text-lg">Admin Dashboard</div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="min-h-11 min-w-11 p-2 text-[#4b5563] hover:text-[#1A1A1A] hover:bg-[#F3F4F6] rounded-xl transition-all relative group"
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2rem))] bg-white border border-[#E5E7EB] shadow-[0_16px_48px_-24px_rgba(15,23,42,0.35)] rounded-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="font-semibold text-[#1A1A1A]">Notifications</h3>
                <span className="text-xs bg-[#4F46E5]/10 text-[#4F46E5] px-2 py-1 rounded-md font-medium">{unreadCount} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {loading && !messages.length ? (
                  <div className="p-6 text-center text-sm text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="p-6 text-center flex flex-col items-center text-gray-500">
                    <Mail className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">No new messages</p>
                  </div>
                ) : (
                  messages.slice(0, 5).map((msg, index) => (
                    <div key={msg._id || `${msg.email || 'message'}-${msg.createdAt || index}`} className="p-4 border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start gap-3 mb-1">
                        <span className="min-w-0 font-semibold text-sm text-[#1A1A1A] group-hover:text-[#4F46E5] transition-colors break-words">{msg.name || 'New contact'}</span>
                        <span className="shrink-0 text-xs text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{msg.subject || 'New Message'}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-[#F8FAFC] border-t border-gray-100 text-center">
                <a href="/admin/messages" className="text-xs font-semibold text-[#4F46E5] hover:text-[#3B82F6] transition-colors">View All Messages</a>
              </div>
            </div>
          )}
        </div>
        

        <button 
          onClick={logout} 
          className="ml-2 min-h-11 min-w-11 p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Nav;
