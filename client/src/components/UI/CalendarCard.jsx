import React from 'react';

const CalendarCard = ({ time }) => {
  const year = time.getFullYear();
  const month = time.getMonth();
  const today = time.getDate();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="neu-flat rounded-3xl p-3 flex flex-col items-center justify-start text-[10px] h-40 w-full overflow-hidden">
      <div className="font-semibold mb-1 opacity-80 uppercase tracking-widest text-[9px]">Calendar</div>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-x-1 gap-y-0.5 w-full text-center mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="text-rose-400 font-medium opacity-80">{d}</div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-x-1 gap-y-[2px] w-full text-center">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-center w-4 h-4 rounded-full mx-auto ${
              day === today 
                ? 'bg-rose-400 text-white font-bold neu-pressed' 
                : day ? 'opacity-70' : ''
            }`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;
