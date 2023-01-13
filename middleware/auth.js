const ErrorHander = require('../utils/errorhander');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //const { token } = req.cookies;
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(new ErrorHander('Please Login to access this resource', 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `'${req.user.role}' role is not allowed to access this resource `,
          403
        )
      );
    }

    next();
  };
};
