import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from './services/api';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

import * as LucideIcons from 'lucide-react';

function App() {
  useEffect(() => {
    // Show a random greeting toast when the app loads
    const showGreeting = async () => {
      try {
        const response = await api.get('/notifications/random');
        if (response.data && response.data.success) {
          toast.custom((t) => {
            const GreetingIcon = LucideIcons[response.data.greeting?.icon] || LucideIcons.Sun;
            const MessageIcon = LucideIcons[response.data.message?.icon] || LucideIcons.Bell;
            
            return (
              <div
                className={`${
                  t.visible ? 'toast-enter' : 'toast-leave'
                } liquid-toast max-w-sm w-[90vw] sm:w-[350px] p-4 rounded-2xl flex items-start gap-4 mb-2 pointer-events-auto`}
              >
                <div className="text-[#0448a8] pt-1 bg-[#0448a8]/10 p-2 rounded-xl border border-[#0448a8]/20">
                  <MessageIcon size={24} />
                </div>
                <div className="flex-1 flex flex-col pt-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    {response.data.greeting?.text}
                    <GreetingIcon size={14} className="text-[#0448a8]" />
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {response.data.message?.text}
                  </p>
                </div>
              </div>
            );
          }, { duration: 5000, position: 'bottom-right' });
        }
      } catch (err) {
        console.error('Failed to fetch greeting:', err);
      }
    };

    // Initial greeting after 1.5s
    const initialTimer = setTimeout(() => {
      showGreeting();
    }, 1500);

    // Repeat every 45 seconds (45000 ms)
    const intervalTimer = setInterval(() => {
      showGreeting();
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
