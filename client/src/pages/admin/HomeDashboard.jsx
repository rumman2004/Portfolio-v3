import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import Dashboard from '../../components/features/admin/Dashboard';

const HomeDashboard = () => {
  return (
    <AdminLayout>
      <div className="text-md-on-background max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight font-sans text-md-on-surface">Command Center</h1>
            <p className="text-md-on-surface-variant font-medium mt-1">System Overview & Monitoring</p>
          </div>
          
          {/* MD3 Elevated Refresh Button */}
          <button 
            className="flex items-center gap-2 px-6 min-h-[48px] rounded-full bg-md-surface-container-low text-md-primary font-medium shadow-md hover:shadow-lg hover:bg-md-surface-container-highest transition-all duration-300 active:scale-95"
            onClick={() => window.location.reload()}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        <Dashboard />
      </div>
    </AdminLayout>
  );
};

export default HomeDashboard;

