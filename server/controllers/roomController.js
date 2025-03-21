const { Room } = require('../models');

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
  }
};

// Get a single room by ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json(room);
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({ message: 'Error retrieving room', error: error.message });
  }
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(400).json({ message: 'Error creating room', error: error.message });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    await room.update(req.body);
    res.status(200).json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(400).json({ message: 'Error updating room', error: error.message });
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    await room.destroy();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

// Get available rooms for a date range
const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;
    
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    // Find rooms that are not booked during the specified date range
    const rooms = await Room.findAll({
      where: {
        status: 'Available'
      },
      include: [
        {
          model: Room.associations.bookings.target,
          required: false,
          where: {
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
            ]
          }
        }
      ],
      having: {
        '$bookings.id$': null
      }
    });
    
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error getting available rooms:', error);
    res.status(500).json({ message: 'Error retrieving available rooms', error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms
};