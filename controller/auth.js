const Auth = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Register user
// @route          POST /api/v1/auth/register
// @access         Public

exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    msg: 'User registered successfully!'
  });
});
