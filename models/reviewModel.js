// review, rating, createdAt, ref to tour, ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'you must have a review'],
      trim: true,
    },
    rating: {
      type: Number,
      // enum: {
      //   values: [1, 2, 3, 4, 5],
      //   message: 'rating is between 1 and 5',
      // },
      default: 3,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be above 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// reviewSchema.statics.calcAverageRatings = async function (tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tour: tourId },
//     },
//     {
//       $group: {
//         _id: '$tour',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);
//   console.log(stats);
// };

// reviewSchema.pre('save', function (next) {
//   // this points to current review
//   this.constructor.calcAverageRatings(this.tour);
//   next();
// });

// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;

// POST /tour/{id}/reviews
// GET /tour/{id}/reviews
//  GET /tour/{id}/reviews/{id}
