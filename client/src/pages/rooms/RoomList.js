import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaBed, FaWifi, FaTv, FaSnowflake, FaExpandArrowsAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { roomService } from '../../services/api';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
        setRooms(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(id);
        setRooms(rooms.filter(room => room.id !== id));
        toast.success('Room deleted successfully');
      } catch (err) {
        console.error('Error deleting room:', err);
        toast.error('Failed to delete room');
      }
    }
  };

  const filteredRooms = rooms.filter(room => {
    // Search filter
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesFilter = filter === 'All' || room.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getRoomStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Occupied':
        return 'status-occupied';
      case 'Maintenance':
        return 'status-maintenance';
      case 'Reserved':
        return 'status-reserved';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h1>Rooms</h1>
        <Link to="/rooms/add" className="add-btn">
          <FaPlus /> Add Room
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by room number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Rooms</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="no-results">
          {searchTerm || filter !== 'All' ? 'No rooms match your criteria' : 'No rooms found'}
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className={`room-status ${getRoomStatusClass(room.status)}`}>
                {room.status}
              </div>
              <div className="room-number">Room {room.roomNumber}</div>
              <div className="room-type">{room.type}</div>
              <div className="room-price">${room.pricePerNight}/night</div>
              <div className="room-capacity">
                <span>{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</span>
                <span>Floor {room.floor}</span>
              </div>
              <div className="room-amenities">
                {room.hasWifi && <FaWifi title="WiFi" />}
                {room.hasTV && <FaTv title="TV" />}
                {room.hasAirCon && <FaSnowflake title="Air Conditioning" />}
                {room.hasBalcony && <FaExpandArrowsAlt title="Balcony" />}
              </div>
              <div className="room-actions">
                <Link to={`/rooms/edit/${room.id}`} className="edit-btn">
                  <FaEdit /> Edit
                </Link>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(room.id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;