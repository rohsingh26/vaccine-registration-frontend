import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import './Auth.css';

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    age: '',
    pincode: '',
    aadharNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const result = await login(formData.phoneNumber, formData.password);
      if (!result.success) setError(result.message);
    } else {
      try {
        await API.post('/auth/register', formData);
        setIsLogin(true);
        alert('Registration successful! Please login.');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to Selection
        </button>

        <h2>{isLogin ? 'User Login' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back! Please enter your details.' : 'Join the vaccination drive today.'}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" required onChange={handleChange} placeholder="John Doe" />
            </div>
          )}

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" required onChange={handleChange} placeholder="10-digit number" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required onChange={handleChange} placeholder="••••••••" />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" required onChange={handleChange} placeholder="e.g. 25" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" required onChange={handleChange} placeholder="6 digits" />
              </div>
              <div className="form-group">
                <label>Aadhar Number</label>
                <input type="text" name="aadharNumber" required onChange={handleChange} placeholder="12-digit UID" />
              </div>
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;