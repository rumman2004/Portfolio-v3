import React from 'react';

const SkillCard = ({ skill }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] transition-all duration-300 group">
      <div className="w-16 h-16 mb-4 p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-100">
        {skill.image ? (
          <img src={skill.image} alt={skill.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform" />
        ) : (
          <span className="text-xl font-bold text-gray-400">{skill.name.charAt(0)}</span>
        )}
      </div>
      <h4 className="text-gray-800 font-medium text-center text-sm">{skill.name}</h4>
    </div>
  );
};

export default SkillCard;
