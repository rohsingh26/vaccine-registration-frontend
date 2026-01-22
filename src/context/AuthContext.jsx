import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'USER' or 'ADMIN'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedUser = localStorage.getItem('userData');

    if (savedToken && savedRole) {
      setUser(savedUser ? JSON.parse(savedUser) : true);
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  // User Login logic
  const login = async (phoneNumber, password) => {
    try {
      const response = await API.post('/auth/login', { phoneNumber, password });
      const { token, vaccinationStatus } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', 'USER');
      localStorage.setItem('userData', JSON.stringify({ vaccinationStatus }));

      setUser({ vaccinationStatus });
      setRole('USER');
      navigate('/user/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Admin Login logic
  const adminLogin = async (email, password) => {
    try {
      const response = await API.post('/auth/admin/login', { email, password });
      const { token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', 'ADMIN');

      setUser(true);
      setRole('ADMIN');
      navigate('/admin/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Admin login failed' 
      };
    }
  };

  // Common Logout (Redirects to the Landing Gateway)
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, adminLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);