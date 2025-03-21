const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Routes for /api/staff
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.get('/department/:department', staffController.getStaffByDepartment);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;