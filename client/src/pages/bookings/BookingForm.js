import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaCalendarAlt, FaUser, FaBed, FaMoneyBillWave } from 'react-icons/fa';
import { bookingService, guestService, roomService } from '../../services/api';
import './BookingForm.css';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    guestId: '',
    roomId: '',
    checkInDate: new Date(),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    numberOfGuests: 1,
    paymentStatus: 'Pending',
    bookingStatus: 'Confirmed',
    paymentMethod: '',
    specialRequests: '',
    bookingReference: ''
  });
  
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRooms, setFetchingRooms] = useState(false);
  const [error, setError] = useState(null);
  const [totalNights, setTotalNights] = useState(1);
  const [roomPrice, setRoomPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch guests
        const guestsData = await guestService.getAllGuests();
        setGuests(guestsData);
        
        // Fetch all rooms for dropdown in edit mode
        const roomsData = await roomService.getAllRooms();
        setRooms(roomsData);
        
        // If we're in edit mode, fetch the booking data
        if (isEditMode) {
          const bookingData = await bookingService.getBookingById(id);
          
          // Convert string dates to Date objects
          bookingData.checkInDate = new Date(bookingData.checkInDate);
          bookingData.checkOutDate = new Date(bookingData.checkOutDate);
          
          setFormData(bookingData);
          
          // Find the room price
          const room = roomsData.find(r => r.id === bookingData.roomId);
          if (room) {
            setRoomPrice(room.pricePerNight);
          }
        } else {
          // In create mode, fetch available rooms for the default date range
          fetchAvailableRooms(formData.checkInDate, formData.checkOutDate);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load form data. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  // Calculate total nights and price whenever dates or room changes
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const nights = Math.ceil(
        (formData.checkOutDate - formData.checkInDate) / (1000 * 60 * 60 * 24)
      );
      setTotalNights(nights > 0 ? nights : 0);
      
      const total = roomPrice * (nights > 0 ? nights : 0);
      setTotalPrice(total);
      
      // Update form data with the calculated total price
      setFormData(prev => ({
        ...prev,
        totalPrice: total
      }));
    }
  }, [formData.checkInDate, formData.checkOutDate, roomPrice]);

  const fetchAvailableRooms = async (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return;
    
    setFetchingRooms(true);
    try {
      // Format dates for the API
      const checkInStr = checkIn.toISOString().split('T')[0];
      const checkOutStr = checkOut.toISOString().split('T')[0];
      
      const availableRooms = await roomService.getAvailableRooms(checkInStr, checkOutStr);
      setAvailableRooms(availableRooms);
      
      // If the currently selected room is not available, clear the selection
      if (formData.roomId && !availableRooms.some(room => room.id === formData.roomId)) {
        setFormData({
          ...formData,
          roomId: ''
        });
        setRoomPrice(0);
      }
      
      setFetchingRooms(false);
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      toast.error('Failed to fetch available rooms');
      setFetchingRooms(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // When room changes, update the room price
    if (name === 'roomId' && value) {
      const selectedRoom = rooms.find(room => room.id === parseInt(value) || room.id === value);
      if (selectedRoom) {
        setRoomPrice(selectedRoom.pricePerNight);
      }
    }
  };

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // If dates change, fetch available rooms again
    if (!isEditMode) {
      const checkIn = name === 'checkInDate' ? date : formData.checkInDate;
      const checkOut = name === 'checkOutDate' ? date : formData.checkOutDate;
      
      if (checkIn && checkOut) {
        fetchAvailableRooms(checkIn, checkOut);
      }
    }
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
    if (!formData.guestId || !formData.roomId) {
      toast.error('Please select a guest and a room');
      return;
    }
    
    if (formData.checkInDate >= formData.checkOutDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }
    
    try {
      if (isEditMode) {
        await bookingService.updateBooking(id, formData);
        toast.success('Booking updated successfully');
      } else {
        await bookingService.createBooking(formData);
        toast.success('Booking created successfully');
      }
      navigate('/bookings');
    } catch (err) {
      console.error('Error saving booking:', err);
      toast.error(isEditMode ? 'Failed to update booking' : 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading booking form...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</h1>
        <Link to="/bookings" className="back-link">
          <FaArrowLeft /> Back to Bookings
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2><FaUser /> Guest Information</h2>
          <div className="form-group">
            <label htmlFor="guestId">Select Guest *</label>
            <select
              id="guestId"
              name="guestId"
              value={formData.guestId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Guest --</option>
              {guests.map(guest => (
                <option key={guest.id} value={guest.id}>
                  {guest.firstName} {guest.lastName} ({guest.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions-inline">
            <Link to="/guests/add" className="add-link">
              + Add New Guest
            </Link>
          </div>
        </div>

        <div className="form-section">
          <h2><FaCalendarAlt /> Booking Dates</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Check-In Date *</label>
              <div className="date-picker-container">
                <DatePicker
                  selected={formData.checkInDate}
                  onChange={date => handleDateChange(date, 'checkInDate')}
                  minDate={new Date()}
                  className="date-picker"
                  dateFormat="MMMM d, yyyy"
                  required
                />
                <FaCalendarAlt className="date-icon" />
              </div>
            </div>
            <div className="form-group">
              <label>Check-Out Date *</label>
              <div className="date-picker-container">
                <DatePicker
                  selected={formData.checkOutDate}
                  onChange={date => handleDateChange(date, 'checkOutDate')}
                  minDate={new Date(formData.checkInDate.getTime() + 86400000)} // checkInDate + 1 day
                  className="date-picker"
                  dateFormat="MMMM d, yyyy"
                  required
                />
                <FaCalendarAlt className="date-icon" />
              </div>
            </div>
          </div>
          
          <div className="booking-summary">
            <div className="summary-item">
              <span className="summary-label">Total Nights:</span>
              <span className="summary-value">{totalNights}</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2><FaBed /> Room Selection</h2>
          <div className="form-group">
            <label htmlFor="roomId">Select Room *</label>
            {fetchingRooms ? (
              <div className="loading-rooms">Loading available rooms...</div>
            ) : (
              <select
                id="roomId"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a Room --</option>
                {isEditMode ? (
                  // In edit mode, show all rooms
                  rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} - {room.type} (${room.pricePerNight}/night)
                    </option>
                  ))
                ) : (
                  // In create mode, show only available rooms
                  availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} - {room.type} (${room.pricePerNight}/night)
                    </option>
                  ))
                )}
              </select>
            )}
            {!isEditMode && availableRooms.length === 0 && !fetchingRooms && (
              <div className="no-rooms-message">
                No rooms available for the selected dates. Please try different dates.
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="numberOfGuests">Number of Guests *</label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleNumberChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2><FaMoneyBillWave /> Payment Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Refunded">Refunded</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">-- Select Payment Method --</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookingStatus">Booking Status</label>
              <select
                id="bookingStatus"
                name="bookingStatus"
                value={formData.bookingStatus}
                onChange={handleChange}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Price</label>
              <div className="price-display">${totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={!formData.roomId || !formData.guestId}>
            <FaSave /> {isEditMode ? 'Update Booking' : 'Create Booking'}
          </button>
          <Link to="/bookings" className="cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;