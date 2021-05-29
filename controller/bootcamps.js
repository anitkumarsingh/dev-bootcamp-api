const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocode = require('../utils/geoCoder');

// @description    Get all bootcamps
// @route          GET /api/v1/bootcamps
// @access         Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query = JSON.stringify(req.query).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  const bootcamps = await Bootcamp.find(JSON.parse(query));

  res.status(200).json({
    success: true,
    msg: 'Successfully fetched bootcamps',
    data: bootcamps,
    count: bootcamps.length
  });
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
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
