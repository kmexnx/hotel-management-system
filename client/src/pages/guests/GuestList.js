import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { guestService } from '../../services/api';
import './GuestList.css';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await guestService.getAllGuests();
        setGuests(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching guests:', err);
        setError('Failed to load guests. Please try again later.');
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestService.deleteGuest(id);
        setGuests(guests.filter(guest => guest.id !== id));
        toast.success('Guest deleted successfully');
      } catch (err) {
        console.error('Error deleting guest:', err);
        toast.error('Failed to delete guest');
      }
    }
  };

  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           guest.phone.includes(searchTerm);
  });

  if (loading) {
    return <div className="loading">Loading guests...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h1>Guests</h1>
        <Link to="/guests/add" className="add-btn">
          <FaPlus /> Add Guest
        </Link>
      </div>

      <div className="search-container">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search guests by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="no-results">
          {searchTerm ? 'No guests match your search' : 'No guests found'}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.id}</td>
                  <td>{`${guest.firstName} ${guest.lastName}`}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.country || '-'}</td>
                  <td className="actions">
                    <Link to={`/guests/edit/${guest.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(guest.id)}
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

export default GuestList;