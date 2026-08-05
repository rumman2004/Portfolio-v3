import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import EducationForm from './EducationForm';
import EditEduacation from './EditEduacation';
import { educationServices } from '../../../services/educationServices';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EducationList = () => {
  const { data: educationRecords, loading, refetch } = useFetch('/education/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await educationServices.create(formData);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      alert('Failed to add education: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this education record?")) {
      try {
        await educationServices.delete(id);
        toast.success("Education record deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete record");
      }
    }
  };

  const btnClass = "flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 bg-md-surface/50 border border-md-surface-variant transition-all hover:bg-white";

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <PageHeader 
        title="Education History" 
        description="Manage your academic background."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : educationRecords?.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/60 shadow-sm rounded-full flex items-center justify-center mb-4">
            <GraduationCap size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-md-on-surface mb-1">No education records</h3>
          <p className="text-gray-500 text-sm">Click "Add New" to add your academic history.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-md-surface-variant before:to-transparent pb-12 pl-4">
          {educationRecords?.map((edu) => (
            <div key={edu._id} className="relative flex items-start gap-6 group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#F4F4F4] bg-md-primary text-white shadow shrink-0 z-10 mt-2">
                <GraduationCap size={20} />
              </div>
              
              {/* Card */}
              <div className="flex-1 min-w-0 bg-white/50 backdrop-blur-md shadow-sm hover:shadow-md rounded-3xl border border-white/60 p-5 md:p-6 transition-all relative mt-1">
                
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-md-on-surface leading-tight break-words">{edu.degree}</h3>
                    <p className="text-md-primary font-bold mt-1 text-sm">{edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 shadow-sm border border-white rounded-full text-xs font-bold text-gray-600 shrink-0 self-start">
                    <Calendar size={14} className="text-md-primary" />
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>

                {edu.description && (
                  <p className="text-sm text-gray-600 mb-5 whitespace-pre-line leading-relaxed">{edu.description}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/40">
                  <button onClick={() => setSelectedRecord(edu)} className={btnClass} title="Edit Record">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(edu._id)} className={`${btnClass} hover:text-red-500`} title="Delete Record">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Education">
        <EducationForm onSubmit={handleAddSubmit} loading={isAdding} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="Edit Education">
        <EditEduacation education={selectedRecord} onClose={() => setSelectedRecord(null)} onUpdated={refetch} />
      </Modal>
    </div>
  );
};

export default EducationList;

