const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// Routes for /api/guests
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.post('/', guestController.createGuest);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;