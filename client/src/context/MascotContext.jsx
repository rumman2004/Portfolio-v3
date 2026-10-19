import React, { useState, useCallback, useRef } from 'react';
import { MascotContext } from './mascot-context';

export const MascotProvider = ({ children }) => {
  const [mood, setMood] = useState('happy');
  const [message, setMessage] = useState('Hi! Welcome to my portfolio!');
  const [isVisible, setIsVisible] = useState(true);
  
  const timeoutRef = useRef(null);

  const notifyMascot = useCallback((newMessage, newMood = 'happy', duration = 5000) => {
    setMessage(newMessage);
    setMood(newMood);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setMessage(''); 
        setMood('neutral');
      }, duration);
    }
  }, []);

  const hideMascot = useCallback(() => setIsVisible(false), []);
  const showMascot = useCallback(() => setIsVisible(true), []);

  return (
    <MascotContext.Provider value={{ mood, setMood, message, setMessage, notifyMascot, isVisible, hideMascot, showMascot }}>
      {children}
    </MascotContext.Provider>
  );
};
