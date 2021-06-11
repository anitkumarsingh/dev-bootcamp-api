const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controller/users');
const User = require('../models/users');
const advancedResults = require('../middleware/advancedResults');
const {
  protectRoutes,
  authorizeRoles
} = require('../middleware/protectRoutes');

router.use(protectRoutes);
router.use(authorizeRoles('Admin'));

router
  .route('/')
  .get(advancedResults(User, ' ', 'Users'), getUsers)
  .post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
