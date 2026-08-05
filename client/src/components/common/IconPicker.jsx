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
    <div className="p-4 bg-md-surface-container rounded-3xl border border-md-outline-variant">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-md-on-surface-variant uppercase tracking-wider font-bold">Select Icon</p>
        <input 
          type="text" 
          placeholder="Search icons..." 
          className="bg-md-surface text-xs text-md-on-surface px-3 py-2 rounded-xl border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary outline-none placeholder:text-gray-400"
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
            className={`w-10 h-10 p-2 rounded-xl border transition-all flex items-center justify-center ${selectedImage === icon.name ? 'border-md-primary bg-md-primary-container shadow-sm ring-1 ring-md-primary' : 'border-md-surface-variant hover:border-md-outline hover:bg-md-surface-container-highest bg-md-surface'}`}
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
