import React, { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import DataTable from '../admin/DataTable';
import PageHeader from '../../common/PageHeader';
import Modal from '../../UI/Modal';
import MessageDetail from './MessageDetail';
import { contactServices } from '../../../services/contactServices';

const MessagesInbox = () => {
  const { data: messages, loading, refetch } = useFetch('/contact/messages');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = async (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    
    // If message is unread, mark it as read when opened
    if (!msg.isRead) {
      try {
        await contactServices.updateMessageStatus(msg._id, { isRead: true });
        refetch(); // Refresh list to update unread status
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactServices.deleteMessage(id);
        refetch();
      } catch (err) {
        alert("Failed to delete message");
      }
    }
  };

  const columns = [
    { 
      header: 'Status', 
      accessor: 'isRead', 
      render: (msg) => (
        <span className={`w-3 h-3 rounded-full inline-block ${msg.isRead ? 'bg-neutral-600' : 'bg-blue-500 animate-pulse'}`}></span>
      )
    },
    { header: 'Sender', accessor: 'name', render: (msg) => <span className="font-medium text-gray-800">{msg.name}</span> },
    { header: 'Email', accessor: 'email' },
    { header: 'Subject', accessor: 'subject' },
    { 
      header: 'Date', 
      accessor: 'createdAt', 
      render: (msg) => new Date(msg.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div>
      <PageHeader title="Messages Inbox" description="Manage incoming contact requests." />
      
      <DataTable 
        columns={columns} 
        data={messages} 
        loading={loading} 
        onEdit={handleView} // Hijacking "Edit" action to act as "View"
        onDelete={handleDelete}
        emptyMessage="Your inbox is empty."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Message Details">
        <MessageDetail message={selectedMessage} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default MessagesInbox;
