import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { VACCINATION_STATUS } from '../../utils/constants';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [statsDate, setStatsDate] = useState('2024-11-10');
  const [stats, setStats] = useState(null);

  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    age: '',
    ageMin: '',
    ageMax: '',
    pincode: '',
    vaccinationStatus: ''
  });

  const [tempFilters, setTempFilters] = useState({
    age: '',
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

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleClearFilters = () => {
    const cleared = {
      age: '',
      ageMin: '',
      ageMax: '',
      pincode: '',
      vaccinationStatus: ''
    };
    setTempFilters(cleared);
    setFilters(cleared);
  };

  return (
    <div className="container admin-container">
      <header className="admin-header">
        <h1>Drive Administration</h1>
        <p>Monitor registrations and vaccination progress.</p>
      </header>

      <section className="admin-section">
        <div className="section-title-row">
          <h2>Daily Statistics</h2>
          <div className="filter-group">
            <label>Select Date</label>
            <input 
              type="date" 
              value={statsDate} 
              onChange={(e) => setStatsDate(e.target.value)}
              min="2024-11-01" max="2024-11-30"
            />
          </div>
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

      <section className="admin-section">
        <h2>Registered Users</h2>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label>Exact Age</label>
            <input 
              type="number" 
              placeholder="e.g. 30" 
              value={tempFilters.age}
              onChange={(e) => setTempFilters({...tempFilters, age: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Min Age</label>
            <input 
              type="number" 
              placeholder="Enter min age" 
              value={tempFilters.ageMin}
              onChange={(e) => setTempFilters({...tempFilters, ageMin: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Max Age</label>
            <input 
              type="number" 
              placeholder="Enter max age" 
              value={tempFilters.ageMax}
              onChange={(e) => setTempFilters({...tempFilters, ageMax: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Pincode</label>
            <input 
              type="text" 
              placeholder="Enter pincode" 
              value={tempFilters.pincode}
              onChange={(e) => setTempFilters({...tempFilters, pincode: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Vaccination Status</label>
            <select 
              value={tempFilters.vaccinationStatus}
              onChange={(e) => setTempFilters({...tempFilters, vaccinationStatus: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value={VACCINATION_STATUS.NONE}>None</option>
              <option value={VACCINATION_STATUS.FIRST_DOSE_COMPLETED}>First Dose</option>
              <option value={VACCINATION_STATUS.ALL_COMPLETED}>Fully Vaccinated</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="btn-apply" onClick={handleApplyFilters}>Apply Filter</button>
            <button className="btn-clear" onClick={handleClearFilters}>Clear All</button>
          </div>
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