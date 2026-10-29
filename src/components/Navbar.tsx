import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" aria-label="60-Minute Build Challenge home">
            <span className="navbar__brand-icon"><Zap size={18} /></span>
            <span className="navbar__brand-text">60-Minute Build Challenge</span>
          </Link>

          <button
            className="navbar__toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
            {isHome && (
              <>
                <a href="#how-it-works" className="navbar__link" onClick={() => setMenuOpen(false)}>How It Works</a>
                <a href="#example-project" className="navbar__link" onClick={() => setMenuOpen(false)}>Example Project</a>
              </>
            )}
            <Link
              to="/challenge"
              className="btn btn--primary btn--sm"
              onClick={() => setMenuOpen(false)}
              id="nav-start-challenge"
            >
              Start the Challenge
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
