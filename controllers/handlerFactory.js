const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id, req.body);

    if (!document) {
      return next(new AppError('no our found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('no tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    //   console.log(req.body);
    // const newTour = new Tour({});
    // newTour.save();

    // or

    const document = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;
    // Tour.findOne({_id: req.params.id})
    if (!document) {
      return next(new AppError('no our found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',

      data: {
        data: document,
      },
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // TO ALLOW FOR NESTED GET REVIEWS ON TOUR(hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // const review = await Review.find(filter);
    // EXECUTE QUERY
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;
    // const document = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

// exports.getSingleTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // Tour.findOne({_id: req.params.id})

//   if (!tour) {
//     return next(new AppError('no our found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',

//     data: {
//       tour: tour,
//     },
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

//   if (!tour) {
//     return next(new AppError('no our found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
