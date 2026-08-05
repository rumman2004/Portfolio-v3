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
      
      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-md-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {links?.length > 0 ? links.map((link) => {
            const iconSrc = resolveIcon(link);
            return (
              <div key={link._id || link.id} className="bg-md-surface border border-md-outline-variant rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all hover:border-md-primary group">
                <div className="w-12 h-12 shrink-0 bg-md-surface-container rounded-xl flex items-center justify-center p-2.5">
                  {iconSrc ? <img src={iconSrc} alt={link.platform} className="w-full h-full object-contain" /> : <span className="text-md-on-surface-variant text-[10px] font-bold">{(link.platform || '?').slice(0, 3).toUpperCase()}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-md-on-surface text-base truncate">{link.platform}</h3>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-md-primary hover:text-md-on-primary-container hover:underline truncate block">
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedRecord(link)} className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(link._id || link.id)} className="p-2 rounded-full text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-error transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12 text-md-on-surface-variant font-medium">
               No social links found. Click "Add Link" to create one.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen || !!selectedRecord} onClose={() => { setIsAddModalOpen(false); setSelectedRecord(null); }} title={selectedRecord ? "Edit Link" : "Add Link"}>
        <SocialLinkForm initialData={selectedRecord} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default SocialLinksList;

