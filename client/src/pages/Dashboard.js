import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaBed, FaCalendarCheck, FaUserTie } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    guests: 0,
    rooms: 0,
    bookings: 0,
    staff: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch these statistics from your API
    // For now, we'll simulate with mock data
    setTimeout(() => {
      setStats({
        guests: 156,
        rooms: 50,
        bookings: 78,
        staff: 25,
        availableRooms: 32,
        occupiedRooms: 18,
        todayCheckIns: 7,
        todayCheckOuts: 5
      });
      setLoading(false);
    }, 1000);
    
    // Uncomment to use real API
    /*
    const fetchStats = async () => {
      try {
        const guestsRes = await axios.get('/api/guests');
        const roomsRes = await axios.get('/api/rooms');
        const bookingsRes = await axios.get('/api/bookings');
        const staffRes = await axios.get('/api/staff');
        
        setStats({
          guests: guestsRes.data.length,
          rooms: roomsRes.data.length,
          bookings: bookingsRes.data.length,
          staff: staffRes.data.length,
          availableRooms: roomsRes.data.filter(room => room.status === 'Available').length,
          occupiedRooms: roomsRes.data.filter(room => room.status === 'Occupied').length,
          todayCheckIns: 0, // You would calculate this based on today's date
          todayCheckOuts: 0 // You would calculate this based on today's date
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStats();
    */
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon guests">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>{stats.guests}</h3>
            <p>Total Guests</p>
          </div>
          <Link to="/guests" className="stat-link">View All</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rooms">
            <FaBed />
          </div>
          <div className="stat-details">
            <h3>{stats.rooms}</h3>
            <p>Total Rooms</p>
          </div>
          <Link to="/rooms" className="stat-link">View All</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bookings">
            <FaCalendarCheck />
          </div>
          <div className="stat-details">
            <h3>{stats.bookings}</h3>
            <p>Total Bookings</p>
          </div>
          <Link to="/bookings" className="stat-link">View All</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon staff">
            <FaUserTie />
          </div>
          <div className="stat-details">
            <h3>{stats.staff}</h3>
            <p>Staff Members</p>
          </div>
          <Link to="/staff" className="stat-link">View All</Link>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-panel room-status">
          <h2>Room Status</h2>
          <div className="room-status-stats">
            <div className="room-stat">
              <div className="room-stat-value available">{stats.availableRooms}</div>
              <div className="room-stat-label">Available</div>
            </div>
            <div className="room-stat">
              <div className="room-stat-value occupied">{stats.occupiedRooms}</div>
              <div className="room-stat-label">Occupied</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-panel today-activity">
          <h2>Today's Activity</h2>
          <div className="today-stats">
            <div className="today-stat">
              <h4>Check-ins</h4>
              <div className="today-stat-value">{stats.todayCheckIns}</div>
            </div>
            <div className="today-stat">
              <h4>Check-outs</h4>
              <div className="today-stat-value">{stats.todayCheckOuts}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-panel quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/bookings/add" className="action-btn">New Booking</Link>
            <Link to="/guests/add" className="action-btn">Add Guest</Link>
            <Link to="/rooms/add" className="action-btn">Add Room</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;