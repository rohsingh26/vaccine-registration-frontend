import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { DOSE_TYPE, VACCINATION_STATUS } from '../../utils/constants';
import dayjs from 'dayjs';
import './BookSlot.css';

const BookSlot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('2024-11-10'); // Default to your VIRTUAL_NOW date
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine which dose the user is eligible for
  const doseToBook = user?.vaccinationStatus === VACCINATION_STATUS.NONE 
    ? DOSE_TYPE.FIRST 
    : DOSE_TYPE.SECOND;

  const fetchSlots = async (date) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/slots?date=${date}`);
      setSlots(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch slots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  const handleBooking = async (slotId) => {
    if (!window.confirm(`Confirm booking for ${doseToBook} DOSE?`)) return;

    try {
      await API.post('/bookings', { slotId, doseType: doseToBook });
      alert('Slot booked successfully!');
      navigate('/user/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="container book-slot-container">
      <div className="booking-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <h1>Schedule Vaccination</h1>
        <p>Booking for: <strong>{doseToBook} DOSE</strong></p>
      </div>

      <div className="date-selector-card">
        <label>Select Date (Nov 2024):</label>
        <input 
          type="date" 
          min="2024-11-01" 
          max="2024-11-30"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="slots-grid-container">
        {loading ? (
          <div className="loader">Searching available slots...</div>
        ) : slots.length > 0 ? (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div key={slot._id} className="slot-card">
                <div className="slot-time">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="slot-capacity">
                  <span className="count">{10 - slot.bookedCount}</span> doses left
                </div>
                <button 
                  className="btn-book-now" 
                  onClick={() => handleBooking(slot._id)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-slots">
            <p>No available slots found for this date. Try another day between Nov 1st and Nov 30th.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSlot;