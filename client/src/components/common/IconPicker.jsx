import React, { useState } from 'react';
import { iconMap, socialIconKeys } from '../../utils/iconMap';

const IconPicker = ({ onSelect, selectedImage, category }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const icons = Object.keys(iconMap)
    .filter(key => {
      if (category === 'social') return socialIconKeys.includes(key);
      if (category === 'skill') return !socialIconKeys.includes(key); // optional
      return true;
    })
    .map(key => ({
      name: key,
      url: iconMap[key]
    }));

  const filteredIcons = icons.filter(icon => icon.name.includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 bg-[#f8fafc] rounded-xl border border-gray-200 shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Select Icon</p>
        <input 
          type="text" 
          placeholder="Search icons..." 
          className="bg-white text-xs text-gray-700 px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-400 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {filteredIcons.length > 0 ? filteredIcons.map((icon, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(icon.name)}
            title={icon.name}
            className={`w-10 h-10 p-2 rounded-lg border transition-all flex items-center justify-center ${selectedImage === icon.name ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-400 bg-white shadow-sm'}`}
          >
            <img src={icon.url} alt={icon.name} className="w-6 h-6 object-contain" />
          </button>
        )) : (
          <p className="text-xs text-gray-400 w-full text-center py-4">No icons found.</p>
        )}
      </div>
    </div>
  );
};

export default IconPicker;
