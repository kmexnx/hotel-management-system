const { Booking, Guest, Room } = require('../models');
const { Op } = require('sequelize');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room' }
      ]
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room' }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ message: 'Error retrieving booking', error: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    
    // Check if the room is available for the requested dates
    const conflictingBookings = await Booking.findAll({
      where: {
        roomId,
        [Op.or]: [
          {
            checkInDate: { [Op.between]: [checkInDate, checkOutDate] }
          },
          {
            checkOutDate: { [Op.between]: [checkInDate, checkOutDate] }
          },
          {
            [Op.and]: [
              { checkInDate: { [Op.lte]: checkInDate } },
              { checkOutDate: { [Op.gte]: checkOutDate } }
            ]
          }
        ],
        bookingStatus: {
          [Op.notIn]: ['Cancelled', 'No Show']
        }
      }
    });
    
    if (conflictingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Room is not available for the requested dates',
        conflictingBookings
      });
    }
    
    // Calculate total price based on room price and duration
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const durationInDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const totalPrice = room.pricePerNight * durationInDays;
    
    // Create the booking
    const booking = await Booking.create({
      ...req.body,
      totalPrice
    });
    
    // Update room status to reserved
    await room.update({ status: 'Reserved' });
    
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room' }
      ]
    });
    
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If changing dates or room, check availability
    if ((req.body.checkInDate || req.body.checkOutDate || req.body.roomId) && 
        req.body.bookingStatus !== 'Cancelled') {
      
      const checkInDate = req.body.checkInDate || booking.checkInDate;
      const checkOutDate = req.body.checkOutDate || booking.checkOutDate;
      const roomId = req.body.roomId || booking.roomId;
      
      // Check if the room is available for the requested dates
      const conflictingBookings = await Booking.findAll({
        where: {
          id: { [Op.ne]: booking.id }, // Exclude current booking
          roomId,
          [Op.or]: [
            {
              checkInDate: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              checkOutDate: { [Op.between]: [checkInDate, checkOutDate] }
            },
            {
              [Op.and]: [
                { checkInDate: { [Op.lte]: checkInDate } },
                { checkOutDate: { [Op.gte]: checkOutDate } }
              ]
            }
          ],
          bookingStatus: {
            [Op.notIn]: ['Cancelled', 'No Show']
          }
        }
      });
      
      if (conflictingBookings.length > 0) {
        return res.status(400).json({ 
          message: 'Room is not available for the requested dates',
          conflictingBookings
        });
      }
      
      // If changing room, update previous room status back to Available
      if (req.body.roomId && req.body.roomId !== booking.roomId) {
        const previousRoom = await Room.findByPk(booking.roomId);
        if (previousRoom) {
          await previousRoom.update({ status: 'Available' });
        }
        
        // Update new room status to Reserved
        const newRoom = await Room.findByPk(req.body.roomId);
        if (newRoom) {
          await newRoom.update({ status: 'Reserved' });
        }
      }
      
      // Recalculate total price if dates or room changed
      if (req.body.checkInDate || req.body.checkOutDate || req.body.roomId) {
        const room = await Room.findByPk(roomId);
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const durationInDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        req.body.totalPrice = room.pricePerNight * durationInDays;
      }
    }
    
    // If cancelling booking, update room status
    if (req.body.bookingStatus === 'Cancelled' && booking.bookingStatus !== 'Cancelled') {
      const room = await Room.findByPk(booking.roomId);
      if (room) {
        await room.update({ status: 'Available' });
      }
    }
    
    // Update the booking
    await booking.update(req.body);
    
    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room' }
      ]
    });
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update room status back to Available
    const room = await Room.findByPk(booking.roomId);
    if (room) {
      await room.update({ status: 'Available' });
    }
    
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

// Get bookings by guest
const getBookingsByGuest = async (req, res) => {
  try {
    const guestId = req.params.guestId;
    
    const bookings = await Booking.findAll({
      where: { guestId },
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room' }
      ]
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting guest bookings:', error);
    res.status(500).json({ message: 'Error retrieving guest bookings', error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByGuest
};