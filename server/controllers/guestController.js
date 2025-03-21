const { Guest } = require('../models');

// Get all guests
const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    res.status(200).json(guests);
  } catch (error) {
    console.error('Error getting guests:', error);
    res.status(500).json({ message: 'Error retrieving guests', error: error.message });
  }
};

// Get a single guest by ID
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json(guest);
  } catch (error) {
    console.error('Error getting guest:', error);
    res.status(500).json({ message: 'Error retrieving guest', error: error.message });
  }
};

// Create a new guest
const createGuest = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(400).json({ message: 'Error creating guest', error: error.message });
  }
};

// Update a guest
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    await guest.update(req.body);
    res.status(200).json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(400).json({ message: 'Error updating guest', error: error.message });
  }
};

// Delete a guest
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    await guest.destroy();
    res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ message: 'Error deleting guest', error: error.message });
  }
};

module.exports = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
};