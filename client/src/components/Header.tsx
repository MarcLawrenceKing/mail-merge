// HeaderNav.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useLogout } from '../hooks/useLogout';
import { useLocation } from 'react-router-dom';


const HeaderNav: React.FC = () => {

  const logout = useLogout();
  const location = useLocation();

  const showLogout =
    location.pathname === "/send-email" ||
    location.pathname === "/send-email/summary";

  return (
    
    <nav
      className="navbar navbar-expand-lg fixed-top bg-body">
      <div className="container">
        <a className="navbar-brand" href="/">Mail Merge</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/guide">Guide</a>
            </li>
          </ul>
            
          <ul className="navbar-nav">
            <li className="nav-item">
              <ThemeToggle />
            </li>
          </ul>
          {showLogout && (
              <button
                className="btn btn-outline-danger ms-auto"
                onClick={logout}
              >
                Logout
              </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
