import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import ExperienceForm from './ExperienceForm';
import { experienceServices } from '../../../services/experienceServices';
import { Plus, Edit2, Trash2, Briefcase, Calendar } from 'lucide-react';
import Loader from '../../UI/Loader';
import { toast } from 'react-hot-toast';

const ExperienceList = () => {
  const { data: experiences, loading, refetch } = useFetch('/experience/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedRecord) {
        await experienceServices.update(selectedRecord._id || selectedRecord.id, formData);
        toast.success('Experience updated successfully');
      } else {
        await experienceServices.create(formData);
        toast.success('Experience added successfully');
      }
      setIsAddModalOpen(false);
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      toast.error(`Failed to ${selectedRecord ? 'update' : 'add'} experience.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceServices.delete(id);
        toast.success("Experience record deleted");
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
        title="Work Experience" 
        description="Manage your professional work history."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        }
      />
      
      {loading ? (
        <Loader />
      ) : experiences?.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/60 shadow-sm rounded-full flex items-center justify-center mb-4">
            <Briefcase size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-md-on-surface mb-1">No experience records</h3>
          <p className="text-gray-500 text-sm">Click "Add New" to add your work history.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-md-surface-variant before:to-transparent pb-12 pl-4">
          {experiences?.map((exp) => (
            <div key={exp._id} className="relative flex items-start gap-6 group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#F4F4F4] bg-emerald-500 text-white shadow shrink-0 z-10 mt-2">
                <Briefcase size={20} />
              </div>
              
              {/* Card */}
              <div className="flex-1 min-w-0 bg-white/50 backdrop-blur-md shadow-sm hover:shadow-md rounded-3xl border border-white/60 p-5 md:p-6 transition-all relative mt-1">
                
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-md-on-surface leading-tight break-words">{exp.position}</h3>
                    <p className="text-emerald-600 font-bold mt-1 text-sm">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 shadow-sm border border-white rounded-full text-xs font-bold text-gray-600 shrink-0 self-start">
                    <Calendar size={14} className="text-emerald-600" />
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-sm text-gray-600 mb-5 whitespace-pre-line leading-relaxed">{exp.description}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/40">
                  <button onClick={() => setSelectedRecord(exp)} className={btnClass} title="Edit Record">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(exp._id)} className={`${btnClass} hover:text-red-500`} title="Delete Record">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddModalOpen || !!selectedRecord} onClose={() => { setIsAddModalOpen(false); setSelectedRecord(null); }} title={selectedRecord ? "Edit Experience" : "Add Experience"}>
        <ExperienceForm initialData={selectedRecord} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default ExperienceList;

