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
    <div className="contact-form-card w-full h-full">
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#0448a8]/10 flex items-center justify-center">
            <Send className="w-4 h-4 text-[#0448a8]" />
          </div>
          <h3 className="font-headline text-2xl md:text-3xl text-[#1A1A1A]">Send a Message</h3>
        </div>
        <p className="font-inter text-[#4b5563] text-sm ml-13">Fill out the form below and I'll get back to you as soon as possible.</p>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              id="name" type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="Your Name"
              className="w-full bg-white/40 border border-white/60 rounded-2xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#6B7280] focus:outline-none focus:border-[#0448a8] focus:bg-white/60 focus:shadow-[0_0_15px_rgba(4,72,168,0.1)] transition-all backdrop-blur-md"
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0448a8] transition-colors pointer-events-none" />
          </div>
          <div className="relative group">
            <label htmlFor="email" className="sr-only">Your Email</label>
            <input
              id="email" type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="Your Email"
              className="w-full bg-white/40 border border-white/60 rounded-2xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#6B7280] focus:outline-none focus:border-[#0448a8] focus:bg-white/60 focus:shadow-[0_0_15px_rgba(4,72,168,0.1)] transition-all backdrop-blur-md"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0448a8] transition-colors pointer-events-none" />
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="subject" className="sr-only">Subject</label>
          <input
            id="subject" type="text" name="subject" value={formData.subject} onChange={handleChange} required
            placeholder="Subject"
            className="w-full bg-white/40 border border-white/60 rounded-2xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#6B7280] focus:outline-none focus:border-[#0448a8] focus:bg-white/60 focus:shadow-[0_0_15px_rgba(4,72,168,0.1)] transition-all backdrop-blur-md"
          />
          <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0448a8] transition-colors pointer-events-none" />
        </div>

        <div className="relative group">
          <label htmlFor="message" className="sr-only">Your Message</label>
          <textarea
            id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required
            placeholder="Your Message"
            className="w-full bg-white/40 border border-white/60 rounded-2xl py-3.5 pl-4 pr-11 text-[#1A1A1A] font-inter placeholder-[#6B7280] focus:outline-none focus:border-[#0448a8] focus:bg-white/60 focus:shadow-[0_0_15px_rgba(4,72,168,0.1)] transition-all backdrop-blur-md resize-none"
          />
          <PenLine className="absolute right-4 top-4 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0448a8] transition-colors pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full min-h-[52px] flex items-center justify-center gap-2 px-8 bg-[#0448a8] text-white font-inter font-bold uppercase rounded-2xl hover:bg-[#03367d] hover:shadow-[0_4px_20px_rgba(4,72,168,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
