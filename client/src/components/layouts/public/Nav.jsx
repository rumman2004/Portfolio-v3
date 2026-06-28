import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Briefcase, MessageSquare } from 'lucide-react';
import Button from '../../UI/Button';

const Nav = () => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-10 lg:translate-x-0 w-fit z-50 backdrop-blur-2xl bg-white/40 border border-white/60 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300">
      <div className="px-4 py-2 lg:px-6 lg:py-3.5 flex justify-between items-center gap-5 sm:gap-6 lg:gap-10">
        {/* Logo */}
        <Link to="/" className="hidden lg:block text-xl font-extrabold text-gray-900 tracking-tighter hover:text-blue-500 transition-colors">
          RUMMAN<span className="text-blue-500">.</span>
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-6 lg:gap-8 text-xs sm:text-sm uppercase tracking-widest font-semibold text-gray-500">
          <Link to="/" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none">
            <Home className="w-5 h-5 shrink-0 lg:hidden" />
            <span className="hidden lg:block">Home</span>
          </Link>
          <Link to="/about" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none">
            <User className="w-5 h-5 shrink-0 lg:hidden" />
            <span className="hidden lg:block">About</span>
          </Link>
          <Link to="/works" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none">
            <Briefcase className="w-5 h-5 shrink-0 lg:hidden" />
            <span className="hidden lg:block">Works</span>
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center whitespace-nowrap">
          <Link to="/contact" className="focus:outline-none">
            <Button variant="primary" size="sm" className="!px-3 lg:!px-4">
              <MessageSquare className="w-5 h-5 shrink-0 lg:hidden" />
              <span className="hidden lg:block">Let's Talk</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;
