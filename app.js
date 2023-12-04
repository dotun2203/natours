const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('view', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// SERVING STATIC FILES
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//SET  SECURITY HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SET LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'average',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

// TEST MIDDLEWARES
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

app.get('/', (req, res) => {
  res.send('welcome to the natours application');
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`cant find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;

// USERS

// get all tours
// app.get('/api/v1/tours', getAllTours);

// get single tour
// app.get('/api/v1/tours/:id', getSingleTour);

// post new tour
// app.post('/api/v1/tours', createTour);

// updating tour
// app.patch('/api/v1/tours/:id', updateTour);

// delete tours
// app.delete('/api/v1/tours/:id', deleteTour);
