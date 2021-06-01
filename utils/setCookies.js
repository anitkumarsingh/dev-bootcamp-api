const sendTokenResponse = (model, statusCode, res, msg) => {
  console.log(model);
  const token = model.getSignedToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    msg,
    token
  });
};

module.exports = sendTokenResponse;
