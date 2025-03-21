import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaUserTie, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { staffService } from '../../services/api';
import './StaffList.css';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getAllStaff();
        setStaff(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError('Failed to load staff members. Please try again later.');
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffService.deleteStaff(id);
        setStaff(staff.filter(s => s.id !== id));
        toast.success('Staff member deleted successfully');
      } catch (err) {
        console.error('Error deleting staff member:', err);
        toast.error('Failed to delete staff member');
      }
    }
  };

  // Get unique departments for filtering
  const departments = ['All', ...new Set(staff.map(s => s.department))];

  const filteredStaff = staff.filter(s => {
    // Search filter
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.phone.includes(searchTerm);
    
    // Department filter
    const matchesDepartment = departmentFilter === 'All' || s.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <div className="loading">Loading staff members...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="staff-list-container">
      <div className="staff-list-header">
        <h1>Staff</h1>
        <Link to="/staff/add" className="add-btn">
          <FaPlus /> Add Staff Member
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Department:</label>
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="no-results">
          {searchTerm || departmentFilter !== 'All' ? 
            'No staff members match your search criteria' : 
            'No staff members found'}
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="staff-grid">
          {filteredStaff.map(member => (
            <div key={member.id} className="staff-card">
              <div className="staff-avatar">
                <FaUserTie className="avatar-icon" />
                <div className="position-label">{member.position}</div>
              </div>
              <div className="staff-info">
                <h3 className="staff-name">{member.firstName} {member.lastName}</h3>
                <div className="staff-department">
                  <FaBuilding className="info-icon" />
                  {member.department}
                </div>
                <div className="staff-contact">
                  <div className="contact-item">
                    <FaEnvelope className="info-icon" />
                    {member.email}
                  </div>
                  <div className="contact-item">
                    <FaPhone className="info-icon" />
                    {member.phone}
                  </div>
                </div>
                <div className="staff-meta">
                  <div className="hire-date">
                    Hired: {new Date(member.hireDate).toLocaleDateString()}
                  </div>
                  <div className={`status-indicator ${member.isActive ? 'active' : 'inactive'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              <div className="staff-actions">
                <Link to={`/staff/edit/${member.id}`} className="edit-btn">
                  <FaEdit /> Edit
                </Link>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(member.id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(member => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.position}</td>
                  <td>{member.department}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{new Date(member.hireDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/staff/edit/${member.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(member.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;