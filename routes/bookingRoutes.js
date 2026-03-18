const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);

module.exports = router;
