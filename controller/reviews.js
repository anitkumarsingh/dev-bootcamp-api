const Reviews = require('../models/reviews');
const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Get all reviews
// @route          GET /api/v1/review
// @route          GET /api/v1/bootcamps/:bootcampId/reviews
// @access         Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const review = await Reviews.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      msg: 'Reviews fetched successfully',
      count: review.length,
      data: review
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
