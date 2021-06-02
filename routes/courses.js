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
const {
  protectRoutes,
  authorizeRoles
} = require('../middleware/protectRoutes');

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
  .post(protectRoutes, authorizeRoles('Admin', 'Published'), addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protectRoutes, authorizeRoles('Admin', 'Published'), updateCourse)
  .delete(protectRoutes, authorizeRoles('Admin', 'Published'), deleteCourse);

module.exports = router;
