const { Staff } = require('../models');

// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error getting staff:', error);
    res.status(500).json({ message: 'Error retrieving staff', error: error.message });
  }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error getting staff member:', error);
    res.status(500).json({ message: 'Error retrieving staff member', error: error.message });
  }
};

// Create a new staff member
const createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(400).json({ message: 'Error creating staff member', error: error.message });
  }
};

// Update a staff member
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    await staff.update(req.body);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(400).json({ message: 'Error updating staff member', error: error.message });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    await staff.destroy();
    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Error deleting staff member', error: error.message });
  }
};

// Get staff by department
const getStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const staff = await Staff.findAll({
      where: { department }
    });
    
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error getting staff by department:', error);
    res.status(500).json({ message: 'Error retrieving staff by department', error: error.message });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByDepartment
};