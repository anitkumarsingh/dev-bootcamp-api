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

// Include other resourse
const coursesRouter = require('./courses');

// Re-route to other resourse
router.use('/:bootcampId/courses', coursesRouter);

router.route('/radius/:zip/:distance/:unit').get(getBootcampsWithinRadius);
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id/photo').put(uploadBootcampPhoto);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
