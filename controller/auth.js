const User = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

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
  const token = user.getSignedToken();
  res.status(201).json({
    msg: 'User registered successfully!',
    data: user,
    token
  });
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
  const token = user.getSignedToken();

  const isValidPassword = await user.matchPassword(password);

  if (!isValidPassword) {
    return next(new errorResponse('Invalid cridential', 401));
  }

  res.status(200).json({
    msg: 'Login successfull!',
    token
  });
});
