const Bootcamp = require('../models/bootcamp');
// @description    Get all bootcamps
// @route          GET /api/v1/bootcamps
// @access         Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({
      success: true,
      msg: 'Successfully fetched bootcamps',
      data: bootcamps
    });
  } catch (error) {
    res.status(404).json({ success: false });
  }
};

// @description    Get single bootcamp
// @route          GET /api/v1/bootcamps:id
// @access         Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp not found' });
    }
    res.status(200).json({
      success: true,
      msg: 'Bootcamp fetched successfully',
      data: bootcamp
    });
  } catch (error) {
    res.status(404).json({ success: false, msg: 'Bootcamp not found' });
  }
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
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({
      success: true,
      msg: 'Bootcamp updated successfully',
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @description    Delete a bootcamp
// @route          DELETE /api/v1/bootcamps:id
// @access         Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      msg: `Bootcamp deleted`
    });
  } catch (error) {
    res.status(200).json({
      success: false
    });
  }
};
