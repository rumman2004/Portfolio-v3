import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import HackathonForm from './HackathonForm';
import EditHackathon from './EditHackathon';
import { hackathonServices } from '../../../services/hackathonServices';
import { Plus } from 'lucide-react';

const HackathonsList = () => {
  const { data: hackathons, loading, refetch } = useFetch('/hackathon/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await hackathonServices.create(formData);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      alert('Failed to add hackathon');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hackathon?")) {
      try {
        await hackathonServices.delete(id);
        refetch();
      } catch (err) {
        alert("Failed to delete hackathon");
      }
    }
  };

  const columns = [
    { header: 'Hackathon', accessor: 'title', render: (hack) => <span className="font-bold text-gray-800">{hack.title}</span> },
    { 
      header: 'Rank', 
      accessor: 'achievement', 
      render: (hack) => <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs">{hack.achievement}</span> 
    },
    { header: 'Date', accessor: 'date', render: (hack) => hack.date ? new Date(hack.date).toLocaleDateString() : 'N/A' },
    { header: 'Tech', accessor: 'technologies', render: (hack) => hack.technologies?.slice(0, 3).join(', ') + (hack.technologies?.length > 3 ? '...' : '') }
  ];

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
      
      <DataTable 
        columns={columns} 
        data={hackathons} 
        loading={loading} 
        onEdit={(hack) => setSelectedHackathon(hack)}
        onDelete={handleDelete}
        emptyMessage="No hackathons found."
      />

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
