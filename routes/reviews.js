const express = require('express');
const router = express.Router({ mergeParams: true });
const { getReviews } = require('../controller/courses');
const Reviews = require('../models/courses');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(
      Reviews,
      { path: 'bootcamp', select: 'name description' },
      'Reviews'
    ),
    getReviews
  );

module.exports = router;
