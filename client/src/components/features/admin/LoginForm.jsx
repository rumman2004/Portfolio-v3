import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Fingerprint } from 'lucide-react';
import gsap from 'gsap';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 3D Hover Tilt Effect with GSAP
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(cardRef.current, {
      rotationY: x * 20,
      rotationX: -y * 20,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 0.8
    });
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      navigate('/admin'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full bg-white/30 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transform-gpu relative font-sans will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 3D Glass Inner Reflection */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" style={{ transform: 'translateZ(1px)' }}></div>

      <div className="text-center mb-8 relative z-10 flex flex-col items-center" style={{ transform: 'translateZ(30px)' }}>
        <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/60 mb-5">
          <Fingerprint className="w-10 h-10 text-[#4F46E5]" strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-extrabold text-[#1A1A1A] tracking-tight drop-shadow-sm font-['Inter']">
          Admin Area
        </h2>
        <p className="text-[#4b5563] mt-2 font-medium font-['Inter'] text-lg">
          Authenticate to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10" style={{ transform: 'translateZ(40px)' }}>
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <div className="group relative">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1 font-['Inter']">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="admin@example.com"
            className="w-full bg-white/40 border border-white/50 rounded-2xl px-5 py-4 text-[#1A1A1A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:bg-white/60 transition-all duration-300 font-['Inter'] shadow-sm backdrop-blur-md hover:bg-white/50"
          />
        </div>

        <div className="group relative">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1 font-['Inter']">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full bg-white/40 border border-white/50 rounded-2xl px-5 py-4 text-[#1A1A1A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:bg-white/60 transition-all duration-300 font-['Inter'] shadow-sm backdrop-blur-md hover:bg-white/50"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-gray-800 font-['Inter'] text-lg font-semibold px-6 py-4 rounded-2xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center border border-white/20"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Authenticate'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
