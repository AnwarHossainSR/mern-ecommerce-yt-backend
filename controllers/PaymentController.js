const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/orderModel');
const stripe = require('stripe')(
  'sk_test_51MPk0OLWaDeJF2fycMjCQskMy7wlmA1ZAliCYUvq3B7j80axLAvQt13jEZLZgtiNR2Vw1y2MqJ8eMua60vDkafza00exaOSc56'
);

exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.body.orderId });

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  const items = order.orderItems.map((product) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
        currency: 'usd',
      },
      quantity: product.quantity,
    };
  });

  // success_url: `${req.protocol}://${req.get('host')}/success`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/order/${order._id}`,

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    success_url: `http://localhot:3000/checkout/success`,
    cancel_url: `http://localhot:3000/order/${order._id}`,
    metadata: {
      orderId: order._id,
    },
    mode: 'payment',
    client_reference_id: order._id,
    customer_email: order.user.email,
  });

  res.status(200).json({
    success: true,
    url: stripeSession.url,
  });
});
