import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaWifi, FaTv, FaSnowflake, FaExpandArrowsAlt } from 'react-icons/fa';
import { roomService } from '../../services/api';
import './RoomForm.css';

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    pricePerNight: '',
    capacity: 1,
    description: '',
    status: 'Available',
    floor: 1,
    hasWifi: true,
    hasTV: true,
    hasAirCon: true,
    hasBalcony: false,
    images: []
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        try {
          const data = await roomService.getRoomById(id);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching room:', err);
          setError('Failed to load room details. Please try again later.');
          setLoading(false);
        }
      };

      fetchRoom();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Convert string to number for numeric fields
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.roomNumber || !formData.type || !formData.pricePerNight) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Make sure price is a positive number
    if (formData.pricePerNight <= 0) {
      toast.error('Price per night must be greater than zero');
      return;
    }

    try {
      if (isEditMode) {
        await roomService.updateRoom(id, formData);
        toast.success('Room updated successfully');
      } else {
        await roomService.createRoom(formData);
        toast.success('Room created successfully');
      }
      navigate('/rooms');
    } catch (err) {
      console.error('Error saving room:', err);
      toast.error(isEditMode ? 'Failed to update room' : 'Failed to create room');
    }
  };

  if (loading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="room-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Room' : 'Add New Room'}</h1>
        <Link to="/rooms" className="back-link">
          <FaArrowLeft /> Back to Rooms
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="roomNumber">Room Number *</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Room Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Twin">Twin</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Family">Family</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pricePerNight">Price Per Night ($) *</label>
            <input
              type="number"
              id="pricePerNight"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleNumberChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleNumberChange}
              min="1"
              max="10"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="floor">Floor</label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleNumberChange}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-grid">
            <div className="amenity-item">
              <input
                type="checkbox"
                id="hasWifi"
                name="hasWifi"
                checked={formData.hasWifi}
                onChange={handleChange}
              />
              <label htmlFor="hasWifi" className="checkbox-label">
                <FaWifi /> WiFi
              </label>
            </div>
            <div className="amenity-item">
              <input
                type="checkbox"
                id="hasTV"
                name="hasTV"
                checked={formData.hasTV}
                onChange={handleChange}
              />
              <label htmlFor="hasTV" className="checkbox-label">
                <FaTv /> TV
              </label>
            </div>
            <div className="amenity-item">
              <input
                type="checkbox"
                id="hasAirCon"
                name="hasAirCon"
                checked={formData.hasAirCon}
                onChange={handleChange}
              />
              <label htmlFor="hasAirCon" className="checkbox-label">
                <FaSnowflake /> Air Conditioning
              </label>
            </div>
            <div className="amenity-item">
              <input
                type="checkbox"
                id="hasBalcony"
                name="hasBalcony"
                checked={formData.hasBalcony}
                onChange={handleChange}
              />
              <label htmlFor="hasBalcony" className="checkbox-label">
                <FaExpandArrowsAlt /> Balcony
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaSave /> {isEditMode ? 'Update Room' : 'Save Room'}
          </button>
          <Link to="/rooms" className="cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;