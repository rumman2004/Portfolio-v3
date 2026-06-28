import React from 'react';

const SocialMediaCard = ({ link }) => {
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
        {/* Render icon based on link.icon or a default generic one */}
        <span className="font-bold">{link.platform.charAt(0)}</span>
      </div>
      <div>
        <h4 className="text-gray-900 font-bold text-lg">{link.platform}</h4>
        <p className="text-gray-500 text-sm truncate max-w-[150px]">{link.url.replace(/^https?:\/\//, '')}</p>
      </div>
    </a>
  );
};

export default SocialMediaCard;
