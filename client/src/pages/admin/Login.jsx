import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '../../components/features/admin/LoginForm';

gsap.registerPlugin(useGSAP);

const Login = () => {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Cloud animations
    gsap.to('.cloud-1', { x: '10vw', y: '-2vh', duration: 15, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-2', { x: '-8vw', y: '3vh', duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-3', { x: '15vw', y: '5vh', duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    tl.from('.login-container', {
      y: 100,
      opacity: 0,
      rotationX: 45,
      rotationY: -15,
      z: -300,
      duration: 1.5,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#b3d4ff] via-[#e6f0ff] to-[#f4f7fb] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#4F46E5] selection:text-white"
    >
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full text-[#374151] font-semibold hover:bg-white/60 hover:text-[#111827] transition-all shadow-sm group font-['Inter']"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Cloudy Sky Background Elements */}
      <div className="cloud-1 absolute top-[10%] left-[5%] w-[40vw] h-[30vh] bg-white/60 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="cloud-2 absolute top-[40%] right-[10%] w-[50vw] h-[40vh] bg-white/50 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="cloud-3 absolute bottom-[-10%] left-[20%] w-[60vw] h-[50vh] bg-white/70 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* 3D Container */}
      <div className="login-container z-10 w-full max-w-5xl perspective-[1500px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

