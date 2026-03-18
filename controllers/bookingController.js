const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.body;

  if (!tourId) {
    return next(new AppError('Please provide a tourId', 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const booking = await Booking.findOneAndUpdate(
    {
      tour: tourId,
      user: req.user._id,
    },
    {
      tour: tourId,
      user: req.user._id,
      price: tour.price,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).populate('tour', 'name summary difficulty duration maxGroupSize ratingsAverage ratingsQuantity imageCover price');

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('tour', 'name summary difficulty duration maxGroupSize ratingsAverage ratingsQuantity imageCover price');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});
