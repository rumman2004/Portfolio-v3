import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import ExperienceForm from './ExperienceForm';
import { experienceServices } from '../../../services/experienceServices';
import { Plus } from 'lucide-react';

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
      } else {
        await experienceServices.create(formData);
      }
      setIsAddModalOpen(false);
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      alert(`Failed to ${selectedRecord ? 'update' : 'add'} experience.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceServices.delete(id);
        refetch();
      } catch (err) {
        alert("Failed to delete record");
      }
    }
  };

  const columns = [
    { header: 'Position', accessor: 'position', render: (exp) => <span className="font-bold text-gray-800">{exp.position}</span> },
    { header: 'Company', accessor: 'company' },
    { header: 'Timeline', accessor: 'timeline', render: (exp) => `${exp.startDate || ''} - ${exp.endDate || 'Present'}` },
  ];

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
      
      <DataTable 
        columns={columns} 
        data={experiences} 
        loading={loading} 
        onEdit={(record) => setSelectedRecord(record)}
        onDelete={handleDelete}
        emptyMessage="No experience records found."
      />

      <Modal isOpen={isAddModalOpen || !!selectedRecord} onClose={() => { setIsAddModalOpen(false); setSelectedRecord(null); }} title={selectedRecord ? "Edit Experience" : "Add Experience"}>
        <ExperienceForm initialData={selectedRecord} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default ExperienceList;
