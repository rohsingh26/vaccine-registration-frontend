import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserAuth from './pages/auth/UserAuth';
import AdminAuth from './pages/auth/AdminAuth';
import UserDashboard from './pages/user/UserDashboard';
import BookSlot from './pages/user/BookSlot';
import EditBooking from './pages/user/EditBooking';
import AdminDashboard from './pages/admin/AdminDashboard'; // We'll create this next
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';

const PublicRoute = ({ children }) => {
  const { role } = useAuth();
  if (role === 'USER') return <Navigate to="/user/dashboard" />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  return children;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (!role || role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  const { role } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/user" element={<PublicRoute><UserAuth /></PublicRoute>} />
        <Route path="/auth/admin" element={<PublicRoute><AdminAuth /></PublicRoute>} />

        {/* User Protected Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRole="USER"><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/user/book-slot" element={
          <ProtectedRoute allowedRole="USER"><BookSlot /></ProtectedRoute>
        } />
        <Route path="/user/edit-booking/:bookingId" element={
          <ProtectedRoute allowedRole="USER"><EditBooking /></ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;