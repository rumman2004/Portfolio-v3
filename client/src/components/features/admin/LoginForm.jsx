import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import gsap from 'gsap';
import { JellyBlobMascot } from 'feral-blob';
import 'feral-blob/blob.css';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blobMood, setBlobMood] = useState('neutral');
  const [blobGaze, setBlobGaze] = useState({ x: 0, y: 0 });
  const [blobMessage, setBlobMessage] = useState('Waiting for you...');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleEmailChange = (e) => {
    setCredentials({ ...credentials, email: e.target.value });
    // Adjust gaze: start a bit left, move right as they type
    setBlobGaze({ x: Math.min(30, e.target.value.length * 1.5 - 15), y: 10 });
    if (blobMood !== 'happy') setBlobMood('happy');
  };

  const handlePasswordChange = (e) => {
    setCredentials({ ...credentials, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBlobMood('hmm');
    try {
      await login(credentials);
      setBlobMood('happy');
      navigate('/admin'); // Redirect to dashboard on success
    } catch (err) {
      setBlobMood('angry');
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
      className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 bg-white/30 backdrop-blur-2xl p-8 sm:p-12 md:p-16 rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transform-gpu relative font-sans will-change-transform max-w-5xl mx-auto"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <style>
        {`
          @keyframes float-sync {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .float-group {
            animation: float-sync 4s ease-in-out infinite;
          }
          @keyframes pop-bubble {
            0% { transform: scale(0.9) translateY(5px); opacity: 0; }
            50% { transform: scale(1.05) translateY(-2px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-pop {
            animation: pop-bubble 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
      </style>

      {/* 3D Glass Inner Reflection */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" style={{ transform: 'translateZ(1px)' }}></div>

      {/* Left side: Mascot and Message */}
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[300px] order-1 md:order-none" style={{ transform: 'translateZ(40px)' }}>
        <div className="float-group relative flex flex-col items-center">
          
          {/* Speech Bubble */}
          <div 
            key={blobMessage}
            className="animate-pop relative z-20 mb-4 transform origin-bottom"
          >
            <div className="bg-[#2e2e32] text-white text-[15px] sm:text-base font-semibold py-3 px-6 rounded-[1.25rem] shadow-xl border border-white/10 tracking-tight text-center max-w-[250px]">
              {blobMessage}
            </div>
            <div className="absolute -bottom-[6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2e2e32] border-r border-b border-white/10 rotate-45 z-0"></div>
          </div>

          {/* Mascot */}
          <div className="w-56 h-56 md:w-80 md:h-80 relative flex items-center justify-center pointer-events-auto z-10">
            <div className="absolute inset-0 bg-[#4F46E5]/15 rounded-full blur-[80px] pointer-events-none -z-10" />
            <JellyBlobMascot
              mood={blobMood}
              gaze={blobGaze}
              onOverpoke={() => { setBlobMood('angry'); setBlobMessage("Hey! Stop poking me!"); }}
            />
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 w-full max-w-md order-2 md:order-none" style={{ transform: 'translateZ(30px)' }}>
        <div className="text-center md:text-left mb-8">
          <h2 className="text-4xl font-extrabold text-[#111827] tracking-tight drop-shadow-sm font-['Inter']">
            Admin Area
          </h2>
          <p className="text-[#4b5563] mt-2 font-medium font-['Inter'] text-lg">
            Authenticate to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-3xl text-sm text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <div className="group relative">
            <label className="block text-sm font-bold text-[#374151] mb-2 ml-1 font-['Inter']">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleEmailChange}
              onFocus={() => { setBlobMood('happy'); setBlobMessage("Hmm, let's see..."); setBlobGaze({ x: Math.min(30, credentials.email.length * 1.5 - 15), y: 10 }); }}
              onBlur={() => { setBlobMood('neutral'); setBlobMessage("Waiting for you..."); setBlobGaze({ x: 0, y: 0 }); }}
              required
              placeholder="you@example.com"
              className="w-full bg-white/40 border border-white/60 rounded-2xl px-5 py-4 text-[#111827] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 transition-all duration-300 font-['Inter'] shadow-sm hover:bg-white/60 backdrop-blur-md"
            />
          </div>

          <div className="group relative">
            <label className="block text-sm font-bold text-[#374151] mb-2 ml-1 font-['Inter']">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handlePasswordChange}
                onFocus={() => { 
                  if (showPassword) {
                    setBlobMood('sideEye'); 
                    setBlobMessage('I see what you did there...');
                  } else {
                    setBlobMood('password'); 
                    setBlobMessage("Shh, it's a secret!"); 
                  }
                  setBlobGaze({ x: 0, y: 0 }); 
                }}
                onBlur={() => { setBlobMood('neutral'); setBlobMessage("Waiting for you..."); }}
                required
                placeholder="••••••••"
                className="w-full bg-white/40 border border-white/60 rounded-2xl pl-5 pr-12 py-4 text-[#111827] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 transition-all duration-300 font-['Inter'] shadow-sm hover:bg-white/60 backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => {
                  const isShowing = !showPassword;
                  setShowPassword(isShowing);
                  if (isShowing) {
                    setBlobMood('sideEye');
                    setBlobMessage('I see what you did there...');
                  } else {
                    setBlobMood('password');
                    setBlobMessage("Shh, it's a secret!");
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            onMouseEnter={() => { if(!loading) { setBlobMood('happy'); setBlobMessage("Ready to login!"); } }}
            onMouseLeave={() => { if(!loading) { setBlobMood('neutral'); setBlobMessage("Waiting for you..."); } }}
            className="w-full mt-8 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-['Inter'] text-lg font-semibold px-6 py-4 rounded-2xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center border border-white/20"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Authenticate'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;


