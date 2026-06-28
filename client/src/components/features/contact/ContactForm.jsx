import React, { useState } from 'react';
import api from '../../../services/api';
import { Send, User, Mail, FileText, PenLine, ArrowUpRight, Loader2 } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, text: '' });
    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', text: "Your message has been sent successfully! I'll get back to you soon." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-card w-full bg-white p-8 md:p-10 border border-[#1A1A1A]/10 rounded-2xl shadow-sm">
      <div className="flex items-start gap-4 mb-10">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3D4BFF]/10 flex items-center justify-center">
          <Send className="w-5 h-5 text-[#3D4BFF]" />
        </div>
        <div>
          <h3 className="font-headline text-2xl md:text-[28px] text-[#1A1A1A]">Send Me a Message</h3>
          <p className="font-inter text-[#6B7280] text-sm mt-1">Fill out the form below and I'll get back to you as soon as possible.</p>
        </div>
      </div>

      {status.type && (
        <div
          role="status"
          className={`mb-8 p-4 rounded-xl font-inter text-sm font-medium border ${
            status.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              id="name" type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="Your Name"
              className="w-full bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#9CA3AF] focus:outline-none focus:border-[#3D4BFF] focus:bg-white transition-colors"
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
          <div className="relative">
            <label htmlFor="email" className="sr-only">Your Email</label>
            <input
              id="email" type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="Your Email"
              className="w-full bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#9CA3AF] focus:outline-none focus:border-[#3D4BFF] focus:bg-white transition-colors"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="subject" className="sr-only">Subject</label>
          <input
            id="subject" type="text" name="subject" value={formData.subject} onChange={handleChange} required
            placeholder="Subject"
            className="w-full bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#9CA3AF] focus:outline-none focus:border-[#3D4BFF] focus:bg-white transition-colors"
          />
          <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
        </div>

        <div className="relative">
          <label htmlFor="message" className="sr-only">Your Message</label>
          <textarea
            id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required
            placeholder="Your Message"
            className="w-full bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#9CA3AF] focus:outline-none focus:border-[#3D4BFF] focus:bg-white transition-colors resize-none"
          />
          <PenLine className="absolute right-4 top-4 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full min-h-12 flex items-center justify-center gap-2 px-8 py-4 bg-[#0448a8] text-white font-inter font-bold uppercase rounded-xl hover:bg-[#03367d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              Send Message
              <ArrowUpRight className="w-4 h-4 text-white transition-colors" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
