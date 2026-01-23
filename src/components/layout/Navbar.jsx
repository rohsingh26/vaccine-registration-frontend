import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import './Navbar.css';

const Navbar = () => {
  const { role, logout } = useAuth();
  const [vTime, setVTime] = useState('');

  const fetchTime = async () => {
    try {
      const res = await API.get('/system-time');
      setVTime(res.data.displayTime);
    } catch (err) {
      console.error("Navbar clock error", err);
    }
  };

  useEffect(() => {
    if (role) {
      fetchTime();
    }
  }, [role]);

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
          <div className="nav-clock">
            <span className="clock-icon">🕒</span> {vTime || 'Loading Clock...'}
          </div>
        </div>

        <div className="nav-actions">
          <div className="user-info">
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
