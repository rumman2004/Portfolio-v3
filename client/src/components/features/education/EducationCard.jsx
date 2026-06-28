import React from 'react';
import Card from '../../UI/Card';

const EducationCard = ({ education }) => {
  return (
    <Card className="p-6 relative group" glass hover>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/>
        </svg>
      </div>
      <div className="relative z-10">
        <h4 className="text-xl font-bold text-white mb-1">{education.degree}</h4>
        <p className="text-blue-400 font-medium mb-3">{education.institution}</p>
        <div className="flex justify-between items-center text-sm text-neutral-400">
          <span>{education.location}</span>
          <span className="px-3 py-1 bg-neutral-800 rounded-full">{education.startDate} - {education.endDate || 'Present'}</span>
        </div>
      </div>
    </Card>
  );
};

export default EducationCard;
