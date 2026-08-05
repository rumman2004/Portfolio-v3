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
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
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
    tl.to(modalRef.current, { x: '100%', duration: 0.4, ease: 'power3.inOut' })
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
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Drawer */}
      <div 
        ref={modalRef}
        className={`relative w-full ${maxWidth.replace('max-w-', 'sm:w-')} md:w-[600px] max-w-full h-full bg-md-surface shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 shrink-0">
          <h2 id="drawer-title" className="min-w-0 text-2xl font-headline text-md-on-surface tracking-tight break-words">
            {title}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 bg-md-surface shadow-md border border-md-surface-variant rounded-full text-md-on-surface-variant hover:text-red-500 active:border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary transition-all"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

