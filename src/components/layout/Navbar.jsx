import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, role, logout } = useAuth();

  // If no one is logged in, we don't show the navbar on the landing/auth pages
  if (!role) return null;

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-logo">💉</span>
          <span className="brand-name">VaccineDrive</span>
          <span className={`role-badge ${role.toLowerCase()}`}>
            {role === 'ADMIN' ? 'Admin Panel' : 'User Portal'}
          </span>
        </div>

        <div className="nav-actions">
          <div className="user-info">
            <span className="welcome-text">Welcome,</span>
            <span className="display-name">
              {role === 'ADMIN' ? 'Administrator' : 'Citizen'}
            </span>
          </div>
          
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;