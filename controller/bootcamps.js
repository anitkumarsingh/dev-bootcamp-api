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
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Create a bootcamps'
  });
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
