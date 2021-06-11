const User = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Get all users
// @route          POST /api/v1/admin/users
// @access         Private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @description    Get single user
// @route          GET /api/v1/admin/users/:id
// @access         Private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new errorResponse(`No user with ${req.params.id} found`, 404));
  }
  res.status(200).json({
    success: true,
    msg: 'User fetched successfully',
    data: user
  });
});

// @description    Create user
// @route          POST /api/v1/admin/users
// @access         Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    msg: 'User created successfully!',
    data: user
  });
});

// @description    Update user details
// @route          GET /api/v1/admin/user/:id
// @access         Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    msg: 'User upated successfully!',
    data: user
  });
});

// @description    Delete user details
// @route          GET /api/v1/admin/user/:id
// @access         Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id);

  res.status(200).json({
    success: true,
    msg: 'User deleted successfully!',
    data: {}
  });
});
