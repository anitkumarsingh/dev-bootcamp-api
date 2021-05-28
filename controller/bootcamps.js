const Bootcamp = require('../models/bootcamp');
// @description    Get all bootcamps
// @route          GET /api/v1/bootcamps
// @access         Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all bootcamps',
    hello: req.hello
  });
};

// @description    Get single bootcamp
// @route          GET /api/v1/bootcamps:id
// @access         Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Get single bootcamps'
  });
};

// @description    Create a bootcamp
// @route          POST /api/v1/bootcamps
// @access         Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({
      success: true,
      msg: 'Create a bootcamps',
      data: bootcamp
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ success: false });
  }
};

// @description    Update a bootcamp
// @route          PUT /api/v1/bootcamps:id
// @access         Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update a bootcamp ${req.params.id}`
  });
};

// @description    Delete a bootcamp
// @route          DELETE /api/v1/bootcamps:id
// @access         Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete a bootcamps ${req.params.id}`
  });
};
