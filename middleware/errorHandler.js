const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    msg: err.message
  });
};

module.exports = errorHandler;
