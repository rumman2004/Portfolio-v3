import React from 'react';

const AnalogClock = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate rotations
  const secondHandRotation = seconds * 6; // 360 / 60
  const minuteHandRotation = minutes * 6 + seconds * 0.1;
  const hourHandRotation = (hours % 12) * 30 + minutes * 0.5; // 360 / 12

  return (
    <div className="relative w-32 h-32 rounded-full neu-flat flex items-center justify-center">
      {/* Clock center dot */}
      <div className="w-2 h-2 rounded-full bg-rose-400 z-10 neu-pressed"></div>
      
      {/* Hands */}
      <div 
        className="absolute w-1 h-8 bg-gray-800 rounded-full bottom-1/2 origin-bottom transform transition-transform duration-[50ms]"
        style={{ rotate: `${hourHandRotation}deg` }}
      ></div>
      <div 
        className="absolute w-[3px] h-10 bg-gray-600 rounded-full bottom-1/2 origin-bottom transform transition-transform duration-[50ms]"
        style={{ rotate: `${minuteHandRotation}deg` }}
      ></div>
      <div 
        className="absolute w-[2px] h-12 bg-rose-400 rounded-full bottom-1/2 origin-bottom transform transition-transform duration-[50ms]"
        style={{ rotate: `${secondHandRotation}deg` }}
      ></div>

      {/* Numbers */}
      <span className="absolute top-2 text-xs font-medium text-gray-400">12</span>
      <span className="absolute right-2 text-xs font-medium text-gray-400">3</span>
      <span className="absolute bottom-2 text-xs font-medium text-gray-400">6</span>
      <span className="absolute left-2 text-xs font-medium text-gray-400">9</span>
    </div>
  );
};

export default AnalogClock;
