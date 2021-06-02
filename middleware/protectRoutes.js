const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/users');

exports.protectRoutes = asyncHandler(async (req, res, next) => {
  let token;
  console.log('token', req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Check for token existence
  if (!token) {
    return next(new errorResponse('Not authorize to access this route', 401));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECREAT);
    console.log('decode', decodedToken);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    return next(new errorResponse('Not authorize to access this route', 401));
  }
});
