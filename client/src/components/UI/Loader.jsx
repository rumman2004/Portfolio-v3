import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* True 3D Cube loader */}
      <div className="relative w-12 h-12" style={{ perspective: '400px' }}>
        <div className="w-full h-full relative" style={{
          transformStyle: 'preserve-3d',
          animation: 'tumbleCube 2.5s infinite linear'
        }}>
          {/* Cube Faces (Wireframe) */}
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'translateZ(24px)' }}></div>
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'rotateY(180deg) translateZ(24px)' }}></div>
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'rotateY(90deg) translateZ(24px)' }}></div>
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'rotateY(-90deg) translateZ(24px)' }}></div>
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'rotateX(90deg) translateZ(24px)' }}></div>
          <div className="absolute w-12 h-12 bg-transparent border-2 border-gray-800" style={{ transform: 'rotateX(-90deg) translateZ(24px)' }}></div>
        </div>
      </div>
      
      {/* Injecting keyframes directly to keep the component self-contained */}
      <style>{`
        @keyframes tumbleCube {
          0% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          100% { 
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); 
          }
        }
      `}</style>
      
      {text && <p className="text-md-on-surface-variant font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loader;

