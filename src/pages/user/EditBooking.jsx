import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import dayjs from 'dayjs';
import './EditBooking.css';

const EditBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('2024-11-12');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch available slots for the new date
  const fetchSlots = async (date) => {
    setLoading(true);
    try {
      const response = await API.get(`/slots?date=${date}`);
      setSlots(response.data.data);
    } catch (err) {
      setError('Could not load slots for this date.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  // 2. Handle the Reschedule (PUT request)
  const handleUpdate = async (newSlotId) => {
    if (!window.confirm("Are you sure you want to reschedule your appointment?")) return;

    try {
      await API.put(`/bookings/${bookingId}`, { newSlotId });
      alert('Appointment rescheduled successfully!');
      navigate('/user/dashboard');
    } catch (err) {
      // This is where the 24-hour rule error from your backend will appear
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container edit-booking-container">
      <div className="edit-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Cancel</button>
        <h1>Reschedule Appointment</h1>
        <p className="warning-note">
          Note: You can only reschedule up to 24 hours before your original slot.
        </p>
      </div>

      <div className="reschedule-box">
        <div className="date-picker-section">
          <label>Pick a New Date:</label>
          <input 
            type="date" 
            min="2024-11-01" 
            max="2024-11-30"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="slots-grid-wrapper">
          {loading ? (
            <p>Fetching new slots...</p>
          ) : slots.length > 0 ? (
            <div className="edit-slots-grid">
              {slots.map((slot) => (
                <div key={slot._id} className="edit-slot-item">
                  <span>{slot.startTime} - {slot.endTime}</span>
                  <button 
                    className="btn-select-slot"
                    onClick={() => handleUpdate(slot._id)}
                  >
                    Select Slot
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No available slots for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBooking;