import React from 'react';
import { useFetch } from '../../../hooks/useFetch';
import Loader from '../../UI/Loader';
import { Eye, MessageSquare, Briefcase, Award, Activity, Database, Server, Clock, Share2, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const { data: statsData, loading, error } = useFetch('/admin/dashboard-stats');

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 font-bold p-8">Failed to load telemetry data: {error}</div>;

  const stats = statsData || {};
  const isDbConnected = stats.dbConnection === 1;

  const defaultStats = [
    { title: 'Total Views', value: stats.views || 0, icon: <Eye className="w-5 h-5 text-[#3B82F6]" /> },
    { title: 'Messages', value: stats.messages || 0, icon: <MessageSquare className="w-5 h-5 text-[#10B981]" /> },
    { title: 'Projects', value: stats.projects || 0, icon: <Briefcase className="w-5 h-5 text-[#8B5CF6]" /> },
    { title: 'Certificates', value: stats.certificates || 0, icon: <Award className="w-5 h-5 text-[#F59E0B]" /> },
  ];

  const chartData = stats.projectChartData?.map(p => ({ name: p.title, clicks: p.clicks })) || [];

  return (
    <div className="space-y-4 font-sans">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {defaultStats.map((stat, idx) => (
          <div key={idx} className="relative p-3 rounded-2xl bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-full bg-[#e6edf5] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center mb-2">
              <div className="w-8 h-8 rounded-full bg-[#e6edf5] shadow-[3px_3px_6px_#c8d0da,-3px_-3px_6px_#ffffff] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-800 tracking-tight drop-shadow-sm font-sans mb-0.5">{stat.value}</h3>
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Monitoring & Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Project Interest Chart */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff]">
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Project Interest Overview</h2>
          </div>
          
          <div className="h-44 w-full rounded-xl bg-[#dbe5f0] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] p-3 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fill: '#6B7280', fontSize: 10}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '4px 4px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#8B5CF6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 font-semibold uppercase tracking-widest text-sm">No project click data available yet.</p>
            )}
          </div>
        </div>

        {/* System Telemetry Panel */}
        <div className="p-4 rounded-2xl bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff]">
              <Server className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">System Status</h2>
          </div>

          <div className="space-y-3 flex-1">
            {/* DB Connection */}
            <div className="bg-[#e6edf5] p-3 rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-sm">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Database</span>
                </div>
                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${isDbConnected ? 'bg-emerald-400 text-emerald-400' : 'bg-red-400 text-red-400'} animate-pulse`}></div>
              </div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{isDbConnected ? 'Connected & Stable' : 'Disconnected'}</p>
            </div>

            {/* API Calls */}
            <div className="bg-[#e6edf5] p-3 rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-sm">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>API Calls</span>
                </div>
                <span className="text-blue-600 font-mono font-bold text-sm bg-[#dbe5f0] px-2 py-0.5 rounded-md shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff]">{stats.apiCalls || 0}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Total Network Requests</p>
            </div>

            {/* Social Links */}
            <div className="bg-[#e6edf5] p-3 rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-sm">
                  <Share2 className="w-4 h-4 text-amber-500" />
                  <span>Social Links</span>
                </div>
                <span className="text-amber-600 font-mono font-bold text-sm bg-[#dbe5f0] px-2 py-0.5 rounded-md shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff]">{stats.socialMedia || 0}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Active Channels</p>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Messages Row */}
      <div className="p-4 rounded-2xl bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff]">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff]">
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Messages</h2>
        </div>

        <div className="bg-[#dbe5f0] rounded-xl shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] p-3">
          {stats.recentMessages && stats.recentMessages.length > 0 ? (
            <div className="space-y-2">
              {stats.recentMessages.map((msg, i) => (
                <div key={msg._id || i} className="bg-[#e6edf5] p-3 rounded-lg shadow-[3px_3px_6px_#c8d0da,-3px_-3px_6px_#ffffff] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#dbe5f0] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{msg.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{msg.email}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-1 sm:max-w-xs">
                    <p className="text-sm text-gray-600 font-semibold truncate">{msg.subject || 'No Subject'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center p-4 text-gray-400">
               <Mail className="w-8 h-8 mb-1.5 opacity-50" />
               <p className="font-semibold uppercase tracking-widest text-xs">Inbox is empty</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
