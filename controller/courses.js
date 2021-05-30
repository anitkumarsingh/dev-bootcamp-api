const Course = require('../models/courses');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Get all courses
// @route          GET /api/v1/courses
// @route          GET /api/v1/bootcamps/:bootcampId/courses
// @access         Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    msg: 'Courses fetched successfully',
    count: courses.length,
    data: courses
  });
});

// @description    Get single courses
// @route          GET /api/v1/courses/:id
// @access         Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new errorResponse(`Course with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: 'Course fetched successfully',
    data: course
  });
});
