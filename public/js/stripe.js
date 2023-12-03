import axios from 'axios';

const stripe = Stripe(
  'pk_test_51ODqPBDC5WfRr0sRbkI5ocXay7ClVDh77n646blkG9QM8U0fCTchdiHo0r35uZpdWpqeXVrAn0mIlr0g7IBNJkw800knoPTjmp'
);

export const bookTour = async (tourId) => {
  // 1) get checkout session from API
  const session = await axios(
    `http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourId}`
  );
  // 2) create checkout form + charge credit card
};
