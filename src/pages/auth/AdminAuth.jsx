import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box admin-border">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to Selection
        </button>

        <div className="admin-badge">ADMIN PANEL</div>
        <h2>Admin Access</h2>
        <p className="auth-subtitle">
          Enter your administrative credentials to manage the vaccination drive.
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email}
              required 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@vaccinedrive.gov" 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              required 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="auth-btn admin-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>This area is restricted to authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;