const Course = require('../models/courses');
const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @description    Get all courses
// @route          GET /api/v1/courses
// @route          GET /api/v1/bootcamps/:bootcampId/courses
// @access         Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      msg: 'Courses fetched successfully',
      count: course.length,
      data: course
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp id of ${req.params.bootcampId} not found`,
        404
      )
    );
  }
  // Checking ownship
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new errorResponse(
        `User with id ${req.user.id} is not authorized to create course`,
        401
      )
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
  if (course.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new errorResponse(
        `User with id ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
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
  if (course.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new errorResponse(
        `User with id ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }
  await Course.remove();

  res.status(200).json({
    success: true,
    msg: 'Course deleted successfully',
    data: {}
  });
});
