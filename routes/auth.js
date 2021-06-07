const express = require('express');
const {
  register,
  userLogin,
  forgotPassword,
  restpassword
} = require('../controller/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(userLogin);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(restpassword);

module.exports = router;
