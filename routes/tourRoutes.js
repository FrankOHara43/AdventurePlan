const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect } = require('./../middleware/authMiddleware');

const router = express.Router();

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get(
  '/top-5-cheap',
  tourController.aliasTopTours,
  tourController.getAllTours
);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(protect, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(protect, tourController.updateTour)
  .delete(protect, tourController.deleteTour);

module.exports = router;
