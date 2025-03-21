import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { guestService } from '../../services/api';
import './GuestForm.css';

const GuestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    idType: '',
    idNumber: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchGuest = async () => {
        try {
          const data = await guestService.getGuestById(id);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching guest:', err);
          setError('Failed to load guest details. Please try again later.');
          setLoading(false);
        }
      };

      fetchGuest();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      if (isEditMode) {
        await guestService.updateGuest(id, formData);
        toast.success('Guest updated successfully');
      } else {
        await guestService.createGuest(formData);
        toast.success('Guest created successfully');
      }
      navigate('/guests');
    } catch (err) {
      console.error('Error saving guest:', err);
      toast.error(isEditMode ? 'Failed to update guest' : 'Failed to create guest');
    }
  };

  if (loading) {
    return <div className="loading">Loading guest details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="guest-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Guest' : 'Add New Guest'}</h1>
        <Link to="/guests" className="back-link">
          <FaArrowLeft /> Back to Guests
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="idType">ID Type</label>
            <select
              id="idType"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
            >
              <option value="">Select ID Type</option>
              <option value="Passport">Passport</option>
              <option value="ID Card">ID Card</option>
              <option value="Driver's License">Driver's License</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaSave /> {isEditMode ? 'Update Guest' : 'Save Guest'}
          </button>
          <Link to="/guests" className="cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;