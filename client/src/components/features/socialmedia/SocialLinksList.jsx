import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import SocialLinkForm from './SocialLinkForm';
import { socialMediaServices } from '../../../services/socialMediaServices';
import { Plus } from 'lucide-react';
import { resolveIcon } from '../../../utils/iconMap';

const SocialLinksList = () => {
  const { data: links, loading, refetch } = useFetch('/social-media/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedRecord) {
        await socialMediaServices.update(selectedRecord._id || selectedRecord.id, formData);
      } else {
        await socialMediaServices.create(formData);
      }
      setIsAddModalOpen(false);
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      alert(`Failed to ${selectedRecord ? 'update' : 'add'} link.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await socialMediaServices.delete(id);
        refetch();
      } catch (err) {
        alert("Failed to delete link");
      }
    }
  };

  const columns = [
    { 
      header: 'Icon', 
      accessor: 'icon', 
      render: (link) => {
        const iconSrc = resolveIcon(link);
        return (
          <div className="w-10 h-10 bg-[#e6edf5] shadow-[inset_2px_2px_4px_#c8d0da,inset_-2px_-2px_4px_#ffffff] rounded-lg p-2 flex items-center justify-center">
            {iconSrc ? <img src={iconSrc} alt={link.platform} className="max-w-full max-h-full object-contain" /> : <span className="text-gray-500 text-[10px] font-bold text-center leading-tight">{(link.platform || '?').slice(0, 3).toUpperCase()}</span>}
          </div>
        );
      } 
    },
    { header: 'Platform', accessor: 'platform', render: (link) => <span className="font-bold text-gray-800">{link.platform}</span> },
    { 
      header: 'URL', 
      accessor: 'url', 
      render: (link) => (
        <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline max-w-xs truncate block">
          {link.url}
        </a>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Social Media Links" 
        description="Manage your social profiles and public links."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={links} 
        loading={loading} 
        onEdit={(record) => setSelectedRecord(record)}
        onDelete={handleDelete}
        emptyMessage="No social links found."
      />

      <Modal isOpen={isAddModalOpen || !!selectedRecord} onClose={() => { setIsAddModalOpen(false); setSelectedRecord(null); }} title={selectedRecord ? "Edit Link" : "Add Link"}>
        <SocialLinkForm initialData={selectedRecord} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default SocialLinksList;
