import React, { useEffect, useState } from 'react';
import { useMascot } from '../../../context/MascotContext';

const NetworkStatusMascot = () => {
  const { notifyMascot } = useMascot();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Helper to handle connectivity changes
    const handleConnectionChange = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const type = connection.effectiveType;
        // Check for slow connections (slow-2g, 2g)
        if (type === 'slow-2g' || type === '2g') {
          notifyMascot("Looks like the network is a bit slow...", "confused", 6000);
        }
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      // Duration 0 means it stays until overridden
      notifyMascot("Connection lost! Did a dinosaur eat the cable?", "sad", 0);
    };

    const handleOnline = () => {
      // Only notify if we were previously offline (don't notify on initial mount if online)
      if (isOffline) {
        notifyMascot("We're back online! Let's go!", "happy", 4000);
      }
      setIsOffline(false);
      handleConnectionChange(); // Check speed once back online
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial check for slow connection on mount
    if (!isOffline) {
      handleConnectionChange();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [notifyMascot, isOffline]);

  return null; // This is a logic-only component
};

export default NetworkStatusMascot;
