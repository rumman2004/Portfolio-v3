import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import HackathonForm from './HackathonForm';
import EditHackathon from './EditHackathon';
import { hackathonServices } from '../../../services/hackathonServices';
import { Plus, Edit2, Trash2, Trophy, Calendar, ExternalLink, Loader, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const HackathonsList = () => {
  const { data: hackathons, loading, refetch } = useFetch('/hackathon/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await hackathonServices.create(formData);
      toast.success('Hackathon added successfully');
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to add hackathon');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hackathon?")) {
      try {
        await hackathonServices.delete(id);
        toast.success("Hackathon deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete hackathon");
      }
    }
  };

  const btnClass = "flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 bg-white/50 border border-white/60 transition-all hover:bg-white shadow-sm";

  return (
    <div>
      <PageHeader 
        title="Hackathons" 
        description="Manage your hackathon participations and achievements."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Hackathon
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : hackathons?.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/60 shadow-sm rounded-full flex items-center justify-center mb-4">
            <Trophy size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-md-on-surface mb-1">No hackathons found</h3>
          <p className="text-gray-500 text-sm">Click "Add Hackathon" to add your first achievement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hackathons?.map((hack) => (
            <div key={hack._id} className="bg-white/50 backdrop-blur-md shadow-md rounded-3xl border border-white/60 p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-xl font-bold text-md-on-surface truncate" title={hack.title}>{hack.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1.5 shrink-0" />
                    <span className="truncate">{hack.date ? new Date(hack.date).toLocaleDateString() : 'N/A'}</span>
                    
                    {hack.location && (
                      <>
                        <span className="mx-2">•</span>
                        <MapPin size={14} className="mr-1.5 shrink-0" />
                        <span className="truncate">{hack.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl shadow-sm border border-indigo-100">
                  <Trophy size={24} />
                </div>
              </div>

              {hack.achievement && (
                <div className="mb-4">
                  <span className="inline-flex px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-bold shadow-sm">
                    {hack.achievement}
                  </span>
                </div>
              )}

              {hack.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{hack.description}</p>
              )}

              {hack.technologies && hack.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {hack.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-white/60 border border-white rounded-md text-xs font-semibold text-gray-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/40">
                <div className="flex items-center gap-3">
                  {hack.projectUrl && (
                    <a href={hack.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center transition-colors">
                      <ExternalLink size={14} className="mr-1" /> Project
                    </a>
                  )}
                  {hack.certificateUrl && (
                    <a href={hack.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 font-semibold text-sm flex items-center transition-colors">
                      <ExternalLink size={14} className="mr-1" /> Certificate
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedHackathon(hack)} className={btnClass} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(hack._id)} className={`${btnClass} hover:text-red-500 hover:border-red-200`} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Hackathon">
        <HackathonForm onSubmit={handleAddSubmit} loading={isAdding} />
      </Modal>

      <Modal isOpen={!!selectedHackathon} onClose={() => setSelectedHackathon(null)} title="Edit Hackathon">
        <EditHackathon hackathon={selectedHackathon} onClose={() => setSelectedHackathon(null)} onUpdated={refetch} />
      </Modal>
    </div>
  );
};

export default HackathonsList;

