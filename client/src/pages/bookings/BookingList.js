import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaBed } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookingService } from '../../services/api';
import './BookingList.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully');
      } catch (err) {
        console.error('Error deleting booking:', err);
        toast.error('Failed to delete booking');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Checked In':
        return 'status-checked-in';
      case 'Checked Out':
        return 'status-checked-out';
      case 'Cancelled':
        return 'status-cancelled';
      case 'No Show':
        return 'status-no-show';
      default:
        return '';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'payment-paid';
      case 'Pending':
        return 'payment-pending';
      case 'Partially Paid':
        return 'payment-partial';
      case 'Refunded':
        return 'payment-refunded';
      case 'Cancelled':
        return 'payment-cancelled';
      default:
        return '';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Search filter
    const guestName = `${booking.guest?.firstName || ''} ${booking.guest?.lastName || ''}`.toLowerCase();
    const roomNumber = booking.room?.roomNumber?.toLowerCase() || '';
    const bookingRef = booking.bookingReference.toLowerCase();
    
    const matchesSearch = guestName.includes(searchTerm.toLowerCase()) || 
                          roomNumber.includes(searchTerm.toLowerCase()) ||
                          bookingRef.includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || booking.bookingStatus === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.from && dateFilter.to) {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      
      matchesDate = (checkInDate >= fromDate && checkInDate <= toDate) || 
                    (checkOutDate >= fromDate && checkOutDate <= toDate);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter({ from: '', to: '' });
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-list-container">
      <div className="booking-list-header">
        <h1>Bookings</h1>
        <Link to="/bookings/add" className="add-btn">
          <FaPlus /> Add Booking
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by guest name, room number or booking reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date Range:</label>
            <div className="date-inputs">
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                placeholder="From"
              />
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                placeholder="To"
              />
            </div>
          </div>
          
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-results">
          {searchTerm || statusFilter !== 'All' || dateFilter.from || dateFilter.to ? 
            'No bookings match your search criteria' : 
            'No bookings found'}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.bookingReference}</td>
                  <td>
                    <div className="guest-cell">
                      <FaUser className="cell-icon" />
                      {booking.guest?.firstName} {booking.guest?.lastName}
                    </div>
                  </td>
                  <td>
                    <div className="room-cell">
                      <FaBed className="cell-icon" />
                      {booking.room?.roomNumber || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FaCalendarAlt className="cell-icon" />
                      {formatDate(booking.checkInDate)}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FaCalendarAlt className="cell-icon" />
                      {formatDate(booking.checkOutDate)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getPaymentStatusClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="price-cell">${booking.totalPrice}</td>
                  <td className="actions">
                    <Link to={`/bookings/edit/${booking.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(booking.id)}
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

export default BookingList;