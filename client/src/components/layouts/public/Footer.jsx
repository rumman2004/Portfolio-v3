import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { resolveIcon } from '../../../utils/iconMap';
import { FaGithub } from 'react-icons/fa6';

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: profile } = useFetch('/public/profile');
  const { data: socialMedia } = useFetch('/social-media');
  
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 1000); // reset after 1s
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleAdminAccess = () => {
    if (clickCount + 1 >= 3) {
      navigate('/admin');
    } else {
      setClickCount(c => c + 1);
    }
  };

  const name = profile?.name?.split(' ')[0] || 'Rumman';
  const socialLinks = socialMedia || [];

  return (
    <footer className="w-full py-8 mt-auto flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 gap-4">
      {/* Right Pill (Socials) */}
      <div className="pointer-events-auto backdrop-blur-xl bg-white/90 border border-gray-200 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-4">
        {socialLinks.map(({ platform, url, _id }) => {
          const iconSrc = resolveIcon({ name: platform });
          return (
            <a
              key={_id || platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-0.5 transition-transform duration-300 flex items-center justify-center"
              title={platform}
            >
              {iconSrc ? (
                <img src={iconSrc} alt={platform} className="w-5 h-5 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              ) : (
                <FaGithub className="w-5 h-5 text-gray-500 hover:text-blue-500" />
              )}
            </a>
          );
        })}
      </div>

      {/* Left Pill */}
      <div 
        onClick={handleAdminAccess}
        className="pointer-events-auto backdrop-blur-xl bg-white/90 border border-gray-200 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] px-5 py-2.5 flex items-center justify-center select-none cursor-pointer"
        title="Admin Login"
      >
        <span className="text-sm font-semibold text-gray-700 tracking-wide pointer-events-none">
          &copy; {year} {name}.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

