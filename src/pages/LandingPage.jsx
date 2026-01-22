import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <header className="landing-header">
          <h1>VaccineDrive</h1>
          <p>Secure your health by booking your vaccination slot today.</p>
        </header>

        <div className="selection-grid">
          {/* User Portal Card */}
          <div className="portal-card user-portal" onClick={() => navigate('/auth/user')}>
            <div className="icon-circle">👤</div>
            <h2>User Portal</h2>
            <p>Register, login, and book your vaccination slots easily.</p>
            <button className="btn-portal">Login as User</button>
          </div>

          {/* Admin Portal Card */}
          <div className="portal-card admin-portal" onClick={() => navigate('/auth/admin')}>
            <div className="icon-circle">🛡️</div>
            <h2>Admin Portal</h2>
            <p>Manage slots, view statistics, and monitor registrations.</p>
            <button className="btn-portal">Login as Admin</button>
          </div>
        </div>
      </div>
      
      <footer className="landing-footer">
        <p>&copy; Vaccine Drive. Nov 1st 2024 - Nov 30th 2024.</p>
        <p>Rohit Kumar Singh</p>
      </footer>
    </div>
  );
};

export default LandingPage;