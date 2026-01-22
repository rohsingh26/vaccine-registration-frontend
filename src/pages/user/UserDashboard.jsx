import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { VACCINATION_STATUS, BOOKING_STATUS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import dayjs from 'dayjs';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 2. Initialize navigate

  const fetchMyBookings = async () => {
    try {
      const response = await API.get('/bookings/me');
      setBookings(response.data.data);
    } catch (err) {
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case VACCINATION_STATUS.ALL_COMPLETED: return 'badge-success';
      case VACCINATION_STATUS.FIRST_DOSE_COMPLETED: return 'badge-partial';
      default: return 'badge-none';
    }
  };

  const formatStatus = (status) => {
    return status ? status.replace(/_/g, ' ') : 'NONE';
  };

  return (
    <div className="container dashboard-container">
      <div className="status-banner">
        <div className="status-info">
          <h1>My Vaccination Status</h1>
          <p>Official record for your registered phone number.</p>
        </div>
        <div className={`status-badge-large ${getStatusBadgeClass(user?.vaccinationStatus)}`}>
          {formatStatus(user?.vaccinationStatus)}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Need a Vaccine?</h3>
            <p>Check availability for slots between Nov 1st and Nov 30th.</p>
            <button 
              className="btn-primary-full" 
              // 3. Use navigate() instead of window.location
              onClick={() => navigate('/user/book-slot')}
              disabled={user?.vaccinationStatus === VACCINATION_STATUS.ALL_COMPLETED}
            >
              {user?.vaccinationStatus === VACCINATION_STATUS.NONE ? 'Book First Dose' : 'Book Second Dose'}
            </button>
            {user?.vaccinationStatus === VACCINATION_STATUS.ALL_COMPLETED && (
              <p className="success-msg">You are fully vaccinated! 🎉</p>
            )}
          </div>
        </div>

        <div className="bookings-section">
          <h2>My Appointments</h2>
          {error && <p className="error-text">{error}</p>}
          {loading ? (
            <p>Loading your schedule...</p>
          ) : bookings.length > 0 ? (
            <div className="booking-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-date-box">
                    <span className="month">{dayjs(booking.slotDateTime).format('MMM')}</span>
                    <span className="day">{dayjs(booking.slotDateTime).format('DD')}</span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-main">
                      <span className="dose-tag">{booking.doseType} DOSE</span>
                      <span className={`status-pill ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="time-text">
                      🕒 {dayjs(booking.slotDateTime).format('hh:mm A')}
                    </p>
                  </div>
                  {booking.status === BOOKING_STATUS.BOOKED && (
                      <button 
                        className="btn-edit"
                        // 4. Use navigate() for editing too
                        onClick={() => navigate(`/user/edit-booking/${booking._id}`)}
                      >
                        Reschedule
                      </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No vaccination appointments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;