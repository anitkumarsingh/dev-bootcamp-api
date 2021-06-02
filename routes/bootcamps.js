const express = require('express');
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
  uploadBootcampPhoto
} = require('../controller/bootcamps');
const Bootcamp = require('../models/bootcamp');
const advancedResults = require('../middleware/advancedResults');
const { protectRoutes } = require('../middleware/protectRoutes');
// Include other resourse
const coursesRouter = require('./courses');

// Re-route to other resourse
router.use('/:bootcampId/courses', coursesRouter);

router.route('/radius/:zip/:distance/:unit').get(getBootcampsWithinRadius);
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses', 'Bootcamps'), getBootcamps)
  .post(protectRoutes, createBootcamp);
router.route('/:id/photo').put(protectRoutes, uploadBootcampPhoto);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protectRoutes, updateBootcamp)
  .delete(protectRoutes, deleteBootcamp);

module.exports = router;
