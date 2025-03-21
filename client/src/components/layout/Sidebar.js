import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBed, 
  FaCalendarAlt, 
  FaUserTie,
  FaChevronRight,
  FaChevronDown,
  FaPlus
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    guests: false,
    rooms: false,
    bookings: false,
    staff: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
          <FaHome /> <span>Dashboard</span>
        </Link>
        
        {/* Guests Menu */}
        <div className="sidebar-submenu">
          <div 
            className={`sidebar-item ${location.pathname.includes('/guests') ? 'active' : ''}`}
            onClick={() => toggleMenu('guests')}
          >
            <FaUsers /> <span>Guests</span>
            {expandedMenus.guests ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {expandedMenus.guests && (
            <div className="submenu">
              <Link to="/guests" className={`submenu-item ${isActive('/guests') ? 'active' : ''}`}>
                <span>All Guests</span>
              </Link>
              <Link to="/guests/add" className={`submenu-item ${isActive('/guests/add') ? 'active' : ''}`}>
                <FaPlus /> <span>Add Guest</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Rooms Menu */}
        <div className="sidebar-submenu">
          <div 
            className={`sidebar-item ${location.pathname.includes('/rooms') ? 'active' : ''}`}
            onClick={() => toggleMenu('rooms')}
          >
            <FaBed /> <span>Rooms</span>
            {expandedMenus.rooms ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {expandedMenus.rooms && (
            <div className="submenu">
              <Link to="/rooms" className={`submenu-item ${isActive('/rooms') ? 'active' : ''}`}>
                <span>All Rooms</span>
              </Link>
              <Link to="/rooms/add" className={`submenu-item ${isActive('/rooms/add') ? 'active' : ''}`}>
                <FaPlus /> <span>Add Room</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Bookings Menu */}
        <div className="sidebar-submenu">
          <div 
            className={`sidebar-item ${location.pathname.includes('/bookings') ? 'active' : ''}`}
            onClick={() => toggleMenu('bookings')}
          >
            <FaCalendarAlt /> <span>Bookings</span>
            {expandedMenus.bookings ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {expandedMenus.bookings && (
            <div className="submenu">
              <Link to="/bookings" className={`submenu-item ${isActive('/bookings') ? 'active' : ''}`}>
                <span>All Bookings</span>
              </Link>
              <Link to="/bookings/add" className={`submenu-item ${isActive('/bookings/add') ? 'active' : ''}`}>
                <FaPlus /> <span>Add Booking</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Staff Menu */}
        <div className="sidebar-submenu">
          <div 
            className={`sidebar-item ${location.pathname.includes('/staff') ? 'active' : ''}`}
            onClick={() => toggleMenu('staff')}
          >
            <FaUserTie /> <span>Staff</span>
            {expandedMenus.staff ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {expandedMenus.staff && (
            <div className="submenu">
              <Link to="/staff" className={`submenu-item ${isActive('/staff') ? 'active' : ''}`}>
                <span>All Staff</span>
              </Link>
              <Link to="/staff/add" className={`submenu-item ${isActive('/staff/add') ? 'active' : ''}`}>
                <FaPlus /> <span>Add Staff</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;