import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, MessageSquare } from 'lucide-react';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/',        label: 'Home',  Icon: Home      },
    { to: '/about',   label: 'About', Icon: User      },
    { to: '/works',   label: 'Works', Icon: Briefcase },
  ];

  return (
    <>
      {/* Inject keyframes + glass styles once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

        .lg-nav {
          font-family: 'Inter', sans-serif;
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 1024px) {
          .lg-nav { left: auto; right: 2.5rem; transform: none; }
        }

        /* ── Liquid glass pill ── */
        .lg-glass {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 6px 6px 6px 20px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow:
            0 8px 32px rgba(99,102,241,0.10),
            0 1.5px 0px rgba(255,255,255,0.7) inset,
            0 -1px 0px rgba(255,255,255,0.15) inset;
          transition: box-shadow 0.4s ease, background 0.4s ease;
        }
        .lg-glass:hover {
          background: rgba(255,255,255,0.26);
          box-shadow:
            0 12px 40px rgba(99,102,241,0.15),
            0 1.5px 0px rgba(255,255,255,0.8) inset,
            0 -1px 0px rgba(255,255,255,0.2) inset;
        }

        /* ── Logo ── */
        .lg-logo {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0f172a;
          text-decoration: none;
          margin-right: 24px;
          transition: color 0.2s;
        }
        .lg-logo:hover { color: #6366f1; }
        .lg-logo span { color: #6366f1; }

        /* ── Nav links ── */
        .lg-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-right: 10px;
        }
        .lg-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #374151;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .lg-link:hover {
          color: #6366f1;
          background: rgba(99,102,241,0.08);
        }
        .lg-link.active {
          color: #6366f1;
          background: rgba(99,102,241,0.10);
        }
        .lg-link svg { flex-shrink: 0; }

        /* ── CTA button (liquid glass style) ── */
        .lg-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-decoration: none;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%);
          box-shadow:
            0 4px 15px rgba(99,102,241,0.35),
            0 1px 0 rgba(255,255,255,0.25) inset;
          border: 1px solid rgba(255,255,255,0.3);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .lg-cta:hover {
          transform: translateY(-1px);
          box-shadow:
            0 8px 25px rgba(99,102,241,0.45),
            0 1px 0 rgba(255,255,255,0.3) inset;
        }
        .lg-cta:active { transform: translateY(0) scale(0.97); }

        /* mobile: icons only */
        .lg-link-label { display: none; }
        @media (min-width: 1024px) {
          .lg-link-label { display: inline; }
          .lg-link-icon  { display: none; }
          .lg-logo-wrap  { display: flex !important; }
          .lg-cta-icon   { display: none; }
          .lg-cta-label  { display: inline !important; }
        }
        .lg-cta-label { display: none; }
      `}</style>

      <header className="lg-nav">
        <div className="lg-glass">
          {/* Logo */}
          <Link to="/" className="lg-logo lg-logo-wrap" style={{ display: 'none' }}>
            RUMMAN<span>.</span>
          </Link>

          {/* Links */}
          <nav className="lg-links">
            {links.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`lg-link${location.pathname === to ? ' active' : ''}`}
              >
                <Icon className="lg-link-icon" size={18} />
                <span className="lg-link-label">{label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link to="/contact" className="lg-cta">
            <MessageSquare className="lg-cta-icon" size={17} />
            <span className="lg-cta-label">Let's Talk</span>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Nav;