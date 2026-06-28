import React from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import Dashboard from '../../components/features/admin/Dashboard';

const HomeDashboard = () => {
  return (
    <AdminLayout>
      <div className="text-[#1A1A1A] max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm font-sans text-gray-800">Command Center</h1>
            <p className="text-[#6B7280] font-medium mt-1">System Overview & Monitoring</p>
          </div>
          
          {/* Skeumorphic Refresh Button */}
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#e6edf5] text-[#4F46E5] font-bold shadow-[5px_5px_10px_#c8d0da,-5px_-5px_10px_#ffffff] hover:shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 active:scale-95"
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
