import React from 'react';
import { Link } from 'react-router-dom';
import { FaHotel } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHotel className="logo-icon" />
          <span>Hotel Management System</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/bookings" className="nav-link">Bookings</Link>
          </li>
          <li className="nav-item">
            <Link to="/guests" className="nav-link">Guests</Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-link">Rooms</Link>
          </li>
          <li className="nav-item">
            <Link to="/staff" className="nav-link">Staff</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;