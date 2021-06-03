const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocode = require('../utils/geoCoder');
const path = require('path');

// @description    Get all bootcamps
// @route          GET /api/v1/bootcamps
// @access         Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @description    Get single bootcamp
// @route          GET /api/v1/bootcamps:id
// @access         Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: 'Bootcamp fetched successfully',
    data: bootcamp
  });
});

// @description    Create a bootcamp
// @route          POST /api/v1/bootcamps
// @access         Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // get logged in user ID and add to req.body.user
  req.body.user = req.user.id;

  //Allowing only user with role Admin to create multiple bootcamps,other user with different role will create only one bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  if (publishedBootcamp && req.user.role !== 'Admin') {
    return next(
      new errorResponse(
        `User with id ${req.user.id} and role ${req.user.role} has already created one bootcamp`,
        403
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({
    success: true,
    msg: 'Create a bootcamps',
    data: bootcamp
  });
});

// @description    Update a bootcamp
// @route          PUT /api/v1/bootcamps:id
// @access         Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: 'Bootcamp updated successfully',
    data: bootcamp
  });
});

// @description    Delete a bootcamp
// @route          DELETE /api/v1/bootcamps:id
// @access         Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();

  res.status(200).json({
    success: true,
    msg: `Bootcamp deleted`
  });
});

// @description    get a bootcamp within Radius
// @route          GET /api/v1/bootcamps/radius/:zip/:distance/:unit
// @access         Public
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { distance, zip, unit } = req.params;
  // get lat,lng from geocode
  const loc = await geocode.geocode(zip);
  console.log('loca', distance, zip, unit);
  const lnt = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius by dividing by Earth's radians
  // Earth's radian 3,963 mi / 6378 Kilo meter
  let radius;
  if (unit === 'km') {
    radius = distance / 6378;
  } else if (unit === 'mi') {
    radius = distance / 3963;
  }
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lnt], radius] } }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @description    Upload a photo
// @route          PUT /api/v1/bootcamps:id/photo
// @access         Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new errorResponse(`Please upload file`, 400));
  }
  const file = req.files.files;

  // Checking if file type is image
  if (!file.mimetype.startsWith('image')) {
    return next(new errorResponse(`Please upload image file`, 400));
  }
  // File size checking
  if (file.size > process.env.FILE_UPLOAD_SIZE) {
    return next(
      new errorResponse(
        `Please upload image file of size less than ${process.env.FILE_UPLOAD_SIZE}`,
        400
      )
    );
  }
  // create custom file name
  file.name = `bootcamp_photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new errorResponse(`Problem with file upload`, 500));
    }
    // updating bootcamp with photo
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      msg: 'File uploaded successfully!'
    });
  });
});
