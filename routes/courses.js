const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controller/courses');
const Courses = require('../models/courses');
const advancedResults = require('../middleware/advancedResults');
const { protectRoutes } = require('../middleware/protectRoutes');

router
  .route('/')
  .get(
    advancedResults(
      Courses,
      { path: 'bootcamp', select: 'name description' },
      'Courses'
    ),
    getCourses
  )
  .post(protectRoutes, addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protectRoutes, updateCourse)
  .delete(protectRoutes, deleteCourse);

module.exports = router;
