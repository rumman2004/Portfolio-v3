import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { LogOut, Bell, Menu, Mail } from 'lucide-react';
import { useFetch } from '../../../hooks/useFetch';
import { JellyBlobMascot } from 'feral-blob';
import 'feral-blob/blob.css';

const Nav = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutBlobMood, setLogoutBlobMood] = useState('neutral');
  const [logoutMessage, setLogoutMessage] = useState('Going somewhere?');
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
  const unreadCount = messages.filter(m => m.status === 'new' || !m.status).length;

  return (
    <header className="h-20 bg-md-surface border-b border-md-surface-variant flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="min-h-[48px] min-w-[48px] p-2 -ml-2 text-md-on-surface hover:bg-md-surface-container-highest rounded-full transition-colors"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-md-on-surface font-bold hidden sm:block text-lg">Admin Dashboard</div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="min-h-[48px] min-w-[48px] p-2 text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-highest rounded-full transition-all relative group"
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-md-error rounded-full ring-2 ring-md-surface animate-pulse"></span>
            )}
          </button>

          {/* Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2rem))] bg-md-surface-container-highest shadow-md rounded-3xl overflow-hidden z-50">
              <div className="p-4 border-b border-md-surface-variant flex justify-between items-center bg-md-surface-container-low">
                <h3 className="font-semibold text-md-on-surface">Notifications</h3>
                <span className="text-xs bg-md-primary-container text-md-on-primary-container px-2 py-1 rounded-full font-medium">{unreadCount} new</span>
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
                    <div key={msg._id || `${msg.email || 'message'}-${msg.createdAt || index}`} className="p-4 border-b border-md-surface-variant hover:bg-md-surface-container transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start gap-3 mb-1">
                        <span className="min-w-0 font-semibold text-sm text-md-on-surface group-hover:text-md-primary transition-colors break-words">{msg.name || 'New contact'}</span>
                        <span className="shrink-0 text-xs text-md-on-surface-variant">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-sm text-md-on-surface-variant truncate">{msg.subject || 'New Message'}</p>
                      <p className="text-xs text-md-on-surface-variant truncate mt-1">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-md-surface-container-low border-t border-md-surface-variant text-center">
                <a href="/admin/messages" className="text-xs font-semibold text-md-primary hover:text-md-on-primary-container transition-colors">View All Messages</a>
              </div>
            </div>
          )}
        </div>
        

        <button 
          onClick={() => setShowLogoutModal(true)} 
          className="ml-2 min-h-[48px] min-w-[48px] p-2 text-md-on-surface-variant hover:text-md-error hover:bg-md-error-container rounded-full transition-all"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <style>
            {`
              @keyframes float-sync {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              }
              .float-group {
                animation: float-sync 4s ease-in-out infinite;
              }
              @keyframes pop-bubble {
                0% { transform: scale(0.9) translateY(5px); opacity: 0; }
                50% { transform: scale(1.05) translateY(-2px); opacity: 1; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
              }
              .animate-pop {
                animation: pop-bubble 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
              }
            `}
          </style>

          <div className="bg-md-surface p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full mx-4 border border-md-surface-variant transform transition-all text-center flex flex-col items-center">
            
            {/* Grouped Floating Container for Mascot and Bubble */}
            <div className="float-group relative flex flex-col items-center mb-6 mt-4">
              {/* Speech Bubble */}
              <div 
                key={logoutMessage} // Re-triggers animation on message change
                className="animate-pop relative z-20 mb-2 transform origin-bottom"
              >
                <div className="bg-[#2e2e32] text-white text-[15px] font-semibold py-3 px-6 rounded-[1.25rem] shadow-xl border border-white/10 tracking-tight">
                  {logoutMessage}
                </div>
                <div className="absolute -bottom-[6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2e2e32] border-r border-b border-white/10 rotate-45 z-0"></div>
              </div>

              {/* Mascot */}
              <div className="w-40 h-40 relative z-10">
                <JellyBlobMascot
                  mood={logoutBlobMood}
                  gaze={{ x: 0, y: 0 }}
                  onOverpoke={() => { setLogoutBlobMood('angry'); setLogoutMessage("Hey, stop poking!"); }}
                />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-md-on-surface mb-2 tracking-tight">Leaving so soon?</h3>
            <p className="text-md-on-surface-variant text-sm mb-8 px-2 leading-relaxed">
              Are you sure you want to log out of the admin dashboard?
            </p>
            
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                onMouseEnter={() => { setLogoutBlobMood('happy'); setLogoutMessage('Yay, stay with me!'); }}
                onMouseLeave={() => { setLogoutBlobMood('neutral'); setLogoutMessage('Going somewhere?'); }}
                className="flex-1 py-4 px-4 bg-md-surface-container-highest text-md-on-surface font-semibold rounded-2xl hover:bg-md-surface-container hover:scale-105 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                onMouseEnter={() => { setLogoutBlobMood('sad'); setLogoutMessage("Aww, don't go..."); }}
                onMouseLeave={() => { setLogoutBlobMood('neutral'); setLogoutMessage('Going somewhere?'); }}
                className="flex-1 py-4 px-4 bg-[#b91c1c] text-white font-semibold rounded-2xl hover:bg-[#991b1b] hover:scale-105 transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
