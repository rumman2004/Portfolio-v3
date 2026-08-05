import React, { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      // Entrance animation
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { y: '-50px', opacity: 0 },
        { y: '0px', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, { dependencies: [isOpen] });

  // Handle close animation before actually unmounting
  const handleClose = useCallback(() => {
    if (!modalRef.current || !overlayRef.current) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { y: '-50px', opacity: 0, duration: 0.3, ease: 'power3.inOut' })
      .to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, "-=0.2");
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-10 px-4 pb-10">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div 
        ref={modalRef}
        className={`relative w-full ${maxWidth} max-h-full liquid-glass border border-white/40 shadow-2xl rounded-3xl flex flex-col opacity-0`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 shrink-0 border-b border-white/20">
          <h2 id="modal-title" className="min-w-0 text-2xl font-headline text-md-on-surface tracking-tight break-words">
            {title}
          </h2>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-white/30 hover:text-md-error transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

