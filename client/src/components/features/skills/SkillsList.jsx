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

  const columns = [
    { 
      header: 'Icon', 
      accessor: 'icon', 
      render: (skill) => {
        const iconSrc = resolveIcon(skill);
        return (
          <div className="w-10 h-10 bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff] rounded-lg p-2 flex items-center justify-center">
            {iconSrc ? <img src={iconSrc} alt={skill.name} className="max-w-full max-h-full object-contain" /> : <span className="text-gray-500 text-[10px] font-bold text-center leading-tight">{(skill.name || '?').slice(0, 3).toUpperCase()}</span>}
          </div>
        );
      } 
    },
    { header: 'Name', accessor: 'name', render: (skill) => <span className="font-bold text-gray-800">{skill.name}</span> },
    { header: 'Category', accessor: 'category' },

  ];

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
      
      <DataTable 
        columns={columns} 
        data={skills} 
        loading={loading} 
        onEdit={(skill) => setSelectedSkill(skill)}
        onDelete={handleDelete}
        emptyMessage="No skills found."
      />

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
