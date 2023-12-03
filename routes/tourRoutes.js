const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');
// read the file

const router = express.Router();

// router.param('id', tourController.checkId);

// POST /tour/{id}/reviews
// GET /tour/{id}/reviews
//  GET /tour/{id}/reviews/{id}

router.use('/:tourId/reviews', reviewRouter);

router.route('/monthly-plan:year').get(tourController.getMonthlyPlan);
router
  .route('/tour-stats')
  .get(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getTourStats
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-distance?distance=233center=-40
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protectRoutes,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
