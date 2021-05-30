const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocode = require('../utils/geoCoder');

// @description    Get all bootcamps
// @route          GET /api/v1/bootcamps
// @access         Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // create copy of req.query
  let reqQuery = { ...req.query };
  // exclude fields

  const removedFields = ['select', 'sort', 'page', 'limit'];
  // Loop through removedFields and delete field from req.query
  removedFields.forEach((field) => delete reqQuery[field]);

  // creating query string
  let queryString = JSON.stringify(reqQuery);
  // creating ($gt ,$gte etc)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sort data by field
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const totalDocs = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamps = await query;

  // Pagination params
  let pagination = {};
  if (lastIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit
    };
  } else if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    msg: 'Successfully fetched bootcamps',
    data: bootcamps,
    count: bootcamps.length,
    pagination
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
