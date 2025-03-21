import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUserTie, FaBuilding, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { staffService } from '../../services/api';
import './StaffForm.css';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: new Date(),
    salary: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Predefined options for departments and positions
  const departments = ['Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Management', 'Security', 'Accounting'];
  
  const positionsByDepartment = {
    'Front Desk': ['Receptionist', 'Front Desk Manager', 'Concierge', 'Reservation Clerk'],
    'Housekeeping': ['Housekeeper', 'Housekeeping Manager', 'Laundry Attendant', 'Room Attendant'],
    'Maintenance': ['Maintenance Technician', 'Chief Engineer', 'Maintenance Manager', 'Groundskeeper'],
    'Food & Beverage': ['Chef', 'Waiter/Waitress', 'Bartender', 'Restaurant Manager', 'Kitchen Helper'],
    'Management': ['General Manager', 'Assistant Manager', 'Operations Manager', 'HR Manager'],
    'Security': ['Security Officer', 'Security Manager', 'Night Guard'],
    'Accounting': ['Accountant', 'Finance Manager', 'Payroll Clerk', 'Financial Analyst']
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchStaff = async () => {
        try {
          const data = await staffService.getStaffById(id);
          // Convert string date to Date object
          data.hireDate = new Date(data.hireDate);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching staff member:', err);
          setError('Failed to load staff details. Please try again later.');
          setLoading(false);
        }
      };

      fetchStaff();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      hireDate: date
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
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
        await staffService.updateStaff(id, formData);
        toast.success('Staff member updated successfully');
      } else {
        await staffService.createStaff(formData);
        toast.success('Staff member added successfully');
      }
      navigate('/staff');
    } catch (err) {
      console.error('Error saving staff member:', err);
      toast.error(isEditMode ? 'Failed to update staff member' : 'Failed to add staff member');
    }
  };

  if (loading) {
    return <div className="loading">Loading staff details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="staff-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h1>
        <Link to="/staff" className="back-link">
          <FaArrowLeft /> Back to Staff
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2><FaUserTie /> Personal Information</h2>
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
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <div className="input-with-icon">
                <FaPhoneAlt className="input-icon" />
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
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2><FaBuilding /> Employment Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                disabled={!formData.department}
              >
                <option value="">-- Select Position --</option>
                {formData.department && positionsByDepartment[formData.department]?.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hireDate">Hire Date</label>
              <div className="date-picker-container">
                <DatePicker
                  selected={formData.hireDate}
                  onChange={handleDateChange}
                  className="date-picker"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <div className="input-with-icon">
                <FaMoneyBillWave className="input-icon" />
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive">Active Employee</label>
          </div>
        </div>

        <div className="form-section">
          <h2>Emergency Contact</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact Name</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
              <div className="input-with-icon">
                <FaPhoneAlt className="input-icon" />
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaSave /> {isEditMode ? 'Update Staff Member' : 'Add Staff Member'}
          </button>
          <Link to="/staff" className="cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;