const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoutes);

router.route('/').get(reviewController.getReviews).post(
  // authController.protectRoutes,
  authController.restrictTo('user'),
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user, admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user, admin'),
    reviewController.deleteReview
  );

module.exports = router;

// router.get('/reviews', reviewController.getReviews);
// router.post('/createReview', reviewController.postReview);
// router
//   .route('/getReviews')
//   .get(authController.protectRoutes, reviewController.getReviews);
// router
//   .route('/createReview')
//   .post(
//     authController.protectRoutes,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
