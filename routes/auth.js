const express = require('express');
const {
  register,
  userLogin,
  getMe,
  forgotPassword,
  resetpassword
} = require('../controller/auth');
const { protectRoutes } = require('../middleware/protectRoutes');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(userLogin);
router.route('/me').get(protectRoutes, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetpassword);

module.exports = router;
