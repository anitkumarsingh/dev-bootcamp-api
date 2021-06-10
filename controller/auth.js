const crypto = require('crypto');
const User = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendTokenResponse = require('../utils/setCookies');
const sendEmail = require('../utils/sendEmail');

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

// @description    Get user
// @route          GET /api/v1/auth/me
// @access         Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new errorResponse('No user found!', 404));
  }
  res.status(200).json({
    success: true,
    msg: 'Your profile fetched successfully!',
    data: user
  });
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
  const resetToken = await user.getRestTokenPassword();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const msg = `You are receiving this email because you (or someone else) has requested for reset of a password. Please make PUT request to the following url to reset your password \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: msg
    });
    res.status(200).json({ success: true, msg: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new errorResponse(
        `There is problem in sending email. Please contact Admin`,
        500
      )
    );
  }
});

// @description    Reset Password
// @route          PUT /api/v1/auth/resetpassword/:resettoken
// @access         Public
exports.resetpassword = asyncHandler(async (req, res, next) => {
  // create hash token
  console.log('params', req.params.resettoken);
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hax');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  console.log('user', user, resetPasswordToken);
  if (!user) {
    return next(new errorResponse('Invalid Token', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  sendTokenResponse(user, 201, res, 'User registered successfully!');
});
