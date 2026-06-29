import React, { useState, useEffect } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { contactServices } from '../../../services/contactServices';
import { Search, Mail, CheckCircle, Archive, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessagesInbox = () => {
  const { data: messages, loading, refetch } = useFetch('/contact/messages');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [draftReply, setDraftReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    // If message is new, mark as read automatically
    if (msg.status === 'new' || !msg.status) {
      try {
        const updated = await contactServices.updateMessageStatus(msg._id, { status: 'read' });
        setSelectedMessage(updated);
        refetch();
      } catch (err) {
        console.error("Failed to mark as read");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedMessage) return;
    try {
      const updated = await contactServices.updateMessageStatus(selectedMessage._id, { status: newStatus });
      setSelectedMessage(updated);
      toast.success(`Conversation marked as ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(`Failed to mark as ${newStatus}`);
    }
  };

  const handleSendReply = async () => {
    if (!draftReply.trim() || !selectedMessage) return;
    
    setIsSending(true);
    const loadingToast = toast.loading('AI is writing your reply...');
    
    try {
      const updated = await contactServices.sendReply(selectedMessage._id, draftReply);
      setSelectedMessage(updated);
      setDraftReply('');
      toast.success('Reply polished and sent successfully!', { id: loadingToast });
      refetch();
    } catch (err) {
      toast.error('Failed to send reply. Check console for details.', { id: loadingToast });
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await contactServices.deleteMessage(id);
        setSelectedMessage(null);
        toast.success('Conversation deleted');
        refetch();
      } catch (err) {
        toast.error("Failed to delete conversation");
      }
    }
  };

  const filteredMessages = messages?.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500';
      case 'read': return 'bg-gray-400';
      case 'replied': return 'bg-green-500';
      case 'archived': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  // Base styling constants for neuomorphism
  const dropClass = "bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] rounded-2xl";
  const insetClass = "bg-[#e6edf5] shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] rounded-2xl";
  const btnClass = "p-2 rounded-xl text-gray-500 hover:text-blue-500 shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff] transition-all";

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-4 md:p-6 bg-[#F4F4F4] font-inter overflow-hidden">
      
      <div className="flex-1 flex gap-6 overflow-hidden max-w-7xl mx-auto w-full relative">
        
        {/* LEFT PANE: Chat List */}
        <div className={`${(isMobileView && selectedMessage) ? 'hidden' : 'flex'} w-full md:w-1/3 lg:w-1/4 flex-col gap-4 h-full`}>
          <div className={`${dropClass} p-4 flex flex-col gap-4 h-full`}>
            
            <h2 className="text-2xl font-headline text-gray-800 tracking-tight">Messages</h2>
            
            <div className={`${insetClass} flex items-center px-4 py-2`}>
              <Search size={18} className="text-gray-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2 pb-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500 text-sm font-medium">Loading...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm font-medium">No messages found.</div>
              ) : (
                filteredMessages.map(msg => {
                  const isSelected = selectedMessage?._id === msg._id;
                  const isNew = msg.status === 'new' || !msg.status;
                  return (
                    <div 
                      key={msg._id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`cursor-pointer p-3 rounded-xl transition-all ${isSelected ? 'bg-blue-50 shadow-[inset_2px_2px_5px_rgba(59,130,246,0.1)] border border-blue-100' : 'hover:bg-white/50 border border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`w-2 h-2 shrink-0 rounded-full ${getStatusColor(msg.status)} ${isNew ? 'animate-pulse' : ''}`}></div>
                          <h4 className={`text-sm truncate ${isNew ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.name}</h4>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap ml-2">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Chat Window */}
        <div className={`${(isMobileView && !selectedMessage) ? 'hidden' : 'flex'} flex-1 flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden`}>
          
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <div className="h-16 shrink-0 border-b border-gray-100 px-4 md:px-6 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4 overflow-hidden">
                  {isMobileView && (
                    <button onClick={() => setSelectedMessage(null)} className="p-2 text-gray-500 hover:text-gray-800 shrink-0">
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{selectedMessage.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{selectedMessage.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg mr-2">
                    <button onClick={() => handleStatusChange('read')} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${selectedMessage.status === 'read' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Read</button>
                    <button onClick={() => handleStatusChange('replied')} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${selectedMessage.status === 'replied' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Replied</button>
                    <button onClick={() => handleStatusChange('archived')} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${selectedMessage.status === 'archived' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>Archive</button>
                  </div>
                  <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg shadow-sm">
                    <Archive size={16} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#f0f2f5] flex flex-col gap-6">
                
                {/* Date separator */}
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 bg-white shadow-sm rounded-full text-xs font-medium text-gray-500">
                    {new Date(selectedMessage.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                {/* Original User Message (Left side) */}
                <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
                  <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-blue-600 mb-2 border-b border-gray-100 pb-2">Subject: {selectedMessage.subject}</p>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
                      {selectedMessage.message}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 ml-1">
                    {new Date(selectedMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                {/* System/Admin Replies (Right side) */}
                {selectedMessage.replies?.map((reply, idx) => (
                  <div key={idx} className="flex flex-col items-end self-end max-w-[85%] sm:max-w-[75%]">
                    <div className="bg-[#E7F8ED] text-gray-800 p-4 rounded-2xl rounded-tr-sm shadow-sm border border-[#C5ECD4]">
                      <div className="flex items-center gap-2 mb-2 border-b border-[#C5ECD4]/50 pb-2">
                        {reply.sender === 'system' ? (
                          <span className="text-xs font-bold text-green-700">Automated Response (System)</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-green-700">You (Admin)</span>
                            {reply.aiStatus && reply.aiStatus !== 'None' && (
                              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                                reply.aiStatus === 'Perfect' ? 'bg-green-600 text-white' :
                                reply.aiStatus === 'Improved' ? 'bg-blue-600 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                <Sparkles size={10} />
                                {reply.aiStatus}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
                        {reply.message}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 mr-1">
                      <span className="text-[10px] text-gray-400">
                        {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <CheckCircle size={10} className="text-green-500" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-end gap-3">
                <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex flex-col relative overflow-hidden">
                  <textarea 
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    placeholder="Type a quick, rough draft here..."
                    className="w-full bg-transparent p-4 outline-none resize-none min-h-[60px] max-h-[150px] text-sm text-gray-700 custom-scrollbar"
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-100/50 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400">
                      <Sparkles size={12} className="text-blue-500" />
                      AI will improve this before sending
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSendReply}
                  disabled={!draftReply.trim() || isSending}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${(!draftReply.trim() || isSending) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'}`}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} className="ml-1" />
                  )}
                </button>
              </div>

            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8f9fa]">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200">
                <Mail size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-headline text-gray-800 tracking-tight mb-2">WhatsApp Web... sort of!</h2>
              <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                Select a conversation from the list to read the message and view automated replies.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MessagesInbox;
