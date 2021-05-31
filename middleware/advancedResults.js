const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryString));
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
  const totalDocs = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);
  // executing query
  const results = await query;
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
  if (populate) {
    query = query.populate(populate);
  }

  res.advancedResults = {
    success: true,
    msg: 'Successfully fetched Resourses',
    count: results.length,
    pagination,
    data: results
  };
  next();
};
module.exports = advancedResults;
