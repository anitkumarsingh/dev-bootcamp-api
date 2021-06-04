const express = require('express');
const { register, userLogin, forgotPassword } = require('../controller/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(userLogin);
router.route('/forgotpassword').post(forgotPassword);

module.exports = router;
