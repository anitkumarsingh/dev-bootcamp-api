const Auth = require('../models/users');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Register user
// @route          POST /api/v1/auth/register
// @access         Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await Auth.create({
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
