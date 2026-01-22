import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { VACCINATION_STATUS } from '../../utils/constants';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Stats State
  const [statsDate, setStatsDate] = useState('2024-11-10');
  const [stats, setStats] = useState(null);
  
  // Users State
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    pincode: '',
    vaccinationStatus: ''
  });

  const fetchStats = async () => {
    try {
      const res = await API.get(`/admin/slots/stats?date=${statsDate}`);
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch error", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/admin/users?${query}`);
      setUsers(res.data.data.users);
    } catch (err) {
      console.error("User fetch error", err);
    }
  };

  useEffect(() => { fetchStats(); }, [statsDate]);
  useEffect(() => { fetchUsers(); }, [filters]);

  return (
    <div className="container admin-container">
      <header className="admin-header">
        <h1>Drive Administration</h1>
        <p>Monitor registrations and vaccination progress.</p>
      </header>

      {/* 1. Statistics Section */}
      <section className="admin-section">
        <div className="section-title-row">
          <h2>Daily Statistics</h2>
          <input 
            type="date" 
            value={statsDate} 
            onChange={(e) => setStatsDate(e.target.value)}
            min="2024-11-01" max="2024-11-30"
          />
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{stats?.total || 0}</span>
          </div>
          <div className="stat-card first-dose">
            <span className="stat-label">First Doses</span>
            <span className="stat-value">{stats?.firstDose || 0}</span>
          </div>
          <div className="stat-card second-dose">
            <span className="stat-label">Second Doses</span>
            <span className="stat-value">{stats?.secondDose || 0}</span>
          </div>
        </div>
      </section>

      {/* 2. User Management Section */}
      <section className="admin-section">
        <h2>Registered Users</h2>
        
        <div className="filter-bar">
          <input 
            type="number" placeholder="Min Age" 
            onChange={(e) => setFilters({...filters, ageMin: e.target.value})} 
          />
          <input 
            type="number" placeholder="Max Age" 
            onChange={(e) => setFilters({...filters, ageMax: e.target.value})} 
          />
          <input 
            type="text" placeholder="Pincode" 
            onChange={(e) => setFilters({...filters, pincode: e.target.value})} 
          />
          <select onChange={(e) => setFilters({...filters, vaccinationStatus: e.target.value})}>
            <option value="">All Statuses</option>
            <option value={VACCINATION_STATUS.NONE}>None</option>
            <option value={VACCINATION_STATUS.FIRST_DOSE_COMPLETED}>First Dose</option>
            <option value={VACCINATION_STATUS.ALL_COMPLETED}>Fully Vaccinated</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Pincode</th>
                <th>Aadhar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.phoneNumber}</td>
                  <td>{u.age}</td>
                  <td>{u.pincode}</td>
                  <td className="aadhar-cell">{u.aadharNumber}</td>
                  <td>
                    <span className={`status-tag ${u.vaccinationStatus.toLowerCase()}`}>
                      {u.vaccinationStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;