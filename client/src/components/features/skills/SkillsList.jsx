import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import SkillForm from './SkillForm';
import EditSkill from './EditSkill';
import { skillServices } from '../../../services/skillServices';
import { Plus } from 'lucide-react';
import { resolveIcon } from '../../../utils/iconMap';

const SkillsList = () => {
  const { data: skills, loading, refetch } = useFetch('/skills/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await skillServices.create(formData);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      alert('Failed to add skill');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await skillServices.delete(id);
        refetch();
      } catch (err) {
        alert("Failed to delete skill");
      }
    }
  };



  return (
    <div>
      <PageHeader 
        title="Skills" 
        description="Manage your technical skills and proficiencies."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Skill
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-md-primary"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
          {skills?.length > 0 ? skills.map((skill) => {
            const iconSrc = resolveIcon(skill);
            return (
              <div key={skill._id || skill.id} className="bg-md-surface border border-md-outline-variant rounded-3xl p-5 flex flex-col items-center justify-center text-center relative group shadow-sm hover:shadow-md transition-all hover:border-md-primary">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button onClick={() => setSelectedSkill(skill)} className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-primary transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(skill._id || skill.id)} className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-error transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  {iconSrc ? <img src={iconSrc} alt={skill.name} className="max-w-full max-h-full object-contain drop-shadow-sm" /> : <div className="w-12 h-12 rounded-xl bg-md-surface-container flex items-center justify-center text-md-on-surface-variant font-bold">{(skill.name || '?').slice(0, 3).toUpperCase()}</div>}
                </div>
                <h3 className="font-bold text-md-on-surface mb-1 truncate w-full">{skill.name}</h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-md-primary bg-md-primary-container px-2 py-0.5 rounded-full">{skill.category}</span>
              </div>
            )
          }) : (
            <div className="col-span-full text-center py-12 text-md-on-surface-variant font-medium">
               No skills found. Click "Add Skill" to create one.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Skill">
        <SkillForm onSubmit={handleAddSubmit} loading={isAdding} />
      </Modal>

      <Modal isOpen={!!selectedSkill} onClose={() => setSelectedSkill(null)} title="Edit Skill">
        <EditSkill skill={selectedSkill} onClose={() => setSelectedSkill(null)} onUpdated={refetch} />
      </Modal>
    </div>
  );
};

export default SkillsList;

