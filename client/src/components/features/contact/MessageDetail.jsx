import React from 'react';
import Button from '../../UI/Button';

const MessageDetail = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 p-4 bg-[#e6edf5] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] rounded-xl">
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-1">From</h4>
          <p className="text-lg font-medium text-gray-800">{message.name}</p>
          <a href={`mailto:${message.email}`} className="text-blue-500 hover:underline font-medium">{message.email}</a>
        </div>
        <div className="sm:text-right">
          <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-1">Date</h4>
          <p className="text-gray-600 font-medium">{new Date(message.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Subject</h4>
        <p className="text-xl font-bold text-gray-800">{message.subject}</p>
      </div>

      <div>
        <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Message</h4>
        <div className="p-5 bg-[#e6edf5] shadow-[inset_4px_4px_8px_#c8d0da,inset_-4px_-4px_8px_#ffffff] rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[150px] font-medium">
          {message.message}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/50">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default MessageDetail;
