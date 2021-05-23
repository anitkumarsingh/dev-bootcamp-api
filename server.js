const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT;

const logger = (req, res, next) => {
  req.hello = 'Hello world!';
  console.log('middleware ran');
  next();
};

app.use(logger);

app.use('/api/v1/bootcamps', bootcamps);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
