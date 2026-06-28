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

  const columns = [
    { header: 'Certificate', accessor: 'title', render: (cert) => <span className="font-bold text-gray-800">{cert.title}</span> },
    { header: 'Issuer', accessor: 'issuer' },
    { header: 'Date', accessor: 'issuedAt', render: (cert) => cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'N/A' },
    { 
      header: 'Credential', 
      accessor: 'credentialUrl', 
      render: (cert) => (
        cert.credentialUrl ? <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View</a> : <span className="text-neutral-500">N/A</span>
      )
    }
  ];

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
      
      <DataTable 
        columns={columns} 
        data={certificates} 
        loading={loading} 
        onEdit={(cert) => setSelectedCertificate(cert)}
        onDelete={handleDelete}
        emptyMessage="No certificates found."
      />

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
