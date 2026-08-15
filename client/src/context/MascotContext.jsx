import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const MascotContext = createContext();

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
};

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
