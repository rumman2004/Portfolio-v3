import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import CertificateForm from './CertificateForm';
import EditCertificate from './EditCertificate';
import { certificateServices } from '../../../services/certificateServices';
import { Plus } from 'lucide-react';

const CertificatesList = () => {
  const { data: certificates, loading, refetch } = useFetch('/certificates/admin/all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (formData) => {
    setIsAdding(true);
    try {
      await certificateServices.create(formData);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      alert('Failed to add certificate');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await certificateServices.delete(id);
        refetch();
      } catch (err) {
        alert("Failed to delete certificate");
      }
    }
  };



  return (
    <div>
      <PageHeader 
        title="Certificates" 
        description="Manage your professional certificates and licenses."
        actions={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Certificate
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-md-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {certificates?.length > 0 ? certificates.map((cert) => (
            <div key={cert._id || cert.id} className="bg-md-surface border border-md-outline-variant rounded-3xl overflow-hidden flex flex-col relative group shadow-sm hover:shadow-md transition-all hover:border-md-primary">
              
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                <button onClick={() => setSelectedCertificate(cert)} className="p-2 rounded-full bg-black/40 text-white hover:bg-md-primary transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => handleDelete(cert._id || cert.id)} className="p-2 rounded-full bg-black/40 text-white hover:bg-md-error transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="h-48 bg-md-surface-container relative">
                {cert.image ? (
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-md-on-surface-variant opacity-50">
                     <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                     <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                {cert.isFeatured && (
                  <div className="absolute top-3 left-3 bg-md-primary text-md-on-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-md-on-surface text-lg mb-1 leading-tight">{cert.title}</h3>
                <p className="text-sm text-md-on-surface-variant font-medium mb-3">{cert.issuer}</p>
                
                <div className="mt-auto pt-4 border-t border-md-surface-variant flex items-center justify-between">
                  <span className="text-xs font-semibold text-md-on-surface-variant">
                    {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'No Date'}
                  </span>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-md-primary hover:text-md-on-primary-container transition-colors flex items-center gap-1">
                      View <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-md-on-surface-variant font-medium">
               No certificates found. Click "Add Certificate" to create one.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Certificate">
        <CertificateForm onSubmit={handleAddSubmit} loading={isAdding} />
      </Modal>

      <Modal isOpen={!!selectedCertificate} onClose={() => setSelectedCertificate(null)} title="Edit Certificate">
        <EditCertificate certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} onUpdated={refetch} />
      </Modal>
    </div>
  );
};

export default CertificatesList;

