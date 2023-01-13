const express = require("express");
const { createCheckoutSession } = require("../controllers/PaymentController");
const router = express.Router();

const { isAuthenticatedUser } = require("../middleware/auth");

router
  .route("/payment/checkout")
  .post(isAuthenticatedUser, createCheckoutSession);

module.exports = router;
