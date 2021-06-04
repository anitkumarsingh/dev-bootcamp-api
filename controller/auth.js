const User = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendTokenResponse = require('../utils/setCookies');

// @description    Register user
// @route          POST /api/v1/auth/register
// @access         Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user, 201, res, 'User registered successfully!');
});

// @description    Login user
// @route          POST /api/v1/auth/login
// @access         Public
exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if email and password is provided
  if (!email || !password) {
    return next(new errorResponse('Please provide an email and password', 400));
  }

  // Checking into database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new errorResponse('Invalid cridential', 401));
  }

  const isValidPassword = await user.matchPassword(password);

  if (!isValidPassword) {
    return next(new errorResponse('Invalid cridential', 401));
  }

  sendTokenResponse(user, 200, res, 'Login successfull!');
});

// @description    Forgot password
// @route          POST /api/v1/auth/forgotpassword
// @access         Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new errorResponse(`There is no user with email id ${req.body.email}`, 404)
    );
  }
  const resetToken = user.getRestTokenPassword();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, msg: 'User found', user });
});
