const errorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId error
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new errorResponse(message, 404);
  }
  // Mongoose duplicate error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new errorResponse(message, 400);
  }
  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((i) => i.message);
    error = new errorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || 'Server error'
  });
};

module.exports = errorHandler;
