const Course = require('../models/courses');
const Bootcamp = require('../models/bootcamp');
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

// @description    Get add course
// @route          GET /api/v1/bootcamps/:bootcampId/courses
// @access         Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp id of ${req.params.id} not found`, 404)
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    msg: 'Course added successfully',
    data: course
  });
});

// @description    Update course
// @route          PUT /api/v1/courses/:id
// @access         Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new errorResponse(`No course with id of ${req.params.id} found`, 404)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    msg: 'Course updated successfully',
    data: course
  });
});

// @description    Delete course
// @route          DELETE /api/v1/courses/:id
// @access         Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new errorResponse(`No course with id of ${req.params.id} found`, 404)
    );
  }
  await Course.remove();

  res.status(200).json({
    success: true,
    msg: 'Course deleted successfully',
    data: {}
  });
});
