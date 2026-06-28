import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import EducationForm from './EducationForm';
import EditEduacation from './EditEduacation';
import { educationServices } from '../../../services/educationServices';
import { Plus } from 'lucide-react';

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
        refetch();
      } catch (err) {
        alert("Failed to delete record");
      }
    }
  };

  const columns = [
    { header: 'Degree', accessor: 'degree', render: (edu) => <span className="font-bold text-gray-800">{edu.degree}</span> },
    { header: 'Institution', accessor: 'institution' },
    { header: 'Timeline', accessor: 'timeline', render: (edu) => `${edu.startDate || ''} - ${edu.endDate || 'Present'}` },
  ];

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
      
      <DataTable 
        columns={columns} 
        data={educationRecords} 
        loading={loading} 
        onEdit={(record) => setSelectedRecord(record)}
        onDelete={handleDelete}
        emptyMessage="No education records found."
      />

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
