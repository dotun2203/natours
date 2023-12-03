const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
// const router = express.Router({ mergeParams: true });

router.get(
  '/checkout-session/:tourId',
  authController.protectRoutes,
  bookingController.getCheckoutSession
);

module.exports = router;
